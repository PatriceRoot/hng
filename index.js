import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env;

app.get("/api/hello", async (req, res) => {
  const visitorName = req.query.visitor_name;
  const clientIp = req.ip;

  try {
    // Utiliser une API de géolocalisation pour obtenir la ville (par exemple, ipapi)
    const locationResponse = await axios.get(
      `http://ip-api.com/json/${clientIp}`
    );
    const location = locationResponse.data.city;

    // Utiliser une API météo pour obtenir la température (par exemple, OpenWeatherMap)
    const weatherResponse = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.OPENWEATHERMAP_API_KEY}&units=metric`
    );
    const temperature = weatherResponse.data.main.temp;

    // Créer la réponse
    const response = {
      client_ip: clientIp,
      location,
      greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${location}`,
    };

    res.json(response);
  } catch (error) {
    res.status(500).send("Error retrieving data");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running {PORT}!`);
});
