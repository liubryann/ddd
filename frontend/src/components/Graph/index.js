import React from 'react'
import PropTypes, { instanceOf } from "prop-types";
import { connect } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

import { scaleTime } from 'd3-scale';

import {
    Chart,
    ArgumentAxis,
    ValueAxis,
    LineSeries,
    Title,
    Tooltip,
    Legend,
  } from '@devexpress/dx-react-chart-material-ui';
import { ArgumentScale, Animation, EventTracker } from '@devexpress/dx-react-chart';

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(2),
        height: '90%',
      },
      titleText: {
        // add styling to title 
      },
}));

function Graph({data, info}) {
    const classes = useStyles();

    const TextComponent = ({ ...restProps }) => (
        <Title.Text {...restProps} className={classes.titleText} />
      );

    return (
        <Paper className={classes.paper} elevation={0} >
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

Graph.propTypes = {

 };
 
 const mapStateToProps = (state) => ({

 });
 
 const mapDispatchToProps = {
 }
 
 export default connect(mapStateToProps, mapDispatchToProps)(Graph);
