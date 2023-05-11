// input city
$("form").submit(async (e) => {
    e.preventDefault();
    const cityName = $('#searchInput').val();
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=c8193b9285ee3a8d49d0b678b6937cac&units=metric`);
    const data = await response.json();
    
    weatherForecast = getDailyForecast(data.name);
    $(".landing-info").hide();
    displayData(data, weatherForecast);

});


// to get week forecast
const getDailyForecast = async (city) => {
    console.log(city)
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=c8193b9285ee3a8d49d0b678b6937cac&units=metric`);
    const weatherData = await response.json();
    // Create an object to store the grouped data
    let groupedData = {};

    // Loop through the list and group the data by date
    for (let i = 0; i < weatherData.list.length; i++) {
        let data = weatherData.list[i];
        let date = data.dt_txt.split(' ')[0]; // Extract the date part of the date time string

        // If the date is not yet in the groupedData object, create a new entry
        if (!groupedData[date]) {
            groupedData[date] = {
                weatherIcon: null, // Variable to store the selected weather icon of the day
                cloudCondition: null // Variable to store the cloud condition of the day
            };
        }

        // If the weatherIcon of the current date is not yet set, set it to the icon of the current data
        if (!groupedData[date].weatherIcon) {
            groupedData[date].weatherIcon = data.weather[0].icon;
        }

        // If the cloudCondition of the current date is not yet set, set it to the main cloud condition of the current data
        if (!groupedData[date].cloudCondition) {
            groupedData[date].cloudCondition = data.weather[0].main;
        }
    }
    return groupedData;
}


// Displaying Data

const displayData = async (data, weatherForecast) => {

    const temperature = Math.floor(data.main.temp);
    const city = data.name;

    $(".city").html(
        `
        <i class="fa-sharp fa-solid fa-location-dot"></i>
        <h1 class="ms-2" >${city}</h1>
        
      `
    );
    $(".temp").html(
        `
        <h1 class="degree">${temperature}°</h1>
        <h5 class="ms-2 clouds-details"">${data.weather[0].main}</h6>
        `
    )


    const feelsLike = data.main.feels_like;
    const humidity = data.main.humidity;
    const pressure = data.main.pressure;
    const windSpeed = data.wind.speed;

    // Add the weather details HTML
    $(".weather-details").html(
        `
        <h5>Weather Details</h5>

        <div class="d-flex justify-content-between px-3 py-3">
            <h6>Feels Like</h6>
            <h6>${feelsLike}°</h6>
        </div>
        <div class="d-flex justify-content-between px-3 py-3">
            <h6>Humidity</h6>
            <h6>${humidity}%</h6>
        </div>
        <div class="d-flex justify-content-between px-3 py-3">
            <h6>Wind Speed</h6>
            <h6>${pressure}</h6>
        </div>
        <div class="d-flex justify-content-between px-3 py-3">
            <h6>Pressure</h6>
            <h6>${windSpeed}hPa</h6>
        </div>
          `
    );

    $(".buttons").html(
        `
        
                    <i class="fa-solid fa-cloud " onClick="showWeatherDetails()"></i>
                    <i class="fa-solid fa-calendar-week ms-5" onClick="showWeekForecast()"></i>
                
        `
    )
    $(".week-forecast").hide();
    $(".week-forecast").html(`<h5 class="mt-2">Week Forecast</h5>`)
    const groupedData = await weatherForecast;
    for (let date in groupedData) {
        const clouds = groupedData[date].cloudCondition;
        const weatherIcon = groupedData[date].weatherIcon;
        const url = `https://openweathermap.org/img/wn/${weatherIcon}.png`;
        const dateObj = new Date(date);
        const day = dateObj.toLocaleDateString("en-US", { weekday: 'long' });
        const displayDate = dateObj.toLocaleDateString("en-US", { day: '2-digit', month: 'short' });
        $(".week-forecast").append(
            `
            
            <div class="forecast-details d-flex justify-content-between">
            <div class="d-flex flex-column mt-3">
                <h6>${day}</h6>
                <h6>${displayDate}</h6>
            </div>
            <div class="justify-content-end">
                <img src="${url}">
                <h6>${clouds}</h6>
            </div>
        </div>
            `)
    }

}



function showInputField() {
    document.getElementById("searchInput").style.display = "block";
}

function hideInputField() {
    document.getElementById("searchInput").style.display = "none";
   
}

function showWeatherDetails() {
    $(".weather-details").show();
    $(".week-forecast").hide();
}

function showWeekForecast() {
    $(".week-forecast").show();
    $(".weather-details").hide();
}
