import React from 'react'
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

// Components
import Graph from '../../components/Graph';
import StockInfo from '../../components/StockInfo';
import Analysis from '../../components/Analysis';

const useStyles = makeStyles((theme) => ({
    background: {
        backgroundColor: theme.palette.primary.main,
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(3)
    },
    grid: {
        flexGrow: 1
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        height: '90%',
        color: theme.palette.text.secondary,
    },
    row: {
        flexGrow: 1,
        flexShrink: 0, 
        flexBasis:200,
        display: 'flex',
        flexDirection: 'row'
    },
    info: {
        flexGrow: 0.13,
        flexBasis: 350,
        flexShrink: 0,
        margin: theme.spacing(1.5)
    },
    graph: {
        flexGrow: 0.87,
        flexBasis: 700,
        flexShrink: 0,
        margin: theme.spacing(1.5)
    },
    sentiment: {
        flexGrow: 1,
        flexBasis: 1095,
        flexShrink: 0,
    },
    rounded: {
        borderRadius: '10px'
    }
}));

function Home(props) {
    const { tickerData } = props.stock || {}
    const { data } = tickerData || {}
    const { info } = tickerData || {}
    const { key } = tickerData || {}

    const { analysis } = props.stock || {}
    const { individual } = analysis || {}
    const { individualAverage } = analysis || {} 
    const { institutional } = analysis || {}
    const { institutionalAverage } = analysis || {}

    const classes = useStyles();

    return (
        <div className={classes.background}>
            <div className={classes.row}>
                <div className={classes.info}>
                {data ? <StockInfo key={key} info={info} /> : <div></div> }
                </div>
                <div className={classes.graph}>
                    {data ? <Graph key={key} data={data} info={info} /> : <div></div> }
                </div>
            </div>
            <div className={classes.row}>
                <div className={classes.sentiment}>
                    {analysis ? <Analysis key={key} type="Individual" posts={individual} /> : <div></div> }          
                </div>
            </div>
            <div className={classes.row}>
                <div className={classes.sentiment}>
                    {analysis ? <Analysis key={key} type="Institutional" posts={institutional} /> : <div></div> }
                </div>
            </div>
        </div>
    )
}

Home.propTypes = {
    stock: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    stock: state.stock
});

const mapDispatchToProps = () => {

}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
