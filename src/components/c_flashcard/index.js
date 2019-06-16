import React, { Component } from 'react';
import './component.css';
import {setCookies, removeCookies, getCookies} from './cookies';
import Swipe from 'react-easy-swipe';
import dataJson from './data_json/data.json';
import { detectionDevice, isIE, prefixResetProgressCookies } from './varibles';
import { translate, setLanguage } from './language';
import ReactResizeDetector from 'react-resize-detector';
import Parser from 'html-react-parser';
import SoundSeparator from './sounds/pi-pum.mp3';

import {ToRepeat} from './components/component-to-repeat';
import {Congratulation} from './components/component-congratulation';
import {Exercises} from './components/component-exercises';
import {ExercisesList} from './components/component-exercises-list';

//import { Detector, Online, Offline } from 'react-detect-offline';

const Detector = !isIE && require('react-detect-offline').Detector;


/**
 * Main component FlashCards
 */
class FlashCards extends Component {
    constructor(props){
        super(props);
        this.widthMenu = React.createRef();
        this.global = {
            uniqueCategoryArray: [],
            categoryActive: [],
            flashCardDirection: this.startCookiesFlashCardDirection(),
            lang: this.startCookiesLang(),
            idC: false,
            fSwipe: false,
            timeOutCloseCloud: true,
            version: '1.0.2',
            searchTime: {},
            soundSeparator: new Audio(SoundSeparator),
            //toRepeatComponent: <ToRepeat that={this} ref={instance => { this.child = instance; }}  />,
            directionText: () => {
                return (this.global.flashCardDirection === 'e->p') ? translate.en + ' | ' + translate.pl : translate.pl + ' | ' + translate.en
            }
        };
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
            showListActice: false,
            searchBrowser: false,
            searchWords: '',
            searchWordsMain: '',
            searchWordsMainActive: false,
            resultsSearch: null,
            resultsSearchCount: 0,
            searchWordsMainSlideToggle: '',
            buttonWriteOK: '',
            infoFull: '',
            translateForAMomentCheck: '',
            langNameExercise: (j,l=this.global.lang) => {
                switch (l) {
                    case 'en': return j._en;
                    default: return j._pl; // pl
                }
            }
        };
    };

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
            return 'pl';
        } else {
            if(getCookies('language_cookie') === 'pl') {
                return 'pl';
            } else {
                return 'en';
            }
        }
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

    translateVoice = (text,lang,active) => {
        if(active && typeof window.responsiveVoice === 'object') {
            switch (lang) {
                case 'pl':
                    window.responsiveVoice.speak(text, "Polish Female");
                    break;
                case 'en':
                    window.responsiveVoice.speak(text, "UK English Male");
                    break;
                default:
                    window.responsiveVoice.speak(text, "UK English Male");
            }
        } 
    };

    layer = (o,that,idC, idE, temp_idE, voiceOff, showList) => {
        if(showList) {
            this.setState({
               showListActice: true
            });
            return <ExercisesList o={o} that={that} idC={idC} idItem={temp_idE} flashCardDirection={that.global.flashCardDirection} checkvoice={voiceOff} voice={that.state.enableAutoVoice} />;

        } else {
            if(o.youKnowID.length === o.data.length) {
                return <Congratulation that={that} idC={idC} ide={idE} />;
            } else {
                return <Exercises o={o} that={that} idC={idC} idItem={temp_idE} flashCardDirection={that.global.flashCardDirection} checkvoice={voiceOff} voice={that.state.enableAutoVoice} ref={instance => { this.childExercises = instance; }} />;
            }
        }
    };

    setExercise = (event,idE,idForce,voiceOff,idC,closeCloude,showList) => {

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
            classHideNavButtons: (o.youKnowID.length === o.data.length || showList)?'d-none':'',
            classHideOrShowMainPartsPage: 'hide-flash-cards-show-list-exercise',
            callObj: this.layer(o, this, idC, idE, temp_idE, voiceOff, showList)
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

        if(showList) window.scrollTo(0,0);
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
        this.child.randomItem();
        delete this.lastNumberRandom;
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
            this.setExercise(event,this.state.idExercise,this.state.idItem,'no-voice',this.global.idC,false,this.state.showListActice);
        }
        if(this.state.resultsSearch !== null) {
            this.searchChangeMain();
        }
        if(event) event.preventDefault();
    };

    clearChildExerciseAlias = () => {
        this.childExercises.setState({
            checkWriteOk: '',
            checkWriteValue: '',
            translateForAMoment: ''
        });
        clearTimeout(this.childExercises.timeoutTranslateForAMoment);
        this.setState({
            buttonWriteOK: '',
            translateForAMomentCheck: ''
        });
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
            //// ////
            if(!this.state.showListActice) {
                this.clearChildExerciseAlias();
            }
            this.setExercise(event,this.state.idExercise,this.state.idItem,false,this.global.idC,false,this.state.showListActice);
        }
        if(this.state.resultsSearch !== null) {
            this.searchChangeMain();
        }
        if(event) event.preventDefault();

    };



    // randomItem = () => {
    //     this.createArrayRandom();
    //     // if(typeof this.lastNumber !== 'undefined') console.log("last number is: " + this.lastNumber);
    //     // else console.log("Last number not exist");
    //
    //     const min = 0, max=this.newArrayId.length;
    //     let randomNumber;
    //
    //     let unique=false;
    //     do {
    //         unique=true;
    //         randomNumber = Math.floor(Math.random() * (max - min)) + min;
    //         if(randomNumber === this.lastNumber && max>1) {
    //             unique=false;
    //         }
    //     } while (!unique);
    //
    //     this.setState({
    //         idRand: randomNumber
    //     });
    //     this.lastNumber = randomNumber;
    //     //console.log('x: ' + randomNumber);
    // };

    randomItem = (ol) => {
        if(typeof this.lastNumberRandom !== 'undefined') console.log("last number is: " + this.lastNumberRandom);
        else console.log("Last number not exist");

        console.log("count number in random: " + (ol.data.length-ol.youKnowID.length));
        let unique, randomNr;

        do {
            unique=true;
            randomNr=Math.floor((Math.random()*ol.data.length));
            if(typeof ol.youKnowID === 'object' && ol.youKnowID.length > 0 && ol.youKnowID.length < ol.data.length) {
                for(let i=0; i<ol.youKnowID.length; i++) { if(ol.youKnowID[i]===randomNr) unique=false; }
            }
            if(randomNr === this.lastNumberRandom && (ol.data.length-ol.youKnowID.length)>1) unique=false;
        } while (!unique);

        this.lastNumberRandom = randomNr;
        console.log("current random: " + randomNr);
        return randomNr;

    };

    timeoutAnim = (y) => {
        if(this.state.enableAutoVoice) {
            this.global.soundSeparator.play();
        }
        setTimeout(function (that) {
            that.setExercise(null,y,false,false,that.global.idC,false);
            that.setState({classCheckOutMore: ''});
        },300,this);
    };

    iKnow = (idI) => {

        this.clearChildExerciseAlias();

        if(this.state.idExercise > -1) {
            const o = dataJson;
            if(typeof o[this.state.idExercise].youKnowID !== 'object') {
                o[this.state.idExercise].youKnowID = [];
            }
            if(o[this.state.idExercise].youKnowID.length < o[this.state.idExercise].data.length && idI !== false ) {
                o[this.state.idExercise].youKnowID.push(idI);
                setCookies(prefixResetProgressCookies+'obj_exercise_cookie_'+this.state.idExercise, JSON.stringify(o[this.state.idExercise].youKnowID));
            }
            this.setState({classCheckOut: ''});
            setTimeout(this.timeoutAnim,(this.state.rotateDisable)?0:400,this.state.idExercise);
            if(o[this.state.idExercise].youKnowID.length === o[this.state.idExercise].data.length){
                this.setState({
                    classHideNavButtons: 'd-none'
                });
            }

        }
    };

    iDontKnow = (idI) => {

        this.clearChildExerciseAlias();

        if(this.state.idExercise > -1) {
            const o = dataJson;

            //\\
            if(typeof o[this.state.idExercise].youDontKnowID !== 'object') {
                o[this.state.idExercise].youDontKnowID = [];
            }
            if(o[this.state.idExercise].youDontKnowID.length < o[this.state.idExercise].data.length && idI !== false ) {
                //IE11 not support includes
                if(typeof o[this.state.idExercise].youDontKnowID.includes === 'function') {
                    if(!o[this.state.idExercise].youDontKnowID.includes(idI)) {
                        o[this.state.idExercise].youDontKnowID.push(idI);
                        setCookies(prefixResetProgressCookies+'obj_exercise_cookie_you_dont_know_'+this.state.idExercise, JSON.stringify(o[this.state.idExercise].youDontKnowID));
                    }
                }
            }

            o[this.state.idExercise].dontKnowClick += 1;
            setCookies(prefixResetProgressCookies+'obj_exercise_cookie_dk_click_'+this.state.idExercise, o[this.state.idExercise].dontKnowClick);
            this.setState({classCheckOut: ''});
            setTimeout(this.timeoutAnim,400,this.state.idExercise);
        }
    };

    simpleLottery = () => {

        this.clearChildExerciseAlias();

        if(this.state.idExercise > -1) {
            const o = dataJson;
            this.setState({classCheckOut: ''});
            setTimeout(this.timeoutAnim,(this.state.rotateDisable)?0:400,this.state.idExercise);
            if(o[this.state.idExercise].youKnowID.length === o[this.state.idExercise].data.length){
                this.setState({
                    classHideNavButtons: 'd-none'
                });
            }
        }
    };

    checkOut = () => {
        //console.log(idExercise + ' / ' + idItem + ' / ' + flashCardDirection); // left = polish, right = english
        //console.log(dataJson[idExercise].data[idItem]._en);

        if(this.state.enableAutoVoice) {
            setTimeout(function (that) {
                if(that.global.flashCardDirection === 'p->e') {
                    that.translateVoice(dataJson[that.state.idExercise].data[that.state.idItem]._en, "en",that.state.online);

                } else {
                    that.translateVoice(dataJson[that.state.idExercise].data[that.state.idItem]._pl, "pl",that.state.online);
                }
            }, 300,this);
        }
        this.setState({
            classCheckOut: 'check-out-card',
            classCheckOutMore: 'check-out-card-more'
        });
        this.childExercises.setState({
            checkWriteOk: ''
        });
    };

    removeCookieExerciseId = (event,ide,o) => {
        removeCookies(prefixResetProgressCookies+'obj_exercise_cookie_'+ide);
        removeCookies(prefixResetProgressCookies+'obj_exercise_cookie_you_dont_know_'+ide);
        removeCookies(prefixResetProgressCookies+'obj_exercise_cookie_dk_click_'+ide);
        if(typeof o === 'object') {
            o.youKnowID = [];
            o.youDontKnowID = [];
            o.dontKnowClick = 0;
            this.setState({});
        }
        this.child.randomItem();
        if(event) event.preventDefault();
    };

    removeCookieExerciseAll = () => {
        // eslint-disable-next-line
        dataJson.map(function (obj, i) {
            removeCookies(prefixResetProgressCookies+'obj_exercise_cookie_'+i);
            removeCookies(prefixResetProgressCookies+'obj_exercise_cookie_you_dont_know_'+i);
            removeCookies(prefixResetProgressCookies+'obj_exercise_cookie_dk_click_'+i);
            obj.youKnowID = [];
            obj.youDontKnowID = [];
            obj.dontKnowClick = 0;
        });
        this.child.randomItem();
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
            this.setExercise(event, this.state.idExercise, this.state.idItem,'no-voice',this.global.idC,false,this.state.showListActice);
            //this.setExercise(e,i,false,false,j,false,false,'show-list')
        }
    };

    navMobileActive = () => {
        this.setState({
            navMobileActive: (this.state.navMobileActive)?'':'nav-mobile-active',
            moveMenu: (this.state.navMobileActive)?this.widthMenu.current.offsetWidth:0,
        });
    };

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

    searchWordsMainSlideToggle = () => {
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
        if(!this.state.searchWordsMainSlideToggle) {
            const falseOrTrue = this.getClosest(event.target,'direction-lang-and-search');
            //console.log(event.target);
            //console.log(this.getClosest(event.target,'direction-lang-and-search'));
            if(!falseOrTrue){
                this.setState({searchWordsMainSlideToggle: 'search-words-main-slide-toggle'});
            }
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
                            {(idResultSearchCat === 1) && <h3 className="row"><span className="col">{lang==='p->e'?obj1.category._pl:obj1.category._en} - {lang==='p->e'?obj1.name._pl:obj1.name._en}</span></h3>}
                            <p className={"d-flex id-" + (idSearch ++)}>
                                <span className={"col-6 d-flex"}>
                                    <button onClick={(e) => that.openHref(e,"https://translate.google.pl/#view=home&op=translate&sl=" + ((lang==='p->e')?('pl&tl=en&text=' + obj2._pl):('en&tl=pl&text=' + obj2._en)))} className="icon-gt"></button>
                                    <i className={!that.state.online || " icon-volume"} onClick={() => that.translateVoice(lang==='p->e'?obj2._pl:obj2._en,(lang==='p->e'?"pl":"en"),that.state.online)}>{lang==='p->e'?obj2._pl:obj2._en}</i>
                                </span>
                                <span className={"col-6 d-flex"}>
                                    <button onClick={(e) => that.openHref(e,"https://translate.google.pl/#view=home&op=translate&sl=" + ((lang==='p->e')?('en&tl=pl&text=' + obj2._en):('pl&tl=en&text=' + obj2._pl)))} className="icon-gt"></button>
                                    <i className={!that.state.online || " icon-volume"} onClick={() => that.translateVoice(lang==='p->e'?obj2._en:obj2._pl,(lang==='p->e'?"en":"pl"),that.state.online)}>{lang==='p->e'?obj2._en:obj2._pl}</i>
                                </span>
                            </p>
                        </li>:'')
                }, that)
            }, that)
        });
        that.setState({
            resultsSearchCount: idSearch-1
        });
        if(idSearch === 1) {
            that.setState({
                resultsSearch: '',
                resultsSearchCount: 0
            });
        }
    };

    searchChangeMain = (event) => {
        console.log(this.state.direction);
        console.log(this.global.flashCardDirection);
        if(event) this.setState({searchWordsMain: event.target.value});
        clearTimeout(this.global.searchTime.first);
        clearTimeout(this.global.searchTime.second);
        let idSearch = 1;
        this.global.searchTime.second = setTimeout(function (that) {
            if(that.state.searchWordsMain.length>1) {
                that.global.searchTime.first = setTimeout(function (that) {
                    if(that.state.searchWordsMain.length === 0) {
                        that.setState({
                            resultsSearch: null
                        });
                    } else {
                        that.searchResult(that.global.flashCardDirection,that,idSearch);
                    }
                },400,that);
            } else {
                that.setState({
                    resultsSearch: null,
                    resultsSearchCount: 0
                });
            }
        },400,this);
    };

    infoFull = () => {
        if(this.state.infoFull) {
            this.setState({infoFull:''});
        } else {
            this.setState({infoFull:'category-active'});
        }
    };

    componentWillMount(){
        dataJson.map(function (obj, i) {
            //console.log('x');
            if(typeof obj.youKnowID  === 'undefined') {
                obj.youKnowID = [];
                obj.youDontKnowID = [];
                obj.dontKnowClick = 0;
            }

            if(getCookies(prefixResetProgressCookies+'obj_exercise_cookie_' + i,'array') != null ) {
                //alert(getCookies(prefixResetProgressCookies+'obj_exercise_cookie_' + i,'array'));
                obj.youKnowID = getCookies(prefixResetProgressCookies+'obj_exercise_cookie_' + i,'array');
            }
            if(getCookies(prefixResetProgressCookies+'obj_exercise_cookie_you_dont_know_' + i,'array') != null ) {
                //alert(getCookies(prefixResetProgressCookies+'obj_exercise_cookie_you_dont_know_' + i,'array'));
                obj.youDontKnowID = getCookies(prefixResetProgressCookies+'obj_exercise_cookie_you_dont_know_' + i,'array');
            }
            if(getCookies(prefixResetProgressCookies+'obj_exercise_cookie_dk_click_' + i) != null) {
                obj.dontKnowClick = parseInt(getCookies(prefixResetProgressCookies+'obj_exercise_cookie_dk_click_' + i));
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
        //this.global.categoryActive[0] = true;
    };

    render() {
        const { title } = this.props;
        //const Aux = props => props.children;

        this.uniqueCategory(dataJson,false);
        let directionState = this.state.direction.split("|");

        //console.log(dataJson);
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

                                        // onKeyPress={(e) => {
                                        //     if (e.key === 'Enter') {
                                        //         window.find(this.state.searchWordsMain)
                                        //     }
                                        // }}

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
                                                <p>
                                                    <span>
                                                        <strong>{this.state.searchWordsMain}</strong>
                                                        - {translate.found}: {this.state.resultsSearchCount} | {(!this.state.resultsSearch)?translate.noResultSearch:translate.changeDirectionLanguage}
                                                        <a href={"#change-direction"} onClick={(e) => this.changeDirection(e)}>{directionState[1]} -> {directionState[0]}</a>
                                                        {translate.or} <a className="icon-gt" href="#gt" onClick={(e) => this.openHref(e,"https://translate.google.pl/#view=home&op=translate&sl=" + (this.global.flashCardDirection==='p->e'?'pl&tl=en&text=':'en&tl=pl&text=') + this.state.searchWordsMain)}>Google Translate</a>
                                                    </span>
                                                </p>
                                            </div>
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
                        <div className="category-box">
                            <p className={"title-style-text category-info " + this.state.infoFull} onClick={() => this.infoFull()}>{this.state.infoFull?translate.infoDescription:(translate.infoDescription.substr(0, 49) + '...')} {!this.state.infoFull || <a href="mailto:aleksander.nyczyk@gmail.com" onClick={(e) => this.openHref(e,"mailto:aleksander.nyczyk@gmail.com")} >e-mail</a>}<span className="icon-down-open"></span></p>
                        </div>
                        <ToRepeat that={this} ref={instance => { this.child = instance; }}  />
                        {this.global.uniqueCategoryArray.map(function (obj_category, j) {
                            return (
                                <div className="category-box" key={j}>

                                    {obj_category && <h2 onClick={() => this.showCategory(j)}  className={'category-' + j + ' ' + (this.global.categoryActive[j]?'category-active':'')}>{obj_category} <span className="icon-down-open"></span></h2>}

                                    <ul className={'main-list-exercise-inset list-unstyled'}>
                                        {/* eslint-disable-next-line */}
                                        {dataJson.map(function (obj, i) {
                                            //console.log(obj);
                                            let percent = Math.ceil(obj.youKnowID.length*100/obj.data.length),
                                                stylePercent1 = {
                                                    background: 'linear-gradient(to right, #2c8548 0%,#2c8548 ' + percent + '%,#974c49 ' + percent + '%,#974c49 100%)'
                                                },
                                                stylePercent2 = {
                                                    background: 'linear-gradient(to right, rgba(44,133,72,.2) 0%,rgba(44,133,72,.2) ' + percent + '%,rgba(255,255,255,0) ' + percent + '%,rgba(255,255,255,0) 100%), rgba(255,255,255,.8)',
                                                };

                                            percent = isNaN(percent)?'blank':percent+'%';

                                            if(this.state.langNameExercise(obj.category) === obj_category && obj.data.length && !obj.hide) {
                                                return (
                                                    <li key={i} className={"d-flex justify-content-between exercise-item-" + i}>
                                                        <a href={'#flashcard' + i} style={stylePercent2} onClick={(e) => this.setExercise(e,i,false,false,j,(obj.youKnowID.length!==obj.data.length))}>
                                                            {/*<span className="percent-border-top"></span>*/}
                                                            <span className="percent-pro" style={stylePercent1}></span>
                                                            <span className={"icon-random-card icon-random-card-" + j}></span>
                                                            {obj.youKnowID.length === obj.data.length && <span className="icon-ok"></span>}
                                                            {this.state.langNameExercise(obj.name)} <i><span className="icon-up color-5">{obj.youKnowID.length}/{obj.data.length} = {percent}</span> - <span className="icon-down color-17">{obj.youDontKnowID.length} ({obj.dontKnowClick})</span></i>
                                                        </a>
                                                        <div className="buttons-option d-flex flex-column">
                                                            {(obj.youKnowID.length !== 0 || obj.dontKnowClick !== 0 || obj.youDontKnowID.length !== 0) &&
                                                                <button className={'border-content-bottom button-reset '} title="Reset"><span className="reset-confirm" onClick={() => this.removeCookieExerciseId(false,i,obj)}>Reset</span><span className="icon-trash-empty" ></span></button>
                                                            }
                                                            <button className={'border-content-bottom button-list'} title="Show list" onClick={(e) => this.setExercise(e,i,false,false,j,false,'show-list')}><span className="icon-clipboard"></span></button>
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

                        <nav className={'nav-buttons ' + this.state.classHideNavButtons + ' ' + this.state.translateForAMomentCheck}>
                            {!this.state.classCheckOutMore?<button className={"button-check-out " + this.state.buttonWriteOK} onClick={() => this.checkOut()}>{translate.buttonCheckOut}</button>:<button className="button-check-out">{translate.lottery}...</button>}
                            <button title={translate.buttonIKnow} className="button-i-know" onClick={() => this.iKnow(this.state.idItem)}><span className="icon-ok"></span>{' ' + ((this.state.buttonWriteOK && !this.state.translateForAMomentCheck)?translate.buttonCheckOutToNext:'')}</button>
                            <button title={translate.buttonSimpleLotter} className="button-simple-lottery" onClick={() => this.simpleLottery()}><span className="icon-arrows-cw"></span></button>
                            <button title={translate.buttonIDontKnow} className="button-i-dont-know" onClick={() => this.iDontKnow(this.state.idItem)}><span className="icon-cancel"></span></button>
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
