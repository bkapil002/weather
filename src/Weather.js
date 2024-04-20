import React, { useState, useEffect } from 'react';
import axios from 'axios';
import clear from './image/clear.png';
import cloud from './image/cloud.png';
import rain from './image/rain.png';
import snow from './image/snow.png';
import mist from './image/Mist.png';
import './weather.css';

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('New York');
  const [query, setQuery] = useState('');
  const [weatherImage, setWeatherImage] = useState(null);
  const [windDirection, setWindDirection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiKey = 'acc045b65c9d47b0aec151351241904';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`);
        setWeatherData(response.data);
        adjustWeatherImage(response.data.current.condition.text);
        setWindDirection(response.data.current.wind_dir);
      } catch (error) {
        setError('chick the name. Please try again');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [city, apiKey]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setCity(query);
    setQuery('');
  };

  const adjustWeatherImage = (condition) => {
    if (condition.includes('sunny')) {
      setWeatherImage(clear);
    } else if (condition.includes('rain')) {
      setWeatherImage(rain);
    } else if (condition.includes('cloud')) {
      setWeatherImage(cloud);
    } else if (condition.includes('snow')) {
      setWeatherImage(snow);
    } else if (condition.includes('Mist')) {
      setWeatherImage(mist);
    } else {
      setWeatherImage(clear);
    }
  };

  const formatWindDirection = (direction) => {
    if (!direction) return 'Unknown'; // Handle cases where direction is not provided

    // Convert wind direction abbreviations to cardinal directions
    switch (direction) {
      case 'N':
        return 'North';
      case 'NNE':
      case 'NE':
      case 'ENE':
        return 'Northeast';
      case 'E':
        return 'East';
      case 'ESE':
      case 'SE':
      case 'SSE':
        return 'Southeast';
      case 'S':
        return 'South';
      case 'SSW':
      case 'SW':
      case 'WSW':
        return 'Southwest';
      case 'W':
        return 'West';
      case 'WNW':
      case 'NW':
      case 'NNW':
        return 'Northwest';
      default:
        return 'Unknown';
    }
  };

  return (
    <div style={{marginLeft:'32%', width:'100%'}} >
      <div className='container'>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit"><i className="fa-solid fa-magnifying-glass"></i></button>
        </form>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {weatherData && (
          <div>
            {weatherImage && <img style={{width:"200px", height:"200px"}} src={weatherImage} alt="Weather" />}
            <h2>Weather for {city}</h2>
            <p className='Temperature'>{weatherData.current.temp_c} °C</p>
            <div style={{display:'flex'}}>
              <p>Condition: {weatherData.current.condition.text}</p>
              <p>Wind Direction: {formatWindDirection(windDirection)}</p>
              <p>Wind Speed: {weatherData.current.wind_kph} km/h</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;
