import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import './index.css';
import configureStore from './store';
import {restoreCSRF, csrfFetch} from './store/csrf';
import * as sessionActions from './store/session';
import { Modal, ModalProvider } from "./context/Modal";

const store = configureStore();

if(import.meta.env.MODE !== 'production'){
  restoreCSRF()
  window.store = store
  window.csrfFetch = csrfFetch;
  window.sessionActions = sessionActions;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ModalProvider>
      <Provider store={store}>
        <App />
        <Modal/>
      </Provider>
    </ModalProvider>
  </React.StrictMode>
);
