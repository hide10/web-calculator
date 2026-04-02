(function () {
  const expressionEl = document.getElementById("expression");
  const resultEl = document.getElementById("result");
  const operatorSymbols = { "/": "\u00f7", "*": "\u00d7", "-": "\u2212", "+": "+" };

  let current = "0";
  let expression = "";
  let storedValue = null;
  let lastOperator = "";
  let resetNext = false;

  function updateDisplay() {
    resultEl.textContent = current;
    expressionEl.textContent = expression;
  }

  function formatNumber(num) {
    if (!isFinite(num)) return "Error";
    const str = parseFloat(num.toPrecision(12)).toString();
    return str;
  }

  function calculate(left, right, operator) {
    switch (operator) {
      case "+":
        return left + right;
      case "-":
        return left - right;
      case "*":
        return left * right;
      case "/":
        return right === 0 ? NaN : left / right;
      default:
        return right;
    }
  }

  function clearErrorIfNeeded(action) {
    if (current === "Error" && action !== "clear") {
      handleClear();
    }
  }

  function applyPendingOperation() {
    if (storedValue === null) {
      storedValue = parseFloat(current);
    } else if (lastOperator && !resetNext) {
      storedValue = calculate(storedValue, parseFloat(current), lastOperator);
    }

    current = formatNumber(storedValue);
    if (current === "Error") {
      storedValue = null;
      expression = "";
      lastOperator = "";
      resetNext = true;
      return false;
    }

    return true;
  }

  function handleNumber(value) {
    if (resetNext) {
      current = value;
      resetNext = false;
    } else {
      current = current === "0" ? value : current + value;
    }
  }

  function handleOperator(op) {
    if (current === "Error") return;

    if (lastOperator && resetNext) {
      expression = formatNumber(storedValue) + " " + operatorSymbols[op] + " ";
      lastOperator = op;
      return;
    }

    if (!applyPendingOperation()) {
      return;
    }

    expression = current + " " + operatorSymbols[op] + " ";
    lastOperator = op;
    resetNext = true;
  }

  function handleEqual() {
    if (!lastOperator || storedValue === null) return;
    const result = calculate(storedValue, parseFloat(current), lastOperator);
    expression = "";
    storedValue = null;
    lastOperator = "";
    current = isNaN(result) ? "Error" : formatNumber(result);
    resetNext = true;
  }

  function handleDecimal() {
    if (resetNext) {
      current = "0.";
      resetNext = false;
    } else if (!current.includes(".")) {
      current += ".";
    }
  }

  function handleClear() {
    current = "0";
    expression = "";
    storedValue = null;
    lastOperator = "";
    resetNext = false;
  }

  function handleBackspace() {
    if (resetNext || current === "Error") {
      current = "0";
      resetNext = false;
    } else {
      current = current.length > 1 ? current.slice(0, -1) : "0";
    }
  }

  function handlePercent() {
    current = formatNumber(parseFloat(current) / 100);
  }

  document.querySelector(".buttons").addEventListener("click", function (e) {
    const btn = e.target.closest(".btn");
    if (!btn) return;

    const action = btn.dataset.action;

    clearErrorIfNeeded(action);

    switch (action) {
      case "number": handleNumber(btn.dataset.value); break;
      case "operator": handleOperator(btn.dataset.value); break;
      case "equal": handleEqual(); break;
      case "decimal": handleDecimal(); break;
      case "clear": handleClear(); break;
      case "backspace": handleBackspace(); break;
      case "percent": handlePercent(); break;
    }
    updateDisplay();
  });

  document.addEventListener("keydown", function (e) {
    let action = "";

    if (e.key >= "0" && e.key <= "9") action = "number";
    else if (e.key === ".") action = "decimal";
    else if (["+", "-", "*", "/"].includes(e.key)) action = "operator";
    else if (e.key === "Enter" || e.key === "=") action = "equal";
    else if (e.key === "Backspace") action = "backspace";
    else if (e.key === "Escape") action = "clear";
    else return;

    clearErrorIfNeeded(action);

    if (action === "number") handleNumber(e.key);
    else if (action === "decimal") handleDecimal();
    else if (action === "operator") handleOperator(e.key);
    else if (action === "equal") handleEqual();
    else if (action === "backspace") handleBackspace();
    else if (action === "clear") handleClear();

    updateDisplay();
  });
})();
