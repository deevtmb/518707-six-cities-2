import * as core from 'express-serve-static-core';
import { StatusCodes } from 'http-status-codes';
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
import HttpError from '../../common/errors/http-error.js';

type ParamsGetOffer = {
  offerId: string;
}

@injectable()
export default class OfferController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.OfferServiceInterface) private readonly offerService: OfferServiceInterface
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController');

    this.addRoute({path: '/premium', method: HttpMethod.Get, handler: this.getPremium});
    this.addRoute({path: '/favorites', method: HttpMethod.Get, handler: this.getFavorites});
    this.addRoute({path: '/favorites/:offerId', method: HttpMethod.Put, handler: this.updateFavoriteStatus});
    this.addRoute({path: '/:offerId', method: HttpMethod.Get, handler: this.show});
    this.addRoute({path: '/:offerId', method: HttpMethod.Put, handler: this.update});
    this.addRoute({path: '/:offerId', method: HttpMethod.Delete, handler: this.delete});
    this.addRoute({path: '/', method: HttpMethod.Post, handler: this.create});
    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
  }

  public async index(
    {query}: Request<core.Query>,
    res: Response
  ): Promise<void> {
    const offers = query.limit ?
      await this.offerService.find(+query.limit) :
      await this.offerService.find();

    this.ok(res, fillDTO(OfferResponse, offers));
  }

  public async create(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDTO>,
    res: Response
  ): Promise<void> {
    const result = await this.offerService.create(body);
    const offer = await this.offerService.findById(result.id);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'Offer has not been created something goes wrong.',
        'OfferController'
      );
    }

    this.created(res, fillDTO(OfferExtendedResponse, offer));
  }

  public async show(
    {params}: Request<core.ParamsDictionary | ParamsGetOffer>,
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

    this.ok(res, fillDTO(OfferExtendedResponse, offer));
  }

  public async update(
    {body, params}: Request<core.ParamsDictionary | ParamsGetOffer, Record<string, unknown>, UpdateOfferDTO>,
    res: Response
  ): Promise<void> {
    const offer = await this.offerService.updateById(params.offerId, body);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${params.offerId} not found.`,
        'OfferController'
      );
    }

    this.ok(res, fillDTO(OfferExtendedResponse, offer));
  }

  public async delete(
    {params}: Request<core.ParamsDictionary | ParamsGetOffer>,
    res: Response
  ): Promise<void> {
    const offer = await this.offerService.deleteById(params.offerId);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${params.offerId} not found.`,
        'OfferController'
      );
    }

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
