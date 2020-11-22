import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    card: {
        marginBottom: 20
    }
}));

function AnalysisCard(props) {
    const classes = useStyles();
    const { title, summary, sentiment } = props; 
    return (
        <Card className={classes.card} variant="outlined">
            <CardContent>
                <Typography variant="subtitle1" className={classes.title}>
                    {title}
                </Typography>
                <Typography variant="body2" className={classes.summary}>
                    {summary}
                </Typography>
                <Typography variant="subtitle1" className={classes.summary}>
                    {sentiment}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default AnalysisCard;
