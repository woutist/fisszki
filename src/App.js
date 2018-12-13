import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class MainNavigation extends Component {
    render() {
        return (
            <header className="main-header">
                <h1><a href={"#"}><img src={logo} className="logo" alt="Flashcards" /> Flashcards</a></h1>
                <h3>{this.props.title}</h3>
                <ul>
                    {this.props.items.map(i => <li><a href='#'>{i}</a></li>)}
                </ul>
            </header>
        );
    }
}

class ToDoList extends Component {
    state = {
        tasks: this.props.tasks,
        draft: ''
    };

    updateDraft = event => {
        this.setState({draft: event.target.value});
    };

    addToDo = () => {
        const { tasks, draft } = this.state;
        //tasks.push(draft);
        //this.setState({tasks: tasks, draft});
        this.setState(prevState => ({
            tasks: [...prevState.tasks, draft],
            draft: ''
        }));
        // this.setState(prevState => ({
        //     tasks: [prevState.tasks, draft]
        // }));
    };

    render() {
        return (
            <div>
                <h2>{this.props.title}</h2>
                {this.state.tasks.map(task => <div><p>{task}</p></div>)}
                <input type='text' onChange={this.updateDraft} value={this.state.draft} />
                <button onClick={this.addToDo}>Add</button>
            </div>
        )
    }
}

class App extends Component {

    render() {
        return (
            <div>
                <MainNavigation title='Navigation' items={['PL -> EN','EN -> PL']} />
                <ToDoList title='TodoList' tasks={['item1','item2','item3']} />
            </div>
        );
    }
}

export default App;
