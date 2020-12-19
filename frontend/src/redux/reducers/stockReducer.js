import { ANALYSIS_START, SET_ANALYSIS, ANALYSIS_ERROR, SET_TICKER_DATA, SET_TICKER_ERROR } from '../types';

const initialState = {
    loading: false, 
    error: {},
    analysis: null,
    tickerData: null
}
 
export default function(state = initialState, action) {
    switch(action.type) {
        case ANALYSIS_START:
            return {
                ...state,
                loading: true
            };
        case SET_ANALYSIS:
            return {
                ...state, 
                loading: false,
                error: {},
                analysis: action.payload
            };
        case ANALYSIS_ERROR: 
            return {
                ...state,
                loading: false, 
                error: action.payload
            };
        case SET_TICKER_DATA:
            return {
                ...state,
                loading: false, 
                errors: {},
                tickerData: action.payload
            }
        case SET_TICKER_ERROR:
            return {
                ...state,
                loading: false, 
                error: action.payload
            };
        default: 
            return state;
    }
}