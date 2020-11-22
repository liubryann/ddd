import { ANALYSIS_START, SET_ANALYSIS, ANALYSIS_ERROR } from '../types';

import axios from 'axios';

export const analyze = (query) => (dispatch) => {
    dispatch({ type: ANALYSIS_START });
    axios.get('/analyze', { params: query })
        .then((res) => {
            dispatch({
                type: SET_ANALYSIS,
                payload: res.data
            });
        })
        .catch((err) => {
            dispatch({
                type: ANALYSIS_ERROR,
                payload: err.response.data
            })
        })
}