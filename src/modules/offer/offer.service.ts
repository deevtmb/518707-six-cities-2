import { DocumentType, types } from '@typegoose/typegoose';
import { injectable, inject } from 'inversify';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { Component } from '../../types/component.type.js';
import CreateOfferDTO from './dto/create-offer.dto.js';
import UpdateOfferDTO from './dto/update-offer.dto.js';
import { OfferServiceInterface } from './offer-service.interface.js';
import { OfferEntity } from './offer.entity.js';
import { DEFAULT_OFFER_LIMIT, PREMIUM_OFFER_LIMIT } from './offer.constant.js';
import { SortType } from '../../types/sort-type.enum.js';

@injectable()
export default class OfferService implements OfferServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  public async create(dto: CreateOfferDTO): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}`);

    return result;
  }

  public async find(limit: number = DEFAULT_OFFER_LIMIT): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.aggregate([
      {
        $lookup: {
          localField: '_id',
          from: 'reviews',
          foreignField: 'offerId',
          as: 'reviews'
        }
      },
      {
        $set: {
          reviewsCnt: {$size: '$reviews'},
          rating: {$ifNull: [{$round: [{$avg: '$reviews.rating'}, 1]}, 0]},
        }
      },
      {$unset: ['reviews', 'offerImages', 'features', 'guests', 'rooms', 'description', 'userId']},
      {$sort: { createdAt: SortType.Down }},
      {$limit: limit}
    ]).exec();
  }

  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    const offers = await this.offerModel.aggregate([
      {
        $match: { $expr: { $eq: ['$_id', {$toObjectId: offerId}] } }
      },
      {
        $lookup: {
          localField: '_id',
          from: 'reviews',
          foreignField: 'offerId',
          as: 'reviews'
        }
      },
      {
        $set: {
          reviewsCnt: {$size: '$reviews'},
          rating: {$ifNull: [{$round: [{$avg: '$reviews.rating'}, 1]}, 0]},
        }
      },
      {$unset: ['reviews']}
    ]);

    return await this.offerModel.populate(offers[0], 'userId');
  }

  public async updateById(offerId: string, dto: UpdateOfferDTO): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndUpdate(offerId, dto, {new: true}).populate('userId').exec();
  }

  public async deleteById(offerId: string): Promise <DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndDelete(offerId).exec();
  }

  public async findFavorites(): Promise <DocumentType<OfferEntity>[] | null> {
    return this.offerModel.aggregate([
      {
        $match: {isFavorite: true}
      },
      {
        $lookup: {
          localField: '_id',
          from: 'reviews',
          foreignField: 'offerId',
          as: 'reviews'
        }
      },
      {
        $set: {
          reviewsCnt: {$size: '$reviews'},
          rating: {$ifNull: [{$round: [{$avg: '$reviews.rating'}, 1]}, 0]},
        }
      },
      {
        $unset: ['reviews', 'offerImages', 'features', 'guests', 'rooms', 'description', 'userId']
      }
    ]).exec();
  }

  public async findCityPremiumOffers(cityName: string): Promise <DocumentType<OfferEntity>[] | null> {
    return this.offerModel.aggregate([
      {
        $match: {'city.name': cityName, isPremium: true}
      },
      {
        $lookup: {
          localField: '_id',
          from: 'reviews',
          foreignField: 'offerId',
          as: 'reviews'
        }
      },
      {
        $set: {
          reviewsCnt: {$size: '$reviews'},
          rating: {$ifNull: [{$round: [{$avg: '$reviews.rating'}, 1]}, 0]},
        }
      },
      {$unset: ['reviews', 'offerImages', 'features', 'guests', 'rooms', 'description', 'userId']},
      {$sort: { createdAt: SortType.Down }},
      {$limit: PREMIUM_OFFER_LIMIT}
    ]).exec();
  }
}
