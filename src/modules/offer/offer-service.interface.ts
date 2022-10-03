import { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import CreateOfferDTO from './dto/create-offer.dto.js';
import UpdateOfferDTO from './dto/update-offer.dto.js';

export interface OfferServiceInterface {
  create(dto: CreateOfferDTO): Promise<DocumentType<OfferEntity>>
  find(): Promise<DocumentType<OfferEntity>[]>
  findById(offerId: string): Promise<DocumentType<OfferEntity> | null>
  updateById(offerId: string, dto: UpdateOfferDTO): Promise<DocumentType<OfferEntity> | null>
  deleteById(offerId: string): Promise <DocumentType<OfferEntity> | null>
  findFavorites(): Promise <DocumentType<OfferEntity>[] | null>
  findCityPremiumOffers(cityName: string): Promise <DocumentType<OfferEntity>[] | null>
}
