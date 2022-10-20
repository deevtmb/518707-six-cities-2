import { Expose, Type } from 'class-transformer';
import { City } from '../../../types/city.type.js';
import { Location } from '../../../types/location.type.js';
import { OfferFeature } from '../../../types/offer-feature.enum.js';
import { OfferType } from '../../../types/offer-type.enum.js';
import UserResponse from '../../user/response/user.response.js';

export default class OfferExtendedResponse {
  @Expose()
  public id!: string;

  @Expose()
  public title!: string;

  @Expose()
  public description!: string;

  @Expose()
  public city!: City;

  @Expose()
  public previewImage!: string;

  @Expose()
  public offerImages!: string[];

  @Expose()
  public isPremium!: boolean;

  @Expose()
  public isFavorite!: boolean;

  @Expose()
  public rating!: number;

  @Expose()
  public type!: OfferType;

  @Expose()
  public rooms!: number;

  @Expose()
  public guests!: number;

  @Expose()
  public price!: number;

  @Expose()
  public features!: OfferFeature[];

  @Expose({name: 'userId'})
  @Type(() => UserResponse)
  public user!: UserResponse;

  @Expose()
  public reviewsCnt!: number;

  @Expose()
  public location!: Location;

  @Expose()
  public createdAt!: Date;
}
