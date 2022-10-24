import { City, Location, Type } from '../types/types';

export default class CreateOfferDTO {
  public title!: string;

  public description!: string;

  public city!: City;

  public previewImage!: string;

  public offerImages!: string[];

  public isPremium!: boolean;

  public isFavorite!: boolean;

  public type!: Type;

  public rooms!: number;

  public guests!: number;

  public price!: number;

  public features!: string[];

  public location!: Location;
}
