import React, { Component } from 'react';
import './component.css';
import Cookies from 'universal-cookie';
import Swipe from 'react-easy-swipe';
import dataJson from './data_json/data.json';

/**
 * GLOBAL SETTINGS
 */
let idExercise = -1,
    idItem,
    firstLoadExerciseCookies = true,
    lang,
    translate = {},
    flashCardDirection,
    uniqueCategory  = [],
    isIE = /*@cc_on!@*/false || !!document.documentMode;

const cookies = new Cookies(),
    cookiesMaxAge = 60*60*24*7*4*12,
    centerClass = 'd-flex align-items-center justify-content-center flex-column';

const setCookies = (name, value) => {
    cookies.set(name, value, { path: '/', maxAge: cookiesMaxAge });
};
const removeCookies = (name) => {
    cookies.remove(name, { path: '/', maxAge: cookiesMaxAge });
};

let arrayUnique = function (arr) {
    return arr.filter(function(item, index){
        return arr.indexOf(item) >= index;
    });
};

// COOKIES LANGUAGE
const setLanguage = (x) => {
    switch (x) {
        case 'en':
            translate = {
                buttonCloseExercise: 'Your state will be automatically saved',
                infoCongratulation: 'Congratultaion!',
                buttonInfoCongratulation: 'Back to exercises menu',
                buttonInfoCongratulationRestart: 'Start this exercise all over again',
                buttonIKnow: 'I knew',
                buttonIDontKnow: "I don't knew",
                buttonCheckOut: 'Check out',
                textSummary: 'Summary'
            };
            break;
        default: //pl
            translate = {
                buttonCloseExercise: 'Twój stan zostanie automatycznie zapisany',
                infoCongratulation: 'Gratulacje!',
                buttonInfoCongratulation: 'Wróć do menu ćwiczeń',
                buttonInfoCongratulationRestart: 'Zacznij to ćwiczenie od nowa',
                buttonIKnow: 'Wiedziałem/am',
                buttonIDontKnow: "Nie wiedziałem/am",
                buttonCheckOut: 'Sprawdź',
                textSummary: 'Podsumowanie'
            };
    }
};
if(typeof cookies.get('language_cookie') === "undefined") {
    cookies.set('language_cookie', 'pl', { path: '/', maxAge: cookiesMaxAge });
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
if(typeof cookies.get('flashcards_cookie') === "undefined") {
    cookies.set('flashcards_cookie', 'left', { path: '/', maxAge: cookiesMaxAge });
    flashCardDirection = 'left';
} else {
    if(cookies.get('flashcards_cookie') === 'left') {
        flashCardDirection = 'left';
    } else {
        flashCardDirection = 'right';
    }
}

/**
 * Sub component Congratulation
 */
class Congratulation extends Component {
    render() {
        const {that, ide} = this.props;
        const obj = dataJson[ide];
        obj.excludeID.length=obj.data.length;
        return (
            <div className={'congratulation-info ' + centerClass}>
                <h2>{translate.infoCongratulation}<span className="icon-award"></span></h2>
                <h3>"{that.state.langNameExercise(obj.name)}"</h3>
                <p className="text-center">{translate.textSummary}:  <span className="icon-up color-5">{obj.excludeID.length}/{obj.data.length} = {Math.ceil(obj.excludeID.length*100/obj.data.length)}%</span> - <span className="icon-down color-6">{obj.dontKnowClick}</span></p>
                <button className="border-content-bottom" onClick={() => {
                    that.clearExercise();
                    that.setState({classHideNavButtons: ''})
                }}>{translate.buttonInfoCongratulation}</button>
                <button className="border-content-bottom" onClick={() => {
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
    }
}

/**
 * Sub component Exercises
 */
class Exercises extends Component {
    render() {
        const { o, that, voice } = this.props;
        return (
            // eslint-disable-next-line
            o.data.map(function (obj, i) {
                if(i === idItem) {
                    let percent = Math.ceil(o.excludeID.length*100/o.data.length),
                        stylePercent = {
                            background: 'linear-gradient(to right, #2c8548 0%,#2c8548 ' + percent + '%,#974c49 ' + percent + '%,#974c49 100%)'
                        };

                    if(voice) {
                        if(flashCardDirection === 'left') {
                            that.translateVoice(obj._pl, "pl");
                        } else {
                            that.translateVoice(obj._en, "en");
                        }
                    }

                    return (
                        <div className={'flash-card-inset' + (isIE?' ie-fix':'')} key={i}>
                            <span className="percent-pro" style={stylePercent}></span>
                            <h2>{that.state.langNameExercise(o.category) && that.state.langNameExercise(o.category) + ' / '}{that.state.langNameExercise(o.name)}</h2>
                            <p><span className="icon-up color-5">{o.excludeID.length}/{o.data.length} = {Math.ceil(o.excludeID.length*100/o.data.length)}%</span> - <span className="icon-down color-6">{o.dontKnowClick}</span></p>
                            <div className="flip-container">
                                {
                                    flashCardDirection === 'left' ?
                                        <div className="flipper">
                                            <div className={'front ' + centerClass}><p onClick={() => that.translateVoice(obj._pl, "pl")}><strong>pl:</strong><span className="icon-volume"></span><span>{obj._pl}</span></p></div>
                                            <div className={'back ' + centerClass}>
                                                <p onClick={() => that.translateVoice(obj._pl, "pl") }><strong>pl:</strong><span className="icon-volume" onClick={() => that.translateVoice(obj._pl, "pl") }></span><span>{obj._pl}</span></p>
                                                <hr />
                                                <p onClick={() => that.translateVoice(obj._en, "en")}>
                                                    <strong>en:</strong><span className="icon-volume"></span><span>{obj._en}</span>
                                                </p>
                                                <a className="google-translator" target='blank_' href={"https://translate.google.pl/#view=home&op=translate&sl=pl&tl=en&text=" + obj._pl}>Check it in the Google Translator<span className="icon-language"></span></a>
                                            </div>
                                        </div>
                                        :
                                        <div className="flipper">
                                            <div className={'front ' + centerClass}><p onClick={() => that.translateVoice(obj._en, "en")}><strong>en:</strong><span className="icon-volume"></span><span>{obj._en}</span></p></div>
                                            <div className={'back ' + centerClass}>
                                                <p onClick={() => that.translateVoice(obj._en, "en")}><strong>en:</strong><span className="icon-volume"></span><span>{obj._en}</span></p>
                                                <hr />
                                                <p onClick={() => that.translateVoice(obj._pl, "pl") }>
                                                    <strong>pl:</strong><span className="icon-volume"></span><span>{obj._pl}</span>
                                                </p>
                                                <a className="google-translator" target='blank_' href={"https://translate.google.pl/#view=home&op=translate&sl=en&tl=pl&text=" + obj._en}>Check it in the Google translator<span className="icon-language"></span></a>
                                            </div>
                                        </div>
                                }
                            </div>
                        </div>
                    );
                }

            },that)
        )
    }
}


/**
 * Main component FlashCards
 */
class FlashCards extends Component {
    state = {
        callObj: '',
        langCongratulation: false,
        direction: (flashCardDirection === 'right')?'English | Polish':'Polish | English',
        activePL: (lang === 'pl')?'active-lang':'',
        activeEN: (lang === 'en')?'active-lang':'',
        classCheckOut: '',
        classCheckOutMore: '',
        classHideOrShowMainPartsPage: 'show-list-exercise-hide-flash-cards',
        classHideNavButtons: '',
        categoryActive: [],
        navMobileActive: '',
        rotateDisable: (typeof cookies.get('disable_rotate_cookie') === "undefined")?'':'rotate-disable',
        enableAutoVoice: '',
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
    setExercise = (event,o,idE,that,idForce) => {
        idExercise = idE;
        if(idForce) idItem = idForce;
        else idItem = that.randomItem(o);

        this.setState({
            classCheckOut: '',
            classCheckOutMore: '',
            classHideNavButtons: (o.excludeID.length === o.data.length)?'d-none':'',
            classHideOrShowMainPartsPage: 'hide-flash-cards-show-list-exercise',
            callObj: (o.excludeID.length === o.data.length)?<Congratulation that={that} ide={idExercise} />:<Exercises o={o} that={that} voice={this.state.enableAutoVoice} />
        });
        if(event) event.preventDefault();
    };
    clearExercise = event => {
        idExercise = -1;
        this.setState({
            callObj: '',
            classHideOrShowMainPartsPage: 'show-list-exercise-hide-flash-cards',
            classHideNavButtons: ''
        });
        if(event) event.preventDefault();
    };
    setLang = (event,o,langName) => {
        setLanguage(langName);
        lang = langName;
        if(langName === 'pl') {
            setCookies('language_cookie', 'pl');
            this.setState({
                activePL: 'active-lang',
                activeEN: ''
            });
        }
        if(langName === 'en') {
            setCookies('language_cookie', 'en');
            this.setState({
                activePL: '',
                activeEN: 'active-lang'
            });
        }

        // after load page
        if(idExercise < 0 || (typeof idItem === 'undefined') ) {
            this.setState({
                callObj: (typeof idItem === 'undefined' && idExercise !== -1)?<Congratulation that={this} ide={idExercise} />:''
            });
        } else {
            this.setExercise(event,o[idExercise],idExercise,this,idItem);
        }
        event.preventDefault();
    };
    changeDirection = (event,o) => {
        if(flashCardDirection === 'left') {
            setCookies('flashcards_cookie', 'right');
            flashCardDirection = 'right';
            this.setState({
                direction: 'English | Polish'
            });
        } else {
            setCookies('flashcards_cookie', 'left');
            flashCardDirection = 'left';
            this.setState({
                direction: 'Polish | English'
            });
        }
        if(idExercise > -1) {
            this.setExercise(event,o[idExercise],idExercise,this,idItem);
        }
        event.preventDefault();
    };
    randomItem = (ol,forceId) => {
        if(forceId) {
            return forceId;
        }
        else {
            let unique, randomNr;
            if(typeof ol.excludeID === 'object' && ol.excludeID.length > 0){
                if(ol.excludeID.length < ol.data.length) {
                    do {
                        unique=true;
                        randomNr=Math.floor((Math.random()*ol.data.length));
                        for(let i=0; i<ol.excludeID.length; i++) { if(ol.excludeID[i]===randomNr) unique=false; }
                    } while (!unique);
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
            if(o[idExercise].excludeID.length < o[idExercise].data.length && typeof idI !== 'undefined' ) {
                o[idExercise].excludeID.push(idI);
                setCookies('obj_exercise_cookie_'+idExercise, JSON.stringify(o[idExercise].excludeID));
            }
            this.setState({classCheckOut: ''});
            setTimeout(this.timeoutAnim,(this.state.rotateDisable)?0:400,o[idExercise],idExercise);
            if(o[idExercise].excludeID.length === o[idExercise].data.length){
                this.setState({
                    classHideNavButtons: 'd-none'
                });
            }

        }
    };
    iDontKnow = (o) => {
        if(idExercise > -1) {
            o[idExercise].dontKnowClick += 1;
            setCookies('obj_exercise_cookie_dk_click_'+idExercise, o[idExercise].dontKnowClick);
            this.setState({classCheckOut: ''});
            setTimeout(this.timeoutAnim,400,o[idExercise],idExercise);
        }
    };
    checkOut = () => {
        //console.log(idExercise + ' / ' + idItem + ' / ' + flashCardDirection); // left = polish, right = english
        //console.log(dataJson[idExercise].data[idItem]._en);
        if(this.state.enableAutoVoice) {
            setTimeout(function (that) {
                if(flashCardDirection === 'left') {
                    that.translateVoice(dataJson[idExercise].data[idItem]._en, "en");
                } else {
                    that.translateVoice(dataJson[idExercise].data[idItem]._pl, "pl");
                }
            }, 300,this);
        }
        this.setState({
            classCheckOut: 'check-out-card',
            classCheckOutMore: 'check-out-card-more'
        })
    };
    removeCookieExerciseId = (event,ide,o) => {
        removeCookies('obj_exercise_cookie_'+ide);
        removeCookies('obj_exercise_cookie_dk_click_'+ide);
        if(typeof o === 'object') {
            o.excludeID =[];
            o.dontKnowClick = 0;
            this.setState({});
        }
        if(event) event.preventDefault();
    };
    removeCookieExerciseAll = () => {
        // eslint-disable-next-line
        dataJson.map(function (obj, i) {
            removeCookies('obj_exercise_cookie_'+i);
            removeCookies('obj_exercise_cookie_dk_click_'+i);
            obj.excludeID = [];
            obj.dontKnowClick = 0;
        });
        this.setState({});
    };
    uniqueCategory = (jo,that,ifFirstLoad) => {
        uniqueCategory = [];
        // eslint-disable-next-line
        jo.map(function (obj, i) {
            uniqueCategory.push(that.state.langNameExercise(obj.category))
        });
        uniqueCategory = arrayUnique(uniqueCategory);
        let tmp = that.state.categoryActive;
        that.state.categoryActive = [];
        for(let i=0,iLength=uniqueCategory.length; i<iLength; i++){
            that.state.categoryActive.push(ifFirstLoad?false:tmp[i]);

        }
    };
    showCategory = (index) => {
        let tmp = this.state.categoryActive;
        // if(tmp[index]) {
        //     tmp[index] = false;
        // } else {
        //     tmp[index] = true;
        // }
        tmp[index] = !tmp[index];
        this.setState({categoryActive: tmp });
        //console.log(tmp[index]);
    };
    navMobileActive = (ifSwipe) => {
        if(ifSwipe){
            this.setState({
                navMobileActive: ''
            });
        } else {
            this.setState({
                navMobileActive: (this.state.navMobileActive)?'':'nav-mobile-active'
            });
        }
    };
    disableRotate = () => {
        if(this.state.rotateDisable) {
            removeCookies('disable_rotate_cookie');
        } else {
            setCookies('disable_rotate_cookie',true);
        }
        this.setState({
            rotateDisable: (this.state.rotateDisable)?'':'rotate-disable'
        })
    };
    enableAutoVoice = () => {
        this.setState({
            enableAutoVoice: (this.state.enableAutoVoice)?'':'enable-auto-voice'
        })
    };
    globalVar = {
    };
    render() {
        const { title } = this.props,
            json = dataJson,
            that = this;
        if(firstLoadExerciseCookies){
            // eslint-disable-next-line
            json.map(function (obj, i) {
                if(typeof obj.excludeID  === 'undefined') {
                    obj.excludeID = [];
                    obj.dontKnowClick = 0;
                }
                if(typeof cookies.get('obj_exercise_cookie_' + i) !== "undefined") {
                    obj.excludeID = cookies.get('obj_exercise_cookie_' + i);
                }
                if(typeof cookies.get('obj_exercise_cookie_dk_click_' + i) !== "undefined") {
                    obj.dontKnowClick = parseInt(cookies.get('obj_exercise_cookie_dk_click_' + i));
                }
            });
            this.uniqueCategory(json,this,true);
            firstLoadExerciseCookies = false;

        }
        this.uniqueCategory(json,this,false);
        let directionState = this.state.direction.split("|");

        return (
            <Swipe onSwipeRight={() => this.navMobileActive(true)}>
                <div className={'module-flash-cards ' + this.state.classHideOrShowMainPartsPage + ' ' + this.state.navMobileActive + ' ' + this.state.rotateDisable + ' ' + this.state.enableAutoVoice}>

                    <header className="main-header">
                        <nav className="main-nav">
                            <button onClick={() => this.navMobileActive()} className="hamburger"><span></span><span></span><span></span></button>
                            <div className="main-nav-inset">
                                <ul className="list-unstyled">
                                    <li><button className="enable-auto-voice border-content-bottom" onClick={this.enableAutoVoice}><span className="icon-volume"></span> Enable auto voice</button></li>
                                    <li><button className="close-rotate border-content-bottom" onClick={this.disableRotate}><span className="icon-ok"></span> Disable rotate</button></li>
                                    <li><button className="rest-all border-content-bottom" title={'Clear cookies exercise'} onClick={() => {this.removeCookieExerciseAll(); this.clearExercise(); }}><span className="icon-cancel-circled"></span> Restart progress</button></li>

                                </ul>
                            </div>
                        </nav>
                        <ul className="list-language d-flex flex-row list-unstyled">
                            <li className="flag-pl"><a href={'#pl'} className={this.state.activePL} onClick={(e) => this.setLang(e,json,'pl')}>PL</a></li>
                            <li className="flag-en"><a href={'#en'} className={this.state.activeEN} onClick={(e) => this.setLang(e,json,'en')}>EN</a></li>
                        </ul>
                        <h1>{title}</h1>
                        <button className="direction-lang" onClick={(e) => this.changeDirection(e,json)}>{directionState[0]} <span className="icon-exchange"></span> {directionState[1]}</button>
                    </header>

                    <div className={'main-list-exercise'}>
                        {uniqueCategory.map(function (obj_category, j) {
                            return (
                                <div className="category-box" key={j}>
                                    {obj_category && <h2 onClick={() => that.showCategory(j)} id={'category-' + j} className={that.state.categoryActive[j]?'category-active':null}>{obj_category} <span className="icon-down-open"></span></h2>}
                                    <ul className={'main-list-exercise-inset list-unstyled'}>
                                        {/* eslint-disable-next-line */}
                                        {json.map(function (obj, i) {
                                            let percent = Math.ceil(obj.excludeID.length*100/obj.data.length),
                                                stylePercent = {
                                                    background: 'linear-gradient(to right, #2c8548 0%,#2c8548 ' + percent + '%,#974c49 ' + percent + '%,#974c49 100%)'
                                                };
                                            if(that.state.langNameExercise(obj.category) === obj_category) {
                                                return (
                                                    <li key={i} className="d-flex justify-content-between">

                                                        <button className={'border-content-bottom' +((obj.excludeID.length !== 0 || obj.dontKnowClick !== 0)?'':' d-none')} onClick={(e) => {that.removeCookieExerciseId(e,i,obj);}}>Reset</button>

                                                        <a href={'#flashcard' + i} onClick={(e) => that.setExercise(e,obj,i,that)}>
                                                            <span className="percent-pro" style={stylePercent}></span>
                                                            {that.state.langNameExercise(obj.name)} <i><span className="icon-up color-5">{obj.excludeID.length}/{obj.data.length} = {percent}%</span> - <span className="icon-down color-6">{obj.dontKnowClick}</span></i>
                                                        </a>

                                                    </li>
                                                );
                                            }

                                        },that)}
                                    </ul>
                                </div>
                            );
                        },that)}
                    </div>
                    <div className={'main-flash-cards ' + this.state.classCheckOut + ' ' + this.state.classCheckOutMore}>
                        <button className="button-close-exercise icon-cancel" onClick={this.clearExercise}><span>{translate.buttonCloseExercise} <i className="icon-right"></i></span></button>

                        <div className={'flash-card'}>
                            {this.state.callObj}
                        </div>

                        <nav className={'nav-buttons ' + this.state.classHideNavButtons}>
                            <button className="button-check-out" onClick={() => this.checkOut()}>{translate.buttonCheckOut}</button>
                            <button title={translate.buttonIKnow} className="button-i-know" onClick={() => this.iKnow(json,idItem)}><span className="icon-ok"></span></button>
                            <button title={translate.buttonIDontKnow} className="button-i-dont-know" onClick={() => this.iDontKnow(json)}><span className="icon-cancel"></span></button>
                        </nav>
                    </div>
                    <footer className="main-footer">
                        <p>Copyright &copy; 1518, {title} pl-en/en-pl v1.0.0</p>
                    </footer>
                </div>
            </Swipe>
        );
    }
}

export default FlashCards;
