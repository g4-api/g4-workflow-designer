/**
 * Parses a given string and converts it to its corresponding boolean value.
 *
 * The function recognizes the following case-insensitive string representations:
 * - `'true'`, `'1'`, `'yes'`, `'y'`, `'on'` → `true`
 * - `'false'`, `'0'`, `'no'`, `'n'`, `'off'` → `false`
 *
 * If the input string does not match any recognized boolean representations,
 * the function returns `null` to indicate an unparseable value.
 *
 * @param {string} str - The string to parse into a boolean.
 * @returns {boolean|null} - The parsed boolean value or `null` if parsing fails.
 *
 * @example
 * parseStringToBool('true');   // returns true
 * parseStringToBool('FALSE');  // returns false
 * parseStringToBool('Yes');    // returns true
 * parseStringToBool('no');     // returns false
 * parseStringToBool('1');      // returns true
 * parseStringToBool('0');      // returns false
 * parseStringToBool('maybe');  // returns null
 */
function convertStringToBool(str) {
    if (typeof str !== 'string') {
        console.warn(`parseStringToBool: Expected a string but received type '${typeof str}'.`);
        return null;
    }

    // Trim whitespace and convert the string to lowercase for case-insensitive comparison
    const normalizedStr = str.trim().toLowerCase();

    // Define mappings of string representations to boolean values
    const trueValues = ['true', '1', 'yes', 'y', 'on'];
    const falseValues = ['false', '0', 'no', 'n', 'off'];

    if (trueValues.includes(normalizedStr)) {
        return true;
    } else if (falseValues.includes(normalizedStr)) {
        return false;
    } else {
        console.warn(`parseStringToBool: Unable to parse '${str}' to a boolean.`);
        return null;
    }
}

/**
 * Creates a new field container with a labeled input and a hint icon.
 *
 * @param {string} id               - The unique identifier for the input field. This should match the `id` of the corresponding input element.
 * @param {string} labelDisplayName - The display text for the label associated with the input field.
 * @param {string} hintText         - The hint text to display when the hint icon is clicked.
 * @returns {HTMLDivElement} The created `div` element containing the labeled input and hint icon.
 *
 * @example
 * // Create a new field container and append it to a form
 * const form = document.getElementById('userForm');
 * const field = newFieldContainer('username', 'Username');
 * form.appendChild(field);
 */
const newFieldContainer = (id, labelDisplayName, hintText) => {
    /**
     * Toggles a hint text element inside a specified container.
     * If the hint text element already exists, it is removed. Otherwise, a new one is created and added.
     *
     * @param {HTMLElement} hintContainer - The parent container where the hint text will be toggled.
     * @param {string}      hintText      - The text to display inside the hint element.
     */
    const switchHint = (hintContainer, hintText) => {
        // Escape the ID of the container to ensure it can be safely used in a CSS selector.
        const escapedId = CSS.escape(hintContainer.id);

        // Query for an existing hint text element within the hintContainer.
        let hintElement = document.querySelector(`#${escapedId} > div.hint-text`);

        // If the hint text element already exists, remove it and exit the function.
        if (hintElement) {
            hintElement.remove();
            return;
        }

        // Create a new hint text element if it doesn't already exist.
        hintElement = document.createElement('div');
        hintElement.classList.add('hint-text'); // Add the 'hint-text' class for styling.
        hintElement.innerHTML = hintText;       // Set the provided hint text as the content.

        // Append the newly created hint text element to the hintContainer.
        hintContainer.appendChild(hintElement);
    };

    // Create a new `div` element to serve as the container for the label and hint icon
    const titleContainer = document.createElement('div');
    const labelContainer = document.createElement('div');
    const hintContainer = document.createElement('div');
    const controllerContainer = document.createElement('div');

    // Set the data-g4-role attribute to 'field' for the field container
    titleContainer.setAttribute('data-g4-role', 'field');
    titleContainer.id = `${id}-field`;

    // Set the data-g4-role attribute to 'label' for the label container
    labelContainer.setAttribute('data-g4-role', 'label');
    labelContainer.id = `${id}-label`;

    // Set the data-g4-role and id attributes to for the hint container
    hintContainer.setAttribute('data-g4-role', 'hint');
    hintContainer.id = `${id}-hint`;

    // Set data-g4-role attribute to 'controller' for the controller container
    controllerContainer.setAttribute('data-g4-role', 'controller');
    controllerContainer.id = `${id}-controller`;

    // Create a new `label` element
    const labelElement = document.createElement('label');
    labelElement.htmlFor = id;
    labelElement.classList.add('label-with-icon');

    // Create a new `span` element to serve as the hint icon
    const iconElement = document.createElement('span');
    iconElement.id = `${id}-icon`;
    iconElement.classList.add('hint-icon-container');
    iconElement.tabIndex = 0;
    iconElement.title = 'More Information';
    iconElement.setAttribute('role', 'img');
    iconElement.setAttribute('aria-label', 'More Information');

    /**
     * Replace the initially created empty `label` element with a more complex structure
     * using `outerHTML`. This includes the label text and a hint icon with an SVG.
     *
     * Note:
     * - `for` attribute links the label to the input element with the corresponding `id`.
     * - The `hint-icon-container` is interactive, indicated by `tabindex="0"`, allowing keyboard navigation.
     * - `role="img"` and `title` provide accessibility enhancements.
     */
    const labelText = `<span class="label-text">${labelDisplayName}</span></label>`;
    const svg = `
        <svg viewBox="0 -960 960 960" class="hint-icon" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M419-334q1-87 20.5-129t65.5-76q39-31 57.5-61.109T581-666q0-39-25.5-64.5T486-756q-46 0-75 26t-43 67l-120-52q27-74 87-120.5T485.756-882q109.228 0 168.236 62.148Q713-757.703 713-669q0 60-21 105.5T625-478q-46 40-57 65.5T557-334H419Zm66.788 282Q447-52 420-79t-27-65.496q0-38.495 26.92-65.5Q446.841-237 485.92-237 525-237 552-209.996q27 27.005 27 65.5Q579-106 551.788-79q-27.213 27-66 27Z"></path>
        </svg>`;

    labelElement.insertAdjacentHTML('beforeend', labelText);
    iconElement.insertAdjacentHTML('beforeend', svg);

    // Add event listener to the icon element to toggle the hint text
    iconElement.addEventListener('click', () => switchHint(hintContainer, hintText));

    // Append the icon, label, and hint elements to the field container
    labelElement.appendChild(iconElement);
    labelContainer.appendChild(labelElement);
    titleContainer.appendChild(labelContainer);
    titleContainer.appendChild(hintContainer);
    titleContainer.appendChild(controllerContainer);

    // Return the fully constructed `titleContainer` div
    return titleContainer;
};

/**
 * Creates a new unlabeled field container with a controller for the G4 Automation Sequence.
 *
 * This function generates a structured HTML `div` element that serves as a container for
 * automation fields. It includes a controller sub-container, which is designated by the
 * `data-g4-role="controller"` attribute. The main container is marked with `data-g4-role="field"`.
 *
 * @param {string} id   - A unique identifier used to assign IDs to the field and controller containers.
 * @param {string} role - The role of the container
 * @returns {HTMLDivElement} - The constructed field container element containing the controller.
 *
 * @example
 * const container = newUnlabeledFieldContainer('uniqueId123');
 * document.body.appendChild(container);
 * // This will append the following HTML structure to the body:
 * // <div data-g4-role="field" id="uniqueId123-field">
 * //   <div data-g4-role="controller" id="uniqueId123-controller"></div>
 * // </div>
 */
const newUnlabeledFieldContainer = (id, role) => {
    // Create the main field container div element.
    const fieldContainer = document.createElement('div');

    // Create the controller sub-container div element.
    const controllerContainer = document.createElement('div');

    // Set the custom attribute 'data-g4-role' to 'field' for the main container.
    fieldContainer.setAttribute('data-g4-role', 'field');

    // Assign a unique ID to the main field container using the provided 'id'.
    fieldContainer.id = `${id}-field`;

    // Set the custom attribute 'data-g4-role' to 'controller' for the controller container.
    controllerContainer.setAttribute('data-g4-role', role || 'controller');

    // Assign a unique ID to the controller container using the provided 'id'.
    controllerContainer.id = `${id}-${role || 'controller'}`;

    // Append the controller container as a child of the main field container.
    fieldContainer.appendChild(controllerContainer);

    // Return the fully constructed field container element.
    return fieldContainer;
};

/**
 * Creates a new multiple fields container with a collapsible section for the G4 Automation Sequence.
 *
 * This function generates a structured HTML `details` element that includes a `summary` for the label
 * and a content area containing an unlabeled field container. The resulting structure allows users
 * to expand or collapse the section to view or hide multiple input fields.
 *
 * @param {string} id               - A unique identifier used to assign IDs to the field container and its controller.
 * @param {string} labelDisplayName - The text to display in the summary section, serving as the label for the container.
 * @param {string} hintText         - The tooltip text that appears when hovering over the summary label.
 * @param {string} role             - The role of the container
 * @returns {HTMLDetailsElement} - The constructed `details` container element containing the summary and field container.
 *
 * @example
 * const container = newMultipleFieldsContainer('uniqueId123', 'User Details', 'Click to expand and view user details');
 * document.body.appendChild(container);
 * // This will append the following HTML structure to the body:
 * // <details>
 * //   <summary title="Click to expand and view user details">User Details</summary>
 * //   <div>
 * //     <div data-g4-role="field" id="uniqueId123-field">
 * //       <div data-g4-role="controller" id="uniqueId123-controller"></div>
 * //     </div>
 * //   </div>
 * // </details>
 */
const newMultipleFieldsContainer = (id, labelDisplayName, hintText, role) => {
    // Create the main <details> container element.
    const detailsContainer = document.createElement('details');

    // Create the <summary> element that serves as the clickable label.
    const summaryContainer = document.createElement('summary');

    // Create an unlabeled field container using the provided 'id'.
    const fieldContainer = newUnlabeledFieldContainer(id, role);

    // Set the display text of the summary label.
    summaryContainer.textContent = labelDisplayName;

    // Set the tooltip text for the summary label.
    summaryContainer.title = labelDisplayName;

    // Append the summary and content containers to the main <details> container.
    detailsContainer.appendChild(summaryContainer);
    detailsContainer.appendChild(fieldContainer);

    // Return the fully constructed <details> container.
    return detailsContainer;
};

/**
 * Creates and appends a new Object Array Fields container to the specified parent container.
 *
 * This container includes functionality to add new array items dynamically and initializes
 * existing array items based on provided data objects. Each array item can be removed,
 * and changes are communicated via the provided callback function.
 *
 * @param {string}        id                        - The unique identifier for the container.
 * @param {Object}        options                   - Configuration options for the container.
 * @param {string}        options.labelDisplayName  - The display name for the container label.
 * @param {string}        options.title             - The title attribute for the container, typically used for tooltips.
 * @param {string}        options.role              - The role attribute for the container, used for identifying elements.
 * @param {string}        options.addButtonLabel    - The label for the "Add" button.
 * @param {string}        options.removeButtonLabel - The label for the "Remove" button.
 * @param {Array<Object>} options.dataObjects       - An array of data objects to initialize the container with.
 * @param {string}        [options.groupName]       - The group name used for property normalization.
 * @param {Function}      setCallback - A callback function invoked whenever the container is modified.
 * @returns {HTMLElement} - The DOM element representing the Object Array Fields container.
 */
const newObjectArrayFieldsContainer = (id, options, setCallback) => {
    /**
     * Creates a new array object container with dynamic properties and a remove button.
     *
     * @param {Object}   dataObject  - The data object containing properties for the array item.
     * @param {number}   index       - The index of the array item.
     * @param {string}   mode        - The mode of the form, e.g., 'NEW' or 'EDIT'.
     * @param {Function} setCallback - A callback function invoked when the array item is modified or removed.
     * @returns {HTMLElement} - The DOM element representing the array item container.
     */
    const newArrayObject = (dataObject, index, mode, setCallback) => {
        // Generate a unique key based on the index.
        const indexKey = `${index}`;

        // Create a container for the array item with a unique identifier and label.
        const arrayContainer = newMultipleFieldsContainer(`${id}-${index}`, `${options.itemLabel} ${index}`, "Foo Bar", "array-item-container");

        // Select the sub-container designated for array item properties.
        const itemContainer = arrayContainer.querySelector(`[data-g4-role="array-item-container"]`);

        // Select the summary element to position the remove button.
        const summaryContainer = arrayContainer.querySelector('summary');

        // Retrieve all property keys from the data object.
        const keys = Object.keys(dataObject);

        // Create and configure the remove button.
        const buttonController = document.createElement('button');
        buttonController.type = 'button';
        buttonController.textContent = `${options.removeButtonLabel}`;
        buttonController.style = "margin-top: 1em;";
        buttonController.onclick = () => {
            controllerContainer.removeChild(arrayContainer);
            setCallback({
                [indexKey]: null
            });
        };

        // Create a container for the remove button and append the button to it.
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('text-with-button');
        buttonContainer.appendChild(buttonController);

        // Insert the remove button container after the summary element.
        summaryContainer.after(buttonContainer);

        // Iterate over each key in the data object to create corresponding property fields.
        for (const key of keys) {
            const property = dataObject[key];
            const propertyOptions = {
                groupName: options?.groupName,
                fieldName: key,
                property: property,
                mode: mode
            };
            newArrayProperty(itemContainer, propertyOptions, index, setCallback);
        }

        // Return the fully constructed array item container.
        return arrayContainer;
    };

    /**
     * Creates and appends a new property field within an array item container based on the property type.
     *
     * @param {HTMLElement} container   - The container element where the property field will be appended.
     * @param {Object}      options     - Configuration options for the property field.
     * @param {number}      index       - The index of the array item.
     * @param {Function}    setCallback - A callback function invoked when the property value changes.
     */
    const newArrayProperty = (container, options, index, setCallback) => {
        /**
         * Handles the callback for property value changes, updating the corresponding data structure.
         *
         * @param {*} value - The new value of the property.
         * @param {Function} setCallback - The callback function to update the state.
         */
        const propertyCallback = (value, setCallback) => {
            const data = {};
            const normalizedGroupName = convertToCamelCase(options.groupName);
            const indexKey = `${index}`;

            // Initialize the group object if it doesn't exist.
            data[normalizedGroupName] = data[normalizedGroupName] || {};

            // Update the specific field within the group.
            data[normalizedGroupName][options.fieldName] = value;

            // Invoke the callback with the updated data.
            setCallback({
                [indexKey]: data
            });
        };

        // Determine the type of the property and set default values if necessary.
        const type = options.property.type?.toLocaleUpperCase() || 'STRING';
        const label = options.property?.label || 'NameNotAvailable';
        const title = options.property?.title || 'Help text not available';
        const mode = options?.mode || 'NEW';

        // Create the appropriate input field based on the property type.
        switch (type) {
            case 'STRING':
                CustomFields.newStringField(
                    {
                        container: container,
                        initialValue: mode === 'NEW' ? null : options.property.value,
                        isReadonly: false,
                        label: label,
                        title: title
                    },
                    (value) => propertyCallback(value, setCallback)
                );
                break;
            case 'NUMBER':
                CustomFields.newNumberField(
                    {
                        container: container,
                        initialValue: mode === 'NEW' ? null : options.property.value,
                        isReadonly: false,
                        label: label,
                        step: 1,
                        title: title
                    },
                    (value) => propertyCallback(value, setCallback)
                );
                break;
            case 'KEYVALUE':
                CustomFields.newKeyValueField(
                    container,
                    label,
                    title,
                    mode === 'NEW' ? null : options.property.value,
                    (value) => propertyCallback(value, setCallback)
                );
                break;
            default:
                console.warn(`Unsupported property type: ${type}`);
                break;
        }
    };

    // Escape the unique identifier to ensure it's safe for use in CSS selectors.
    const escapedId = CSS.escape(id);

    // Create a container with multiple fields using the provided ID, label, title, and role.
    const fieldContainer = newMultipleFieldsContainer(id, options.labelDisplayName, options.title, options.role);

    // Select the controller sub-container within the field container using the escaped unique ID.
    const controllerContainer = fieldContainer.querySelector(`#${escapedId}-container`);

    // Select the summary element to position the add button appropriately.
    const summaryContainer = fieldContainer.querySelector('summary');

    // Create and configure the "Add" button.
    const buttonController = document.createElement('button');
    buttonController.type = 'button';
    buttonController.textContent = `${options.addButtonLabel}`;
    buttonController.style = "margin-top: 1em;";

    // Add an event listener to handle the addition of new array items.
    buttonController.addEventListener('click', () => {
        // Retrieve the schema for a new array item from the first data object.
        const schema = options?.dataObjects[0];

        // Determine the index for the new array item based on the current number of children.
        const index = controllerContainer.children.length;

        // Create a new array object container in 'NEW' mode.
        const arrayContainer = newArrayObject(schema, index, 'NEW', setCallback);

        // Append the newly created array container to the controller container.
        controllerContainer.appendChild(arrayContainer);
    });

    // Create a container for the "Add" button and append the button to it.
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('text-with-button');
    buttonContainer.appendChild(buttonController);

    // Insert the "Add" button container after the summary element.
    summaryContainer.after(buttonContainer);

    // Initialize existing array items based on the provided data objects.
    for (let index = 0; index < options.dataObjects.length; index++) {
        const dataObject = options.dataObjects[index];

        // Create a new array object container in 'ADD' mode for each existing data object.
        const arrayContainer = newArrayObject(dataObject, index, 'ADD', setCallback);

        // Append the array container to the controller container.
        controllerContainer.appendChild(arrayContainer);
    }

    // Return the fully constructed Object Array Fields container for further manipulation if needed.
    return fieldContainer;
}

/**
 * Generates a `<style>` block containing CSS styles scoped to a specific element by ID.
 *
 * @param {string} id - The unique identifier of the parent element to scope the styles.
 * @returns {string} A string containing a `<style>` tag with the defined CSS rules.
 *
 * @example
 * // To apply styles to an element with ID 'myComponent'
 * const styleElement = newLabelStyle('myComponent');
 * document.head.insertAdjacentHTML('beforeend', styleElement);
 */
newLabelStyle = (id) => {
    return `
        <style>
            /* Box-sizing Reset */
            *,
            *::before,
            *::after {
                box-sizing: border-box;
            }
    
            /* Flexbox Container for Label */
            #${id} label {
                display: flex;
                align-items: center;
                font-size: 16px;
            }
    
            /* SVG Icon Styling */
            #${id} .hint-icon-container {
                position: relative;
                margin-left: 5px;
                cursor: pointer;
                align-items: center;
                line-height: 1.3em;
                display: block;
                width: 18px;
                height: 18px;
                margin: 0 8px;
                border-radius: 50% 50%;
                text-align: center;
                font-size: 11px;
                cursor: pointer;
            }
    
            #${id} .hint-icon {
                line-height: 1.3em;
                text-align: center;
                font-size: 11px;
                cursor: pointer;
                width: 64%;
                height: 64%;
                margin: 18%;
            }
    
            /* Change icon color on hover/focus */
            #${id} .hint-icon-container:hover .hint-icon,
            #${id} .hint-icon-container:focus .hint-icon {
            }
        </style>`
};

/**
 * Generates a unique identifier (UID) as a hexadecimal string.
 *
 * @returns {string} A unique identifier generated by combining a random number and converting it to a hexadecimal string.
 */
newUid = () => Math.ceil(Math.random() * 10 ** 16).toString(16);

class CustomG4Fields {
    /**
     * Creates a new authentication field within the specified container for the G4 Automation Sequence.
     *
     * This function generates a structured set of input fields for providing G4 credentials,
     * specifically username and password. It utilizes the CustomFields utility to create
     * the input elements and sets up an event listener to handle input changes, invoking
     * the provided callback with the updated credential values.
     *
     * @param {HTMLElement} container    - The parent DOM element to which the authentication fields will be appended.
     * @param {string}      label        - The display label for the authentication section.
     * @param {string}      title        - The tooltip text providing additional information about the authentication fields.
     * @param {Object}      initialValue - An object containing the initial values for the authentication fields (e.g., { username: 'user', password: 'pass' }).
     * @param {Function}    setCallback  - A callback function that is invoked whenever the authentication fields are updated. It receives an object with the updated username and password.
     *
     * @example
     * const container = document.getElementById('auth-container');
     * const initialCredentials = { username: 'admin', password: 'secret' };
     * const handleAuthChange = (credentials) => {
     *     console.log('Updated Credentials:', credentials);
     * };
     *
     * newAuthenticationField(container, 'G4 Authentication', 'Provide G4 credentials to allow automation requests.', initialCredentials, handleAuthChange);
     */
    static newAuthenticationField(container, label, title, initialValue, setCallback) {
        // Generate a unique identifier for the authentication fields.
        const inputId = newUid();

        // Escape the unique identifier to ensure it's safe for use in CSS selectors.
        const id = CSS.escape(inputId);

        // Create a container with multiple fields (e.g., username and password) using the provided ID, label, and title.
        const fieldContainer = newMultipleFieldsContainer(inputId, label, title, 'container');

        // Select the controller sub-container within the field container using the unique ID.
        const controller = fieldContainer.querySelector(`#${id}-container`);

        // Create a new string input field for the "Username" with an empty initial value or the provided initial username.
        CustomFields.newStringField(
            {
                container: controller,
                initialValue: initialValue?.username || '',
                isReadonly: false,
                label: 'Username',
                title: 'A valid G4™ username required for authentication.'
            },
            (value) => {
                const authentication = {
                    username: value
                };
                setCallback(authentication);
            }
        );

        // Create a new string input field for the "Password" with an empty initial value or the provided initial password.
        CustomFields.newStringField(
            {
                container: controller,
                initialValue: initialValue?.password || '',
                isReadonly: false,
                label: 'Password',
                title: 'A valid G4™ password required for authentication.'
            },
            (value) => {
                const authentication = {
                    password: value
                };
                setCallback(authentication);
            }
        );

        // Append the controller container to the main field container.
        fieldContainer.appendChild(controller);

        // Append the fully constructed field container to the provided parent container in the DOM.
        container.appendChild(fieldContainer);

        // Return the field container for further manipulation if needed.
        return container;
    }

    /**
     * Creates and appends a new automation settings field to the specified container.
     *
     * This static method generates a structured set of input fields for configuring various
     * automation settings such as load timeout, maximum parallel executions, and response formats.
     * It utilizes the CustomFields utility to create input elements and sets up event listeners
     * to handle changes, invoking the provided callback with the updated settings.
     *
     * @param {HTMLElement} container    - The parent DOM element to which the automation settings fields will be appended.
     * @param {string}      label        - The display label for the automation settings section.
     * @param {string}      title        - The tooltip text providing additional information about the automation settings.
     * @param {Object}      initialValue - An object containing the initial values for the automation settings.
     * @param {Function} setCallback - A callback function that is invoked whenever the automation settings are updated. It receives an object with the updated settings.
     *
     * @example
     * // Assuming 'container' is a valid DOM element and 'setCallback' is a defined function
     * const initialSettings = {
     *     loadTimeout: 60000,
     *     maxParallel: 1,
     *     returnFlatResponse: false,
     *     returnStructuredResponse: false,
     *     searchTimeout: 15000
     * };
     *
     * newAutomationSettingsField(container, 'Automation Settings', 'Configure various automation parameters.', initialSettings, (updatedSettings) => {
     *     console.log('Automation settings updated:', updatedSettings);
     * });
     */
    static newAutomationSettingsField(container, label, title, initialValue, setCallback) {
        // Generate a unique identifier for the automation settings fields.
        const inputId = newUid();

        // Escape the unique identifier to ensure it's safe for use in CSS selectors.
        const id = CSS.escape(inputId);

        // Create a container with multiple fields using the provided ID, label, and title.
        const fieldContainer = newMultipleFieldsContainer(inputId, label, title, 'container');

        // Select the controller sub-container within the field container using the unique ID.
        const controller = fieldContainer.querySelector(`#${id}-container`);

        // Create a new number input field for the "LoadTimeout".
        CustomFields.newNumberField(
            {
                container: controller,
                initialValue: initialValue?.loadTimeout || 60000,
                isReadonly: false,
                label: 'LoadTimeout',
                step: 1,
                title: 'The maximum time (in milliseconds) the driver should wait for a page to load when setting the `IWebDriver.Url` property.',
            },
            (value) => {
                const automationSettings = {
                    loadTimeout: value
                };
                setCallback(automationSettings);
            }
        );

        // Create a new number input field for the "MaxParallel".
        CustomFields.newNumberField(
            {
                container: controller,
                initialValue: initialValue?.maxParallel || 1,
                isReadonly: false,
                label: "MaxParallel",
                step: 1,
                title: "The number of parallel rows to execute actions based on `G4DataProvider`."
            },
            (value) => {
                const automationSettings = {
                    maxParallel: value
                };
                setCallback(automationSettings);
            }
        );

        // container, label, title, initialValue, setCallback
        // Create a new switch field for the "ReturnFlatResponse".
        CustomFields.newSwitchField(
            {
                container: controller,
                initialValue: initialValue?.returnFlatResponse || false,
                label: "ReturnFlatResponse",
                title: "Indicates whether to includes a flattened format within the `responseData` field of the response."
            },
            (value) => {
                const automationSettings = {
                    returnFlatResponse: convertStringToBool(value)
                };
                setCallback(automationSettings);
            }
        );

        // Create a new switch field for the "ReturnStructuredResponse".
        CustomFields.newSwitchField(
            {
                container: controller,
                initialValue: initialValue?.returnStructuredResponse || false,
                label: "ReturnStructuredResponse",
                title: "Indicates whether to includes a structured format within the `responseTree` field of the response."
            },
            (value) => {
                const automationSettings = {
                    returnStructuredResponse: convertStringToBool(value)
                };
                setCallback(automationSettings);
            }
        );

        // Create a new number input field for the "SearchTimeout".
        CustomFields.newNumberField(
            {
                container: controller,
                initialValue: initialValue?.searchTimeout || 15000,
                isReadonly: false,
                label: "SearchTimeout",
                title: "The maximum time (in milliseconds) to wait for an element to be found during searches.",
                step: 1
            },
            (value) => {
                const automationSettings = {
                    searchTimeout: value
                };
                setCallback(automationSettings);
            }
        );

        // Append the fully constructed field container to the provided parent container in the DOM.
        container.appendChild(fieldContainer);

        // Return the field container for further manipulation if needed.
        return container;
    }

    /**
     * Creates and appends a new Environment Settings field to the specified container.
     *
     * This field includes sub-fields for Default Environment, Return Environment, and Environment Variables,
     * allowing users to configure environment-related settings for automation requests.
     *
     * @param {HTMLElement} container    - The parent element to which the environment settings field will be appended.
     * @param {string}      label        - The identifier for the environment settings field, expected in PascalCase format.
     * @param {string}      title        - The title attribute for the field container, typically used for tooltips.
     * @param {Object}      initialValue - An object containing initial values for the environment settings.
     * @param {Function}    setCallback  - A callback function invoked whenever any of the environment settings change.
     * @returns {HTMLElement} - The parent container with the appended environment settings field.
     */
    static newEnvironmentSettingsField(container, label, title, initialValue, setCallback) {
        // Generate a unique identifier for the environment settings fields.
        const inputId = newUid();

        // Escape the unique identifier to ensure it's safe for use in CSS selectors.
        const escapedId = CSS.escape(inputId);

        // Create a container with multiple environment settings fields using the provided ID, label, and title.
        const fieldContainer = newMultipleFieldsContainer(inputId, label, title, 'container');

        // Select the controller sub-container within the field container using the escaped unique ID.
        const controller = fieldContainer.querySelector(`#${escapedId}-container`);

        // Create a new string field for Default Environment.
        CustomFields.newStringField(
            {
                container: controller,
                initialValue: initialValue?.defaultEnvironment || 'SystemParameters',
                isReadonly: false,
                label: 'DefaultEnvironment',
                title: 'The default environment to use for automation requests.'
            },
            (value) => {
                const environmentSettings = {
                    defaultEnvironment: value
                };
                setCallback(environmentSettings);
            }
        );

        // Create a new switch field for Return Environment.
        CustomFields.newSwitchField(
            {
                container: controller,
                initialValue: initialValue?.returnEnvironment || false,
                label: 'ReturnEnvironment',
                title: 'Indicates whether the environment should be returned in the response.'
            },
            (value) => {
                const environmentSettings = {
                    returnEnvironment: convertStringToBool(value)
                };
                setCallback(environmentSettings);
            }
        );

        // Create a new key-value field for Environment Variables.
        CustomFields.newKeyValueField(
            controller,
            "EnvironmentVariables",
            "A list of static environment variables to use for automation requests.",
            initialValue?.environmentVariables || {},
            (value) => {
                const environmentSettings = {
                    environmentVariables: value
                };
                setCallback(environmentSettings);
            }
        );

        // Append the fully constructed environment settings field container to the provided parent container in the DOM.
        container.appendChild(fieldContainer);

        // Return the parent container with the appended environment settings field for further manipulation if needed.
        return container;
    }

    /**
     * Creates and appends a new Exceptions Settings field to the specified container.
     *
     * This field includes a sub-field for Return Exceptions, allowing users to configure
     * whether exceptions should be returned in the response for automation requests.
     *
     * @param {HTMLElement} container    - The parent element to which the exceptions settings field will be appended.
     * @param {string}      label        - The identifier for the exceptions settings field, expected in PascalCase format.
     * @param {string}      title        - The title attribute for the field container, typically used for tooltips.
     * @param {Object}      initialValue - An object containing initial values for the exceptions settings.
     * @param {Function}    setCallback  - A callback function invoked whenever the exceptions settings change.
     * @returns {HTMLElement} - The parent container with the appended exceptions settings field.
     */
    static newExceptionsSettingsField(container, label, title, initialValue, setCallback) {
        // Generate a unique identifier for the exceptions settings fields.
        const inputId = newUid();

        // Escape the unique identifier to ensure it's safe for use in CSS selectors.
        const escapedId = CSS.escape(inputId);

        // Create a container with multiple exceptions settings fields using the provided ID, label, and title.
        const fieldContainer = newMultipleFieldsContainer(inputId, label, title, 'container');

        // Select the controller sub-container within the field container using the escaped unique ID.
        const controller = fieldContainer.querySelector(`#${escapedId}-container`);

        // Create a new switch field for Return Exceptions.
        CustomFields.newSwitchField(
            {
                container: controller,
                initialValue: initialValue?.returnExceptions || false,
                label: 'ReturnExceptions',
                title: 'Indicates whether the exceptions should be returned in the response.'
            },
            (value) => {
                const exceptionsSettings = {
                    returnExceptions: convertStringToBool(value)
                };
                setCallback(exceptionsSettings);
            }
        );

        // Append the fully constructed exceptions settings field container to the provided parent container in the DOM.
        container.appendChild(fieldContainer);

        // Return the parent container with the appended exceptions settings field for further manipulation if needed.
        return container;
    }

    /**
     * Creates and appends a new Queue Manager Settings field to the specified container.
     *
     * This field includes sub-fields for Type and Properties, allowing users to configure
     * queue manager-related settings for automation requests.
     *
     * @param {HTMLElement} container    - The parent element to which the queue manager settings field will be appended.
     * @param {string}      label        - The identifier for the queue manager settings field, expected in PascalCase format.
     * @param {string}      title        - The title attribute for the field container, typically used for tooltips.
     * @param {Object}      initialValue - An object containing initial values for the queue manager settings.
     * @param {Function}    setCallback  - A callback function invoked whenever any of the queue manager settings change.
     * @returns {HTMLElement} - The parent container with the appended queue manager settings field.
     */
    static newQueueManagerSettingsField(container, label, title, initialValue, setCallback) {
        // Generate a unique identifier for the queue manager settings fields.
        const inputId = newUid();

        // Escape the unique identifier to ensure it's safe for use in CSS selectors.
        const escapedId = CSS.escape(inputId);

        // Create a container with multiple queue manager settings fields using the provided ID, label, and title.
        const fieldContainer = newMultipleFieldsContainer(inputId, label, title, 'container');

        // Select the controller sub-container within the field container using the escaped unique ID.
        const controller = fieldContainer.querySelector(`#${escapedId}-container`);

        // Create a new string input field for the "Type" with an empty initial value or the provided initial type.
        CustomFields.newStringField(
            {
                container: controller,
                initialValue: initialValue?.type || '',
                isReadonly: false,
                label: 'Type',
                title: 'Specifies the type of the queue manager.'

            },
            (value) => {
                const queueManagerSettings = {
                    type: value
                };
                setCallback(queueManagerSettings);
            }
        );

        // Create a new key-value field for Properties.
        CustomFields.newKeyValueField(
            controller,
            "Properties",
            "Additional properties for the queue manager.",
            initialValue?.properties || {},
            (value) => {
                const queueManagerSettings = {
                    properties: value
                };
                setCallback(queueManagerSettings);
            }
        );

        // Append the fully constructed queue manager settings field container to the provided parent container in the DOM.
        container.appendChild(fieldContainer);

        // Return the parent container with the appended queue manager settings field for further manipulation if needed.
        return container;
    }

    /**
     * Creates and appends a new Performance Points Settings field to the specified container.
     *
     * This field includes a sub-field for Return Performance Points, allowing users to configure
     * whether performance points should be returned in the response for automation requests.
     *
     * @param {HTMLElement} container    - The parent element to which the performance points settings field will be appended.
     * @param {string}      label        - The identifier for the performance points settings field, expected in PascalCase format.
     * @param {string}      title        - The title attribute for the field container, typically used for tooltips.
     * @param {Object}      initialValue - An object containing initial values for the performance points settings.
     * @param {Function}    setCallback  - A callback function invoked whenever the performance points settings change.
     * @returns {HTMLElement} - The parent container with the appended performance points settings field.
     */
    static newPerformancePointsSettingsField(container, label, title, initialValue, setCallback) {
        // Generate a unique identifier for the performance points settings fields.
        const inputId = newUid();

        // Escape the unique identifier to ensure it's safe for use in CSS selectors.
        const escapedId = CSS.escape(inputId);

        // Create a container with multiple performance points settings fields using the provided ID, label, and title.
        const fieldContainer = newMultipleFieldsContainer(inputId, label, title, 'container');

        // Select the controller sub-container within the field container using the escaped unique ID.
        const controller = fieldContainer.querySelector(`#${escapedId}-container`);

        // Create a new switch field for Return Performance Points.
        CustomFields.newSwitchField(
            {
                container: controller,
                initialValue: initialValue?.returnPerformancePoints || false,
                label: 'ReturnPerformancePoints',
                title: 'Indicates whether the performance points should be returned in the response.'
            },
            (value) => {
                const performancePointsSettings = {
                    returnPerformancePoints: convertStringToBool(value)
                };
                setCallback(performancePointsSettings);
            }
        );

        // Append the fully constructed performance points settings field container to the provided parent container in the DOM.
        container.appendChild(fieldContainer);

        // Return the parent container with the appended performance points settings field for further manipulation if needed.
        return container;
    }

    /**
     * Creates and appends a new Plugins Settings field to the specified container.
     *
     * This field allows users to configure multiple external repositories by specifying
     * details such as URL, version, authentication credentials, timeout settings, headers,
     * and capabilities. Users can dynamically add or remove external repository configurations.
     *
     * @param {HTMLElement} container    - The parent element to which the plugins settings field will be appended.
     * @param {string}      label        - The display name for the plugins settings field.
     * @param {string}      title        - The title attribute for the field container, typically used for tooltips.
     * @param {Object}      initialValue - An object containing initial values for the plugins settings.
     * @param {Function}    setCallback  - A callback function invoked whenever the plugins settings change.
     * @returns {HTMLElement} - The parent container with the appended plugins settings field.
     */
    static newPluginsSettingsField(container, label, title, initialValue, setCallback) {
        /**
         * Generates a data object schema for an external repository.
         *
         * @param {Object} externalRepository - The external repository data to initialize the schema with.
         * @returns {Object} - The data object schema for the external repository.
         */
        const newDataObject = (externalRepository) => {
            // Initialize an empty object to hold the data object schema.
            const dataObject = {};

            // Define the 'url' field for the external repository.
            dataObject['url'] = {
                label: 'Url',
                title: 'The URL of the external repository.',
                type: 'STRING',
                value: externalRepository?.url || ''
            };

            // Define the 'version' field for the external repository.
            dataObject['version'] = {
                label: 'Version',
                title: 'The API version of the external repository.',
                type: 'NUMBER',
                value: externalRepository?.version || ''
            };

            // Define the 'name' field for the external repository.
            dataObject['name'] = {
                label: 'Name',
                title: 'The name of the external repository.',
                type: 'STRING',
                value: externalRepository?.name || ''
            };

            // Define the 'username' field for authenticating with the external repository.
            dataObject['username'] = {
                label: 'Username',
                title: 'The username to authenticate with the external repository.',
                type: 'STRING',
                value: externalRepository?.username || ''
            };

            // Define the 'password' field for authenticating with the external repository.
            dataObject['password'] = {
                label: 'Password',
                title: 'The password to authenticate with the external repository.',
                type: 'STRING',
                value: externalRepository?.password || ''
            };

            // Define the 'timeout' field for request timeout settings.
            dataObject['timeout'] = {
                label: 'Timeout',
                title: 'The time in seconds to wait before the request times out (default 300 seconds).',
                type: 'NUMBER',
                value: externalRepository?.timeout || '300'
            };

            // Define the 'headers' field for request headers.
            dataObject['headers'] = {
                label: 'Headers',
                title: 'A collection of headers to be included in the request.',
                type: 'KEYVALUE',
                value: externalRepository?.headers || {}
            };

            // Define the 'capabilities' field for additional custom information.
            dataObject['capabilities'] = {
                label: 'Capabilities',
                title: 'A collection of capabilities with additional custom information for the invocation.',
                type: 'KEYVALUE',
                value: externalRepository?.capabilities || {}
            };

            // Return the fully constructed data object schema for the external repository.
            return dataObject;
        };

        // Generate a unique identifier for the plugins settings fields.
        const inputId = newUid();

        // Initialize external repositories with existing data or a default empty object.
        const externalRepositories = initialValue?.externalRepositories || [{}];

        // Prepare an array to hold data object schemas for each external repository.
        const dataObjects = [];

        // Retrieve all keys (indices) from the externalRepositories object.
        const indexes = Object.keys(externalRepositories);

        // Iterate over each external repository to create its data object schema.
        for (const index of indexes) {
            const schema = newDataObject(externalRepositories[index]);
            dataObjects.push(schema);
        }

        // Configuration options for the object array fields container.
        const options = {
            addButtonLabel: 'Add External Repository', // Label for the "Add" button.
            dataObjects: dataObjects,                  // Array of data object schemas for initialization.
            groupName: 'ExternalRepositories',         // Group name used for property normalization.
            itemLabel: 'External Repository',          // Label prefix for each array item.
            labelDisplayName: label,                   // Display name for the container label.
            removeButtonLabel: 'Remove',               // Label for the "Remove" button.
            role: 'container',                         // Role attribute for identifying elements.
            title: title                               // Title attribute for the container.
        };

        // Create the object array fields container with the provided options and callback.
        const fieldContainer = newObjectArrayFieldsContainer(inputId, options, setCallback);

        // Set the initial forceRuleReference value to true if not provided. 
        const forceRuleReference = initialValue?.forceRuleReference === null || initialValue?.forceRuleReference === undefined ? true : initialValue?.forceRuleReference;

        // Append new switch field for ForceRuleReference.
        CustomFields.newSwitchField(
            {
                container: fieldContainer,
                initialValue: forceRuleReference,
                label: 'ForceRuleReference',
                title: 'Indicates whether rule references should be forced when reused across different jobs. When set to `true` (the default), a new copy of the rule with a new reference will be created.'
            },
            (value) => {
                const pluginsSettings = {
                    forceRuleReference: convertStringToBool(value)
                };
                setCallback(pluginsSettings);
            }
        );

        // Append the fully constructed plugins settings field container to the provided parent container in the DOM.
        container.appendChild(fieldContainer);

        // Return the parent container with the appended plugins settings field for further manipulation if needed.
        return container;
    }
}

class CustomFields {
    /**
     * TODO: add support for item source if the value of the array parameter have value list or other plugin
     * 
     * Creates a new array field with an initial input and a "+" button to add more inputs.
     * Each input can be removed via an "X" button next to it. All non-empty values from
     * these inputs are passed to a callback function for further processing.
     *
     * @param {HTMLElement} container    - The DOM element where the new array field will be appended.
     * @param {string}      label        - The label for the field (usually in PascalCase).
     * @param {string}      title        - The title attribute for the field container, providing tooltips or extra info.
     * @param {string[]}    initialValue - An array of initial values to populate the first and subsequent inputs.
     * @param {Function}    setCallback  - A callback function that receives the updated array of non-empty, trimmed values.
     */
    static newArrayField(container, label, title, initialValue, setCallback) {
        // Generate a unique ID for the new field's input elements to prevent collisions.
        const inputId = newUid();
        const escapedId = CSS.escape(inputId);

        /**
         * Creates a new input row when the "+" button is clicked.
         * Locates the container that holds multiple input rows and appends a new one.
         * 
         * @returns {HTMLInputElement|undefined} The newly created input element or undefined if container not found.
         */
        function newInputCallback() {
            // Using the escaped ID, locate the container for new inputs.
            // This container is expected to be inside an element with data-g4-role="controller".
            const container = document.querySelector(`#${escapedId}-controller > #${escapedId}-input-container`);

            // If the container doesn't exist, return early.
            if (!container) {
                return;
            }

            // Create a new input row without an initial value and return the created input element.
            return newInput(container, undefined);
        }

        /**
         * Creates a new input row and appends it to the specified container.
         *
         * Each new row contains:
         * - A text input field for user-entered values.
         * - A remove (X) button to delete that row.
         *
         * @param {HTMLElement} container - The container to which the new input row will be added.
         * @param {string} [value]        - Optional initial value to populate the input field.
         * @returns {HTMLInputElement} The created input element.
         */
        function newInput(container, value) {
            // Create a wrapper div to hold the input and remove button as a single row.
            const row = document.createElement('div');
            row.className = 'text-with-button input-row';

            // Create the text input element with optional initial value.
            const newInput = document.createElement('input');
            newInput.type = 'text';
            newInput.value = value || '';
            newInput.setAttribute('data-g4-role', 'valueitem');
            newInput.setAttribute('title', value);

            // Create the remove button. Clicking it removes the entire row from the container.
            const removeButton = document.createElement('button');
            removeButton.type = 'button';
            removeButton.textContent = '-';
            removeButton.onclick = function () {
                // On button click, remove the entire row from the container.
                container.removeChild(row);

                // Find the closest field container by locating the parent with [data-g4-role="field"].
                // Then select the controller element that contains the inputs.
                const titleContainer = container.closest('[data-g4-role="field"]').querySelector('[data-g4-role="controller"]');

                // After removing a row, call the callback to update the values.
                callback(titleContainer);
            };

            // Add the input field and remove button into the newly created row.
            row.appendChild(removeButton);
            row.appendChild(newInput);

            // Append the completed row to the specified container.
            container.appendChild(row);

            // Return the input element for potential further use by calling code.
            return newInput;
        }

        /**
         * Gathers values from all inputs within a container that are marked with data-g4-role="valueitem".
         * Filters out null, undefined, or empty (after trimming whitespace) values.
         * Sends the resulting array of cleaned values to the provided setCallback() function.
         * 
         * @param {HTMLElement} container - The DOM element that contains the input elements.
         */
        function callback(container) {
            // Find all input elements with the data-g4-role="valueitem" attribute.
            const inputs = container.querySelectorAll('input[data-g4-role="valueitem"]');

            // Convert the NodeList of inputs to an array for easier processing.
            const inputArray = Array.from(inputs);

            // Extract values from these inputs and filter out null, undefined, or empty strings.
            const values = inputArray.map(input => {
                input.title = input.value;
                return input.value;
            }).filter(item => item != null && item.trim() !== '');

            // Pass the filtered values array to the setCallback function for further handling.
            setCallback(values);
        }

        // If initial values are provided, populate the first input and create subsequent inputs.
        const values = initialValue || [];
        const mainInputValue = values.length > 0 ? values.shift() : '';

        // Convert the label from PascalCase to spaced words (e.g., "MyLabel" -> "My Label").
        const labelDisplayName = convertPascalToSpaceCase(label);

        // Create a new field container that includes a label, title, and optionally an icon.
        const fieldContainer = newFieldContainer(inputId, labelDisplayName, title);

        // Within the field container, find the controller container that holds the main input and others.
        const controllerContainer = fieldContainer.querySelector('[data-g4-role="controller"]');

        // Set up the initial HTML structure:
        // - A text input with a "+" button above it.
        // - A div (input-container) that will hold additional rows created by the "+" button.
        const html = `
            <div class="text-with-button">
                <button type="button">+</button>
                <input type="text" data-g4-role="valueitem" title="${mainInputValue}" value="${mainInputValue}" />
            </div>
            <div id="${inputId}-input-container"></div>`;

        // Insert the initial HTML structure into the controller container.
        controllerContainer.insertAdjacentHTML('beforeend', html);

        // Select the "+" button and attach the newInputCallback() to its click event.
        const botton = controllerContainer.querySelector('button');
        botton.addEventListener('click', newInputCallback);

        // For any remaining values, create additional input rows.
        const inputContainer = fieldContainer.querySelector(`#${escapedId}-input-container`);
        for (let index = 0; index < values.length; index++) {
            const value = values[index];
            newInput(inputContainer, value);
        }

        // Add an event listener to the main container to call callback whenever input changes occur.
        fieldContainer.addEventListener('input', () => callback(fieldContainer));

        // Append the newly created field container (with controller) to the main container.
        container.appendChild(fieldContainer);

        // Return the field container for further manipulation if needed.
        return container;
    }

    /**
     * Creates a new data list field (input with datalist) that allows users to type and select an option from a predefined list.
     * The list of items is derived from the provided `itemSource`, which can be fetched and processed by `getItems`.
     *
     * @param {Object}       options                  - Configuration options for the data list field.
     * @param {HTMLElement} [options.container]       - The DOM element to which the data list field will be appended.
     * @param {string}       options.label            - The label identifier for the data list field (converted to a space-separated string for display).
     * @param {string}      [options.title]           - The title attribute for the field container, often used for tooltips.
     * @param {string}      [options.itemSource]      - The source from which the items are fetched and processed by `getItems`.
     * @param {string}      [options.initialValue=''] - The initial value shown in the data list input. Defaults to an empty string if not provided or `'undefined'`.
     * @param {Function}     setCallback              - A callback function invoked whenever the input value changes.
     *
     * @returns {HTMLElement} The container element that includes the newly created data list field.
     */
    static newDataListField(options, setCallback) {
        /**
         * Retrieves and processes items from a given source, returning a sorted object of items with their manifest details.
         *
         * Depending on the type of `itemSource`, this function performs one of two processes:
         * 1. **String**: Treats `itemSource` as a key for the `_cache` object, then transforms the retrieved items into a standardized format.
         * 2. **Array**: Assumes `itemSource` is an array of objects with `name` and `description` properties, and transforms them accordingly.
         *
         * The items are finally sorted alphabetically by their keys before being returned.
         *
         * @param {string | Array<Object>} itemSource - The source from which items are retrieved and transformed.
         *   - If a string, it is used as a key to look up items in the `_cache` object.
         *   - If an array, each array element should have `name` and `description` properties.
         *
         * @returns {Object} A sorted object whose keys represent item names or manifest keys,
         *   and whose values contain corresponding manifest summaries.
         *
         * @throws {Error} Throws an error if `itemSource` is not a string or an array.
         */
        const getItems = (itemSource) => {
            // Define a cache object to store items retrieved by key.
            let items;

            // Check if itemSource is a string (used as a key to retrieve items from _cache)
            if (typeof itemSource === 'string') {
                // Retrieve the cached items if the key exists; otherwise default to an empty object
                items = (itemSource in _cache) ? _cache[itemSource] : {};

                /**
                 * Transform each item into a standardized format.
                 * - manifestKey: Extracted from item?.manifest?.key or defaults to 'No key available'.
                 * - summary    : Extracted from item?.manifest?.summary or defaults to ['No summary available'].
                 */
                items = Object.keys(items).reduce((obj, key) => {
                    const item = items[key];
                    const manifestKey = item?.manifest?.key || 'No key available';
                    obj[manifestKey] = { manifest: { summary: item?.manifest?.summary || ['No summary available'] } };
                    return obj;
                }, {});
            }
            // Check if itemSource is an array
            else if (Array.isArray(itemSource)) {
                /**
                 * Transform the array of items into a standardized format.
                 * - key    : Derived from item.name or defaults to 'No name available'.
                 * - summary: Extracted from item.description (or can be undefined if not present).
                 */
                items = itemSource.reduce((obj, item) => {
                    const key = item.name || 'No name available';
                    obj[key] = { manifest: { summary: item.description } };
                    return obj;
                }, {});
            }
            // If itemSource is neither a string nor an array, throw an error
            else {
                throw new Error('Invalid itemSource type. Must be a string or an array.');
            }

            /**
             * Sort the items object by its keys in alphabetical order.
             * The sorted keys are then used to reconstruct the object in sorted order.
             */
            items = Object.keys(items)
                .sort()
                .reduce((obj, key) => {
                    obj[key] = items[key];
                    return obj;
                }, {});

            // Return the sorted items object
            return items;
        };

        // Generate a unique ID for the datalist input field to ensure uniqueness in the DOM
        const inputId = newUid();

        // Convert the label from PascalCase to a space-separated format for display
        const labelDisplayName = convertPascalToSpaceCase(options.label);

        // Retrieve and process items from the provided item source
        const items = getItems(options.itemSource);

        // Validate and sanitize the initial value; default to an empty string if invalid or 'undefined'
        options.initialValue = !options.initialValue || options.initialValue === 'undefined'
            ? ''
            : options.initialValue;

        /**
         * Construct the HTML for the input and its associated datalist:
         * 1. An <input> element with its 'list' attribute referencing the datalist ID.
         * 2. A <datalist> element containing <option> elements for each item.
         *    - The first option is a disabled, selected placeholder prompting user selection.
         *    - Each subsequent option has a value, label, and display text derived from the item data.
         */
        let html = `
        <input list="${inputId}-datalist" title="${options.initialValue === '' ? 'Please select an option' : options.initialValue}" />
        <datalist id="${inputId}-datalist">
            <option value="" disabled selected>-- Please select an option --</option>`;

        // Iterate over each item key to create the datalist options
        Object.keys(items).forEach(key => {
            // Retrieve the summary for each item or default to 'No summary available'
            const summary = items[key].manifest?.summary || ['No summary available'];

            // Join the summary array to create a multi-line tooltip
            const hint = summary.join("\n");

            // Create an option element: use 'key' as the value, 'hint' as the label, and display text as a space-separated key
            html += `  <option value="${key}" label="${hint}">${convertPascalToSpaceCase(key)}</option>\n`;
        });

        // Close the datalist element
        html += '</datalist>';

        // Create the main field container, specifying the unique ID, display label, and optional title
        const fieldContainer = newFieldContainer(inputId, labelDisplayName, options.title);

        // Select the sub-container within the field container where the input/datalist HTML will be appended
        const controllerContainer = fieldContainer.querySelector('[data-g4-role="controller"]');

        // Insert the constructed HTML for the input and datalist into the controller container
        controllerContainer.insertAdjacentHTML('beforeend', html);

        // Select the newly inserted <input> element for further setup
        const input = controllerContainer.querySelector('input ');
        // Apply the validated initial value to the input
        input.value = options.initialValue;

        // If a valid callback function is provided, attach an event listener to handle input changes
        if (typeof setCallback === 'function') {
            fieldContainer.addEventListener('input', () => {
                // Update the 'title' attribute to reflect the current value
                input.title = input.value;

                // Invoke the callback with the new value
                setCallback(input.value);
            });
        }

        // If an external container is provided, append the entire field container to it
        if (options.container) {
            options.container.appendChild(fieldContainer);
        }

        /**
         * Return the container that now includes the new data list field.
         * - If an external container was specified, return that container.
         * - Otherwise, return the newly created field container.
         */
        return options.container ? options.container : fieldContainer;
    }

    // TODO: Handle the class - pass it using CSS classes and not hard coded in the element creation.
    /**
     * Creates and appends a new key-value field to the specified container based on the provided options.
     * This field allows users to dynamically add multiple key-value pairs, with each pair consisting of:
     * - A key input
     * - A value input
     * - A remove button (available after additional pairs are added)
     *
     * The field invokes a callback function whenever its content changes, passing the current set of key-value pairs.
     *
     * @param {Object}       options                  - Configuration options for the key-value field.
     * @param {HTMLElement} [options.container]       - The DOM element to which the key-value field will be appended.
     * @param {string}       options.label            - The label identifier for the key-value field (converted from PascalCase to a space-separated format).
     * @param {string}      [options.title]           - The title attribute for the field container, often used for tooltips.
     * @param {Object}      [options.initialValue={}] - The initial set of key-value pairs. Defaults to an empty object.
     * @param {Function}     setCallback              - Callback function to handle updates to the key-value pairs.
     *
     * @returns {HTMLElement} The container element that includes the newly created key-value field.
     */
    static newKeyValueField(options, setCallback) {
        /**
         * Creates and appends a new key-value input row within the specified container.
         *
         * This function locates the input container using the provided `id` and,
         * if found, invokes the `newInput` function to add a new input row with default values.
         *
         * @param {string}   id          - The unique identifier used to locate the input container in the DOM.
         * @param {Function} setCallback - The callback function to handle updates to the key-value pairs.
         *
         * @returns {HTMLElement | undefined} The newly created input row element, or `undefined` if the container is not found.
         */
        const newInputCallback = (id, setCallback) => {
            // Select the input container within the controller section using the provided id
            const container = document.querySelector(`#${id}-controller > #${id}-input-container`);

            // If the container does not exist, exit the function without performing any action
            if (!container) {
                return;
            }

            // Create and return a new input row within the container by invoking the `newInput` function
            return newInput({ container }, setCallback);
        }

        /**
         * Creates a new key-value input row and appends it to the specified container.
         * Each row consists of a remove button, a key input field, and a value input field.
         * The remove button allows the user to delete the specific key-value pair.
         *
         * @param {Object}       options           - Configuration options for the new input row.
         * @param {HTMLElement}  options.container - The DOM element to which the input row will be appended.
         * @param {string}      [options.key='']   - Optional initial value for the key input field.
         * @param {string}      [options.value=''] - Optional initial value for the value input field.
         * @param {Function}     setCallback       - Callback function to handle changes after removal of a key-value pair.
         *
         * @returns {HTMLElement} The created input row element.
         */
        const newInput = (options, setCallback) => {
            // Create a div element to serve as the row container for the key-value pair
            const row = document.createElement('div');
            row.className = 'text-with-button input-row';
            row.setAttribute('data-g4-role', 'keyvalue');

            // Create the key input field
            const newKeyInput = document.createElement('input');
            newKeyInput.type = 'text';
            newKeyInput.value = options.key || '';
            newKeyInput.setAttribute('data-g4-role', 'key');
            newKeyInput.setAttribute('title', `Key: ${options.key || ''}`);
            newKeyInput.setAttribute('placeholder', 'Enter key');

            // Create the value input field
            const newValueInput = document.createElement('input');
            newValueInput.type = 'text';
            newValueInput.value = options.value || '';
            newValueInput.setAttribute('data-g4-role', 'value');
            newValueInput.setAttribute('title', `Value: ${options.value || ''}`);
            newValueInput.setAttribute('placeholder', 'Enter value');

            // Create the remove button to delete the key-value pair
            const removeButton = document.createElement('button');
            removeButton.type = 'button';
            removeButton.textContent = '-';
            removeButton.title = "Remove Key/Value Pair";
            removeButton.className = 'remove-button';

            // Define the click event handler for the remove button
            removeButton.onclick = function () {
                // Remove the current row from the container
                options.container.removeChild(row);

                // Find the closest parent container with the role "field"
                const fieldContainer = options.container.closest('[data-g4-role="field"]');

                // If a field container is found, locate the controller section
                if (fieldContainer) {
                    // Within the field container, find the controller section
                    const titleContainer = fieldContainer.querySelector('[data-g4-role="controller"]');

                    // Invoke the callback to handle the updated key-value pairs
                    callback(titleContainer, setCallback);
                }
            };

            // Append the remove button, key input, and value input to the row container
            row.appendChild(removeButton);
            row.appendChild(newKeyInput);
            row.appendChild(newValueInput);

            // Append the completed row to the specified container
            options.container.appendChild(row);

            // Return the newly created row element for potential further manipulation
            return row;
        }

        /**
         * Processes the key-value input rows within the specified container and invokes the callback with the current key-value pairs.
         *
         * This function performs the following steps:
         * 1. Selects all key-value input rows within the container.
         * 2. Iterates over each input row to extract and sanitize the key and value.
         * 3. Builds a dictionary of key-value pairs, excluding entries with empty keys.
         * 4. Updates the title attributes of the input fields to reflect their current values.
         * 5. Invokes the provided `setCallback` function with the resulting dictionary.
         *
         * @param {HTMLElement} container   - The DOM element that contains the key-value input elements.
         * @param {Function}    setCallback - The callback function to handle the processed key-value pairs.
         */
        const callback = (container, setCallback) => {
            // Select all div elements with data-g4-role="keyvalue" within the container
            const inputs = container.querySelectorAll('div[data-g4-role="keyvalue"]');
            const inputArray = Array.from(inputs);

            // Reduce the array of input rows into a dictionary of key-value pairs
            const values = inputArray.reduce((dictionary, input) => {
                // Select the key input field within the current input row
                const keyInput = input.querySelector('input[data-g4-role="key"]');

                // Select the value input field within the current input row
                const valueInput = input.querySelector('input[data-g4-role="value"]');

                // Retrieve and trim the value from the key input field; default to an empty string if not found
                const key = keyInput ? keyInput.value.trim() : '';

                // Retrieve and trim the value from the value input field; default to an empty string if not found
                const value = valueInput ? valueInput.value.trim() : '';

                // If the key is not empty, add it to the dictionary with its corresponding value
                if (key !== '') {
                    dictionary[key] = value;
                }

                // Update the title attribute of the key input field to reflect the current key
                if (keyInput) keyInput.title = key;

                // Update the title attribute of the value input field to reflect the current value
                if (valueInput) valueInput.title = value;

                // Return the updated dictionary of key-value pairs
                return dictionary;
            }, {});

            // Invoke the provided callback function with the dictionary of key-value pairs
            if (typeof setCallback === 'function') {
                setCallback(values);
            }
        }

        // Generate a unique ID for the field and escape it for safe CSS usage
        const inputId = newUid();
        const escapedId = CSS.escape(inputId);

        // Extract the initial key-value pairs from the options or default to an empty object
        const values = options.initialValue || {};
        const keys = Object.keys(values);

        // Determine if there is at least one key to populate the main key-value row
        const mainInputKey = keys.length > 0 ? keys.shift() : '';
        const mainKey = mainInputKey || '';
        const mainValue = mainInputKey ? values[mainInputKey] : '';

        // Convert the provided label from PascalCase to a more readable space-separated format
        const labelDisplayName = convertPascalToSpaceCase(options.label);

        // Create the primary field container using a helper function
        const fieldContainer = newFieldContainer(inputId, labelDisplayName, options.title);

        // Select the controller container within the field container where elements will be added
        const controllerContainer = fieldContainer.querySelector('[data-g4-role="controller"]');

        // Prepare the initial HTML structure with:
        // 1. A "+" button to add new key-value pairs.
        // 2. A single key-value row if a main key-value pair is available.
        // 3. An empty container for additional rows.
        const html = `
        <div data-g4-role="keyvalue" class="text-with-button">
            <button type="button" title="Add Key/Value Pair">+</button>
            <input type="text" data-g4-role="key" title="Key: ${mainKey}" value="${mainKey}" />
            <input type="text" data-g4-role="value" title="Value: ${mainValue}" value="${mainValue}" />
        </div>
        <div id="${inputId}-input-container"></div>`;

        // Insert the constructed HTML into the controller container
        controllerContainer.insertAdjacentHTML('beforeend', html);

        // Select the "+" button from the newly inserted HTML
        const addButton = controllerContainer.querySelector('button');

        // Attach an onclick handler that creates a new key-value row when triggered
        addButton.onclick = () => newInputCallback(escapedId, setCallback);

        // Find the input container where subsequent key-value rows will be appended
        const inputContainer = fieldContainer.querySelector(`#${escapedId}-input-container`);

        // For each remaining key in the initial values, create additional key-value rows
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const value = values[key];
            newInput({ container: inputContainer, key, value }, setCallback);
        }

        // Whenever an input event occurs (typing, etc.), process the updated field content
        fieldContainer.addEventListener('input', () => {
            callback(fieldContainer, setCallback);
        });

        // If a container is provided in options, append the field container to it
        if (options.container) {
            options.container.appendChild(fieldContainer);
        }

        // Return the container that holds the new key-value field
        return options.container ? options.container : fieldContainer;
    }

    /**
     * Creates and appends a new list (select) field to the specified container based on provided options.
     * The select field is populated with sorted items, each accompanied by a summary tooltip, and invokes a callback with the selected value upon input.
     *
     * @param {Object}                 options                    - Configuration options for the list field.
     * @param {HTMLElement}            [options.container]        - The DOM element to which the list field will be appended.
     * @param {string}                 options.label              - The identifier for the list field, used for data attributes and labeling.
     * @param {string}                 [options.title]            - The title attribute for the field container, often used for tooltips.
     * @param {string}                 [options.initialValue='']  - The initial selected value of the list field. Defaults to an empty string if not provided or invalid.
     * @param {string | Array<Object>} options.itemsSource - The source of items to populate the list.
     *   - If a string, it is used as a key to retrieve items from the `_cache` object.
     *   - If an array, it should contain objects with `name` and `description` properties.
     * @param {boolean}                [options.isReadonly=false] - Determines if the select field is read-only.
     * @param {Function}               setCallback                - Callback function to handle changes to the select field's value.
     *
     * @returns {HTMLElement} The container element that includes the newly created list field.
     *
     * @throws {Error} Throws an error if `itemsSource` is neither a string nor an array.
     *
     * @example
     *
     * // Using a string as itemsSource (retrieves from _cache)
     * const listField = newListField({
     *   container: document.getElementById('form-container'),
     *   label: 'pluginList',
     *   title: 'Select a Plugin',
     *   initialValue: 'PluginOne',
     *   itemsSource: 'plugins',
     *   isReadonly: false
     * }, (selectedValue) => {
     *   console.log(`Selected Plugin: ${selectedValue}`);
     * });
     *
     * // Using an array as itemsSource
     * const pluginsArray = [
     *   { name: 'PluginOne', description: 'First plugin description' },
     *   { name: 'PluginTwo', description: 'Second plugin description' },
     * ];
     * const listField = newListField({
     *   container: document.getElementById('form-container'),
     *   label: 'pluginList',
     *   title: 'Select a Plugin',
     *   initialValue: 'PluginTwo',
     *   itemsSource: pluginsArray,
     *   isReadonly: false
     * }, (selectedValue) => {
     *   console.log(`Selected Plugin: ${selectedValue}`);
     * });
     */
    static newListField(options, setCallback) {
        /**
         * Processes the provided items source and returns a sorted object of items with their manifests.
         *
         * The function handles two types of `itemsSource`:
         * 1. **String**: Assumes `itemsSource` is a key to retrieve items from a cache (`_cache`).
         *    - Extracts the manifest key and summary for each item.
         *    - Defaults to 'No key available' and ['No summary available'] if properties are missing.
         * 2. **Array**: Assumes `itemsSource` is an array of item objects.
         *    - Extracts the name and description for each item.
         *    - Defaults to 'No name available' if the name property is missing.
         *
         * After processing, the function sorts the items alphabetically by their keys.
         *
         * @param {string | Array<Object>} itemsSource - The source of items to process.
         *   - If a string, it is used as a key to retrieve items from the `_cache` object.
         *   - If an array, it should contain objects with `name` and `description` properties.
         *
         * @returns {Object} A sorted object where each key is derived from the item's manifest key or name,
         *   and each value contains the item's manifest with a summary.
         *
         * @throws {Error} Throws an error if `itemsSource` is neither a string nor an array.
         */
        const getItems = (itemsSource) => {
            // Define a variable to hold the items after processing
            let items;

            // Check if itemsSource is a string
            if (typeof itemsSource === 'string') {
                // Retrieve items from the cache using the provided key
                // If the key does not exist in the cache, default to an empty object
                items = (itemsSource in _cache) ? _cache[itemsSource] : {};

                /**
                 * Transform the cached items into a structured object.
                 * - Each key is derived from the item's manifest key or defaults to 'No key available'.
                 * - Each value contains the item's manifest with a summary.
                 */
                items = Object.keys(items).reduce((obj, key) => {
                    const item = items[key];

                    // Safely access the manifest key; default if unavailable
                    const manifestKey = item?.manifest?.key || 'No key available';

                    // Safely access the manifest summary; default if unavailable
                    obj[manifestKey] = {
                        manifest: {
                            summary: item?.manifest?.summary || ['No summary available']
                        }
                    };

                    return obj;
                }, {});
            }
            // Check if itemsSource is an array
            else if (Array.isArray(itemsSource)) {
                /**
                 * Transform the array of items into a structured object.
                 * - Each key is derived from the item's name or defaults to 'No name available'.
                 * - Each value contains the item's manifest with a summary derived from the description.
                 */
                items = itemsSource.reduce((obj, item) => {
                    // Safely access the item's name; default if unavailable
                    const key = item.name || 'No name available';

                    // Safely access the item's description; default if unavailable
                    obj[key] = {
                        manifest: {
                            summary: item.description || 'No description available'
                        }
                    };

                    // Return the updated object
                    return obj;
                }, {});
            }
            // If itemsSource is neither string nor array, throw an error
            else {
                throw new Error('Invalid itemsSource type. Must be a string or an array.');
            }

            /**
             * Sort the items alphabetically by their keys.
             * - Extracts the keys, sorts them, and reconstructs the items object in sorted order.
             */
            items = Object.keys(items)
                .sort()
                .reduce((obj, key) => {
                    obj[key] = items[key];
                    return obj;
                }, {});

            // Return the sorted items object
            return items;
        };

        // Generate a unique identifier for the list field to ensure uniqueness in the DOM
        const inputId = newUid();

        // Convert the label from PascalCase to a space-separated format for display purposes
        const labelDisplayName = convertPascalToSpaceCase(options.label);

        // Process the items source to get a sorted items object
        const items = getItems(options.itemsSource);

        /**
         * Validate and sanitize the initial value.
         * If the initial value is not provided or is the string 'undefined', default it to an empty string.
         */
        options.initialValue = (!options.initialValue || options.initialValue === 'undefined')
            ? ''
            : options.initialValue;

        /**
         * Construct the HTML string for the select element with the necessary attributes.
         * - `title`: Tooltip text showing the current selected value or a prompt if none is selected.
         * - `type`: Specifies the input type as select.
         */
        let html = `
        <select title="${options.initialValue === '' ? 'Please select an option' : options.initialValue}"> 
            <option value="" disabled selected>-- Please select an option --</option>`;

        /**
         * Iterate over each key in the sorted items object to create corresponding option elements.
         * - Each option's value is the key.
         * - Each option's title attribute contains the summary for tooltip display.
         * - The displayed text is the key converted from PascalCase to space-separated format.
         */
        Object.keys(items).forEach(key => {
            const summary = items[key].manifest?.summary || ['No summary available'];
            html += `  <option value="${key}" title="${summary.join("\n")}">${convertPascalToSpaceCase(key)}</option>\n`;
        });

        // Close the select element
        html += '</select>';

        // Create a container for the field using a helper function, passing the unique ID, display label, and title
        const fieldContainer = newFieldContainer(inputId, labelDisplayName, options.title);

        // Select the specific sub-container within the field container where the select element will reside
        const controllerContainer = fieldContainer.querySelector('[data-g4-role="controller"]');

        // Insert the constructed HTML into the controller container at the end of its current content
        controllerContainer.insertAdjacentHTML('beforeend', html);

        // Retrieve the newly inserted select element for further manipulation
        const select = controllerContainer.querySelector('select');
        select.value = options.initialValue;

        /**
         * If a callback function is provided, add an event listener to handle input events.
         * - Updates the `title` attribute of the input to reflect its current value.
         * - Invokes the `setCallback` function with the new value whenever the input changes.
         */
        if (typeof setCallback === 'function') {
            fieldContainer.addEventListener('input', () => {
                select.title = select.value;
                setCallback(select.value);
            });
        }

        /**
         * If a container element is provided in the options, append the entire field container to it.
         * This allows for flexible placement of the new list field within the DOM.
         */
        if (options.container) {
            options.container.appendChild(fieldContainer);
        }

        /**
         * Return the container that now includes the new list field.
         * - If an external container was provided, return that container.
         * - Otherwise, return the newly created field container.
         */
        return options.container ? options.container : fieldContainer;
    }

    /**
     * Creates and appends a new name input field with autocomplete functionality to the specified container based on provided options.
     * The input field utilizes a datalist for alias suggestions and invokes a callback with the current value upon input.
     *
     * @param {Object}        options                    - Configuration options for the name field.
     * @param {HTMLElement}   [options.container]        - The DOM element to which the name field will be appended.
     * @param {string}        options.label              - The identifier for the name field, used for data attributes and labeling.
     * @param {string}        [options.title]            - The title attribute for the field container, often used for tooltips.
     * @param {string|number} [options.initialValue='']  - The initial value of the input field. Defaults to an empty string if not provided or invalid.
     * @param {Object}        options.step               - An object containing step-related configurations.
     * @param {string}        options.step.pluginName    - The plugin name to be used as a default alias.
     * @param {Array<string>} [options.step.aliases]     - An array of alias strings to be suggested in the datalist.
     * @param {boolean}       [options.isReadonly=false] - Determines if the input field is read-only.
     * @param {Function}      setCallback                - Callback function to handle changes to the input field's value.
     *
     * @returns {HTMLElement} The container element that includes the newly created name field.
     */
    static newNameField(options, setCallback) {
        // Generate a unique identifier for the input field to ensure uniqueness in the DOM.
        const inputId = newUid();

        // Extract aliases from the step configuration if available.
        const aliases = options.step.aliases;

        // Convert the plugin name from PascalCase to a space-separated format for display purposes.
        const pluginName = convertPascalToSpaceCase(options.step.pluginName);

        // Convert the label from PascalCase to a space-separated format for display purposes.
        const labelDisplayName = convertPascalToSpaceCase(options.label);

        /**
         * Validate and sanitize the initial value.
         * If the initial value is not provided, is NaN, or is the string 'undefined', default it to an empty string.
         */
        options.initialValue = (!options.initialValue || options.initialValue === 'undefined')
            ? ''
            : options.initialValue;

        /**
         * Construct the HTML string for the input element with the necessary attributes.
         * - `list`             : Associates the input with a datalist for autocomplete suggestions.
         * - `data-g4-attribute`: Custom data attribute for identifying the field.
         * - `title`            : Tooltip text showing the current value or a prompt if empty.
         * - `type`             : Specifies the input type as text.
         * - `spellcheck`       : Disables spell checking for the input field.
         * - `value`            : Sets the initial value of the input field.
         */
        let html = `
        <input 
            list="${inputId}-aliases" 
            data-g4-attribute="${options.label}" 
            title="${options.initialValue === '' ? 'Please select a different alias' : options.initialValue}" 
            type="text" 
            spellcheck='false'
            value='${options.initialValue}' />`;

        /**
         * If aliases are provided, construct a datalist with options for autocomplete suggestions.
         * The datalist includes the plugin name as a default option and any additional aliases.
         */
        if (aliases && aliases.length > 0) {
            html += `
            <datalist id="${inputId}-aliases">
                <option value="${pluginName}" label="${options.step.pluginName}">${pluginName}</option>\n`;

            // Iterate over each alias to create corresponding datalist options.
            aliases.forEach(alias => {
                const formattedAlias = convertPascalToSpaceCase(alias);
                html += `  <option value="${formattedAlias}" label="${alias}">${formattedAlias}</option>\n`;
            });

            html += '</datalist>';
        }

        // Create a container for the field using a helper function, passing the unique ID, display label, and title.
        const fieldContainer = newFieldContainer(inputId, labelDisplayName, options.title);

        // Select the specific sub-container within the field container where the input element will reside.
        const controllerContainer = fieldContainer.querySelector('[data-g4-role="controller"]');

        // Insert the constructed HTML into the controller container at the end of its current content.
        controllerContainer.insertAdjacentHTML('beforeend', html);

        // Retrieve the newly inserted input element for further manipulation.
        const input = controllerContainer.querySelector('input');

        /**
         * If the `isReadonly` option is true, set the `readonly` attribute on the input element
         * to prevent user modification.
         */
        if (options.isReadonly) {
            input.setAttribute('readonly', 'readonly');
        }

        /**
         * If a callback function is provided, add an event listener to handle input events.
         * - Updates the `title` attribute of the input to reflect its current value.
         * - Invokes the `setCallback` function with the new value whenever the input changes.
         */
        if (typeof setCallback === 'function') {
            fieldContainer.addEventListener('input', () => {
                input.title = input.value;
                setCallback(input.value);
            });
        }

        /**
         * If a container element is provided in the options, append the entire field container to it.
         * This allows for flexible placement of the new name field within the DOM.
         */
        if (options.container) {
            options.container.appendChild(fieldContainer);
        }

        /**
         * Return the container that now includes the new name field.
         * - If an external container was provided, return that container.
         * - Otherwise, return the newly created field container.
         */
        return options.container ? options.container : fieldContainer;
    }

    /**
     * Creates and appends a new number input field to the specified container based on provided options.
     * The input field handles numeric values with specified steps and invokes a callback with the current value upon input.
     *
     * @param {Object}        options                    - Configuration options for the number field.
     * @param {HTMLElement}   [options.container]        - The DOM element to which the number field will be appended.
     * @param {string}        options.label              - The identifier for the number field, used for data attributes and labeling.
     * @param {string}        [options.title]            - The title attribute for the field container, often used for tooltips.
     * @param {number|string} [options.initialValue='']  - The initial value of the number input. Defaults to an empty string if not provided or invalid.
     * @param {number}        [options.step=1]           - The increment step for the number input.
     * @param {boolean}       [options.isReadonly=false] - Determines if the number input is read-only.
     * @param {Function}      setCallback                - Callback function to handle changes to the number field's value.
     *
     * @returns {HTMLElement} The container element that includes the newly created number field.
     */
    static newNumberField(options, setCallback) {
        // Generate a unique identifier for the number input to ensure uniqueness in the DOM.
        const inputId = newUid();

        // Convert the label from PascalCase to a space-separated format for display purposes.
        const labelDisplayName = convertPascalToSpaceCase(options.label);

        /**
         * Validate and sanitize the initial value.
         * If the initial value is not provided, is NaN, or is the string 'undefined', default it to an empty string.
         */
        options.initialValue = (!options.initialValue || isNaN(options.initialValue) || options.initialValue === 'undefined')
            ? ''
            : options.initialValue;

        /**
         * Construct the HTML string for the input element with the necessary attributes.
         * - `id`               : Unique identifier for the input.
         * - `data-g4-attribute`: Custom data attribute for identifying the field.
         * - `title`            : Tooltip text showing the current value.
         * - `type`             : Specifies the input type as number.
         * - `step`             : Defines the legal number intervals for the input.
         * - `value`            : Sets the initial value of the input field.
         */
        const html = `
        <input 
            id="${inputId}"
            data-g4-attribute="${options.label}" 
            title="${options.initialValue}" 
            type="number" 
            step="${options.step || 1}"
            value="${options.initialValue}" />`;

        // Create a container for the field using a helper function, passing the unique ID, display label, and title.
        const fieldContainer = newFieldContainer(inputId, labelDisplayName, options.title);

        // Select the specific sub-container within the field container where the input element will reside.
        const controllerContainer = fieldContainer.querySelector('[data-g4-role="controller"]');

        // Insert the input HTML into the controller container at the end of its current content.
        controllerContainer.insertAdjacentHTML('beforeend', html);

        // Retrieve the newly inserted input element for further manipulation.
        const input = controllerContainer.querySelector('input');

        /**
         * If the `isReadonly` option is true, set the `readonly` attribute on the input element
         * to prevent user modification.
         */
        if (options.isReadonly) {
            input.setAttribute('readonly', 'readonly');
        }

        /**
         * If a callback function is provided, add an event listener to handle input events.
         * - Updates the `title` attribute of the input to reflect its current value.
         * - Invokes the `setCallback` function with the new value whenever the input changes.
         */
        if (typeof setCallback === 'function') {
            fieldContainer.addEventListener('input', () => {
                input.title = input.value;
                setCallback(input.value);
            });
        }

        /**
         * If a container element is provided in the options, append the entire field container to it.
         * This allows for flexible placement of the new number field within the DOM.
         */
        if (options.container) {
            options.container.appendChild(fieldContainer);
        }

        /**
         * Return the container that now includes the new number field.
         * - If an external container was provided, return that container.
         * - Otherwise, return the newly created field container.
         */
        return options.container ? options.container : fieldContainer;
    }

    /**
     * Creates and appends a new string input field (textarea) to the specified container based on provided options.
     * The textarea dynamically adjusts its height based on content and invokes a callback with the current value upon input.
     *
     * @param {Object}        options                    - Configuration options for the string field.
     * @param {HTMLElement}   [options.container]        - The DOM element to which the string field will be appended.
     * @param {string}        options.label              - The identifier for the string field, used for data attributes and labeling.
     * @param {string}        [options.title]            - The title attribute for the field container, often used for tooltips.
     * @param {string|number} [options.initialValue='']  - The initial value of the textarea. Defaults to an empty string if not provided or invalid.
     * @param {boolean}       [options.isReadonly=false] - Determines if the textarea is read-only.
     * @param {Function}      setCallback                - Callback function to handle changes to the textarea's value.
     *
     * @returns {HTMLElement} The container element that includes the newly created string field.
     */
    static newStringField(options, setCallback) {
        /**
         * Adjusts the size of the textarea dynamically based on its content
         * and invokes the callback with the current value.
         *
         * @param {HTMLTextAreaElement} textarea - The textarea element to resize and process.
         */
        const callback = (textarea) => {
            // Reset the height to 'auto' to recalculate the required height based on content.
            textarea.style.height = 'auto';

            // Calculate the scroll height, which represents the full height of the content.
            const contentHeight = textarea.scrollHeight;

            // Get the computed styles of the textarea to determine line height and minimum height.
            const computedStyle = window.getComputedStyle(textarea);
            const lineHeight = parseFloat(computedStyle.lineHeight);
            const minHeight = parseFloat(computedStyle.minHeight);

            // Define the maximum number of lines the textarea can expand to before enabling scroll.
            const maxLines = 8;
            const maxHeight = lineHeight * maxLines;

            if (contentHeight <= maxHeight) {
                // If the content height is within the maximum allowed height:

                // Set the textarea height to the content height or minimum height, whichever is greater.
                textarea.style.height = contentHeight > minHeight ? `${contentHeight}px` : `${minHeight}px`;

                // Hide the vertical scrollbar since content fits within the textarea.
                textarea.style.overflowY = 'hidden';
                // If the content exceeds the maximum allowed height:
            } else {
                // Set the textarea height to the maximum height.
                textarea.style.height = `${maxHeight}px`;

                // Enable the vertical scrollbar to allow scrolling through content.
                textarea.style.overflowY = contentHeight === 0 ? 'hidden' : 'scroll';
            }

            // Invoke the callback function with the current value of the textarea.
            setCallback(textarea.value);
        };

        // Generate a unique identifier for the textarea to ensure uniqueness in the DOM.
        const inputId = newUid();

        // Convert the label from PascalCase to a space-separated format for display purposes.
        const labelDisplayName = convertPascalToSpaceCase(options.label);

        /**
         * Validate and sanitize the initial value.
         * If the initial value is not provided, is NaN, or is the string 'undefined', default it to an empty string.
         */
        options.initialValue = (!options.initialValue || options.initialValue === 'undefined')
            ? ''
            : options.initialValue;

        // Create a textarea element dynamically.
        const textareaElement = document.createElement('textarea');

        // Set necessary attributes for the textarea.
        textareaElement.setAttribute('id', inputId);
        textareaElement.setAttribute('rows', '1');                        // Start with a single row; height will adjust dynamically.
        textareaElement.setAttribute('wrap', 'off');                      // Disable text wrapping to allow horizontal scrolling if needed.
        textareaElement.setAttribute('data-g4-attribute', options.label); // Custom data attribute for identification.
        textareaElement.setAttribute('spellcheck', 'false');              // Disable spell checking.
        textareaElement.setAttribute('title', options.initialValue);      // Tooltip displaying the current value.
        textareaElement.value = options.initialValue;                     // Set the initial value of the textarea.

        // Create a container for the field using a helper function, passing the unique ID, display label, and title.
        const fieldContainer = newFieldContainer(inputId, labelDisplayName, options.title);

        // Escape the inputId to safely use it in a CSS selector.
        const escapedId = CSS.escape(inputId);

        // Select the specific sub-container within the field container where the textarea will reside.
        const controllerContainer = fieldContainer.querySelector(`#${escapedId}-controller`);

        // Append the textarea element to the controller container.
        controllerContainer.appendChild(textareaElement);

        // If the textarea should be read-only, set the 'readonly' attribute.
        if (options.isReadonly) {
            textareaElement.setAttribute('readonly', 'readonly');
        }

        /**
         * If a callback function is provided, add an event listener to handle changes to the select field.
         * - Updates the `title` attribute of the select to reflect its current value.
         * - Invokes the `setCallback` function with the new value whenever the selection changes.
         */
        if (typeof setCallback === 'function') {
            fieldContainer.addEventListener('input', () => {
                textareaElement.title = textareaElement.value;
                callback(textareaElement);
            });
        }

        // If a container element is provided in the options, append the entire field container to it.
        if (options.container) {
            options.container.appendChild(fieldContainer);
        }

        /**
         * Return the container that now includes the new string field.
         * - If an external container was provided, return that container.
         * - Otherwise, return the newly created field container.
         */
        return options.container ? options.container : fieldContainer;
    }

    /**
     * Creates and appends a new switch (select) field to the specified container based on provided options.
     *
     * @param {Object}         options                      - Configuration options for the switch field.
     * @param {HTMLElement}    [options.container]          - The DOM element to which the switch field will be appended.
     * @param {string}         options.label                - The identifier for the switch field, used for data attributes and labeling.
     * @param {string}         [options.title]              - The title attribute for the field container, often used for tooltips.
     * @param {boolean|string} [options.initialValue=false] - The initial value of the switch field. Can be `true`, `false`, or a falsy value.
     * @param {Function}       setCallback                  - Callback function to handle changes to the switch field's value.
     *
     * @returns {HTMLElement} The container element that includes the newly created switch field.
     */
    static newSwitchField(options, setCallback) {
        // Generate a unique identifier for the switch field to ensure uniqueness in the DOM
        const inputId = newUid();

        // Convert the label from PascalCase to a space-separated format for display purposes
        const labelDisplayName = convertPascalToSpaceCase(options.label);

        /**
         * Validate and sanitize the initial value.
         * If the initial value is not provided, is NaN, or is undefined, default it to `false`.
         */
        options.initialValue = (!options.initialValue || isNaN(options.initialValue) || options.initialValue === undefined)
            ? false
            : options.initialValue;

        /**
         * Construct the HTML string for the select element with the necessary attributes.
         * - `data-g4-attribute`: Custom data attribute for identifying the field.
         * - `title`            : Tooltip text showing the current value.
         * - `select`           : Creates a dropdown with options to activate or deactivate the switch.
         */
        const html = `
        <select data-g4-attribute="${options.label}" title="${options.initialValue}">
            <option value="" disabled selected>-- Please select an option --</option>
            <option value="true" title="Activate switch">True</option>
            <option value="false" title="Deactivate switch">False</option>
        </select>`;

        // Create a container for the field using a helper function, passing the unique ID, display label, and title
        const fieldContainer = newFieldContainer(inputId, labelDisplayName, options.title);

        // Select the specific sub-container within the field container where the select element will reside
        const controllerContainer = fieldContainer.querySelector('[data-g4-role="controller"]');

        // Insert the select HTML into the controller container at the end of its current content
        controllerContainer.insertAdjacentHTML('beforeend', html);

        // Retrieve the newly inserted select element for further manipulation
        const select = controllerContainer.querySelector('select');
        select.value = options.initialValue;

        /**
         * If a callback function is provided, add an event listener to handle changes to the select field.
         * - Updates the `title` attribute of the select to reflect its current value.
         * - Invokes the `setCallback` function with the new value whenever the selection changes.
         */
        if (typeof setCallback === 'function') {
            fieldContainer.addEventListener('input', () => {
                select.title = select.value;
                setCallback(select.value);
            });
        }

        /**
         * If a container element is provided in the options, append the entire field container to it.
         * This allows for flexible placement of the new switch field within the DOM.
         */
        if (options.container) {
            options.container.appendChild(fieldContainer);
        }

        /**
         * Return the container that now includes the new switch field.
         * - If an external container was provided, return that container.
         * - Otherwise, return the newly created field container.
         */
        return options.container ? options.container : fieldContainer;
    }

    /**
     * Creates and returns a new text input field based on the provided options.
     *
     * @param {Object}      options                    - Configuration options for the text field.
     * @param {string}      options.label              - The label identifier for the text field.
     * @param {string}      [options.initialValue]     - The initial value to populate the text field.
     * @param {string}      [options.title]            - The title attribute for the field container, often used for tooltips.
     * @param {boolean}     [options.isReadonly=false] - Determines if the text field is read-only.
     * @param {HTMLElement} [options.container]        - The DOM element to which the text field will be appended.
     * @param {Function}    setCallback                - Callback function to handle changes to the text field's value.
     *
     * @returns {HTMLElement} The container element that includes the newly created text field.
     */
    static newTextField(options, setCallback) {

        // Generate a unique identifier for the input field to ensure uniqueness in the DOM
        const inputId = newUid();

        // Convert the label from PascalCase to a space-separated format for display purposes
        const labelDisplayName = convertPascalToSpaceCase(options.label);

        /**
         * Validate and sanitize the initial value.
         * If the initial value is not provided, not a number, or undefined, default it to an empty string.
         */
        options.initialValue = (!options.initialValue || options.initialValue === 'undefined')
            ? ''
            : options.initialValue;

        /**
         * Construct the HTML string for the input element with the necessary attributes.
         * - `data-g4-attribute`: Custom data attribute for identifying the field.
         * - `title`            : Tooltip text showing the current value.
         * - `type`             : Specifies the input type as text.
         * - `spellcheck`       : Disables spell checking for the input field.
         * - `value`            : Sets the initial value of the input field.
         */
        const html = `
        <input 
            data-g4-attribute="${options.label}" 
            title="${options.initialValue}" 
            type="text" 
            spellcheck="false"
            value="${options.initialValue}" />`;

        // Create a container for the field using a helper function, passing the unique ID, display label, and title
        const fieldContainer = newFieldContainer(inputId, labelDisplayName, options.title);

        // Select the specific sub-container within the field container where the input element will reside
        const controllerContainer = fieldContainer.querySelector('[data-g4-role="controller"]');

        // Insert the input HTML into the controller container at the end of its current content
        controllerContainer.insertAdjacentHTML('beforeend', html);

        // Retrieve the newly inserted input element for further manipulation
        const input = controllerContainer.querySelector('input');

        /**
         * If the `isReadonly` option is true, set the `readonly` attribute on the input element
         * to prevent user modification.
         */
        if (options.isReadonly) {
            input.setAttribute('readonly', 'readonly');
        }

        /**
         * Add an event listener to the field container that listens for input events.
         * - Updates the `title` attribute of the input to reflect its current value.
         * - Invokes the `setCallback` function with the new value whenever the input changes.
         */
        if (typeof setCallback === 'function') {
            fieldContainer.addEventListener('input', () => {
                input.title = input.value;
                setCallback(input.value);
            });
        }

        /**
         * If a container element is provided in the options, append the entire field container to it.
         * This allows for flexible placement of the new text field within the DOM.
         */
        if (options.container) {
            options.container.appendChild(fieldContainer);
        }

        /**
         * Return the container that now includes the new text field.
         * - If an external container was provided, return that container.
         * - Otherwise, return the newly created field container.
         */
        return options.container ? options.container : fieldContainer;
    }

    /**
     * Creates and appends a new title section to the specified container.
     *
     * This section includes a main title, a subtitle, and a hint icon that toggles additional help text.
     *
     * @param {Object}      options              - Configuration options for the title section.
     * @param {HTMLElement} options.container    - The DOM element to which the new title section will be appended.
     * @param {string}      options.titleText    - The main title text to be displayed as an `<h2>` element.
     * @param {string}      options.subTitleText - The subtitle text to be displayed within a `<span>` element with the class "subtitle".
     * @param {string}      options.helpText     - The help text to be displayed when the hint icon is clicked.
     * @returns {HTMLElement} - The parent container with the appended title section.
     */
    static newTitle(options) {
        /**
         * Toggles a hint text element inside a specified container.
         * If the hint text element already exists, it is removed. Otherwise, a new one is created and added.
         *
         * @param {HTMLElement} hintContainer - The parent container where the hint text will be toggled.
         * @param {string} hintText - The text to display inside the hint element.
         */
        const switchHint = (hintContainer, hintText) => {
            // Query for an existing hint text element within the hintContainer.
            let hintElement = hintContainer.querySelector('div.hint-text');

            // If the hint text element already exists, remove it and exit the function.
            if (hintElement) {
                hintElement.remove();
                return;
            }

            // Create a new hint text element if it doesn't already exist.
            hintElement = document.createElement('div');
            hintElement.classList.add('hint-text'); // Add the 'hint-text' class for styling.
            hintElement.innerHTML = hintText;       // Set the provided hint text as the content.

            // Append the newly created hint text element to the hintContainer.
            hintContainer.appendChild(hintElement);
        };

        // Set default value for helpText if not provided.
        options.helpText = options.helpText || 'Help text not provided.';

        // Create a new div element to contain the title and subtitle.
        const titleContainer = document.createElement('div');
        titleContainer.setAttribute('data-g4-role', 'title');

        // Define the HTML structure for the title, subtitle, and hint icon.
        const html = `
        <h2 style="display: flex; align-items: center; justify-content: space-between;">
            ${options.titleText}
            <span class="hint-icon-container" tabindex="0" title="More Information" role="img" aria-label="More Information">
                <svg viewBox="0 -960 960 960" class="hint-icon" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M419-334q1-87 20.5-129t65.5-76q39-31 57.5-61.109T581-666q0-39-25.5-64.5T486-756q-46 0-75 26t-43 67l-120-52q27-74 87-120.5T485.756-882q109.228 0 168.236 62.148Q713-757.703 713-669q0 60-21 105.5T625-478q-46 40-57 65.5T557-334H419Zm66.788 282Q447-52 420-79t-27-65.496q0-38.495 26.92-65.5Q446.841-237 485.92-237 525-237 552-209.996q27 27.005 27 65.5Q579-106 551.788-79q-27.213 27-66 27Z"></path>
                </svg>
            </span>
        </h2>
        <span class="subtitle">${options.subTitleText}</span>
        <div data-g4-role="summary"></div>`;

        // Insert the HTML structure into the title container.
        titleContainer.insertAdjacentHTML('beforeend', html);

        // Select the hint icon element to attach the click event listener.
        const iconElement = titleContainer.querySelector('[role="img"]');

        // Select the hint container where the hint text will be toggled.
        const hintContainer = titleContainer.querySelector('[data-g4-role="summary"]');

        // Add event listener to the hint icon to toggle the hint text on click.
        iconElement.addEventListener('click', () => switchHint(hintContainer, options.helpText));

        // Append the populated title container to the provided parent container if specified.
        if (options.container) {
            options.container.appendChild(titleContainer);
        }

        // Return the updated container for potential further use by the calling code.
        return options.container ? options.container : titleContainer;
    }
}
