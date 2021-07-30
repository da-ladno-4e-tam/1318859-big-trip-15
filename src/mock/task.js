import dayjs from 'dayjs';

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const generateStartDate = () => {
  const maxDaysGap = 5;
  const daysGap = getRandomInteger(0, -maxDaysGap);

  return dayjs().add(daysGap, 'day').toDate();
};

const generateFinishDate = () => {
  const maxDaysGap = 5;
  const daysGap = getRandomInteger(0, maxDaysGap);

  return dayjs().add(daysGap, 'day').toDate();
};

export const generatePoint = () => {
  return {
    startDate: generateStartDate(),
    finishDate: generateFinishDate(),
  };
};
