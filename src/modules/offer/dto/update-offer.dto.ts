import {
  IsString,
  IsArray,
  Length,
  IsMongoId,
  ArrayMinSize,
  ArrayMaxSize,
  IsBoolean,
  IsOptional,
  IsInt,
  IsNumber,
  Min,
  Max,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { City as CityType } from '../../../types/city.type.js';
import { Location as LocationType } from '../../../types/location.type.js';
import { OfferFeature } from '../../../types/offer-feature.enum.js';
import { OfferType } from '../../../types/offer-type.enum.js';

class Location implements LocationType {
  @IsNumber({}, {message: 'latitude is required'})
  public latitude!: number;

  @IsNumber({}, {message: 'longitude is required'})
  public longitude!: number;
}

class City implements CityType {
  @IsString({message: 'city name is required'})
  public name!: string;

  @ValidateNested()
  @Type(() => Location)
  public location!: Location;
}

export default class UpdateOfferDTO {
  @IsOptional()
  @IsString({message: 'title is required'})
  @Length(10, 100, {message: 'title length min 10 and max 100 characters'})
  public title?: string;

  @IsOptional()
  @IsString({message: 'description is required'})
  @Length(20, 1024, {message: 'description length min 20 and max 1024 characters'})
  public description?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => City)
  public city?: City;

  @IsOptional()
  @IsString({message: 'previewImage is required'})
  public previewImage?: string;

  @IsOptional()
  @IsArray({message: 'Required 6 offerImages'})
  @ArrayMinSize(6, {message: 'offerImages must contain 6 items'})
  @ArrayMaxSize(6, {message: 'offerImages must contain 6 items'})
  public offerImages?: string[];

  @IsOptional()
  @IsBoolean({message: 'premium status required'})
  public isPremium?: boolean;

  @IsOptional()
  @IsBoolean()
  public isFavorite?: boolean;

  @IsOptional()
  @IsEnum(OfferType, {message: 'Valid values: apartment, house, room, hotel'})
  public type?: OfferType;

  @IsOptional()
  @IsInt({message: 'number of rooms is required'})
  @Min(1, {message: 'Min number of rooms is 1'})
  @Max(8, {message: 'Max number of rooms is 8'})
  public rooms?: number;

  @IsOptional()
  @IsInt({message: 'number of guests is required'})
  @Min(1, {message: 'Min number of guests is 1'})
  @Max(10, {message: 'Max rating is 10'})
  public guests?: number;

  @IsOptional()
  @IsInt({message: 'price is required'})
  @Min(100, {message: 'Min price is 100'})
  @Max(100000, {message: 'Max price is 100000'})
  public price?: number;

  @IsOptional()
  @IsEnum(OfferFeature, {each: true})
  public features?: OfferFeature[];

  @IsOptional()
  @IsMongoId({message: 'userId must be a valid id'})
  public userId?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => Location)
  public location?: Location;
}
