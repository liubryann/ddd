import React, { Component } from 'react'
import PropTypes from "prop-types";
import { connect } from "react-redux";

import withStyles from "@material-ui/core/styles/withStyles";

import { FormHelperText, Typography } from "@material-ui/core";
import { Paper } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';


import AnalysisCard from '../../components/AnalysisCard';

const styles = (theme) => ({
    name: {
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3)
    },
    paper: {
        height: '70vh',
        width: '60%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3),
        paddingLeft: theme.spacing(6),
        paddingRight: theme.spacing(6),
        overflow: 'scroll'
    },
    label: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
});

class Stock extends Component {
    constructor() {
        super();
        this.state ={
            analysis: { 
                people: [],
                corporation: [],
                peopleAVG: 'Neutral',
                corporationAVG: 'Neutral'
            },
        };
    }

    handlePeopleSentiment = (sentiment) => {
        switch(sentiment) {
            case "Strongly Positive":
                return "🚀 Strongly Positive 🚀"
            case "Positive": 
                return "🐮 Positive 🐮"
            case "Negative":
                return "🐻 Negative 🐻"
            case "Strongly Negative":
                return "💩 Strongly Negative 💩"
            case "Mixed":
                return "🐸 Mixed 🐸"
            default:
                return "Neutral"
        }
    }


    handleCorporationSentiment = (sentiment) => {
        switch(sentiment) {
            case "Strongly Positive":
                return "📈 Strongly Positive 📈"
            case "Positive": 
                return "📈 Positive 📈"
            case "Negative":
                return "📉 Negative 📉"
            case "Strongly Negative":
                return "📉 Strongly Negative 📉"
            case "Mixed":
                return "🐸 Mixed 🐸"
            default:
                return "Neutral"
        }
    }


    componentDidUpdate(prevProps) {
        if (this.props.stock.error !== prevProps.stock.error) {
            this.setState({ error: this.props.stock.error });
        }
        if (this.props.stock.analysis !== prevProps.stock.analysis) {
            this.setState({ analysis: this.props.stock.analysis });
        }
    }


    render() {
        const { classes } = this.props;
  
        const { people, corporation, peopleAVG, corporationAVG} = this.state.analysis;

        let peopleSentiment = this.handlePeopleSentiment(peopleAVG);
        let corporationSentiment = this.handleCorporationSentiment(corporationAVG);

        let peopleAnalysis = (people.map((post) => (
            <AnalysisCard title={post.title} summary={post.summary} sentiment={this.handlePeopleSentiment(post.sentiment)} />
        )))

        let corporationAnalysis = (corporation.map((article) => (
            <AnalysisCard title={article.title} summary={article.summary} sentiment={this.handleCorporationSentiment(article.sentiment)} />
        )))

        return (
                    <Paper elevation={3} className={classes.paper}>
                        <Grid container spacing={3}>
                            <Grid item xs={6}>
                            <Typography variant="h5">🐵 Voice of the people 🐵</Typography>
                            </Grid>
                            <Grid item xs={6}>
                            <   Typography variant="h5">🤖 Voice of the corporation 🤖</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="h6">{peopleSentiment}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="h6">{corporationSentiment}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                 {peopleAnalysis}
                            </Grid>
                            <Grid item xs={6}>
                                {corporationAnalysis}
                            </Grid>
                        </Grid>
                    </Paper>
        )
    }
}

Stock.propTypes = {
   stock: PropTypes.object.isRequired, 
   getAnalysis: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    stock: state.stock
});

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Stock));

