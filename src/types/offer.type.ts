import { City } from './city.type.js';
import { Location } from './location.type.js';
import { OfferFeature } from './offer-feature.enum.js';
import { OfferType } from './offer-type.enum.js';
import { User } from './user.type.js';

export type Offer = {
  title: string;
  description: string;
  date: Date;
  city: City;
  previewImage: string;
  offerImages: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  type: OfferType;
  rooms: number;
  guests: number;
  price: number;
  features: OfferFeature[];
  user: User;
  commentsCnt: number;
  location: Location;
}
