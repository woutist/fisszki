import React, { Component } from 'react';
import './style.css';
// import Examples from './components/c_examples'
import FlashCards from './components/c_flashcard'

/**
 * all
 */

const jsonData = [
    {
        'name': {
            '_pl': 'Rzeczowniki',
            '_en': 'Nouns'
        },
        'data':require('./components/c_flashcard/data_json/test1.json')
    },
    {
        'name': {
            '_pl': 'Czasowniki',
            '_en': 'Verbs'
        },
        'data':require('./components/c_flashcard/data_json/test2.json')
    }
];

class App extends Component {

    render() {
        return (
            <div>
                <FlashCards title='Class JsonExample' json={jsonData} />
                {/*<Examples />*/}
            </div>
        );
    }
}

export default App;