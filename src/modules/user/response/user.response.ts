import { Expose, Transform } from 'class-transformer';

export default class UserResponse {
  @Expose({name: '_id'})
  @Transform((value) => value.obj._id.toString())
  public id!: string;

  @Expose()
  public name!: string;

  @Expose()
  public email!: string;

  @Expose()
  public avatar!: string;

  @Expose()
  public isPro!: boolean;
}
