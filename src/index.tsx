import React from 'react';
import ReactDOM from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import i18n from './localization';
import './index.scss';
import App from './App';
import TitleRenderer from './components/TitleContext';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import 'semantic-ui-less/semantic.less';

// We have to disable the following "errors", because they are actually warnings.
// The components that throw them work fine, so to keep the console clean from errors,
// we ignore these.
// const backup = console.error;
// console.error = function ignoreErrors(...rest: any[]) {
//   const supressedErrors: string[] = [
//     // 'Invalid prop `text` of type `object` supplied to `Dropdown`, expected `string`.',
//   ];
//
//   if (!supressedErrors.some((entry: any) => rest.includes(entry))) {
//     backup.apply(console, rest);
//   }
// };

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <I18nextProvider i18n={i18n}>
      <TitleRenderer>
        <App />
      </TitleRenderer>
    </I18nextProvider>,
);
