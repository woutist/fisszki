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
const centerClass = 'd-flex align-items-center justify-content-center flex-column';
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
        langCongratulation: function (that) {
            return (
                <div className={'congratulation-info ' + centerClass}>
                    <h3>{translate.infoCongratulation}</h3>
                    <button onClick={() => {that.clearExercise(); that.setState({classHideNavButtons: ''})}}>Back to exercises menu</button>
                </div>
            )
        },
        direction: (flashCardDirection === 'right')?'en => pl':'pl => en',
        activePL: (lang === 'pl')?'active-lang':'',
        activeEN: (lang === 'en')?'active-lang':'',
        langButtonCloseExercise: translate.ButtonCloseExercise,
        langButtonIKnow: translate.buttonIKnow,
        langButtonIDontKnow: translate.buttonIDontKnow,
        langButtonCheckOut: translate.buttonCheckOut,
        classCheckOut: '',
        classHideOrShowMainPartsPage: 'show-list-exercise-hide-flash-cards',
        classHideNavButtons: '',
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
            classHideOrShowMainPartsPage: 'hide-flash-cards-show-list-exercise',
            // eslint-disable-next-line
            callObj: (typeof idItem === 'undefined')?this.state.langCongratulation(this):o.map(function (obj, i) {
                if(i === idI) {
                    return (
                        <div className="flip-container" key={i}>
                            {
                                flashCardDirection === 'left' ?
                                    <div className="flipper">
                                        <div className={'front ' + centerClass}><p>{obj._pl}</p></div>
                                        <div className={'back ' + centerClass}>
                                            <p>pl: {obj._pl}</p>
                                            <p>
                                                en: {obj._en}
                                                <a target='blank_' href={"https://translate.google.pl/#view=home&op=translate&sl=pl&tl=en&text=" + obj._pl}>gt</a>
                                            </p>
                                            </div>
                                    </div>
                                    :
                                    <div className="flipper">
                                        <div className={'front ' + centerClass}><p>{obj._en}</p></div>
                                        <div className={'back ' + centerClass}>
                                            <p>en: {obj._en}</p>
                                            <p>
                                                pl: {obj._pl}
                                                <a target='blank_' href={"https://translate.google.pl/#view=home&op=translate&sl=en&tl=pl&text=" + obj._en}>gt</a>
                                            </p>
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
            callObj: translate.placeholderFlashCards,
            classHideOrShowMainPartsPage: 'show-list-exercise-hide-flash-cards',
            classHideNavButtons: ''
        });
        if(event) event.preventDefault();
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
                callObj: (typeof idItem === 'undefined' && idExercise !== -1)?this.state.langCongratulation(this):translate.placeholderFlashCards
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
        //console.log("!!!: " + o[idExercise].data.length + ' | ' + o[idExercise].excludeID.length);
        if(idExercise > -1 && o[idExercise].excludeID.length !== 0) {
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

            if(o[idExercise].excludeID.length === o[idExercise].data.length){
                this.setState({
                    classHideNavButtons: 'd-none'
                });
            }
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
            <div className={'module-flash-cards ' + this.state.classHideOrShowMainPartsPage}>
                <h3>{title}</h3>
                <ul className="list-unstyled">
                    <li><a href={'#pl'} className={this.state.activePL} onClick={(e) => that.setLang(e,'pl')}>PL</a></li>
                    <li><a href={'#en'} className={this.state.activeEN} onClick={(e) => that.setLang(e,'en')}>EN</a></li>
                </ul>
                <button onClick={(e) => that.changeDirection(e,json)}>{this.state.direction}</button>
                <ul className={'main-list-exercise list-unstyled'}>
                    {json.map(function (obj, i) {
                        return (
                            <li key={i}>
                                <a href={'#flashcard' + i} onClick={(e) => that.setExercise(e,obj.data,i,that.randomItem(obj))}>
                                    {that.state.langNameExercise(obj.name)} ({obj.data.length} / {(typeof obj.excludeID === 'undefined')?0:obj.excludeID.length})
                                </a>
                            </li>
                        );
                    },that)}
                </ul>
                <div className={'main-flash-cards ' + this.state.classCheckOut}>
                    <button className="button-close-exercise" onClick={this.clearExercise}>{this.state.langButtonCloseExercise}</button>
                    <div className={'flash-card'}>{this.state.callObj}</div>

                    <nav className={'nav-buttons ' + this.state.classHideNavButtons}>
                        <button className="button-check-out" onClick={() => this.setState({classCheckOut: 'check-out-card'})}>{this.state.langButtonCheckOut}</button>
                        <button className="button-i-know" onClick={() => this.iKnow(json,idItem)}>{this.state.langButtonIKnow}</button>
                        <button className="button-i-dont-know" onClick={() => this.iDontKnow(json)}>{this.state.langButtonIDontKnow}</button>
                    </nav>
                </div>
            </div>
        )
    }
}

export default FlashCards;
