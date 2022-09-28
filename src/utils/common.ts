import crypto from 'crypto';
import { Offer } from '../types/offer.type.js';
import { OfferCity } from '../common/offer-generator/const.js';

export const createOffer = (row: string) => {
  const tokens = row.replace('\n', '').split('\t');
  const [title, description, postDate, city, previewImage, offerImages, isPremium, isFavorite, rating,
    type, rooms, guests, price, features, name, email, avatar, password, isPro, commentsCnt, latitude, longitude
  ] = tokens;

  return {
    title,
    description,
    date: new Date(postDate),
    city: OfferCity[city],
    previewImage,
    offerImages: offerImages.split(';'),
    isPremium: !!isPremium,
    isFavorite: !!isFavorite,
    rating: +rating,
    type,
    rooms: +rooms,
    guests: +guests,
    price: +price,
    features: features.split(';').map((feature) => (feature)),
    user: {
      name,
      email,
      avatar,
      password,
      isPro: !!isPro,
    },
    commentsCnt: +commentsCnt,
    location: {
      latitude: +latitude,
      longitude: +longitude,
    }
  } as Offer;
};

export const getErrorMessage = (error: unknown): string => error instanceof Error ? error.message : '';

export const createSHA256 = (line: string, salt: string): string => crypto.createHmac('sha256', salt).update(line).digest('hex');
