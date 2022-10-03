import { DocumentType } from '@typegoose/typegoose';
import { ReviewEntity } from './review.entity.js';
import CreateReviewDTO from './dto/create-review.dto.js';

export interface ReviewServiceInterface {
  create(dto: CreateReviewDTO): Promise<DocumentType<ReviewEntity>>;
  findByOfferId(offerId: string): Promise<DocumentType<ReviewEntity>[] | null>;
  deleteByOfferId(offerId: string): Promise<number | null>;
}
