import {IsEmail, IsString, Length} from 'class-validator';

export default class LoginUserDTO {
  @IsEmail({}, {message: 'Invalid email address'})
  public email!: string;

  @IsString({message: 'password is required'})
  @Length(6, 12, {message: 'Min length for password is 6, max is 12'})
  public password!: string;
}
