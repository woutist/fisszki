import React, { Component } from 'react';
//import dataJson from './test1.json';
import './component.css';
import Cookies from 'universal-cookie';

let idExercise = -1,
    idItem,
    firstLoadExerciseCookies = true;

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
                buttonCheckOut: 'Check out',
                textIDontKnow: 'Wrong click',
                textSummary: 'Summary'
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
                buttonCheckOut: 'Sprawdź',
                textIDontKnow: 'Złe kliknięcia',
                textSummary: 'Podsumowanie'
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
            const obj = that.props.json[ide];
            obj.excludeID.length=obj.data.length;

            return (
                <div className={'congratulation-info ' + centerClass}>
                    <h3>{translate.infoCongratulation}</h3>
                    <p className="text-center">{translate.textSummary}: {obj.excludeID.length}/{obj.data.length} ~ {Math.ceil(obj.excludeID.length*100/obj.data.length)}% - {translate.textIDontKnow}: {obj.dontKnowClick}</p>
                    <button onClick={() => {
                        that.clearExercise();
                        that.setState({classHideNavButtons: ''})
                    }}>{translate.buttonInfoCongratulation}</button>
                    <button onClick={() => {
                        obj.excludeID=[];
                        obj.dontKnowClick=0;
                        cookies.remove('obj_exercise_cookie_'+ide, { path: '/' });
                        cookies.remove('obj_exercise_cookie_dk_click_'+ide, { path: '/' });
                        that.clearExercise();
                        that.setState({classHideNavButtons: ''});
                        that.setExercise(null,obj,ide,that);
                    }}>{translate.buttonInfoCongratulationRestart}</button>
                </div>
            )
        },
        direction: (flashCardDirection === 'right')?'en => pl':'pl => en',
        activePL: (lang === 'pl')?'active-lang':'',
        activeEN: (lang === 'en')?'active-lang':'',
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
    generateExercise = () => {

    };
    setExercise = (event,o,idE,that,idForce) => {
        //console.log('setExercise: ' + id);
        idExercise = idE;
        if(idForce) idItem = idForce;
        else idItem = that.randomItem(o);

        console.log(o.excludeID.length + " --- " + o.data.length);
        this.setState({
            classCheckOut: '',
            classCheckOutMore: '',
            classHideNavButtons: (o.excludeID.length === o.data.length)?'d-none':'',
            classHideOrShowMainPartsPage: 'hide-flash-cards-show-list-exercise',
            // eslint-disable-next-line
            callObj: (o.excludeID.length === o.data.length)?this.state.langCongratulation(this,idExercise):o.data.map(function (obj, i) {
                if(i === idItem) {
                    return (
                        <div key={i}>
                            <h3>{that.state.langNameExercise(o.name)}</h3>
                            <p>{translate.textIDontKnow}: {o.dontKnowClick} | {o.excludeID.length}/{o.data.length} = {Math.ceil(o.excludeID.length*100/o.data.length)}%</p>
                            <div className="flip-container">
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
                        </div>
                    );
                }

            },this)
        });
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
    setLang = (event,o,langName) => {
        setLanguage(langName);
        if(langName === 'pl') { // cookies.get('language_cookie') === 'pl'
            cookies.set('language_cookie', 'pl', { path: '/' });
            this.setState({
                activePL: 'active-lang',
                activeEN: ''
            });
        } else if(langName === 'en') {
            cookies.set('language_cookie', 'en', { path: '/' });
            this.setState({
                activePL: '',
                activeEN: 'active-lang'
            });
        }
        // this.setState();
        console.log("check:");
        console.log(idItem);
        console.log(idExercise);
        // after load page
        if(idExercise < 0 || (typeof idItem === 'undefined') ) {
            this.setState({
                callObj: (typeof idItem === 'undefined' && idExercise !== -1)?this.state.langCongratulation(this,idExercise):translate.placeholderFlashCards
            });
        } else {

            this.setExercise(event,o[idExercise],idExercise,this,idItem);

        }

        lang = o;
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
            this.setExercise(event,o[idExercise],idExercise,this,idItem);
        }
        event.preventDefault();
    };
    randomItem = (ol,forceId) => {
        //ol.excludeID
        console.log("t-o: ");
        console.log(ol);
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
                    //ol.excludeID = [];
                }
            }
            else {
                randomNr=Math.floor((Math.random()*ol.data.length));
            }

            return randomNr;
        }

    };
    timeoutAnim = (x,y) => {
        this.setExercise(null,x,y,this);
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
            setTimeout(this.timeoutAnim,400,o[idExercise],idExercise);

            if(o[idExercise].excludeID.length === o[idExercise].data.length){
                this.setState({
                    classHideNavButtons: 'd-none'
                });
            }

        }
    };
    iDontKnow = (o) => {
        if(idExercise > -1) {
            // if(typeof o[idExercise].excludeID !== 'object') {
            //     o[idExercise].excludeID = [];
            // }
            o[idExercise].dontKnowClick += 1;
            cookies.set('obj_exercise_cookie_dk_click_'+idExercise, o[idExercise].dontKnowClick, { path: '/' });
            this.setState({classCheckOut: ''});
            setTimeout(this.timeoutAnim,400,o[idExercise],idExercise);
        }
    };
    removeCookieExerciseId = (event,ide,o) => {
        console.log("uswamy cookies");
        cookies.remove('obj_exercise_cookie_'+ide, { path: '/' });
        cookies.remove('obj_exercise_cookie_dk_click_'+ide, { path: '/' });
        if(typeof o === 'object') {
            o.excludeID =[];
            o.dontKnowClick = 0;

            this.setState({
                //excludeIdLength: o.excludeID.length
            });
        }
        if(event) event.preventDefault();
    };
    removeCookieExerciseAll = () => {
        // eslint-disable-next-line
        this.props.json.map(function (obj, i) {
            cookies.remove('obj_exercise_cookie_'+i, { path: '/' });
            cookies.remove('obj_exercise_cookie_dk_click_'+i, { path: '/' });
            obj.excludeID = [];
            obj.dontKnowClick = 0;
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
                    obj.dontKnowClick = 0;
                }
                if(typeof cookies.get('obj_exercise_cookie_' + i) !== "undefined") {
                    console.log(cookies.get('obj_exercise_cookie_' + i));
                    obj.excludeID = cookies.get('obj_exercise_cookie_' + i);
                }
                if(typeof cookies.get('obj_exercise_cookie_dk_click_' + i) !== "undefined") {
                    console.log('i dont know click: ' + cookies.get('obj_exercise_cookie_dk_click_' + i));
                    obj.dontKnowClick = parseInt(cookies.get('obj_exercise_cookie_dk_click_' + i));
                }
            });
            console.log('koniec test cookies');
            firstLoadExerciseCookies = false;
        }
        return (
            <div className={'module-flash-cards ' + this.state.classHideOrShowMainPartsPage}>
                <h2>{title}</h2>
                <ul className="list-unstyled">
                    <li><a href={'#pl'} className={this.state.activePL} onClick={(e) => this.setLang(e,json,'pl')}>PL</a></li>
                    <li><a href={'#en'} className={this.state.activeEN} onClick={(e) => this.setLang(e,json,'en')}>EN</a></li>
                </ul>
                <button onClick={(e) => this.changeDirection(e,json)}>{this.state.direction}</button>
                <div className={'main-list-exercise'}>
                    <button title={'Clear cookies exercise'} onClick={() => this.removeCookieExerciseAll()}>Reset progress exercise</button>
                    <ul className={'list-unstyled'}>
                        {json.map(function (obj, i) {
                            return (
                                <li key={i}>
                                    <a href={'#flashcard' + i} onClick={(e) => that.setExercise(e,obj,i,that)}>
                                        {that.state.langNameExercise(obj.name)} ({obj.excludeID.length}/{obj.data.length} ~ {Math.ceil(obj.excludeID.length*100/obj.data.length)}% - {translate.textIDontKnow}: {obj.dontKnowClick})
                                    </a>
                                    <button className={(obj.excludeID.length !== 0 || obj.dontKnowClick !== 0)?'':'d-none'} onClick={(e) => {that.removeCookieExerciseId(e,i,obj);}}>Reset</button>
                                </li>
                            );
                        },that)}
                    </ul>
                </div>
                <div className={'main-flash-cards ' + this.state.classCheckOut + ' ' + this.state.classCheckOutMore}>
                    <button className="button-close-exercise" onClick={this.clearExercise}>{translate.buttonCloseExercise}</button>
                    <div className={'flash-card'}>
                        {this.state.callObj}
                    </div>

                    <nav className={'nav-buttons ' + this.state.classHideNavButtons}>
                        <button className="button-check-out" onClick={() => this.setState({classCheckOut: 'check-out-card', classCheckOutMore: 'check-out-card-more'})}>{translate.buttonCheckOut}</button>
                        <button className="button-i-know" onClick={() => this.iKnow(json,idItem)}>{translate.buttonIKnow}</button>
                        <button className="button-i-dont-know" onClick={() => this.iDontKnow(json)}>{translate.buttonIDontKnow}</button>
                    </nav>
                </div>
            </div>
        )
    }
}

export default FlashCards;
