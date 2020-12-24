import React from 'react'
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

// Components
import Stock from '../../components/Stock';
import Graph from '../../components/Graph';
import StockInfo from '../../components/StockInfo';

const useStyles = makeStyles((theme) => ({
    background: {
        backgroundColor: theme.palette.primary.main,
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(6)
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
        flexBasis:300,
        display: 'flex',
        flexDirection: 'row'
    },
    info: {
        flexGrow: 0.1,
        flexBasis: 340,
        flexShrink: 0,
        margin: theme.spacing(1.5)
    },
    graph: {
        flexGrow: 0.9,
        flexBasis: 600,
        flexShrink: 0,
        margin: theme.spacing(1.5)
    },
    sentiment: {
        minWidth: '470px',
        flexGrow: 0.5,
        margin: theme.spacing(1.5)
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
    const classes = useStyles();

    return (
        <div className={classes.background}>
            <div className={classes.row}>
                <div className={classes.info}>
                {data ? <StockInfo key={key} info={info} /> : <Paper classes={{ rounded: classes.rounded }} elevation={0} className={classes.paper}></Paper> }
                </div>
                <div className={classes.graph}>
                    {data ? <Graph key={key} data={data} info={info} /> : <Paper classes={{ rounded: classes.rounded }} elevation={0} className={classes.paper}></Paper> }
                </div>
            </div>
            <div className={classes.row}>
                <div className={classes.sentiment}>
                    <Paper classes={{ rounded: classes.rounded }} className={classes.paper} elevation={0}>
                        {/* <Stock /> */}xs=6
                    </Paper>
                </div>
                <div className={classes.sentiment}>
                    <Paper classes={{ rounded: classes.rounded }} className={classes.paper} elevation={0}>xs=6</Paper>
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
