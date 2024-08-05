const apiKey = '01dac9cd23846c14074bc34508395826'; // Replace with your OpenWeatherMap API key

function getWeather() {
    const city = document.getElementById('cityInput').value;

    document.getElementById('loader').style.display = 'block';

    // Slide-fade out the current weather information
    const container = document.querySelector('.weather-container');
    container.classList.add('slide-fade-out');

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);

            // Hide the loader
            document.getElementById('loader').style.display = 'none';

            // Fade in the updated weather information after a slight delay
            setTimeout(() => {
                container.classList.remove('slide-fade-out');
            }, 200);
        })
        .catch(error => {
            console.error("Error fetching the weather data: ", error);
            
            // Hide the loader even if there's an error
            document.getElementById('loader').style.display = 'none';
            // Fade in the container even if there's an error, to provide feedback to the user
            container.classList.remove('slide-fade-out');
        });
}


function displayWeather(data) {
    if (data && data.main && data.weather && data.weather[0]) { // Check if data exists
        document.getElementById('cityName').innerText = data.name || 'N/A';
        document.getElementById('temperature').innerText = data.main.temp ? data.main.temp + '°C' : 'N/A';
        document.getElementById('description').innerText = data.weather[0].description || 'N/A';
        document.getElementById('humidity').innerText = `Humidity: ${data.main.humidity}%` || 'N/A'; // New
        document.getElementById('windSpeed').innerText = `Wind Speed: ${data.wind.speed} m/s` || 'N/A'; // New
        document.getElementById('pressure').innerText = `Pressure: ${data.main.pressure} hPa` || 'N/A'; // New
        document.getElementById('sunrise').innerText = `Sunrise: ${convertUnixToTime(data.sys.sunrise)}` || 'N/A'; // New
        document.getElementById('sunset').innerText = `Sunset: ${convertUnixToTime(data.sys.sunset)}` || 'N/A'; // New
    } else {
        console.error("Unexpected data format:", data);
    }
    const temp = data.main.temp;
    if (temp < 10) { // Adjust this value as needed
        document.body.className = 'cold';
    } else if (temp >= 10 && temp < 25) {
        document.body.className = 'moderate';
    } else {
        document.body.className = 'warm';
    }

    // Condition-based background color (overriding temperature color if necessary)
    const condition = data.weather[0].main.toLowerCase();
    if (condition.includes('rain')) {
        document.body.className = 'rainy';
    } else if (condition.includes('clear')) {
        document.body.className = 'sunny';
    }

    // Determine and set the appropriate weather icon
    const chooseW = data.weather[0].main.toLowerCase();
    const iconElement = document.getElementById('weatherIcon');

    switch (chooseW) {
        case 'clear':
            //document.body.style.backgroundImage = 'url(images/sunny.jpg)';
            iconElement.className = 'wi wi-day-sunny';
            break;
        case 'clouds':
            //document.body.style.backgroundImage = 'url(images/cloudy.jpg)';
            iconElement.className = 'wi wi-cloudy';
            break;
        case 'rain':
            iconElement.className = 'wi wi-rain';
            break;
        case 'drizzle':
            //document.body.style.backgroundImage = 'url(images/rainy.jpg)';
            iconElement.className = 'wi wi-sprinkle';
            break;
        case 'snow':
            //document.body.style.backgroundImage = 'url(images/snowy.jpg)';
            iconElement.className = 'wi wi-snow';
            break;
        case 'thunderstorm':
            iconElement.className = 'wi wi-thunderstorm';
            break;
        default:
            //document.body.style.backgroundImage = 'url(images/sunny.jpg)';
            iconElement.className = 'wi wi-day-sunny'; // Default to sunny if unknown condition
    }

     // Visualize temperature using a gauge
     const tempValue = data.main.temp;
     const maxTempForGauge = 40; // assuming 40°C is the max for the gauge
     const fillPercentage = Math.min((tempValue / maxTempForGauge) * 100, 100); // limit to 100%
 
     const tempGauge = document.getElementById('tempGauge');
     tempGauge.innerHTML = `<div class="temp-fill" style="height:${fillPercentage}%"></div>`;

     // Visualize wind speed using a bar
    const windValue = data.wind.speed;
    const maxWindForBar = 20; // assuming 20 m/s is the max for the bar
    const fillWidth = Math.min((windValue / maxWindForBar) * 100, 100); // limit to 100%

    const windBar = document.getElementById('windBar');
    windBar.innerHTML = `<div class="wind-fill" style="width:${fillWidth}%"></div>`;
    
}
function convertUnixToTime(unixTimestamp) {
    // Convert UNIX timestamp to local time
    const date = new Date(unixTimestamp * 1000);
    const hours = date.getHours();
    const minutes = "0" + date.getMinutes();
    return hours + ':' + minutes.substr(-2);
}

function clearInput() {
    document.getElementById("cityInput").value = '';
}

function setBackground(cityName) {
    const unsplashAPIKey = '4LYEIQcGG0kTB4DoLCdjvU7dEvPZL2DtMu1fdH42pG0';
    const url = `https://api.unsplash.com/search/photos?client_id=${unsplashAPIKey}&query=${cityName}&orientation=landscape&per_page=1`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.results && data.results.length > 0) {
                const imageUrl = data.results[0].urls.full;  // Grab the URL of the first image from the results
                document.body.style.backgroundImage = `url('${imageUrl}')`;
                document.body.style.backgroundSize = 'cover';
                document.body.style.backgroundRepeat = 'no-repeat';
                document.body.style.backgroundPosition = 'center center';
            }
        })
        .catch(error => console.error('Error fetching image from Unsplash:', error));
}

// Invoke this function in your main search or weather fetch function
// setBackground(searchedCityName);


$(function() {
    $("#cityInput").autocomplete({
        source: function(request, response) {
            $.ajax({
                url: "https://us1.locationiq.com/v1/search.php",
                dataType: "json",
                data: {
                    key: "pk.1fe0f3f7e925b902d222873e09be6207",
                    format: "json",
                    q: request.term  // term entered by the user
                },
                success: function(data) {
                    response($.map(data, function(item) {
                        return {
                            label: item.display_name,  // Full display name (City, State, Country)
                            value: item.name  // Just the city name
                        };
                    }));
                }
            });
        },
        minLength: 2,  // Minimum characters before the search starts
        select: function(event, ui) {
            $("#cityInput").val(ui.item.value);  // Update the input with the selected city
            return false;
        }
    });
});



