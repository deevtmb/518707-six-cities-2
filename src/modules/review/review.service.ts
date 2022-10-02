import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.type.js';
import { SortType } from '../../types/sort-type.enum.js';
import CreateReviewDTO from './dto/create-review.dto.js';
import { ReviewServiceInterface } from './review-service.interface.js';
import { DEFAULT_REVIEW_LIMIT } from './review.constant.js';
import { ReviewEntity } from './review.entity.js';

@injectable()
export default class ReviewService implements ReviewServiceInterface {
  constructor(
    @inject(Component.ReviewModel) private readonly reviewModel: types.ModelType<ReviewEntity>
  ) {}

  public async create(dto: CreateReviewDTO): Promise<DocumentType<ReviewEntity>> {
    const review = await this.reviewModel.create(dto);
    return review.populate('userId');
  }

  public async findByOfferId(offerId: string): Promise<DocumentType<ReviewEntity>[] | null> {
    return this.reviewModel
      .find({offerId})
      .sort({createdAt: SortType.Down})
      .limit(DEFAULT_REVIEW_LIMIT)
      .populate('userId')
      .exec();
  }

  public async deleteByOfferId(offerId: string): Promise<number | null> {
    const result = await this.reviewModel.deleteMany({offerId}).exec();
    return result.deletedCount;
  }
}
