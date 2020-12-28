import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from "@material-ui/core";
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

import SentimentRating from '../../components/SentimentRating';


const useStyles = makeStyles((theme) => ({
    background: {
        padding: theme.spacing(1.5),
        backgroundColor: theme.palette.primary.main,
        borderRadius: '10px',
        flex: 1,
        maxWidth: '584px'
    },
    root: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
        backgroundColor: '#fff',
        borderRadius: '10px',
        padding: theme.spacing(2),
        height: "200px",   
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing(1)
    },
    title: {
        marginRight: theme.spacing(2),
        fontWeight: 'bold'
    },  
    content: {
        color: "#9e9e9e",
        overflow: 'hidden'
    }, 
    time: {
        marginLeft: 'auto',
        marginRight: 0,
        color: "#757575"
    },
    footer: {
        marginTop: 'auto',
        marginBottom: 0,
    },
    line: {
        backgroundColor: "#e0e0e0",
        border: 0,
        height: 1
    },
    link: {
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        color: '#607d8b',       
    },
}));  

function AnalysisCard(props) {
    const { title, summary, sentiment, link, time } = props; 
    const classes = useStyles();

    return (
        <div className={classes.background}>
            <div className={classes.root}>
                <div className={classes.details}>
                    <div className={classes.header}>
                        <Typography className={classes.title} variant="subtitle1">{ title }</Typography>
                        <SentimentRating rating={sentiment} />
                        <Typography className={classes.time} variant="subtitle2">{ time }</Typography>
                    </div>

                    <div>
                        <Typography className={classes.content} variant="body2">
                            { summary }
                        </Typography>
                    </div>

                    <div className={classes.footer}>
                        <div>
                            <hr className={classes.line} />
                        </div>
                        <Typography variant="subtitle2">
                            <div style={{ display: 'inline-block' }}>
                                <a className={classes.link} href={link}>
                                { "Read more" } 
                                <ArrowForwardIosIcon style={{ marginLeft: '5px' }} fontSize="inherit" />
                                </a>
                            </div>
                        </Typography>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AnalysisCard;
