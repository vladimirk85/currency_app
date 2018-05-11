import { observer } from 'mobx-react';
import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import './App.css';

@observer
class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      selected_country: '',
      selected_currency: ''
    }
  }
  async componentDidMount(){
    const {store} = this.props;
    await store.fetchCountries();
    await store.fetchCurrencies();
    store.populateCountries();
    store.populateCurrencies();
    store.matchCountriesWithCurrencies();
    if(localStorage.getItem("dropdownstate"))
    {
      const { selected_country, selected_currency } = JSON.parse(localStorage.getItem("dropdownstate"));
      this.setState({selected_country,selected_currency});
    }
  }
  handleChange(e){
    const {store} = this.props;
    if(e)
      store.updateCountry(e.value);
      store.getCurrencyByCountry(e.value);
      this.setState(
      {
        selected_country:store.selected_country.toLowerCase(),
        selected_currency: store.selected_currency.toLowerCase()
      });
  }
  render() {
    return (
      <div className="App">
        <div className="dropdown-container">
          <label htmlFor="country" className="label country-label">Country</label>
          <Select
            name="country"
            value={this.state.selected_country}
            onChange={this.handleChange.bind(this)}
            options={this.props.store.country_options.peek()}
            clearable={false}
            className="dropdown-field"
          />
          <label htmlFor="currency" className="label currency-label">Currency</label>
          <Select
            name="currency"
            value={this.state.selected_currency}
            options={this.props.store.currency_options.peek()}
            clearable={false}
            className="dropdown-field"
          />
        </div>
      </div>
    );
  }
}

export default App;
