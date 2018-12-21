import React, { Component } from 'react';
//import dataJson from './test1.json';
import './component.css';
import Cookies from 'universal-cookie';

// const script = document.createElement('script');
// script.src = "http://code.responsivevoice.org/responsivevoice.js";
// document.getElementsByTagName('body')[0].appendChild(script);
// window.addEventListener('load',function(){
//     if(typeof responsiveVoice === 'object') {
//         responsiveVoice.setDefaultVoice("Polish Female");
//         responsiveVoice.speak("Cześć");
//     }
// });


let idExercise = -1,
    idItem,
    firstLoadExerciseCookies = true;

//var voice = require('responsiveVoice');
//responsiveVoice.speak("hello world");

//rv.speak("hello world");

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
                buttonCloseExercise: 'Close exercise',
                placeholderFlashCards: 'English version',
                infoCongratulation: 'Congratultaion!',
                buttonInfoCongratulation: 'Back to exercises menu',
                buttonInfoCongratulationRestart: 'Start this exercise all over again',
                buttonIKnow: 'I know',
                buttonIDontKnow: "I don't know",
                buttonCheckOut: 'Check out'
            };
            break;
        default: //pl
            translate = {
                buttonCloseExercise: 'Zamknij ćwiczenie',
                placeholderFlashCards: 'Polska wersja',
                infoCongratulation: 'Gratulacje!',
                buttonInfoCongratulation: 'Wróć do menu ćwiczeń',
                buttonInfoCongratulationRestart: 'Zacznij to ćwiczenie od nowa',
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
        langCongratulation: function (that,ide) {
            //console.log('langCongratulation:');
            //console.log(that.props.json[ide].excludeID);
            //console.log('that.props.json[ide].length:' + that.props.json[ide].data.length);
            that.props.json[ide].excludeID.length=that.props.json[ide].data.length;
            return (
                <div className={'congratulation-info ' + centerClass}>
                    <h3>{translate.infoCongratulation}</h3>
                    <button onClick={() => {
                        that.clearExercise();
                        that.setState({classHideNavButtons: ''})
                    }}>{translate.buttonInfoCongratulation}</button>
                    <button onClick={() => {
                        that.props.json[ide].excludeID=[];
                        cookies.remove('obj_exercise_cookie_'+ide, { path: '/' });
                        that.clearExercise();
                        that.setState({classHideNavButtons: ''});
                        that.setExercise(null,that.props.json[ide].data,ide,that.randomItem(that.props.json[ide]));
                    }}>{translate.buttonInfoCongratulationRestart}</button>
                </div>
            )
        },
        direction: (flashCardDirection === 'right')?'en => pl':'pl => en',
        activePL: (lang === 'pl')?'active-lang':'',
        activeEN: (lang === 'en')?'active-lang':'',
        langButtonCloseExercise: translate.buttonCloseExercise,
        langButtonIKnow: translate.buttonIKnow,
        langButtonIDontKnow: translate.buttonIDontKnow,
        langButtonCheckOut: translate.buttonCheckOut,
        classCheckOut: '',
        classCheckOutMore: '',
        classHideOrShowMainPartsPage: 'show-list-exercise-hide-flash-cards',
        classHideNavButtons: '',

        langNameExercise: function (j) {
            switch (lang) {
                case 'en': return j._en;
                default: return j._pl; // pl
            }
        }
    };
    removeCookieExerciseId = (event,ide,o) => {
        console.log("uswamy cookies");
        cookies.remove('obj_exercise_cookie_'+ide, { path: '/' });
        if(typeof o === 'object') {
            o.excludeID =[];
            this.setState({
                excludeIdLength: o.excludeID.length
            });
        }
        if(event) event.preventDefault();
    };
    translateVoice = (text,lang) => {
        switch (lang) {
            case 'pl': window.responsiveVoice.speak(text, "Polish Female");
                break;
            case 'en': window.responsiveVoice.speak(text, "UK English Male");
                break;
            default:
                window.responsiveVoice.speak(text, "UK English Male");
        }
    };
    setExercise = (event,o,idE,idI) => {
        //console.log('setExercise: ' + id);
        idExercise = idE;
        idItem = idI;
        if(typeof idItem === 'undefined') {
            //idItem = 0;
        }
        console.log(idItem);
        this.setState({
            classCheckOut: '',
            classCheckOutMore: '',
            classHideNavButtons: (typeof idItem === 'undefined')?'d-none':'',
            classHideOrShowMainPartsPage: 'hide-flash-cards-show-list-exercise',
            // eslint-disable-next-line
            callObj: (typeof idItem === 'undefined')?this.state.langCongratulation(this,idExercise,o[idExercise]):o.map(function (obj, i) {
                if(i === idI) {
                    return (
                        <div className="flip-container" key={i}>
                            {
                                flashCardDirection === 'left' ?
                                    <div className="flipper">
                                        <div className={'front ' + centerClass}><p>{obj._pl} <button onClick={() => this.translateVoice(obj._pl, "pl")}>Voice</button></p></div>
                                        <div className={'back ' + centerClass}>
                                            <p>pl: {obj._pl} <button onClick={() => this.translateVoice(obj._pl, "pl") }>Voice</button></p>
                                            <p>
                                                en: {obj._en} <button onClick={() => this.translateVoice(obj._en, "en")}>Voice</button>

                                                <a target='blank_' href={"https://translate.google.pl/#view=home&op=translate&sl=pl&tl=en&text=" + obj._pl}>gt</a>
                                            </p>
                                            </div>
                                    </div>
                                    :
                                    <div className="flipper">
                                        <div className={'front ' + centerClass}><p>{obj._en} <button onClick={() => this.translateVoice(obj._en, "en") }>Voice</button></p></div>
                                        <div className={'back ' + centerClass}>
                                            <p>en: {obj._en} <button onClick={() => this.translateVoice(obj._en, "en")}>Voice</button></p>
                                            <p>
                                                pl: {obj._pl} <button onClick={() => this.translateVoice(obj._pl, "pl") }>Voice</button>

                                                <a target='blank_' href={"https://translate.google.pl/#view=home&op=translate&sl=en&tl=pl&text=" + obj._en}>gt</a>
                                            </p>
                                        </div>
                                    </div>
                            }
                        </div>
                    );
                }

            },this)
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
            langButtonCloseExercise: translate.buttonCloseExercise,
            langButtonIKnow: translate.buttonIKnow,
            langButtonIDontKnow: translate.buttonIDontKnow,
            langButtonCheckOut: translate.buttonCheckOut
        });
        if(idExercise < 0 || (typeof idItem === 'undefined') ) {
            this.setState({
                callObj: (typeof idItem === 'undefined' && idExercise !== -1)?this.state.langCongratulation(this,idExercise):translate.placeholderFlashCards
            });
        }

        lang = o;
        //this.clearExercise(event);
        event.preventDefault();
    };
    changeDirection = (event,o) => {
        //console.log("!!!: " + o[idExercise].data.length + ' | ' + o[idExercise].excludeID.length);
        //console.log(o[idExercise].excludeID);
        console.log('idExercise: ' + idExercise);
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
            const runSetExercise = () => this.setExercise(event,o[idExercise].data,idExercise,this.randomItem(o[idExercise],idItem));
            if(typeof o[idExercise].excludeID !== 'undefined') {
                //if(o[idExercise].excludeID.length !== 0) {
                    runSetExercise();
                //}
            } else {
                runSetExercise();
            }
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
        this.setState({classCheckOutMore: ''});
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
                cookies.set('obj_exercise_cookie_'+idExercise, JSON.stringify(o[idExercise].excludeID), { path: '/' });
            }
            console.log(o[idExercise].excludeID);
            this.setState({classCheckOut: ''});
            setTimeout(this.timeoutAnim,400,this,o);

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
            setTimeout(this.timeoutAnim,400,this,o);
        }
    };
    clearCookiesExercise = (that) => {
        // eslint-disable-next-line
        that.props.json.map(function (obj, i) {
            cookies.remove('obj_exercise_cookie_'+i, { path: '/' });
            obj.excludeID = [];
        });
        this.setState({});
    };
    render() {

        const { title, json } = this.props; // title = this.props.title, json = this.props.json
        const that = this;
        if(firstLoadExerciseCookies){
            console.log('test cookies:');
            // eslint-disable-next-line
            json.map(function (obj, i) {
                if(typeof obj.excludeID  === 'undefined') {
                    obj.excludeID = [];
                }
                if(typeof cookies.get('obj_exercise_cookie_' + i) !== "undefined") {
                    console.log(cookies.get('obj_exercise_cookie_' + i));
                    obj.excludeID = cookies.get('obj_exercise_cookie_' + i);
                }
            });
            console.log('koniec test cookies');
            firstLoadExerciseCookies = false;
        }
        return (
            <div className={'module-flash-cards ' + this.state.classHideOrShowMainPartsPage}>
                <h3>{title}</h3>
                <ul className="list-unstyled">
                    <li><a href={'#pl'} className={this.state.activePL} onClick={(e) => that.setLang(e,'pl')}>PL</a></li>
                    <li><a href={'#en'} className={this.state.activeEN} onClick={(e) => that.setLang(e,'en')}>EN</a></li>
                </ul>
                <button onClick={(e) => that.changeDirection(e,json)}>{this.state.direction}</button>
                <div className={'main-list-exercise'}>
                    <button title={'Clear cookies exercise'} onClick={() => this.clearCookiesExercise(this)}>Reset progress exercise</button>
                    <ul className={'list-unstyled'}>
                        {json.map(function (obj, i) {
                            return (
                                <li key={i}>
                                    <a href={'#flashcard' + i} onClick={(e) => that.setExercise(e,obj.data,i,that.randomItem(obj))}>
                                        {that.state.langNameExercise(obj.name)} ({obj.excludeID.length}/{obj.data.length} = {Math.ceil(obj.excludeID.length*100/obj.data.length)}%)
                                    </a>
                                    <button className={(obj.excludeID.length !==0)?'':'d-none'} onClick={(e) => {that.removeCookieExerciseId(e,i,obj);}}>Reset</button>
                                </li>
                            );
                        },that)}
                    </ul>
                </div>
                <div className={'main-flash-cards ' + this.state.classCheckOut + ' ' + this.state.classCheckOutMore}>
                    <button className="button-close-exercise" onClick={this.clearExercise}>{this.state.langButtonCloseExercise}</button>
                    <div className={'flash-card'}>{this.state.callObj}</div>

                    <nav className={'nav-buttons ' + this.state.classHideNavButtons}>
                        <button className="button-check-out" onClick={() => this.setState({classCheckOut: 'check-out-card', classCheckOutMore: 'check-out-card-more'})}>{this.state.langButtonCheckOut}</button>
                        <button className="button-i-know" onClick={() => this.iKnow(json,idItem)}>{this.state.langButtonIKnow}</button>
                        <button className="button-i-dont-know" onClick={() => this.iDontKnow(json)}>{this.state.langButtonIDontKnow}</button>
                    </nav>
                </div>
            </div>
        )
    }
}

export default FlashCards;
