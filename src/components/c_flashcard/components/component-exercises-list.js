import React, { Component } from 'react';
import {translate} from "../language";
import Parser from "html-react-parser";
import dataJson from '../data_json/data.json';

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
    items = (i,o,that,obj,check,flashCardDirection) => {
        // const Aux = props => props.children;
        let hrefGT = (flashCardDirection !== 'p->e')?"https://translate.google.pl/#view=home&op=translate&sl=en&tl=pl&text=" + obj._en:"https://translate.google.pl/#view=home&op=translate&sl=pl&tl=en&text=" + obj._pl;
        return (

            <tr key={i} className={"list-container " + check}>
                <th>
                    <small>{i + 1}</small>

                    <button onClick={(e) => that.openHref(e,hrefGT)} className="google-translator" target='blank_'>
                        <span className="icon-gt"></span>
                    </button>
                </th>
                <td onClick={() => that.translateVoice((flashCardDirection === 'p->e')?obj._pl:obj._en, (flashCardDirection === 'p->e')?"pl":"en", that.state.online)}>
                    <span className={'icon-volume ' + (that.state.online ? '' : 'line-disable')}></span>
                    <span>{(flashCardDirection === 'p->e')?obj._pl:obj._en}</span>
                    {check==='check-ok' && <span className="icon-ok"></span>}
                </td>
                <td onClick = {() => that.translateVoice((flashCardDirection === 'p->e')?obj._en:obj._pl, (flashCardDirection === 'p->e')?"en":"pl", that.state.online)}>
                    <span className={'icon-volume ' + (that.state.online ? '' : 'line-disable')}></span>
                    <span>{(flashCardDirection === 'p->e')?obj._en:obj._pl}</span>
                    {check==='check-ok' && <span className="icon-ok"></span>}
                </td>
            </tr>

        )
    };
    render() {
        const { o, that, idC, flashCardDirection } = this.props;
        const thisComponent = this;
        // const Aux = props => props.children;
        //console.log(o.youKnowID);
        let percent = Math.ceil(o.youKnowID.length*100/o.data.length),
            stylePercent = {
                background: 'linear-gradient(to right, #2c8548 0%,#2c8548 ' + percent + '%,#974c49 ' + percent + '%,#974c49 100%)'
            },
            description;
        if(typeof dataJson[that.state.idExercise].description === 'object') {
            description = (that.global.lang === 'pl')?dataJson[that.state.idExercise].description._pl:dataJson[that.state.idExercise].description._en;
        }
        //o.data.push(o.youKnowID);
        if(typeof o.youKnowID.includes !== 'function') {
            o.youKnowID.includes = function () {};
        }
        if(typeof o.youDontKnowID.includes !== 'function') {
            o.youDontKnowID.includes = function () {};
        }
        console.log(o.youDontKnowID);
        return (
            // eslint-disable-next-line
            <div className={"flash-card-inset"}>
                <span className="percent-pro" style={stylePercent}></span>
                <h2>
                    <span className={"icon-random-card icon-random-card-" + idC}></span>
                    {that.state.langNameExercise(o.category) && that.state.langNameExercise(o.category) + ' / '}{that.state.langNameExercise(o.name)} <span className="icon-right"></span> <a href="#flashcards" onClick={(e) => this.flashcards(e,that,idC)}>{translate.flashcards}</a>
                </h2>
                <p>
                    {that.state.online?'online':'offline'} | <span className="icon-up color-5">{o.youKnowID.length}/{o.data.length} = {Math.ceil(o.youKnowID.length*100/o.data.length)}%</span> - <span className="icon-down color-17">{o.youDontKnowID.length} ({o.dontKnowClick})</span>
                </p>
                {description?<p>{Parser(description)}</p>:''}
                <div className={"table-wrap"}>
                    <table className={"table-list"}>
                        <thead>
                        <tr><th>id</th><th>{(flashCardDirection === 'p->e')?'pl':'en'}</th><th>{(flashCardDirection === 'p->e')?'en':'pl'}</th></tr>
                        </thead>
                        <tbody>
                        {o.youDontKnowID.length?<tr className="tr-header"><th colSpan="3">{translate.sentenceYouDidntKnow}</th></tr>:null}
                        {
                            o.data.map(function (obj, i) {
                                return o.youDontKnowID.includes(i)?thisComponent.items(i,o,that,obj,'check-you-dont-know',flashCardDirection):null;
                            }, that,thisComponent)
                        }

                        {/*this need fixed*/}
                        {!( (o.youKnowID.length === o.data.length) || (o.youDontKnowID.length === o.data.length) || (o.data.length <= o.youDontKnowID.length+o.youKnowID.length) )?<tr className="tr-header"><th colSpan="3">{translate.sentenceNotAnswered}</th></tr>:null}
                        {
                            o.data.map(function (obj, i) {
                                return !(o.youKnowID.includes(i) || o.youDontKnowID.includes(i))?thisComponent.items(i,o,that,obj,'check-no',flashCardDirection):null;
                            }, that,thisComponent)
                        }

                        {o.youKnowID.length?<tr className="tr-header"><th colSpan="3">{translate.sentenceYouKnew}</th></tr>:null}
                        {
                            o.data.map(function (obj, i) {
                                return o.youKnowID.includes(i)?thisComponent.items(i,o,that,obj,'check-ok',flashCardDirection):null;
                            }, that,thisComponent)
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export {ExercisesList}