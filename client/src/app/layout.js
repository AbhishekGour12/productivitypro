'use client';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store/store';
import "./globals.css";
import "./common.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          {children}
          <Toaster position="top-right" />
        </Provider>
      </body>
    </html>
  );
}
