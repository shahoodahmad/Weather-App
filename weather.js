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

// set initial units
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
        // extract API info and store in the weather object
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

        })
        .then(function(){
            outputWeather();
        });
}

var d = new Date();

// edit the HTML on the page to ddisplay the data
function outputWeather(){
    notification.innerHTML = `Updated on ${d.getMonth()+1}/${d.getDate()} at ${Normalize(d.getHours())}:${pad(d.getMinutes())} ${amVSpm(d.getHours())}`;
    descPic.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
    temp.innerHTML = `${weather.temperature} °C`;
    weatherDesc.innerHTML = capitalize(weather.description);
    CountryCity.innerHTML = `${weather.city}, ${weather.country}`;
    feelsLike.innerHTML = `Feels like: ${weather.feelsLike} °C`;
    humidity.innerHTML = `Humidity: ${weather.humidity}%, ${humidStatus(weather.humidity)}`;
    windSpeed.innerHTML = `Wind Speed: ${nullcheck(weather.windspeed)} meters/second, ${speedStatus(weather.windspeed)}`;
    clouds.innerHTML = `Cloudiness: ${weather.clouds}%`
  }

// temperature unit change
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

// wind speed unit change
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

// capitalize function - used on the weather description
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// classify humidity
function humidStatus(string){
  if (string > 50){ return "High";}
  else if (string > 30){ return "Ideal";}
  else { return "Low";}
}

// check if a value is undefined and handle it - used on wind speed
function nullcheck(string){
  if (string == "undefined") { return "Not found";}
  else { return string; }
}

// classify wind speed
function speedStatus(string){
  if (string > 25){ return "Severe";}
  else if (string > 11){ return "Strong";}
  else if (string > 5){ return "Moderate";}
  else { return "Light";}
}

// convert time form 24 hour scale to 12
function Normalize(string){
  if (string > 12){ return (string-12);}
  else if (string == "0") { return 12;}
  else { return string;}
}

// AM vs PM
function amVSpm(string){
  if (string < 12) {return "AM";}
  else { return "PM";}
}

// pad minutes with zeros
function pad(string){
  if (string <10) {return "0"+string;}
  else { return string;}
}
