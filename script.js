// Budget Controller
const budgetController = (function () {
  // Some code
  const Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function (totalInc) {
    if (totalInc > 0) {
      this.percentage = Math.round((this.value / totalInc) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function () {
    return this.percentage;
  };

  const Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  const calculateTotal = function (type) {
    let sum = 0;
    data.allItems[type].forEach((item) => {
      sum += item.value;
    });
    data.totals[type] = sum;
    return sum;
  };
  const data = {
    allItems: {
      inc: [],
      exp: [],
    },
    totals: {
      inc: 0,
      exp: 0,
    },
    budget: 0,
    percentage: -1,
  };
  return {
    addItem: function (type, desc, val) {
      let newItem;
      const id = Date.now();
      if (type === "inc") {
        newItem = new Income(id, desc, val);
      } else {
        newItem = new Expense(id, desc, val);
      }
      data.allItems[type].push(newItem);
      return newItem;
    },
    deleteItem: function (type, id) {
      const updatedList = data.allItems[type].filter(
        (item) => item.id !== parseInt(id)
      );
      data.allItems[type] = updatedList;
    },
    calculateBudget: function () {
      // calculate total income
      calculateTotal("inc");
      calculateTotal("exp");

      // Calculate the budget
      data.budget = data.totals.inc - data.totals.exp;
      // calculate the budget
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },
    calculatePercentages: function () {
      data.allItems.exp.forEach(function (cur) {
        cur.calcPercentage(data.totals.inc);
      });
    },
    getPercentages: function () {
      const allPerc = data.allItems.exp.map(function (item) {
        return item.getPercentage();
      });
      console.log(allPerc);
      return allPerc;
    },
    getBudget: function () {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage,
      };
    },
    testing: function () {
      console.log(data);
    },
  };
})();

//UI Controller
const UIController = (function () {
  // Some Code
  const DOMstrings = {
    inputTypes: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn",
    incomeList: ".income__list",
    expenseList: ".expense__list",
    budgetLabel: ".budget__total",
    incomeLabel: ".budget__income--value",
    expensesLabel: ".budget__expenses--value",
    percentageLabel: ".total-expense-percentage",
    container: ".budget__history",
    expensesPercLabel: ".item__percentage",
    dateLabel: ".budget__title--date",
  };

  const formatNum = function (num, type) {
    return type === "inc"
      ? ` + ${accounting.formatMoney(num)}`
      : `- ${accounting.formatMoney(num)}`;
  };

  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputTypes).value,
        desc: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value),
      };
    },
    addListItem: function (obj, type) {
      let html, parentElement;

      if (type === "inc") {
        parentElement = DOMstrings.incomeList;

        html = `<li id="inc-${obj.id}"class="income__item item">
        <div class="item__description">${obj.description}</div>
        <div class="item__info"><div class="income__value">${formatNum(
          obj.value,
          "inc"
        )}</div>
        <div class="item__delete"><button class="item__delete--btn">
        <i class="ion-ios-close-outline"></i></button>
        </div></div></li>`;
      } else if (type === "exp") {
        parentElement = DOMstrings.expenseList;

        html = `<li id="exp-${obj.id}" class="expense__item item">
          <div class="item__description">${obj.description}</div>
          <div class="item__info"> <div class="expense__value">
              ${formatNum(
                obj.value,
                "exp"
              )} <span class="item__percentage">10%</span>
          </div><div class="item__delete">
          <button class="item__delete--btn">
          <i class="ion-ios-close-outline"></i></button>
          </div></div></li>`;
      }

      document
        .querySelector(parentElement)
        .insertAdjacentHTML("beforeend", html);
    },
    clearFields: function () {
      let fields;
      const { inputDescription, inputValue } = DOMstrings;

      fields = document.querySelectorAll(`${inputDescription}, ${inputValue}`);
      [...fields].forEach(function (current) {
        current.value = "";
      });
      [...fields][0].focus();
    },
    displayBudget: function (obj) {
      const { budget, totalInc, totalExp, percentage } = obj;
      document.querySelector(DOMstrings.budgetLabel).textContent = budget;
      document.querySelector(DOMstrings.incomeLabel).textContent = totalInc;
      document.querySelector(DOMstrings.expensesLabel).textContent = totalExp;

      if (percentage > 0) {
        document.querySelector(
          DOMstrings.percentageLabel
        ).textContent = percentage;
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = "---";
      }
    },
    displayPercentages: function (percentages) {
      const fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

      [...fields].forEach(function (current, index) {
        if (percentages[index] > 0) {
          current.textContent = `${percentages[index]}%`;
        } else {
          current.textContent = "---";
        }
      });
    },
    displayDate: function () {
      let now, month;

      now = new Date();
      month = now.toLocaleString("default", { month: "long" });

      document.querySelector(
        DOMstrings.dateLabel
      ).textContent = `${month} ${now.getFullYear()}`;
    },
    changedType: function () {
      const fields = document.querySelectorAll(
        `${DOMstrings.inputTypes},${DOMstrings.inputDescription},${DOMstrings.inputValue}`
      );
      [...fields].forEach(function (curr) {
        curr.classList.toggle("red-focus");
      });
      document.querySelector(DOMstrings.inputBtn).classList.toggle("red");
    },
    getDOMstrings: function () {
      return DOMstrings;
    },
  };
})();

// Global Controller
const controller = (function (budgetCtrl, UICtrl) {
  // Some code
  function setUpEventListeners() {
    const DOM = UICtrl.getDOMstrings();
    document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);
    document.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        ctrlAddItem();
      }
    });
    document
      .querySelector(DOM.container)
      .addEventListener("click", ctrlDeleteItem);
    document
      .querySelector(DOM.inputTypes)
      .addEventListener("change", UICtrl.changedType);
  }

  const updateBudget = function () {
    //1. calculate Budget data
    budgetCtrl.calculateBudget();
    //2. return budget
    const budget = budgetCtrl.getBudget();
    //3. update budget UI
    UICtrl.displayBudget(budget);
  };

  const updatePercentages = function () {
    // 1. Calculate percentages
    budgetController.calculatePercentages();
    //2. Read percentages from the budget controller
    const percentagesArr = budgetCtrl.getPercentages();
    //3/ Update the UI with new percentages
    UICtrl.displayPercentages(percentagesArr);
  };

  const ctrlAddItem = function () {
    let newItem;
    // 1. get input data
    const { type, desc, value } = UICtrl.getInput();

    if (desc !== "" && !isNaN(value) && value > 0) {
      // 2. Add the item to the budget controller
      newItem = budgetCtrl.addItem(type, desc, value);
      //3. add the item to the UI
      UICtrl.addListItem(newItem, type);

      // 3a. clear fields
      UICtrl.clearFields();
      //4. recalculate budget
      updateBudget();
      // Calculate and update the percentages
      updatePercentages();
    }
  };

  const ctrlDeleteItem = function (e) {
    let type, id;
    const itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;
    if (itemID) {
      [type, id] = itemID.split("-");
      budgetCtrl.deleteItem(type, id);
    }
    // remove item from UI
    document
      .getElementById(itemID)
      .parentNode.removeChild(document.getElementById(itemID));
    // 4. recalculate budget
    updateBudget();
    // Calculate and update the percentages
    updatePercentages();
  };

  return {
    init: function () {
      setUpEventListeners();
      UICtrl.displayDate();
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1,
      });
    },
  };
})(budgetController, UIController);

controller.init();
