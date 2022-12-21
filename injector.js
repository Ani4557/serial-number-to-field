/*
 * File    : injector.js
 * Date    : 11/22/2022
 * Author  : Ani
 */

const getParents = (element) => {
  let parents = [];
  while (element.parentNode && element.parentNode.nodeName.toLowerCase() != "body") {
    element = element.parentNode;
    parents.push(element);
  }
  return parents;
};

const setNativeValue = (element, value) => {
    const valueSetter = Object.getOwnPropertyDescriptor(element, "value").set;
    const prototype = Object.getPrototypeOf(element);
    const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, "value").set;

    if (valueSetter && valueSetter !== prototypeValueSetter) {
        prototypeValueSetter.call(element, value);
    } else {
        valueSetter.call(element, value);
    }
};

const fillSmallField = (smallFieldLabelText, text) => {
    // Select small field container based on its label and get its id
    const labels = document.querySelectorAll("label");
    for (const label of labels) {
        if (label.innerHTML === smallFieldLabelText) {
            const parents = getParents(label);
            const smallFieldInput = document.querySelector(`#${parents[1].id} input`);
            setNativeValue(smallFieldInput, text);
            smallFieldInput.dispatchEvent(new Event("input", {
                bubbles: true
            }));
            break;
        }
    }
};

const fillSummary = (text) => {
    const summaryInput = document.getElementById("summary-field");
    setNativeValue(summaryInput, text);
    summaryInput.dispatchEvent(new Event("input", {
        bubbles: true
    }));
};

const fillDescription = (input, text) => {
    const i = document.querySelector(input);
    i.innerHTML = text; 
};

const fillLargeField = (descriptionContainerId, text) => {
    const descriptionContainer = document.querySelector(descriptionContainerId);
    descriptionContainer.innerHTML = text; 

        //TODO: Upgrade fillLargeField
};

const fillDate = (dateLabelText, date) => {
    let containerId = "";
    const month = date.substring(0, 2);
    const year = date.substring(2, 4);

    // Select date container based on its label and get its id
    const labels = document.querySelectorAll("label");
    for (const label of labels) {
        if (label.innerHTML === dateLabelText) {
            const parents = getParents(label);
            containerId = parents[1].id;
            break;
        }
    }

    // Use the id to then trigger the input in order to display the date picker
    const inputs = document.querySelectorAll(`#${containerId} input`);
    for (const input of inputs) {
        if (input.id && input.id.includes("react-select")) {
            const reactSelectInput = document.getElementById(input.id);
            setNativeValue(reactSelectInput, `${month}/1/20${year}`);
            reactSelectInput.dispatchEvent(new Event("input", {
                bubbles: true
            }));
            break;
        }
    }

    // Click the button corresponding to the first day of the month
    const buttons = document.querySelectorAll(`#${containerId} button`);
    for (const button of buttons) {
        if (button.innerHTML === "1")
            button.click();
    };
};

const shade = (element) => {
    element.setAttribute("style", "background-color: rgba(23, 111, 203, 0.2)");
};



fillSummary("summary-field", "Summary text");
fillDescription("#description-container p", "Description text");
fillDate("Due date", "1020");
