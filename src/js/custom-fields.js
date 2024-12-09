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
 * const field = newtitleContainer('username', 'Username');
 * form.appendChild(field);
 */
const newtitleContainer = (id, labelDisplayName, hintText) => {
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
            row.className = 'input-row'; // Assign a class for styling via CSS.

            // Create the text input element with optional initial value.
            const newInput = document.createElement('input');
            newInput.type = 'text';
            newInput.value = value || '';
            newInput.setAttribute('g4-role', 'valueitem');
            newInput.setAttribute('title', title);

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
            row.appendChild(newInput);
            row.appendChild(removeButton);

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

            // Extract values from these inputs and filter out null, undefined, or empty strings.
            const values = Array.from(inputs).map(input => input.value).filter(item => {
                return item != null && item.trim() !== '';
            });

            // Pass the filtered values array to the setCallback function for further handling.
            setCallback(values);
        }

        // Convert the label from PascalCase to spaced words (e.g., "MyLabel" -> "My Label").
        const labelDisplayName = convertPascalToSpaceCase(label);

        // Create a new field container that includes a label, title, and optionally an icon.
        const titleContainer = newtitleContainer(inputId, labelDisplayName, title);

        // Within the field container, find the controller container that holds the main input and others.
        const controllerContainer = titleContainer.querySelector('[g4-role="controller"]');

        // Set up the initial HTML structure:
        // - A text input with a "+" button above it.
        // - A div (input-container) that will hold additional rows created by the "+" button.
        const html = `
        <div class="text-with-button">
            <button type="button">+</button>
            <input type="text" g4-role="valueitem" title="${title}" />
        </div>
        <div id="${inputId}-input-container"></div>`;

        // Insert the initial HTML structure into the controller container.
        controllerContainer.insertAdjacentHTML('beforeend', html);

        // Select the "+" button and attach the newInputCallback() to its click event.
        const botton = controllerContainer.querySelector('button');
        botton.addEventListener('click', newInputCallback);

        // Append the newly created field container (with controller) to the main container.
        container.appendChild(titleContainer);

        // If initial values are provided, populate the first input and create subsequent inputs.
        const values = initialValue || [];
        if (values.length > 0) {
            // Set the first input's value to the first item in the initialValue array.
            const mainInput = controllerContainer.querySelector('[g4-role="valueitem"]');
            mainInput.value = values.shift();
        }

        // For any remaining values, create additional input rows.
        const inputContainer = titleContainer.querySelector(`#${escapedId}-input-container`);
        for (let index = 0; index < values.length; index++) {
            const value = values[index];
            newInput(inputContainer, value);
        }

        // Add an event listener to the main container to call callback whenever input changes occur.
        container.addEventListener('input', () => callback(titleContainer));
    }

    /**
     * Creates a new dropdown (list field) UI element and appends it to the specified container.
     *
     * @param {HTMLElement}  container    - The parent container to which the field will be added.
     * @param {string|Array} itemsSource  - A string representing the type of items to fetch from the cache,
     *                                      or an array of options to populate the dropdown.
     * @param {string}       label        - The label for the dropdown field.
     * @param {string}       title        - The tooltip text that appears when hovering over the combo-box.
     * @param {string}       initialValue - The initial value to populate the input field with.
     * @param {Function}     setCallback  - A callback function invoked when the user selects an option.
     */
    static newListField(container, itemsSource, label, title, initialValue, setCallback) {
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

        // Start building the HTML structure for the dropdown field.
        let html = `
        <select title="${title}">
            <option value="" disabled selected>-- Please select an option --</option>`;

        // Add options to the dropdown for each item.
        Object.keys(items).forEach(key => {
            const summary = items[key].manifest?.summary || ['No summary available'];
            html += `  <option value="${key}" title="${summary.join("\n")}">${convertPascalToSpaceCase(key)}</option>\n`;
        });

        // Close the select element in the HTML.
        html += '</select>';

        // Create a new field container div with a label and icon.
        const titleContainer = newtitleContainer(inputId, labelDisplayName, title);

        // Select the controller container within the field container.
        const controllerContainer = titleContainer.querySelector('[g4-role="controller"]');

        // Set the inner HTML of the field container to the constructed dropdown.
        controllerContainer.insertAdjacentHTML('beforeend', html);

        // Get a reference to the `select` element within the field container.
        const select = controllerContainer.querySelector('select');
        select.value = initialValue;

        // Attach an event listener to handle user input and invoke the callback with the selected value.
        titleContainer.addEventListener('input', () => setCallback(select.value));

        // Append the field container to the parent container.
        container.appendChild(titleContainer);
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
    static newNameField(container, label, title, initialValue, isReadonly, setCallback) {
        // Generate a unique ID for the textarea element.
        const inputId = newUid();

        // Convert the label from PascalCase to a space-separated format for display.
        const labelDisplayName = convertPascalToSpaceCase(label);

        // Set the inner HTML of the field container to the input field HTML
        const html = `
		<input
			id='${inputId}'
			data-g4-attribute='${label}'
			title='${title}'
			type='text'
			spellcheck='false'
			value='${initialValue}' />`;

        // Create a new field container div with a label and icon.
        const titleContainer = newtitleContainer(inputId, labelDisplayName, title);

        // Select the controller container within the field container.
        const controllerContainer = titleContainer.querySelector('[g4-role="controller"]');

        // Set the inner HTML of the field container to the constructed input controller.
        controllerContainer.insertAdjacentHTML('beforeend', html);

        // Select the input element within the field container
        const input = controllerContainer.querySelector('input');

        // If the field should be read-only, set the 'readonly' attribute on the input
        if (isReadonly) {
            input.setAttribute('readonly', 'readonly');
        }

        // Add an event listener to handle input changes and invoke the callback with the new value
        titleContainer.addEventListener('input', () => setCallback(input.value));

        // Append the field container to the parent container.
        container.appendChild(titleContainer);
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

        // Create the textarea element.
        const textareaElement = document.createElement('textarea');
        textareaElement.setAttribute('id', inputId);              // Assign the unique ID.
        textareaElement.setAttribute('rows', '1');                // Set the initial number of rows.
        textareaElement.setAttribute('wrap', 'off');              // Disable text wrapping.
        textareaElement.setAttribute('data-g4-attribute', label); // Custom data attribute for context.
        textareaElement.setAttribute('spellcheck', 'false');      // Disable spellcheck.
        textareaElement.setAttribute('title', title);             // Set the tooltip text.
        textareaElement.value = initialValue;                     // Set the initial value.

        // Create a new field container div with a label and icon.
        const titleContainer = newtitleContainer(inputId, labelDisplayName, title);

        // Select the controller container within the field container.
        const controllerContainer = titleContainer.querySelector('[g4-role="controller"]');

        // Append the textarea to the container div.
        controllerContainer.appendChild(textareaElement);

        // If the textarea is read-only, set the readonly attribute.
        if (isReadonly) {
            textareaElement.setAttribute('readonly', 'readonly');
        }

        // Attach an event listener to handle input events for resizing and value changes.
        titleContainer.addEventListener('input', () => callback(textareaElement));

        // Append the field container to the parent container.
        container.appendChild(titleContainer);
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
    }
}
