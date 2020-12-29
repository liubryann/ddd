import { ANALYSIS_START, ANALYSIS_ERROR, SET_TICKER_ERROR, SET_DATA_AND_ANALYSIS } from '../types';

import api from '../../util/api';

export const getAnalysis = (query) => (dispatch) => {
    dispatch({ type: ANALYSIS_START });

    api.get('/getTickerData', { params: query})
        .then((res) => {
            res.data.data.forEach((tick) => {
                tick.Date = new Date(tick.Date)
            })

            var dataAndAnalysis = {}
            dataAndAnalysis.tickerData = res.data;

            query.symbol = res.data.info.shortName;

            api.get('/getAnalysis', { params: query })
            .then((res) => {
                res.data.individual.unshift({ title: "Individual"})
                res.data.institutional.unshift({ title: "Institutional"})

                dataAndAnalysis.analysis = res.data
               
                dispatch({
                    type: SET_DATA_AND_ANALYSIS,
                    payload: dataAndAnalysis
                })
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