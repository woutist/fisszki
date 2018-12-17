import React, { Component } from 'react';
//import dataJson from './test1.json';
import './component.css';
import Cookies from 'universal-cookie';

/**
 * COOKIES
 */
const cookies = new Cookies();
let lang, translate = {};
const setLanguage = (x) => {
    switch (x) {
        case 'en':
            translate.closeExercise = 'Close exercise';
            break;
        default: //pl
            translate.closeExercise = 'Zamknij ćwiczenie';
    }
};
if(typeof cookies.get('flashcard_cookie') === "undefined") {
    //console.log("cookie nie ustawione");
    cookies.set('flashcard_cookie', 'pl', { path: '/' });
    lang = 'pl';
} else {
    if(cookies.get('flashcard_cookie') === 'pl') {
        lang = 'pl';
    } else {
        lang = 'en';
    }
}
setLanguage(lang);

class JsonExample extends Component {
    state = {
        callObj: 'Select exercise...',
        activePL: (lang === 'pl')?'active-lang':'',
        activeEN: (lang === 'en')?'active-lang':'',
        langCloseExercise: translate.closeExercise,
        langNameExercise: function (j) {
            switch (lang) {
                case 'en': return j._en;
                default: return j._pl; // pl
            }
        }
    };
    callExercise = (event,o) => {
        this.setState({
            callObj: o.map(function (obj, i) {
                if(lang === 'pl') {
                    return (
                        <div key={i}>
                            {obj._pl} - {obj._en}
                            <a target='blank_' href={"https://translate.google.pl/#view=home&op=translate&sl=pl&tl=en&text=" + obj._pl}>
                                Google translator
                            </a>
                        </div>
                    )
                } else {
                    return (
                        <div key={i}>
                            {obj._en} - {obj._pl}
                            <a target='blank_' href={"https://translate.google.pl/#view=home&op=translate&sl=en&tl=pl&text=" + obj._en}>
                                Google translator
                            </a>
                        </div>
                    )
                }
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
    setLang = (event,o) => {
        setLanguage(o);
        if(o === 'pl') { // cookies.get('flashcard_cookie') === 'pl'
            cookies.set('flashcard_cookie', 'pl', { path: '/' });
            this.setState({
                activePL: 'active-lang',
                activeEN: ''
            });
        } else if(o === 'en') {
            cookies.set('flashcard_cookie', 'en', { path: '/' });
            this.setState({
                activePL: '',
                activeEN: 'active-lang'
            });
        }
        this.setState({
            langCloseExercise: translate.closeExercise
        });
        lang = o;
        this.clearExercise(event);
        event.preventDefault();
    };
    render() {
        const { title, json } = this.props; // title = this.props.title, json = this.props.json
        const that = this;
        return (
            <div className="json-example">
                <h3>{title}</h3>
                <ul>
                    <li><a href='#pl' className={this.state.activePL} onClick={(e) => that.setLang(e,'pl')}>PL</a></li>
                    <li><a href='#en' className={this.state.activeEN} onClick={(e) => that.setLang(e,'en')}>EN</a></li>
                </ul>
                <ul>
                    <li><a href='#close-exercise' onClick={that.clearExercise}>{this.state.langCloseExercise}</a></li>
                    {json.map(function (obj, i) {
                        return (
                            <li key={i}>
                                <a href='#flashcard' onClick={(e) => that.callExercise(e,obj.data)}>{that.state.langNameExercise(obj.name)}</a>
                            </li>
                        );
                    },that)}
                </ul>
                <div className="call-obj">
                    {this.state.callObj}
                </div>
            </div>
        )
    }
}

export default JsonExample;
