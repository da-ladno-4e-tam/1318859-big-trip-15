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
          price: 190,
        },
        {
          title: 'Choose the radio station',
          price: 30,
        },
        {
          title: 'Choose temperature',
          price: 170,
        },
        {
          title: 'Drive quickly, I\'m in a hurry',
          price: 100,
        },
        {
          title: 'Drive slowly',
          price: 110,
        }
      ],
  },
  'bus': {
    type: 'bus',
    offers:
      [
        {
          title: 'Infotainment system',
          price: 50,
        },
        {
          title: 'Order meal',
          price: 100,
        },
        {
          title: 'Choose seats',
          price: 190,
        },
      ],
  },
  'train': {
    type: 'train',
    offers:
      [
        {
          title: 'Book a taxi at the arrival point',
          price: 110,
        },
        {
          title: 'Order a breakfast',
          price: 80,
        },
        {
          title: 'Wake up at a certain time',
          price: 140,
        }
      ],
  },
  'ship': {
    type: 'ship',
    offers:
      [
        {
          title: 'Choose meal',
          price: 130,
        },
        {
          title: 'Choose seats',
          price: 160,
        },
        {
          title: 'Upgrade to comfort class',
          price: 170,
        },
        {
          title: 'Upgrade to business class',
          price: 150,
        },
        {
          title: 'Add luggage',
          price: 100,
        },
        {
          title: 'Business lounge',
          price: 40,
        }
      ],
  },
  'drive': {
    type: 'drive',
    offers:
      [
        {
          title: 'Choose comfort class',
          price: 110,
        },
        {
          title: 'Choose business class',
          price: 180,
        }
      ],
  },
  'flight': {
    type: 'flight',
    offers:
      [
        {
          title: 'Choose meal',
          price: 120,
        },
        {
          title: 'Choose seats',
          price: 90,
        },
        {
          title: 'Upgrade to comfort class',
          price: 120,
        },
        {
          title: 'Upgrade to business class',
          price: 120,
        },
        {
          title: 'Add luggage',
          price: 170,
        },
        {
          title: 'Business lounge',
          price: 160,
        }
      ],
  },
  'check-in': {
    type: 'check-in',
    offers:
      [
        {
          title: 'Choose the time of check-in',
          price: 70,
        },
        {
          title: 'Choose the time of check-out',
          price: 190,
        },
        {
          title: 'Add breakfast',
          price: 110,
        },
        {
          title: 'Laundry',
          price: 140,
        },
        {
          title: 'Order a meal from the restaurant',
          price: 30,
        }
      ],
  },
  'sightseeing': {
    type: 'sightseeing',
    offers:
      [],
  },
  'restaurant': {
    type: 'restaurant',
    offers:
      [
        {
          title: 'Choose live music',
          price: 150,
        },
        {
          title: 'Choose VIP area',
          price: 70,
        }
      ],
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
