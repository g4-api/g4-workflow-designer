/* global window, document, StateMachine, StateMachineSteps, sequentialWorkflowDesigner */

let _designer;
let _cache = {};
let _cacheKeys = [];
let _manifests = {};

/**
 * Converts a PascalCase string to a space-separated string.
 *
 * @param {string} str - The PascalCase string to convert.
 * @returns {string} - The converted space-separated string.
 */
function convertPascalToSpaceCase(str) {
	return str.replace(/([A-Z])/g, ' $1').trim();
}

function onRunClicked() {
	if (_designer.isReadonly()) {
		return;
	}
	if (!_designer.isValid()) {
		window.alert('The definition is invalid');
		return;
	}

	_designer.setIsReadonly(true);

	const definition = _designer.getDefinition();
	const sm = new StateMachine(definition, definition.properties['speed'], {
		executeStep: (step, data) => {
			if (step.type === 'text') {
				document.getElementById('console').innerText += step.properties['text'] + '\r\n';
				return;
			}

			const varName = step.properties['var'];
			const value = step.properties['val'];
			//createVariableIfNeeded(varName, data);
			switch (step.type) {
				case 'add':
					data[varName] += value;
					break;
				case 'sub':
					data[varName] -= value;
					break;
				case 'mul':
					data[varName] *= value;
					break;
				case 'div':
					data[varName] /= value;
					break;
			}
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

		onStepExecuted: (step, data) => {
			document.getElementById('variables').innerText = JSON.stringify(data, null, 2) + '\r\n';
			_designer.selectStepById(step.id);
			_designer.moveViewportToStep(step.id);
		},

		onFinished: () => {
			_designer.setIsReadonly(false);
		}
	});
	sm.start();
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
	const stage = StateMachineSteps.newG4Container('Stage', 'stage', {}, []);
	const job = StateMachineSteps.newG4Container('Job', 'job', {}, []);

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

	// Store the manifests and groups in global variables for later use.
	_manifests = manifests;

	// Store the cache in a global variable for later use.
	_cache = await g4Cliet.getCache();

	// Store the cache keys in a global variable for later use.
	_cacheKeys = Object.keys(_cache).map(key => key.toUpperCase());
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
	initialStep.properties["Argument"] = "Foo Bar";

	// Create a job container with the initial step inside.
	// 'G4™ Default Job' is the name, 'job' is the type, an empty object represents additional properties, and `[initialStep]` is the list of steps.
	let job = StateMachineSteps.newG4Container('G4™ Default Job', 'job', {}, [initialStep]);

	// Create a stage container with the job inside.
	// 'G4™ Default Stage' is the name, 'stage' is the type, and `[job]` represents the nested structure.
	let stage = StateMachineSteps.newG4Container('G4™ Default Stage', 'stage', {}, [job]);

	// Return the stage as an array, as the function expects to return a list of containers.
	return [stage];
}

function newConfiguration(manifestsGroups) {
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
			}
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
	// Create a span element as the container for the editor.
	const container = document.createElement('span');

	// Add a title to the container to indicate the configuration section.
	CustomFields.newTitle(container, 'Automation Settings', 'Flow Configuration');

	// Add a string input field for configuring the "Invocation Interval".
	CustomFields.newStringField(
		container,
		definition, 						   // Definition object
		'Invocation Interval (ms)',            // Field label
		'Time between each action invocation', // Field description
		definition.properties['speed'],        // Current value of the "speed" property
		isReadonly,                            // Read-only mode flag
		(value) => {
			// Update the "speed" property with the new value from the input.
			definition.properties['speed'] = parseInt(value, 10); // Ensure the value is an integer.
			editorContext.notifyPropertiesChanged();              // Notify the editor of the change.
		}
	);

	// Return the container with all added elements.
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
	// Create the main container element for the editor.
	const container = document.createElement('div');
	container.title = step.description; // Set tooltip text to the step's description.

	// Add a title element to the container.
	CustomFields.newTitle(container, step.name, step.pluginType, step.description);

	// Add a string input field for the plugin name.
	// This field is always read-only.
	CustomFields.newNameField(
		container,
		'Display Name',
		'A User-Friendly, Descriptive Label for This Input (Displayed in the Flow Designer)',
		step.name,
		false,
		(value) => {
			// Update the step's name and notify the editor of the change.
			step.name = value;
			editorContext.notifyNameChanged();
		}
	);

	// Iterate through the step's properties and add corresponding input fields.
	for (const key in step.properties) {
		const property = step.properties[key];
		const propertyName = property.name ? property.name.toUpperCase() : 'RULES';

		// Skip 'ARGUMENT' properties if parameters exist for the step.
		if (propertyName === 'RULES' || (propertyName === 'ARGUMENT' && step.parameters && Object.keys(step.parameters).length > 0)) {
			continue;
		}

		// Add a string input field for the property.
		CustomFields.newStringField(
			container,
			step,
			key,
			property.description,
			property.value,
			false,
			(value) => {
				// Update the step's properties and notify the editor of the change.
				property.value = value;
				editorContext.notifyPropertiesChanged();
			}
		);
	}

	// Iterate through the step's parameters and add corresponding input fields.
	for (const key in step.parameters) {
		const parameter = step.parameters[key];

		// Check if the parameter type is a list field or an options field.
		const isListField = _cacheKeys.includes(parameter.type.toUpperCase());
		const isOptionsField = parameter.optionsList && parameter.optionsList.length > 0;
		const isArray = parameter.type.toUpperCase() === 'ARRAY';

		// If the parameter is an array, create a new array field.
		if (isArray) {
			CustomFields.newArrayField(
				container,
				key,
				parameter.description,
				parameter.value,
				(value) => {
					// Update the property's value and notify the editor of the change.
					parameter.value = value;
					editorContext.notifyPropertiesChanged();
				}
			);

			// Continue to the next parameter.
			continue;
		}

		// If the parameter is a list field or an options field, create a dropdown.
		if (isListField || isOptionsField) {
			const itemsSource = isListField ? parameter.type : parameter.optionsList;
			CustomFields.newListField(
				container,
				key,
				parameter.description,
				parameter.value,
				itemsSource,
				(value) => {
					// Update the property's value and notify the editor of the change.
					parameter.value = value;
					editorContext.notifyPropertiesChanged();
				}
			);

			// Continue to the next parameter.
			continue;
		}

		// Add a string input field for the parameter.
		CustomFields.newStringField(
			container,
			step,
			key,
			parameter.description,
			parameter.value,
			false,
			(value) => {
				// Update the step's properties and notify the editor of the change.
				parameter.value = value;
				editorContext.notifyPropertiesChanged();
			}
		);
	}

	// Return the populated container element.
	return container;
}

// Initialize the designer when the window has loaded
window.addEventListener('load', () => {
	initializeDesigner();
});
