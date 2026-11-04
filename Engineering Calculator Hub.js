function showResult(elementId, message) {
    const element = document.getElementById(elementId);
    element.textContent = message; 
    element.classList.remove("error");
}

function showError(elementId, message) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.classList.add("error");
}

function round(number) {
    return Math.round(number * 10000) / 10000;
}


// =====================================================
// 1. UNIT CONVERTER
// =====================================================

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


const lengthNames = ["m", "cm", "mm", "inch", "foot"];
const massNames = ["kg", "g", "lb"];
const temperatureNames = ["C", "F", "K"];


const convType = document.getElementById("conv-type");
const convFrom = document.getElementById("conv-from");
const convTo = document.getElementById("conv-to");


function fillUnitOptions() {
    const type = convType.value; 
    let names = [];

    if (type === "length") {
        names = lengthNames;
    } else if (type === "mass") {
        names = massNames;
    } else {
        names = temperatureNames;
    }

    
    let optionsHtml = "";
    for (let i = 0; i < names.length; i++) {
        optionsHtml = optionsHtml + '<option value="' + names[i] + '">' + names[i] + "</option>";
    }

    convFrom.innerHTML = optionsHtml;
    convTo.innerHTML = optionsHtml;
    
    convTo.selectedIndex = 1;

    document.getElementById("conv-result").textContent = "";
}


function convertTemperature(value, from, to) {
    let celsius = 0;

    if (from === "C") {
        celsius = value;
    } else if (from === "F") {
        celsius = (value - 32) * 5 / 9;
    } else {
        celsius = value - 273.15; 
    }

    if (to === "C") {
        return celsius;
    } else if (to === "F") {
        return celsius * 9 / 5 + 32;
    } else {
        return celsius + 273.15; 
    }
}


function runConverter() {
    
    const value = parseFloat(document.getElementById("conv-value").value);
    const type = convType.value;
    const from = convFrom.value;
    const to = convTo.value;

    if (isNaN(value)) {
        showError("conv-result", "Please enter a valid number.");
        return;
    }

    let answer = 0;

    if (type === "temperature") {
        answer = convertTemperature(value, from, to);
    } else if (type === "length") {
        
        const inMetres = value * lengthFactors[from];
        answer = inMetres / lengthFactors[to];
    } else {
       
        const inKg = value * massFactors[from];
        answer = inKg / massFactors[to];
    }

    showResult("conv-result", value + " " + from + " = " + round(answer) + " " + to);
}


convType.addEventListener("change", fillUnitOptions);
document.getElementById("conv-btn").addEventListener("click", runConverter);

fillUnitOptions();


// =====================================================
// 2. TORQUE CALCULATOR   Formula: T = F x r
// =====================================================
function runTorque() {
    const force = parseFloat(document.getElementById("torque-force").value);
    const radius = parseFloat(document.getElementById("torque-radius").value);

    if (isNaN(force) || isNaN(radius)) {
        showError("torque-result", "Please enter both force and distance.");
        return;
    }
    if (force < 0 || radius < 0) {
        showError("torque-result", "Values cannot be negative.");
        return;
    }

    const torque = force * radius;

    showResult("torque-result", "Torque = " + round(torque) + " N·m");
}

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
