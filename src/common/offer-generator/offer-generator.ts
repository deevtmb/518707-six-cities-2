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
    const previewImage = getRandomItem<string>(this.mockData.images);
    const offerImages = Array.from({length: IMAGES_COUNT}, () => getRandomItem<string>(this.mockData.images));
    const isPremium = generateRandomValue(0, 1).toString();
    const isFavorite = generateRandomValue(0, 1).toString();
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
      isFavorite,
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
