document.addEventListener("DOMContentLoaded", function () {
  // Users et Session User Global & Load Data
  var sessionUser = JSON.parse(localStorage.getItem("sessionUser"));
  var users = JSON.parse(localStorage.getItem("users"));
  loadAdminData();

  // Check if the user is online
  var sessionUser = JSON.parse(localStorage.getItem("sessionUser"));
  if (!sessionUser || sessionUser.role != "admin") {
    window.location.href = "index.html";
  }

  document.querySelectorAll(".admin-modal-button").forEach(function (button) {
    button.addEventListener("click", function () {
      document.querySelector(".modal-admin").style.display = "block";
    });
  });

  document
    .getElementById("close-admin-button")
    .addEventListener("click", function () {
      document.querySelector(".modal-admin").style.display = "none";
    });
  document
    .getElementById("close-show-button")
    .addEventListener("click", function () {
      document.querySelector(".modal-show").style.display = "none";
    });

  document.getElementById("option_1").addEventListener("click", function () {
    document.getElementById("text-area-1").style.display = "block";
    document.getElementById("text-area-2").style.display = "none";
    document.getElementById("text-area-3").style.display = "none";
  });

  document.getElementById("option_2").addEventListener("click", function () {
    document.getElementById("text-area-1").style.display = "none";
    document.getElementById("text-area-2").style.display = "block";
    document.getElementById("text-area-3").style.display = "none";
  });

  document.getElementById("option_3").addEventListener("click", function () {
    document.getElementById("text-area-1").style.display = "none";
    document.getElementById("text-area-2").style.display = "none";
    document.getElementById("text-area-3").style.display = "block";
  });

  // Fermer la modale
  window.onclick = function (event) {
    var modalAdmin = document.getElementById("modal-admin");
    var modalShow = document.getElementById("modal-show");

    var containerAdmin = document.getElementById("modal-container-admin");
    var containerShow = document.getElementById("modal-container-show");

    if (event.target == containerAdmin) {
      modalAdmin.style.display = "none";
    }

    if (event.target == containerShow) {
      modalShow.style.display = "none";
    }
  };

  // Load Admin Data
  function loadAdminData() {
    var headerAdminName = document.getElementById("admin-name");
    var adminModalName = document.getElementById("admin-modal-name");

    if (sessionUser) {
      headerAdminName.innerHTML = `Tableau de bord : ${sessionUser.username}<br/>Role : ${sessionUser.role}`;
      adminModalName.innerHTML = `Bonjour, ${sessionUser.username}`;
      LoadAdminTableBody(users, document.getElementById("table-body"));
    }
  }

  // Logout
  document
    .getElementById("logout-button")
    .addEventListener("click", function () {
      localStorage.removeItem("sessionUser");
      window.location.href = "index.html";
    });
  //Logout Mobile
  document
    .getElementById("logout-button-mobile")
    .addEventListener("click", function () {
      localStorage.removeItem("sessionUser");
      window.location.href = "index.html";
    });

  // Load table data
  function LoadAdminTableBody(users, tableAdminBody) {
    tableAdminBody.innerHTML = "";

    users.forEach((user) => {
      if (user.role == "student") {
        user.blocages.forEach((blocage) => {
          var row = document.createElement("tr");

          row.setAttribute("data-user-id", user.ID);
          row.setAttribute("data-blocage-id", blocage.ID);

          row.innerHTML = `
          <td>${user.username}</td>
          <td>${blocage.title}</td>
          <td>${blocage.dateCreation}</td>
          <td>
            <button class="show-difficulty">
              <span class="material-symbols-outlined"> visibility </span>
            </button>
          </td>
          ${
            blocage.valide
              ? `<td><span class="material-symbols-outlined" style="color: green"> check_box </span></td>`
              : `<td><span class="material-symbols-outlined" style="color: red"> check_box_outline_blank </span></td>`
          }
          <td class="actions">
            <button class="admin-modal-button">
              <span class="material-symbols-outlined"> forum </span>
            </button>
          </td>
          `;
          tableAdminBody.appendChild(row);
        });
      }
    });

    // Add event listeners to show modal détails
    tableAdminBody
      .querySelectorAll(".show-difficulty")
      .forEach(function (button) {
        button.addEventListener("click", function () {
          // Get the user ID and blocage ID
          var userId = button.closest("tr").getAttribute("data-user-id");
          var blocageId = button.closest("tr").getAttribute("data-blocage-id");

          var user = users.find((u) => u.ID == userId);

          if (user) {
            var blocage = user.blocages.find((b) => b.ID == blocageId);

            // Populate the show deatils modal with blocage details
            document.getElementById("show-student").value = user.username;
            document.getElementById("show-bootcamp").value = blocage.bootcamp;
            document.getElementById("show-brief").value = blocage.brief;
            document.getElementById("show-difficulty-textarea").value =
              blocage.difficulty;

            // Show the update modal
            document.querySelector(".modal-show").style.display = "block";
          }
        });
      });

    // add event listeners to the admin so he can valid field for students
    tableAdminBody
      .querySelectorAll(".admin-modal-button")
      .forEach(function (button) {
        button.addEventListener("click", function () {
          // Get the user ID and blocage ID
          var userId = button.closest("tr").getAttribute("data-user-id");
          var blocageId = button.closest("tr").getAttribute("data-blocage-id");

          var user = users.find((u) => u.ID == userId);

          // Show the admin validation modal
          document.querySelector(".modal-admin").style.display = "block";

          var onSubmit = function (event) {
            event.preventDefault();
            if (user) {
              var blocage = user.blocages.find((b) => b.ID == blocageId);
              if (blocage) {
                // Get the selected radio and text input values
                var selectedRadio = document.querySelector(
                  'input[name="options"]:checked'
                );

                var textArea1 = document.getElementById("text-solution-1");
                var textArea2 = document.getElementById("text-solution-2");
                var textArea3 = document.getElementById("text-solution-3");

                if (selectedRadio.value == "Encadré par un formateur") {
                  blocage.valide = true;
                  blocage.solution = {
                    Title: selectedRadio.value,
                    Description: textArea1.value,
                  };
                }

                if (selectedRadio.value == "Aidé par leurs pairs") {
                  blocage.valide = true;
                  blocage.solution = {
                    Title: selectedRadio.value,
                    Description: textArea2.value,
                  };
                }

                if (selectedRadio.value == "Intervention directe") {
                  blocage.valide = true;
                  blocage.solution = {
                    Title: selectedRadio.value,
                    Description: textArea3.value,
                  };
                }

                // Update localStorage users
                localStorage.setItem("users", JSON.stringify(users));

                // Reload the admin table data
                LoadAdminTableBody(
                  users,
                  document.getElementById("table-body")
                );
              }
            }

            // Hide the admin validation modal
            document.querySelector(".modal-admin").style.display = "none";

            // Remove the event listener to prevent multiple submissions
            document
              .getElementById("admin-details-validation")
              .removeEventListener("submit", onSubmit);
          };

          document
            .getElementById("admin-details-validation")
            .addEventListener("submit", onSubmit);
        });
      });
  }
});
