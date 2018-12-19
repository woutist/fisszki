import React, { Component } from 'react';
import './bootstrap.min.css';
import './style.css';
// import Examples from './components/c_examples'
import FlashCards from './components/c_flashcard'

/**
 * all
 */

const jsonData = [
    {
        'name': {
            '_pl': 'test 3 pozycje',
            '_en': 'test 3 items'
        },
        'data':require('./components/c_flashcard/data_json/test0.json')
    },
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
    },
    {
        'name': {
            '_pl': 'Dni tygodnia',
            '_en': 'Days of the week'
        },
        'data':require('./components/c_flashcard/data_json/base-days-of-the-week.json')
    }
];

class App extends Component {

    render() {
        return (
            <div>
                <FlashCards title='Class FlashCards' json={jsonData} />
                {/*<Examples />*/}
            </div>
        );
    }
}

export default App;