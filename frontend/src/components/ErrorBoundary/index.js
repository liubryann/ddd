import React, { Component } from 'react'
import Typography from '@material-ui/core/Typography';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props); 
        this.state ={
            error: null,
            errorInfo: null
        }
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        })
    }

    render() {
        if (this.state.error) {
            return (
                <div>
                    <Typography style={{ margin: '10px'}} variant="h6">Something went wrong.</Typography>
                </div>
            )
        }
        return this.props.children;      
    }
}

export default ErrorBoundary;
