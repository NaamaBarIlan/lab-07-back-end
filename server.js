'use strict';

require('dotenv').config();

// Application Dependencies
const express = require('express');
const cors = require('cors');

// Application Setup
const PORT = process.env.PORT;
const app = express();

app.use(cors());

app.get('/location', (request, response) => {
  try {
    const locationData = searchToLatLong(request.query.data);
    response.send(locationData);
  }
  catch (error) {
    console.error(error);
    response.status(500).send('Status: 500. So sorry, something went wrong.');
  }
});

app.get('/weather', (request, response) => {
  try {
    const weatherData = searchWeatherData(request.query.data);
    console.log({weatherArray});
    response.send(weatherArray);
  }
  catch (error) {
    console.error(error);
    response.status(500).send('Status: 500. So sorry, something went wrong.');
  }
});

// Global Variables

const weatherArray =[];

// Helper Functions

function Weather(query, time, forecast) {
  this.search_query = query;
  this.time = new Date(time * 1000).toDateString();
  this.forecast = forecast;
  weatherArray.push(this);
}


function searchWeatherData(query) {
  const skyData = require('./data/darksky.json');

  for (let i = 0; i < skyData.daily.data.length; i++){
    new Weather(query, skyData.daily.data[i].time, skyData.daily.data[i].summary);

  }
}

function Location(query, geoData) {
  this.search_query = query;
  this.formatted_query = geoData.results[0].formatted_address;
  this.latitude = geoData.results[0].geometry.location.lat;
  this.longitude = geoData.results[0].geometry.location.lng;
}

function searchToLatLong(query) {
  const geoData = require('./data/geo.json')
  const location = new Location(query, geoData);
  return location;
}

// Make sure the server is listening for requests
app.listen(PORT, () => console.log(`App is listening on ${PORT}`));