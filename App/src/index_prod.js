import React from 'react';
import ReactDOM from 'react-dom';
import App  from './containers/App';
import { createStore, applyMiddleware} from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga'
import reducers from './reducers';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();


const enhancer = applyMiddleware(sagaMiddleware);
const store = createStore(
  reducers,
  enhancer,
);

sagaMiddleware.run(rootSaga);

const rootElement = document.getElementById('chat-root');
const isPopup = rootElement.classList.contains("chat-root-popup");
ReactDOM.render(
  <Provider store={store}>
    <App isPopup={isPopup}/>
  </Provider>
  , rootElement);
