// access all the elements to be formatted
let notification = document.getElementById("notification");
let descPic = document.getElementById("descriptive-picture");
let temp = document.getElementById("temperature");
let weatherDesc = document.getElementById("weather-description");
let CountryCity = document.getElementById("Country-City");
let feelsLike = document.getElementById("feels-like");
let windSpeed = document.getElementById("wind-speed");
let humidity = document.getElementById("humidity");
let clouds = document.getElementById("clouds");

// use the html geolocator api to find the user's location
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  }
  else {
    notification.innerHTML = "Geolocation not supported";
  }
  document.getElementById("B").style.display="none";
}

// if access allowed, store the position and call the weather api function
function showPosition(position) {
  notification.innerHTML = "Location found";
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;
  getWeather(latitude, longitude);
}

// if location blocked, display a notification
function showError(error) {
    if(error.PERMISSION_DENIED){
      notification.innerHTML = "Location not found <br> Reload the page or reset your location settings <br> to give location access and use the app";
    }
  }


// create a weather object to store the api information
const weather = {};

weather.tempUnit = "C";
weather.windUnit = "MS";

// weather api call function
function getWeather(latitude, longitude){
  let api = `https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=09ca28f467aa94c207b9ce9c95473bc9`;

  fetch(api)
        .then(function(response){
            let data = response.json();
            return data;
        })
        .then(function(data){
            console.log(data);
            weather.temperature = Math.floor(data.main.temp - 273);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
            weather.feelsLike = Math.floor(data.main.feels_like - 273);
            weather.windspeed = data.wind.speed;
            weather.humidity = data.main.humidity;
            weather.clouds = data.clouds.all;
            console.log(weather);

        })
        .then(function(){
            outputWeather();
        });
}

function outputWeather(){
    notification.innerHTML = "Click the temperature or the wind speed <br> to convert to another unit";
    descPic.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
    temp.innerHTML = `${weather.temperature} °C`;
    weatherDesc.innerHTML = capitalize(weather.description);
    CountryCity.innerHTML = `${weather.city}, ${weather.country}`;
    feelsLike.innerHTML = `Feels like: ${weather.feelsLike} °C`;
    humidity.innerHTML = `Humidity: ${weather.humidity}%, ${humidStatus(weather.humidity)}`;
    windSpeed.innerHTML = `Wind Speed: ${nullcheck(weather.windspeed)} meters/second, ${speedStatus(weather.windspeed)}`;
    clouds.innerHTML = `Cloudiness: ${weather.clouds}%`
  }

temp.addEventListener("click", event =>{
  if (weather.tempUnit == "C"){
    temp.innerHTML = `${(weather.temperature)*(9/5)+32} °F`;
    feelsLike.innerHTML = `Feels like: ${(weather.feelsLike)*(9/5)+32} °F`;
    weather.tempUnit = "F";
  }
  else {
    temp.innerHTML = `${weather.temperature} °C`;
    feelsLike.innerHTML = `Feels like: ${weather.feelsLike} °C`;
    weather.tempUnit = "C";
  }
});

windSpeed.addEventListener("click", event =>{
  if (weather.windUnit == "MS"){
    windSpeed.innerHTML = `Wind Speed: ${(nullcheck(weather.windspeed)*2.24).toFixed(2)} miles/hour, ${speedStatus(weather.windspeed)}`;
    weather.windUnit = "MPH";
  }
  else {
    windSpeed.innerHTML = `Wind Speed: ${nullcheck(weather.windspeed)} meters/second, ${speedStatus(weather.windspeed)}`;
    weather.windUnit = "MS";
  }
});


function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function humidStatus(string){
  if (string > 50){ return "High";}
  else if (string > 30){ return "Ideal";}
  else { return "Low";}
}

function nullcheck(string){
  if (string == "undefined") { return "Not found";}
  else { return string; }
}

function speedStatus(string){
  if (string > 25){ return "Severe";}
  else if (string > 11){ return "Strong";}
  else if (string > 5){ return "Moderate";}
  else { return "Light";}
}
