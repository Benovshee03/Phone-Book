const myUrl = "http://localhost:3000/users";
var tbody = document.querySelector(".tbody");
var card = document.querySelector(".cards");
var searchInput = document.querySelector(".search");
let nameInput = document.querySelector("#name");
let surnameInput = document.querySelector(".surname");
let emailInput = document.querySelector(".mail");
let numberInput = document.querySelector(".number");
let formElement = document.querySelector(".form");
let submitButton = document.querySelector(".submit");
let users = [];
var modal = document.querySelector(".modal")

async function fetchData() {
    try {
        const response = await fetch(myUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        data.forEach((e) => {
            const trow = document.createElement("tr");
            trow.innerHTML = `
                <td>${e.name}</td>
                <td>${e.surname}</td>
                <td>${e.number}</td>
                <td>${e.mail}</td>
                <td>
                    <button type="button" class="btn btn-danger times" data-id="${e.id}">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                    <button type="button" class="btn btn-warning update" data-id="${e.id}">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(trow);
            const cardBody = document.createElement("div");
            cardBody.classList.add("card-body","card");
            cardBody.innerHTML = `
                <p class="card-text">Name: ${e.name}</p>
                <p class="card-text">Surname: ${e.surname}</p>
                <p class="card-text">Phone Number: ${e.number}</p>
                <p class="card-text">Mail: ${e.mail}</p>
                <div class="d-flex justify-content-end buttons">
                    <button type="button" class="btn btn-danger times" data-id="${e.id}">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                    <button type="button" class="btn btn-warning update" data-id="${e.id}">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                </div>
            `;
            card.appendChild(cardBody);
        });

        searchInput.addEventListener("keyup", (e) => {
            var val = e.target.value;
            const filteredData = data.filter((u) => {
                let name = u.name.toLowerCase();
                let surname = u.surname.toLowerCase();
                let mail = u.mail.toLowerCase();
                return (
                    name.includes(val) ||
                    surname.includes(val) ||
                    mail.includes(val) ||
                    u.number.includes(val)
                );
            });
            filteredTable(filteredData);
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function filteredTable(filteredData) {
    tbody.innerHTML = "";
    card.innerHTML = "";
    filteredData.map((e) => {
        const trow = document.createElement("tr");
        trow.innerHTML = `
            <td>${e.name}</td>
            <td>${e.surname}</td>
            <td>${e.number}</td>
            <td>${e.mail}</td>
            <td>
                <button type="button" class="btn btn-danger times" data-id="${e.id}">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                <button type="button" class="btn btn-warning update" data-id="${e.id}">
                    <i class="fa-solid fa-pen"></i>
                </button>
            </td>
        `;
        tbody.appendChild(trow);

        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");
        cardBody.innerHTML = `
            <p class="card-text">Name: ${e.name}</p>
            <p class="card-text">Surname: ${e.surname}</p>
            <p class="card-text">Phone Number: ${e.number}</p>
            <p class="card-text">Mail: ${e.mail}</p>
            <div class="d-flex justify-content-end buttons">
                <button type="button" class="btn btn-danger times" data-id="${e.id}">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                <button type="button" class="btn btn-warning update" data-id="${e.id}">
                    <i class="fa-solid fa-pen"></i>
                </button>
            </div>
        `;
        card.appendChild(cardBody);
    });
}

formElement.addEventListener("submit", (e) => {
    e.preventDefault();
    let nameVal = nameInput.value;
    let surnameVal = surnameInput.value;
    let mailVal = emailInput.value;
    let numberVal = numberInput.value;

    const newUser = {
        name: nameVal,
        surname: surnameVal,
        mail: mailVal,
        number: numberVal,
    };

    postNewUser(newUser);
});

function postNewUser(newUser) {
    fetch(myUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
    })
        .then((response) => response.json())
        .then((responseData) => {
            newUser.id = responseData.id;
            users.push(newUser);
            nameInput.value = "";
            surnameInput.value = "";
            emailInput.value = "";
            numberInput.value = "";
            fetchData();
        })
        .catch((error) => {
            console.error("Error posting new user:", error);
        });
}

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("times")) {
        const userId = e.target.getAttribute("data-id");
        deleteUser(userId);
    }
    if (e.target.classList.contains("update")) {
        const userId = e.target.getAttribute("data-id");
        getUserDetails(userId);
    }
    if (e.target.closest(".card")) {
      const userId = e.target.closest(".card").querySelector(".update").getAttribute("data-id");
      showUserDetailsModal(userId);
  }
});

async function deleteUser(id) {
    try {
        await fetch(`${myUrl}/${id}`, {
            method: "DELETE",
        });

        users = users.filter((user) => user.id !== parseInt(id));

        fetchData();
    } catch (err) {
        console.log(err);
    }
}

async function updateUser(id) {
    try {
        const updatedUser = {
            name: nameInput.value,
            surname: surnameInput.value,
            mail: emailInput.value,
            number: numberInput.value,
        };

        await fetch(`${myUrl}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedUser),
        });
        fetchData();
    } catch (error) {
      console.error("Error updating user:", error);
    }
}


async function getUserDetails(id) {
    try {
        const response = await fetch(`${myUrl}/${id}`);
        const userData = await response.json();
        nameInput.value = userData.name;
        surnameInput.value = userData.surname;
        emailInput.value = userData.mail;
        numberInput.value = userData.number;
        const updateButton = document.createElement("button");
        updateButton.innerHTML = "Update";
        updateButton.type="submit"
        updateButton.classList.add("btn", "btn-warning", "col-2", "col-sm-2", "col-md-2s");
        
        console.log("updated");
        document.querySelector(".form .buttons").appendChild(updateButton);
        updateButton.addEventListener("click", () => {
          updateUser(id);
          clearInputFields();
      });
        submitButton.setAttribute('disabled', 'true');
    } catch (error) {
        console.error("Error fetching user details:", error);
    }
}
function showUserDetailsModal(userId) {
  getUserDetailsForModal(userId).then((user) => {
      const modalBody = modal.querySelector(".modal-body");
      modalBody.innerHTML = `
          <input class="form-control row mb-2" value="${user.name}" placeholder="Your username">
          <input class="form-control row mb-2" value="${user.surname}" placeholder="Your surname" required>
          <input class="form-control row mb-2" value="${user.number}" placeholder="Your email">
          <input class="form-control row mb-2" value="${user.mail}" placeholder="Your phone number" required>
          // <button type="submit btn btn-warning"></button>
      `;
      $(modal).modal("show");

      const editButton = document.createElement("button");
      editButton.innerHTML = "Edit";
      editButton.type="submit"
      editButton.classList.add("btn","btn-warning","text-align-end")
      document.querySelector(".modal-body").append(editButton)
      editButton.addEventListener(("click"),()=>{
        updateUser(userId)
        console.log("it is not completed");
        $(modal).modal("hide")
        clearInputFields()
      })

  });
}
async function getUserDetailsForModal(id) {
  try {
      const response = await fetch(`${myUrl}/${id}`);
      const userData = await response.json();
      return userData; 
      nameInput.value = userData.name;
      surnameInput.value = userData.surname;
      emailInput.value = userData.mail;
      numberInput.value = userData.number;

  } catch (error) {
      console.error("Error fetching user details:", error);
  }
}



function clearInputFields() {
    nameInput.value = "";
    surnameInput.value = "";
    emailInput.value = "";
    numberInput.value = "";
    submitButton.removeAttribute('disabled');
}

fetchData();
