const btnSend = document.getElementById("btnSend");
let cityField = document.getElementById("city");
let response = document.getElementById("response");

// Options de requêtes
const proxy = "https://cors-anywhere.herokuapp.com/";

const updateUI = (html) => {
  response.innerHTML = "";
  response.insertAdjacentHTML("beforeend", html);
  cityField.disabled = false;
  btnSend.disabled = false;
};

const handleResponse = () => {
  if (xhr.readyState === 4) {
    try {
      const responseJson = JSON.parse(xhr.responseText);
      if (xhr.status === 200) {
        createSuccessHtml(responseJson);
      } else {
        createErrorHtml(responseJson);
      }
    } catch (error) {
      console.error("Erreur de parsing JSON :", error);
      updateUI(`
                <h1>Une erreur s'est produite !</h1>
                <p>Réponse invalide : ${xhr.responseText}</p>
            `);
    }
  }
};

const createSuccessHtml = (data) => {
  let weather = data.weather[0];
  let html = `
        <h1>${data.name}</h1>
        <p class="weatherMain">
            <img class="weather-image" src="http://openweathermap.org/img/w/${
              weather.icon
            }.png" alt="${weather.description}" />
            <span class="weather-description">${weather.description}</span>
        </p>
        <p >Température : <span class="temp">${data.main.temp.toFixed(
          1
        )} °C</span></p>
    `;
  updateUI(html);
};

const createErrorHtml = (data) => {
  let html = `
        <h1>Une erreur s'est produite !</h1>
        <p>${data.message}</p>
    `;
  updateUI(html);
};

const buildUrl = (city) =>
  `${proxy}${window.env.BASE_URL}?units=metric&lang=fr&q=${city}&appid=${window.env.API_KEY}`;

function handleClick() {
  let city = cityField.value;

  xhr = new XMLHttpRequest();
  xhr.open("GET", buildUrl(city));

  cityField.disabled = true;
  btnSend.disabled = true;

  updateUI(
    `<img src="./assets/images/spinner.gif" alt="spinner" id="spinner">`
  );
  xhr.onreadystatechange = handleResponse;
  xhr.send();
}

btnSend.addEventListener("click", handleClick, false);
