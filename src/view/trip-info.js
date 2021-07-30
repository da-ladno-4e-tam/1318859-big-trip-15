import {createTripTitleTemplate} from './trip-title.js';
import {createTripDatesTemplate} from './trip-dates.js';
import {createTripCostTemplate} from './trip-cost.js';

export const createTripInfoTemplate = () => (
  `<section class="trip-main__trip-info  trip-info">
            <div class="trip-info__main">
              ${createTripTitleTemplate()}
              ${createTripDatesTemplate()}
            </div>
              ${createTripCostTemplate()}
          </section>`
);
