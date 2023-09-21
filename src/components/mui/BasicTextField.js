import React, { Component } from "react";
import TextField from '@mui/material/TextField';
import './BasicTextField.css';

class BasicTextField extends Component {

    render () {
        return (
            <TextField id={this.props.id} label={this.props.label} variant="outlined" className="textField" onChange={this.props.onChange}/>
        )
    }
}

export default BasicTextField;