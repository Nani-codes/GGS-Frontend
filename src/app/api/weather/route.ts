import { NextRequest, NextResponse } from 'next/server';

const WEATHER_API_KEY = process.env.WEATHER_API_KEY || '';
const WEATHER_API_URL = 'https://api.weatherapi.com/v1';

interface WeatherAPIResponse {
  location: {
    name: string;
    region: string;
    country: string;
  };
  current: {
    temp_c: number;
    feelslike_c: number;
    humidity: number;
    wind_kph: number;
    pressure_mb: number;
    vis_km: number;
    condition: {
      text: string;
      icon: string;
    };
  };
  forecast?: {
    forecastday: Array<{
      date: string;
      day: {
        maxtemp_c: number;
        mintemp_c: number;
        avghumidity: number;
        maxwind_kph: number;
        condition: {
          text: string;
          icon: string;
        };
      };
      astro: {
        sunrise: string;
        sunset: string;
      };
    }>;
  };
}

// Fallback mock data for when API key is not configured
function getMockWeatherData(location: string) {
  const now = new Date();
  const baseTemp = 25 + Math.random() * 10;
  
  return {
    current: {
      location: location.split(',')[0],
      temperature: Math.round(baseTemp),
      condition: 'Partly Cloudy',
      humidity: 60 + Math.round(Math.random() * 20),
      windSpeed: 10 + Math.round(Math.random() * 15),
      icon: '//cdn.weatherapi.com/weather/64x64/day/116.png',
      feelsLike: Math.round(baseTemp + 2),
      pressure: 1010 + Math.round(Math.random() * 10),
      visibility: 8 + Math.round(Math.random() * 4),
      sunrise: '06:15 AM',
      sunset: '06:45 PM',
    },
    forecast: Array.from({ length: 5 }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() + i + 1);
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Clear'];
      
      return {
        date: i === 0 ? 'Tomorrow' : dayNames[date.getDay()],
        maxTemp: Math.round(baseTemp + Math.random() * 5),
        minTemp: Math.round(baseTemp - 5 - Math.random() * 3),
        condition: conditions[Math.floor(Math.random() * conditions.length)],
        icon: '//cdn.weatherapi.com/weather/64x64/day/116.png',
        humidity: 55 + Math.round(Math.random() * 25),
        windSpeed: Math.round(8 + Math.random() * 12),
      };
    }),
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location') || 'Aurangabad,Maharashtra,India';

  // If no API key, return mock data
  if (!WEATHER_API_KEY) {
    console.warn('Weather API key not configured, using mock data');
    return NextResponse.json(getMockWeatherData(location));
  }

  try {
    const response = await fetch(
      `${WEATHER_API_URL}/forecast.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(location)}&days=6&aqi=no`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 1800 }, // Cache for 30 minutes
      }
    );

    if (!response.ok) {
      console.error('Weather API error:', response.status);
      // Return mock data on API error
      return NextResponse.json(getMockWeatherData(location));
    }

    const data: WeatherAPIResponse = await response.json();

    // Transform the data to our format
    const transformedData = {
      current: {
        location: data.location.name,
        temperature: data.current.temp_c,
        condition: data.current.condition.text,
        humidity: data.current.humidity,
        windSpeed: Math.round(data.current.wind_kph),
        icon: data.current.condition.icon,
        feelsLike: data.current.feelslike_c,
        pressure: data.current.pressure_mb,
        visibility: data.current.vis_km,
        sunrise: data.forecast?.forecastday[0]?.astro.sunrise || '06:00 AM',
        sunset: data.forecast?.forecastday[0]?.astro.sunset || '06:00 PM',
      },
      forecast: data.forecast?.forecastday.slice(1).map((day, index) => {
        const date = new Date(day.date);
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return {
          date: index === 0 ? 'Tomorrow' : dayNames[date.getDay()],
          maxTemp: day.day.maxtemp_c,
          minTemp: day.day.mintemp_c,
          condition: day.day.condition.text,
          icon: day.day.condition.icon,
          humidity: day.day.avghumidity,
          windSpeed: Math.round(day.day.maxwind_kph),
        };
      }) || [],
    };

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    // Return mock data on any error
    return NextResponse.json(getMockWeatherData(location));
  }
}

