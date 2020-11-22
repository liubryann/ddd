import { ANALYSIS_START, SET_ANALYSIS, ANALYSIS_ERROR } from '../types';

import api from '../../util/api';

export const getAnalysis = (query) => (dispatch) => {
    dispatch({ type: ANALYSIS_START });
    api.get('/getAnalysis', { params: query })
        .then((res) => {
            console.log(res.data);
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