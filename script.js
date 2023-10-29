document
  .getElementById("cardForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the form from actually submitting and refreshing the page

    let cardNumber = document.getElementById("cardInput").value;
    let office = "ARC";

    try {
      let response = await fetch("data.json");
      if (response.ok) {
        let raw = await response.text();

        let datasets;
        try {
          datasets = JSON.parse(raw);
        } catch (error) {
          console.error("Error parsing JSON:", error);
          return;
        }

        if (datasets && datasets.CardNum == cardNumber) {
          displayUserServices(datasets);
        } else {
          alert("Card not found.");
        }
      } else {
        console.error("Failed to fetch data. HTTP Status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  });

function displayUserServices(data) {
  // Hide the card swipe header
  document.querySelector(".card-swipe").style.display = "none";
  // document.getElementById("helloMessage").style.display = "none";

  // Display user information
  let userName = document.getElementById("userName");
  let userInfoBox = createUserInfoBox(data);
  userName.appendChild(userInfoBox);

  let workerContainer = document.getElementById("workers");
  let serviceList = createServiceList(data);
  workerContainer.appendChild(serviceList);

  // Hide the card scan container and show the service container
  document.getElementById("cardScanContainer").style.display = "none";
  document.getElementById("serviceContainer").style.display = "block";
}

function createUserInfoBox(data) {
  let userInfoBox = document.createElement("div");
  userInfoBox.classList.add("user-info-box");

  // Display user name and image
  let userName = document.createElement("h1");
  userName.innerText = `Hello, ${data.name}`;
  userInfoBox.appendChild(userName);

  if (data.image) {
    let userImage = document.createElement("img");
    userImage.src = data.image;
    userImage.alt = `${data.name}'s image`;
    userInfoBox.appendChild(userImage);
  }

  // Display user description
  let userDescription = document.createElement("p");
  userDescription.innerText = data.description;
  userInfoBox.appendChild(userDescription);

  return userInfoBox;
}

function createServiceList(data) {
  let serviceList = document.createElement("div");

  if (data.workers) {
    for (let worker in data.workers) {
      let workerBtn = document.createElement("button");
      workerBtn.classList.add("worker-btn");
      workerBtn.innerText = worker;
      workerBtn.addEventListener("click", function () {
        handleServiceSelection(worker, data.workers[worker].services);
      });

      serviceList.appendChild(workerBtn);
    }
  } else if (data.NoWorkers) {
    data.NoWorkers.forEach((service) => {
      let serviceBtn = document.createElement("button");
      serviceBtn.classList.add("service-btn");
      serviceBtn.innerText = service;
      serviceBtn.addEventListener("click", function () {
        alert("Selected Service: " + service);
      });

      serviceList.appendChild(serviceBtn);
    });
  }

  return serviceList;
}

function handleServiceSelection(worker, services) {
  alert(
    `You've selected ${worker}. They provide the following services: ${services.join(
      ", "
    )}`
  );

  let serviceModal = document.createElement("div");
  serviceModal.id = "serviceModal";
  serviceModal.classList.add("service-modal");

  let serviceList = document.createElement("div");
  serviceList.classList.add("service-list");

  services.forEach((service) => {
    let serviceBtn = document.createElement("button");
    serviceBtn.classList.add("service-btn");
    serviceBtn.innerText = service;
    serviceBtn.addEventListener("click", function () {
      alert(`You've selected the service: ${service}`);
      document.body.removeChild(serviceModal);
    });

    serviceList.appendChild(serviceBtn);
  });

  let closeBtn = document.createElement("button");
  closeBtn.classList.add("close-btn");
  closeBtn.innerText = "Close";
  closeBtn.addEventListener("click", function () {
    document.body.removeChild(serviceModal);
  });

  serviceList.appendChild(closeBtn);
  serviceModal.appendChild(serviceList);
  document.body.appendChild(serviceModal);
}
