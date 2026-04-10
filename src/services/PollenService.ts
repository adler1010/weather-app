// src/services/PollenService.ts

export interface GeocodeResult {
  lat: number;
  lon: number;
}

export interface PollenValues {
  today: string | null;
  tomorrow: string | null;
  dayafter_to: string | null;
}

export interface PollenRegion {
  region_id: number;
  region_name: string;
  partregion_id: number;
  partregion_name: string;
  Pollen: Record<string, PollenValues>;
}


class PollenService {
  static async getPollenData(): Promise<PollenRegion[]> {
    // documentation: https://maps.dwd.de/geoserver/web/?0
    const url = '/api/climate_environment/health/alerts/s31fg.json';

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const wrappedData = await response.json();

      if (!wrappedData || !wrappedData.content || !Array.isArray(wrappedData.content)) {
        throw new Error('Invalid pollen data format received from API');
      }

      return wrappedData.content as PollenRegion[];
    } catch (error) {
      console.error('Failed to fetch pollen data:', error);
      throw error;
    }

  }

  // Parse pollen level like "1", "1-2", "2-3", or null
  static parsePollenLevel(level: string | null): number {
    if (level === null || level === '') return 0;
    if (level.includes('-')) {
      const parts = level.split('-').map(Number);
      return parts[1];
    }
    return Number(level);
  }
}

export default PollenService;
