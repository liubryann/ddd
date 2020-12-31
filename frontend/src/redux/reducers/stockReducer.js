import { ANALYSIS_START, ANALYSIS_ERROR, SET_TICKER_ERROR, SET_DATA_AND_ANALYSIS } from '../types';

const initialState = {
    loading: false, 
    firstLoad: true,
    error: {},
    dataAndAnalysis: null,
}
 
export default function(state = initialState, action) {
    switch(action.type) {
        case ANALYSIS_START:
            return {
                ...state,
                loading: true
            };
        case ANALYSIS_ERROR: 
            return {
                ...state,
                loading: false, 
                error: action.payload
            };
        case SET_TICKER_ERROR:
            return {
                ...state,
                loading: false, 
                error: action.payload
            };
        case SET_DATA_AND_ANALYSIS:
            return {
                ...state,
                loading: false, 
                firstLoad: false,
                errors: {},
                dataAndAnalysis: action.payload
            }
        default: 
            return state;
    }
}