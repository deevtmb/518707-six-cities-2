import { City } from '../../types/city.type.js';

export const IMAGES_COUNT = 6;

export const Price = {
  MIN: 100,
  MAX: 100000,
};

export const GuestsCount = {
  MIN: 1,
  MAX: 8,
};

export const RoomsCount = {
  MIN: 1,
  MAX: 8,
};

export const Rating = {
  MIN: 1,
  MAX: 5,
  DECIMAL_PLACES: 1,
};

export const DaysDiffRange = {
  MIN: 1,
  MAX: 100,
};

export const OfferCity: {[key: string]: City} = {
  Paris: {
    name: 'Paris',
    location: {
      latitude: 48.85661,
      longitude: 2.351499
    }
  },
  Cologne: {
    name: 'Cologne',
    location: {
      latitude: 50.938361,
      longitude: 6.959974
    }
  },
  Brussels: {
    name: 'Brussels',
    location: {
      latitude: 50.846557,
      longitude: 4.351697
    }
  },
  Amsterdam: {
    name: 'Amsterdam',
    location: {
      latitude: 52.370216,
      longitude: 4.89516
    }
  },
  Hamburg: {
    name: 'Hamburg',
    location: {
      latitude: 53.550341,
      longitude: 10.000654
    }
  },
  Dusseldorf: {
    name: 'Dusseldorf',
    location: {
      latitude: 51.225402,
      longitude: 6.776314
    }
  },
};
