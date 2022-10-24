import { MockData } from '../../types/mock-data.type.js';
import { OfferType } from '../../types/offer-type.enum.js';
import { generateRandomValue, getRandomItem, getRandomItems } from '../../utils/random.js';
import { OfferGeneratorInterface } from './offer-generator.interface.js';
import { IMAGES_COUNT, Price, GuestsCount, RoomsCount, OfferCity } from './const.js';
import { City } from '../../types/city.type.js';

export default class OfferGenerator implements OfferGeneratorInterface {
  constructor(private readonly mockData: MockData) {}

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const city = getRandomItem<City>(Object.values(OfferCity));
    const previewImage = `${generateRandomValue(1, 15)}.jpg`;
    const offerImages = this.mockData.images.sort(() => Math.random() - 0.5).slice(0, IMAGES_COUNT);
    const isPremium = generateRandomValue(0, 1).toString();
    const rating = generateRandomValue(1, 5, 1).toString();
    const type = getRandomItem(Object.values(OfferType));
    const rooms = generateRandomValue(RoomsCount.MIN, RoomsCount.MAX).toString();
    const guests = generateRandomValue(GuestsCount.MIN, GuestsCount.MAX).toString();
    const price = generateRandomValue(Price.MIN, Price.MAX).toString();
    const features = getRandomItems<string>(this.mockData.features);
    const name = getRandomItem<string>(this.mockData.users);
    const email = getRandomItem<string>(this.mockData.emails);
    const password = getRandomItem<string>(this.mockData.passwords);
    const isPro = generateRandomValue(0, 1).toString();
    const [latitude, longitude] = getRandomItem<[number, number]>(this.mockData.locations);

    return [
      title,
      description,
      city.name,
      previewImage,
      offerImages.join(';'),
      isPremium,
      rating,
      type,
      rooms,
      guests,
      price,
      features.join(';'),
      name,
      email,
      password,
      isPro,
      latitude,
      longitude
    ].join('\t');
  }
}
