import { ANALYSIS_START, SET_ANALYSIS, ANALYSIS_ERROR, SET_TICKER_DATA, SET_TICKER_ERROR } from '../types';

import api from '../../util/api';

export const getAnalysis = (query) => (dispatch) => {
    dispatch({ type: ANALYSIS_START });

    api.get('/getTickerData', { params: query})
        .then((res) => {
            res.data.data.forEach((tick) => {
                tick.Date = new Date(tick.Date)
            })

            dispatch({
                type: SET_TICKER_DATA,
                payload: res.data
            })

            query.symbol = res.data.info.shortName;

            api.get('/getAnalysis', { params: query })
            .then((res) => {
                res.data.individual.unshift({ title: "Individual"})
                res.data.institutional.unshift({ title: "Institutional"})
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

        })
        .catch((err) => {
            console.log(err)
            dispatch({
                type: SET_TICKER_ERROR,
                payload: err.response.data
            })
        })
}