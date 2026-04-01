import { useQuery } from '@tanstack/react-query';
import axios from '../lib/axios';
import type { Country, Province, Commune, Zone, Colline } from '@/types';


// Countries with nested data
export const useCountries = () => {
  return useQuery({
    queryKey: ['countries'],
    queryFn: async (): Promise<Country[]> => {
      const response = await axios.get('/geo/countries/');
      return response.data.data || response.data.results || [];
    }
  });
};

// Helper functions to extract nested data
export const getProvincesByCountry = (countries: Country[], countryId: string): Province[] => {
  const country = countries.find(c => c.id === countryId);
  return country?.provinces || [];
};

export const getCommunesByProvince = (countries: Country[], countryId: string, provinceId: string): Commune[] => {
  const provinces = getProvincesByCountry(countries, countryId);
  const province = provinces.find(p => p.id === provinceId);
  return province?.communes || [];
};

export const getZonesByCommune = (countries: Country[], countryId: string, provinceId: string, communeId: string): Zone[] => {
  const communes = getCommunesByProvince(countries, countryId, provinceId);
  const commune = communes.find(c => c.id === communeId);
  return commune?.zones || [];
};

export const getCollinesByZone = (countries: Country[], countryId: string, provinceId: string, communeId: string, zoneId: string): Colline[] => {
  const zones = getZonesByCommune(countries, countryId, provinceId, communeId);
  const zone = zones.find(z => z.id === zoneId);
  return zone?.collines || [];
};