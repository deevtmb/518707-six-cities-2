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

type ParamsGetReviews = {
  offerId: string;
}

@injectable()
export default class ReviewController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
    @inject(Component.ReviewServiceInterface) private readonly reviewService: ReviewServiceInterface
  ) {
    super(logger);

    this.logger.info('Register routes for ReviewController');

    this.addRoute({path: '/:offerId', method: HttpMethod.Get, handler: this.show});
    this.addRoute({path: '/', method: HttpMethod.Post, handler: this.create});
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
    {body}: Request<object, object, CreateReviewDTO>,
    res: Response
  ): Promise<void> {
    const offer = await this.offerService.findById(body.offerId);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${body.offerId} not found.`,
        'CommentController'
      );
    }

    const review = await this.reviewService.create(body);
    this.created(res, fillDTO(ReviewResponse, review));
  }
}