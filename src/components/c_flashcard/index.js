import React, { Component } from 'react';
import './component.css';
import {setCookies, removeCookies, getCookies} from './cookies';
import Swipe from 'react-easy-swipe';
import dataJson from './data_json/data.json';
import { detectionDevice, isIE, centerClass } from './varibles';
import { translate, setLanguage } from './language';
import ReactResizeDetector from 'react-resize-detector';
import Parser from 'html-react-parser';

//import { Detector, Online, Offline } from 'react-detect-offline';

const Detector = !isIE && require('react-detect-offline').Detector;

/**
 * Sub component Congratulation
 */
class Congratulation extends Component {
    render() {
        const {that, ide, idC} = this.props;
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
                    removeCookies('obj_exercise_cookie_'+ide);
                    removeCookies('obj_exercise_cookie_dk_click_'+ide);
                    // cookies.remove('obj_exercise_cookie_'+ide, { path: '/' });
                    // cookies.remove('obj_exercise_cookie_dk_click_'+ide, { path: '/' });
                    that.clearExercise();
                    that.setState({classHideNavButtons: ''});
                    that.setExercise(null,ide,false,false,idC);
                }}>{translate.buttonInfoCongratulationRestart}</button>
            </div>
        )
    }
}

/**
 * Sub component Exercises
 */
class Exercises extends Component {
    constructor(props){
        super(props);
        this.state = {
            autoPlayExercise2: false
        };
    };
    render() {
        const { o, that, voice, idItem, checkvoice, flashCardDirection, idC } = this.props;
        const thisComponent = this;
        return (
            // eslint-disable-next-line
            o.data.map(function (obj, i) {
                if(i === idItem) {
                    let percent = Math.ceil(o.excludeID.length*100/o.data.length),
                        stylePercent = {
                            background: 'linear-gradient(to right, #2c8548 0%,#2c8548 ' + percent + '%,#974c49 ' + percent + '%,#974c49 100%)'
                        };

                    if(voice && checkvoice !== 'no-voice') {
                        if(flashCardDirection === 'left') {
                            that.translateVoice(obj._pl, "pl",that.state.online);
                        } else {
                            that.translateVoice(obj._en, "en",that.state.online);
                        }
                    }

                    return (
                        <div className={'flash-card-inset' + (isIE?' ie-fix':'')} key={i}>
                            <span className="percent-pro" style={stylePercent}></span>
                            <h2><span className={"icon-random-card icon-random-card-" + idC}></span>{that.state.langNameExercise(o.category) && that.state.langNameExercise(o.category) + ' / '}{that.state.langNameExercise(o.name)}</h2>
                            <p>
                                {that.state.online?'online':'offline'} | <span className="icon-up color-5">{o.excludeID.length}/{o.data.length} = {Math.ceil(o.excludeID.length*100/o.data.length)}%</span> - <span className="icon-down color-6">{o.dontKnowClick}</span>
                            </p>
                            <div className={"autoplay-loop-nav"}>
                                <button className={"w-50" + (thisComponent.state.autoPlayExercise2?' d-none':'')} onClick={() => {thisComponent.setState({autoPlayExercise2: true}); that.autoplayLoopNav('play')}}>Play <span className="icon-play"></span></button>
                                <button className={"w-50" + (thisComponent.state.autoPlayExercise2?'':' d-none')} onClick={() => {thisComponent.setState({autoPlayExercise2: false}); that.autoplayLoopNav('stop')}}>Stop <span className="icon-stop"></span></button>
                            </div>
                            <div className="flip-container">
                                {
                                    flashCardDirection === 'left' ?
                                        <div className="flipper">
                                            <div className={'front ' + centerClass}>
                                                <p onClick={() => that.translateVoice(obj._pl, "pl",that.state.online)}>
                                                    <strong>pl:</strong>
                                                    <span className={'icon-volume ' + (that.state.online?'':'line-disable')}></span>
                                                    <span>{obj._pl}</span>
                                                </p>
                                            </div>
                                            <div className={'back ' + centerClass}>
                                                <p onClick={() => that.translateVoice(obj._pl, "pl",that.state.online) }>
                                                    <strong>pl:</strong>
                                                    <span className={'icon-volume ' + (that.state.online?'':'line-disable')}></span>
                                                    <span>{obj._pl}</span>
                                                </p>
                                                <hr />
                                                <p onClick={() => that.translateVoice(obj._en, "en",that.state.online)}>
                                                    <strong>en:</strong>
                                                    <span className={'icon-volume ' + (that.state.online?'':'line-disable')}></span>
                                                    <span>{obj._en}</span>
                                                </p>
                                                <button onClick={(e) => that.openHref(e,"https://translate.google.pl/#view=home&op=translate&sl=pl&tl=en&text=" + obj._pl)} className="google-translator" target='blank_'>
                                                    {translate.gt}<span className="icon-gt"></span>
                                                </button>
                                            </div>
                                        </div>
                                        :
                                        <div className="flipper">
                                            <div className={'front ' + centerClass}>
                                                <p onClick={() => that.translateVoice(obj._en, "en", that.state.online)}>
                                                    <strong>en:</strong>
                                                    <span className={'icon-volume ' + (that.state.online?'':'line-disable')}></span>
                                                    <span>{obj._en}</span></p>
                                            </div>
                                            <div className={'back ' + centerClass}>
                                                <p onClick={() => that.translateVoice(obj._en, "en",that.state.online)}>
                                                    <strong>en:</strong>
                                                    <span className={'icon-volume ' + (that.state.online?'':'line-disable')}></span>
                                                    <span>{obj._en}</span></p>
                                                <hr />

                                                <p onClick={() => that.translateVoice(obj._pl, "pl",that.state.online) }>
                                                    <strong>pl:</strong>
                                                    <span className={'icon-volume ' + (that.state.online?'':'line-disable')}></span>
                                                    <span>{obj._pl}</span>
                                                </p>
                                                <button onClick={(e) => that.openHref(e,"https://translate.google.pl/#view=home&op=translate&sl=en&tl=pl&text=" + obj._en)} className="google-translator" target='blank_'>
                                                    {translate.gt}<span className="icon-gt"></span>
                                                </button>
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
    startCookiesFlashCardDirection = () => {
        if(getCookies('flashcards_cookie') == null) {
            setCookies('flashcards_cookie', 'left');
            return 'left';
        } else {
            if(getCookies('flashcards_cookie') === 'left') {
                return 'left';
            } else {
                return 'right';
            }
        }
    };
    startCookiesLang = () => {
        if(getCookies('language_cookie') == null) {
            setCookies('language_cookie', 'pl');
            //cookies.set('language_cookie', 'pl', { path: '/', maxAge: cookiesMaxAge });
            return 'pl';
        } else {
            if(getCookies('language_cookie') === 'pl') {
                return 'pl';
            } else {
                return 'en';
            }
        }
    };
    global = {
        uniqueCategoryArray: [],
        categoryActive: [],
        flashCardDirection: this.startCookiesFlashCardDirection(),
        lang: this.startCookiesLang(),
        idC: false,
        fSwipe: false,
        timeOutCloseCloud: true,
        version: '1.0.07',
        autoplayLoop: {},
        directionText: () => {
            return (this.global.flashCardDirection === 'right') ? translate.english + ' | ' + translate.polish : translate.polish + ' | ' + translate.english
        }
    };
    style = {
        left: 0,
    };
    constructor(props){
        super(props);
        this.widthMenu = React.createRef();
        this.state = {
            callObj: '',
            idExercise: -1,
            idItem: false,
            langCongratulation: false,
            direction: this.global.directionText(),
            activePL: (this.global.lang === 'pl')?'active-lang':'',
            activeEN: (this.global.lang === 'en')?'active-lang':'',
            classCheckOut: '',
            classCheckOutMore: '',
            classHideOrShowMainPartsPage: 'show-list-exercise-hide-flash-cards',
            classHideNavButtons: '',
            navMobileActive: '',
            rotateDisable: (getCookies('disable_rotate_cookie') == null)?'':'rotate-disable',
            enableAutoVoice: (getCookies('enable_auto_voice_cookie') == null)?'':'enable-auto-voice',
            preloader: "",
            online: true,
            moveMenu: '',
            mainNavInsetTransitionStop: '',
            closeCloude: '',
            showAbouts: '',
            headerOnTop: '',
            autoPlayExercise: false,
            langNameExercise: (j,l=this.global.lang) => {
                switch (l) {
                    case 'en': return j._en;
                    default: return j._pl; // pl
                }
            }
        };
    };
    openHref = (e,href) => {

        window.open(href, '_system');
        //navigator.app.loadUrl(href, { openExternal:true });

        // if(detectionDevice){
        //     navigator.app.loadUrl(href, { openExternal:true });
        // } else {
        //     window.open(href, '_system');
        // }
        e.preventDefault();
    };
    arrayUnique = (arr) => {
        return arr.filter(function(item, index){
            return arr.indexOf(item) >= index;
        });
    };
    translateVoice = (text,lang,active) => {
        if(active && typeof window.responsiveVoice === 'object') {
            switch (lang) {
                case 'pl': window.responsiveVoice.speak(text, "Polish Female");
                    break;
                case 'en': window.responsiveVoice.speak(text, "UK English Male");
                    break;
                default:
                    window.responsiveVoice.speak(text, "UK English Male");
            }
        }
    };
    setExercise = (event,idE,idForce,voiceOff,idC,closeCloude) => {
        let temp_idE, o = dataJson[idE];
        this.global.idC = idC;
        if(idForce) {
            temp_idE = idForce;
        }
        else {
            temp_idE = this.randomItem(o);
        }
        this.setState({
            idExercise: idE,
            idItem: temp_idE,
            classCheckOut: '',
            classCheckOutMore: '',
            classHideNavButtons: (o.excludeID.length === o.data.length)?'d-none':'',
            classHideOrShowMainPartsPage: 'hide-flash-cards-show-list-exercise',
            callObj: (o.excludeID.length === o.data.length)?<Congratulation that={this} idC={idC} ide={idE} />:<Exercises o={o} that={this} idC={idC} idItem={temp_idE} flashCardDirection={this.global.flashCardDirection} checkvoice={voiceOff} voice={this.state.enableAutoVoice} />
        });
        if(closeCloude) {
            this.setState({
                closeCloude: 'show-cloude'
            });
            this.global.timeOutCloseCloud = setTimeout(function (that) {
                that.setState({
                    closeCloude: ''
                });
            },5000,this);
        }
        if(event) event.preventDefault();
    };
    clearExercise = event => {
        this.setState({
            idExercise: -1,
            callObj: '',
            classHideOrShowMainPartsPage: 'show-list-exercise-hide-flash-cards',
            classHideNavButtons: '',
            closeCloude: ''
        });
        clearTimeout(this.global.timeOutCloseCloud);
        this.autoplayLoopNav("stop");
        if(event) event.preventDefault();
    };

    setLang = (event,langName) => {
        setLanguage(langName);
        this.global.lang = langName;
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

        this.setState({
            direction: this.global.directionText()
        });

        // after load page
        if(this.state.idExercise < 0 || this.state.idItem === false ) {
            this.setState({
                callObj: (this.state.idItem === false && this.state.idExercise !== -1)?<Congratulation that={this} ide={this.state.idExercise} />:''
            });
        } else {
            this.setExercise(event,this.state.idExercise,this.state.idItem,'no-voice',this.global.idC);
        }
        if(event) event.preventDefault();
    };
    changeDirection = (event) => {
        if(this.global.flashCardDirection === 'left') {
            setCookies('flashcards_cookie', 'right');
            this.global.flashCardDirection = 'right';

        } else {
            setCookies('flashcards_cookie', 'left');
            this.global.flashCardDirection = 'left';

        }
        this.setState({
            direction: this.global.directionText()
        });
        if(this.state.idExercise > -1) {
            this.setExercise(event,this.state.idExercise,this.state.idItem,false,this.global.idC);
        }
        if(event) event.preventDefault();
    };
    randomItem = (ol) => {
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
    };
    timeoutAnim = (y) => {
        this.setExercise(null,y,false,false,this.global.idC);
        this.setState({classCheckOutMore: ''});
    };
    iKnow = (idI) => {
        if(this.state.idExercise > -1) {
            const o = dataJson;
            if(typeof o[this.state.idExercise].excludeID !== 'object') {
                o[this.state.idExercise].excludeID = [];
            }
            if(o[this.state.idExercise].excludeID.length < o[this.state.idExercise].data.length && idI !== false ) {
                o[this.state.idExercise].excludeID.push(idI);
                setCookies('obj_exercise_cookie_'+this.state.idExercise, JSON.stringify(o[this.state.idExercise].excludeID));
            }
            this.setState({classCheckOut: ''});
            setTimeout(this.timeoutAnim,(this.state.rotateDisable)?0:400,this.state.idExercise);
            if(o[this.state.idExercise].excludeID.length === o[this.state.idExercise].data.length){
                this.setState({
                    classHideNavButtons: 'd-none'
                });
            }

        }
    };
    iDontKnow = () => {
        if(this.state.idExercise > -1) {
            const o = dataJson;
            o[this.state.idExercise].dontKnowClick += 1;
            setCookies('obj_exercise_cookie_dk_click_'+this.state.idExercise, o[this.state.idExercise].dontKnowClick);
            this.setState({classCheckOut: ''});
            setTimeout(this.timeoutAnim,400,this.state.idExercise);
        }
    };
    checkOut = () => {
        //console.log(idExercise + ' / ' + idItem + ' / ' + flashCardDirection); // left = polish, right = english
        //console.log(dataJson[idExercise].data[idItem]._en);
        if(this.state.enableAutoVoice) {
            setTimeout(function (that) {
                if(that.global.flashCardDirection === 'left') {
                    that.translateVoice(dataJson[that.state.idExercise].data[that.state.idItem]._en, "en",that.state.online);
                } else {
                    that.translateVoice(dataJson[that.state.idExercise].data[that.state.idItem]._pl, "pl",that.state.online);
                }
            }, 300,this);
        }
        this.setState({
            classCheckOut: 'check-out-card',
            classCheckOutMore: 'check-out-card-more'
        })
    };
    autoplayLoopNav = (prop) => {
        let that = this;
        if(prop==="play") {
            let play = () => {
                that.checkOut();
                that.global.autoplayLoop.second = setTimeout(function () {
                    that.global.autoplayLoop.third = setTimeout(that.timeoutAnim,400,that.state.idExercise);
                }, 3000);
            };
            play();
            that.global.autoplayLoop.first = setInterval(function () {
                play();
            },6000);
            this.setState({
                autoPlayExercise: true
            })
        } else if(prop==="stop") {
            clearInterval(that.global.autoplayLoop.first);
            clearInterval(that.global.autoplayLoop.second);
            clearInterval(that.global.autoplayLoop.third);
            this.setState({
                autoPlayExercise: false
            })
        }
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
    uniqueCategory = (jo,ifFirstLoad) => {
        this.global.uniqueCategoryArray = [];

        // eslint-disable-next-line
        jo.map(function (obj, i) {
            this.global.uniqueCategoryArray.push(this.state.langNameExercise(obj.category))
        },this);
        this.global.uniqueCategoryArray = this.arrayUnique(this.global.uniqueCategoryArray);
        let tmp = this.global.categoryActive;
        this.global.categoryActive = [];
        for(let i=0,iLength=this.global.uniqueCategoryArray.length; i<iLength; i++){
            this.global.categoryActive.push(ifFirstLoad?false:tmp[i]);
        }
    };
    showCategory = (index) => {
        let tmp = this.global.categoryActive;
        // if(tmp[index]) {
        //     tmp[index] = false;
        // } else {
        //     tmp[index] = true;
        // }
        tmp[index] = !tmp[index];
        this.setState({categoryActive: tmp });
        //console.log(tmp[index]);
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
    enableAutoVoice = (event) => {
        if(this.state.enableAutoVoice) {
            removeCookies('enable_auto_voice_cookie');
        } else {
            setCookies('enable_auto_voice_cookie',true);
        }
        this.setState({
            enableAutoVoice: (this.state.enableAutoVoice)?'':'enable-auto-voice'
        });
        if(event) event.preventDefault();
    };
    preloaderFun = () => {
        setTimeout(function (that) {
            that.setState({
                preloader: 'animate-hide'
            });
            setTimeout(function (that) {
                that.setState({
                    preloader: 'delete'
                });
            },800,that);
        },4000,this);
    };
    closeApplication = () => {
        if(detectionDevice) {
            navigator.app.exitApp();
        }
    };
    checkOnline = (event,checkOnline) => {
        this.setState({
            online: checkOnline
        });
        if(this.state.idExercise > -1) {
            this.setExercise(event, this.state.idExercise, this.state.idItem,'no-voice',this.global.idC);
        }
    };

    navMobileActive = () => {
        this.setState({
            navMobileActive: (this.state.navMobileActive)?'':'nav-mobile-active',
            moveMenu: (this.state.navMobileActive)?this.widthMenu.current.offsetWidth:0,
        });
    };

    // flTemporary = false;
    onSwipeStart = () => {
        if(this.state.navMobileActive) {
            this.global.fSwipe = true;
        }
    };

    moveMenu = (type,x,e) => {
        if(type==='move') {
            if(x>=0) {
                if(x<100) {
                    this.setState({
                        moveMenu: x,
                        mainNavInsetTransitionStop: 'main-nav-inset-transition-stop'
                    });
                    // if(!this.flTemporary) {
                    //     this.flTemporary = true;
                    //     setTimeout(function (that) {
                    //         that.flTemporary = false;
                    //     },100,this);
                    // }

                } else {

                    this.setState({
                        moveMenu: this.widthMenu.current.offsetWidth,
                        mainNavInsetTransitionStop:'',
                        navMobileActive: '',
                    });
                    this.global.fSwipe = false;
                }
            }
        } else {
            // if(this.flTemporary) {
            //     this.setState({
            //         moveMenu: this.widthMenu.current.offsetWidth,
            //         mainNavInsetTransitionStop:'',
            //         navMobileActive: '',
            //     });
            //     this.global.fSwipe = false;
            // }
            if(this.state.navMobileActive !== '') {
                this.setState({
                    moveMenu: 0,
                    mainNavInsetTransitionStop: ''
                });
            }
        }
    };

    onSwipeMove = (position,e) => {
        //console.log(position.x);
        if(this.state.navMobileActive && this.global.fSwipe) {
            this.moveMenu('move',position.x,e);
        }

    };

    onSwipeEnd = () => {
        if(this.state.navMobileActive) {
            this.moveMenu();
        }
    };

    onResize = () => {
        this.setState({
            moveMenu: (!this.state.navMobileActive)?this.widthMenu.current.offsetWidth:0,
        });
    };

    showAbouts = () => {
        this.setState({
            showAbouts: this.state.showAbouts?'':'abouts-l-active'
        });
    };
    componentWillMount(){
        dataJson.map(function (obj, i) {
            console.log('x');
            if(typeof obj.excludeID  === 'undefined') {
                obj.excludeID = [];
                obj.dontKnowClick = 0;
            }

            if(getCookies('obj_exercise_cookie_' + i,'array') != null ) {
                //alert(getCookies('obj_exercise_cookie_' + i,'array'));
                obj.excludeID = getCookies('obj_exercise_cookie_' + i,'array');
            }
            if(getCookies('obj_exercise_cookie_dk_click_' + i) != null) {
                obj.dontKnowClick = parseInt(getCookies('obj_exercise_cookie_dk_click_' + i));
            }
            return true;
        });
        this.uniqueCategory(dataJson,true);
        //setLanguage(this.global.lang);
        this.setLang(false,this.global.lang);
        this.preloaderFun();
    };
    componentDidMount = () => {
        const that = this;
        window.onscroll = function() {
            if(window.pageYOffset === 0) {
                if(that.state.headerOnTop) {
                    that.setState({
                        headerOnTop: ''
                    });
                    console.log('I AM AT THE TOP');
                }
            } else {
                if(!that.state.headerOnTop) {
                    that.setState({
                        headerOnTop: 'header-on-none-top'
                    });
                    console.log("xcx");
                }
            }
        };
    };
    render() {
        const { title } = this.props;

        this.uniqueCategory(dataJson,false);
        let directionState = this.state.direction.split("|");

        return (
            <Swipe
                onSwipeStart={this.onSwipeStart}
                onSwipeMove={this.onSwipeMove}
                onSwipeEnd={this.onSwipeEnd}

                // onSwipeRight={() => this.navMobileActive(true)}
            >
                <div className={'module-flash-cards ' + this.state.classHideOrShowMainPartsPage + ' ' + this.state.navMobileActive + ' ' + this.state.rotateDisable + ' ' + this.state.enableAutoVoice}>
                    <div className="bg"></div>
                    <div className="bg bg-1"></div>
                    <div className="bg bg-2"></div>
                    <div className="bg bg-3"></div>

                    {this.state.preloader!=='delete' && <div className={this.state.preloader + " preloader d-flex justify-content-center align-items-center"}><span className="icon-new-logo"></span></div>}

                    <div className={"main-header-wrap " + this.state.headerOnTop}>
                        <header className="main-header">
                            <nav className="main-nav">
                                <button className={"bg-close d-block d-xl-none" + (this.state.navMobileActive && ' bg-close-show')}  onClick={() => this.navMobileActive()}><span className="icon-right-open"></span></button>
                                <button onClick={() => this.navMobileActive()} className="hamburger"><span></span><span></span><span></span></button>


                                    <div ref={this.widthMenu} className={"main-nav-inset " + this.state.mainNavInsetTransitionStop} style={{transform: 'translate3d(' + this.state.moveMenu + 'px, 0, 0)'}}>
                                        <ReactResizeDetector handleWidth handleHeight onResize={this.onResize} />
                                        <div className="main-nav-inset-box">
                                            <ul className="list-unstyled main-nav-inset-list">
                                                <li className="d-flex buttons-language">
                                                    <button className={"border-content-bottom " + this.state.activePL} onClick={(e) => this.setLang(e,'pl')}><span className="icon-ok"></span> PL</button>
                                                    <button className={"border-content-bottom " + this.state.activeEN} onClick={(e) => this.setLang(e,'en')}><span className="icon-ok"></span> EN</button>
                                                </li>
                                                <li><button className="border-content-bottom exchange-direction-language" onClick={(e) => this.changeDirection(e)}><span className="icon-exchange"></span> {directionState[0]} <span className="icon-right"></span> {directionState[1]}</button></li>

                                                <li><button className="enable-auto-voice border-content-bottom" onClick={this.enableAutoVoice}><span className="icon-volume"></span> {translate.buttonEnableAutoVoice}</button></li>
                                                <li><button className="close-rotate border-content-bottom" onClick={this.disableRotate}><span className="icon-ok"></span> {translate.buttonDisableRotate}</button></li>

                                                <li><button className="rest-all border-content-bottom" onClick={() => {this.removeCookieExerciseAll(); this.clearExercise(); }}><span className="icon-trash-empty"></span> {translate.buttonRestartProgress}</button></li>

                                                {detectionDevice && <li><button className="close-application" onClick={() => this.closeApplication()}><span className="icon-cancel-circled"></span> {translate.buttonCloseApplication}</button></li>}

                                                <li>
                                                    <button className={"abouts-l border-content-bottom " + this.state.showAbouts} onClick={() => this.showAbouts()}><span className="icon-new-logo"></span> Abouts {title}</button>
                                                    <div className="abouts-box">
                                                        <p>{Parser(translate.abouts)} {title} {this.global.version}</p>
                                                    </div>
                                                </li>
                                            </ul>
                                            <p>{translate.yourPlatform}: {detectionDevice?'Android/iOS':'Browser'}</p>
                                            <span className="logo-menu icon-only-l"></span>
                                        </div>
                                    </div>

                            </nav>
                            <ul className="list-language d-flex flex-row list-unstyled">
                                <li>{!isIE && <Detector
                                    onChange={(online,event) => this.checkOnline(event,online)}
                                    render={({ online }) => (
                                        <span title={online?'online':'offline'} className={'icon-globe ' + (online?'':'icon-globe-disable')}></span>
                                    )}
                                />}</li>
                                <li className="link-voice"><a href={'#voice'} onClick={(e) => this.enableAutoVoice(e)}><span className="icon-volume"></span></a></li>
                                <li className="flag-pl"><a href={'#pl'} className={this.state.activePL} onClick={(e) => this.setLang(e,'pl')}>PL</a></li>
                                <li className="flag-en"><a href={'#en'} className={this.state.activeEN} onClick={(e) => this.setLang(e,'en')}>EN</a></li>
                            </ul>
                            <h1 className="icon-new-logo"><span className="d-none">F</span>lashCrads</h1>
                            <button className="direction-lang" onClick={(e) => this.changeDirection(e)}>{directionState[0]} <span className="icon-exchange"></span> {directionState[1]}</button>
                        </header>
                    </div>
                    <div className={'main-list-exercise'}>
                        {this.global.uniqueCategoryArray.map(function (obj_category, j) {
                            return (
                                <div className="category-box" key={j}>
                                    {obj_category && <h2 onClick={() => this.showCategory(j)}  className={'category-' + j + ' ' + (this.global.categoryActive[j]?'category-active':'')}>{obj_category} <span className="icon-down-open"></span></h2>}
                                    <ul className={'main-list-exercise-inset list-unstyled'}>
                                        {/* eslint-disable-next-line */}
                                        {dataJson.map(function (obj, i) {
                                            //console.log(obj);
                                            let percent = Math.ceil(obj.excludeID.length*100/obj.data.length),
                                                stylePercent1 = {
                                                    background: 'linear-gradient(to right, #2c8548 0%,#2c8548 ' + percent + '%,#974c49 ' + percent + '%,#974c49 100%)'
                                                },
                                                stylePercent2 = {
                                                    background: 'linear-gradient(to right, rgba(44,133,72,.2) 0%,rgba(44,133,72,.2) ' + percent + '%,rgba(255,255,255,0) ' + percent + '%,rgba(255,255,255,0) 100%), rgba(255,255,255,.6)',
                                                };

                                            percent = isNaN(percent)?'blank':percent+'%';

                                            if(this.state.langNameExercise(obj.category) === obj_category) {
                                                return (
                                                    <li key={i} className="d-flex justify-content-between">

                                                        <a href={'#flashcard' + i} style={stylePercent2} onClick={(e) => this.setExercise(e,i,false,false,j,(obj.excludeID.length!==obj.data.length))}>
                                                            {/*<span className="percent-border-top"></span>*/}
                                                            <span className="percent-pro" style={stylePercent1}></span>
                                                            <span className={"icon-random-card icon-random-card-" + j}></span>
                                                            {obj.excludeID.length === obj.data.length && <span className="icon-ok"></span>}
                                                            {this.state.langNameExercise(obj.name)} <i><span className="icon-up color-5">{obj.excludeID.length}/{obj.data.length} = {percent}</span> - <span className="icon-down color-6">{obj.dontKnowClick}</span></i>
                                                        </a>

                                                        {(obj.excludeID.length !== 0 || obj.dontKnowClick !== 0) &&
                                                        <button className={'border-content-bottom'} title="Reset" onClick={(e) => {this.removeCookieExerciseId(e,i,obj);}}><span className="icon-trash-empty"></span></button>
                                                        }

                                                    </li>
                                                );
                                            }

                                        },this)}
                                    </ul>
                                </div>
                            );
                        },this)}
                    </div>
                    <div className={'main-flash-cards ' + this.state.classCheckOut + ' ' + this.state.classCheckOutMore}>
                        <button className="button-close-exercise icon-cancel" onClick={this.clearExercise}>
                            <span className={this.state.closeCloude}>{translate.buttonCloseExercise}</span>
                        </button>

                        <div className={'flash-card'}>
                            {this.state.callObj}
                        </div>

                        <nav className={'nav-buttons ' + this.state.classHideNavButtons + (this.state.autoPlayExercise?' disable-opacity':'')}>
                            <span className={"icon-lock" + (this.state.autoPlayExercise?'':' d-none')}></span>
                            <button className="button-check-out" onClick={() => this.checkOut()}>{translate.buttonCheckOut}</button>
                            <button title={translate.buttonIKnow} className="button-i-know" onClick={() => this.iKnow(this.state.idItem)}><span className="icon-ok"></span></button>
                            <button title={translate.buttonIDontKnow} className="button-i-dont-know" onClick={() => this.iDontKnow()}><span className="icon-cancel"></span></button>
                        </nav>
                    </div>
                    <footer className="main-footer">
                        <p>Copyright &copy; {title} | <a href="http://langfc.semjs.pl/polityka/" onClick={(e) => this.openHref(e,"http://langfc.semjs.pl/polityka/?lang="+translate.lang)} >{translate.privacy}</a></p>
                    </footer>
                </div>
            </Swipe>

        );
    }
}

export default FlashCards;
