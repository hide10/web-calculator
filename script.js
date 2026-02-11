(function () {
  const expressionEl = document.getElementById("expression");
  const resultEl = document.getElementById("result");

  let current = "0";
  let expression = "";
  let accumulator = null;
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

  function handleNumber(value) {
    if (resetNext) {
      current = value;
      resetNext = false;
    } else {
      current = current === "0" ? value : current + value;
    }
  }

  function applyOperation(op, a, b) {
    switch (op) {
      case "+": return a + b;
      case "-": return a - b;
      case "*": return a * b;
      case "/": return b === 0 ? NaN : a / b;
      default: return b;
    }
  }

  function handleOperator(op) {
    const currentValue = parseFloat(current);
    if (accumulator === null) {
      accumulator = currentValue;
    } else if (!resetNext) {
      accumulator = applyOperation(lastOperator, accumulator, currentValue);
    }
    expression = formatNumber(accumulator) + " " + { "/": "\u00f7", "*": "\u00d7", "-": "\u2212", "+": "+" }[op] + " ";
    lastOperator = op;
    resetNext = true;
  }

  function handleEqual() {
    if (!lastOperator || accumulator === null) return;
    const result = applyOperation(lastOperator, accumulator, parseFloat(current));
    expression = "";
    lastOperator = "";
    accumulator = null;
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
    accumulator = null;
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

    if (current === "Error" && action !== "clear") {
      handleClear();
    }

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
    if (e.key >= "0" && e.key <= "9") handleNumber(e.key);
    else if (e.key === ".") handleDecimal();
    else if (["+", "-", "*", "/"].includes(e.key)) handleOperator(e.key);
    else if (e.key === "Enter" || e.key === "=") handleEqual();
    else if (e.key === "Backspace") handleBackspace();
    else if (e.key === "Escape") handleClear();
    else return;
    updateDisplay();
  });
})();
