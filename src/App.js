import React, { Component } from 'react';
import './bootstrap.min.css';
import './style.css';
// import Examples from './components/c_examples'
import FlashCards from './components/c_flashcard';

/**
 * all
 */

class App extends Component {

    render() {
        return (
            <div className="main-conteiner">
                <FlashCards title="FlashCards" />
            </div>
        );
    }
}

export default App;