import React from 'react'
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import { scaleTime } from 'd3-scale';

import {
    Chart,
    ArgumentAxis,
    ValueAxis,
    LineSeries,
    Title,
    Legend,
  } from '@devexpress/dx-react-chart-material-ui';
import { ArgumentScale } from '@devexpress/dx-react-chart';

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(2),
        height: '90%',
      },
}));

const format = () => tick => new Date(tick);

function Graph({data, title}) {
    const classes = useStyles();

    return (
        <Paper className={classes.paper} elevation={0} >
            <Chart
                data={data}
                height="300"
            >
                {/* <ArgumentScale factory={scaleTime}/> */}
                <ArgumentAxis tickFormat={format} />
                <ValueAxis />
                <LineSeries valueField="Close" argumentField={data[0].Date ? "Date" : "Datetime"}/>

                <Title 
                    text={title}

                />
            </Chart>
            {/* {chartData !== null ? ( <Chart>
                data={chartData}
                <LineSeries
                    valueField="Close"
                    arguement="Datetime"
                    />
            </Chart>) : <div>Hello</div>} */}
           
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
