import {IsEmail, IsString, IsBoolean, IsOptional, Length} from 'class-validator';

export default class CreateUserDTO {
  @IsString({message: 'Name is required'})
  @Length(1, 15, {message: 'Min length is 1, max is 15'})
  public name!: string;

  @IsEmail({}, {message: 'Invalid email address'})
  public email!: string;

  @IsOptional()
  public avatar!: string;

  @IsString({message: 'Password is required'})
  @Length(6, 12, {message: 'Min length for password is 6, max is 12'})
  public password!: string;

  @IsBoolean({message: 'Pro status is required'})
  public isPro!: boolean;
}
