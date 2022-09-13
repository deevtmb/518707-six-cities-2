import { Offer } from '../types/offer.type.js';
import { OfferType } from '../types/offer-type.enum.js';

export const createOffer = (row: string) => {
  const tokens = row.replace('\n', '').split('\t');
  const [title, description, postDate, city, previewImage, offerImages, isPremium, isFavorite, rating,
    type, rooms, guests, price, features, name, email, avatar, password, isPro, commentsCnt, latitude, longitude
  ] = tokens;

  return {
    title,
    description,
    date: new Date(postDate),
    city,
    previewImage,
    offerImages: offerImages.split(';'),
    isPremium: Boolean(isPremium),
    isFavorite: Boolean(isFavorite),
    rating: +rating,
    type: OfferType[type as 'Apartment' | 'Hotel' | 'House' | 'Room'],
    rooms: +rooms,
    guests: +guests,
    price: +price,
    features: features.split(';').map((feature) => ({name: feature})),
    user: {
      name,
      email,
      avatar,
      password,
      isPro: Boolean(isPro)
    },
    commentsCnt: +commentsCnt,
    location: {
      latitude,
      longitude
    }
  } as Offer;
};

export const getErrorMessage = (error: unknown): string => error instanceof Error ? error.message : '';
