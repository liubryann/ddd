import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import stockReducer from './reducers/stockReducer';

const initialState = {};

const middleware = [thunk];

const reducers = combineReducers({
    stock: stockReducer
});

const store = createStore(
    reducers, 
    initialState, 
    compose(
        applyMiddleware(...middleware)
    )
);

export default store;