import * as jose from 'jose';
import crypto from 'crypto';
import { plainToInstance, ClassConstructor } from 'class-transformer';
import { Offer } from '../types/offer.type.js';
import { OfferCity } from '../common/offer-generator/const.js';

export const createOffer = (row: string) => {
  const tokens = row.replace('\n', '').split('\t');
  const [title, description, city, previewImage, offerImages, isPremium, isFavorite, rating,
    type, rooms, guests, price, features, name, email, avatar, password, isPro, reviewsCnt, latitude, longitude
  ] = tokens;

  return {
    title,
    description,
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
    reviewsCnt: +reviewsCnt,
    location: {
      latitude: +latitude,
      longitude: +longitude,
    }
  } as Offer;
};

export const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : '';

export const createSHA256 = (line: string, salt: string): string =>
  crypto.createHmac('sha256', salt).update(line).digest('hex');

export const fillDTO = <T, V>(someDto: ClassConstructor<T>, plainObject: V) =>
  plainToInstance(someDto, plainObject, {excludeExtraneousValues: true});

export const createErrorObject = (message: string) =>
  ({error: message});

export const createJWT = async (algoritm: string, jwtSecret: string, payload: object): Promise<string> =>
  new jose.SignJWT({...payload})
    .setProtectedHeader({ alg: algoritm})
    .setIssuedAt()
    .setExpirationTime('2d')
    .sign(crypto.createSecretKey(jwtSecret, 'utf-8'));
