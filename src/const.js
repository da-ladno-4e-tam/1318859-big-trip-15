import dayjs from 'dayjs';

export const END_POINT = 'https://15.ecmascript.pages.academy/big-trip';
export const AUTHORIZATION = 'Basic daladno4etamschasvsyobudet';

export const NEW_POINT = {
  type: 'bus',
  basePrice: 1,
  dateFrom: dayjs().toDate(),
  dateTo: dayjs().toDate(),
  offers: [],
  destination: {},
  isFavorite: false,
};

export const SortType = {
  DEFAULT: 'default',
  PRICE: 'price',
  TIME: 'time',
};

export const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

export const MenuItem = {
  POINTS: 'POINTS',
  STATISTICS: 'STATISTICS',
};
