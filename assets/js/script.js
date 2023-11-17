const apiKey = '2ebb59e2ba0c77c7b644a694e44e03e7';

const currentWeatherEl = document.querySelector('.current-weather');
const forcastWrapperEl = document.querySelector('.weather-forecast-wrapper');

const geolocationWrapperEl = document.querySelector('.geolocate-wrapper');

const saveCityBtnEl = document.querySelector('#saveCityBtn');
const savedCitiesBtnEl = document.querySelector('#savedCitiesBtn');

const savedCitiesCardEl = document.querySelector('.saved-cities-card');

function getWeather(lat, lon) {

fetch(
    `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
)
    .then(function (res) {
    return res.json();
})
.then(function (data) {

    const forecast = [];

    for (i = 2; i <= 34; i = i + 8) {
        const dayForecast = {
            time: dayjs(data.list[i].dt_txt).format('DD MMM, YYYY'),
            temp: data.list[i].main.humidity,
            weatherDesc: data.list[i].weather[0].description,
            weatherIcon: data.list[i].weather[0].icon,
            wind: data.list[i].wind.speed,
        };
        forecast.push(dayForecast)
    }

    for (i = 0; i < forcastWrapperEl.children.length; i++) {
        const cardTitleEl = 
            forcastWrapperEl.children[i].children[0].children[0];
        const subtitle = 
            forcastWrapperEl.children[i].children[0].children[1];
        const cardText = 
            forcastWrapperEl.children[i].children[0].children[2];

        cardTitleEl.textContent = forecast[i].time;
        subtitle.textContent = forecast[i].weatherDesc;
        cardText.textContent = forecast[i].temp;
    }

    console.log(forecast);
});

fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
    )
    .then(function (res) {
            return res.json();
        })
    .then(function (data) {
            const cardTitleEl = currentWeatherEl.children[0].children[0].children[0];
            
            const cardSubtitleEl = currentWeatherEl.children[0].children[0].children[1];

            const cardTextEl = currentWeatherEl.children[0].children[0].children[2];

            cardTitleEl.textContent = `Current Weather in ${data.name}`;

            cardSubtitleEl.textContent = data.weather[0].description;

            cardTextEl.textContent = data.main.temp;
            
            console.log(data);

        });
}

function geolocate(event) {
event.preventDefault();

const userInput = geolocationWrapperEl.children[1].value;

console.log(userInput);

    fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${userInput}&limit=1&appid=${apiKey}`
    )
    .then(function (res) {
        return res.json();
        })
    .then(function (data) {
        geolocationWrapperEl.classList.add('hidden');

        getWeather(data[0].lat, data[0].lon);

        currentWeatherEl.classList.remove('hidden');
        forcastWrapperEl.classList.remove('hidden');

        function saveCity() {
            let cities = JSON.parse(localStorage.getItem('cities')) || [];

            const city = {
                name: data[0].name,
                lat: data[0].lat,
                lon: data[0].lon,
            };

            cities.push(city);

            localStorage.setItem('cities', JSON.stringify(cities));

            alert('Location Saved');
        }
        
        saveCityBtnEl.addEventListener('click', saveCity);
        

        console.log(data);
    });
}

function showSavedCities() {
    savedCitiesCardEl.children[0].children[2].innerHTML = ``;
    savedCitiesCardEl.classList.remove('hidden');

    const savedCities = JSON.parse(localStorage.getItem ('cities')) 
    
    for (i = 0; i < savedCities.length; i++) {
        const cityEl = document.createElement('button');

        cityEl.setAttribute('data-lat', savedCities[i].lat);
        cityEl.setAttribute('data-lon', savedCities[i].lon);
        cityEl.textContent =savedCities[i].name;
        cityEl.classList.add('list-group-item');

        savedCitiesCardEl.children[0].children[2].appendChild (cityEl);
    }
}

function loadSavedCity(event) {
    let target = event.target;

    if (target.tagName === 'BUTTON') {
        savedCitiesCardEl.classList.add('hidden');
        geolocationWrapperEl.classList.add('hidden');

        getWeather(target.dataset.lat, target.dataset.lon);

        currentWeatherEl.classList.remove('hidden');
        forcastWrapperEl.classList.remove('hidden');
    }

}

geolocationWrapperEl.addEventListener('submit', geolocate);
savedCitiesBtnEl.addEventListener('click', showSavedCities);
savedCitiesCardEl.addEventListener('click', loadSavedCity)