import { City } from '../../../types/city.type.js';
import { Location } from '../../../types/location.type.js';
import { OfferFeature } from '../../../types/offer-feature.enum.js';
import { OfferType } from '../../../types/offer-type.enum.js';

export default class CreateOfferDTO {
  public title!: string;
  public description!: string;
  public date!: Date;
  public city!: City;
  public previewImage!: string;
  public offerImages!: string[];
  public isPremium!: boolean;
  public isFavorite!: boolean;
  public rating!: number;
  public type!: OfferType;
  public rooms!: number;
  public guests!: number;
  public price!: number;
  public features!: OfferFeature[];
  public userId!: string;
  public commentsCnt!: number;
  public location!: Location;
}
