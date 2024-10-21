# Super Dynamic Server

A reusable, super-dynamic server + client template built with Express, Webpack, Gulp, and other tools for hosting single-page applications with the flexibility to have multipage applications. It supports vanilla JavaScript, React,  or other frameworks. 

## features 

It supports hot module reloading, SCSS compilation, and easy Node module imports on the front end.

# Create project with npx
To use this template for your own project see (https://www.npmjs.com/package/create-dynamic-server) to run

    npx create-dynamic-server my-app

## Features

- **Express** for serving the application.
- **Webpack** for bundling JavaScript and CSS.
- **Gulp** for automating SCSS compilation to CSS.
- **Hot Module Replacement** with Webpack for instant updates in development.
- **Support for Vanilla JavaScript, React, and other frameworks**.

## Getting Started

### 1. Clone the Repository

    git clone https://github.com/graciegould/super-dynamic-server.git
    cd super-dynamic-server
    npm install


### To Start the Development Server
    npm start

### To Build for Production
    npm run build

### Customization
To add additional SCSS files, create them in the src/scss directory and include them in main.scss.
To use React components, add your components in the src directory and update index.js to render them.
To add more Gulp tasks, edit gulpfile.js as needed.
Example Usage
You can modify src/index.js for your preferred framework:

Using Vanilla JavaScript
```
import './css/main.css';
document.getElementById('root').innerHTML = '<h1>Hello Entry File!</h1>';
```
Using React
```
import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/main.css';

const App = () => <h1>Hello, React!</h1>;

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(<App />);
```
