import dayjs from 'dayjs';

export const createTripDatesTemplate = (startDates, finishDates) => {
  const tripStart = startDates.sort((a, b) => a.getTime() - b.getTime())[0];
  const tripFinish = finishDates.sort((a, b) => a.getTime() - b.getTime())[finishDates.length - 1];
  const tripStartFormat = 'MMM DD';
  const tripFinishFormat = (dayjs(tripStart).month() === dayjs(tripFinish).month()) ? 'DD' : 'MMM DD';

  return `<p class="trip-info__dates">${dayjs(tripStart).format(tripStartFormat)}&nbsp;&mdash;&nbsp;${dayjs(tripFinish).format(tripFinishFormat)}</p>`;
};
