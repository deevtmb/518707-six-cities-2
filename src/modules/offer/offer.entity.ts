import typegoose, { getModelForClass, defaultClasses, Ref } from '@typegoose/typegoose';
import { City } from '../../types/city.type.js';
import { Location } from '../../types/location.type.js';
import { OfferFeature } from '../../types/offer-feature.enum.js';
import { OfferType } from '../../types/offer-type.enum.js';
import { UserEntity } from '../user/user.entity.js';

const {prop, modelOptions} = typegoose;

export interface OfferEntity extends defaultClasses.Base {}

@modelOptions(
  {
    schemaOptions: {collection: 'offers'},
    options: {
      allowMixed: 0
    }
  })
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({trim: true, required: true})
  public title!: string;

  @prop({trim: true, required: true})
  public description!: string;

  @prop({required: true})
  public city!: City;

  @prop({default: ''})
  public previewImage!: string;

  @prop({required: true})
  public offerImages!: string[];

  @prop({required: true})
  public isPremium!: boolean;

  @prop({default: false})
  public isFavorite!: boolean;

  @prop({default: 0})
  public rating!: number;

  @prop({required: true})
  public type!: OfferType;

  @prop({required: true})
  public rooms!: number;

  @prop({required: true})
  public guests!: number;

  @prop({required: true})
  public price!: number;

  @prop({required: true})
  public features!: OfferFeature[];

  @prop({required: true, ref: UserEntity})
  public userId!: Ref<UserEntity>;

  @prop({default: 0})
  public reviewsCnt!: number;

  @prop({required: true})
  public location!: Location;
}

export const OfferModel = getModelForClass(OfferEntity);
