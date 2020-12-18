import React from 'react'
import logo from '../../ddd.svg';

import { makeStyles, fade } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

// Components
import Search from '../Search'; 


const useStyles = makeStyles((theme) => ({
    bar: {
        position: "static",
        backgroundColor: theme.palette.primary.light
    },
    title: {
        flexGrow: 1
    },
    logo: {
        height: '70px',
        width: '70px',
    }
}));

function NavBar() {
    const classes = useStyles();

    return (
            <AppBar className={classes.bar} elevation={0} >
                <Toolbar>
                    <div className={classes.title}>
                        <img src={logo} className={classes.logo} />
                    </div>
                        <Typography color="error" variant="body1">Warning: under active development</Typography>
                    <Search />

                </Toolbar>
            </AppBar> 
    )
}

export default NavBar; 
