class UserResponse {
  public id!: string;
  public name!: string;
  public email!: string;
  public avatar!: string;
  public isPro!: boolean;
}

type Location = {
  latitude: number;
  longitude: number;
}

type City = {
  name: string;
  location: Location;
}

enum OfferType {
  Apartment = 'apartment',
  House = 'house',
  Room = 'room',
  Hotel = 'hotel'
}

enum OfferFeature {
  Breakfast = 'Breakfast',
  AC = 'Air conditioning',
  LaptopDesk = 'Laptop friendly workspace',
  BabySeat = 'Baby seat',
  Washer = 'Washer',
  Towels = 'Towels',
  Fridge = 'Fridge',
}

export default class OfferDTO {
  public id!: string;

  public title!: string;

  public description!: string;

  public city!: City;

  public previewImage!: string;

  public offerImages!: string[];

  public isPremium!: boolean;

  public isFavorite!: boolean;

  public rating!: number;

  public type!: OfferType;

  public rooms!: number;

  public guests!: number;

  public price!: number;

  public features!: OfferFeature[];

  public user!: UserResponse;

  public reviewsCnt!: number;

  public location!: Location;

  public createdAt!: Date;
}
