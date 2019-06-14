import React, { Component } from 'react';
import {translate} from "../language";
import Parser from "html-react-parser";
import {centerClass, isIE} from "../varibles";
import dataJson from '../data_json/data.json';

/**
 * Sub component Exercises
 */
class Exercises extends Component {
    constructor(props){
        super(props);
        this.state = {
            checkWriteOk: '',
            checkWriteValue: '',
            translateForAMoment: ''
        };
    };
    fullItemsList = (e,that,idC) => {
        that.setState({showListActice:true});
        that.setExercise(e,that.state.idExercise,false,false,idC,false,true);
    };

    t = {};
    oneTimeVoice = true;
    writeAndCheck = (e,text) => {
        this.setState({checkWriteValue: e.target.value});
        clearTimeout(this.writeAndCheck.t);
        //// use something like trime, and small case letters, remove, removing brackets
        this.writeAndCheck.t = setTimeout(function (etext,text,that) {
            let t1 = etext.toLowerCase()
                //.split(/\(.+\)/g).join("")
                    .split(/\([^)]+\)/g).join("")
                    .split(".").join("")
                    .split("/").join('')
                    .split(",").join('')
                    .split(/\s+/).join(' ')
                    .trim(),
                t2 = text.toLowerCase()
                //.split(/\(.+\)/g).join("")
                    .split(/\([^)]+\)/g).join("")
                    .split(".").join("")
                    .split("/").join('')
                    .split(",").join('')
                    .split(/\s+/).join(' ')
                    .trim();

            console.log(t1 + '===' + t2);

            if(t1 === t2) {
                that.setState({checkWriteOk: 'check-write-ok'});
                that.props.that.setState({ buttonWriteOK: 'check-write-ok-button'});
            } else {
                that.setState({checkWriteOk: ''});
                that.props.that.setState({ buttonWriteOK: ''});
            }
        },600,e.target.value,text,this);
        //console.log(text + ' ?= ' + e.target.value);
    };

    timeoutTranslateForAMoment;
    showTranslateForAMoment = (trans) => {
        this.setState({
            translateForAMoment: trans
        });
        this.props.that.setState({
            translateForAMomentCheck: 'translate-for-a-moment-check'
        });
        this.timeoutTranslateForAMoment = setTimeout(function (that) {
            that.setState({
                translateForAMoment: ''
            });
        },5000,this);
    };

    listenTranslate = (that,flashCardDirection,trans) => {
        if(flashCardDirection === 'p->e') {
            that.translateVoice(trans, "en",that.state.online);
        } else {
            that.translateVoice(trans, "pl",that.state.online);
        }
        that.setState({
            translateForAMomentCheck: 'translate-for-a-moment-check'
        });
    };

    render() {
        const { o, that, voice, idItem, checkvoice, flashCardDirection, idC} = this.props;
        const thisComponent = this;
        return (
            // eslint-disable-next-line
            o.data.map(function (obj, i) {
                if(i === idItem) {
                    let percent = Math.ceil(o.youKnowID.length*100/o.data.length),
                        stylePercent = {
                            background: 'linear-gradient(to right, #2c8548 0%,#2c8548 ' + percent + '%,#974c49 ' + percent + '%,#974c49 100%)'
                        };

                    if(voice && checkvoice !== 'no-voice' && thisComponent.oneTimeVoice !== idItem) {
                        if(flashCardDirection === 'p->e') {
                            that.translateVoice(obj._pl, "pl",that.state.online);
                        } else {
                            that.translateVoice(obj._en, "en",that.state.online);
                        }
                        thisComponent.oneTimeVoice = idItem;
                    }

                    let description;
                    if(typeof dataJson[that.state.idExercise].description === 'object') {
                        description = (that.global.lang === 'pl')?dataJson[that.state.idExercise].description._pl:dataJson[that.state.idExercise].description._en;
                    }
                    const sizeText = 30, sizeTextMore = 40;
                    return (
                        <div className={'flash-card-inset' + (isIE?' ie-fix':'')} key={i}>
                            <span className="percent-pro" style={stylePercent}></span>
                            <h2>
                                <span className={"icon-random-card icon-random-card-" + idC}></span>
                                {that.state.langNameExercise(o.category) && that.state.langNameExercise(o.category) + ' / '}{that.state.langNameExercise(o.name)} <span className="icon-right"></span>&nbsp;<a href="#full-items-list" onClick={(e) => thisComponent.fullItemsList(e,that,idC)}>{translate.fullItemsList}</a>
                            </h2>
                            <p>
                                {that.state.online?'online':'offline'} | <span className="icon-up color-5">{o.youKnowID.length}/{o.data.length} = {Math.ceil(o.youKnowID.length*100/o.data.length)}%</span> - <span className="icon-down color-17">{o.youDontKnowID.length} ({o.dontKnowClick})</span>
                            </p>
                            {/*you will do description in cloud and this description you will open after hover button*/}
                            <div className={"d-none"}>{description?<p>{Parser(description)}</p>:''}</div>

                            <div className="flip-container">
                                {
                                    flashCardDirection === 'p->e' ?
                                        <div className="flipper">
                                            <div className={'front ' + centerClass}>
                                                <p className="paragraph-top"  onClick={() => that.translateVoice(obj._pl, "pl",that.state.online)}>
                                                    <strong>{translate.polish}</strong>
                                                    <span className={'icon-volume ' + (that.state.online?'':'line-disable')}></span>
                                                    <span className={obj._pl.length>sizeText?(obj._pl.length>sizeTextMore?'small-size':'normal-size'):'large-size'}>{obj._pl}</span>
                                                </p>
                                                <hr />
                                                <input
                                                    type="text"
                                                    className={"write-and-check " + thisComponent.state.checkWriteOk}
                                                    placeholder={translate.TryToWriteATranslate}
                                                    value={thisComponent.state.checkWriteValue}
                                                    onChange={(e) => thisComponent.writeAndCheck(e,obj._en)}
                                                />
                                                {(obj._en.indexOf('(') > -1 && obj._en.indexOf(')') > -1)?
                                                    <div className={"additional-options"}>
                                                        {/*<p><span>{translate.additionally}:</span> {obj._en.match(/\((.*)\)/)[0]}</p>*/}
                                                        <p><span>{translate.additionally}:</span> {obj._en.match(/\(([^)]*)\)$/)[0]}</p>
                                                    </div>
                                                    : ''
                                                }
                                                {thisComponent.state.translateForAMoment ?
                                                    <p className={"correct-show-answer"}>{thisComponent.state.translateForAMoment}</p>
                                                    :
                                                    <button className={"button-show-answer"}
                                                            onClick={() => thisComponent.showTranslateForAMoment(obj._en)}>{translate.showAnswer}</button>
                                                }
                                                <button className={"button-listen-answer"} onClick={() => thisComponent.listenTranslate(that,flashCardDirection,obj._en)}><span className={'icon-volume ' + (that.state.online?'':'line-disable')}></span> {translate.listenTranslate}</button>


                                                <div className="list-extends-links">
                                                    <button onClick={(e) => that.openHref(e,"https://translate.google.pl/#view=home&op=translate&sl=pl&tl=en&text=" + obj._pl)} className="google-translator" target='blank_'>
                                                        {/*{translate.gt}*/}
                                                        <span className="icon-gt"></span>
                                                    </button>
                                                    {/*<button onClick={(e) => that.openHref(e,"https://context.reverso.net/tłumaczenie/polski-angielski/" + obj._pl)} className="reverso-context" target='blank_'>*/}
                                                    {/*Reverso context<span className="icon-arrows-cw"></span>*/}
                                                    {/*</button>*/}
                                                </div>
                                            </div>
                                            <div className={'back ' + centerClass}>
                                                <p className="paragraph-top" onClick={() => that.translateVoice(obj._pl, "pl",that.state.online) }>
                                                    <strong>{translate.polish}</strong>
                                                    <span className={'icon-volume ' + (that.state.online?'':'line-disable')}></span>
                                                    <span className={obj._pl.length>sizeText?(obj._pl.length>sizeTextMore?'small-size':'normal-size'):'large-size'}>{obj._pl}</span>
                                                </p>
                                                <hr />
                                                <p className="paragraph-bottom" onClick={() => that.translateVoice(obj._en, "en",that.state.online)}>
                                                    <strong>{translate.english}</strong>
                                                    <span className={'icon-volume ' + (that.state.online?'':'line-disable')}></span>
                                                    <span className={obj._en.length>sizeText?(obj._en.length>sizeTextMore?'small-size':'normal-size'):'large-size'}><strong>{obj._en}</strong></span>
                                                </p>
                                                <div className="list-extends-links">
                                                    <button onClick={(e) => that.openHref(e,"https://translate.google.pl/#view=home&op=translate&sl=pl&tl=en&text=" + obj._pl)} className="google-translator" target='blank_'>
                                                        {/*{translate.gt}*/}
                                                        <span className="icon-gt"></span>
                                                    </button>
                                                    {/*<button onClick={(e) => that.openHref(e,"https://context.reverso.net/tłumaczenie/polski-angielski/" + obj._pl)} className="reverso-context" target='blank_'>*/}
                                                    {/*Reverso context<span className="icon-arrows-cw"></span>*/}
                                                    {/*</button>*/}
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        <div className="flipper">
                                            <div className={'front ' + centerClass}>
                                                <p className="paragraph-top"  onClick={() => that.translateVoice(obj._en, "en", that.state.online)}>
                                                    <strong>{translate.english}</strong>
                                                    <span className={'icon-volume ' + (that.state.online?'':'line-disable')}></span>
                                                    <span className={obj._en.length>sizeText?(obj._en.length>sizeTextMore?'small-size':'normal-size'):'large-size'} >{obj._en}</span>
                                                </p>
                                                <hr />
                                                <input
                                                    type="text"
                                                    className={"write-and-check " + thisComponent.state.checkWriteOk}
                                                    placeholder={translate.TryToWriteATranslate}
                                                    value={thisComponent.state.checkWriteValue}
                                                    onChange={(e) => thisComponent.writeAndCheck(e,obj._pl)}
                                                />
                                                {(obj._pl.indexOf('(') > -1 && obj._pl.indexOf(')') > -1)?
                                                    <div className={"additional-options"}>
                                                        {/*<p><span>{translate.additionally}:</span> {obj._pl.match(/\((.*)\)/)[0]}</p>*/}
                                                        <p><span>{translate.additionally}:</span> {obj._pl.match(/\(([^)]*)\)$/)[0]}</p>
                                                    </div>
                                                    : ''
                                                }
                                                {thisComponent.state.translateForAMoment ?
                                                    <p className={"correct-show-answer"}>{thisComponent.state.translateForAMoment}</p>
                                                    :
                                                    <button className={"button-show-answer"}
                                                            onClick={() => thisComponent.showTranslateForAMoment(obj._pl)}>{translate.showAnswer}</button>
                                                }
                                                <button className={"button-listen-answer"} onClick={() => thisComponent.listenTranslate(that,flashCardDirection,obj._pl)}><span className={'icon-volume ' + (that.state.online?'':'line-disable')}></span> {translate.listenTranslate}</button>

                                                <div className="list-extends-links">
                                                    <button onClick={(e) => that.openHref(e,"https://translate.google.pl/#view=home&op=translate&sl=en&tl=pl&text=" + obj._en)} className="google-translator" target='blank_'>
                                                        {/*{translate.gt}*/}
                                                        <span className="icon-gt"></span>
                                                    </button>
                                                    {/*<button onClick={(e) => that.openHref(e,"https://context.reverso.net/tłumaczenie/angielski-polski/" + obj._en)} className="reverso-context" target='blank_'>*/}
                                                    {/*Reverso context<span className="icon-arrows-cw"></span>*/}
                                                    {/*</button>*/}
                                                </div>
                                            </div>
                                            <div className={'back ' + centerClass}>
                                                <p className="paragraph-top"  onClick={() => that.translateVoice(obj._en, "en",that.state.online)}>
                                                    <strong>{translate.english}</strong>
                                                    <span className={'icon-volume ' + (that.state.online?'':'line-disable')}></span>
                                                    <span className={obj._en.length>sizeText?(obj._en.length>sizeTextMore?'small-size':'normal-size'):'large-size'}>{obj._en}</span></p>
                                                <hr />

                                                <p className="paragraph-bottom"  onClick={() => that.translateVoice(obj._pl, "pl",that.state.online) }>
                                                    <strong>{translate.polish}</strong>
                                                    <span className={'icon-volume ' + (that.state.online?'':'line-disable')}></span>
                                                    <span className={obj._pl.length>sizeText?(obj._pl.length>sizeTextMore?'small-size':'normal-size'):'large-size'}><strong>{obj._pl}</strong></span>
                                                </p>
                                                <div className="list-extends-links">
                                                    <button onClick={(e) => that.openHref(e,"https://translate.google.pl/#view=home&op=translate&sl=en&tl=pl&text=" + obj._en)} className="google-translator" target='blank_'>
                                                        {/*{translate.gt}*/}
                                                        <span className="icon-gt"></span>
                                                    </button>
                                                    {/*<button onClick={(e) => that.openHref(e,"https://context.reverso.net/tłumaczenie/angielski-polski/" + obj._en)} className="reverso-context" target='blank_'>*/}
                                                    {/*Reverso context<span className="icon-arrows-cw"></span>*/}
                                                    {/*</button>*/}
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

export { Exercises }