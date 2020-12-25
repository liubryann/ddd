import React from 'react'

import { makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';

import { scaleTime } from 'd3-scale';

import {
    Chart,
    ArgumentAxis,
    ValueAxis,
    LineSeries,
    Title,
    Tooltip,
  } from '@devexpress/dx-react-chart-material-ui';
import { ArgumentScale, Animation, EventTracker } from '@devexpress/dx-react-chart';

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(2),
        height: '90%',
    },
    titleText: {
       fontSize: "1.5em"
    },
    rounded: {
        borderRadius: '10px'
    }
}));

function Graph({data, info}) {
    const classes = useStyles();

    const TextComponent = ({ ...restProps }) => (
        <Title.Text {...restProps} className={classes.titleText} />
      );

    return (
        <Paper classes={{ rounded: classes.rounded }} className={classes.paper} elevation={0} >
            <Chart
                data={data}
                height="300"
            >
                <ArgumentScale factory={scaleTime}/>
                <ArgumentAxis />
                <ValueAxis />
                <LineSeries valueField="Close" argumentField={"Date"} color={info.color}/>

                <Title 
                    text={"Price Chart"}
                    textComponent={TextComponent}
                />
                <EventTracker />
                <Tooltip />
                <Animation />
            </Chart>
           
        </Paper>
    )
}
 
 export default Graph;
