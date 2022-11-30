import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import {fetchCountries} from "../src/fetchCountries";

const DEBOUNCE_DELAY = 300;

const refs = {
    input: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
}

refs.input.addEventListener('input', debounce(entryСountry, DEBOUNCE_DELAY));

function entryСountry (e) {
    let inputLetter = e.target.value.trim();

    if (inputLetter.length === 0) {
        refs.countryList.innerHTML = '';
        refs.countryInfo.innerHTML = '';
        refs.input.removeEventListener('input', e);
        return;
    };

    console.log(e.target.value);
    console.log(fetchCountries(inputLetter));
    fetchCountries(inputLetter)
    .then(arrayCountries => {        
        renderMarcupCountry(arrayCountries);
    })
    .catch(error => {
        Notiflix.Notify.failure('Oops, there is no country with that name');
        refs.countryList.innerHTML = '';
        refs.countryInfo.innerHTML = '';
    });    
}

function renderMarcupCountry (array) {
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
    refs.countryList.classList.remove("one-country");
    const numberOfCountriesFound = array.length;
    if (numberOfCountriesFound > 10) {
        Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");        
    } else if (numberOfCountriesFound === 1) {
        createMarcupListCountry(array);
        refs.countryList.classList.add("one-country");        
        createMarcupInfoCountry (array);
    } else {        
        createMarcupListCountry(array);        
    };

    function createMarcupListCountry (array) {
        const listCountry =  array.map( arr =>        
            (`<li class="list-countries"> 
                <img src="${arr.flags.svg}" alt="flag ${arr.name.official}"> 
                <p>${arr.name.official}</p> 
            </li>`))
            .join("");

        refs.countryList.insertAdjacentHTML("beforeend", listCountry);
    }

    function createMarcupInfoCountry (array) {
        const infoCountry =  array.map( arr =>             
            (`<p><b>Capital: </b>${arr.capital}</p>
            <p><b>Population: </b>${arr.population}</p>
            <p><b>Languages: </b>${Object.values(arr.languages)}</p>`
            ))
        .join();
        refs.countryInfo.insertAdjacentHTML("beforeend", infoCountry);
    }
}
