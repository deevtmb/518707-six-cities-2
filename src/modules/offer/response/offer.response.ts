import { Expose, Transform } from 'class-transformer';
import { City } from '../../../types/city.type.js';
import { Location } from '../../../types/location.type.js';
import { OfferType } from '../../../types/offer-type.enum.js';

export default class OfferResponse {
  @Expose({name: '_id'})
  @Transform((value) => value.obj._id.toString())
  public id!: string;

  @Expose()
  public city!: City;

  @Expose()
  public title!: string;

  @Expose()
  public previewImage!: string;

  @Expose()
  public isPremium!: boolean;

  @Expose()
  public isFavorite!: boolean;

  @Expose()
  public rating!: number;

  @Expose()
  public type!: OfferType;

  @Expose()
  public price!: number;

  @Expose()
  public location!: Location;

  @Expose()
  public createdAt!: Date;

  @Expose()
  public reviewsCnt!: number;
}
