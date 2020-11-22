import { ANALYSIS_START, SET_ANALYSIS, ANALYSIS_ERROR } from '../types';

import axios from 'axios';

export const getAnalysis = (query) => (dispatch) => {
    dispatch({ type: ANALYSIS_START });
    axios.get('/getAnalysis', { params: query })
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