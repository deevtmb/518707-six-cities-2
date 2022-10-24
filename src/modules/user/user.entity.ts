import typegoose, { getModelForClass, defaultClasses } from '@typegoose/typegoose';
import { User } from '../../types/user.type.js';
import { createSHA256 } from '../../utils/common.js';
import { DEFAULT_AVATAR_FILE_NAME } from './user.constant.js';

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

  @prop({default: DEFAULT_AVATAR_FILE_NAME})
  public avatar!: string;

  @prop({required: true, default: ''})
  public password!: string;

  @prop({default: false})
  public isPro!: boolean;

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }

  public verifyPassword(password: string, salt: string) {
    return createSHA256(password, salt) === this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
