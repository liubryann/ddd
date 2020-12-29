import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

import SentimentRating from '../../components/SentimentRating';

const useStyles = info => makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(2),
        height: '90%',
    },
    price: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: theme.spacing(2)
    },
    textColor: {
        color:  info.percentChangeColor
    },
    priceSpacing: {
        marginRight: theme.spacing(1),
        fontWeight: 'bold',
    },
    spacing: {
        marginRight: theme.spacing(1), 
    },
    rounded: {
        borderRadius: '10px'
    },
}));

function StockInfo({ info }) {
    const classes = useStyles(info)();

    return (
        <Paper classes={{ rounded: classes.rounded }} className={classes.paper} elevation={0}>
            <Typography variant="h6">{info.shortName + " (" + info.symbol + ")"}</Typography>
            <div className={classes.price}>
                <Typography variant="h4" className={classes.priceSpacing}>{info.curr}</Typography>
                <Typography variant="h6" color="textSecondary" className={classes.spacing}>{info.currency}</Typography>
                <Typography variant="h6" color="primary" classes={{ colorPrimary: classes.textColor }} >{info.difference + " (" + info.percentChange + "%)"}</Typography>
            </div>      
        </Paper>
    )
}

export default StockInfo;
