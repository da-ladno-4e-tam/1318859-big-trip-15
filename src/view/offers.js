import AbstractView from './abstract.js';

const createOffersTemplate = (offers) => {
  const offersList = offers.offers ? offers.offers : {};
  const formOfferTemplate = (offer = {}) => {
    const isChecked = (offer.isAdded) ? 'checked' : '';
    const offerTitle = offer.title ? offer.title : '';
    const offerPrice = offer.price ? offer.price : 0;

    return `<div class="event__offer-selector">
                        <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage" ${isChecked}>
                        <label class="event__offer-label" for="event-offer-luggage-1">
                          <span class="event__offer-title">${offerTitle}</span>
                          &plus;&euro;&nbsp;
                          <span class="event__offer-price">${offerPrice}</span>
                        </label>
                      </div>`;
  };
  const formOffersList = offersList.map((offer) => formOfferTemplate(offer)).join('');

  return `<section class="event__section  event__section--offers">
                    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

                    <div class="event__available-offers">
                    ${formOffersList}
                    </div>
                  </section>`;
};

export default class Offers extends AbstractView {
  constructor(offers) {
    super();
    this._offers = offers;
  }

  getTemplate() {
    return createOffersTemplate(this._offers);
  }
}
