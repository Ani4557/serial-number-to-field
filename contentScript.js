/*
 * File    : contentScript.js
 * Date    : 11/22/2022
 * Author  : Ani
*/

const serialNumberToField = (serialNumber) => {
  serialNumber = serialNumber.toUpperCase();
  const model = serialNumber.substring(0, 5);
  const manufacturingDate = serialNumber.substring(5, 9);
  const batch = serialNumber.substring(9, 13);
  let possibleRefurb = false;
  if (batch.includes('R'))
    possibleRefurb = true;
  return {
    "model": model, 
    "manufacturingDate": manufacturingDate, 
    "batch": batch,
    "possibleRefurb": possibleRefurb
  };
};
    
const getParents = (element) => {
  let parents = [];
  while (element.parentNode && element.parentNode.nodeName.toLowerCase() != "body") {
    element = element.parentNode;
    parents.push(element);
  }
  return parents;
};

const getParentContainerIdFromLabel = (labelText) => {
    const labels = document.querySelectorAll("label");
    for (const label of labels) {
        if (label.innerHTML === labelText) {
            const parents = getParents(label);
            return parents[1].id;
        }
    }
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

const fillSmallField = (smallFieldLabel, text) => {
    // Find small field container based on its label and get its id
    const labels = document.querySelectorAll("label");
    for (const label of labels) {
        if (label.innerHTML === smallFieldLabel) {
            const parents = getParents(label);

            // Go up and get the container's id
            const smallFieldInput = document.querySelector(`#${parents[1].id} input`);
            setNativeValue(smallFieldInput, text);
            smallFieldInput.dispatchEvent(new Event("input", {
                bubbles: true
            }));
            break;
        }
    }
};

// const fillSummary = (text) => {
//     const summaryInput = document.getElementById("summary-field");
//     setNativeValue(summaryInput, text);
//     summaryInput.dispatchEvent(new Event("input", {
//         bubbles: true
//     }));
// };

// TODO: combine the 2 functions above by ignoring <span>*</span>
// TODO: write backup code in case the index of parent div with an id changes

// const fillDescription = (input, text) => {
//     const i = document.querySelector(input);
//     i.innerHTML = text; 
// };

const fillLargeField = (largeFieldLabelId, text) => {
    const descriptionContainer = document.querySelector(largeFieldLabelId);
    

        //TODO: Upgrade fillLargeField
};

const fillDate = (dateLabel, date) => {
    let containerId = "";
    const month = date.substring(0, 2);
    const year = date.substring(2, 4);

    // Find date container based on its label and get its id
    const labels = document.querySelectorAll("label");
    for (const label of labels) {
        if (label.innerHTML === dateLabel) {
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
    }
};

const fillDropDownMenu = (dropDownLabel, selectionPath) => {
    // Selection path would look something like this: ["Category", "Subcategory", "Product"]
    // Find dropdown menu based on its label and get its id
    // Use the id to then trigger the input in order to display the dropdown menu
    let containerId = "";
    const labels = document.querySelectorAll("label");
    for (const label of labels) {
        if (label.innerHTML === dropDownLabel) {
            const parents = getParents(label);
            containerId = parents[1].id;
            break;
        }
    }
    
    for (const step of selectionPath) {
        const inputs = document.querySelectorAll(`#${containerId} input`);

        // Get the furthest react-select id
        let reactSelectInputId;
        for (const input of inputs) {
            if (input.id && input.id.includes("react-select"))
                reactSelectInputId = input.id;
        }

        // Pop up the furthest menu
        const reactSelectInput = document.getElementById(reactSelectInputId);
        setNativeValue(reactSelectInput, step);
        reactSelectInput.dispatchEvent(new Event("input", {
            bubbles: true
        }));

        // Pick the selected option
        const options = document.querySelectorAll(`#${containerId} div`);
        for (const option of options) {
            if (option.id && option.id.includes("react-select") && option.innerHTML === step)
                option.click();
        }
    }
};

const detectSerialNumber = () => {
  // Loop through all text fields and check for any matches
  const inputs = document.querySelectorAll("input");
  for (const input of inputs) {
    const matches = input.match(/([B]|[0])([1-2])([0])([1-3])([1-3])([0-1])([0-9])([0-9])([0-9])([0-9]|[R])([0-9])([0-9])([0-9])/gi);
    if (matches) {
      return {
        "serialNumber": matches[0],
        "inputId": input
      };
    }
  }
  return null;
};

const injectAutofillButton = () => {

};

// fillSmallField("Serial Number", "020320122R007");
// fillDate("Due date", "1020");
// fillDropDownMenu("Product / Model", ["Splitter Switch", "SPS-01-031, NEMA 10-30/14-50 / 24 Amp"]);

(() => {
  chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const {state} = obj;
    if (state) {
      // document.onload = () => {
      console.log("starting");
      // Get the whole create button regardess of its size
      const createButton = document.getElementById("createGlobalItem").parentNode;
      console.log(createButton);
      createButton.addEventListener("click", () => {
        console.log("waw pressed");
      });
      console.log("added listener");
      // };
    }
  });
})();
