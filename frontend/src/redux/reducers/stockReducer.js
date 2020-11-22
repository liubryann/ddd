import { ANALYSIS_START, SET_ANALYSIS, ANALYSIS_ERROR } from '../types';

const initialState = {
    loading: false, 
    errors: {},
    analysis: null
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
        default: 
            return state;
    }
}