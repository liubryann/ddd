import React, { Component } from 'react'
import PropTypes from "prop-types";
import { connect } from "react-redux";

import withStyles from "@material-ui/core/styles/withStyles";

const styles = (theme) => ({

});

class Home extends Component {
    constructor() {
        super();
        this.state ={};
    }

    render() {
        const { classes } = this.props;

        return (
            <div>
                <br/>
                Content
            </div>
        )
    }
}

Home.propTypes = {
   
};

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = () => {

}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Home));
