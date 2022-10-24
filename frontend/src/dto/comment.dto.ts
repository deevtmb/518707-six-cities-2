import { User } from '../types/types';

export default class CommentDTO {
  public id!: string;

  public text!: string;

  public rating!: number;

  public user!: User;

  public offerId!: string;

  public createdAt!: string;
}
