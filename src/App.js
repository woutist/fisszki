import React, { Component } from 'react';
import './style.css';
// import Examples from './components/c_examples'
import JsonExample from './components/c_flashcard'

/**
 * all
 */

const jsonData = [
    {
        'name':'Rzeczowniki',
        'data':require('./components/c_flashcard/data_json/test1.json')
    },
    {
        'name':'Czasowniki',
        'data':require('./components/c_flashcard/data_json/test2.json')
    }
];

class App extends Component {

    render() {
        return (
            <div>
                <JsonExample title='Class JsonExample' json={jsonData} />
                {/*<Examples />*/}
            </div>
        );
    }
}

export default App;