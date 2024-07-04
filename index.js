import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import requestIp from 'request-ip';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(requestIp.mw());

app.get('/api/hello', async (req, res) => {
  const visitorName = req.query.visitor_name;
  const clientIp = req.clientIp;

  try {
    const locationResponse = await axios.get(`http://ip-api.com/json/${clientIp}`);
    const location = locationResponse.data.city;

    const weatherResponse = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.OPENWEATHERMAP_API_KEY}&units=metric`);
    const temperature = weatherResponse.data.main.temp;

    const response = {
      client_ip: clientIp,
      location,
      greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${location}`
    };

    res.json(response);
  } catch (error) {
    console.error('Error retrieving data:', error);
    res.status(500).send('Error retrieving data');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
