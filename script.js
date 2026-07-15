const display = document.querySelector("#display");
const buttons = document.querySelectorAll("button");

let currentValue = "0";
let previousValue = null;
let operator = null;
let waitingForOperand = false;
let lastOperator = null;
let lastOperand = null;

updateDisplay();

// --------------------
// Core Math
// --------------------

function add(a, b) { return a + b; }
function subtract(a, b) { return a - b; }
function multiply(a, b) { return a * b; }
function divide(a, b) { return b === 0 ? "Error" : a / b; }

function calculate(a, op, b) {
    let result;
    switch (op) {
        case "+": result = add(a, b); break;
        case "-": result = subtract(a, b); break;
        case "*": result = multiply(a, b); break;
        case "/": result = divide(a, b); break;
        default: result = b;
    }
    if (result !== "Error") {
        result = parseFloat(result.toFixed(8));
    }
    return result;
}

// --------------------
// Display
// --------------------

function formatNumber(value) {
    if (value === "Error") return value;
    const isNegative = value.startsWith("-");
    const numericValue = isNegative ? value.slice(1) : value;
    const [integer, decimal] = numericValue.split(".");
    const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    let result = (isNegative ? "−" : "") + formattedInteger;
    if (decimal !== undefined) result += "." + decimal;
    return result;
}

function updateDisplay() {
    display.textContent = formatNumber(currentValue);

    const len = currentValue.length;
    if (len > 14) display.style.fontSize = "1.4rem";
    else if (len > 11) display.style.fontSize = "1.8rem";
    else if (len > 8) display.style.fontSize = "2.2rem";
    else display.style.fontSize = "3rem";

    updateClearButton();
    updateActiveOperator();
}

function updateClearButton() {
    const clearBtn = document.querySelector('[data-action="clear"]');
    const shouldBeC = currentValue !== "0" && !waitingForOperand && currentValue !== "Error";
    clearBtn.textContent = shouldBeC ? "C" : "AC";
}

function updateActiveOperator() {
    document.querySelectorAll(".operator").forEach(btn => {
        const btnOp = btn.textContent
            .replace("×", "*")
            .replace("÷", "/")
            .replace("−", "-");
        btn.classList.toggle("active-operator", btnOp === operator);
    });
}

function resetIfError() {
    if (currentValue === "Error") {
        currentValue = "0";
        previousValue = null;
        operator = null;
        waitingForOperand = false;
        lastOperator = null;
        lastOperand = null;
    }
}

// --------------------
// Input Handlers
// --------------------

function handleNumber(digit) {
    resetIfError();
    if (waitingForOperand) {
        currentValue = digit;
        waitingForOperand = false;
    } else if (currentValue === "0") {
        currentValue = digit;
    } else {
        currentValue += digit;
    }
    updateDisplay();
}

function handleDecimal() {
    resetIfError();
    if (waitingForOperand) {
        currentValue = "0.";
        waitingForOperand = false;
    } else if (!currentValue.includes(".")) {
        currentValue += ".";
    }
    updateDisplay();
}

function handleOperator(nextOperator) {
    resetIfError();

    if (waitingForOperand && operator !== null) {
        operator = nextOperator;
        updateDisplay();
        return;
    }

    if (operator !== null && previousValue !== null) {
        const result = calculate(previousValue, operator, Number(currentValue));
        currentValue = String(result);
        previousValue = result === "Error" ? null : result;
    } else {
        previousValue = Number(currentValue);
    }

    if (currentValue !== "Error") {
        operator = nextOperator;
        waitingForOperand = true;
    } else {
        operator = null;
        waitingForOperand = false;
        previousValue = null;
    }

    updateDisplay();
}

function handleEquals() {
    if (operator === null && lastOperator === null) return;

    let result;

    if (operator !== null) {
        const operand = waitingForOperand ? previousValue : Number(currentValue);
        result = calculate(previousValue, operator, operand);
        lastOperator = operator;
        lastOperand = operand;
        previousValue = null;
        operator = null;
    } else {
        result = calculate(Number(currentValue), lastOperator, lastOperand);
    }

    currentValue = String(result);
    waitingForOperand = true;
    updateDisplay();
}

function handleClear() {
    const shouldClearAll = currentValue === "0" || waitingForOperand || currentValue === "Error";

    if (shouldClearAll) {
        currentValue = "0";
        previousValue = null;
        operator = null;
        waitingForOperand = false;
        lastOperator = null;
        lastOperand = null;
    } else {
        currentValue = "0";
    }
    updateDisplay();
}

function handleSign() {
    resetIfError();
    if (currentValue === "0") return;
    if (currentValue.startsWith("-")) {
        currentValue = currentValue.slice(1);
    } else {
        currentValue = "-" + currentValue;
    }
    updateDisplay();
}

function handlePercent() {
    resetIfError();
    currentValue = String(Number(currentValue) / 100);
    updateDisplay();
}

function handleBackspace() {
    if (waitingForOperand || currentValue === "Error") return;
    if (currentValue.length === 1 || (currentValue.length === 2 && currentValue.startsWith("-"))) {
        currentValue = "0";
    } else {
        currentValue = currentValue.slice(0, -1);
    }
    updateDisplay();
}

// --------------------
// Event Listeners
// --------------------

buttons.forEach(button => {
    button.addEventListener("click", () => {
        button.classList.add("active");
        setTimeout(() => button.classList.remove("active"), 100);

        if (button.classList.contains("number")) {
            handleNumber(button.textContent);
        } else if (button.classList.contains("operator")) {
            const op = button.textContent
                .replace("×", "*")
                .replace("÷", "/")
                .replace("−", "-");
            handleOperator(op);
        } else if (button.classList.contains("decimal")) {
            handleDecimal();
        } else if (button.classList.contains("equals")) {
            handleEquals();
        } else if (button.classList.contains("function")) {
            const action = button.dataset.action;
            if (action === "clear") handleClear();
            else if (action === "sign") handleSign();
            else if (action === "percent") handlePercent();
        }
    });
});

document.addEventListener("keydown", (e) => {
    if (e.repeat) return;

    if (e.key === "Backspace") {
        handleBackspace();
        return;
    }

    if (e.key === "Enter" || e.key === "=") e.preventDefault();

    const keyMap = {
        "0": "0", "1": "1", "2": "2", "3": "3", "4": "4",
        "5": "5", "6": "6", "7": "7", "8": "8", "9": "9",
        ".": ".", "+": "+", "-": "−", "*": "×", "/": "÷",
        "Enter": "=", "=": "=", "Escape": "AC"
    };

    const buttonText = keyMap[e.key];
    if (!buttonText) return;

    const btn = Array.from(document.querySelectorAll("button")).find(b => b.textContent === buttonText);
    if (btn) {
        btn.classList.add("active");
        setTimeout(() => btn.classList.remove("active"), 100);
        btn.click();
    }
});