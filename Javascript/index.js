document.addEventListener("DOMContentLoaded", function () {
  // Load functions
  adminExist();

  // Check if the user is online
  var sessionUser = JSON.parse(localStorage.getItem("sessionUser"));

  if (!sessionUser) {
  } else {
    if (sessionUser.role === "admin") {
      window.location.href = "admin-board.html";
    } else if (sessionUser.role === "student") {
      window.location.href = "student-board.html";
    }
  }

  document
    .getElementById("show-register")
    .addEventListener("click", function () {
      document.querySelector(".login-form").style.display = "none";
      document.querySelector(".register-form").style.display = "block";
    });

  document.getElementById("show-login").addEventListener("click", function () {
    document.querySelector(".login-form").style.display = "block";
    document.querySelector(".register-form").style.display = "none";
  });

  document.getElementById("register-form").addEventListener("submit", register);

  document.getElementById("login-form").addEventListener("submit", login);

  // Ajouter Admin au Local storage
  function addAdminToLocalStorage() {
    var users = JSON.parse(localStorage.getItem("users")) || [];

    var admin = {
      ID: users.length + 1,
      username: "Ayman Kadiri",
      email: "admin@FST.com",
      password: "admin",
      role: "admin",
    };

    users.push(admin);
    localStorage.setItem("users", JSON.stringify(users));
  }

  // Check if Admin Exists in LocalStorage
  function adminExist() {
    var usersLocalStorage = JSON.parse(localStorage.getItem("users"));
    var adminExists = false;

    if (usersLocalStorage) {
      usersLocalStorage.forEach(function (user) {
        if (user.role === "admin") {
          adminExists = true;
        }
      });
    }

    if (!usersLocalStorage || !adminExists) {
      addAdminToLocalStorage();
    }
  }

  // Register
  function register(event) {
    event.preventDefault();

    var users = JSON.parse(localStorage.getItem("users")) || [];

    var username = document.getElementById("newUsername").value;
    var email = document.getElementById("registerEmail").value;
    var password = document.getElementById("registerPassword").value;

    var newStudent = {
      ID: users.length + 1,
      username: username,
      email: email,
      password: password,
      blocages: [],
      role: "student",
    };

    users.push(newStudent);

    localStorage.setItem("users", JSON.stringify(users));

    alert("Bonjour " + username + " votre enregistrement est réussi !");

    document.querySelector(".login-form").style.display = "block";
    document.querySelector(".register-form").style.display = "none";
  }

  // Login
  function login(event) {
    event.preventDefault();

    var email = document.getElementById("loginEmail").value;
    var password = document.getElementById("loginPassword").value;

    var users = JSON.parse(localStorage.getItem("users")) || [];

    var user = users.find(function (user) {
      return user.email === email && user.password === password;
    });

    // Enregister la session dans local strorage
    localStorage.setItem("sessionUser", JSON.stringify(user));

    if (user) {
      if (user.role === "admin") {
        window.location.href = "admin-board.html";
      } else {
        window.location.href = "student-board.html";
      }
    } else {
      alert("Email ou mot de passe incorrect");
    }
  }
});
