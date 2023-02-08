import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
// import './index.css';

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// @ts-expect-error We haven't updated the globalThis type to include this custom property
window.Pusher = Pusher;
// @ts-expect-error We haven't updated the globalThis type to include this custom property
window.Echo = new Echo({
    broadcaster: 'pusher',
    // @ts-expect-error
    key: window.Laravel.pusher['appKey'],
    // @ts-expect-error
    cluster: window.Laravel.pusher['cluster'],
    // @ts-expect-error
    forceTLS: window.Laravel.pusher['encrypted'],
});

const root = ReactDOM.createRoot(
    document.getElementById('map-root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
