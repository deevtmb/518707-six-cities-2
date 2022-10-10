import 'reflect-metadata';
import { types } from '@typegoose/typegoose';
import { Container } from 'inversify';
import Application from './app/application.js';
import LoggerService from './common/logger/logger.service.js';
import { LoggerInterface } from './common/logger/logger.interface.js';
import ConfigService from './common/config/config.service.js';
import { ConfigInterface } from './common/config/config.interface.js';
import { Component } from './types/component.type.js';
import DatabaseService from './common/database-client/database.service.js';
import { DatabaseInterface } from './common/database-client/database.interface.js';
import UserService from './modules/user/user.service.js';
import { UserServiceInterface } from './modules/user/user-service.interface.js';
import { UserModel, UserEntity } from './modules/user/user.entity.js';
import OfferService from './modules/offer/offer.service.js';
import { OfferServiceInterface } from './modules/offer/offer-service.interface.js';
import { OfferEntity, OfferModel } from './modules/offer/offer.entity.js';
import ReviewService from './modules/review/review.service.js';
import { ReviewServiceInterface } from './modules/review/review-service.interface.js';
import { ReviewEntity, ReviewModel } from './modules/review/review.entity.js';
import OfferController from './modules/offer/offer.controller.js';
import { ControllerInterface } from './common/controller/controller.interface.js';
import ExceptionFilter from './common/errors/exception-filter.js';
import {ExceptionFilterInterface} from './common/errors/exception-filter.interface.js';
import UserController from './modules/user/user.controller.js';

const applicationContainer = new Container();

applicationContainer.bind<Application>(Component.Application).to(Application).inSingletonScope();
applicationContainer.bind<LoggerInterface>(Component.LoggerInterface).to(LoggerService).inSingletonScope();
applicationContainer.bind<ConfigInterface>(Component.ConfigInterface).to(ConfigService).inSingletonScope();
applicationContainer.bind<DatabaseInterface>(Component.DatabaseInterface).to(DatabaseService).inSingletonScope();
applicationContainer.bind<UserServiceInterface>(Component.UserServiceInterface).to(UserService).inSingletonScope();

applicationContainer.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);
applicationContainer.bind<OfferServiceInterface>(Component.OfferServiceInterface).to(OfferService);
applicationContainer.bind<types.ModelType<OfferEntity>>(Component.OfferModel).toConstantValue(OfferModel);
applicationContainer.bind<ReviewServiceInterface>(Component.ReviewServiceInterface).to(ReviewService);
applicationContainer.bind<types.ModelType<ReviewEntity>>(Component.ReviewModel).toConstantValue(ReviewModel);

applicationContainer.bind<ControllerInterface>(Component.OfferController).to(OfferController).inSingletonScope();
applicationContainer.bind<ControllerInterface>(Component.UserController).to(UserController).inSingletonScope();
applicationContainer.bind<ExceptionFilterInterface>(Component.ExceptionFilterInterface).to(ExceptionFilter).inSingletonScope();

const application = applicationContainer.get<Application>(Component.Application);

application.init();
