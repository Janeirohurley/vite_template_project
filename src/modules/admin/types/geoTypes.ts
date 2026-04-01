export interface CreateCountryData {
  country_name: string;
  code?: string | null;
}

export type UpdateCountryData = CreateCountryData;

export interface CreateProvinceData {
  province_name: string;
  country_id: string;
}

export type UpdateProvinceData = CreateProvinceData;

export interface CreateCommuneData {
  commune_name: string;
  province_id: string;
}

export type UpdateCommuneData = CreateCommuneData;

export interface CreateZoneData {
  zone_name: string;
  commune_id: string;
}

export type UpdateZoneData = CreateZoneData;

export interface CreateCollineData {
  colline_name: string;
  zone_id: string;
}

export type UpdateCollineData = CreateCollineData;
