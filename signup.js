// Signup form handling
document.getElementById("signup-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const firstname = document.getElementById("firstname-input").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;
  const repeatPassword = document.getElementById("signup-repeat-password").value;

  const errorMessage = document.getElementById("signup-error-message");

  if (!firstname || !email || !password || !repeatPassword) {
    errorMessage.textContent = "All fields are required!";
    return;
  }

  if (password !== repeatPassword) {
    errorMessage.textContent = "Passwords do not match!";
    return;
  }

  const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
  const emailExists = existingUsers.some((user) => user.email === email);

  if (emailExists) {
    errorMessage.textContent = "Email already exists. Please use a different one!";
    return;
  }

  const newUser = { firstname, email, password };
  existingUsers.push(newUser);
  localStorage.setItem("users", JSON.stringify(existingUsers));

  document.getElementById("signup-form").reset();
  errorMessage.style.color = "green";
  errorMessage.textContent = "Signup successful! Redirecting to login...";

  setTimeout(() => {
    window.location.href = "login.html";
  }, 2000);
});
