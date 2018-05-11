import store from './AppStore';

describe("App Store",() => {
	it("Fetches raw country data", async () => {
		await store.fetchCountries();
		expect(store.countries_raw.length).not.toBe(0);
	});

	it("Fetches raw currency data", async () => {
		await store.fetchCurrencies();
		expect(store.currencies_raw.length).not.toBe(0);
	});

	it("Populates the countries options", async () => {
		await store.fetchCountries();
		store.populateCountries();
		expect(store.country_options.length).not.toBe(0);
	});

	it("Populates the currencies options", async () => {
		await store.fetchCurrencies();
		store.populateCurrencies();
		expect(store.currency_options.length).not.toBe(0);
	});

	it("Should return the correct currency for a country", async () => {
		await store.fetchCountries();
		await store.fetchCurrencies();
		store.matchCountriesWithCurrencies();
		const matchingCurrency = store.countries_and_currencies.filter(elem => elem.country === 'sweden');
		expect(matchingCurrency[0].currency).toEqual('SEK');
	});
})