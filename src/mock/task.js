import dayjs from 'dayjs';
import {getRandomInteger} from '../utils/common.js';

const POINT_COUNT = 5;

export const types = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
export const towns = ['Chamonix', 'Amsterdam', 'Geneva', 'London', 'Paris', 'Oslo', 'Bratislava'];
const typesOffers = {
  'taxi': {
    type: 'taxi',
    offers:
      [
        {
          title: 'Upgrade to a business class',
          price: 120,
        },
        {
          title: 'Choose the radio station',
          price: 60,
        },
        {
          title: 'let me beep!!',
          price: 200,
        },
        {
          title: 'Open a window',
          price: 20,
        },
      ],
  },
  'bus': {
    type: 'bus',
    offers:
      [
        {
          title: 'Sing favorite songs all the way',
          price: 20,
        },
        {
          title: 'let me beep!!',
          price: 300,
        },
        {
          title: 'Open a window',
          price: 50,
        },
      ],
  },
  'train': {
    type: 'train',
    offers:
      [
        {
          title: 'get drunk in the dining car',
          price: 60,
        },
        {
          title: 'Open a window',
          price: 20,
        },
      ],
  },
  'ship': {
    type: 'ship',
    offers:
      [],
  },
  'drive': {
    type: 'drive',
    offers:
      [
        {
          title: 'Sing favorite songs all the way',
          price: 120,
        },
      ],
  },
  'flight': {
    type: 'flight',
    offers:
      [
        {
          title: 'Upgrade to a business class',
          price: 120,
        },
        {
          title: 'Choose the radio station',
          price: 60,
        },
        {
          title: 'let me beep!!',
          price: 200,
        },
        {
          title: 'Open a window',
          price: 1000000,
        },
        {
          title: 'play catch-up with stewardesses',
          price: 100,
        },
      ],
  },
  'check-in': {
    type: 'check-in',
    offers:
      [],
  },
  'sightseeing': {
    type: 'sightseeing',
    offers:
      [],
  },
  'restaurant': {
    type: 'restaurant',
    offers:
      [],
  },
};
const destinationDescriptions = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.',
];

const generateType = () => types[getRandomInteger(0, types.length - 1)];
const generateTown = () => towns[getRandomInteger(0, towns.length - 1)];
const generateBasePrice = () => getRandomInteger(2, 20) * 10;
const isAddedOffer = () => Boolean(getRandomInteger(0, 1));
const generateStartDate = () => {
  const maxDaysGap = 5;
  const maxHoursGap = 12;
  const MinutesGap = (getRandomInteger(0, -maxDaysGap) * 24 + getRandomInteger(0, -maxHoursGap)) * 60 + getRandomInteger(0, -60);
  return dayjs().add(MinutesGap, 'minute');
};
const generateTripDuration = () => (getRandomInteger(10, 120));
const getRandomImageSrc = () => `http://picsum.photos/248/152?r=${getRandomInteger(1, 99999999)}`;
const getRandomImageDesc = () => destinationDescriptions[getRandomInteger(0, destinationDescriptions.length - 1)];
const generateImage = () => (
  {
    src: getRandomImageSrc(),
    description: getRandomImageDesc(),
  }
);
const getRandomPictures = () => new Array(getRandomInteger(0, 5)).fill().map(() => generateImage());
const getRandomDestinationDescription = () => new Array(getRandomInteger(0, 5)).fill().map(() => getRandomImageDesc()).join(' ');
const generateDestination = () => (
  {
    description: getRandomDestinationDescription(),
    name: generateTown(),
    pictures: getRandomPictures(),
  }
);

const generateOffersList = (offerType) => {
  const typeOffers = typesOffers[offerType];
  typeOffers.offers.forEach((offer) => offer.isAdded = isAddedOffer());

  return typeOffers;
};
let currentId = 0;

const generatePoint = () => {
  const type = generateType();
  const dateFrom = generateStartDate();
  return {
    type,
    id: ++currentId,
    basePrice: generateBasePrice(),
    dateFrom: dateFrom.toDate(),
    dateTo: dateFrom.add(generateTripDuration(), 'minute').toDate(),
    offers: generateOffersList(type),
    destination: generateDestination(),
    isFavorite: Boolean(getRandomInteger(0, 1)),
  };
};

export const getData = () => new Array(POINT_COUNT).fill().map(generatePoint).sort((a, b) => a.dateFrom.getTime() - b.dateFrom.getTime());
