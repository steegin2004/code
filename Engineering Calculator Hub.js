// =====================================================
// Engineering Calculator Hub - script.js (beginner version)
//
// How every calculator works, in 4 steps:
//   1. Wait for the user to click the button
//   2. Read the numbers typed in the input boxes
//   3. Check the numbers, then do the math
//   4. Show the answer on the page
// =====================================================


// =====================================================
// HELPER FUNCTIONS
// A function is a reusable block of code with a name.
// We write these once and use them in every calculator.
// =====================================================

// Shows a normal (green) message inside the element with the given id
function showResult(elementId, message) {
    const element = document.getElementById(elementId);
    element.textContent = message; // put the text on the page
    element.classList.remove("error"); // remove the red error style
}

// Shows an error (red) message inside the element with the given id
function showError(elementId, message) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.classList.add("error"); // add the red error style
}

// Rounds a number to 4 decimal places.
// Example: 2.204622 becomes 2.2046
function round(number) {
    return Math.round(number * 10000) / 10000;
}


// =====================================================
// 1. UNIT CONVERTER
// =====================================================

// --- Step A: the data -----------------------------------
// Each unit has a number telling how big it is compared to a
// base unit. The base unit for length is the metre, and for
// mass it is the kilogram.
// Example: 1 cm = 0.01 metre, 1 inch = 0.0254 metre.

const lengthFactors = {
    m: 1,
    cm: 0.01,
    mm: 0.001,
    inch: 0.0254,
    foot: 0.3048
};

const massFactors = {
    kg: 1,
    g: 0.001,
    lb: 0.45359237
};

// Lists of unit names to show in the dropdown boxes
const lengthNames = ["m", "cm", "mm", "inch", "foot"];
const massNames = ["kg", "g", "lb"];
const temperatureNames = ["C", "F", "K"];

// --- Step B: connect to the HTML elements ----------------
const convType = document.getElementById("conv-type");
const convFrom = document.getElementById("conv-from");
const convTo = document.getElementById("conv-to");

// --- Step C: fill the "From" and "To" dropdowns ----------
// This runs when the page loads and whenever the user changes the Type.
function fillUnitOptions() {
    const type = convType.value; // "length", "mass" or "temperature"
    let names = []; // an empty list, we fill it below

    if (type === "length") {
        names = lengthNames;
    } else if (type === "mass") {
        names = massNames;
    } else {
        names = temperatureNames;
    }

    // Build the HTML for the dropdown options as one long text.
    // Example result: <option value="m">m</option><option value="cm">cm</option>
    let optionsHtml = "";
    for (let i = 0; i < names.length; i++) {
        optionsHtml = optionsHtml + '<option value="' + names[i] + '">' + names[i] + "</option>";
    }

    // Put the same options into both dropdowns
    convFrom.innerHTML = optionsHtml;
    convTo.innerHTML = optionsHtml;

    // Make "To" start on the second option so the two units are different
    convTo.selectedIndex = 1;

    // Clear the old result
    document.getElementById("conv-result").textContent = "";
}

// --- Step D: temperature needs formulas, not factors -----
// We first change everything to Celsius, then change from Celsius
// to the unit the user wants.
function convertTemperature(value, from, to) {
    let celsius = 0;

    // Change the starting unit to Celsius
    if (from === "C") {
        celsius = value;
    } else if (from === "F") {
        celsius = (value - 32) * 5 / 9;
    } else {
        celsius = value - 273.15; // from Kelvin
    }

    // Change Celsius to the target unit
    if (to === "C") {
        return celsius;
    } else if (to === "F") {
        return celsius * 9 / 5 + 32;
    } else {
        return celsius + 273.15; // to Kelvin
    }
}

// --- Step E: the main function, runs when "Convert" is clicked ---
function runConverter() {
    // Read what the user typed. parseFloat turns the text "12.5" into the number 12.5
    const value = parseFloat(document.getElementById("conv-value").value);
    const type = convType.value;
    const from = convFrom.value;
    const to = convTo.value;

    // isNaN means "is Not a Number". It is true when the box was empty.
    if (isNaN(value)) {
        showError("conv-result", "Please enter a valid number.");
        return; // stop here, do not continue
    }

    let answer = 0;

    if (type === "temperature") {
        answer = convertTemperature(value, from, to);
    } else if (type === "length") {
        // value -> metres -> target unit
        const inMetres = value * lengthFactors[from];
        answer = inMetres / lengthFactors[to];
    } else {
        // value -> kilograms -> target unit
        const inKg = value * massFactors[from];
        answer = inKg / massFactors[to];
    }

    showResult("conv-result", value + " " + from + " = " + round(answer) + " " + to);
}

// --- Step F: connect the events ---
// "When this happens, run this function"
convType.addEventListener("change", fillUnitOptions);
document.getElementById("conv-btn").addEventListener("click", runConverter);

// Run once when the page loads so the dropdowns are not empty
fillUnitOptions();


// =====================================================
// 2. TORQUE CALCULATOR   Formula: T = F x r
// =====================================================
function runTorque() {
    // Step 2: read the inputs
    const force = parseFloat(document.getElementById("torque-force").value);
    const radius = parseFloat(document.getElementById("torque-radius").value);

    // Step 3: check the inputs
    // || means OR. This reads: "if force is not a number OR radius is not a number"
    if (isNaN(force) || isNaN(radius)) {
        showError("torque-result", "Please enter both force and distance.");
        return;
    }
    if (force < 0 || radius < 0) {
        showError("torque-result", "Values cannot be negative.");
        return;
    }

    // Step 3: do the math
    const torque = force * radius;

    // Step 4: show the answer
    showResult("torque-result", "Torque = " + round(torque) + " N·m");
}

// Step 1: wait for the click
document.getElementById("torque-btn").addEventListener("click", runTorque);


// =====================================================
// 3. STRESS CALCULATOR   Formula: stress = F / A
// Force is in N and area is in mm2, so the answer is in N/mm2.
// N/mm2 is the same as MPa.
// =====================================================
function runStress() {
    const force = parseFloat(document.getElementById("stress-force").value);
    const area = parseFloat(document.getElementById("stress-area").value);

    if (isNaN(force) || isNaN(area)) {
        showError("stress-result", "Please enter both force and area.");
        return;
    }

    // We cannot divide by zero, so area must be bigger than 0
    if (area <= 0) {
        showError("stress-result", "Area must be greater than zero.");
        return;
    }

    const stress = force / area;
    showResult("stress-result", "Stress = " + round(stress) + " MPa (N/mm²)");
}

document.getElementById("stress-btn").addEventListener("click", runStress);


// =====================================================
// 4. GEAR RATIO CALCULATOR
// Formula: ratio = driven teeth / driver teeth
// If the user enters an RPM, driven speed = driver RPM / ratio
// =====================================================
function runGear() {
    const driver = parseFloat(document.getElementById("gear-driver").value);
    const driven = parseFloat(document.getElementById("gear-driven").value);

    // For the RPM box we first keep the raw text, because it is optional
    const rpmText = document.getElementById("gear-rpm").value;

    if (isNaN(driver) || isNaN(driven)) {
        showError("gear-result", "Please enter the teeth of both gears.");
        return;
    }
    if (driver <= 0 || driven <= 0) {
        showError("gear-result", "Teeth count must be greater than zero.");
        return;
    }

    const ratio = driven / driver;
    let message = "Gear ratio = " + round(ratio) + " : 1";

    // !== means "is not equal to". An empty box has the text "" (nothing).
    // So this runs only when the user typed an RPM.
    if (rpmText !== "") {
        const rpm = parseFloat(rpmText);

        if (isNaN(rpm) || rpm < 0) {
            showError("gear-result", "Please enter a valid RPM.");
            return;
        }

        const drivenSpeed = rpm / ratio;
        message = message + " | Driven gear speed = " + round(drivenSpeed) + " RPM";
    }

    showResult("gear-result", message);
}

document.getElementById("gear-btn").addEventListener("click", runGear);