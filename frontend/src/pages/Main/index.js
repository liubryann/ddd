import React, { Component } from 'react'
import PropTypes from "prop-types";
import { connect } from "react-redux";

import withStyles from "@material-ui/core/styles/withStyles";

const styles = (theme) => ({

});

class Main extends Component {
    constructor() {
        this.state ={};
    }

    render() {
        return (
            <div>
                Content
            </div>
        )
    }
}

Main.propTypes = {
   
};

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = () => {

}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Main));
