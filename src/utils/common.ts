import * as jose from 'jose';
import crypto from 'crypto';
import { plainToInstance, ClassConstructor } from 'class-transformer';
import { Offer } from '../types/offer.type.js';
import { OfferCity } from '../common/offer-generator/const.js';
import { ValidationError } from 'class-validator';
import { ValidationErrorField } from '../types/validation-error-field.type.js';
import { ErrorService } from '../types/error-service.enum.js';
import { UnknownObject } from '../types/unknown-object.type.js';
import { DEFAULT_STATIC_IMAGES } from '../app/application.constant.js';

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

export const createJWT = async (algoritm: string, jwtSecret: string, payload: object): Promise<string> =>
  new jose.SignJWT({...payload})
    .setProtectedHeader({ alg: algoritm})
    .setIssuedAt()
    .setExpirationTime('2d')
    .sign(crypto.createSecretKey(jwtSecret, 'utf-8'));

export const createErrorObject = (errorService: ErrorService, message: string, details: ValidationErrorField[] = []) => ({
  errorType: errorService,
  message,
  details: [...details]
});

export const transformErrors = (errors: ValidationError[]): ValidationErrorField[] =>
  errors.map(({property, value, constraints}) => ({
    property,
    value,
    messages: constraints ? Object.values(constraints) : []
  }));

export const getFullServerPath = (host: string, port: number) => `http://${host}:${port}`;

const isObject = (value: unknown) => typeof value === 'object' && value !== null;

export const transformProperty = (
  property: string,
  someObject: UnknownObject,
  transformFn: (object: UnknownObject) => void
) => {
  Object.keys(someObject)
    .forEach((key) => {
      if (key === property) {
        transformFn(someObject);
      } else if (isObject(someObject[key])) {
        transformProperty(property, someObject[key] as UnknownObject, transformFn);
      }
    });
};

export const transformObject = (
  properties: string[],
  staticPath: string,
  uploadPath: string,
  data: UnknownObject
) => {
  properties
    .forEach((property) => transformProperty(property, data, (target: UnknownObject) => {
      const rootPath = DEFAULT_STATIC_IMAGES.includes(target[property] as string) ? staticPath : uploadPath;
      target[property] = `${rootPath}/${target[property]}`;
    }));
};
