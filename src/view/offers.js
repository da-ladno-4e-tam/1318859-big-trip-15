import AbstractView from './abstract.js';

const createOffersTemplate = (offersList, checkedOffersList) => {
  const createFormOfferTemplate = (offer = {}, id) => {
    const isChecked = (checkedOffersList.map((offerItem) => offerItem.title).includes(offer.title)) ? 'checked' : '';
    const offerTitle = offer.title ? offer.title : '';
    const offerPrice = offer.price ? offer.price : 0;

    return `<div class="event__offer-selector">
                        <input class="event__offer-checkbox  visually-hidden" id="${id}" type="checkbox" name="${id}" ${isChecked}>
                        <label class="event__offer-label" for="${id}">
                          <span class="event__offer-title">${offerTitle}</span>
                          &plus;&euro;&nbsp;
                          <span class="event__offer-price">${offerPrice}</span>
                        </label>
                      </div>`;
  };
  const formOffersList = (offersList.length) ? offersList.map((offer) => createFormOfferTemplate(offer, offer.title )).join('') : '';
  return `<section class="event__section  event__section--offers">
                    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

                    <div class="event__available-offers">
                    ${formOffersList}
                    </div>
                  </section>`;
};

export default class Offers extends AbstractView {
  constructor(offersList, offers) {
    super();
    this._offersList = offersList;
    this._checkedOffers = offers;
  }

  getTemplate() {
    return createOffersTemplate(this._offersList, this._checkedOffers);
  }
}
