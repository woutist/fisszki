import React, { Component } from 'react';
import './component.css';
import {setCookies, removeCookies, getCookies} from './cookies';
import Swipe from 'react-easy-swipe';
import dataJson from './data_json/data.json';
import { detectionDevice, isIE, centerClass } from './varibles';
import { translate, setLanguage } from './language';

const Detector = !isIE && require('react-detect-offline').Detector;


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
                    removeCookies('obj_exercise_cookie_'+ide);
                    removeCookies('obj_exercise_cookie_dk_click_'+ide);
                    // cookies.remove('obj_exercise_cookie_'+ide, { path: '/' });
                    // cookies.remove('obj_exercise_cookie_dk_click_'+ide, { path: '/' });
                    that.clearExercise();
                    that.setState({classHideNavButtons: ''});
                    that.setExercise(null,ide);
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
        const { o, that, voice, idItem, checkvoice, flashCardDirection } = this.props;
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
                            <h2>{that.state.langNameExercise(o.category) && that.state.langNameExercise(o.category) + ' / '}{that.state.langNameExercise(o.name)}</h2>
                            <p>
                                {that.state.online?'online':'offline'} | <span className="icon-up color-5">{o.excludeID.length}/{o.data.length} = {Math.ceil(o.excludeID.length*100/o.data.length)}%</span> - <span className="icon-down color-6">{o.dontKnowClick}</span>

                            </p>
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
                                                <a onClick={(e) => that.openHref(e,"https://translate.google.pl/#view=home&op=translate&sl=pl&tl=en&text=" + obj._pl)} className="google-translator" target='blank_' href={"https://translate.google.pl/#view=home&op=translate&sl=pl&tl=en&text=" + obj._pl}>Check it in the Google Translator<span className="icon-language"></span></a>
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
                                                <a onClick={(e) => that.openHref(e,"https://translate.google.pl/#view=home&op=translate&sl=en&tl=pl&text=" + obj._en)} className="google-translator" target='blank_' href={"https://translate.google.pl/#view=home&op=translate&sl=en&tl=pl&text=" + obj._en}>Check it in the Google translator<span className="icon-language"></span></a>
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
        directionText: () => {
            return (this.global.flashCardDirection === 'right') ? translate.english + ' | ' + translate.polish : translate.polish + ' | ' + translate.english
        }
    };
    state = {
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
        //moveMenu: 0,
        langNameExercise: (j,l=this.global.lang) => {
            switch (l) {
                case 'en': return j._en;
                default: return j._pl; // pl
            }
        }
    };
    openHref = (e,href) => {
        if(detectionDevice){
            navigator.app.loadUrl(href, { openExternal:true });
        } else {
            window.open(href, '_system');
        }
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
    setExercise = (event,idE,idForce,voiceOff) => {
        let temp_idE, o = dataJson[idE];
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
            callObj: (o.excludeID.length === o.data.length)?<Congratulation that={this} ide={idE} />:<Exercises o={o} that={this} idItem={temp_idE} flashCardDirection={this.global.flashCardDirection} checkvoice={voiceOff} voice={this.state.enableAutoVoice} />
        });
        if(event) event.preventDefault();
    };
    clearExercise = event => {
        this.setState({
            idExercise: -1,
            callObj: '',
            classHideOrShowMainPartsPage: 'show-list-exercise-hide-flash-cards',
            classHideNavButtons: ''
        });
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
            this.setExercise(event,this.state.idExercise,this.state.idItem,'no-voice');
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
            this.setExercise(event,this.state.idExercise,this.state.idItem);
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
        this.setExercise(null,y);
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
        if(this.state.enableAutoVoice) {
            removeCookies('enable_auto_voice_cookie');
        } else {
            setCookies('enable_auto_voice_cookie',true);
        }
        this.setState({
            enableAutoVoice: (this.state.enableAutoVoice)?'':'enable-auto-voice'
        })
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
        },2000,this);
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
            this.setExercise(event, this.state.idExercise, this.state.idItem,'no-voice');
        }
    };

    // onSwipeStart(event) {
    //     console.log('Start swiping...', event);
    // };
    // ppp = (type,x) => {
    //     if(type==='move') {
    //         this.setState({moveMenu: x});
    //     } else {
    //         this.setState({moveMenu: 262});
    //         this.navMobileActive(true)
    //         //this.navMobileActive(true);
    //     }
    // };
    // onSwipeMove = (position) => {
    //     this.ppp('move',position.x);
    // };
    //
    // onSwipeEnd = () => {
    //     this.ppp('end');
    // };

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
    componentDidMount(){

    };
    render() {
        const { title } = this.props;

        this.uniqueCategory(dataJson,false);
        let directionState = this.state.direction.split("|");

        return (
            <Swipe
                // onSwipeStart={this.onSwipeStart}
                // onSwipeMove={this.onSwipeMove}
                // onSwipeEnd={this.onSwipeEnd}

                onSwipeRight={() => this.navMobileActive(true)}
            >
                <div className={'module-flash-cards ' + this.state.classHideOrShowMainPartsPage + ' ' + this.state.navMobileActive + ' ' + this.state.rotateDisable + ' ' + this.state.enableAutoVoice}>
                    <div className="bg"></div>
                    <div className="bg bg-1"></div>
                    <div className="bg bg-2"></div>

                    {this.state.preloader!=='delete' && <div className={this.state.preloader + " preloader d-flex justify-content-center align-items-center"}><span className="icon-new-logo"></span></div>}
                    <header className="main-header">
                        <nav className="main-nav">
                            <button onClick={() => this.navMobileActive()} className="hamburger"><span></span><span></span><span></span></button>

                            <div className="main-nav-inset" style={{right:-this.state.moveMenu + 'px'}}>
                                <ul className="list-unstyled">
                                    <li><button className="enable-auto-voice border-content-bottom" onClick={this.enableAutoVoice}><span className="icon-volume"></span> {translate.buttonEnableAutoVoice}</button></li>
                                    <li><button className="close-rotate border-content-bottom" onClick={this.disableRotate}><span className="icon-ok"></span> {translate.buttonDisableRotate}</button></li>
                                    <li><button className="rest-all border-content-bottom" onClick={() => {this.removeCookieExerciseAll(); this.clearExercise(); }}><span className="icon-trash-empty"></span>{translate.buttonRestartProgress}</button></li>
                                    {detectionDevice && <li><button className="close-application" onClick={() => this.closeApplication}><span className="icon-cancel-circled"></span>{translate.buttonCloseApplication}</button></li>}
                                </ul>
                                <p>- {translate.yourPlatform}: {detectionDevice?'Android/iOS':'Browser'}</p>
                            </div>

                        </nav>
                        <ul className="list-language d-flex flex-row list-unstyled">
                            <li>{!isIE && <Detector
                                onChange={(online,event) => this.checkOnline(event,online)}
                                render={({ online }) => (
                                    <span title={online?'online':'offline'} className={'icon-globe ' + (online?'':'icon-globe-disable')}></span>
                                )}
                            />}</li>
                            <li className="flag-pl"><a href={'#pl'} className={this.state.activePL} onClick={(e) => this.setLang(e,'pl')}>PL</a></li>
                            <li className="flag-en"><a href={'#en'} className={this.state.activeEN} onClick={(e) => this.setLang(e,'en')}>EN</a></li>
                        </ul>
                        <h1 className="icon-new-logo"><span className="d-none">F</span>lashCrads</h1>
                        <button className="direction-lang" onClick={(e) => this.changeDirection(e)}>{directionState[0]} <span className="icon-exchange"></span> {directionState[1]}</button>
                    </header>

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
                                                stylePercent = {
                                                    background: 'linear-gradient(to right, #2c8548 0%,#2c8548 ' + percent + '%,#974c49 ' + percent + '%,#974c49 100%)'
                                                };
                                            if(this.state.langNameExercise(obj.category) === obj_category) {
                                                return (
                                                    <li key={i} className="d-flex justify-content-between">

                                                        {(obj.excludeID.length !== 0 || obj.dontKnowClick !== 0) &&
                                                            <button className={'border-content-bottom'} title="Reset" onClick={(e) => {this.removeCookieExerciseId(e,i,obj);}}><span className="icon-trash-empty"></span></button>
                                                        }

                                                        <a href={'#flashcard' + i} onClick={(e) => this.setExercise(e,i)}>
                                                            {/*<span className="percent-border-top"></span>*/}
                                                            <span className="percent-pro" style={stylePercent}></span>
                                                            {this.state.langNameExercise(obj.name)} <i><span className="icon-up color-5">{obj.excludeID.length}/{obj.data.length} = {percent}%</span> - <span className="icon-down color-6">{obj.dontKnowClick}</span></i>
                                                        </a>

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
                        <button className="button-close-exercise icon-cancel" onClick={this.clearExercise}><span>{translate.buttonCloseExercise} <i className="icon-right"></i></span></button>

                        <div className={'flash-card'}>
                            {this.state.callObj}
                        </div>

                        <nav className={'nav-buttons ' + this.state.classHideNavButtons}>
                            <button className="button-check-out" onClick={() => this.checkOut()}>{translate.buttonCheckOut}</button>
                            <button title={translate.buttonIKnow} className="button-i-know" onClick={() => this.iKnow(this.state.idItem)}><span className="icon-ok"></span></button>
                            <button title={translate.buttonIDontKnow} className="button-i-dont-know" onClick={() => this.iDontKnow()}><span className="icon-cancel"></span></button>
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
