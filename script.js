// Fetch the weather data
const apiKey = 'your-api-key' // Replace with your OpenWeatherMap API key


document.getElementById('search-btn').addEventListener('click', () => {
    const city = document.getElementById('city-input').value;
    if (city) {
        getWeatherData(city);
    }
});

function getWeatherData(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            updateWeatherWidget(data);
            getHourlyForecast(data.coord.lat, data.coord.lon); // Get hourly forecast using lat, lon
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

function getHourlyForecast(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            updateHourlyForecast(data);
        })
        .catch(error => console.error('Error fetching hourly forecast:', error));
}

function updateWeatherWidget(data) {
    const temp = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    
    document.getElementById('temperature').innerHTML = `${temp}°C`;
    document.getElementById('weather-description').innerHTML = capitalizeFirstLetter(description);
    document.getElementById('weather-icon').innerHTML = `<img src="https://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon">`;
}

function updateHourlyForecast(data) {
    const hourlyData = data.list.slice(0, 5); // Get the next 5 hours of data
    const temperatureSlider = document.getElementById('temperature-slider');
    temperatureSlider.innerHTML = ''; // Clear previous data

    hourlyData.forEach(hour => {
        const time = new Date(hour.dt_txt).getHours() + ':00';
        const temp = Math.round(hour.main.temp);
        const icon = hour.weather[0].icon;
        
        const tempItem = `
            <div class="temp-item">
                <span>${time}</span>
                <img src="https://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon">
                <span>${temp}°C</span>
            </div>
        `;

        temperatureSlider.innerHTML += tempItem;
    });
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
