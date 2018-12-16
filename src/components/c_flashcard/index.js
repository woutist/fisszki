import React, { Component } from 'react';
//import dataJson from './test1.json';
import './component.css';

class JsonExample extends Component {
    state = {
        callObj: this.props.callObj
    };
    callExercise = (event,o) => {
        this.setState({
            callObj: o.map(function (obj, i) {
                return (
                    <div key={i}>
                        {obj._pl} - {obj._en}
                        <a target='blank_' href={"https://translate.google.pl/#view=home&op=translate&sl=pl&tl=en&text=" + obj._pl}>
                            Google translator
                        </a>
                    </div>
                )
            })
        });
        event.preventDefault();
    };
    clearExercise = event => {
        this.setState({
            callObj: ''
        });
        event.preventDefault();
    };
    render() {
        const { title, json } = this.props; // title = this.props.title, json = this.props.json
        const that = this;
        return (
            <div className="json-example">
                <h3>{title}</h3>
                <ul>
                    <li><a href='#' onClick={that.clearExercise}>Close Exercise</a></li>
                    {json.map(function (obj, i) {
                        return (
                            <li key={i}>
                                <a href='#' onClick={(e) => that.callExercise(e,obj.data)}>{obj.name}</a>
                            </li>
                        );
                    },that)}
                </ul>
                <div className="call-obj">
                    {this.state.callObj}
                </div>
            </div>
        );
    }
}

export default JsonExample;
