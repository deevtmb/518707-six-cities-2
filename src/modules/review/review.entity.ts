import typegoose, { defaultClasses, getModelForClass, Ref } from '@typegoose/typegoose';
import { OfferEntity } from '../offer/offer.entity.js';
import { UserEntity } from '../user/user.entity.js';

const {prop, modelOptions} = typegoose;

export interface ReviewEntity extends defaultClasses.Base {}

@modelOptions({schemaOptions: {collection: 'reviews'}})
export class ReviewEntity extends defaultClasses.TimeStamps {
  @prop({required: true})
  public text!: string;

  @prop({required: true})
  public rating!: number;

  @prop({required: true, ref: UserEntity})
  public userId!: Ref<UserEntity>;

  @prop({required: true, ref: OfferEntity})
  public offerId!: Ref<OfferEntity>;
}

export const ReviewModel = getModelForClass(ReviewEntity);

