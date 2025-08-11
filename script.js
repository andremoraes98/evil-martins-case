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
    ariaErrormessage: "email-error",
    htmlInput: emailInput,
    regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    isValid: false,
  },
  [PASSWORD]: {
    ariaErrormessage: "password-error",
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
  input.classList.add("invalid");

  const label = input.parentElement;
  label.classList.add("invalid");
}

function removeDangerAdvisor() {
  const dangerAdvisor = document.querySelector("p#danger-advisor");

  if (!dangerAdvisor) return;

  credentialsForm.removeChild(dangerAdvisor);
}

function removeInputDangerClass(input) {
  input.classList.remove("invalid");

  const label = input.parentElement;
  label.classList.remove("invalid");
}

function checkFormValidation() {
  const isFormValid = Object.values(formValidation).every(
    ({ isValid = true }) => isValid
  );

  formValidation.isFormValid = isFormValid;
}

function checkInput(inputSlug) {
  const { htmlInput, regex = null } = formValidation[inputSlug];
  const { value: inputValue } = htmlInput;

  const isRegexValid = regex ? regex.test(inputValue) : true;
  const isInputValid = !!inputValue && isRegexValid;

  formValidation[inputSlug].isValid = isInputValid;

  return isInputValid;
}

function toggleFormValidation(isInputValid, inputSlug) {
  const { ariaErrormessage, htmlInput } = formValidation[inputSlug];

  if (isInputValid) {
    removeInputDangerClass(htmlInput);
    htmlInput.removeAttribute("aria-errormessage");
    htmlInput.removeAttribute("aria-invalid");

    if (!formValidation.isFormDirty || !formValidation.isFormValid) return;

    removeDangerAdvisor();
    return;
  }

  addInputDangerClass(htmlInput);
  htmlInput.setAttribute("aria-errormessage", ariaErrormessage);
  htmlInput.setAttribute("aria-invalid", true);

  if (!formValidation.isFormDirty) return;

  createDangerAdvisor();
}

function checkIfInputIsValid(inputSlug) {
  const isInputValid = checkInput(inputSlug);

  checkFormValidation();
  toggleFormValidation(isInputValid, inputSlug);

  return isInputValid;
}

function handleInputChange(inputSlug) {
  const isInputValid = checkInput(inputSlug);

  if (!isInputValid) return;

  checkFormValidation();
  toggleFormValidation(true, inputSlug);
}

async function submitCredentials(event) {
  event.preventDefault();
  formValidation.isFormDirty = true;
  submitButton.disabled = true;

  const isEmailValid = checkIfInputIsValid(EMAIL);
  const isPasswordValid = checkIfInputIsValid(PASSWORD);

  if (!isEmailValid || !isPasswordValid) {
    createDangerAdvisor();
    submitButton.disabled = false;
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
    submitButton.disabled = false;
  }
}

credentialsForm.addEventListener("submit", submitCredentials);
emailInput.addEventListener("change", () => checkIfInputIsValid(EMAIL));
passwordInput.addEventListener("change", () => checkIfInputIsValid(PASSWORD));
emailInput.addEventListener("input", () => handleInputChange(EMAIL));
passwordInput.addEventListener("input", () => handleInputChange(PASSWORD));
