const emailInput = document.querySelector("input#email");
const passwordInput = document.querySelector("input#password");
const credentialsForm = document.querySelector("form");

const EMAIL = "EMAIL";
const PASSWORD = "PASSWORD";

let isFormDirty = false;

emailInput.addEventListener("input", ({ target: { value } }) => {
  validEmail(value);
});

passwordInput.addEventListener("input", ({ target: { value } }) => {
  validPassword(value);
});

function validEmail(value) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const isEmailValid = emailRegex.test(value);

  if (!isFormDirty) return false;

  if (!isEmailValid) {
    addInputDangerClass(emailInput);
    return false;
  }

  removeInputDangerClass(emailInput);

  if (validPassword(passwordInput.value)) removeDangerAdvisor();

  return true;
}

function validPassword(value) {
  if (!isFormDirty) return false;

  if (!value) {
    addInputDangerClass(passwordInput);
    return false;
  }

  if (validEmail(emailInput.value)) removeDangerAdvisor();

  removeInputDangerClass(passwordInput);

  return true;
}

function createDangerAdvisor(
  advisorText = "Please, complete your credentials"
) {
  let dangerAdvisor = document.querySelector("p#danger-advisor");

  if (dangerAdvisor) return;

  dangerAdvisor = document.createElement("p");
  dangerAdvisor.id = "danger-advisor";
  dangerAdvisor.innerHTML = advisorText;

  credentialsForm.prepend(dangerAdvisor);
}

function addInputDangerClass(input) {
  input.classList.add("danger");
}

function removeInputDangerClass(input) {
  input.classList.remove("danger");
}

function removeDangerAdvisor() {
  const dangerAdvisor = document.querySelector("p#danger-advisor");

  if (!dangerAdvisor) return;

  credentialsForm.removeChild(dangerAdvisor);
}

function checkIfInputIsValid(inputSlug) {
  const inputMapper = {
    [EMAIL]: {
      htmlInput: emailInput,
      regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },
    [PASSWORD]: {
      htmlInput: passwordInput,
    },
  };

  isFormDirty = true;

  const { htmlInput, regex = null } = inputMapper[inputSlug];
  const { value: inputValue } = htmlInput;

  const isRegexValid = regex ? regex.test(inputValue) : true;

  if (!inputValue || !isRegexValid) {
    addInputDangerClass(htmlInput);
    return false;
  }

  removeInputDangerClass(htmlInput);
  return true;
}

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

async function submitCredentials(event) {
  event.preventDefault();

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
