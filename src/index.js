import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/main.css';

const App = () => <div className='test'>Welcome to you super dynamic boiler plate</div>;
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(<App />);

if (module.hot) {
  module.hot.accept();
}
