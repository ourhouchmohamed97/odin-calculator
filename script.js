const display = document.querySelector("#display");

const numberButtons = document.querySelectorAll(".number");
const decimalButton = document.querySelector(".decimal");
const clearButton = document.querySelector(".clear");

let currentNumber = "0";

function updateDisplay() {
    display.textContent = currentNumber;
}

numberButtons.forEach(button => {
    button.addEventListener("click", () => {

        if (currentNumber === "0") {
            currentNumber = button.textContent;
        } else {
            currentNumber += button.textContent;
        }

        updateDisplay();

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