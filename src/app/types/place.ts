import { MapPin, Building2, Landmark, Calendar, Palette, Filter, Loader } from 'lucide-react';

export type PlaceType =
  | "museum"
  | "monument"
  | "event"
  | "art";

export interface Place {
  map(arg0: (place: any) => any): any;
  id: string;
  name: string;
  lat: number;
  lon: number;
  type: string;
  description?: string;
  image?: string;
  wikipedia?: string;
  website?: string;
}

export interface CulturalPoint {
  id: string;
  name: string;
  type: string;
  lat: number;
  lng: number;
  color: string;
  description?: string;
  image?: string;
  wikipedia?: string;
  website?: string;
}

export const typeColors: Record<string, string> = {
  museum: '#E63946',
  monument: '#F4A261',
  event: '#E76F51',
  art: '#2A9D8F',
};

export const typeIcons: Record<string, any> = {
  museum: Building2,
  monument: Landmark,
  event: Calendar,
  art: Palette,
};
