import React, { Component } from 'react';
import './component.css';
import {setCookies, removeCookies, getCookies} from './cookies';
import Swipe from 'react-easy-swipe';
import dataJson from './data_json/data.json';
import { detectionDevice, isIE, centerClass } from './varibles';
import { translate, setLanguage } from './language';
import ReactResizeDetector from 'react-resize-detector';
import Parser from 'html-react-parser';
import SoundSeparator from './sounds/pi-pum.mp3';

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
                <p className="text-center">{translate.textSummary}:  <span className="icon-up color-5">{obj.excludeID.length}/{obj.data.length} = {Math.ceil(obj.excludeID.length*100/obj.data.length)}%</span> - <span className="icon-down color-17">{obj.dontKnowClick}</span></p>
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
    fullItemsList = (e,that,idC) => {
        that.setState({showListActice:true});
        that.setExercise(e,that.state.idExercise,false,false,idC,false,false,true);
    }
    render() {
        const { o, that, voice, idItem, checkvoice, flashCardDirection, idC, autoplay } = this.props;
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
                        if(flashCardDirection === 'p->e') {
                            that.translateVoice(obj._pl, "pl",that.state.online,autoplay);
                        } else {
                            that.translateVoice(obj._en, "en",that.state.online,autoplay);
                        }
                    }

                    let description;
                    if(typeof dataJson[that.state.idExercise].description === 'object') {
                        description = (that.global.lang === 'pl')?dataJson[that.state.idExercise].description._pl:dataJson[that.state.idExercise].description._en;
                    }
                    return (
                        <div className={'flash-card-inset' + (isIE?' ie-fix':'')} key={i}>
                            <span className="percent-pro" style={stylePercent}></span>
                            <h2>
                                <span className={"icon-random-card icon-random-card-" + idC}></span>
                                {that.state.langNameExercise(o.category) && that.state.langNameExercise(o.category) + ' / '}{that.state.langNameExercise(o.name)} <span className="icon-right"></span>&nbsp;<a href="#full-items-list" onClick={(e) => thisComponent.fullItemsList(e,that,idC)}>{translate.fullItemsList}</a>
                            </h2>
                            <p>
                                {that.state.online?'online':'offline'} | <span className="icon-up color-5">{o.excludeID.length}/{o.data.length} = {Math.ceil(o.excludeID.length*100/o.data.length)}%</span> - <span className="icon-down color-17">{o.dontKnowClick}</span>
                            </p>
                            {description?<p>{Parser(description)}</p>:''}

                            <div className="flip-container">
                                {
                                    flashCardDirection === 'p->e' ?
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
                                                <div className="list-extends-links">
                                                    <button onClick={(e) => that.openHref(e,"https://translate.google.pl/#view=home&op=translate&sl=pl&tl=en&text=" + obj._pl)} className="google-translator" target='blank_'>
                                                        {translate.gt}<span className="icon-gt"></span>
                                                    </button>
                                                    <button onClick={(e) => that.openHref(e,"https://context.reverso.net/tłumaczenie/polski-angielski/" + obj._pl)} className="reverso-context" target='blank_'>
                                                        Reverso context<span className="icon-arrows-cw"></span>
                                                    </button>
                                                </div>
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
                                                <div className="list-extends-links">
                                                    <button onClick={(e) => that.openHref(e,"https://translate.google.pl/#view=home&op=translate&sl=en&tl=pl&text=" + obj._en)} className="google-translator" target='blank_'>
                                                        {translate.gt}<span className="icon-gt"></span>
                                                    </button>
                                                    <button onClick={(e) => that.openHref(e,"https://context.reverso.net/tłumaczenie/angielski-polski/" + obj._en)} className="reverso-context" target='blank_'>
                                                        Reverso context<span className="icon-arrows-cw"></span>
                                                    </button>
                                                </div>
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
 * Sub component Exercises List
 */
class ExercisesList extends Component {
    // constructor(props){
    //     super(props);
    //     this.state = {
    //     };
    // };
    flashcards = (e,that,idC) => {
        that.setState({showListActice:false});
        that.setExercise(e,that.state.idExercise,false,false,idC);
    };
    items = (i,o,that,obj,checkOk,flashCardDirection) => {
      return (
          <tr key={i} className={"list-container " + checkOk}>
              <th>
                  {i + 1}
              </th>
              <td onClick={() => that.translateVoice((flashCardDirection === 'p->e')?obj._pl:obj._en, (flashCardDirection === 'p->e')?"pl":"en", that.state.online)}>
                  <span className={'icon-volume ' + (that.state.online ? '' : 'line-disable')}></span>
                  <span>{(flashCardDirection === 'p->e')?obj._pl:obj._en}</span>
                  {checkOk && <span className="icon-ok"></span>}
              </td>
              <td onClick = {() => that.translateVoice((flashCardDirection === 'p->e')?obj._en:obj._pl, (flashCardDirection === 'p->e')?"en":"pl", that.state.online)}>
                  <span className={'icon-volume ' + (that.state.online ? '' : 'line-disable')}></span>
                  <span>{(flashCardDirection === 'p->e')?obj._en:obj._pl}</span>
                  {checkOk && <span className="icon-ok"></span>}
              </td>
          </tr>
      )
    };
    render() {
        const { o, that, idC, flashCardDirection } = this.props;
        const thisComponent = this;
        // const Aux = props => props.children;
        //console.log(o.excludeID);
        let percent = Math.ceil(o.excludeID.length*100/o.data.length),
            stylePercent = {
                background: 'linear-gradient(to right, #2c8548 0%,#2c8548 ' + percent + '%,#974c49 ' + percent + '%,#974c49 100%)'
            },
            description;
        if(typeof dataJson[that.state.idExercise].description === 'object') {
            description = (that.global.lang === 'pl')?dataJson[that.state.idExercise].description._pl:dataJson[that.state.idExercise].description._en;
        }
        //o.data.push(o.excludeID);
        if(typeof o.excludeID.includes !== 'function') {
            o.excludeID.includes = function () {};
        }
        return (
            // eslint-disable-next-line
            <div className={"flash-card-inset"}>
                <span className="percent-pro" style={stylePercent}></span>
                <h2>
                    <span className={"icon-random-card icon-random-card-" + idC}></span>
                    {that.state.langNameExercise(o.category) && that.state.langNameExercise(o.category) + ' / '}{that.state.langNameExercise(o.name)} <span className="icon-right"></span> <a href="#flashcards" onClick={(e) => this.flashcards(e,that,idC)}>{translate.flashcards}</a>
                </h2>
                <p>
                    {that.state.online?'online':'offline'} | <span className="icon-up color-5">{o.excludeID.length}/{o.data.length} = {Math.ceil(o.excludeID.length*100/o.data.length)}%</span> - <span className="icon-down color-17">{o.dontKnowClick}</span>
                </p>
                {description?<p>{Parser(description)}</p>:''}
                <div className={"table-wrap"}>
                    <table className={"table-list"}>
                        <thead>
                            <tr><th>id</th><th>{(flashCardDirection === 'p->e')?'pl':'en'}</th><th>{(flashCardDirection === 'p->e')?'en':'pl'}</th></tr>
                        </thead>
                        <tbody>
                        {
                            o.data.map(function (obj, i) {
                                return !o.excludeID.includes(i)?thisComponent.items(i,o,that,obj,'',flashCardDirection):null;
                            }, that,thisComponent)
                        }
                        {
                            o.data.map(function (obj, i) {
                                return o.excludeID.includes(i)?thisComponent.items(i,o,that,obj,'check-ok',flashCardDirection):null;
                            }, that,thisComponent)
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}



/**
 * Main component FlashCards
 */
class FlashCards extends Component {
    startCookiesFlashCardDirection = () => {
        if(getCookies('flashcards_cookie') == null) {
            setCookies('flashcards_cookie', 'p->e');
            return 'p->e';
        } else {
            if(getCookies('flashcards_cookie') === 'p->e') {
                return 'p->e';
            } else {
                return 'e->p';
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
        version: '1.0.2',
        autoplayLoop: {},
        searchTime: {},
        soundSeparator: new Audio(SoundSeparator),
        directionText: () => {
            return (this.global.flashCardDirection === 'e->p') ? translate.english + ' | ' + translate.polish : translate.polish + ' | ' + translate.english
        }
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
            showListActice: false,
            searchBrowser: false,
            searchWords: '',
            searchWordsMain: '',
            searchWordsMainActive: false,
            resultsSearch: null,
            searchWordsMainSlideToggle: '',
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
        e.preventDefault();
    };
    arrayUnique = (arr) => {
        return arr.filter(function(item, index){
            return arr.indexOf(item) >= index;
        });
    };
    translateVoiceOption = (autoplay, timeoutSeparator) => {
        if(this.global.autoplayLoop.first) {
            if(autoplay==='autoplay'){
                this.global.autoplayLoop.third = setTimeout(function (that) {
                    that.autoplayLoopNav('play-next');
                },timeoutSeparator,this);
            } else if(autoplay==='autoplay-check'){
                this.global.autoplayLoop.third = setTimeout(function (that) {
                    that.autoplayLoopNav('play');
                },timeoutSeparator,this);
            }
        }
    };
    translateVoice = (text,lang,active,autoplay) => {
        //console.log('autoplay: ' + autoplay);
        if(active && typeof window.responsiveVoice === 'object') {
            const timeoutSeparator = 600;
            switch (lang) {
                case 'pl':
                    window.responsiveVoice.speak(text, "Polish Female",{onend: () => {
                            this.translateVoiceOption(autoplay, timeoutSeparator);
                        }});
                    break;
                case 'en':
                    window.responsiveVoice.speak(text, "UK English Male",{onend: () => {
                            this.translateVoiceOption(autoplay, timeoutSeparator);
                        }});
                    break;
                default:
                    window.responsiveVoice.speak(text, "UK English Male",{onend: () => {
                            this.translateVoiceOption(autoplay, timeoutSeparator);
                        }});
            }
        } 
    };
    layer = (o,that,idC, idE, ap, temp_idE, voiceOff, showList) => {
        if(showList) {
            this.setState({
               showListActice: true
            });
            return <ExercisesList autoplay={ap} o={o} that={that} idC={idC} idItem={temp_idE} flashCardDirection={that.global.flashCardDirection} checkvoice={voiceOff} voice={that.state.enableAutoVoice} />;

        } else {
            if(o.excludeID.length === o.data.length) {
                return <Congratulation that={that} idC={idC} ide={idE} />;
            } else {
                return <Exercises autoplay={ap} o={o} that={that} idC={idC} idItem={temp_idE} flashCardDirection={that.global.flashCardDirection} checkvoice={voiceOff} voice={that.state.enableAutoVoice} />;
            }
        }
    };

    setExercise = (event,idE,idForce,voiceOff,idC,closeCloude,ap,showList) => {
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
            classHideNavButtons: (o.excludeID.length === o.data.length || showList)?'d-none':'',
            classHideOrShowMainPartsPage: 'hide-flash-cards-show-list-exercise',
            callObj: this.layer(o, this, idC, idE, ap, temp_idE, voiceOff, showList)
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

        window.scrollTo(0,0);
        if(event) event.preventDefault();
    };
    clearExercise = event => {
        this.setState({
            idExercise: -1,
            callObj: '',
            classHideOrShowMainPartsPage: 'show-list-exercise-hide-flash-cards',
            classHideNavButtons: '',
            closeCloude: '',
            showListActice: false
        });
        clearTimeout(this.global.timeOutCloseCloud);
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
            this.setExercise(event,this.state.idExercise,this.state.idItem,'no-voice',this.global.idC,false,false,this.state.showListActice);
        }
        if(this.state.resultsSearch !== null) {
            this.searchChangeMain();
        }
        if(event) event.preventDefault();
    };
    changeDirection = (event) => {
        if(this.global.flashCardDirection === 'p->e') {
            setCookies('flashcards_cookie', 'e->p');
            this.global.flashCardDirection = 'e->p';

        } else {
            setCookies('flashcards_cookie', 'p->e');
            this.global.flashCardDirection = 'p->e';

        }
        this.setState({
            direction: this.global.directionText()
        });

        if(this.state.idExercise > -1) {
            this.setExercise(event,this.state.idExercise,this.state.idItem,false,this.global.idC,false,false,this.state.showListActice);
        }
        if(this.state.resultsSearch !== null) {
            this.searchChangeMain();
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
    timeoutAnim = (y,ap) => { // ap = autoplay
        if(this.state.enableAutoVoice) {
            this.global.soundSeparator.play();
        }
        const timeOut = this.global.autoplayLoop.first?1400:300;
        setTimeout(function (that) {
            that.setExercise(null,y,false,false,that.global.idC,false,ap);
            that.setState({classCheckOutMore: ''});
            //alert(x);
        },timeOut,this);
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
    checkOut = (autoplay) => {
        //console.log(idExercise + ' / ' + idItem + ' / ' + flashCardDirection); // left = polish, right = english
        //console.log(dataJson[idExercise].data[idItem]._en);
        if(this.state.enableAutoVoice) {
            setTimeout(function (that) {
                if(that.global.flashCardDirection === 'p->e') {
                    that.translateVoice(dataJson[that.state.idExercise].data[that.state.idItem]._en, "en",that.state.online,autoplay);

                } else {
                    that.translateVoice(dataJson[that.state.idExercise].data[that.state.idItem]._pl, "pl",that.state.online,autoplay);
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
        if(this.state.enableAutoVoice) {
            if(prop==="play") {
                that.checkOut('autoplay');
                this.setState({
                    autoPlayExercise: true
                })
            } else if(prop==='play-next') {
                that.global.autoplayLoop.second = setTimeout(that.timeoutAnim,400,that.state.idExercise,(that.global.autoplayLoop.first?'autoplay-check':false));
            }else if(prop==="stop") {
                that.global.autoplayLoop.first = false;
                clearTimeout(that.global.autoplayLoop.second);
                clearTimeout(that.global.autoplayLoop.third);
                this.setState({
                    autoPlayExercise: false
                })
            }
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
        this.searchChangeMain();
        this.setState({
            online: checkOnline
        });
        if(this.state.idExercise > -1) {
            // this.state.showListActice
            this.setExercise(event, this.state.idExercise, this.state.idItem,'no-voice',this.global.idC,false,false,this.state.showListActice);
            //this.setExercise(e,i,false,false,j,false,false,'show-list')
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

    searchBrowser = () => {
        this.setState({
            searchBrowser: !this.state.searchBrowser && true
        });
    };

    searchChange = (event) => {
        this.setState({searchWords: event.target.value});
    };

    searchWordsMainSlideToggle = (event) => {
        this.setState({searchWordsMainSlideToggle: this.state.searchWordsMainSlideToggle?'':'search-words-main-slide-toggle'})
    };

    getClosest = (el, nameClass) => {
        while (el.parentElement) {
            el = el.parentElement;
            //console.log(el.parentElement.className);
            if (el.parentElement.className === nameClass) {
                return true;
            } else {
                if(el.parentElement.getAttribute("id")==="root") {
                    return false;
                }
            }
        }
        return false;
    };

    searchWordsMainLayoutSlideToggle = (event) => {
        const falseOrTrue = this.getClosest(event.target,'direction-lang-and-search');
        //console.log(event.target);
        //console.log(this.getClosest(event.target,'direction-lang-and-search'));
        if(!falseOrTrue){
            this.setState({searchWordsMainSlideToggle: 'search-words-main-slide-toggle'});
        }
    };

    searchResult = (lang,that,idSearch) => {
        console.log('lang: ' + lang + ' | that: ' + that + ' | idSearch: ' + idSearch );
        that.setState({
            resultsSearch: dataJson.map(function (obj1) {
                let idResultSearchCat = 0;
                return obj1.data.map(function (obj2, i) {
                    //console.log(obj2._pl);
                    const obj2_lang = (lang==='p->e')?obj2._pl.toLowerCase():obj2._en.toLowerCase(),
                        tssw = that.state.searchWordsMain.toLowerCase();
                    return ((obj2_lang.indexOf(tssw) > -1)?
                        <li key={i}>
                            <span className={"d-none"}>{idResultSearchCat ++}</span>
                            {(idResultSearchCat === 1) && <h3 className="row"><span className="col">No category - {lang==='p->e'?obj1.name._pl:obj1.name._en}</span></h3>}
                            <p className={"d-flex id-" + (idSearch ++)}>
                                <span className={"col-6 d-flex"}>
                                    <button onClick={(e) => that.openHref(e,"https://translate.google.pl/#view=home&op=translate&sl=" + ((lang==='p->e')?('pl&tl=en&text=' + obj2._pl):('en&tl=pl&text=' + obj2._en)))} className="icon-gt"></button>
                                    <i className={!that.state.online || " icon-volume"} onClick={() => that.translateVoice(lang==='p->e'?obj2._pl:obj2._en,"pl",that.state.online)}>{lang==='p->e'?obj2._pl:obj2._en}</i>
                                </span>
                                <span className={"col-6 d-flex"}>
                                    <button onClick={(e) => that.openHref(e,"https://translate.google.pl/#view=home&op=translate&sl=" + ((lang==='p->e')?('en&tl=pl&text=' + obj2._en):('pl&tl=en&text=' + obj2._pl)))} className="icon-gt"></button>
                                    <i className={!that.state.online || " icon-volume"} onClick={() => that.translateVoice(lang==='p->e'?obj2._en:obj2._pl,"en",that.state.online)}>{lang==='p->e'?obj2._en:obj2._pl}</i>
                                </span>
                            </p>
                        </li>:'')
                }, that)
            }, that)
        });
        if(idSearch === 1) {
            that.setState({
                resultsSearch: ''
            });
        }
    };

    searchChangeMain = (event) => {
        console.log(this.state.direction);
        console.log(this.global.flashCardDirection);
        if(event) this.setState({searchWordsMain: event.target.value});
        clearTimeout(this.global.searchTime.first);
        let idSearch = 1;
        //if(this.state.searchWordsMain.length>0) {
            this.global.searchTime.first = setTimeout(function (that) {
                if(that.state.searchWordsMain.length === 0) {
                    that.setState({
                        resultsSearch: null
                    });
                } else {
                    that.searchResult(that.global.flashCardDirection,that,idSearch);
                }
            },400,this);
        //}
    };

    componentWillMount(){
        dataJson.map(function (obj, i) {
            //console.log('x');
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
        window.document.addEventListener("backbutton", () => {
            if(detectionDevice) {
                if(this.state.idExercise > -1) {
                    this.clearExercise();
                } else {
                    navigator.app.backHistory();
                }
            }
        }, false);
    };

    componentDidMount = () => {
        const that = this;
        window.onscroll = function() {
            if(window.pageYOffset === 0) {
                if(that.state.headerOnTop) {
                    that.setState({
                        headerOnTop: ''
                    });
                    //console.log('I AM AT THE TOP');
                }
            } else {
                if(!that.state.headerOnTop) {
                    that.setState({
                        headerOnTop: 'header-on-none-top'
                    });
                    //console.log("xcx");
                }
            }
        };

        // first category active
        this.global.categoryActive[0] = true;
    };

    render() {
        const { title } = this.props;
        //const Aux = props => props.children;

        this.uniqueCategory(dataJson,false);
        let directionState = this.state.direction.split("|");

        return (
            <Swipe
                onSwipeStart={this.onSwipeStart}
                onSwipeMove={this.onSwipeMove}
                onSwipeEnd={this.onSwipeEnd}

                ref={ e => this.container = e }

                // onSwipeRight={() => this.navMobileActive(true)}
            >
                <div
                    onClick={(e) => this.searchWordsMainLayoutSlideToggle(e)}
                    className={'module-flash-cards ' + this.state.classHideOrShowMainPartsPage + ' ' + this.state.navMobileActive + ' ' + this.state.rotateDisable + ' ' + this.state.enableAutoVoice}

                >
                    <div className="bg"></div>
                    <div className="bg bg-1"></div>
                    <div className="bg bg-2"></div>
                    <div className="bg bg-3"></div>

                    {this.state.preloader!=='delete' && <div className={this.state.preloader + " preloader d-flex justify-content-center align-items-center"}><span className="icon-new-logo"></span></div>}

                    <div className={"main-header-wrap " + this.state.headerOnTop + " " + this.state.searchWordsMainSlideToggle + ((this.state.searchWordsMain || this.state.searchWordsMainActive)?' active-search-words-main':'')}>
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
                            <ul className="top-menu d-flex flex-row list-unstyled">
                                {this.state.showListActice && (typeof window.find === 'function') &&
                                <li className={"link-search d-flex " + (!this.state.searchBrowser || 'link-search-active')}>
                                    <div className="search-on-page d-flex">
                                        <button onClick={() => window.find(this.state.searchWords)}>Search
                                        </button>
                                        <input type="search" placeholder={translate.searchOnThisPage + "..."} onChange={this.searchChange}
                                               value={this.state.searchWords}
                                               onKeyPress={(e) => {
                                                   if (e.key === 'Enter') {
                                                       window.find(this.state.searchWords)
                                                   }
                                               }}/>
                                    </div>
                                    <a href={'#search'} onClick={(e) => this.searchBrowser(e)}><span className="icon-search"></span></a>
                                </li>
                                }
                                <li className="link-voice"><a href={'#voice'} onClick={(e) => this.enableAutoVoice(e)}><span className="icon-volume"></span></a></li>
                                <li className="flag-pl"><a href={'#pl'} className={this.state.activePL} onClick={(e) => this.setLang(e,'pl')}>PL</a></li>
                                <li className="flag-en"><a href={'#en'} className={this.state.activeEN} onClick={(e) => this.setLang(e,'en')}>EN</a></li>
                            </ul>
                            <h1 className="icon-new-logo"><span className="d-none">F</span>lashCrads</h1>
                            <div className={"direction-lang-and-search"}>
                                <div className={"d-flex justify-content-center"}>
                                    <button className="direction-lang" onClick={(e) => this.changeDirection(e)}>{directionState[0]} <span className="icon-exchange"></span> {directionState[1]}</button>
                                    <input
                                        type="search"
                                        value={this.state.searchWordsMain}
                                        onChange={this.searchChangeMain}
                                        placeholder='&#xE816; ...'

                                        onFocus={() => {
                                                if(this.state.searchWordsMainSlideToggle){this.setState({searchWordsMainSlideToggle: ''});};
                                                this.setState({searchWordsMainActive:true});
                                            }
                                        }
                                        onBlur={() => this.setState({searchWordsMainActive:false})}
                                    />
                                    {(this.state.resultsSearch !== null) && <button onClick={(e) => this.searchWordsMainSlideToggle(e)} className={"submit-slide-toggle icon-up-open"}></button>}
                                </div>
                                <div className={"results-search"}>
                                {(this.state.resultsSearch !== null) &&

                                        <div className={"results-search-inside"}>
                                            <div className={"no-result-search"}>
                                                <p><span><strong>{this.state.searchWordsMain}</strong> - {(!this.state.resultsSearch)?translate.noResultSearch:translate.changeDirectionLanguage}<a href={"#change-direction"} onClick={(e) => this.changeDirection(e)}>{directionState[1]} -> {directionState[0]}</a></span></p></div>
                                                {
                                                    (this.state.resultsSearch) ?
                                                        <ul className="list-unstyled m-0">{this.state.resultsSearch}</ul>
                                                    :''
                                                }
                                        </div>

                                }
                                </div>
                            </div>
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
                                                    background: 'linear-gradient(to right, rgba(44,133,72,.2) 0%,rgba(44,133,72,.2) ' + percent + '%,rgba(255,255,255,0) ' + percent + '%,rgba(255,255,255,0) 100%), rgba(255,255,255,.8)',
                                                };

                                            percent = isNaN(percent)?'blank':percent+'%';

                                            if(this.state.langNameExercise(obj.category) === obj_category && obj.data.length) {
                                                return (
                                                    <li key={i} className={"d-flex justify-content-between exercise-item-" + i}>
                                                        <a href={'#flashcard' + i} style={stylePercent2} onClick={(e) => this.setExercise(e,i,false,false,j,(obj.excludeID.length!==obj.data.length))}>
                                                            {/*<span className="percent-border-top"></span>*/}
                                                            <span className="percent-pro" style={stylePercent1}></span>
                                                            <span className={"icon-random-card icon-random-card-" + j}></span>
                                                            {obj.excludeID.length === obj.data.length && <span className="icon-ok"></span>}
                                                            {this.state.langNameExercise(obj.name)} <i><span className="icon-up color-5">{obj.excludeID.length}/{obj.data.length} = {percent}</span> - <span className="icon-down color-17">{obj.dontKnowClick}</span></i>
                                                        </a>
                                                        <div className="buttons-option d-flex flex-column">
                                                            {(obj.excludeID.length !== 0 || obj.dontKnowClick !== 0) &&
                                                                <button className={'border-content-bottom button-reset '} title="Reset"><span className="reset-confirm" onClick={() => this.removeCookieExerciseId(false,i,obj)}>Reset</span><span className="icon-trash-empty" ></span></button>
                                                            }
                                                            <button className={'border-content-bottom button-list'} title="Show list" onClick={(e) => this.setExercise(e,i,false,false,j,false,false,'show-list')}><span className="icon-clipboard"></span></button>
                                                        </div>

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
                            {!this.state.showListActice && <span className={this.state.closeCloude}>{translate.buttonCloseExercise}</span>}
                        </button>

                        <div className={'flash-card'}>
                            {this.state.callObj}
                        </div>

                        <nav className={'nav-buttons ' + this.state.classHideNavButtons + (this.state.autoPlayExercise?' disable-opacity':'')}>
                            <span className={"icon-lock" + (this.state.autoPlayExercise?'':' d-none')}></span>
                            {!this.state.classCheckOutMore?<button className="button-check-out" onClick={() => this.checkOut()}>{translate.buttonCheckOut}</button>:<button className="button-check-out">{translate.lottery}...</button>}
                            <button title={translate.buttonIKnow} className="button-i-know" onClick={() => this.iKnow(this.state.idItem)}><span className="icon-ok"></span></button>
                            <button title={translate.buttonIDontKnow} className="button-i-dont-know" onClick={() => this.iDontKnow()}><span className="icon-cancel"></span></button>
                        </nav>
                    </div>
                    <footer className="main-footer">
                        <p>Copyright &copy; {title} | <a href="http://langfc.semjs.pl/polityka/" onClick={(e) => this.openHref(e,"http://langfc.semjs.pl/polityka/?lang="+translate.lang)} >{translate.privacy}</a> | {!isIE && <Detector
                            onChange={(online,event) => this.checkOnline(event,online)}
                            render={({ online }) => (
                                <span title={online?'online':'offline'} className={'icon-globe ' + (online?'':'icon-globe-disable')}></span>
                            )}
                        />}</p>
                    </footer>
                </div>
            </Swipe>

        );
    }
}

export default FlashCards;
