//Wrapper um einen String Wert, weil die API das häufig so zurückgibt
export interface StringWrapper {
  value: string;
}

// das sind jetzt nur die wichtigsten Daten für uns
export interface CurrentCondition {
    temp_C: string;
    FeelsLikeC: string; //fragt mich nicht, warum das auf einmal groß geschrieben wird
    cloudcover: string;
    uvIndex: string;
    humidity: string;
    weatherDesc: StringWrapper[];
    localObsDateTime: string;
}

// es gibt darin noch ein hourly[], das für alle 3 Stunden Daten enthält,
// das geht für uns jetzt glaub ich aber zu weit
export interface DailyWeather {
    avgtempC: string;
    date: string;
    maxtempC: string;
    mintempC: string;
    sunHour: string;
    totalSnow_cm: string;
    uvIndex: string;
}

export interface Area {
  areaName: StringWrapper[];
  country: StringWrapper[];
  region: StringWrapper[];
}

export interface WeatherData {
  current_condition: CurrentCondition[]; // kompakte Daten für heute
  weather: DailyWeather[]; // enthält Daten für heute und die nächsten beiden Tage
  nearest_area: Area[];
}

//Stadt ist erstmal statisch
const city = 'Magdeburg'

class WeatherService {
  static async getWeatherData(): Promise<WeatherData> {
    const url = `https://wttr.in/${city}?format=j1`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

    return await response.json() as WeatherData;
  }
}

export default WeatherService;
