import 'whatwg-fetch'; // Fetch polyfill
import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './routes';

import './resources/styles/main.scss';
import './resources/scripts/object_polyfill.js';

const renderIt = Component => ReactDOM.render( // eslint-disable-line react/no-render-return-value
  <Component />,
  document.getElementById('root'),
);

// first render
renderIt(Routes);

// on hot changes, run renter function
if (module.hot) module.hot.accept('./routes', () => renderIt(Routes));
