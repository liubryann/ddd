import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        flex: 1, 
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
}));

const loadStrings = [
    "Sorry our free server must have fallen asleep...",
    "Let me go wake it up...",
    "Okay time to spin up the threads...",
    "Gathering market data...",
    "Scraping the web for articles...",
    "Analyzing the data...",
    "Predicting the sentiment...",
    "Preparing the tendies..."
]

function FirstLoad() {
    const classes = useStyles();

    const [index, setIndex] = useState(0)

    useEffect(() => {
        let timeout;
        if (index < loadStrings.length - 1) {
            timeout = setTimeout(() => setIndex(index + 1), 3000); 
        }
        else {
            timeout = setTimeout(() => setIndex(3), 3000);
        }
        return () => {
            clearTimeout(timeout)
        }
    }, [loadStrings, index])

    return (
        <div className={classes.root}>
            {
                loadStrings[index]
            }
        </div>
    )
}

export default FirstLoad;
