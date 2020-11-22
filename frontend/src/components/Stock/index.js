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
            name: '',
        };
    }
    
    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    };


    render() {
        const { classes } = this.props;

        return (
            <div>
                <form>
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
                            <MenuItem value={"Month"}>Month</MenuItem>
                            <MenuItem value={"Year"}>Year</MenuItem>
                            <MenuItem value={"All Time"}>All Time</MenuItem>
                            </Select>
                        </FormControl>  

                        <TextField className={classes.name} name="name" value={this.state.name} onChange={this.handleChange} color="secondary" id="standard-basic" label="Standard" />
                        <Button className={classes.button} variant="contained" color="secondary">
                            Analyze
                        </Button>
                    </div>
                </form>
            </div>
        )
    }
}

Stock.propTypes = {
   
};

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = () => {

}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Stock));

