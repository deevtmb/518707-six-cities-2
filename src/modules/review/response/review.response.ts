import { Expose, Type } from 'class-transformer';
import UserResponse from '../../user/response/user.response.js';

export default class ReviewResponse {
  @Expose()
  public text!: string;

  @Expose()
  public rating!: number;

  @Expose({name: 'userId'})
  @Type(() => UserResponse)
  public user!: UserResponse;

  @Expose()
  public offerId!: string;
}
