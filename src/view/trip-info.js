import {createTripTitleTemplate} from './trip-title.js';
import {createTripDatesTemplate} from './trip-dates.js';
import {createTripCostTemplate} from './trip-cost.js';

export const createTripInfoTemplate = (points) => {
  const towns = points.map((point) => point.destination.name);
  const startDates = points.map((point) => point.dateFrom);
  const finishDates = points.map((point) => point.dateTo);

  return `<section class="trip-main__trip-info  trip-info">
            <div class="trip-info__main">
              ${createTripTitleTemplate(towns)}
              ${createTripDatesTemplate(startDates, finishDates)}
            </div>
              ${createTripCostTemplate(points)}
          </section>`;
};
