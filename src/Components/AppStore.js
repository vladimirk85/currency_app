import { observable, action, configure, reaction } from 'mobx';
import { serializable, deserialize, serialize } from 'serializr';

configure({ enforceActions: true });

class AppStore{
	@observable @serializable selected_country = '';
	@observable @serializable selected_currency = '';
	@observable countries_raw = [];
	@observable currencies_raw = [];
	@observable country_options = [];
	@observable currency_options = [];
	@observable countries_and_currencies = [];
	@observable serialized_state;

	constructor(){
		reaction(() => this.selected_country, () => {
			this.serializeState();
		});
		reaction(() => this.selected_currency, () => {
			this.serializeState();
		});
	}

	async fetchCountries()
	{
		const countriesRequest = await fetch('https://api.pleasepay.co.uk/countries');
		const countries = await countriesRequest.json();
		const countriesArr = Array.from(countries.items);
		this.setRawCountries(countriesArr);
	};

	async fetchCurrencies()
	{
		const currenciesRequest = await fetch('https://api.pleasepay.co.uk/currencies');
	    const currencies = await currenciesRequest.json();
	    const currenciesArr = Array.from(currencies.items);
	    this.setRawCurrencies(currenciesArr);
	};

	@action populateCountries()
	{
		const countriesArr = this.countries_raw.peek();
		countriesArr.forEach(country => {
			this.country_options.push({value: country.translations.en.toLowerCase(), label: country.translations.en})
		})
	};

	@action populateCurrencies()
	{
		const currenciesArr = this.currencies_raw.peek();
	    currenciesArr.forEach(currency => {
			this.currency_options.push({value: currency.translations.en.toLowerCase(), label: currency.translations.en})
		})
	};

	@action matchCountriesWithCurrencies()
	{
		const countriesArr = this.countries_raw.peek();
		const currenciesArr = this.currencies_raw.peek();
		countriesArr.forEach(country => {
	      const matchingCurrency = currenciesArr.filter(currency => currency.translations.en === country.preferredCurrency.name);
	      const currency = matchingCurrency[0].translations.en;
	      this.countries_and_currencies.push({country: country.translations.en.toLowerCase(), currency});
	    })
	};

	@action updateCountry = country => this.selected_country = country;

	@action updateCurrency = currency => this.selected_currency = currency;

	@action	setRawCountries = countries => this.countries_raw = countries;

	@action	setRawCurrencies = currencies => this.currencies_raw = currencies;

	@action getCurrencyByCountry = country => {
		const matchingCurrency = this.countries_and_currencies.filter(elem => elem.country === country);
		this.updateCurrency(matchingCurrency[0].currency);
	}

	@action serializeState()
	{
		const dropdownstate = deserialize(AppStore, {
			selected_country: this.selected_country,
			selected_currency: this.selected_currency.toLowerCase()
		});
		this.serialized_state = serialize(dropdownstate);
		localStorage.setItem("dropdownstate",JSON.stringify(this.serialized_state));
	}
}

export default new AppStore();