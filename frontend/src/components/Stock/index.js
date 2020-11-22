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
import { FormHelperText } from "@material-ui/core";

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
        marginTop: theme.spacing(2)
    },
    name: {
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3)
    },
    button: {
        marginTop: theme.spacing(1)
    }
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
                peopleAverage: 'Neutral',
                corporationAverage: 'Neutral'
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
        this.setState({
            analysis: this.props.stock.analysis
        })
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
        const { people, corporation, peopleAverage, corporationAverage} = this.state.analysis;

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
                            <MenuItem value={"Day"}>Day</MenuItem>
                            <MenuItem value={"Week"}>Week</MenuItem>
                            <MenuItem value={"Month"}>Month</MenuItem>
                            <MenuItem value={"Year"}>Year</MenuItem>
                            <MenuItem value={"All"}>All Time</MenuItem>
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
                        </Button>
                    </div>
                </form>
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

