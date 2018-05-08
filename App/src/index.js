import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/AppDev';
import logger from 'redux-logger'
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga'
import reducers from './reducers';
import rootSaga from './sagas';


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose

const sagaMiddleware = createSagaMiddleware();


let middleware = [sagaMiddleware];

const enhancer = composeEnhancers(
    applyMiddleware(sagaMiddleware, logger));
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
