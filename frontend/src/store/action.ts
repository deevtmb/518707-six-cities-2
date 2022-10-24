import type { History } from 'history';
import type { AxiosInstance, AxiosError } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

import type { UserAuth, User, Offer, Comment, CommentAuth, FavoriteAuth, UserRegister, NewOffer } from '../types/types';
import { ApiRoute, AppRoute, HttpCode } from '../const';
import { Token } from '../utils';
import { adaptCommentToClient, adaptOfferToClient } from '../utils/adapters/adapters-to-client';
import OfferDTO from '../dto/offer.dto';
import CommentDTO from '../dto/comment.dto';
import { adaptCommentToServer, adaptOfferToServer } from '../utils/adapters/adapters-to-server';

type Extra = {
  api: AxiosInstance;
  history: History;
}

export const Action = {
  FETCH_OFFERS: 'offers/fetch',
  FETCH_OFFER: 'offer/fetch',
  POST_OFFER: 'offer/post-offer',
  EDIT_OFFER: 'offer/edit-offer',
  DELETE_OFFER: 'offer/delete-offer',
  FETCH_FAVORITE_OFFERS: 'offers/fetch-favorite',
  FETCH_PREMIUM_OFFERS: 'offers/fetch-premium',
  FETCH_COMMENTS: 'offer/fetch-comments',
  POST_COMMENT: 'offer/post-comment',
  POST_FAVORITE: 'offer/post-favorite',
  LOGIN_USER: 'user/login',
  LOGOUT_USER: 'user/logout',
  FETCH_USER_STATUS: 'user/fetch-status',
  REGISTER_USER: 'user/register'
};

export const fetchOffers = createAsyncThunk<Offer[], undefined, { extra: Extra }>(
  Action.FETCH_OFFERS,
  async (_, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<Offer[]>(ApiRoute.Offers);

    return data;
  });

export const fetchFavoriteOffers = createAsyncThunk<Offer[], undefined, { extra: Extra }>(
  Action.FETCH_FAVORITE_OFFERS,
  async (_, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<Offer[]>(ApiRoute.Favorite);

    return data;
  });

export const fetchOffer = createAsyncThunk<Offer, Offer['id'], { extra: Extra }>(
  Action.FETCH_OFFER,
  async (id, { extra }) => {
    const { api, history } = extra;

    try {
      const { data } = await api.get<OfferDTO>(`${ApiRoute.Offers}/${id}`);
      const offer = adaptOfferToClient(data);

      return offer;
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === HttpCode.NotFound) {
        history.push(AppRoute.NotFound);
      }

      return Promise.reject(error);
    }
  });

export const postOffer = createAsyncThunk<void, NewOffer, { extra: Extra }>(
  Action.POST_OFFER,
  async (newOffer, { extra }) => {
    const { api, history } = extra;
    const { data } = await api.post<Offer>(ApiRoute.Offers, adaptOfferToServer(newOffer));
    if (newOffer.previewImage) {
      const payload = new FormData();
      payload.append('previewImage', newOffer.previewImage);
      await api.post(`${ApiRoute.Offers}/${data.id}/preview`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    history.push(`${AppRoute.Property}/${data.id}`);
  });

export const editOffer = createAsyncThunk<void, Offer, { extra: Extra }>(
  Action.EDIT_OFFER,
  async (offer, { extra }) => {
    const { api, history } = extra;
    const { data } = await api.put<Offer>(`${ApiRoute.Offers}/${offer.id}`, adaptOfferToServer(offer));

    if (offer.previewImage) {
      const payload = new FormData();
      payload.append('previewImage', offer.previewImage);
      await api.post(`${ApiRoute.Offers}/${data.id}/preview`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    history.push(`${AppRoute.Property}/${data.id}`);
  });

export const deleteOffer = createAsyncThunk<void, string, { extra: Extra }>(
  Action.DELETE_OFFER,
  async (id, { extra }) => {
    const { api, history } = extra;
    await api.delete(`${ApiRoute.Offers}/${id}`);
    history.push(AppRoute.Root);
  });

export const fetchPremiumOffers = createAsyncThunk<Offer[], string, { extra: Extra }>(
  Action.FETCH_PREMIUM_OFFERS,
  async (cityName, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<Offer[]>(
      `${ApiRoute.Offers}${ApiRoute.Premium}`,
      {headers: {'X-City-Name': cityName}}
    );

    return data;
  });

export const fetchComments = createAsyncThunk<Comment[], Offer['id'], { extra: Extra }>(
  Action.FETCH_COMMENTS,
  async (id, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<CommentDTO[]>(`${ApiRoute.Comments}/${id}`);
    const comments = data.map(adaptCommentToClient);

    return comments;
  });

export const fetchUserStatus = createAsyncThunk<User, undefined, { extra: Extra }>(
  Action.FETCH_USER_STATUS,
  async (_, { extra }) => {
    const { api } = extra;

    try {
      const { data } = await api.get<User>(ApiRoute.Login);

      return data;
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === HttpCode.Unauthorized) {
        Token.drop();
      }

      return Promise.reject(error);
    }
  });

export const loginUser = createAsyncThunk<User, UserAuth, { extra: Extra }>(
  Action.LOGIN_USER,
  async ({ email, password }, { extra }) => {
    const { api, history } = extra;
    const { data } = await api.post<User & { token: string }>(ApiRoute.Login, { email, password });
    const { token } = data;

    Token.save(token);
    history.push(AppRoute.Root);

    return data;
  });

export const logoutUser = createAsyncThunk<void, undefined, { extra: Extra }>(
  Action.LOGOUT_USER,
  async (_, { extra }) => {
    // const { api } = extra;
    // await api.delete(ApiRoute.Logout);

    Token.drop();
  });

export const registerUser = createAsyncThunk<void, UserRegister, { extra: Extra }>(
  Action.REGISTER_USER,
  async ({ email, password, name, avatar, isPro }, { extra }) => {
    const { api, history } = extra;
    const { data } = await api.post<{id: string }>(ApiRoute.Register, { email, password, name, isPro: !!isPro });
    if (avatar) {
      const payload = new FormData();
      payload.append('avatar', avatar);
      await api.post(`${ApiRoute.Users}/${data.id}${ApiRoute.Avatar}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    history.push(AppRoute.Login);
  });


export const postComment = createAsyncThunk<Comment, CommentAuth, { extra: Extra }>(
  Action.POST_COMMENT,
  async (comment, { extra }) => {
    const { api } = extra;
    const {data} = await api.post<CommentDTO>(
      ApiRoute.Comments,
      adaptCommentToServer(comment)
    );

    return adaptCommentToClient(data);
  });

export const postFavorite = createAsyncThunk<Offer, FavoriteAuth, { extra: Extra }>(
  Action.POST_FAVORITE,
  async ({ id, status }, { extra }) => {
    const { api, history } = extra;

    try {
      const { data } = await api.put<OfferDTO>(`${ApiRoute.Favorite}/${id}`, {isFavorite: !!status});
      const offer = adaptOfferToClient(data);

      return offer;
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === HttpCode.Unauthorized) {
        history.push(AppRoute.Login);
      }

      return Promise.reject(error);
    }
  });

