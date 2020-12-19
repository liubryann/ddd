import { ANALYSIS_START, SET_ANALYSIS, ANALYSIS_ERROR, SET_TICKER_DATA, SET_TICKER_ERROR } from '../types';

import api from '../../util/api';

export const getAnalysis = (query) => (dispatch) => {
    dispatch({ type: ANALYSIS_START });
    // api.get('/getAnalysis', { params: query })
    //     .then((res) => {
    //         console.log(res.data);
    //         dispatch({
    //             type: SET_ANALYSIS,
    //             payload: res.data
    //         });
    //     })
    //     .catch((err) => {
    //         dispatch({
    //             type: ANALYSIS_ERROR,
    //             payload: err.response.data
    //         })
    //     })

    api.get('/getTickerData', { params: query})
        .then((res) => {
            dispatch({
                type: SET_TICKER_DATA,
                payload: res.data
            })
        })
        .catch((err) => {
            dispatch({
                type: SET_TICKER_ERROR,
                payload: err.response.data
            })
        })
}