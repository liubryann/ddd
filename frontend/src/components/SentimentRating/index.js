import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@material-ui/icons/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import Box from '@material-ui/core/Box';
import Rating from '@material-ui/lab/Rating';

const useStyles = makeStyles((theme) => ({
    'icon-1': { color: '#d50000' },
    'icon-2': { color: 'orange' },
    'icon-3': { color: '#fdd835' },
    'icon-4': { color: 'skyblue' },
    'icon-5': { color: '#43a047' },
}));

const sentimentIcons = {
    0: {
      icon: <span></span>,
    },
    1: {
      icon: <SentimentVeryDissatisfiedIcon style={{ fontSize: "20px"}} />,
    },
    2: {
      icon: <SentimentDissatisfiedIcon style={{ fontSize: "20px"}} />,
    },
    3: {
      icon: <SentimentSatisfiedIcon style={{ fontSize: "20px"}} />,
    },
    4: {
      icon: <SentimentSatisfiedAltIcon style={{ fontSize: "20px"}} />,
    },
    5: {
      icon: <SentimentVerySatisfiedIcon style={{ fontSize: "20px"}} />,
    },
};


function IconContainer(props) {
    const { value, ...other } = props;
    return <span {...other}>{sentimentIcons[value].icon}</span>;
  }

function SentimentRating({ rating }) {
  const classes = useStyles();

    return (
      <Box  borderColor="transparent">
        <Rating
          name="customized-icons"
          defaultValue={rating}
          IconContainerComponent={IconContainer}
          readOnly
          classes={{
              iconFilled: classes[`icon-${rating}`],
          }}
        />
    </Box>
    )
}

export default SentimentRating; 