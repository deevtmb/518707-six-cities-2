import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { errorHandle } from './error-handler';

import { Token } from './utils';

const BACKEND_URL = 'http://localhost:4000';
const REQUEST_TIMEOUT = 5000;

export const createAPI = (): AxiosInstance => {
  const api = axios.create({
    baseURL: BACKEND_URL,
    timeout: REQUEST_TIMEOUT,
  });

  api.interceptors.request.use(
    (config: AxiosRequestConfig) => {
      const token = Token.get();

      if (token) {
        config.headers['x-token'] = token;
        config.headers['Authorization'] = `Bearer ${Token.get()}`;
      }

      return config;
    }
  );

  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      errorHandle(error);

      return Promise.reject(error);
    }
  );

  return api;
};
