import React from 'react';
import ReactDOM from 'react-dom/client';
// import './index.css';
import { Map } from './Map';

const root = ReactDOM.createRoot(
    document.getElementById('map-root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <Map />
    </React.StrictMode>
);
