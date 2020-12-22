import React from 'react'
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

// Components
import Stock from '../../components/Stock';
import Graph from '../../components/Graph';

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
        flexGrow: 0.35,
        margin: theme.spacing(1.5)
    },
    graph: {
        flexGrow: 0.65,
        margin: theme.spacing(1.5)
    },
    sentiment: {
        flexGrow: 0.5,
        margin: theme.spacing(1.5)
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
                    <Paper className={classes.paper} elevation={0}>xs=4</Paper>
                </div>
                <div className={classes.graph}>
                    {data ? <Graph key={key} data={data} info={info} /> : <Paper elevation={0} className={classes.paper}>xs=6</Paper> }
                </div>
            </div>
            <div className={classes.row}>
                <div className={classes.sentiment}>
                    <Paper className={classes.paper} elevation={0}>
                        {/* <Stock /> */}
                    </Paper>
                </div>
                <div className={classes.sentiment}>
                    <Paper className={classes.paper} elevation={0}>xs=6</Paper>
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
