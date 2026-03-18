const express = require("express");
const axios = require("axios");
const router = express.Router();

const API_KEY = "faecc2a435c946779c4170052252011"; 

router.get("/google-style", async (req, res) => {
  try {
    const city = req.query.city || "Pune";

    const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=7&aqi=no&alerts=no`;
    const response = await axios.get(url);
    const data = response.data;

    // Ensure data is valid
    if (!data.forecast || !data.forecast.forecastday) {
      return res.json({
        success: false,
        message: "Invalid API data",
      });
    }

    res.json({
      success: true,

      current: {
        temp_c: data?.current?.temp_c ?? 0,
        humidity: data?.current?.humidity ?? 0,
        wind_kph: data?.current?.wind_kph ?? 0,
        condition: data?.current?.condition ?? { text: "", icon: "" },
      },

      hourly: data?.forecast?.forecastday?.[0]?.hour ?? [],

      weekly: data?.forecast?.forecastday ?? [],
    });

  } catch (error) {
    console.log("Weather ERROR:", error);
    res.json({ success: false, message: "Weather API failed", error });
  }
});

module.exports = router;
