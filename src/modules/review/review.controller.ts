import * as core from 'express-serve-static-core';
import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { Controller } from '../../common/controller/controller.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { Component } from '../../types/component.type.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { ReviewServiceInterface } from './review-service.interface.js';
import CreateReviewDTO from './dto/create-review.dto.js';
import { OfferServiceInterface } from '../offer/offer-service.interface.js';
import { StatusCodes } from 'http-status-codes';
import HttpError from '../../common/errors/http-error.js';
import ReviewResponse from './response/review.response.js';
import { fillDTO } from '../../utils/common.js';
import { ValidateObjectIdMiddleware } from '../../common/middlewares/validate-objectid.middleware.js';
import { ValidateDTOMiddleware } from '../../common/middlewares/validate-dto.middleware.js';
import { DocumentExistsMiddleware } from '../../common/middlewares/document-exists.middleware.js';
import { PrivateRouteMiddleware } from '../../common/middlewares/private-route.middleware.js';
import { ConfigInterface } from '../../common/config/config.interface.js';

type ParamsGetReviews = {
  offerId: string;
}

@injectable()
export default class ReviewController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.ConfigInterface) configService: ConfigInterface,
    @inject(Component.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
    @inject(Component.ReviewServiceInterface) private readonly reviewService: ReviewServiceInterface
  ) {
    super(logger, configService);

    this.logger.info('Register routes for ReviewController...');

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDTOMiddleware(CreateReviewDTO)
      ]
    });
  }

  public async show(
    {params}: Request<core.ParamsDictionary | ParamsGetReviews>,
    res: Response
  ): Promise<void> {
    const offer = await this.offerService.findById(params.offerId);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${params.offerId} not found.`,
        'OfferController'
      );
    }

    const reviews = await this.reviewService.findByOfferId(params.offerId);
    this.ok(res, fillDTO(ReviewResponse, reviews));
  }

  public async create(
    {body, user: {id}}: Request<object, object, CreateReviewDTO>,
    res: Response
  ): Promise<void> {
    if (!await this.offerService.exists(body.offerId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${body.offerId} not found.`,
        'CommentController'
      );
    }

    const review = await this.reviewService.create({...body, userId: id});
    this.created(res, fillDTO(ReviewResponse, review));
  }
}
