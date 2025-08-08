const emailInput = document.querySelector("input#email");
const passwordInput = document.querySelector("input#password");
const credentialsForm = document.querySelector("form");
const submitButton = document.querySelector("button");

const EMAIL = "EMAIL";
const PASSWORD = "PASSWORD";

const formValidation = {
  isFormDirty: false,
  isFormValid: false,
  [EMAIL]: {
    htmlInput: emailInput,
    regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    isValid: false,
  },
  [PASSWORD]: {
    htmlInput: passwordInput,
    isValid: false,
  },
};

function sendCredentials(credentials) {
  return new Promise((resolve) => {
    const timeoutId = setTimeout(() => {
      console.log(credentials);
      resolve({ status: 204, timeoutId });
    }, 1000);
  });
}

function toggleLoading() {
  const isLoading = submitButton.classList.contains("loading");

  if (isLoading) {
    submitButton.classList.remove("loading");
    emailInput.removeAttribute("disabled");
    passwordInput.removeAttribute("disabled");
    return;
  }

  emailInput.setAttribute("disabled", true);
  passwordInput.setAttribute("disabled", true);
  submitButton.classList.add("loading");
}

function createDangerAdvisor() {
  let dangerAdvisor = document.querySelector("p#danger-advisor");

  if (dangerAdvisor) return;

  dangerAdvisor = document.createElement("p");
  dangerAdvisor.id = "danger-advisor";
  dangerAdvisor.innerHTML = "Please, complete your credentials";

  credentialsForm.prepend(dangerAdvisor);
}

function addInputDangerClass(input) {
  input.classList.add("danger");
}

function removeDangerAdvisor() {
  const dangerAdvisor = document.querySelector("p#danger-advisor");

  if (!dangerAdvisor) return;

  credentialsForm.removeChild(dangerAdvisor);
}

function removeInputDangerClass(input) {
  input.classList.remove("danger");
}

function checkFormValidation() {
  const isFormValid = Object.values(formValidation).every(
    ({ isValid = true }) => isValid
  );

  formValidation.isFormValid = isFormValid;
}

function checkIfInputIsValid(inputSlug) {
  const { htmlInput, regex = null } = formValidation[inputSlug];
  const { value: inputValue } = htmlInput;

  const isRegexValid = regex ? regex.test(inputValue) : true;
  const isInputValid = inputValue && isRegexValid;
  formValidation[inputSlug].isValid = isInputValid;
  checkFormValidation();

  if (isInputValid) {
    removeInputDangerClass(htmlInput);
    if (formValidation.isFormDirty && formValidation.isFormValid)
      removeDangerAdvisor();
  } else {
    addInputDangerClass(htmlInput);
    if (formValidation.isFormDirty) createDangerAdvisor();
  }

  return isInputValid;
}

async function submitCredentials(event) {
  event.preventDefault();
  formValidation.isFormDirty = true;

  const isEmailValid = checkIfInputIsValid(EMAIL);
  const isPasswordValid = checkIfInputIsValid(PASSWORD);

  if (!isEmailValid || !isPasswordValid) {
    createDangerAdvisor();
    return;
  }

  removeDangerAdvisor();
  toggleLoading();

  try {
    const { status, timeoutId } = await sendCredentials({
      email: emailInput.value,
      password: passwordInput.value,
    });

    if (status === 204) {
      clearTimeout(timeoutId);
      console.log("success");
    }
  } finally {
    toggleLoading();
  }
}

credentialsForm.addEventListener("submit", submitCredentials);
emailInput.addEventListener("input", () => checkIfInputIsValid(EMAIL));
passwordInput.addEventListener("input", () => checkIfInputIsValid(PASSWORD));
