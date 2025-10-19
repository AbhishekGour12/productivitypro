// src/app/providers.js
'use client'; 

import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store/store'; // Make sure this path is correct

export function Providers({ children }) {
  return (
    <Provider store={store}>
      {children}
      <Toaster position="top-right" />
    </Provider>
  );
}