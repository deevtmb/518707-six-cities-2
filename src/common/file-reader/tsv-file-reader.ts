import { readFileSync } from 'fs';
import { OfferType } from '../../types/offer-type.enum.js';
import { Offer } from '../../types/offer.type.js';
import { FileReaderInterface } from './file-reader.interface.js';

export default class TSVFileReader implements FileReaderInterface {
  private rawData = '';

  constructor(public filename: string) {}

  public read() {
    this.rawData = readFileSync(this.filename, {encoding: 'utf-8'});
  }

  public toArray(): Offer[] {
    if (!this.rawData) {
      return [];
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim() !== '')
      .map((line) => line.split('\t'))
      .map(([
        title,
        description,
        postDate,
        city,
        previewImage,
        offerImages,
        isPremium,
        isFavorite,
        rating,
        type,
        rooms,
        guests,
        price,
        features,
        name,
        email,
        avatar,
        password,
        isPro,
        commentsCnt,
        latitude,
        longitude
      ]) => ({
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
      }));
  }
}
