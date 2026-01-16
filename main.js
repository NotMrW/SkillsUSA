const storageKeys = {
  user: "skillsusaUser",
  district: "skillsusaDistrictSignup",
};

const navToggle = document.querySelector("[data-nav-toggle]");
if (navToggle) {
  navToggle.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
}

const countdown = document.querySelector("[data-countdown]");
if (countdown) {
  const target = new Date(countdown.dataset.countdown);
  const daysEl = countdown.querySelector("[data-days]");
  const hoursEl = countdown.querySelector("[data-hours]");
  const minutesEl = countdown.querySelector("[data-minutes]");

  const tick = () => {
    const now = new Date();
    const diff = Math.max(target - now, 0);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minutesEl.textContent = String(minutes).padStart(2, "0");
  };

  tick();
  setInterval(tick, 60000);
}

const setAlert = (form, message, isSuccess = true) => {
  const alert = form.querySelector(".alert");
  if (!alert) return;
  alert.hidden = false;
  alert.textContent = message;
  alert.style.background = isSuccess ? "#e9f8ef" : "#fdecec";
  alert.style.color = isSuccess ? "#05603a" : "#b42318";
};

const clearErrors = (form) => {
  form.querySelectorAll(".field-error").forEach((el) => {
    el.textContent = "";
  });
};

const validateFields = (fields) => {
  let valid = true;
  fields.forEach((field) => {
    const error = field.closest(".field").querySelector(".field-error");
    if (!field.checkValidity()) {
      valid = false;
      error.textContent = field.validationMessage;
    } else {
      error.textContent = "";
    }
  });
  return valid;
};

const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    clearErrors(loginForm);
    const email = loginForm.querySelector("#login-email");
    const password = loginForm.querySelector("#login-password");
    const isValid = validateFields([email, password]);
    if (!isValid) return;

    const stored = localStorage.getItem(storageKeys.user);
    if (!stored) {
      setAlert(loginForm, "No account found. Please create an account first.", false);
      return;
    }

    const user = JSON.parse(stored);
    if (user.email === email.value && user.password === password.value) {
      setAlert(loginForm, `Welcome back, ${user.name}!`, true);
      loginForm.reset();
      return;
    }

    setAlert(loginForm, "Email or password does not match our demo record.", false);
  });
}

const createAccountForm = document.getElementById("create-account-form");
if (createAccountForm) {
  createAccountForm.addEventListener("submit", (event) => {
    event.preventDefault();
    clearErrors(createAccountForm);
    const fields = Array.from(createAccountForm.querySelectorAll("input[required], select[required]"));
    if (!validateFields(fields)) return;

    const data = Object.fromEntries(new FormData(createAccountForm));
    localStorage.setItem(storageKeys.user, JSON.stringify(data));
    setAlert(createAccountForm, "Account created! You can now log in.");
    createAccountForm.reset();
  });
}

const districtForm = document.getElementById("district-form");
if (districtForm) {
  const steps = Array.from(districtForm.querySelectorAll(".form-step"));
  const stepper = document.querySelector("[data-stepper]");
  const nextBtn = districtForm.querySelector("[data-step-next]");
  const prevBtn = districtForm.querySelector("[data-step-prev]");
  const submitBtn = districtForm.querySelector("[data-step-submit]");
  let currentStep = 0;

  const updateStep = (stepIndex) => {
    steps.forEach((step, index) => {
      step.classList.toggle("is-active", index === stepIndex);
    });

    if (stepper) {
      stepper.querySelectorAll("li").forEach((item) => {
        item.classList.toggle("is-active", Number(item.dataset.step) === stepIndex + 1);
      });
    }

    prevBtn.disabled = stepIndex === 0;
    nextBtn.style.display = stepIndex === steps.length - 1 ? "none" : "inline-flex";
    submitBtn.style.display = stepIndex === steps.length - 1 ? "inline-flex" : "none";
  };

  updateStep(currentStep);

  nextBtn.addEventListener("click", () => {
    clearErrors(districtForm);
    const fields = Array.from(steps[currentStep].querySelectorAll("input[required], select[required]"));
    if (!validateFields(fields)) return;
    currentStep += 1;
    updateStep(currentStep);
  });

  prevBtn.addEventListener("click", () => {
    currentStep = Math.max(0, currentStep - 1);
    updateStep(currentStep);
  });

  districtForm.addEventListener("submit", (event) => {
    event.preventDefault();
    clearErrors(districtForm);
    const fields = Array.from(steps[currentStep].querySelectorAll("input[required], select[required]"));
    if (!validateFields(fields)) return;

    const data = Object.fromEntries(new FormData(districtForm));
    localStorage.setItem(storageKeys.district, JSON.stringify(data));
    setAlert(districtForm, "District signup saved locally. We'll follow up with next steps.");
    districtForm.reset();

    const successPanel = document.getElementById("district-success");
    if (successPanel) {
      districtForm.parentElement.hidden = true;
      successPanel.hidden = false;
    }
  });
}




