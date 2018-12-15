import React, { Component } from 'react';
import './style.css';
import Examples from './components/c_examples'
import JsonExample from './components/c_flashcard'

/**
 * all
 */

class App extends Component {

    render() {
        return (
            <div>
                <Examples />
                <JsonExample title='Class JsonExample' />
            </div>
        );
    }
}

export default App;