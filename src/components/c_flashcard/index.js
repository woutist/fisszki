import React, { Component } from 'react';
//import dataJson from './test1.json';
import './component.css';

class JsonExample extends Component {
    render() {
        const { title, json } = this.props; // title = this.props.title, json = this.props.json
        return (
            <div className="json-example">
                <h3>{title}</h3>
                <ul>
                    {json.map(function (obj, i) {
                        return (
                            <li key={i}>
                                <h4>{obj.name}</h4>
                                <ul>
                                    {
                                        obj.data.map(function (obj, i) {
                                            if(i === 1) {
                                                return <li key={i}>{obj._pl} - {obj._en}
                                                <a target='blank_' href={"https://translate.google.pl/#view=home&op=translate&sl=pl&tl=en&text=" + obj._pl}>Google translator</a></li>
                                            }
                                        })
                                    }
                                </ul>
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }
}

export default JsonExample;
