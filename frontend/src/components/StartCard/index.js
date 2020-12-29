import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from "@material-ui/core";

import IndividualSvg from '../../images/individual.svg';
import InstitutionalSvg from '../../images/institutional.svg'; 

const useStyles = (title, width) => makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
        backgroundColor: title === 'Individual' ? '#aabb97' : '#8aacc8',
        borderRadius: '10px',
        padding: theme.spacing(2),
        height: "200px",
        flex: 1,
        maxWidth: width,
        margin: theme.spacing(1.5)
    },
    img: {
        width: title === 'Individual' ? '50%' : '60%',
        zIndex: 0,
        marginLeft: 'auto',
        marginRight: theme.spacing(3)
    },
    title: {
        position: 'absolute',
        zIndex: 1,
        color: '#fff',
        fontWeight: 'bold'
    }
}));  

function AnalysisCard(props) {
    const { title, width } = props; 
    const classes = useStyles(title, width)();

    return (
        <div className={classes.background}>
            <div className={classes.root}>
                <img 
                    src={title === "Individual" ? IndividualSvg : InstitutionalSvg} 
                    className={classes.img} />
                <Typography variant="h4" className={classes.title}>{title}</Typography>
            </div>
        </div>
    )
}

export default AnalysisCard;