function check() {
  if (
    localStorage.getItem("User's Name") === null &&
    localStorage.getItem("User's Income") === null
  ) {
    new RegisterCode();
  } else {
    window.location.href = "welcome.html";
  }
}

window.addEventListener("load", () => check());
window.addEventListener("beforeunload", () => {
  clearInterval(timeInterval);
});

let imageGallery = document.querySelector("#images");
let imagesArray = [
  "assets/images/img1.webp",
  "assets/images/img2.webp",
  "assets/images/img3.webp",
  "assets/images/img4.webp",
];
let imageElement = document.createElement("img");
let index = 0;

imageElement.src = imagesArray[index];
imageGallery.appendChild(imageElement);

let timeInterval = setInterval(imageGenerator, 6000);

function imageGenerator() {
  index++;
  if (index >= imagesArray.length) {
    index = 0;
  }
  imageElement.style.opacity = "0";
  setTimeout(() => {
    imageElement.src = imagesArray[index];
    imageElement.style.opacity = "1";
  }, 2000);
}

class RegisterCode {
  constructor() {
    this.flag = 0;
    this.asideContainer = document.querySelector(".aside-container");
    this.registerBtn = document.querySelector("#register");
    this.bottomBtn = document.querySelector("#bottom-btn");
    this.text = document.querySelector(".text");
    this.main = document.querySelector(".main");
    this.gif = document.querySelector("#gif");

    this.inputElement = document.createElement("input");
    this.inputElement2 = document.createElement("input");
    this.submitBtn = document.createElement("button");
    this.error = document.createElement("div");

    this.error.classList.add("error");

    this.submitBtn.innerText = "Confirm";
    this.submitBtn.addEventListener("click", () => this.validate());
    this.bottomBtn.addEventListener("click", () => this.scrollUp());
    this.registerBtn.addEventListener("click", () => this.register());
  }
  register() {
    if (this.text) this.main.removeChild(this.text);
    if (this.registerBtn) this.asideContainer.removeChild(this.registerBtn);

    this.flag = 1;
    this.gif.style.display = "none";
    this.inputElement.type = "text";
    this.inputElement.placeholder = "Enter your name";
    this.inputElement2.type = "text";
    this.inputElement2.placeholder = "Enter your balance";
    this.main.appendChild(this.inputElement);
    this.main.appendChild(this.inputElement2);
    this.asideContainer.appendChild(this.submitBtn);
  }
  validate() {
    let name = this.inputElement.value.trim();
    let income = this.inputElement2.value.trim();

    if (name === "") {
      this.error.innerText = "Please enter your name before submitting";
      this.error.classList.add("error");
      this.asideContainer.appendChild(this.error);
    } else if (income === "" || isNaN(income)) {
      this.error.innerText = "Please enter a valid number for income";
      this.error.classList.add("error");
      this.asideContainer.appendChild(this.error);
    } else {
      this.error.innerText = "";
      localStorage.setItem("User's Name", name);
      localStorage.setItem("User's Income", income);
      window.location.href = "welcome.html";
    }
  }

  scrollUp() {
    if (this.flag === 0) {
      this.gif.style.display = "block";
    }
    this.registerBtn.scrollIntoView({ behavior: "smooth" });
  }
}
