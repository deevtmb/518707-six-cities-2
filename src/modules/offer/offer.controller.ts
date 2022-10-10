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
    this.addRoute({path: '/:offerId', method: HttpMethod.Get, handler: this.getOffer});
    this.addRoute({path: '/:offerId', method: HttpMethod.Put, handler: this.update});
    this.addRoute({path: '/:offerId', method: HttpMethod.Delete, handler: this.delete});
    this.addRoute({path: '/', method: HttpMethod.Post, handler: this.create});
    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
  }

  public async index(req: Request, res: Response): Promise<void> {
    const {count} = req.query;

    const offers = count ?
      await this.offerService.find(+count) :
      await this.offerService.find();

    const offerResponse = fillDTO(OfferResponse, offers);
    this.ok(res, offerResponse);
  }

  public async create(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDTO>,
    res: Response
  ): Promise<void> {
    const offer = await this.offerService.create(body);
    const offerResponse = fillDTO(OfferExtendedResponse, offer);
    this.created(res, offerResponse);
  }

  public async getOffer(req: Request, res: Response): Promise<void> {
    const {offerId} = req.params;
    const offer = await this.offerService.findById(offerId);
    const offerResponse = fillDTO(OfferExtendedResponse, offer);
    this.ok(res, offerResponse);
  }

  public async update(
    {body, params}: Request<Record<string, string>, Record<string, unknown>, UpdateOfferDTO>,
    res: Response
  ): Promise<void> {
    const {offerId} = params;
    const offer = await this.offerService.updateById(offerId, body);
    const offerResponse = fillDTO(OfferExtendedResponse, offer);
    this.ok(res, offerResponse);
  }

  public async delete(req: Request, res: Response): Promise<void> {
    const {offerId} = req.params;
    await this.offerService.deleteById(offerId);
    this.ok(res, `Offer with id ${offerId} has been deleted.`);
  }

  public async getPremium(
    {headers}: Request,
    res: Response
  ): Promise<void> {
    const cityName = headers['x-city-name'] as string;
    const offers = await this.offerService.findCityPremiumOffers(cityName);
    const offerResponse = fillDTO(OfferResponse, offers);
    this.ok(res, offerResponse);
  }

  public async getFavorites(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.findFavorites();
    const offerResponse = fillDTO(OfferResponse, offers);
    this.ok(res, offerResponse);
  }

  public async updateFavoriteStatus(
    {body, params}: Request<Record<string, string>, Record<string, unknown>, UpdateOfferDTO>,
    res: Response
  ): Promise<void> {
    const {offerId} = params;
    const offer = await this.offerService.updateById(offerId, body);
    const offerResponse = fillDTO(OfferResponse, offer);
    this.ok(res, offerResponse);
  }
}
