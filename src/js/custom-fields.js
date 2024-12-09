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
    const fieldContainer = document.createElement('div');
    const labelContainer = document.createElement('div');

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

    // Create a new `div` element to serve as the hint text container
    const hintElement = document.createElement('div');
    hintElement.id = `${id}-hint`;

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
    iconElement.addEventListener('click', () => switchHint(hintElement, hintText));

    // Append the icon, label, and hint elements to the field container
    labelElement.appendChild(iconElement);
    labelContainer.appendChild(labelElement);
    fieldContainer.appendChild(labelContainer);
    fieldContainer.appendChild(hintElement);

    // Return the fully constructed `fieldContainer` div
    return fieldContainer;
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

        // Create a new field container div with a label and icon.
        const fieldContainer = newFieldContainer(inputId, labelDisplayName, title);

        // Determine the items for the dropdown.
        const items = getItems(itemsSource);

        // Start building the HTML structure for the dropdown field.
        let html = `
        <select>
            <option value="" disabled selected>-- Please select an option --</option>`;

        // Add options to the dropdown for each item.
        Object.keys(items).forEach(key => {
            const summary = items[key].manifest?.summary || ['No summary available'];
            html += `  <option value="${key}" title="${summary.join("\n")}">${convertPascalToSpaceCase(key)}</option>\n`;
        });

        // Close the select element in the HTML.
        html += '</select>';

        // Set the inner HTML of the field container to the constructed dropdown.
        fieldContainer.insertAdjacentHTML('beforeend', html);

        // Get a reference to the `select` element within the field container.
        const select = fieldContainer.querySelector('select');
        select.value = initialValue;

        // Attach an event listener to handle user input and invoke the callback with the selected value.
        fieldContainer.addEventListener('input', () => setCallback(select.value));

        // Append the field container to the parent container.
        container.appendChild(fieldContainer);
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

        // Create a new field container div with a label and icon.
        const fieldContainer = newFieldContainer(inputId, labelDisplayName, title);

        // Set the inner HTML of the field container to the input field HTML
        const html = `
		<input
			id='${inputId}'
			data-g4-attribute='${label}'
			title='${title}'
			type='text'
			spellcheck='false'
			value='${initialValue}' />`;

        // Set the inner HTML of the field container to the constructed input controller.
        fieldContainer.insertAdjacentHTML('beforeend', html);

        // Select the input element within the field container
        const input = fieldContainer.querySelector('input');

        // If the field should be read-only, set the 'readonly' attribute on the input
        if (isReadonly) {
            input.setAttribute('readonly', 'readonly');
        }

        // Add an event listener to handle input changes and invoke the callback with the new value
        fieldContainer.addEventListener('input', () => setCallback(input.value));

        // Append the field container to the parent container.
        container.appendChild(fieldContainer);
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

        // Create a new field container div with a label and icon.
        const fieldContainer = newFieldContainer(inputId, labelDisplayName, title);

        // Create the textarea element.
        const textareaElement = document.createElement('textarea');
        textareaElement.setAttribute('id', inputId);              // Assign the unique ID.
        textareaElement.setAttribute('rows', '1');                // Set the initial number of rows.
        textareaElement.setAttribute('wrap', 'off');              // Disable text wrapping.
        textareaElement.setAttribute('data-g4-attribute', label); // Custom data attribute for context.
        textareaElement.setAttribute('spellcheck', 'false');      // Disable spellcheck.
        textareaElement.value = initialValue;                     // Set the initial value.

        // Append the textarea to the container div.
        fieldContainer.appendChild(textareaElement);

        // If the textarea is read-only, set the readonly attribute.
        if (isReadonly) {
            textareaElement.setAttribute('readonly', 'readonly');
        }

        // Attach an event listener to handle input events for resizing and value changes.
        fieldContainer.addEventListener('input', () => callback(textareaElement));

        // Append the field container to the parent container.
        container.appendChild(fieldContainer);
    }
}
