import React, { Component } from 'react'
import PropTypes from "prop-types";
import { connect } from "react-redux";

import withStyles from "@material-ui/core/styles/withStyles";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { FormHelperText, Typography } from "@material-ui/core";
import { Paper } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import CircularProgress from "@material-ui/core/CircularProgress";

import AnalysisCard from '../../components/AnalysisCard';

import { getAnalysis } from '../../redux/actions/stockActions';

const styles = (theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    search: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2)
    },
    name: {
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3)
    },
    button: {
        marginTop: theme.spacing(1)
    },
    analysis: {
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'center',
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
    progress: {
        position: "absolute",
      },
});

class Stock extends Component {
    constructor() {
        super();
        this.state ={
            range: '',
            symbol: '',
            analysis: { 
                people: [],
                corporation: [],
                peopleAVG: 'Neutral',
                corporationAVG: 'Neutral'
            },
            error: {}
        };
    }
    
    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    };

    handleSubmit = async (event) => {
        event.preventDefault(); 
        let query = {
            range: this.state.range,
            symbol: this.state.symbol
        }

        await this.props.getAnalysis(query);
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
        const { loading } = this.props.stock;
        const { error } = this.state;
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
            <div>
                <form onSubmit={this.handleSubmit}>
                    <div className={classes.search}>
                        <FormControl className={classes.formControl} >
                            <InputLabel id="demo-simple-select-label" color="secondary">Range</InputLabel>
                            <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            name="range"
                            value={this.state.range}
                            onChange={this.handleChange}
                            >
                            <MenuItem value={"day"}>Day</MenuItem>
                            <MenuItem value={"week"}>Week</MenuItem>
                            <MenuItem value={"month"}>Month</MenuItem>
                            <MenuItem value={"year"}>Year</MenuItem>
                            <MenuItem value={"all"}>All Time</MenuItem>
                            </Select>

                            {error.range && (
                            <FormHelperText error={error.range ? true : false}>
                                Required
                            </FormHelperText>
                            )}
                        </FormControl>  

                        <TextField 
                            className={classes.name} 
                            name="symbol" 
                            value={this.state.symbol} 
                            onChange={this.handleChange} 
                            color="secondary" 
                            id="standard-basic" 
                            label="Symbol"
                            helperText={error.symbol}
                            error={error.symbol ? true : false}
                         />
                        <Button className={classes.button} type="submit" variant="contained" color="secondary" disabled={loading}>
                            Analyze
                            {loading && (
                                <CircularProgress size={30} className={classes.progress} />
                            )}
                        </Button>

                    </div>
                </form>
                <div className={classes.analysis}>
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
                </div>
            </div>
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
    getAnalysis: getAnalysis
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Stock));

