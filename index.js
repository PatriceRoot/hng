import express from 'express'; 
import axios from 'axios';
import dotenv from 'dotenv';
import requestIp from 'request-ip';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000; // Set the port from the environment variable or default to 3000

app.use(requestIp.mw()); // Middleware to get the client's IP address

app.get('/api/hello', async (req, res) => {
  let visitorName = req.query.visitor_name; // Get the visitor's name from the query parameters
  if (visitorName) {
    visitorName = visitorName.replace(/["']/g, ""); // Remove any quotes from the visitor's name
  }
  
  const clientIp = req.clientIp; // Get the client's IP address

  try {
    // Use a geolocation API to get the city based on the client's IP address
    const locationResponse = await axios.get(`http://ip-api.com/json/${clientIp}`);
    const location = locationResponse.data.city;

    // Use a weather API to get the temperature for the obtained city
    const weatherResponse = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.OPENWEATHERMAP_API_KEY}&units=metric`);
    const temperature = weatherResponse.data.main.temp; // Extract the temperature from the response

    // Create the response object
    const response = {
      client_ip: clientIp,
      location,
      greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${location}`
    };

    res.json(response); // Send the response as JSON
  } catch (error) {
    console.error('Error retrieving data:', error); // Log any errors
    res.status(500).send('Error retrieving data'); // Send a 500 status code if there is an error
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`); // Start the server and log the port it's running on
});
