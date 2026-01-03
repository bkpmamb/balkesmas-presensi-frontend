// lib/types/settings.ts

export interface GPSLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface Settings {
  _id: string;
  officeName: string;
  officeAddress: string;
  targetLatitude: number;
  targetLongitude: number;
  radiusMeters: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateSettingsDto {
  targetLatitude?: number;
  targetLongitude?: number;
  radiusMeters?: number;
  officeName?: string;
  officeAddress?: string;
  isActive?: boolean;
}

export interface Category {
  _id: string;
  name: string;
  prefix: string;
  nextNumber?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDto {
  name: string;
  prefix: string;
}

export interface UpdateCategoryDto {
  name?: string;
  prefix?: string;
}

export interface SettingsResponse {
  success: boolean;
  message: string;
  data: Settings;
}

export interface CategoriesResponse {
  success: boolean;
  message: string;
  data: Category[];
}

export interface GPSFormValues {
  latitude: number;
  longitude: number;
  maxDistance: number;
}

export interface GuideSection {
  icon: string;
  title: string;
  items: string[];
}

export interface SystemInfoItem {
  label: string;
  value: string | number;
  isMono?: boolean;
}
