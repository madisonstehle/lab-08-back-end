'use strict';

require('dotenv').config();

//Global variables for server.js
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');

const PORT = process.env.PORT;
const app = express();
app.use(cors());

//this is our grouping of .get's that will grab our information

app.get('/', (request, response) => {
  response.send('This is our Home Page');
});

app.get('/wrong', (request, response) => {
  response.send('OOPS! You did it again. Wrong route.');
});

//Callback functions for information
app.get('/location', locationCallback);
app.get('/weather', weatherCallback);
// app.get('/events', eventsCallback);
// app.get('/', );
// app.get('/', );

function locationCallback (request, response) {
  try{
    // const geoData = require('./data/geo.json');
    const city = request.query.city;
    let key = process.env.GEOCODE_API_KEY;
    let url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json&limit=1`;

    // const locationData = new Location(city, geoData);
    superagent.get(url)
      .then( data => {
        const geoData = data.body[0]; //this is the first item
        const locationData = new Location(city, geoData);
        response.send(locationData);
      })
      .catch( () => {
        errorHandler('location broke', request, response);
      });

  }
  catch(error){
    errorHandler('Error 500! Something has gone wrong with the website server!', request, response);
  }
}

function weatherCallback(request, response) {
  let key = process.env.WEATHER_API_KEY;
  let latitude = request.query.latitude;
  let longitude = request.query.longitude;
  let url = `https://api.darksky.net/forecast/${key}/${latitude},${longitude}`;

  superagent.get(url)
    .then(data => {
      const forecastData = data.body.daily.data.map( obj => {
        // new Weather(time, forecast);
        return new Weather(obj);
      });
      response.status(200).json(forecastData);
    })
    .catch(() => {
      errorHandler('Error 500! Something has gone wrong with the website server!', request, response);
    });
}
//Working with the events callback
// function eventsCallback(request, response) {
//   //Code here
//   const city = request.query.city;
//   let key = process.env.EVENTFUL_API_KEY;
//   let url = `http://api.eventful.com/rest/events/search?${key}&keywords=books&location=${city}&date=Future`;

//   superagent.get(url)
//     .then(data => {
//       const eventData = data.search.events.event.map( obj => {
//         return new Events(obj);
//       });
//       response.status(200).json(eventData);
//     })
//     .catch(() => {
//       errorHandler('Error 500! Something has gone wrong with the website server!', request, response);
//     });
// }

// This is our weather constructor function
// function Events(event) {
//   this.title = event.title;
//   this.url = event.url;
//   this.description = event.description;
//   this.start_time = event.start_time;
//   this.end_time = event.end_time;

// }

function Weather(day) {
  this.forecast = day.summary;
  this.time = new Date(day.time * 1000).toString().slice(0,15);
}
// This is our location constructor function
function Location(city, geoData){
  this.searchQuery = city;
  this.formattedQuery = geoData.display_name;
  this.latitude = geoData.lat;
  this.longitude = geoData.lon;
}

function errorHandler(error, request, response) {

  response.status(500).send(error);
}

app.listen(PORT, () => console.log(`Server up on port ${PORT}`));
