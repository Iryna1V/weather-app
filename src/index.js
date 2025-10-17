let now = new Date();
let date = document.querySelector("#date");
let hours = now.getHours();
if (hours < 10) {
  hours = `0${hours}`;
}
let minutes = now.getMinutes();
if (minutes < 10) {
  minutes = `0${minutes}`;
}
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let day = days[now.getDay()];

date.innerHTML = `${day}, ${hours}:${minutes}`;

function showСity(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input");

  if (cityInput.value) {
    cityInput.innerHTML = `${cityInput.value}`;
    findCity(cityInput.value);
  } else {
    cityInput.innerHTML = null;
    alert("Please, type a city");
  }
}
let newForm = document.querySelector("#search-form");
newForm.addEventListener("submit", showСity);

let searchButton = document.querySelector("#search-button");
searchButton.addEventListener("click", showСity);

function findCity(city) {
  let apiKey = "54ae8ba91d8b30c5425ec1264c36de90";
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(url).then(showNewTemp);
}

function formatDateForecast(timestamp) {
  let date = new Date(timestamp);
  let day = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  day = days[day];
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[date.getMonth()];
  let dateNumber = date.getUTCDate();
  let dateStringForecast = `${dateNumber} ${month}  <br /> ${day}  , ${hours}:${minutes} `;
  return dateStringForecast;
}

function showNewTemp(response) {
  console.log(response.data);
  let city = document.querySelector("li#main-city");
  city.innerHTML = response.data.name;
  let descriptionElement = document.querySelector("#description");
  let temperature = Math.round(response.data.main.temp);
  let currentTemp = document.querySelector("#temperature");
  currentTemp.innerHTML = `${temperature}°`;
  let dateElement = document.querySelector("#date");
  let humidity = document.querySelector("li#humi");
  humidity.innerHTML = `Humidity: ${response.data.main.humidity} %`;
  let windElement = document.querySelector("#wind");
  windElement.innerHTML = Math.round(response.data.wind.speed);
  let iconElement = document.querySelector("#icon");
  descriptionElement.innerHTML = response.data.weather[0].description;
  dateElement.innerHTML = formatDateForecast(response.data.dt * 1000);
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  getForecast(response.data.coord);
  celsiusTemp = temperature;
}

function showFahrenheit(event) {
  event.preventDefault();
  let tempElement = document.querySelector("#temperature");
  let fahrenheitTemp = (celsiusTemp * 9) / 5 + 32;
  tempElement.innerHTML = Math.round(fahrenheitTemp);
}
let celsiusTemp = null;

let fahrenheit = document.querySelector("#far");
fahrenheit.addEventListener("click", showFahrenheit);

function showCelcius(event) {
  event.preventDefault();
  let tempElement = document.querySelector("#temperature");
  tempElement.innerHTML = Math.round(celsiusTemp);
}

let celsius = document.querySelector("#cel");
celsius.addEventListener("click", showCelcius);

document.querySelector("#current").addEventListener("click", () => {
  function currentPosition(position) {
    let geoApiKey = "85a5dbf30e733b0f6b4252e330196182";
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    let newUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}
&lon=${lon}&appid=${geoApiKey}&units=metric`;

    axios.get(newUrl).then(showNewTemp);
  }
  navigator.geolocation.getCurrentPosition(currentPosition);
});
findCity("Kyiv");

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row" >`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
              <div class="col-2">
                <div class="weather-forecast-date">${formatDay(
                  forecastDay.dt
                )}</div>
                <img src="http://openweathermap.org/img/wn/${
                  forecastDay.weather[0].icon
                }@2x.png" alt="" width="45"/>
                <div class="weather-forecast-temperature">
                  <span class="weather-forecast-temperature-max">${Math.round(
                    forecastDay.temp.max
                  )}° </span> 
                  <span class="weather-forecast-temperature-min">${Math.round(
                    forecastDay.temp.min
                  )}° </span>
                  </div>
            </div>
    `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;

  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "5f472b7acba333cd8a035ea85a0d4d4c";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}
