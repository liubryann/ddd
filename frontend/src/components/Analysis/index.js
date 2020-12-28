import React, { useState, useEffect } from 'react'
import useWindowSize from '../../util/windowSize';

import { makeStyles } from '@material-ui/core/styles';

import Carousel from 'react-material-ui-carousel'
import AnalysisCard from '../../components/AnalysisCard';
import StartCard from '../../components/StartCard';


const useStyles = makeStyles((theme) => ({
    carousel: {
        display: 'flex',
        flexDirection: 'row',
    },

}));


function Analysis({ type, posts }) {
    const classes = useStyles();

    const size = useWindowSize()

    var slicedPosts = []
    var sliceSize = 4; 
    if (size.width <= 1230) {
        sliceSize = 2;
    }
    else if (size.width <= 1700) {
        sliceSize = 3; 
    }

    for (var i = 0; i < posts.length; i += sliceSize) {
        slicedPosts.push(posts.slice(i, i + sliceSize))
    } 
   
    return (
        <Carousel
            autoPlay={false}
            indicators={false}
            animation="slide"
        >
            {
                slicedPosts.map((slice, i) =>  
                <div className={classes.carousel}> 
                    {
                        slice.map((post) => 
                            post.title === 'Individual' || post.title === 'Institutional' ? <StartCard title={post.title} /> :
                            <AnalysisCard 
                                key={i}
                                title={post.title} 
                                summary={post.summary}
                                sentiment={post.sentiment}
                                time={post.time}
                                link={post.link}
                            />
                        )
                     }
                </div>
                )
            }
        </Carousel>  
    )
}

export default Analysis; 
