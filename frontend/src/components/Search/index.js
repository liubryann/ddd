import React, { useState } from 'react'
import { connect } from "react-redux";

import { makeStyles, fade } from '@material-ui/core/styles';
import { MenuItem, TextField } from "@material-ui/core";
import Button from '@material-ui/core/Button';
import CircularProgress from "@material-ui/core/CircularProgress";

import { getAnalysis } from '../../redux/actions/stockActions';


const useStyles = makeStyles((theme) => ({
    search: {
        minWidth: '500px',
        display: 'flex',
        justifyContent: 'space-around',
        flexDirection: 'row',
        alignItems: 'center',
    },
    range: {
        minWidth: 120,
    },
    button: {
        borderRadius: '5em'
    },
    progress: {
        position: "absolute",
      },
}));

const ranges = [
    {
        value:'day',
        label: 'Day'
    },
    {
        value:'week',
        label: 'Week'
    },
    {
        value:'month',
        label: 'Month'
    },
    {
        value:'year',
        label: 'Year'
    },
    {
        value:'all',
        label: 'All Time'
    },
];

function Search(props) {
    const classes = useStyles();
    const [query, setQuery] = useState({
        range: 'day',
        symbol: ''
    }); 
    const [error, setError] = useState(false); 
    const { loading } = props.stock;

    const handleChange = (event) => {
        setQuery({
            ...query, [event.target.name]: event.target.value
        })
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); 

        if (query.symbol.trim() === "") {
            setError(true); 
            return;
        }
        else {
            setError(false);
        }

        let searchParams = {
            range: query.range,
            symbol: query.symbol
        }

        await props.getAnalysis(searchParams);
    }

    return (
        <form onSubmit={handleSubmit} noValidate autoComplete="off">
            <div className={classes.search}>
                <TextField
                    id="select-range"
                    name="range"
                    select
                    size="small"
                    label="Range"
                    value={query.range}
                    onChange={handleChange}
                    variant="outlined"
                    className={classes.range}
                >
                    {ranges.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField 
                    className={classes.name} 
                    name="symbol" 
                    value={query.symbol} 
                    onChange={handleChange} 
                    color="secondary" 
                    id="standard-basic" 
                    label="Symbol"
                    variant="outlined"
                    size="small"
                    error={error ? true : false}
                    />
                <Button className={classes.button} type="submit" variant="contained" color="secondary" disabled={loading}>
                    Analyze
                    {loading && (
                        <CircularProgress size={30} className={classes.progress} />
                    )}
                </Button>
            </div>
        </form>
    )
}

const mapStateToProps = (state) => ({
    stock: state.stock
});

const mapDispatchToProps = {
    getAnalysis: getAnalysis
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);
