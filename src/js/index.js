/* global window, document, StateMachine, StateMachineSteps, sequentialWorkflowDesigner */

let _designer;
let _cache = {};
let _cacheKeys = [];
let _manifests = {};

async function onRunClicked() {
	if (_designer.isReadonly()) {
		return;
	}
	if (!_designer.isValid()) {
		window.alert('The definition is invalid');
		return;
	}

	_designer.setIsReadonly(true);

	const definition = _designer.getDefinition();

	let session = undefined;
	const client = new G4Client();
	const automation = client.newAutomation(undefined, undefined);

	const stateMachine = new StateMachine(definition, {
		executeStep: async (step, data) => {
			// Convert the step to a rule and prepare the automation configuration.
			const rule = client.convertToRule(step);
			const rules = [rule];

			// Assign the rules to the first job of the first stage.
			automation.stages[0].jobs[0].rules = rules;

			// Set driver parameters based on the session.
			automation.driverParameters = session === undefined
				? automation.driverParameters
				: { driver: `Id(${session})` };

			// Invoke the automation asynchronously and wait for the result.
			const automationResult = await client.invokeAutomation(automation);

			// Extract session information from the result.
			const responseKey = Object.keys(automationResult)[0];
			session = Object.keys(automationResult[responseKey].sessions)[0];
		},

		executeIf: (step, data) => {
			var varName = step.properties['var'];
			//createVariableIfNeeded(varName, data);
			return data[varName] > step.properties['val'];
		},

		initLoopStep: (step, data) => {
			const varName = step.properties['var'];
			//createVariableIfNeeded(varName, data);
			data[varName] = step.properties['val'];
		},

		canReplyLoopStep: (step, data) => {
			const varName = step.properties['var'];
			return --data[varName] >= 0;
		},

		beforeStepExecution: (step, data) => {
			document.getElementById('variables').innerText = JSON.stringify(data, null, 2) + '\r\n';
			_designer.selectStepById(step.id);
			_designer.moveViewportToStep(step.id);
		},
		// onStepExecuted: (step, data) => {
		// 	document.getElementById('variables').innerText = JSON.stringify(data, null, 2) + '\r\n';
		// 	_designer.selectStepById(step.id);
		// 	_designer.moveViewportToStep(step.id);
		// },

		onFinished: () => {
			_designer.setIsReadonly(false);
		}
	});
	stateMachine.start();
}

/**
 * Initializes the workflow designer with manifests, groups, and configurations.
 *
 * @async
 * @returns {Promise<void>} A promise that resolves once the designer is initialized.
 */
async function initializeDesigner() {
	// Create a new G4Client instance.
	const g4Cliet = new G4Client();

	// Fetch manifests and manifest groups from the G4Client.
	const manifests = await g4Cliet.getManifests();
	const manifestsGroups = await g4Cliet.getGroups();

	// Store the manifests and groups in global variables for later use.
	_manifests = manifests;

	// Store the cache in a global variable for later use.
	_cache = await g4Cliet.getCache();

	// Store the cache keys in a global variable for later use.
	_cacheKeys = Object.keys(_cache).map(key => key.toUpperCase());

	// Get the HTML element where the designer will be rendered.
	const designerHtmlElement = document.getElementById('designer');

	// Initialize the workflow's starting definition with the "WriteLog" manifest.
	const initalState = initializeStartDefinition(manifests["WriteLog"]);

	// Create a new start definition object.
	const startDefinition = newStartDefinition(initalState);

	// Initialize a new configuration for the workflow designer.
	const configuration = newConfiguration();

	// Initialize an array to hold all groups.
	const groups = [];

	// Process each manifest group to create the groups for the designer.
	for (const [groupName, manifestsGroup] of Object.entries(manifestsGroups)) {
		// Retrieve the manifests from the group, or default to an empty array.
		const manifests = manifestsGroup.manifests ? manifestsGroup.manifests : [];

		// Create a group object with its name and steps.
		const group = {
			name: groupName,
			steps: []
		};

		// Convert each manifest into a step and add it to the group.
		for (const manifest of manifests) {
			const step = StateMachineSteps.newG4Step(manifest);
			group.steps.push(step);
		}

		// Add the group to the array of groups.
		groups.push(group);
	}

	// Retrieve or create the "Containers" group in the configuration toolbox.
	let containers = groups.find(group => group.name === 'Containers');
	let containersGroup = containers ? containers : { name: 'Containers', steps: [] };

	// Create default container types for "Stage" and "Job".
	const stage = StateMachineSteps.newG4Stage('Stage', {}, {}, []);
	const job = StateMachineSteps.newG4Job('Job', {}, {}, []);

	// Add the containers to the "Containers" group.
	containersGroup.steps.push(...[stage, job]);

	// If "Containers" group doesn't exist, add it to the groups array.
	if (!containers) {
		groups.push(containersGroup);
	}

	// Sort groups alphabetically by name.
	let sortedGroups = groups.sort((a, b) => a.name.localeCompare(b.name));

	// Sort steps within each group alphabetically by name.
	for (const group of sortedGroups) {
		let sortedSteps = group.steps.sort((a, b) => a.name.localeCompare(b.name));
		group.steps = sortedSteps;
	}

	// Update the configuration toolbox with the sorted groups.
	configuration.toolbox.groups = sortedGroups;

	// Create the workflow designer using the configuration and start definition.
	_designer = sequentialWorkflowDesigner.Designer.create(designerHtmlElement, startDefinition, configuration);

	// Attach an event listener to the "Run" button for executing workflows.
	document.getElementById('run').addEventListener('click', onRunClicked);
}

/**
 * Initializes the default start definition for a state machine workflow.
 *
 * @param {Object} manifest - The manifest object containing necessary metadata for the state machine steps.
 * @returns {Array} An array containing the top-level container (`stage`) with its nested structure.
 */
function initializeStartDefinition(manifest) {
	// Create the initial step using the manifest.
	let initialStep = StateMachineSteps.newG4Step(manifest);

	// Set a default value for the "Argument" property of the initial step.
	initialStep.properties["Argument"]["value"] = "Foo Bar";

	// Create a job container with the initial step inside.
	// 'G4™ Default Job' is the name, 'job' is the type, an empty object represents additional properties, and `[initialStep]` is the list of steps.
	let job = StateMachineSteps.newG4Job('G4™ Default Job', {}, {}, [initialStep]);

	// Create a stage container with the job inside.
	// 'G4™ Default Stage' is the name, 'stage' is the type, and `[job]` represents the nested structure.
	let stage = StateMachineSteps.newG4Stage('G4™ Default Stage', {}, {}, [job]);

	// Return the stage as an array, as the function expects to return a list of containers.
	return [stage];
}

function newConfiguration() {
	return {
		undoStackSize: 5,

		toolbox: {
			groups: [],

			// Custom item template function
			itemProvider: (step) => {
				const item = document.createElement('div');
				item.className = 'sqd-toolbox-item';

				// Set the tooltip using the 'title' attribute
				if (step.description) {
					item.title = step.description;
				}

				// Create the icon element
				const icon = document.createElement('img');
				icon.className = 'sqd-toolbox-item-icon';
				icon.src = newConfiguration.steps.iconUrlProvider(step.componentType, step.type);

				// Create the name element
				const name = document.createElement('div');
				name.className = 'sqd-toolbox-item-name';
				name.textContent = step.name;

				// Append the icon and name to the item container
				item.appendChild(icon);
				item.appendChild(name);

				return item;
			}
		},

		steps: {
			iconUrlProvider: (componentType, type) => {
				const supportedIcons = ['if', 'loop', 'text', 'job', 'stage'];
				const fileName = supportedIcons.includes(type) ? type : 'task';
				return `./images/icon-${fileName}.svg`;
			},
			// canInsertStep: (step, _, container, a, b, c, d) => {
			// 	var a = designer;
			// 	var b = "";
			// }
		},

		validator: {
			step: step => {
				return Object.keys(step.properties).every(n => !!step.properties[n]);
			},
			root: definition => {
				return definition.properties['speed'] > 0;
			}
		},

		editors: {
			rootEditorProvider,
			stepEditorProvider
		},

		controlBar: true
	};
}

/**
 * Creates a new start definition object for a workflow with default properties.
 *
 * @param {Array} sequence - The sequence of steps or containers to include in the start definition.
 * @returns {Object} An object representing the start definition, containing default properties and the provided sequence.
 */
function newStartDefinition(sequence) {
	//const manifest = {};
	//var step = StateMachineSteps.newG4Step(_manifests["WriteLog"]);

	return {
		id: uid(),
		// Default properties for the start definition.
		properties: {
			speed: 300 // Default speed value (can be adjusted as needed).
		},
		// The provided sequence of steps or containers.
		sequence
	};
}

/**
 * Provides an editor interface for the root configuration of the workflow.
 *
 * @param {Object}  definition    - The definition object containing the properties and settings for the workflow.
 * @param {Object}  editorContext - Context object for notifying changes to the editor.
 * @param {boolean} isReadonly    - Flag indicating if the editor should be in read-only mode.
 * @returns {HTMLElement} A container element housing the root editor fields.
 */
function rootEditorProvider(definition, editorContext, isReadonly) {
	// Create the main container div element for the root editor.
	const container = document.createElement('div');
	container.setAttribute("g4-role", "root-editor");

	// Add a title to the container to indicate the configuration section.
	CustomFields.newTitle({
		container: container,
		helpText: 'Configure the automation settings for the flow.',
		subTitleText: 'Flow Configuration',
		titleText: 'Automation Settings'
	});

	// Add a string input field for configuring the "Invocation Interval".
	CustomFields.newStringField(
		{
			container: container,
			initialValue: definition.properties['speed'],
			isReadonly: isReadonly,
			label: 'Invocation Interval (ms)',
			title: 'Time between each action invocation'
		},
		(value) => {
			// Update the "speed" property with the new value from the input.
			definition.properties['speed'] = parseInt(value, 10); // Ensure the value is an integer.
			editorContext.notifyPropertiesChanged();
		}
	);

	// Add an authentication field for providing G4 credentials to allow automation requests.
	CustomG4Fields.newAuthenticationField(
		{
			container: container,
			label: "Authentication",
			title: "Provide G4™ credentials to allow automation requests.",
			initialValue: definition.properties['authentication']
		},
		(value) => {
			// Ensure the "authentication" property exists in the definition.
			definition.properties['authentication'] = definition.properties['authentication'] || {};

			// Update the "authentication" property with the new values from the input.
			for (const key of Object.keys(value)) {
				definition.properties['authentication'][key] = value[key];
			}

			// Notify the editor of the updated properties.
			editorContext.notifyPropertiesChanged();
		}
	);

	// Add a data source field for configuring the G4 data source settings.
	CustomG4Fields.newDataSourceField(
		{
			container: container,
			label: "Data Source",
			title: "Provide G4™ data source to configure the automation.",
			initialValue: definition.properties['dataSource']
		},
		(value) => {
			// Ensure the "dataSource" property exists in the definition.
			definition.properties['dataSource'] = definition.properties['dataSource'] || {};

			// Update the "dataSource" property with the new values from the input.
			for (const key of Object.keys(value)) {
				definition.properties['dataSource'][key] = value[key];
			}

			// Notify the editor of the updated properties.
			editorContext.notifyPropertiesChanged();
		}
	);

	// Add a driver parameters field for configuring the G4 driver parameters.
	CustomG4Fields.newDriverParametersField(
		{
			container: container,
			label: "Driver Parameters",
			title: "Provide G4™ driver parameters to configure the automation.",
			initialValue: definition.properties['driverParameters']
		},
		(value) => {
			// Ensure the "driverParameters" property exists in the definition.
			definition.properties['driverParameters'] = definition.properties['driverParameters'] || {};

			// Update the "driverParameters" property with the new values from the input.
			for (const key of Object.keys(value)) {
				definition.properties['driverParameters'][key] = value[key];
			}

			// Notify the editor of the updated properties.
			editorContext.notifyPropertiesChanged();
		}
	);

	// Add an automation settings field for configuring the automation settings.
	CustomG4Fields.newAutomationSettingsField(
		{
			container: container,
			label: "G4™ Automation Settings",
			title: "Provide G4™ automation settings to configure the automation.",
			initialValue: definition.properties['automationSettings']
		},
		(value) => {
			// Ensure the "automationSettings" property exists in the definition.
			definition.properties['automationSettings'] = definition.properties['automationSettings'] || {};

			// Update the "automationSettings" property with the new values from the input.
			for (const key of Object.keys(value)) {
				definition.properties['automationSettings'][key] = value[key];
			}

			// Notify the editor of the updated properties.
			editorContext.notifyPropertiesChanged();
		}
	);

	// Add an environment settings field for configuring the G4 environment settings.
	CustomG4Fields.newEnvironmentSettingsField(
		{
			container: container,
			label: "G4™ Environment Settings",
			title: "Provide G4™ environment settings to configure the automation.",
			initialValue: definition.properties['environmentSettings']
		},
		(value) => {
			// Ensure the "environmentSettings" property exists in the definition.
			definition.properties['environmentSettings'] = definition.properties['environmentSettings'] || {};

			// Update the "authentication" property with the new values from the input.
			for (const key of Object.keys(value)) {
				definition.properties['environmentSettings'][key] = value[key];
			}

			// Notify the editor of the updated properties.
			editorContext.notifyPropertiesChanged();
		}
	);

	// Add an exceptions settings field for configuring the G4 exceptions settings.
	CustomG4Fields.newExceptionsSettingsField(
		{
			container: container,
			label: "G4™ Exceptions Settings",
			title: "Provide G4™ exceptions settings to configure the automation.",
			initialValue: definition.properties['exceptionsSettings']
		},
		(value) => {
			// Ensure the "exceptionsSettings" property exists in the definition.
			definition.properties['exceptionsSettings'] = definition.properties['exceptionsSettings'] || {};

			// Update the "exceptionsSettings" property with the new values from the input.
			for (const key of Object.keys(value)) {
				definition.properties['exceptionsSettings'][key] = value[key];
			}

			// Notify the editor of the updated properties.
			editorContext.notifyPropertiesChanged();
		}
	);

	// Add a queue manager settings field for configuring the G4 queue manager settings.
	CustomG4Fields.newQueueManagerSettingsField(
		{
			container: container,
			label: "G4™ Queue Manager Settings",
			title: "Provide G4™ queue manager settings to configure the automation.",
			initialValue: definition.properties['queueManagerSettings']
		},
		(value) => {
			// Ensure the "queueManagerSettings" property exists in the definition.
			definition.properties['queueManagerSettings'] = definition.properties['queueManagerSettings'] || {};

			// Update the "queueManagerSettings" property with the new values from the input.
			for (const key of Object.keys(value)) {
				definition.properties['queueManagerSettings'][key] = value[key];
			}

			// Notify the editor of the updated properties.
			editorContext.notifyPropertiesChanged();
		}
	);

	// Add a performance points settings field for configuring the G4 performance points settings.
	CustomG4Fields.newPerformancePointsSettingsField(
		{
			container: container,
			label: "G4™ Performance Points Settings",
			title: "Provide G4™ performance points settings to configure the automation.",
			initialValue: definition.properties['performancePointsSettings']
		},
		(value) => {
			// Ensure the "performancePointsSettings" property exists in the definition.
			definition.properties['performancePointsSettings'] = definition.properties['performancePointsSettings'] || {};

			// Update the "performancePointsSettings" property with the new values from the input.
			for (const key of Object.keys(value)) {
				definition.properties['performancePointsSettings'][key] = value[key];
			}

			// Notify the editor of the updated properties.
			editorContext.notifyPropertiesChanged();
		}
	);

	// Add a plugins settings field for configuring the G4 plugins settings.
	CustomG4Fields.newPluginsSettingsField(
		{
			container: container,
			label: "G4™ Plugins Settings",
			title: "Provide G4™ plugins settings to configure the automation.",
			initialValue: definition.properties['pluginsSettings']
		},
		(value) => {
			// Initialize pluginsSettings if it doesn't exist
			definition.properties['pluginsSettings'] = definition.properties['pluginsSettings'] || {
				externalRepositories: {},
				forceRuleReference: false
			};

			// Reference to the current plugins settings
			const pluginsSettings = definition.properties['pluginsSettings'];

			// Get all keys from the incoming value
			const indexes = Object.keys(value) || [];

			// Iterate over each index in the incoming value
			for (const index of indexes) {
				const property = value[index];

				// If the property is not an object, set the pluginsSettings to the property
				if (!assertObject(property)) {
					pluginsSettings[index] = property;
					continue;
				}

				// If the property is null or undefined, delete the property from the definition
				// This is done to ensure that the property is not set to null or undefined
				// as it would be set to null or undefined in the definition
				if (!property) {
					delete value[index];
					continue;
				}

				// Iterate over each key within the current property
				for (const key of Object.keys(property)) {
					const propertyValue = property[key];
					const propertyKeys = Object.keys(propertyValue) || [];

					// Iterate over each property key to set the corresponding pluginsSettings
					for (const propertyKey of propertyKeys) {
						pluginsSettings[key] = pluginsSettings[key] || {};
						pluginsSettings[key][index] = pluginsSettings[key][index] || {};
						pluginsSettings[key][index][propertyKey] = property[key][propertyKey];
					}
				}
			}

			// Update the definition with the new plugins settings
			definition.properties['pluginsSettings'] = pluginsSettings;

			// Notify the editor that the properties have changed
			editorContext.notifyPropertiesChanged();
		}
	);

	// Add a screenshots settings field for configuring the G4 screenshots settings.
	CustomG4Fields.newScreenshotsSettingsField(
		{
			container: container,
			label: "G4™ Screenshots Settings",
			title: "Provide G4™ screenshots settings to configure the automation.",
			initialValue: definition.properties['screenshotsSettings']
		},
		(value) => {
			// Ensure the "screenshotsSettings" property exists in the definition.
			definition.properties['screenshotsSettings'] = definition.properties['screenshotsSettings'] || {};

			// Update the "screenshotsSettings" property with the new values from the input.
			for (const key of Object.keys(value)) {
				definition.properties['screenshotsSettings'][key] = value[key];
			}

			// Notify the editor of the updated properties.
			editorContext.notifyPropertiesChanged();
		}
	);

	// Return the fully constructed container with all added elements.
	return container;
}

/**
 * Provides an editor interface for a step within a workflow or plugin.
 * 
 * @param {Object} step          - The step object to be edited, containing properties and parameters.
 * @param {Object} editorContext - Context object for notifying changes in the editor.
 * @param {Object} _definition   - Definition object for the step (unused in this implementation).
 * @returns {HTMLElement} The container element housing the editor fields for the step.
 */
function stepEditorProvider(step, editorContext, _definition) {
	function initializeField(key, step, type) {
		let parameter = {}
		if (type === 'properties') {
			parameter = step.properties[key];
		} else if (type === 'parameters') {
			parameter = step.parameters[key];
		}

		// Check if the parameter type is a list field or an options field.
		const isListField = _cacheKeys.includes(parameter.type.toUpperCase());
		const isOptionsField = parameter.optionsList && parameter.optionsList.length > 0;
		const isArray = parameter.type.toUpperCase() === 'ARRAY';
		const isSwitch = parameter.type.toUpperCase() === 'SWITCH' || parameter.type.toUpperCase() === 'BOOLEAN' || parameter.type.toUpperCase() === 'BOOL';
		const isKeyValue = parameter.type.toUpperCase() === 'KEY/VALUE' || parameter.type.toUpperCase() === 'KEYVALUE' || parameter.type.toUpperCase() === 'DICTIONARY';

		if (isKeyValue) {
			CustomFields.newKeyValueField(
				{
					container: container,
					initialValue: parameter.value,
					label: key,
					title: parameter.description
				},
				(value) => {
					// Update the property's value and notify the editor of the change.
					parameter.value = value;
					editorContext.notifyPropertiesChanged();
				}
			);

			// Exit the function after creating the key/value field.
			return;
		}

		// If the parameter is a switch, create a new switch field.
		if (isSwitch) {
			CustomFields.newSwitchField(
				{
					container: container,
					initialValue: parameter.value,
					label: key,
					title: parameter.description
				},
				(value) => {
					// Update the property's value and notify the editor of the change.
					parameter.value = value;
					editorContext.notifyPropertiesChanged();
				}
			);

			// Exit the function after creating the switch field.
			return;
		}

		// If the parameter is an array, create a new array field.
		if (isArray) {
			CustomFields.newArrayField(
				{
					container: container,
					initialValue: parameter.value,
					label: key,
					title: parameter.description
				},
				(value) => {
					// Update the property's value and notify the editor of the change.
					parameter.value = value;
					editorContext.notifyPropertiesChanged();
				}
			);

			// Exit the function after creating the array field.
			return;
		}

		// If the parameter is a list field or an options field, create a dropdown.
		if (isListField || isOptionsField) {
			const itemSource = isListField ? parameter.type : parameter.optionsList;
			CustomFields.newDataListField(
				{
					container: container,
					initialValue: parameter.value,
					itemSource: itemSource,
					label: key,
					title: parameter.description
				},
				(value) => {
					// Update the property's value and notify the editor of the change.
					parameter.value = value;
					editorContext.notifyPropertiesChanged();
				}
			);

			// Exit the function after creating the data list field.
			return;
		}

		// Add a string input field for the parameter.
		CustomFields.newStringField(
			{
				container: container,
				initialValue: parameter.value,
				isReadonly: false,
				label: key,
				title: parameter.description
			},
			(value) => {
				// Update the step's properties and notify the editor of the change.
				parameter.value = value;
				editorContext.notifyPropertiesChanged();
			}
		);
	}

	// Create the main container element for the editor.
	const container = document.createElement('div');
	container.title = step.description; // Set tooltip text to the step's description.

	// Add a title element to the container.
	CustomFields.newTitle({
		container: container,
		titleText: convertPascalToSpaceCase(step.pluginName),
		subTitleText: step.pluginType,
		helpText: step.description
	});

	// Add a string input field for the plugin name.
	// This field is always read-only.
	CustomFields.newNameField(
		{
			container: container,
			initialValue: step.name,
			isReadonly: false,
			label: 'Plugin Name',
			title: 'The name of the plugin',
			step: step
		},
		(value) => {
			// Update the step's name and notify the editor of the change.
			step.name = value;
			editorContext.notifyNameChanged();
		}
	);

	// Iterate through the step's properties and add corresponding input fields.
	const sortedProperties = Object.keys(step.properties).sort((a, b) => a.localeCompare(b));
	for (let index = 0; index < sortedProperties.length; index++) {
		const key = sortedProperties[index];
		initializeField(key, step, "properties");
	}

	// Iterate through the step's parameters and add corresponding input fields.
	const sortedParameters = Object.keys(step.parameters).sort((a, b) => a.localeCompare(b));
	for (let index = 0; index < sortedParameters.length; index++) {
		const key = sortedParameters[index];
		initializeField(key, step, "parameters");
	}

	// Return the populated container element.
	return container;
}

// Initialize the designer when the window has loaded
window.addEventListener('load', () => {
	initializeDesigner();
});
