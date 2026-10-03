from fastapi import APIRouter, Query
from ...providers.weather_provider import weather_provider
from ...schemas.weather import CurrentWeatherResponse, WeatherForecastResponse

router = APIRouter()

CITY_COORDS = {
    "bhopal": (23.2599, 77.4126, "Bhopal"),
    "indore": (22.7196, 75.8577, "Indore"),
    "delhi": (28.6139, 77.2090, "Delhi"),
    "mumbai": (19.0760, 72.8777, "Mumbai"),
    "kolkata": (22.5726, 88.3639, "Kolkata"),
    "jaipur": (26.9124, 75.7873, "Jaipur"),
    "bengaluru": (12.9716, 77.5946, "Bengaluru"),
    "hyderabad": (17.3850, 78.4867, "Hyderabad"),
}

def resolve_coords(location: str):
    key = location.lower().strip()
    if key in CITY_COORDS:
        return CITY_COORDS[key]
    return (23.2599, 77.4126, location.title())

@router.get("/weather/current", response_model=CurrentWeatherResponse)
async def get_current_weather(location: str = Query("Bhopal")):
    lat, lon, name = resolve_coords(location)
    data = await weather_provider.get_current_weather(lat, lon, name)
    return data

@router.get("/weather/forecast", response_model=WeatherForecastResponse)
@router.get("/forecast", response_model=WeatherForecastResponse)
def get_weather_forecast(location: str = Query("Bhopal")):
    lat, lon, name = resolve_coords(location)
    data = weather_provider.get_forecast_timeline(name, lat, lon)
    return data
