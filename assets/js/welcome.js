class Main {
  constructor() {
    this.currentAmount = 0;
    this.showUserDetails();
    this.myChartInstance = null;
    this.ctx = document.getElementById("myChart").getContext("2d");
    this.btn = document.querySelector("#logout");
    this.confirmBtn = document.querySelector("#confirmBtn");
    this.inputText = document.querySelector("#expenseNo");
    this.err = document.querySelector(".error");
    this.expenseContainer = document.querySelector(".expenseContainer");
    this.btn.addEventListener("click", () => this.validate());
    this.confirmBtn.addEventListener("click", () => this.confirm());
    this.storeExpenses = [];
    this.obj = {};
  }
  showUserDetails() {
    this.text = document.querySelector(
      "#txt"
    ).innerText = `Welcome ${localStorage.getItem(
      "User's Name"
    )} \n\n Your current balance is ${localStorage.getItem("User's Income")}`;
  }
  validate() {
    if (
      localStorage.getItem("User's Name") !== null &&
      localStorage.getItem("User's Income") !== null
    ) {
      localStorage.removeItem("User's Name");
      localStorage.removeItem("User's Income");
      localStorage.removeItem("expenseNo");
      localStorage.removeItem("amount");
      window.location.href = "index.html";
    }
  }
  confirm() {
    let inputValue = this.inputText.value.trim();

    if (inputValue === "") {
      this.err.innerText = "Please enter the expense";
      return;
    }

    if (!isNaN(parseInt(inputValue))) {
      this.err.innerText = "Numbers are not allowed in this field";
      return;
    }

    if (localStorage.getItem("expenseNo") !== null) {
      this.storeExpenses = JSON.parse(localStorage.getItem("expenseNo"));
    } else {
      this.storeExpenses = [];
    }

    this.storeExpenses.push(inputValue);
    localStorage.setItem("expenseNo", JSON.stringify(this.storeExpenses));
    this.loadExpenses(inputValue);
    this.inputText.value = "";
    this.err.innerText = "";
  }

  loadExpenses(value) {
    let expenseElement = document.createElement("p");
    let imgElement = document.createElement("img");
    let inputElement = document.createElement("input");
    let confirmBtn = document.createElement("button");
    imgElement.src = "assets/images/cancel.png";
    expenseElement.innerText = value;
    inputElement.type = "text";
    inputElement.placeholder = "Enter the amount";
    confirmBtn.innerText = "Confirm";
    confirmBtn.addEventListener("click", () =>
      this.amount(value, inputElement.value, inputElement, confirmBtn)
    );
    expenseElement.appendChild(imgElement);
    this.expenseContainer.appendChild(expenseElement);
    this.expenseContainer.appendChild(inputElement);
    this.expenseContainer.appendChild(confirmBtn);
    imgElement.addEventListener("click", () =>
      this.cancelBtn(
        expenseElement.innerText,
        expenseElement,
        inputElement,
        confirmBtn
      )
    );
  }
  amount(key, value, inputElement, confirmBtn) {
    let storedIncome = localStorage.getItem("User's Income");
    if (storedIncome !== null) {
      this.currentAmount = parseInt(storedIncome);
    }
    let expenseValue = parseInt(value);
    if (!isNaN(expenseValue) && expenseValue <= this.currentAmount) {
      this.err.innerText = "";
      this.currentAmount -= expenseValue;
      localStorage.setItem("User's Income", JSON.stringify(this.currentAmount));
      this.obj = JSON.parse(localStorage.getItem("amount")) || {};
      this.obj[key] = expenseValue;
      localStorage.setItem("amount", JSON.stringify(this.obj));
      this.expenseContainer.removeChild(inputElement);
      this.expenseContainer.removeChild(confirmBtn);
      this.createChart();
      this.showUserDetails();
    } else if (isNaN(expenseValue)) {
      this.err.innerText = "PLease enter a valid number";
    } else {
      this.err.innerText =
        "Insuffiecient Balance please check your current balance";
    }
  }

  displayExpenses() {
    if (localStorage.getItem("expenseNo") !== null) {
      let arr = JSON.parse(localStorage.getItem("expenseNo"));
      arr.forEach((element) => {
        let expenseElement = document.createElement("p");
        let imgElement = document.createElement("img");
        imgElement.src = "assets/images/cancel.png";
        imgElement.addEventListener("click", () => this.remove(expenseElement));
        expenseElement.innerText = element;
        expenseElement.appendChild(imgElement);
        this.expenseContainer.appendChild(expenseElement);
        this.createChart();
      });
    } else {
      return;
    }
  }
  remove(expenseElement) {
    if (localStorage.getItem("amount") !== null) {
      this.obj = JSON.parse(localStorage.getItem("amount"));
      delete this.obj[expenseElement.innerText];
      localStorage.setItem("amount", JSON.stringify(this.obj));
      this.storeExpenses = JSON.parse(localStorage.getItem("expenseNo"));
      let newarr = this.storeExpenses.filter(
        (x) => x !== expenseElement.innerText
      );
      localStorage.setItem("expenseNo", JSON.stringify(newarr));
    }
    if (expenseElement && this.expenseContainer.contains(expenseElement)) {
      this.expenseContainer.removeChild(expenseElement);
    }
    this.createChart();
  }
  cancelBtn(removeElement, expenseElement, inputElement, confirmBtn) {
    if (localStorage.getItem("amount") !== null) {
      this.obj = JSON.parse(localStorage.getItem("amount"));
      let restoreAmount = parseInt(this.obj[removeElement]) || 0;
      let storedIncome = parseInt(localStorage.getItem("User's Income")) || 0;
      storedIncome += restoreAmount; // Restore the deducted amount
      localStorage.setItem("User's Income", JSON.stringify(storedIncome));
      this.showUserDetails();
      delete this.obj[removeElement];
      localStorage.setItem("amount", JSON.stringify(this.obj));
    }

    this.storeExpenses = JSON.parse(localStorage.getItem("expenseNo")) || [];
    let newarr = this.storeExpenses.filter((x) => x !== removeElement);
    localStorage.setItem("expenseNo", JSON.stringify(newarr));

    if (expenseElement && this.expenseContainer.contains(expenseElement)) {
      this.expenseContainer.removeChild(expenseElement);
    }
    if (inputElement && this.expenseContainer.contains(inputElement)) {
      this.expenseContainer.removeChild(inputElement);
    }
    if (confirmBtn && this.expenseContainer.contains(confirmBtn)) {
      this.expenseContainer.removeChild(confirmBtn);
    }

    this.createChart();
  }

  createChart() {
    if (this.myChartInstance !== null) {
      this.myChartInstance.destroy();
    }
    if (localStorage.getItem("amount") !== null) {
      let obj = JSON.parse(localStorage.getItem("amount"));
      let label = JSON.parse(localStorage.getItem("expenseNo"));
      this.myChartInstance = new Chart(this.ctx, {
        type: "bar",
        data: {
          labels: label.map((element) => element),
          datasets: [
            {
              label: "Your Expenses Chart",
              data: label.map((element) => obj[element]),
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  }
}
let obj = new Main();
window.addEventListener("load", () => obj.displayExpenses());
