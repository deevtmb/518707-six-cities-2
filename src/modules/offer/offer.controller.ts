import * as core from 'express-serve-static-core';
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { Controller } from '../../common/controller/controller.js';
import { Component } from '../../types/component.type.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { OfferServiceInterface } from './offer-service.interface.js';
import { fillDTO } from '../../utils/common.js';
import OfferResponse from './response/offer.response.js';
import OfferExtendedResponse from './response/offer-extended.response.js';
import CreateOfferDTO from './dto/create-offer.dto.js';
import UpdateOfferDTO from './dto/update-offer.dto.js';
import { ValidateObjectIdMiddleware } from '../../common/middlewares/validate-objectid.middleware.js';
import { ValidateDTOMiddleware } from '../../common/middlewares/validate-dto.middleware.js';
import { DocumentExistsMiddleware } from '../../common/middlewares/document-exists.middleware.js';
import { PrivateRouteMiddleware } from '../../common/middlewares/private-route.middleware.js';
import HttpError from '../../common/errors/http-error.js';
import { StatusCodes } from 'http-status-codes';
import { DEFAULT_OFFER_LIMIT } from './offer.constant.js';
import { ConfigInterface } from '../../common/config/config.interface.js';

type ParamsGetOffer = {
  offerId: string;
}

@injectable()
export default class OfferController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.ConfigInterface) configService: ConfigInterface,
    @inject(Component.OfferServiceInterface) private readonly offerService: OfferServiceInterface
  ) {
    super(logger, configService);

    this.logger.info('Register routes for OfferController...');

    this.addRoute({path: '/premium', method: HttpMethod.Get, handler: this.getPremium});
    this.addRoute({
      path: '/favorites',
      method: HttpMethod.Get,
      handler: this.getFavorites,
      middlewares: [new PrivateRouteMiddleware()]
    });
    this.addRoute({
      path: '/favorites/:offerId',
      method: HttpMethod.Put,
      handler: this.updateFavoriteStatus,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDTOMiddleware(UpdateOfferDTO),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
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
      path: '/:offerId',
      method: HttpMethod.Put,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDTOMiddleware(UpdateOfferDTO),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ],
    });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDTOMiddleware(CreateOfferDTO)
      ]
    });
    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
  }

  public async index(
    {query, user}: Request<core.Query>,
    res: Response
  ): Promise<void> {
    const limit = query.limit ?? DEFAULT_OFFER_LIMIT;
    const offers = await this.offerService.find(!!user, +limit);

    this.ok(res, fillDTO(OfferResponse, offers));
  }

  public async create(
    {body, user: {id}}: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDTO>,
    res: Response
  ): Promise<void> {
    const result = await this.offerService.create({...body, userId: id});
    const offer = await this.offerService.findById(result.id);
    this.created(res, fillDTO(OfferExtendedResponse, offer));
  }

  public async show(
    {params}: Request<core.ParamsDictionary | ParamsGetOffer>,
    res: Response
  ): Promise<void> {
    const offer = await this.offerService.findById(params.offerId);
    this.ok(res, fillDTO(OfferExtendedResponse, offer));
  }

  public async update(
    {body, params}: Request<core.ParamsDictionary | ParamsGetOffer, Record<string, unknown>, UpdateOfferDTO>,
    res: Response
  ): Promise<void> {
    const offer = await this.offerService.updateById(params.offerId, body);
    this.ok(res, fillDTO(OfferExtendedResponse, offer));
  }

  public async delete(
    {params, user: {id}}: Request<core.ParamsDictionary | ParamsGetOffer>,
    res: Response
  ): Promise<void> {
    const offer = await this.offerService.findById(params.offerId);
    const userId = offer?.userId?._id.toString();

    if (userId !== id) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        'Deleting prohibited',
        'OfferController',
      );
    }

    await this.offerService.deleteById(params.offerId);
    this.ok(res, `Offer with id ${params.offerId} has been deleted.`);
  }

  public async getPremium(
    {headers}: Request,
    res: Response
  ): Promise<void> {
    const cityName = headers['x-city-name'] as string;
    const offers = await this.offerService.findCityPremiumOffers(cityName);

    this.ok(res, fillDTO(OfferResponse, offers));
  }

  public async getFavorites(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.findFavorites();

    this.ok(res, fillDTO(OfferResponse, offers));
  }

  public async updateFavoriteStatus(
    {body, params}: Request<core.ParamsDictionary | ParamsGetOffer, Record<string, unknown>, UpdateOfferDTO>,
    res: Response
  ): Promise<void> {
    const offer = await this.offerService.updateById(params.offerId, body);
    this.ok(res, fillDTO(OfferResponse, offer));
  }
}
