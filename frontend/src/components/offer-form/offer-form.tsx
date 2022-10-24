import { ChangeEvent, FormEvent, useCallback, useState } from 'react';
import Select from 'react-select';

import { City, NewOffer, Offer } from '../../types/types';

import LocationPicker from '../location-picker/location-picker';
import { CITIES, CityLocation, GOODS, TYPES } from '../../const';
import { capitalize } from '../../utils';

enum FormFieldName {
  title = 'title',
  description = 'description',
  cityName = 'cityName',
  previewImage = 'previewImage',
  isPremium = 'isPremium',
  type = 'type',
  bedrooms = 'bedrooms',
  maxAdults = 'maxAdults',
  price = 'price',
  good = 'good-',
}

const getGoods = (
  entries: IterableIterator<[string, FormDataEntryValue]>
): string[] => {
  const chosenGoods: string[] = [];
  for (const entry of entries) {
    if (entry[0].startsWith(FormFieldName.good)) {
      chosenGoods.push(entry[0].slice(5));
    }
  }
  return chosenGoods;
};

const getCity = (cityName: FormDataEntryValue | null): City => {
  const name = String(cityName);
  if (cityName && CITIES.includes(name)) {
    return {
      name,
      location: CityLocation[name],
    };
  }

  return { name: CITIES[0], location: CityLocation[CITIES[0]] };
};

type OfferFormProps<T> = {
  offer: T;
  onSubmit: (offerData: T) => void;
};

const OfferForm = <T extends Offer | NewOffer>({
  offer,
  onSubmit,
}: OfferFormProps<T>): JSX.Element => {
  const {
    title,
    description,
    city,
    previewImage,
    isPremium,
    type,
    bedrooms,
    maxAdults,
    price,
    goods: chosenGoods,
    location,
  } = offer;
  const [chosenLocation, setChosenLocation] = useState(location);
  const [chosenCity, setChosenCity] = useState(city);

  const [image, setImage] = useState<File | undefined>();

  const handleImageUpload = (evt: ChangeEvent<HTMLInputElement>) => {
    if (!evt.target.files) {
      return;
    }
    setImage(evt.target.files[0]);
  };

  const handleCityChange = (value: keyof typeof CityLocation) => {
    setChosenCity(getCity(value));
    setChosenLocation(CityLocation[value]);
  };

  const handleLocationChange = useCallback(
    ({ lat, lng }: { lat: number; lng: number }) => {
      setChosenLocation({ latitude: lat, longitude: lng });
    },
    []
  );

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const preview = formData.get(FormFieldName.previewImage) as File;
    const data = {
      ...offer,
      title: formData.get(FormFieldName.title),
      description: formData.get(FormFieldName.description),
      city: getCity(formData.get(FormFieldName.cityName)),
      previewImage: preview.name ? preview : '',
      // previewImage: formData.get(FormFieldName.previewImage) ?? '',
      isPremium: Boolean(formData.get(FormFieldName.isPremium)),
      type: formData.get(FormFieldName.type),
      bedrooms: Number(formData.get(FormFieldName.bedrooms)),
      maxAdults: Number(formData.get(FormFieldName.maxAdults)),
      price: Number(formData.get(FormFieldName.price)),
      goods: getGoods(formData.entries()),
      location: chosenLocation,
    };

    onSubmit(data);
  };

  return (
    <form
      className="form offer-form"
      action="#"
      method="post"
      onSubmit={handleFormSubmit}
    >
      <fieldset className="title-fieldset">
        <div className="form__input-wrapper">
          <label htmlFor="title" className="title-fieldset__label">
            Title
          </label>
          <input
            className="form__input title-fieldset__text-input"
            placeholder="Title"
            name={FormFieldName.title}
            id="title"
            required
            defaultValue={title}
          />
        </div>
        <div className="title-fieldset__checkbox-wrapper">
          <input
            className="form__input"
            type="checkbox"
            name={FormFieldName.isPremium}
            id="isPremium"
            defaultChecked={isPremium}
          />
          <label htmlFor="isPremium" className="title-fieldset__checkbox-label">
            Premium
          </label>
        </div>
      </fieldset>
      <div className="form__input-wrapper">
        <label htmlFor="description" className="offer-form__label">
          Description
        </label>
        <textarea
          className="form__input offer-form__textarea"
          placeholder="Description"
          name={FormFieldName.description}
          id="description"
          required
          defaultValue={description}
        />
      </div>

      <div
        className="login__input-wrapper form__input-wrapper register-form__avatar-wrapper"
      >
        <label htmlFor="previewImage" className="offer-form__label">
          Preview Image
        </label>
        <input
          className="visually-hidden"
          type="file"
          name="previewImage"
          id="previewImage"
          accept="image/png, image/jpeg"
          onChange={handleImageUpload}
        />
        <label htmlFor="previewImage" className="register-form__avatar-label">
          {image || previewImage ? (
            <img
              src={`${image ? URL.createObjectURL(image) : previewImage}`}
              alt={title}
              className="register-form__avatar-preview"
              style={{
                borderRadius: '0',
                width: 'auto',
                height: 'auto',
                minWidth: '200px',
                maxHeight: '200px'
              }}
            />
          ) : (
            'Upload Preview Image'
          )}
        </label>
      </div>
      <fieldset className="type-fieldset">
        <div className="form__input-wrapper">
          <label htmlFor="type" className="type-fieldset__label">
            Type
          </label>
          <Select
            className="type-fieldset__select"
            classNamePrefix="react-select"
            name={FormFieldName.type}
            id="type"
            defaultValue={{ value: type, label: capitalize(type) }}
            options={TYPES.map((typeItem) => ({
              value: typeItem,
              label: capitalize(typeItem),
            }))}
          />
        </div>
        <div className="form__input-wrapper">
          <label htmlFor="price" className="type-fieldset__label">
            Price
          </label>
          <input
            className="form__input type-fieldset__number-input"
            type="number"
            placeholder="100"
            name={FormFieldName.price}
            id="price"
            defaultValue={price}
          />
        </div>
        <div className="form__input-wrapper">
          <label htmlFor="bedrooms" className="type-fieldset__label">
            Bedrooms
          </label>
          <input
            className="form__input type-fieldset__number-input"
            type="number"
            placeholder="1"
            name={FormFieldName.bedrooms}
            id="bedrooms"
            required
            step={1}
            defaultValue={bedrooms}
          />
        </div>
        <div className="form__input-wrapper">
          <label htmlFor="maxAdults" className="type-fieldset__label">
            Max adults
          </label>
          <input
            className="form__input type-fieldset__number-input"
            type="number"
            placeholder="1"
            name={FormFieldName.maxAdults}
            id="maxAdults"
            required
            step={1}
            defaultValue={maxAdults}
          />
        </div>
      </fieldset>
      <fieldset className="goods-list">
        <h2 className="goods-list__title">Goods</h2>
        <ul className="goods-list__list">
          {GOODS.map((good) => (
            <li key={good} className="goods-list__item">
              <input
                type="checkbox"
                id={good}
                name={`${FormFieldName.good}${good}`}
                defaultChecked={chosenGoods.includes(good)}
              />
              <label className="goods-list__label" htmlFor={good}>
                {good}
              </label>
            </li>
          ))}
        </ul>
      </fieldset>
      <div className="form__input-wrapper location-picker">
        <label htmlFor="cityName" className="location-picker__label">
          Location
        </label>
        <Select
          className="location-picker__select"
          classNamePrefix="react-select"
          name={FormFieldName.cityName}
          id="cityName"
          defaultValue={{ value: city.name, label: city.name }}
          options={CITIES.map((cityItem) => ({
            value: cityItem,
            label: cityItem,
          }))}
          onChange={(evt) => {
            if (evt) {
              handleCityChange(evt.value);
            }
          }}
        />
      </div>
      <LocationPicker
        city={chosenCity}
        onChange={handleLocationChange}
        location={chosenLocation}
      />
      <button className="form__submit button" type="submit">
        Save
      </button>
    </form>
  );
};

export default OfferForm;
