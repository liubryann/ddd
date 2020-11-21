import React from 'react'

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

// logo 
import logo from '../../logo.svg';

const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
    },
    bar: {
        position: "static",
        color: theme.palette.primary
    },
}));

function NavBar() {
    const classes = useStyles();

    return (
        <div className={classes.grow}>
            <AppBar className={classes.bar}>
                <Toolbar>
                    <img src={logo}/>

                </Toolbar>
            </AppBar>
            
        </div>
    )
}

export default NavBar; 
