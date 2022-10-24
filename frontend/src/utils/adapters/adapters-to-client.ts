import CommentDTO from '../../dto/comment.dto';
import OfferDTO from '../../dto/offer.dto';
import { Comment, Offer } from '../../types/types';


export const adaptOfferToClient = (offer: OfferDTO): Offer => ({
  id: offer.id,
  price: offer.price,
  rating: offer.rating,
  title: offer.title,
  isPremium: offer.isPremium,
  isFavorite: offer.isFavorite,
  city: offer.city,
  location: offer.location,
  previewImage: offer.previewImage,
  type: offer.type,
  bedrooms: offer.rooms,
  description: offer.description,
  goods: offer.features,
  host: offer.user,
  images: offer.offerImages,
  maxAdults: offer.guests,
});

export const adaptCommentToClient = (comment: CommentDTO): Comment => ({
  id: comment.id,
  comment: comment.text,
  date: comment.createdAt,
  user: comment.user,
  rating: comment.rating,
});
