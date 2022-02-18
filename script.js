const timeElement = document.getElementById("time");
const dateElement = document.getElementById("date");
const currentWeatherElement = document.getElementById("current-weather-items");
const timeZone = document.getElementById("time-zone");
const countryElement = document.getElementById("country");
const weatherForecastElement = document.getElementById("weather-forecast");
const currentTempElement = document.getElementById("current-temp");

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const API_KEY = "d0377bb588dbf8c2e7179a5ae68609b1";

setInterval(() => {
  const time = new Date();
  const month = time.getMonth();
  const date = time.getDate();
  const day = time.getDay();
  const hour = time.getHours();
  const hoursInStandard = hour >= 13 ? hour % 12 : hour;
  const minutes = time.getMinutes();
  const amPm = hour >= 12 ? "PM" : "AM";

  timeElement.innerHTML =
    (hoursInStandard < 10 ? "0" + hoursInStandard : hoursInStandard) +
    ":" +
    (minutes < 10 ? "0" + minutes : minutes) +
    " " +
    `<span id="am-pm">${amPm}</span>`;

  dateElement.innerHTML = days[day] + ", " + date + " " + months[month];
}, 1000);

getWeatherData();

function getWeatherData() {
  navigator.geolocation.getCurrentPosition((success) => {
    let { latitude, longitude } = success.coords;

    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=imperial&appid=${API_KEY}`
    ).then((res) => res.json()).then(data => {
        
        showWeatherData(data);
    });
  });
}

function showWeatherData(data){
    let {humidity, pressure, sunrise, sunset, wind_speed} = data.current;

timeZone.innerHTML = data.timezone;
countryElement.innerHTML = data.lat + 'N x ' + data.lon + 'E'

 currentWeatherElement.innerHTML = `<div class="weather-item">
              <div>Humidity</div>
              <div>${humidity}%</div>
            </div>
            <div class="weather-item">
              <div>Barometric Pressure</div>
              <div>${pressure}</div>
            </div>
            <div class="weather-item">
              <div>Wind Speed</div>
              <div>${wind_speed} mph</div>
            </div>
            <div class="weather-item">
              <div>Sun Rise</div>
              <div>${window.moment(sunrise * 1000).format("HH:mm a")}</div>
            </div>
            <div class="weather-item">
              <div>Sun Set</div>
              <div>${window.moment(sunset * 1000).format("HH:mm a")}</div>
            </div>`;
            let otherDayForecast = ''
data.daily.forEach((day, idx)=>{
    if(idx == 0){
        currentTempElement.innerHTML = `
        
        <img
          src="http://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png"
          alt="weather icon"
          class="w-icon"
        />
        <div class="other">
          <div class="day">Today</div>
          <div class="temp">Night - ${day.temp.night}&#176; F</div>
          <div class="temp">Day - ${day.temp.day}&#176; F</div>
        </div>
      
        `;
    }else{
        otherDayForecast += `
            <div class="weather-forecast-item">
          <div class="day">${window.moment(day.dt * 1000).format("ddd")}</div>
          <img
            src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"
            alt="weather icon"
            class="w-icon"
          />
          <div class="temp">Night - ${day.temp.night}&#176; F</div>
          <div class="temp">Day - ${day.temp.day}&#176; F</div>
        </div>
        `;
    }
})
weatherForecastElement.innerHTML = otherDayForecast;

}