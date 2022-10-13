import {
  IsString,
  IsInt,
  Length,
  IsMongoId,
  Min,
  Max
} from 'class-validator';

export default class CreateReviewDTO {
  @IsString({message: 'Name is required'})
  @Length(5, 1024, {message: 'Min length is 5, max is 1024'})
  public text!: string;

  @IsInt({message: 'Rating is required'})
  @Min(1, {message: 'Min rating is 1'})
  @Max(5, {message: 'Max rating is 5'})
  public rating!: number;

  public userId!: string;

  @IsMongoId({message: 'offerId must be a valid id'})
  public offerId!: string;
}
