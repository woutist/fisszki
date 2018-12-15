import React, { Component } from 'react';
import dataJson from './test1.json';
import './component.css';

class JsonExample extends Component {
    render() {
        return (
            <div className="json-example">
                <h3>{this.props.title}</h3>
                <ul>
                    {dataJson.map(function (obj, i) {

                        if(i === 10) {
                            return <li>{obj._pl} - {obj._en}</li>
                        }

                    })}
                </ul>
            </div>
        );
    }
}

export default JsonExample;
