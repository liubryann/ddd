import React from 'react'
import logo from '../../ddd.svg';

import { makeStyles, fade } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
// import Typography from '@material-ui/core/Typography';
// import InputBase from '@material-ui/core/InputBase';
// import SearchIcon from '@material-ui/icons/Search';
// import BookmarksIcon from '@material-ui/icons/Bookmarks';

// Components
import CustomButton from '../CustomButton';


const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
    },
    bar: {
        position: "static",
        color: theme.palette.primary,
        alignItems: 'center'
    },
    title: {
        flex: 1
    },
    logo: {
        height: '90px',
        width: '90px'
    }
}));

function NavBar() {
    const classes = useStyles();

    return (
        <div className={classes.grow}>
            <AppBar className={classes.bar}>
                <Toolbar>
                    <img src={logo} className={classes.logo}/>
                    {/* <Typography variant="h6" className={classes.title}>Due Diligence for Dummies</Typography> */}

                </Toolbar>
            </AppBar> 
        </div>
    )
}

export default NavBar; 
