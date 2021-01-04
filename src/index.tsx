import React from 'react';
import ReactDOM from 'react-dom';
import TimeAgo from 'javascript-time-ago';
import './i18n';
import en from 'javascript-time-ago/locale/en';
import nl from 'javascript-time-ago/locale/nl';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'semantic-ui-css/semantic.min.css';

TimeAgo.addLocale(en);
TimeAgo.addLocale(nl);
TimeAgo.setDefaultLocale('en-US');

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
