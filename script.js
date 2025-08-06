const emailInput = document.querySelector("input#email");
const passwordInput = document.querySelector("input#password");
const credentialsForm = document.querySelector("form");

const EMAIL = "EMAIL";
const PASSWORD = "PASSWORD";

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
    },
    [PASSWORD]: {
      htmlInput: passwordInput,
    },
  };

  const { htmlInput } = inputMapper[inputSlug];
  const { value: inputValue } = htmlInput;

  if (!inputValue) {
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

async function submitCredentials(event) {
  event.preventDefault();

  const isEmailValid = checkIfInputIsValid(EMAIL);
  const isPasswordValid = checkIfInputIsValid(PASSWORD);

  if (!isEmailValid || !isPasswordValid) {
    createDangerAdvisor();
    return;
  }

  removeDangerAdvisor();
  const { status, timeoutId } = await sendCredentials({
    email: emailInput.value,
    password: passwordInput.value,
  });

  if (status === 204) {
    clearTimeout(timeoutId);
    console.log("success");
  }
}

credentialsForm.addEventListener("submit", submitCredentials);
