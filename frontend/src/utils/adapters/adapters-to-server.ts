import CreateOfferDTO from '../../dto/create-offer.dto';
import PostCommentDTO from '../../dto/post-comment.dto';
import { CommentAuth, NewOffer } from '../../types/types';
import { getOfferImages } from '../../utils';

export const adaptCommentToServer = (comment: CommentAuth): PostCommentDTO => ({
  text: comment.comment,
  rating: comment.rating,
  offerId: comment.id
});

export const adaptOfferToServer = (offer: NewOffer): CreateOfferDTO => ({
  title: offer.title,
  description: offer.description,
  city: offer.city,
  previewImage: '111',
  offerImages: getOfferImages(),
  isPremium: !!offer.isPremium,
  isFavorite: false,
  type: offer.type,
  rooms: offer.bedrooms,
  guests: offer.maxAdults,
  price: offer.price,
  features: offer.goods,
  location: offer.location
});
