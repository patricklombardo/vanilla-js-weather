// Add Event Listener
window.addEventListener("load", async () => {
  let long;
  let lat;

  // Query Selectors
  let temperatureDescription = document.querySelector(
    ".temperature-description"
  );
  let temperatureDegree = document.querySelector(".temperature-degree");
  let locationTimezone = document.querySelector(".location-timezone");
  let locationIcon = document.querySelector(".icon");
  let temperatureSection = document.querySelector(".temperature");
  let temperatureSpan = document.querySelector(".temperature span");

  // Check for Geolocation
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async position => {
      long = position.coords.longitude;
      lat = position.coords.latitude;

      const data = await getWeather(lat, long);
      setWeather(data);
    });
  } else {
    locationTimezone.textContent = "Where in the world are you?";
  }

  // CORS Proxy
  const proxy = "https://cors-anywhere.herokuapp.com/";
  const api = (lat, long) =>
    `${proxy}https://api.darksky.net/forecast/fe27298e90102cdb657b251f4a5ff6d7/${lat},${long}`;

  // Fetch Weather
  const getWeather = async (lat, long) => {
    const response = await fetch(api(lat, long));
    const data = await response.json();
    return data;
  };

  // Set Weather
  const setWeather = data => {
    const { temperature, summary, icon } = data.currently;
    // Set DOM Elements from the API
    temperatureDegree.textContent = Math.floor(temperature);
    temperatureDescription.textContent = summary;
    locationTimezone.textContent = data.timezone;

    // Convert to Celsius
    let celsius = convertToCelsius(temperature);

    // Toggle Temperature Units
    temperatureSection.addEventListener("click", () => {
      if (temperatureSpan.textContent === "F") {
        temperatureSpan.textContent = "C";
        temperatureDegree.textContent = Math.floor(celsius);
      } else {
        temperatureSpan.textContent = "F";
        temperatureDegree.textContent = Math.floor(temperature);
      }
    });

    // Set Icon
    setIcons(icon, locationIcon);
  };

  // Set Icons
  const setIcons = (icon, iconID) => {
    const skycons = new Skycons({ color: "white" });
    const currentIcon = icon.replace(/-/g, "_").toUpperCase();
    skycons.play();
    return skycons.set(iconID, Skycons[currentIcon]);
  };

  // Convert to Celsius
  const convertToCelsius = temp => (temp - 32) * (5 / 9);
});
