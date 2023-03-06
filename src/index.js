import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import fetchCountries from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const inputEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(onCountrySearch, DEBOUNCE_DELAY));

function onCountrySearch(evt) {
  const searchCountry = evt.target.value.trim();

  if (!searchCountry) {
    countryListEl.innerHTML = '';
    countryInfo.innerHTML = '';
  }

  fetchCountries(searchCountry)
    .then(countries => renderCountryMarkup(countries))
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      countryInfo.classList.add('invisible');
      countryListEl.classList.add('invisible');
    });
}

// Функції для створення та рендеру розмітки

function renderCountryMarkup(countries) {
  if (countries.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    countryInfo.classList.add('invisible');
    countryListEl.classList.add('invisible');
  } else if (countries.length > 1 && countries.length < 10) {
    renderCountryList(countries);
    countryInfo.classList.add('invisible');
    countryListEl.classList.remove('invisible');
  } else if (countries.length === 1) {
    renderCountryInfo(countries);
    countryInfo.classList.remove('invisible');
    countryListEl.classList.add('invisible');
  }
}

function renderCountryList(countries) {
  const markup = countries
    .map(country => {
      return `
          <li class="country-item">
            <p>${country.name.official}</p>
            <img src="${country.flags.svg}" width="25" height="auto"/>
          </li>
      `;
    })
    .join('');

  countryListEl.innerHTML = markup;
}

function renderCountryInfo(countries) {
  const markup = countries
    .map(({ name, flags, capital, population, languages }) => {
      return `
              <div class="container">
              <h2>${name.official}</h2>
              <img src="${flags.svg}" width="30" height="auto"/>
              </div>
              <ul class="info-list">
              <li class="info-item"><span class="info-item_decor">Capital:</span> ${capital}</li>
              <li class="info-item"><span class="info-item_decor">Population:</span> ${population}</li>
              <li class="info-item"><span class="info-item_decor">Languages:</span> ${(languages =
                Object.values(languages).join(', '))}</li>
              </ul>
        `;
    })
    .join('');

  countryInfo.innerHTML = markup;
}
