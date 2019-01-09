import React, { Component } from 'react';
import logo from './logo.svg';

class MainNavigation extends Component {
    render() {
        return (
            <header className="main-header">
                <h1><a href={"#"}><img src={logo} className="logo" alt="Flashcards" /> Flashcards</a></h1>
                <h3>{this.props.title}</h3>
                <ul>
                    {/*{this.props.items.map(i => <li><a href='#'>{i}</a></li>)}*/}
                    {this.props.items.map(function (obj, i) {
                        return <li>
                            <a href={"#id"+i}>{obj} - {i}</a>
                        </li>;
                    })}
                </ul>
            </header>
        );
    }
}

const data = [
    {name:'Jhon', age:28, city:'HO'},
    {name:'Onhj', age:82, city:'HN'},
    {name:'Nohj', age:41, city:'IT'}
];

class ArraryExample extends Component {
    render() {
        return (
            <div>
                <h3>{this.props.title}</h3>
                <ul>
                    {data.map(function (obj, i) {
                        return <li>
                            <a href={"#id"+i}>{obj.name} - {obj.age} - {obj.city} - id: {i}</a>
                        </li>;
                    })}
                </ul>
            </div>
        );
    }
}

class OneToDo extends Component {
    state = {
        val: this.props.val,
        draft: ''
    };

    updateText = event => {
        this.setState({draft: event.target.value});
    };

    addText = () => {
        // const { val, draft } = this.state;
        this.setState({
            val: this.state.draft,
            draft: ''
        });

    };

    render() {
        return (
            <div>
                <h2>{this.props.title}</h2>
                <p>{this.state.val}</p>
                <input type='text' placeholder='Change string...' onChange={this.updateText} value={this.state.draft} />
                <button onClick={this.addText}>Change</button>
            </div>
        )
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

class ExampleForm extends React.Component {
    state = {
        val: '...',
        draft: ''
    };

    handleChange = (event) => {
        this.setState({draft: event.target.value});
    };

    handleSubmit = (event) => {
        this.setState({
            val: this.state.draft,
            draft: ''
        });
        // const { val, draft } = this.state;
        // this.setState(prevState => ({
        //     val: [...prevState.value, draft],
        //     draft: ''
        // }));
        event.preventDefault();
    };

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <h2>{this.props.title}</h2>
                <div className="show">{this.state.val}</div>
                <input placeholder={this.state.placeholder} onChange={this.handleChange} value={this.state.draft} />
                <input type="submit" value="Submit" />
            </form>
        );
    }
}

class Examples extends Component {
    render() {
        return (
            <div>
                <MainNavigation title='Class MainNavigation' items={['PL -> EN','EN -> PL']} />
                <ToDoList title='Class ToDoLis' tasks={['item1','item2','item3']} />
                <OneToDo title='Class OneToDo' val="placeholder..." />
                <ExampleForm title='Class ExampleForm' />
                <ArraryExample title='Class ArraryExample' />
            </div>
        );
    }
}

export default Examples;

