const display = document.querySelector("#display");

const numberButtons = document.querySelectorAll(".number");
const decimalButton = document.querySelector(".decimal");
const clearButton = document.querySelector(".clear");

let currentNumber = "0";
let firstNumber = null;
let operator = null;
let waitingForSecondNumber = false;

const operatorButtons = document.querySelectorAll(".operator");

function updateDisplay() {
    display.textContent = currentNumber;
}

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

operatorButtons.forEach(button => {

    button.addEventListener("click", () => {

        if (operator !== null && waitingForSecondNumber) {
            operator = button.textContent;
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

decimalButton.addEventListener("click", () => {

    if (!currentNumber.includes(".")) {
        currentNumber += ".";
        updateDisplay();
    }

});

clearButton.addEventListener("click", () => {

    currentNumber = "0";
    updateDisplay();

});