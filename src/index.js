import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const countryValue = 'name,capital,population,flags,languages';

const inputEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
inputEl.addEventListener('input', debounce(onCountrySearch, DEBOUNCE_DELAY));

function onCountrySearch(evt) {
    const searchCountry = evt.target.value.trim();
    
    if (!searchCountry) {
        countryListEl.innerHTML = '';
    }

  function fetchCountries() {
    const url = `https://restcountries.com/v3.1/name/${searchCountry}?fields=${countryValue}`;
    return fetch(url).then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    });
  }

  fetchCountries()
    .then(countries => renderCountryList(countries))
    .catch(error =>
      Notiflix.Notify.failure('Oops, there is no country with that name')
  );
    
}

function renderCountryList(countries) {
  if (countries.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    console.log(countries.length);
  } else if (countries.length > 1 && countries.length < 10) {
    console.log(countries.length);
    const markup = countries
      .map(country => {
        return `
          <li>
            <p>${country.name.official}</p>
            <svg width="20" height="20">
                <use href="${country.flags.svg}"></use>
            </svg>
          </li>
      `;
      })
      .join('');

    console.log(markup);
    countryListEl.innerHTML = markup;
  } else if (countries.length === 1) {
    console.log(countries.length);
    const markup = countries
      .map(country => {
        return `
            <li>
              <p>${country.name.official}</p>
              <svg width="20" height="20">
                  <use href="${country.flags.svg}"></use>
              </svg>
              <p><span>Capital:</span> ${country.capital}</p>
              <p><span>Population:</span> ${country.population}</p>
              <p><span>Languages:</span> ${(country.languages = Object.values(
                country.languages
              ).join(', '))}</p>
            </li>
        `;
      })
      .join('');

    countryListEl.innerHTML = markup;
  }
}
