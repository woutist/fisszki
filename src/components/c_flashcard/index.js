import React, { Component } from 'react';
//import dataJson from './test1.json';
import './component.css';
import Cookies from 'universal-cookie';

let idExercise = -1, idItem;

/**
 * COOKIES LANGUAGE
 */
// COOKIES LANGUAGE
const cookies = new Cookies();
let lang, translate = {};
const setLanguage = (x) => {
    switch (x) {
        case 'en':
            translate = {
                ButtonCloseExercise: 'Close exercise',
                placeholderFlashCards: 'English version',
                infoCongratulation: 'Congratultaion!',
                buttonIKnow: 'I know',
                buttonIDontKnow: "I don't know",
                buttonCheckOut: 'Check out'
            };
            break;
        default: //pl
            translate = {
                ButtonCloseExercise: 'Zamknij ćwiczenie',
                placeholderFlashCards: 'Polska wersja',
                infoCongratulation: 'Gratulacje!',
                buttonIKnow: 'Wiem',
                buttonIDontKnow: "Nie wiem",
                buttonCheckOut: 'Sprawdź'
            };
    }
};
if(typeof cookies.get('language_cookie') === "undefined") {
    //console.log("cookie nie ustawione");
    cookies.set('language_cookie', 'pl', { path: '/' });
    lang = 'pl';
} else {
    if(cookies.get('language_cookie') === 'pl') {
        lang = 'pl';
    } else {
        lang = 'en';
    }
}
setLanguage(lang);

// COOKIES FLASHCARDS DIRECTION
let flashCardDirection;
if(typeof cookies.get('flashcards_cookie') === "undefined") {
    //console.log("cookie nie ustawione");
    cookies.set('flashcards_cookie', 'left', { path: '/' });
    flashCardDirection = 'left';
} else {
    if(cookies.get('flashcards_cookie') === 'left') {
        flashCardDirection = 'left';
    } else {
        flashCardDirection = 'right';
    }
}

/**
 * COMPONENT FLASHCARDS
 */
class FlashCards extends Component {
    state = {
        callObj: translate.placeholderFlashCards,
        langCongratulation: translate.infoCongratulation,
        direction: (flashCardDirection === 'right')?'en => pl':'pl => en',
        activePL: (lang === 'pl')?'active-lang':'',
        activeEN: (lang === 'en')?'active-lang':'',
        langButtonCloseExercise: translate.ButtonCloseExercise,
        langButtonIKnow: translate.buttonIKnow,
        langButtonIDontKnow: translate.buttonIDontKnow,
        langButtonCheckOut: translate.buttonCheckOut,
        classCheckOut: '',
        langNameExercise: function (j) {
            switch (lang) {
                case 'en': return j._en;
                default: return j._pl; // pl
            }
        }
    };
    setExercise = (event,o,idE,idI) => {
        //console.log('setExercise: ' + id);
        idExercise = idE;
        idItem = idI;
        console.log(idItem);
        this.setState({
            classCheckOut: '',
            // eslint-disable-next-line
            callObj: (typeof idItem === 'undefined')?this.state.langCongratulation:o.map(function (obj, i) {
                const centerClass = 'd-flex align-items-center justify-content-center';
                if(i === idI) {
                    return (
                        <div className="flip-container" key={i}>
                            {
                                flashCardDirection === 'left' ?
                                    <div className="flipper">
                                        <div className={'front ' + centerClass}>{obj._pl}</div>
                                        <div className={'back ' + centerClass}>
                                            {obj._en}
                                            <a target='blank_' href={"https://translate.google.pl/#view=home&op=translate&sl=pl&tl=en&text=" + obj._pl}>gt</a>
                                            </div>
                                    </div>
                                    :
                                    <div className="flipper">
                                        <div className={'front ' + centerClass}>{obj._en}</div>
                                        <div className={'back ' + centerClass}>
                                            {obj._pl}
                                            <a target='blank_' href={"https://translate.google.pl/#view=home&op=translate&sl=en&tl=pl&text=" + obj._en}>gt</a>
                                        </div>
                                    </div>
                            }
                        </div>
                    );
                }

            })
        });
        //congratulation = false;
        if(event) event.preventDefault();
    };
    clearExercise = event => {
        idExercise = -1;
        this.setState({
            callObj: translate.placeholderFlashCards
        });
        event.preventDefault();
    };
    setLang = (event,o) => {
        setLanguage(o);
        if(o === 'pl') { // cookies.get('language_cookie') === 'pl'
            cookies.set('language_cookie', 'pl', { path: '/' });
            this.setState({
                activePL: 'active-lang',
                activeEN: ''
            });
        } else if(o === 'en') {
            cookies.set('language_cookie', 'en', { path: '/' });
            this.setState({
                activePL: '',
                activeEN: 'active-lang'
            });
        }
        this.setState({
            langButtonCloseExercise: translate.ButtonCloseExercise,
            langButtonIKnow: translate.buttonIKnow,
            langButtonIDontKnow: translate.buttonIDontKnow,
            langButtonCheckOut: translate.buttonCheckOut
        });
        if(idExercise < 0 || (typeof idItem === 'undefined') ) {
            this.setState({
                callObj: (typeof idItem === 'undefined' && idExercise !== -1)?translate.infoCongratulation:translate.placeholderFlashCards
            });
        }

        lang = o;
        //this.clearExercise(event);
        event.preventDefault();
    };
    changeDirection = (event,o) => {
        if(flashCardDirection === 'left') {
            cookies.set('flashcards_cookie', 'right', { path: '/' });
            flashCardDirection = 'right';
            this.setState({
                direction: 'en => pl'
            });
        } else {
            cookies.set('flashcards_cookie', 'left', { path: '/' });
            flashCardDirection = 'left';
            this.setState({
                direction: 'pl => en'
            });
        }
        if(idExercise > -1) {
            //console.log('id inset changeDirection: ' + idExercise);
            this.setExercise(event,o[idExercise].data,idExercise,this.randomItem(o[idExercise],idItem));
        }

        event.preventDefault();
    };
    randomItem = (ol,forceId) => {
        //ol.excludeID
        if(forceId) {
            return forceId;
        }
        else {
            let unique, randomNr;
            //console.log(ol.data);
            if(typeof ol.excludeID === 'object' && ol.excludeID.length > 0){
                if(ol.excludeID.length < ol.data.length) {
                    console.log(ol.excludeID.length + '<' + ol.data.length)
                    do {
                        unique=true;
                        randomNr=Math.floor((Math.random()*ol.data.length));
                        for(let i=0; i<ol.excludeID.length; i++) { if(ol.excludeID[i]===randomNr) unique=false; }
                    } while (!unique);
                }
                else {
                    ol.excludeID = [];
                }
            }
            else {
                randomNr=Math.floor((Math.random()*ol.data.length));
            }

            return randomNr;
        }

    };
    timeoutAnim = (x,y) => {
        x.setExercise(null,y[idExercise].data,idExercise,x.randomItem(y[idExercise]));
    };
    iKnow = (o,idI) => {
        if(idExercise > -1) {
            if(typeof o[idExercise].excludeID !== 'object') {
                o[idExercise].excludeID = [];
            }
            console.log(idExercise);
            console.log('idI: ' + idI);
            if(o[idExercise].excludeID.length < o[idExercise].data.length && typeof idI !== 'undefined' ) {
                o[idExercise].excludeID.push(idI);
            }
            console.log(o[idExercise].excludeID);
            this.setState({classCheckOut: ''});
            setTimeout(this.timeoutAnim,600,this,o);
            //this.setExercise(null,o[idExercise].data,idExercise,this.randomItem(o[idExercise]));
        }
    };
    iDontKnow = (o) => {
        if(idExercise > -1) {
            if(typeof o[idExercise].excludeID !== 'object') {
                o[idExercise].excludeID = [];
            }
            this.setState({classCheckOut: ''});
            setTimeout(this.timeoutAnim,600,this,o);
        }
    };
    render() {
        const { title, json } = this.props; // title = this.props.title, json = this.props.json
        const that = this;
        return (
            <div className="module-flash-cards">
                <h3>{title}</h3>
                <ul className="list-unstyled">
                    <li><a href={'#pl'} className={this.state.activePL} onClick={(e) => that.setLang(e,'pl')}>PL</a></li>
                    <li><a href={'#en'} className={this.state.activeEN} onClick={(e) => that.setLang(e,'en')}>EN</a></li>
                </ul>
                <button onClick={(e) => that.changeDirection(e,json)}>{this.state.direction}</button>
                <ul className="list-unstyled">
                    {json.map(function (obj, i) {
                        return (
                            <li key={i}>
                                <a href={'#flashcard' + i} onClick={(e) => that.setExercise(e,obj.data,i,that.randomItem(obj))}>{that.state.langNameExercise(obj.name)}</a>
                            </li>
                        );
                    },that)}
                </ul>
                <div className={'flash-cards-main ' + this.state.classCheckOut}>
                    <button className="button-close-exercise" onClick={that.clearExercise}>{this.state.langButtonCloseExercise}</button>
                    <div className={'flash-card'}>{this.state.callObj}</div>

                    <button className="button-check-out" onClick={() => this.setState({classCheckOut: 'check-out-card'})}>{this.state.langButtonCheckOut}</button>
                    <button className="button-i-know" onClick={() => that.iKnow(json,idItem)}>{this.state.langButtonIKnow}</button>
                    <button className="button-i-dont-know" onClick={() => that.iDontKnow(json)}>{this.state.langButtonIDontKnow}</button>
                </div>
            </div>
        )
    }
}

export default FlashCards;
