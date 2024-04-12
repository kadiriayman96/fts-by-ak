document.addEventListener("DOMContentLoaded", function () {
  // Users et Session User Global & Load Data
  var sessionUser = JSON.parse(localStorage.getItem("sessionUser"));
  var users = JSON.parse(localStorage.getItem("users"));
  loadStudentData();

  // Check if the user is connected
  if (!sessionUser || sessionUser.role != "student") {
    window.location.href = "index.html";
  }

  document.getElementById("add-blocage").addEventListener("click", function () {
    document.querySelector(".modal-add").style.display = "block";
  });

  document
    .getElementById("close-button")
    .addEventListener("click", function () {
      document.querySelector(".modal-add").style.display = "none";
    });

  document
    .getElementById("close-update-button")
    .addEventListener("click", function () {
      document.querySelector(".modal-update").style.display = "none";
    });

  document
    .getElementById("close-show-button")
    .addEventListener("click", function () {
      document.querySelector(".modal-show").style.display = "none";
    });

  // Fermer les modales ajouter et modifier et afficher
  window.onclick = function (event) {
    var modalAdd = document.getElementById("modal-add");
    var modalUpdate = document.getElementById("modal-update");
    var modalShow = document.getElementById("modal-show");

    var container = document.querySelector(".container");
    var containerUpdate = document.getElementById("modal-container-update");
    var containerShow = document.getElementById("modal-container-show");

    if (event.target == container) {
      modalAdd.style.display = "none";
    }
    if (event.target == containerUpdate) {
      modalUpdate.style.display = "none";
    }
    if (event.target == containerShow) {
      modalShow.style.display = "none";
    }
  };

  // Load the user data from local storage sessionUser
  function loadStudentData() {
    var studentName = document.getElementById("student-name");
    var tableStudentBody = document.getElementById("table-body");

    if (sessionUser) {
      studentName.innerHTML = `Tableau de bord : ${sessionUser.username}<br/>Role : ${sessionUser.role}`;
      LoadTableBody(sessionUser, tableStudentBody); // Load table data
    }
  }

  //Logout
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

  // Ajouter un Blocage
  document
    .getElementById("add-blocage-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      var modalAdd = document.getElementById("modal-add");
      var title = document.getElementById("add-title").value;
      var brief = document.getElementById("add-brief").value;
      var difficulty = document.getElementById("add-difficulty").value;

      var selectFormateur = document.getElementById("select-formateur");
      var formateur =
        selectFormateur.options[selectFormateur.selectedIndex].value;

      var selectBootcamp = document.getElementById("select-bootcamp");
      var bootcamp = selectBootcamp.options[selectBootcamp.selectedIndex].value;

      var dateCreation = getDateNow();

      var newBlocage = {
        ID: sessionUser.blocages.length + 1,
        formateur,
        bootcamp,
        title,
        brief,
        difficulty,
        dateCreation,
        valide: false,
      };

      // Check 'blocages' tableau in sessionUser
      if (!sessionUser.hasOwnProperty("blocages")) {
        sessionUser.blocages = [];
      }
      sessionUser.blocages.push(newBlocage);

      // Update the sessionUser in the users array
      var index = users.findIndex((user) => user.ID === sessionUser.ID);

      if (index !== -1) {
        users[index] = sessionUser;
      }

      // Update localStorage sessionUser
      localStorage.setItem("sessionUser", JSON.stringify(sessionUser));

      // Update localStorage users
      localStorage.setItem("users", JSON.stringify(users));

      // Reset the form & Cacher la modale
      document.getElementById("add-blocage-form").reset();
      modalAdd.style.display = "none";

      // Reload the user data
      LoadTableBody(sessionUser, document.getElementById("table-body"));

      alert("Blocage ajouté avec succès");
    });

  // Get Date Now
  function getDateNow() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }
});

function customAlert(title, message) {
  // Create overlay element
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  overlay.style.display = "flex";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.zIndex = "999";

  // Create alert box
  const alertBox = document.createElement("div");
  alertBox.style.backgroundColor = "#fff";
  alertBox.style.padding = "20px";
  alertBox.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.2)";
  alertBox.style.maxWidth = "400px";
  alertBox.style.textAlign = "center";

  // Create title element
  const titleElement = document.createElement("h2");
  titleElement.textContent = "Solution : " + title;
  titleElement.style.color = "#333";
  titleElement.style.marginBottom = "10px";

  // Create message element
  const messageElement = document.createElement("p");
  messageElement.textContent = message;
  messageElement.style.color = "#666";
  messageElement.style.marginBottom = "20px";

  // Create close button
  const closeButton = document.createElement("button");
  closeButton.textContent = "X";
  closeButton.style.padding = "10px 20px";
  closeButton.style.backgroundColor = "#ce0033";
  closeButton.style.color = "#fff";
  closeButton.style.border = "none";
  closeButton.style.cursor = "pointer";
  closeButton.style.outline = "none";
  closeButton.style.transition = "background-color 0.3s";

  // Close button hover effect
  closeButton.addEventListener("mouseover", () => {
    closeButton.style.backgroundColor = "#76011e";
  });

  closeButton.addEventListener("mouseout", () => {
    closeButton.style.backgroundColor = "#76011e";
  });

  // Close button click event
  closeButton.addEventListener("click", () => {
    document.body.removeChild(overlay);
  });

  // Append elements to alert box
  alertBox.appendChild(titleElement);
  alertBox.appendChild(messageElement);
  alertBox.appendChild(closeButton);

  // Append alert box to overlay
  overlay.appendChild(alertBox);

  // Append overlay to document body
  document.body.appendChild(overlay);
}

// Load Table Body
function LoadTableBody(sessionUser, tableStudentBody) {
  tableStudentBody.innerHTML = "";

  sessionUser.blocages.forEach(function (blocage, index) {
    // Create table row
    var row = document.createElement("tr");

    row.setAttribute("data-id", blocage.ID);
    row.innerHTML = `
      <td>${blocage.title}</td>
      <td>${blocage.dateCreation}</td>
      <td>
        <button class="show-difficulty">
          <span class="material-symbols-outlined"> visibility </span>
        </button>
      </td>
      ${
        blocage.valide
          ? `<td class="show-admin-comment"><span class="material-symbols-outlined" style="color: green"> check_box </span></td>
            <td class="actions">
              <button class="update-button" id="button-gray-style" style="cursor: not-allowed;" disabled>
              <span class="material-symbols-outlined"> edit_square </span>
              </button>
              <button class="delete-button" id="button-gray-style" style="cursor: not-allowed;" disabled>
                <span class="material-symbols-outlined"> delete </span>
              </button>
            </td>`
          : `<td><span class="material-symbols-outlined" style="color: red"> check_box_outline_blank </span></td>
            <td class="actions">
              <button class="update-button">
                <span class="material-symbols-outlined"> edit_square </span>
              </button>
              <button class="delete-button">
                <span class="material-symbols-outlined"> delete </span>
              </button>
            </td>`
      }
      
    `;
    tableStudentBody.appendChild(row);
  });

  // Add event listeners to show modal détails
  tableStudentBody
    .querySelectorAll(".show-difficulty")
    .forEach(function (button) {
      button.addEventListener("click", function () {
        var blocageId = button.closest("tr").getAttribute("data-id");

        var blocageIndex = sessionUser.blocages.findIndex(function (blocage) {
          return blocage.ID == blocageId;
        });

        // Get the blocage object to be showed
        var blocage = sessionUser.blocages[blocageIndex];

        // Populate the show deatils modal with blocage details
        document.getElementById("show-formateur").value = blocage.formateur;
        document.getElementById("show-bootcamp").value = blocage.bootcamp;
        document.getElementById("show-brief").value = blocage.brief;
        document.getElementById("show-difficulty-textarea").value =
          blocage.difficulty;

        // Show the update modal
        document.querySelector(".modal-show").style.display = "block";
      });
    });

  // Add event listeners to update buttons
  tableStudentBody
    .querySelectorAll(".update-button")
    .forEach(function (button) {
      button.addEventListener("click", function () {
        // Get the index of the blocage to be updated based on its data-id
        var blocageId = button.closest("tr").getAttribute("data-id");

        var blocageIndex = sessionUser.blocages.findIndex(function (blocage) {
          return blocage.ID == blocageId;
        });

        // Get the blocage object to be updated
        var blocage = sessionUser.blocages[blocageIndex];

        // Populate the update modal with blocage details
        document.getElementById("update-title").value = blocage.title;
        document.getElementById("update-brief").value = blocage.brief;
        document.getElementById("update-difficulty").value = blocage.difficulty;

        // Show the update modal
        document.querySelector(".modal-update").style.display = "block";

        // Handle the update form submission
        var onSubmit = function (event) {
          event.preventDefault();

          // Get the updated values from the form
          var title = document.getElementById("update-title").value;
          var brief = document.getElementById("update-brief").value;
          var difficulty = document.getElementById("update-difficulty").value;

          // Update the blocage object
          blocage.title = title;
          blocage.brief = brief;
          blocage.difficulty = difficulty;

          // Update localStorage sessionUser
          localStorage.setItem("sessionUser", JSON.stringify(sessionUser));

          // Update localStorage users
          var users = JSON.parse(localStorage.getItem("users"));
          var userIndex = users.findIndex((user) => user.ID === sessionUser.ID);

          if (userIndex !== -1) {
            users[userIndex] = sessionUser;
            localStorage.setItem("users", JSON.stringify(users));
          }

          // Reload the user data
          LoadTableBody(sessionUser, tableStudentBody);

          // Hide the update modal
          document.querySelector(".modal-update").style.display = "none";

          // Remove the event listener to prevent multiple submissions
          document
            .getElementById("update-blocage-form")
            .removeEventListener("submit", onSubmit);

          alert("Blocage mis à jour avec succès");
        };

        document
          .getElementById("update-blocage-form")
          .addEventListener("submit", onSubmit);
      });
    });

  // Add event listeners to delete buttons
  tableStudentBody
    .querySelectorAll(".delete-button")
    .forEach(function (button) {
      button.addEventListener("click", function () {
        var blocageId = button.closest("tr").getAttribute("data-id");

        // Find the index of the blocage in sessionUser
        var blocageIndex = sessionUser.blocages.findIndex(
          (blocage) => blocage.ID == blocageId
        );

        // Remove blocage from sessionUser
        if (blocageIndex !== -1) {
          sessionUser.blocages.splice(blocageIndex, 1);
        }

        // Find the index of the user in users
        var users = JSON.parse(localStorage.getItem("users"));
        var userIndex = users.findIndex((user) => user.ID === sessionUser.ID);

        // Remove blocage from user
        if (userIndex !== -1) {
          var user = users[userIndex];
          var blocageIndexInUser = user.blocages.findIndex(
            (blocage) => blocage.ID == blocageId
          );
          if (blocageIndexInUser !== -1) {
            user.blocages.splice(blocageIndexInUser, 1);
          }
          localStorage.setItem("sessionUser", JSON.stringify(sessionUser));
          localStorage.setItem("users", JSON.stringify(users));
        }

        // Reload the user data
        LoadTableBody(sessionUser, tableStudentBody);

        alert("Blocage supprimé avec succès");
      });
    });

  // Add event listeners to show admin-comment after update
  tableStudentBody
    .querySelectorAll(".show-admin-comment")
    .forEach(function (button) {
      button.addEventListener("click", function () {
        var blocageId = button.closest("tr").getAttribute("data-id");

        var blocageIndex = sessionUser.blocages.findIndex(function (blocage) {
          return blocage.ID == blocageId;
        });

        // Get the blocage object to be showed
        var blocage = sessionUser.blocages[blocageIndex];

        var alertTitle = blocage.solution.Title;
        var textAlert = blocage.solution.Description;
        customAlert(alertTitle, textAlert);
      });
    });
}
