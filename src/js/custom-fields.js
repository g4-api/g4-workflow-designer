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

    // Set the g4-role attribute to 'field' for the field container
    titleContainer.setAttribute('g4-role', 'field');
    titleContainer.id = `${id}-field`;

    // Set the g4-role attribute to 'label' for the label container
    labelContainer.setAttribute('g4-role', 'label');
    labelContainer.id = `${id}-label`;

    // Set the g4-role and id attributes to for the hint container
    hintContainer.setAttribute('g4-role', 'hint');
    hintContainer.id = `${id}-hint`;

    // Set g4-role attribute to 'controller' for the controller container
    controllerContainer.setAttribute('g4-role', 'controller');
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
 * `g4-role="controller"` attribute. The main container is marked with `g4-role="field"`.
 *
 * @param {string} id - A unique identifier used to assign IDs to the field and controller containers.
 * @returns {HTMLDivElement} - The constructed field container element containing the controller.
 *
 * @example
 * const container = newUnlabeledFieldContainer('uniqueId123');
 * document.body.appendChild(container);
 * // This will append the following HTML structure to the body:
 * // <div g4-role="field" id="uniqueId123-field">
 * //   <div g4-role="controller" id="uniqueId123-controller"></div>
 * // </div>
 */
const newUnlabeledFieldContainer = (id) => {
    // Create the main field container div element.
    const fieldContainer = document.createElement('div');

    // Create the controller sub-container div element.
    const controllerContainer = document.createElement('div');

    // Set the custom attribute 'g4-role' to 'field' for the main container.
    fieldContainer.setAttribute('g4-role', 'field');

    // Assign a unique ID to the main field container using the provided 'id'.
    fieldContainer.id = `${id}-field`;

    // Set the custom attribute 'g4-role' to 'controller' for the controller container.
    controllerContainer.setAttribute('g4-role', 'controller');

    // Assign a unique ID to the controller container using the provided 'id'.
    controllerContainer.id = `${id}-controller`;

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
 * @returns {HTMLDetailsElement} - The constructed `details` container element containing the summary and field container.
 *
 * @example
 * const container = newMultipleFieldsContainer('uniqueId123', 'User Details', 'Click to expand and view user details');
 * document.body.appendChild(container);
 * // This will append the following HTML structure to the body:
 * // <details>
 * //   <summary title="Click to expand and view user details">User Details</summary>
 * //   <div>
 * //     <div g4-role="field" id="uniqueId123-field">
 * //       <div g4-role="controller" id="uniqueId123-controller"></div>
 * //     </div>
 * //   </div>
 * // </details>
 */
const newMultipleFieldsContainer = (id, labelDisplayName, hintText) => {
    // Create the main <details> container element.
    const detailsContainer = document.createElement('details');

    // Create the <summary> element that serves as the clickable label.
    const summaryContainer = document.createElement('summary');

    // Create the content <div> that will hold the field container.
    const contentContainer = document.createElement('div');

    // Create an unlabeled field container using the provided 'id'.
    const fieldContainer = newUnlabeledFieldContainer(id);

    // Set the display text of the summary label.
    summaryContainer.textContent = labelDisplayName;

    // Set the tooltip text for the summary label.
    summaryContainer.title = hintText;

    // Append the field container to the content area.
    contentContainer.appendChild(fieldContainer);

    // Append the summary and content containers to the main <details> container.
    detailsContainer.appendChild(summaryContainer);
    detailsContainer.appendChild(contentContainer);

    // Return the fully constructed <details> container.
    return detailsContainer;
};

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
        const fieldContainer = newMultipleFieldsContainer(inputId, label, title);

        // Select the controller sub-container within the field container using the unique ID.
        const controller = fieldContainer.querySelector(`#${id}-controller`);

        // Create a new string input field for the "Username" with an empty initial value or the provided initial username.
        CustomFields.newStringField(
            controller,                                          // Parent element to append the username field.
            {},
            'Username',                                          // Label for the username input field.
            'A valid G4™ username required for authentication.', // Description tooltip for the username input field.
            initialValue?.username || '',                        // Initial value for the username field; defaults to an empty string if undefined.
            false,                                               // Read-only flag; set to false to allow user input.
            (value) => {
                const authentication = {
                    username: value
                };
                setCallback(authentication);
            }
        );

        // Create a new string input field for the "Password" with an empty initial value or the provided initial password.
        CustomFields.newStringField(
            controller,                                          // Parent element to append the password field.
            {},
            'Password',                                          // Label for the password input field.
            'A valid G4™ password required for authentication.', // Description tooltip for the password input field.
            initialValue?.password || '',                        // Initial value for the password field; defaults to an empty string if undefined.
            false,                                               // Read-only flag; set to false to allow user input.
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
        const fieldContainer = newMultipleFieldsContainer(inputId, label, title);

        // Select the controller sub-container within the field container using the unique ID.
        const controller = fieldContainer.querySelector(`#${id}-controller`);

        // Create a new number input field for the "LoadTimeout".
        CustomFields.newNumberField(
            controller,
            "LoadTimeout",
            "The maximum time (in milliseconds) the driver should wait for a page to load when setting the `IWebDriver.Url` property.",
            initialValue?.loadTimeout || 60000,
            1,
            false,
            (value) => {
                const automationSettings = {
                    loadTimeout: value
                };
                setCallback(automationSettings);
            }
        );

        // Create a new number input field for the "MaxParallel".
        CustomFields.newNumberField(
            controller,
            "MaxParallel",
            "The number of parallel rows to execute actions based on `G4DataProvider`.",
            initialValue?.maxParallel || 1,
            1,
            false,
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
            controller,
            "ReturnFlatResponse",
            "A valid G4 username and password are required to authenticate and authorize automation requests.",
            initialValue?.returnFlatResponse || false,
            (value) => {
                const automationSettings = {
                    returnFlatResponse: convertStringToBool(value)
                };
                setCallback(automationSettings);
            }
        );

        // Create a new switch field for the "ReturnStructuredResponse".
        CustomFields.newSwitchField(
            controller,
            "ReturnStructuredResponse",
            "A valid G4 username and password are required to authenticate and authorize automation requests.",
            initialValue?.returnStructuredResponse || false,
            (value) => {
                const automationSettings = {
                    returnStructuredResponse: convertStringToBool(value)
                };
                setCallback(automationSettings);
            }
        );

        // Create a new number input field for the "SearchTimeout".
        CustomFields.newNumberField(
            controller,
            "SearchTimeout",
            "The maximum time (in milliseconds) to wait for an element to be found during searches.",
            initialValue?.searchTimeout || 15000,
            1,
            false,
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
        const fieldContainer = newMultipleFieldsContainer(inputId, label, title);

        // Select the controller sub-container within the field container using the escaped unique ID.
        const controller = fieldContainer.querySelector(`#${escapedId}-controller`);

        // Create a new string field for Default Environment.
        CustomFields.newStringField(
            controller,
            {},
            'DefaultEnvironment',
            'The default environment to use for automation requests.',
            initialValue?.defaultEnvironment || 'SystemParameters',
            false,
            (value) => {
                const environmentSettings = {
                    defaultEnvironment: value
                };
                setCallback(environmentSettings);
            }
        );

        // Create a new switch field for Return Environment.
        CustomFields.newSwitchField(
            controller,
            'ReturnEnvironment',
            'Indicates whether the environment should be returned in the response.',
            initialValue?.returnEnvironment || false,
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

    static newExceptionsSettingsField(container, label, title, initialValue, setCallback) {
        // Generate a unique identifier for the environment settings fields.
        const inputId = newUid();

        // Escape the unique identifier to ensure it's safe for use in CSS selectors.
        const escapedId = CSS.escape(inputId);

        // Create a container with multiple environment settings fields using the provided ID, label, and title.
        const fieldContainer = newMultipleFieldsContainer(inputId, label, title);

        // Select the controller sub-container within the field container using the escaped unique ID.
        const controller = fieldContainer.querySelector(`#${escapedId}-controller`);

        // Create a new switch field for Return Environment.
        CustomFields.newSwitchField(
            controller,
            'ReturnExceptions',
            'Indicates whether the exceptions should be returned in the response.',
            initialValue?.returnExceptions || false,
            (value) => {
                const exceptionsSettings = {
                    returnExceptions: convertStringToBool(value)
                };
                setCallback(exceptionsSettings);
            }
        );

        // Append the fully constructed environment settings field container to the provided parent container in the DOM.
        container.appendChild(fieldContainer);

        // Return the parent container with the appended environment settings field for further manipulation if needed.
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
            // This container is expected to be inside an element with g4-role="controller".
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
            newInput.setAttribute('g4-role', 'valueitem');
            newInput.setAttribute('title', value);

            // Create the remove button. Clicking it removes the entire row from the container.
            const removeButton = document.createElement('button');
            removeButton.type = 'button';
            removeButton.textContent = '-';
            removeButton.onclick = function () {
                // On button click, remove the entire row from the container.
                container.removeChild(row);

                // Find the closest field container by locating the parent with [g4-role="field"].
                // Then select the controller element that contains the inputs.
                const titleContainer = container.closest('[g4-role="field"]').querySelector('[g4-role="controller"]');

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
         * Gathers values from all inputs within a container that are marked with g4-role="valueitem".
         * Filters out null, undefined, or empty (after trimming whitespace) values.
         * Sends the resulting array of cleaned values to the provided setCallback() function.
         * 
         * @param {HTMLElement} container - The DOM element that contains the input elements.
         */
        function callback(container) {
            // Find all input elements with the g4-role="valueitem" attribute.
            const inputs = container.querySelectorAll('input[g4-role="valueitem"]');

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
        const controllerContainer = fieldContainer.querySelector('[g4-role="controller"]');

        // Set up the initial HTML structure:
        // - A text input with a "+" button above it.
        // - A div (input-container) that will hold additional rows created by the "+" button.
        const html = `
            <div class="text-with-button">
                <button type="button">+</button>
                <input type="text" g4-role="valueitem" title="${mainInputValue}" value="${mainInputValue}" />
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
     * Creates a new dropdown (list field) UI element and appends it to the specified container.
     *
     * @param {HTMLElement}  container    - The parent container to which the field will be added.
     * @param {string}       label        - The label for the dropdown field.
     * @param {string}       title        - The tooltip text that appears when hovering over the combo-box.
     * @param {string}       initialValue - The initial value to populate the input field with.
     * @param {string|Array} itemsSource  - A string representing the type of items to fetch from the cache,
     *                                      or an array of options to populate the dropdown.
     * @param {Function}     setCallback  - A callback function invoked when the user selects an option.
     */
    static newDataListField(container, label, title, initialValue, itemsSource, setCallback) {
        const getItems = (itemsSource) => {
            // Determine the items for the dropdown.
            let items;
            if (typeof itemsSource === 'string') {
                // Retrieve items from the cache if the source is a string (itemsType).
                items = (itemsSource in _cache) ? _cache[itemsSource] : {};
                items = Object.keys(items).reduce((obj, key) => {
                    const item = items[key];
                    const manifestKey = item?.manifest?.key || 'No key available';
                    obj[manifestKey] = { manifest: { summary: item?.manifest?.summary || ['No summary available'] } };
                    return obj;
                }, {});
            } else if (Array.isArray(itemsSource)) {
                // Use the provided array as the list of items.
                items = itemsSource.reduce((obj, item) => {
                    const key = item.name || 'No name available';
                    obj[key] = { manifest: { summary: item.description } };
                    return obj;
                }, {});
            } else {
                throw new Error('Invalid itemsSource type. Must be a string or an array.');
            }

            // Sort the items alphabetically by key.
            items = Object.keys(items).sort().reduce((obj, key) => {
                obj[key] = items[key];
                return obj;
            }, {});

            // Return the sorted items.
            return items;
        }

        // Generate a unique ID for the textarea element.
        const inputId = newUid();

        // Convert the label from PascalCase to a space-separated format for display.
        const labelDisplayName = convertPascalToSpaceCase(label);

        // Determine the items for the dropdown.
        const items = getItems(itemsSource);

        // Set the initial value to an empty string if it is not defined or is NaN.
        initialValue = !initialValue || initialValue === NaN || initialValue === 'undefined'
            ? ''
            : initialValue;

        // Start building the HTML structure for the dropdown field.
        let html = `
        <input list="${inputId}-datalist" title="${initialValue === '' ? 'Please select an option' : initialValue}" />
        <datalist id="${inputId}-datalist">
            <option value="" disabled selected>-- Please select an option --</option>`;

        // Add options to the dropdown for each item.
        Object.keys(items).forEach(key => {
            const summary = items[key].manifest?.summary || ['No summary available'];
            const hint = summary.join("\n");
            html += `  <option value="${key}" label="${hint}">${convertPascalToSpaceCase(key)}</option>\n`;
        });

        // Close the select element in the HTML.
        html += '</datalist>';

        // Create a new field container div with a label and icon.
        const fieldContainer = newFieldContainer(inputId, labelDisplayName, title);

        // Select the controller container within the field container.
        const controllerContainer = fieldContainer.querySelector('[g4-role="controller"]');

        // Set the inner HTML of the field container to the constructed dropdown.
        controllerContainer.insertAdjacentHTML('beforeend', html);

        // Get a reference to the `select` element within the field container.
        const input = controllerContainer.querySelector('input ');
        input.value = initialValue;

        // Attach an event listener to handle user input and invoke the callback with the selected value.
        fieldContainer.addEventListener('input', () => {
            input.title = input.value;
            setCallback(input.value);
        });

        // Append the field container to the parent container.
        container.appendChild(fieldContainer);

        // Return the field container for further manipulation if needed.
        return container;
    }

    /**
     * Creates a new key-value field in the provided container.
     * 
     * This field allows the user to input pairs of keys and values, add new pairs, or remove existing pairs.
     * The resulting set of key-value pairs is sent to a callback function whenever changes occur.
     *
     * @param {HTMLElement} container    - The DOM element where the new key-value field will be appended.
     * @param {string}      label        - A label for the field, usually provided in PascalCase (e.g., "MyLabel").
     * @param {string}      title        - A title (tooltip) for the field container.
     * @param {Object}      initialValue - An object containing initial key-value pairs.
     * @param {Function}    setCallback  - A callback function that will be called with the updated dictionary of key-value pairs.
     */
    static newKeyValueField(container, label, title, initialValue, setCallback) {
        // Generate a unique ID to associate with this field's elements.
        const inputId = newUid();

        // Escape the ID for safe use in CSS selectors.
        const escapedId = CSS.escape(inputId);

        /**
         * Adds a new input row for a key-value pair when the "+" button is clicked.
         * Finds the container that holds multiple input rows and appends a new one.
         * 
         * @returns {HTMLDivElement|undefined} The newly created row element, or undefined if the container is not found.
         */
        function newInputCallback() {
            // Locate the container that will hold new input rows, identified by the escaped ID.
            const container = document.querySelector(`#${escapedId}-controller > #${escapedId}-input-container`);

            // If the container is not found, return without doing anything.
            if (!container) {
                return;
            }

            // Create a new input row with no initial key/value.
            return newInput(container, undefined, undefined);
        }

        /**
         * Creates a new input row with fields for a key and a value, and a remove button.
         * Each row:
         * - Has a "key" input field.
         * - Has a "value" input field.
         * - Has a remove button to delete the row.
         *
         * @param {HTMLElement} container - The container to which the new input row will be added.
         * @param {string} [key]          - Optional initial value for the key input field.
         * @param {string} [value]        - Optional initial value for the value input field.
         * @returns {HTMLDivElement} The created row element containing the key and value inputs.
         */
        function newInput(container, key, value) {
            // Create a row div for holding the key input, value input, and remove button together.
            const row = document.createElement('div');
            row.className = 'text-with-button input-row';
            row.setAttribute('g4-role', 'keyvalue');

            // Create the key input and set its initial value and attributes.
            const newKeyInput = document.createElement('input');
            newKeyInput.type = 'text';
            newKeyInput.value = key || '';
            newKeyInput.setAttribute('g4-role', 'key');
            newKeyInput.setAttribute('title', `Key: ${key || ''}`);

            // Create the value input and set its initial value and attributes.
            const newValueInput = document.createElement('input');
            newValueInput.type = 'text';
            newValueInput.value = value || '';
            newValueInput.setAttribute('g4-role', 'value');
            newValueInput.setAttribute('title', `Value: ${value || ''}`);

            // Create the remove button. Clicking it removes the entire row.
            const removeButton = document.createElement('button');
            removeButton.type = 'button';
            removeButton.textContent = '-';
            removeButton.title = "Remove Key/Value Pair";
            removeButton.onclick = function () {
                // Remove this row from the container when clicked.
                container.removeChild(row);

                // // Find the closest [g4-role="field"] container, then locate the controller within it.
                // const fieldContainer = container.closest('[g4-role="field"]');
                // if (fieldContainer) {
                //     const titleContainer = fieldContainer.querySelector('[g4-role="controller"]');

                //     // After removing a row, update the values via the callback.
                //     callback(titleContainer);
                // }
            };

            // Append the remove button, key input, and value input into the row.
            // Note: The order is remove button first, then key, then value, but can be adjusted as needed.
            row.appendChild(removeButton);
            row.appendChild(newKeyInput);
            row.appendChild(newValueInput);

            // Add the completed row to the container.
            container.appendChild(row);

            // Return the row element in case further processing is needed by the caller.
            return row;
        }

        /**
         * Collects all key-value pairs from rows marked with [g4-role="keyvalue"].
         * 
         * Process:
         * 1. Find all elements with [g4-role="keyvalue"] inside the container.
         * 2. Extract the key and value from each row.
         * 3. If the key is non-empty, add the key-value pair to a resulting dictionary.
         * 4. Update the title attributes for each input to reflect the current values.
         * 5. Pass the final dictionary of pairs to setCallback().
         *
         * @param {HTMLElement} container - The DOM element that contains the key-value input elements.
         */
        function callback(container) {
            // Find all row elements with [g4-role="keyvalue"].
            const inputs = container.querySelectorAll('div[g4-role="keyvalue"]');
            const inputArray = Array.from(inputs);

            // Build a dictionary of key-value pairs from the input rows.
            const values = inputArray.reduce((dictionary, input) => {
                const keyInput = input.querySelector('input[g4-role="key"]');
                const valueInput = input.querySelector('input[g4-role="value"]');

                // Extract and trim the key and value. If missing, default to an empty string.
                const key = keyInput ? keyInput.value.trim() : '';
                const val = valueInput ? valueInput.value.trim() : '';

                // Only add the pair if the key is not empty.
                if (key !== '') {
                    dictionary[key] = val;
                }

                // Update the title attributes for better tooltip/context information.
                if (keyInput) keyInput.title = key;
                if (valueInput) valueInput.title = val;

                return dictionary;
            }, {});

            // Pass the dictionary to the setCallback function.
            setCallback(values);
        }

        // If initialValue is provided, populate the first input and create subsequent inputs.
        const values = initialValue || {};
        const keys = Object.keys(values);

        // The main field will get the first key-value pair (if any).
        const mainInputKey = keys.length > 0 ? keys.shift() : '';
        const mainKey = mainInputKey || '';
        const mainValue = mainInputKey ? values[mainInputKey] : '';

        // Convert the label from PascalCase to spaced words for readability.
        const labelDisplayName = convertPascalToSpaceCase(label);

        // Create a new field container with a label, title, and optionally an icon.
        const fieldContainer = newFieldContainer(inputId, labelDisplayName, title);

        // Find the controller container, where the main input and additional rows will be added.
        const controllerContainer = fieldContainer.querySelector('[g4-role="controller"]');

        // Set up the initial HTML structure with a "keyvalue" row and a container for extra rows.
        const html = `
        <div g4-role="keyvalue" class="text-with-button">
            <button type="button" title="Add Key/Value Pair">+</button>
            <input type="text" g4-role="key" title="Key: ${mainKey}" value="${mainKey}" />
            <input type="text" g4-role="value" title="Value: ${mainValue}" value="${mainValue}" />
        </div>
        <div id="${inputId}-input-container"></div>`;

        // Insert the initial row and container into the controller.
        controllerContainer.insertAdjacentHTML('beforeend', html);

        // Attach the event handler for the "+" button.
        const addButton = controllerContainer.querySelector('button');
        addButton.addEventListener('click', newInputCallback);

        // Add the entire field container to the main container.
        container.appendChild(fieldContainer);

        // For any remaining keys, create additional input rows.
        const inputContainer = fieldContainer.querySelector(`#${escapedId}-input-container`);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const value = values[key];
            newInput(inputContainer, key, value);
        }

        // Listen for changes and update values whenever the user types in any input field.
        fieldContainer.addEventListener('input', () => {
            callback(fieldContainer);
        });

        // Return the field container for potential further use by the calling code.
        return fieldContainer;
    }

    /**
     * Creates a new dropdown (list field) UI element and appends it to the specified container.
     *
     * @param {HTMLElement}  container    - The parent container to which the field will be added.
     * @param {string}       label        - The label for the dropdown field.
     * @param {string}       title        - The tooltip text that appears when hovering over the combo-box.
     * @param {string}       initialValue - The initial value to populate the input field with.
     * @param {string|Array} itemsSource  - A string representing the type of items to fetch from the cache,
     *                                      or an array of options to populate the dropdown.
     * @param {Function}     setCallback  - A callback function invoked when the user selects an option.
     */
    static newListField(container, label, title, initialValue, itemsSource, setCallback) {
        const getItems = (itemsSource) => {
            // Determine the items for the dropdown.
            let items;
            if (typeof itemsSource === 'string') {
                // Retrieve items from the cache if the source is a string (itemsType).
                items = (itemsSource in _cache) ? _cache[itemsSource] : {};
                items = Object.keys(items).reduce((obj, key) => {
                    const item = items[key];
                    const manifestKey = item?.manifest?.key || 'No key available';
                    obj[manifestKey] = { manifest: { summary: item?.manifest?.summary || ['No summary available'] } };
                    return obj;
                }, {});
            } else if (Array.isArray(itemsSource)) {
                // Use the provided array as the list of items.
                items = itemsSource.reduce((obj, item) => {
                    const key = item.name || 'No name available';
                    obj[key] = { manifest: { summary: item.description } };
                    return obj;
                }, {});
            } else {
                throw new Error('Invalid itemsSource type. Must be a string or an array.');
            }

            // Sort the items alphabetically by key.
            items = Object.keys(items).sort().reduce((obj, key) => {
                obj[key] = items[key];
                return obj;
            }, {});

            // Return the sorted items.
            return items;
        }

        // Generate a unique ID for the textarea element.
        const inputId = newUid();

        // Convert the label from PascalCase to a space-separated format for display.
        const labelDisplayName = convertPascalToSpaceCase(label);

        // Determine the items for the dropdown.
        const items = getItems(itemsSource);

        // Set the initial value to an empty string if it is not defined or is NaN.
        initialValue = !initialValue || initialValue === NaN || initialValue === 'undefined'
            ? ''
            : initialValue;

        // Start building the HTML structure for the dropdown field.
        let html = `
        <select title="${initialValue === '' ? 'Please select an option' : initialValue}">
            <option value="" disabled selected>-- Please select an option --</option>`;

        // Add options to the dropdown for each item.
        Object.keys(items).forEach(key => {
            const summary = items[key].manifest?.summary || ['No summary available'];
            html += `  <option value="${key}" title="${summary.join("\n")}">${convertPascalToSpaceCase(key)}</option>\n`;
        });

        // Close the select element in the HTML.
        html += '</select>';

        // Create a new field container div with a label and icon.
        const fieldContainer = newFieldContainer(inputId, labelDisplayName, title);

        // Select the controller container within the field container.
        const controllerContainer = fieldContainer.querySelector('[g4-role="controller"]');

        // Set the inner HTML of the field container to the constructed dropdown.
        controllerContainer.insertAdjacentHTML('beforeend', html);

        // Get a reference to the `select` element within the field container.
        const select = controllerContainer.querySelector('select');
        select.value = initialValue;

        // Attach an event listener to handle user input and invoke the callback with the selected value.
        fieldContainer.addEventListener('input', () => {
            select.title = select.value;
            setCallback(select.value);
        });

        // Append the field container to the parent container.
        container.appendChild(fieldContainer);

        // Return the container for potential further use by the calling code.
        return container;
    }

    /**
     * Creates a labeled text input field inside a given container.
     *
     * @param {HTMLElement} container    - The parent element where this new field will be appended.
     * @param {string}      label        - The label for the input, provided in PascalCase (e.g., "UserName").
     * @param {string}      title        - The tooltip text displayed when hovering over the input field.
     * @param {string}      initialValue - The initial value that the input field will display.
     * @param {boolean}     isReadonly   - If true, the input field is set to read-only mode.
     * @param {Function}    setCallback  - A callback function invoked whenever the input's value changes.
     */
    static newNameField(container, label, title, initialValue, step, isReadonly, setCallback) {
        // Generate a unique ID for the textarea element.
        const inputId = newUid();

        // Cache the aliases for the current step.
        const aliases = step.aliases;

        // Convert the plugin name from PascalCase to a space-separated format for display.
        const pluginName = convertPascalToSpaceCase(step.pluginName);

        // Convert the label from PascalCase to a space-separated format for display.
        const labelDisplayName = convertPascalToSpaceCase(label);

        // Set the initial value to an empty string if it is not defined or is NaN.
        initialValue = !initialValue || initialValue === NaN || initialValue === 'undefined'
            ? ''
            : initialValue;

        // Start building the HTML structure for the dropdown field.
        let html = `
        <input 
            list="${inputId}-aliases" 
            data-g4-attribute="${label}" 
            title="${initialValue === '' ? 'Please select a different alias' : initialValue}" 
            type="text" 
            spellcheck='false'
            value='${initialValue}' />`;

        if (aliases && aliases.length > 0) {
            html += `
            <datalist id="${inputId}-aliases">
                <option value="${pluginName}" label="${step.pluginName}">${pluginName}</option>\n`;

            // Add options to the dropdown for each item.
            aliases.forEach(alias => {
                const formattedAlias = convertPascalToSpaceCase(alias);
                html += `  <option value="${formattedAlias}" label="${alias}">${convertPascalToSpaceCase(formattedAlias)}</option>\n`;
            });

            // Close the select element in the HTML.
            html += '</datalist>';
        }

        // Create a new field container div with a label and icon.
        const fieldContainer = newFieldContainer(inputId, labelDisplayName, title);

        // Select the controller container within the field container.
        const controllerContainer = fieldContainer.querySelector('[g4-role="controller"]');

        // Set the inner HTML of the field container to the constructed input controller.
        controllerContainer.insertAdjacentHTML('beforeend', html);

        // Select the input element within the field container
        const input = controllerContainer.querySelector('input');

        // If the field should be read-only, set the 'readonly' attribute on the input
        if (isReadonly) {
            input.setAttribute('readonly', 'readonly');
        }

        // Add an event listener to handle input changes and invoke the callback with the new value
        fieldContainer.addEventListener('input', () => {
            input.title = input.value;
            setCallback(input.value);
        });

        // Append the field container to the parent container.
        container.appendChild(fieldContainer);

        // Return the container for potential further use by the calling code.
        return container;
    }

    /**
     * Creates and appends a new number input field to the specified container.
     *
     * @param {HTMLElement}   container     - The parent element to which the number field will be appended.
     * @param {string}        label         - The identifier for the number field, expected in PascalCase format.
     * @param {string}        title         - The title attribute for the input element, typically used for tooltips.
     * @param {string|number} initialValue  - The initial value to populate the input field. Defaults to an empty string if invalid.
     * @param {number}        step          - The step attribute for the input element, determining the legal number intervals.
     * @param {boolean}       isReadonly    - Determines if the input field should be read-only.
     * @param {function}      [setCallback] - An optional callback function invoked whenever the input value changes.
     */
    static newNumberField(container, label, title, initialValue, step, isReadonly, setCallback) {
        // Generate a unique ID for the input element to ensure uniqueness in the DOM.
        const inputId = newUid();

        // Convert the label from PascalCase to a space-separated format for user-friendly display.
        const labelDisplayName = convertPascalToSpaceCase(label);

        // Validate and set the initial value. If invalid (undefined, NaN, or 'undefined'), default to an empty string.
        initialValue = (!initialValue || isNaN(initialValue) || initialValue === 'undefined') ? '' : initialValue;

        // Construct the HTML string for the number input element with necessary attributes.
        const html = `
        <input 
            id="${inputId}"
            data-g4-attribute="${label}" 
            title="${initialValue}" 
            type="number" 
            step="${step}"
            value="${initialValue}" />`;

        // Create a new field container div that includes a label and an optional icon.
        const fieldContainer = newFieldContainer(inputId, labelDisplayName, title);

        // Select the controller container within the field container where the input will be inserted.
        const controllerContainer = fieldContainer.querySelector('[g4-role="controller"]');

        // Insert the constructed input HTML into the controller container.
        controllerContainer.insertAdjacentHTML('beforeend', html);

        // Retrieve the input element from the controller container for further manipulation.
        const input = controllerContainer.querySelector('input');

        // If the field is marked as read-only, set the 'readonly' attribute on the input element.
        if (isReadonly) {
            input.setAttribute('readonly', 'readonly');
        }

        // Add an event listener to the field container to handle input events if a callback is provided.
        if (typeof setCallback === 'function') {
            fieldContainer.addEventListener('input', () => {
                // Update the title attribute to reflect the current input value, useful for tooltips.
                input.title = input.value;

                // Invoke the callback function with the new input value.
                setCallback(input.value);
            });
        }

        // Append the fully constructed field container to the specified parent container in the DOM.
        container.appendChild(fieldContainer);

        // Return the container for potential further use by the calling code.
        return container;
    }

    /**
     * Creates and appends a labeled textarea field to a specified container.
     *
     * @param {HTMLElement} container    - The DOM element to which the textarea field will be appended.
     * @param {number}      step         - A step identifier or index (usage depends on implementation context).
     * @param {string}      label        - The label text for the textarea, typically in PascalCase.
     * @param {string}      title        - The tooltip text that appears when hovering over the textarea.
     * @param {string}      initialValue - The initial content/value of the textarea.
     * @param {boolean}     isReadonly   - Determines if the textarea should be read-only.
     * @param {Function}    setCallback  - A callback function invoked whenever the textarea's value changes.
     *
     * @returns {void}
     *
     * @example
     * newStringField(
     *   document.getElementById('form-container'),
     *   1,
     *   'UserDescription',
     *   'Enter your description here.',
     *   'Initial description...',
     *   false,
     *   (value) => { console.log('Textarea value:', value); }
     * );
     */
    static newStringField(container, step, label, title, initialValue, isReadonly, setCallback) {
        /**
         * Adjusts the size of the textarea dynamically based on its content
         * and invokes the callback with the current value.
         *
         * @param {HTMLTextAreaElement} textarea - The textarea element to resize and process.
         */
        const callback = (textarea) => {
            // Reset the height to auto to calculate the scroll height dynamically.
            textarea.style.height = 'auto';

            // Calculate the required height based on the content.
            const contentHeight = textarea.scrollHeight;
            const computedStyle = window.getComputedStyle(textarea);
            const lineHeight = parseFloat(computedStyle.lineHeight);
            const minHeight = parseFloat(computedStyle.minHeight);
            const maxLines = 8;
            const maxHeight = lineHeight * maxLines;

            if (contentHeight <= maxHeight) {
                // If content height is within the limit, adjust height and hide the scrollbar.
                textarea.style.height = contentHeight > minHeight ? `${contentHeight}px` : `${minHeight}px`;
                textarea.style.overflowY = 'hidden';
            } else {
                // If content exceeds the limit, set height to maxHeight and enable the scrollbar.
                textarea.style.height = `${maxHeight}px`;
                textarea.style.overflowY = contentHeight === 0 ? 'hidden' : 'scroll';
            }

            // Invoke the callback function with the current textarea value.
            setCallback(textarea.value);
        };

        // Generate a unique ID for the textarea element.
        const inputId = newUid();

        // Convert the label from PascalCase to a space-separated format for display.
        const labelDisplayName = convertPascalToSpaceCase(label);

        // Set the initial value to an empty string if it is not defined or is NaN.
        initialValue = !initialValue || initialValue === NaN || initialValue === 'undefined'
            ? ''
            : initialValue;

        // Create the textarea element.
        const textareaElement = document.createElement('textarea');
        textareaElement.setAttribute('id', inputId);               // Assign the unique ID.
        textareaElement.setAttribute('rows', '1');                 // Set the initial number of rows.
        textareaElement.setAttribute('wrap', 'off');               // Disable text wrapping.
        textareaElement.setAttribute('data-g4-attribute', label);  // Custom data attribute for context.
        textareaElement.setAttribute('spellcheck', 'false');       // Disable spellcheck.
        textareaElement.setAttribute('title', initialValue);       // Set the tooltip text.
        textareaElement.value = initialValue;                      // Set the initial value.

        // Create a new field container div with a label and icon.
        const fieldContainer = newFieldContainer(inputId, labelDisplayName, title);

        // Select the controller container within the field container.
        const id = CSS.escape(inputId);
        const controllerContainer = fieldContainer.querySelector(`#${id}-controller`);

        // Append the textarea to the container div.
        controllerContainer.appendChild(textareaElement);

        // If the textarea is read-only, set the readonly attribute.
        if (isReadonly) {
            textareaElement.setAttribute('readonly', 'readonly');
        }

        // Attach an event listener to handle input events for resizing and value changes.
        if (setCallback) {
            fieldContainer.addEventListener('input', () => {
                textareaElement.title = textareaElement.value;
                callback(textareaElement);
            });
        }

        // Append the field container to the parent container.
        container.appendChild(fieldContainer);

        // Return the textarea element for potential further use by calling code.
        return container;
    }

    /**
     * Creates a new switch field (dropdown) for selecting between "True" and "False" options.
     *
     * @param {HTMLElement} container    - The parent container to which the switch field will be added.
     * @param {string}      label        - The label for the switch field, displayed above the dropdown.
     * @param {string}      title        - The tooltip text for the switch field.
     * @param {boolean}     initialValue - The initial value of the switch (true/false).
     * @param {Function}    setCallback  - A callback function invoked whenever the value changes.
     */
    static newSwitchField(container, label, title, initialValue, setCallback) {
        // Generate a unique ID for the dropdown field.
        const inputId = newUid();

        // Convert the label from PascalCase to a human-readable space-separated format.
        const labelDisplayName = convertPascalToSpaceCase(label);

        // Ensure the initial value is a valid boolean or set it to `false` by default.
        initialValue = !initialValue || initialValue === NaN || initialValue === undefined
            ? false
            : initialValue;

        // Build the HTML structure for the dropdown field.
        let html = `
        <select data-g4-attribute="${label}" title="${initialValue}">
            <option value="" disabled selected>-- Please select an option --</option>
            <option value="true" title="Activate switch">True</option>
            <option value="false" title="Deactivate switch">False</option>
        </select>`;

        // Create a new container for the field, including a label and an optional title icon.
        const fieldContainer = newFieldContainer(inputId, labelDisplayName, title);

        // Find the controller container where the dropdown will be inserted.
        const controllerContainer = fieldContainer.querySelector('[g4-role="controller"]');

        // Add the dropdown HTML to the controller container.
        controllerContainer.insertAdjacentHTML('beforeend', html);

        // Select the dropdown element within the container.
        const select = controllerContainer.querySelector('select');
        select.value = initialValue;

        // Attach an event listener to handle value changes.
        if (setCallback) {
            fieldContainer.addEventListener('input', () => {
                select.title = select.value;
                setCallback(select.value);
            });
        }

        // Append the fully constructed title container to the parent container.
        container.appendChild(fieldContainer);

        // Return the container for potential further use by the calling code.
        return container;
    }

    /**
     * Creates and appends a new text input field to the specified container.
     *
     * @param {HTMLElement}   container    - The parent element to which the text field will be appended.
     * @param {string}        label        - The identifier for the text field, expected in PascalCase format.
     * @param {string}        title        - The title attribute for the input element, typically used for tooltips.
     * @param {string|number} initialValue - The initial value to populate the input field. Defaults to an empty string if invalid.
     * @param {number}        step         - (Optional) The step attribute for the input element. Not used in the current implementation.
     * @param {boolean}       isReadonly   - Determines if the input field should be read-only.
     * @param {function}      setCallback  - A callback function invoked whenever the input value changes.
     */
    static newTextField(container, label, title, initialValue, step, isReadonly, setCallback) {
        // Generate a unique ID for the input element.
        const inputId = newUid();

        // Convert the label from PascalCase to a space-separated format for display purposes.
        const labelDisplayName = convertPascalToSpaceCase(label);

        // Validate and set the initial value. If invalid (undefined, NaN, or 'undefined'), default to an empty string.
        initialValue = (!initialValue || isNaN(initialValue) || initialValue === 'undefined') ? '' : initialValue;

        // Construct the HTML string for the text input element with necessary attributes.
        const html = `
        <input 
            data-g4-attribute="${label}" 
            title="${initialValue}" 
            type="text" 
            spellcheck="false"
            value="${initialValue}" />`;

        // Create a new field container div that includes a label and an optional icon.
        const fieldContainer = newFieldContainer(inputId, labelDisplayName, title);

        // Select the controller container within the field container where the input will be inserted.
        const controllerContainer = fieldContainer.querySelector('[g4-role="controller"]');

        // Insert the constructed input HTML into the controller container.
        controllerContainer.insertAdjacentHTML('beforeend', html);

        // Retrieve the input element from the controller container for further manipulation.
        const input = controllerContainer.querySelector('input');

        // If the field is marked as read-only, set the 'readonly' attribute on the input element.
        if (isReadonly) {
            input.setAttribute('readonly', 'readonly');
        }

        // Add an event listener to the field container to handle input events.
        // When the input value changes, update the title attribute and invoke the callback with the new value.
        fieldContainer.addEventListener('input', () => {
            input.title = input.value;
            setCallback(input.value);
        });

        // Append the fully constructed field container to the specified parent container in the DOM.
        container.appendChild(fieldContainer);

        // Return the container for potential further use by the calling code.
        return container;
    }

    /**
     * Creates and appends a new title section to the specified container.
     *
     * @param {HTMLElement} container    - The DOM element to which the new title section will be appended.
     * @param {string}      titleText    - The main title text to be displayed as an `<h2>` element.
     * @param {string}      subTitleText - The subtitle text to be displayed within a `<span>` element with the class "subtitle".
     * @param {string}      helpText     - The help text to be displayed when the desiner opens.
     */
    static newTitle(container, titleText, subTitleText, helpText) {
        /**
         * Toggles a hint text element inside a specified container.
         * If the hint text element already exists, it is removed. Otherwise, a new one is created and added.
         *
         * @param {HTMLElement} hintContainer - The parent container where the hint text will be toggled.
         * @param {string}      hintText      - The text to display inside the hint element.
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

        // Set default values for the subtitle and help text if not provided.
        helpText = helpText || 'Help text not provided.';

        // Create a new paragraph element to contain the title and subtitle
        const titleContainer = document.createElement('div');
        titleContainer.setAttribute('g4-role', 'title');

        // Set the inner HTML of the title container with an <h2> for the main title and a <span> for the subtitle
        const html = `
            <h2 style="display: flex;align-items: center;justify-content: space-between;">${titleText}
                <span class="hint-icon-container" tabindex="0" title="More Information" role="img" aria-label="More Information">
                    <svg viewBox="0 -960 960 960" class="hint-icon" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M419-334q1-87 20.5-129t65.5-76q39-31 57.5-61.109T581-666q0-39-25.5-64.5T486-756q-46 0-75 26t-43 67l-120-52q27-74 87-120.5T485.756-882q109.228 0 168.236 62.148Q713-757.703 713-669q0 60-21 105.5T625-478q-46 40-57 65.5T557-334H419Zm66.788 282Q447-52 420-79t-27-65.496q0-38.495 26.92-65.5Q446.841-237 485.92-237 525-237 552-209.996q27 27.005 27 65.5Q579-106 551.788-79q-27.213 27-66 27Z"></path>
                    </svg>
                </span>
            </h2>
            <span class="subtitle">${subTitleText}</span>
            
            <div g4-role="summary"></div>`;

        // Insert the HTML structure into the title container
        titleContainer.insertAdjacentHTML('beforeend', html);

        // Add event listener to the icon element to toggle the hint text
        const iconElement = titleContainer.querySelector('[role="img"]');

        // Get the hint container element
        const hintContainer = titleContainer.querySelector('[g4-role="summary"]');

        // Add event listener to the icon element to toggle the hint text
        iconElement.addEventListener('click', () => switchHint(hintContainer, helpText));

        // Append the populated title container to the provided parent container
        container.appendChild(titleContainer);

        // Return the container for potential further use by the calling code
        return container;
    }
}
