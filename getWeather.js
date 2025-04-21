require("dotenv").config();

async function getWeather() {
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${
    process.env.WEATHER_API_KEY
  }&days=1&q=Samara&dt=${new Date().toJSON().slice(0, 10)}&lang=ru`;

  let today;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    const data = await response.json();

    today = data.forecast.forecastday[0].day;
  } catch (error) {
    console.error("Ошибка запроса:", error);
  }

  return {
    description: today.condition.text,
    temp: today.avgtemp_c,
    chanceOfRain: today.daily_chance_of_rain,
  };
}
module.exports = getWeather;
