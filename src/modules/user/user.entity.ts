import typegoose, { getModelForClass, defaultClasses } from '@typegoose/typegoose';
import { User } from '../../types/user.type.js';
import { createSHA256 } from '../../utils/common.js';

const {prop, modelOptions} = typegoose;

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({schemaOptions: {collection: 'users'}})
export class UserEntity extends defaultClasses.TimeStamps implements User {
  constructor(data: User) {
    super();

    this.name = data.name;
    this.email = data.email;
    this.avatar = data.avatar;
    this.isPro = data.isPro;
  }

  @prop({required: true, default: ''})
  public name!: string;

  @prop({required: true, unique: true})
  public email!: string;

  @prop({default: 'avatar.svg'})
  public avatar!: string;

  @prop({required: true, default: ''})
  public password!: string;

  @prop({required: true, default: false})
  public isPro!: boolean;

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
