import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './Components/App';
import registerServiceWorker from './registerServiceWorker';
import store from './Components/AppStore';

ReactDOM.render(<App store={store} />, document.getElementById('root'));
registerServiceWorker();
