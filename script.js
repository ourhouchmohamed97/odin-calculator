const display = document.querySelector("#display");

const numberButtons = document.querySelectorAll(".number");
const operatorButtons = document.querySelectorAll(".operator");
const decimalButton = document.querySelector(".decimal");
const equalsButton = document.querySelector(".equals");
const clearButton = document.querySelector(".clear");

let currentNumber = "0";
let firstNumber = null;
let operator = null;
let waitingForSecondNumber = false;

function updateDisplay() {
    display.textContent = currentNumber;
}

// Math Functions

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0)
        return "Nice try 😎";

    return a / b;
}

function operate(operator, firstNumber, secondNumber) {
    switch (operator) {
        case "+":
            return add(firstNumber, secondNumber);

        case "-":
            return subtract(firstNumber, secondNumber);

        case "*":
            return multiply(firstNumber, secondNumber);

        case "/":
            return divide(firstNumber, secondNumber);

        default:
            return null;
    }
}

// Number Buttons

numberButtons.forEach(button => {

    button.addEventListener("click", () => {

        if (waitingForSecondNumber) {
            currentNumber = button.textContent;
            waitingForSecondNumber = false;
        }
        else if (currentNumber === "0") {
            currentNumber = button.textContent;
        }
        else {
            currentNumber += button.textContent;
        }

        updateDisplay();

    });

});

// Decimal Button

decimalButton.addEventListener("click", () => {

    if (waitingForSecondNumber) {
        currentNumber = "0";
        waitingForSecondNumber = false;
    }

    if (!currentNumber.includes(".")) {
        currentNumber += ".";
        updateDisplay();
    }

});

// Operator Buttons

operatorButtons.forEach(button => {

    button.addEventListener("click", () => {

        if (operator !== null && waitingForSecondNumber) {
            switch (button.textContent) {
                case "+":
                    operator = "+";
                    break;
                case "−":
                    operator = "-";
                    break;
                case "×":
                    operator = "*";
                    break;
                case "÷":
                    operator = "/";
                    break;
            }
            return;
        }

        firstNumber = Number(currentNumber);

        switch (button.textContent) {
            case "+":
                operator = "+";
                break;

            case "−":
                operator = "-";
                break;

            case "×":
                operator = "*";
                break;

            case "÷":
                operator = "/";
                break;
        }

        waitingForSecondNumber = true;

    });

});

// Equals Button

equalsButton.addEventListener("click", () => {

    if (operator === null || waitingForSecondNumber)
        return;

    const secondNumber = Number(currentNumber);

    let result = operate(operator, firstNumber, secondNumber);

    if (typeof result === "number") {
        result = Number(result.toFixed(8));
    }

    currentNumber = String(result);

    updateDisplay();

    firstNumber = null;
    operator = null;
    waitingForSecondNumber = false;

});

// Clear Button

clearButton.addEventListener("click", () => {

    currentNumber = "0";
    firstNumber = null;
    operator = null;
    waitingForSecondNumber = false;

    updateDisplay();

});