import React, { Component } from 'react';
import {setCookies} from "../cookies";
import {translate} from "../language";
import dataJson from '../data_json/data.json';
import {prefixResetProgressCookies} from '../varibles';

/**
 * Sub component To Repeat
 */
class ToRepeat extends Component {
    constructor(props){
        super(props);
        this.state = {
            categoryActive: false,
            idRand: 0,
            selected: {},
            toggleRepeat: false
        };
    };

    createArrayRandom = () => {
        this.newArrayId = [];
        this.newId = 0;
        // eslint-disable-next-line
        dataJson.map(function (obj1) {
            // eslint-disable-next-line
            obj1.data.map(function (obj2, i2) {
                if(typeof obj1.youDontKnowID.includes === 'function') {
                    if (obj1.youDontKnowID.includes(i2)) {
                        this.newArrayId.push(this.newId++);
                    }
                }
            },this)
        },this);
        console.log(this.newArrayId);
    };

    showCategory = () => {
        this.setState({
            categoryActive: this.state.categoryActive?false:true
        });
    };

    randomItem = () => {
        this.createArrayRandom();
        // if(typeof this.lastNumber !== 'undefined') console.log("last number is: " + this.lastNumber);
        // else console.log("Last number not exist");

        const min = 0, max=this.newArrayId.length;
        let randomNumber;

        let unique=false;
        do {
            unique=true;
            randomNumber = Math.floor(Math.random() * (max - min)) + min;
            if(randomNumber === this.lastNumber && max>1) {
                unique=false;
            }
        } while (!unique);

        this.setState({
            idRand: randomNumber
        });
        this.lastNumber = randomNumber;
        //console.log('x: ' + randomNumber);
    };

    justIKnow = (idE,idI) => {
        console.log(dataJson[idE].youDontKnowID);
        const { that } = this.props;
        const o = dataJson[idE].youDontKnowID;
        o.splice( o.indexOf(idI), 1 );
        dataJson[idE].dontKnowClick--;
        // dataJson[idE].youDontKnowID.push(idI);
        setCookies(prefixResetProgressCookies+'obj_exercise_cookie_you_dont_know_'+idE, JSON.stringify(dataJson[idE].youDontKnowID));
        setCookies(prefixResetProgressCookies+'obj_exercise_cookie_dk_click_'+idE, dataJson[idE].dontKnowClick);

        this.randomItem();
        that.setState({});
        console.log(dataJson[idE].youDontKnowID);
    };

    toggleRepeat = () => {
        this.setState({
            toggleRepeat: this.state.toggleRepeat?false:true
        });
    };

    checkOut = (id) => {
        // setTimeout(function (that) {
        //     let selected = that.state.selected;
        //     if(that.idActive !== id) {
        //         for(let i=0; i<that.newArrayId.length; i++) {
        //             selected[i] = false;
        //         }
        //     }
        //     that.idActive = id;
        //     selected[id] = !selected[id];
        //     that.setState({selected: selected});
        // },2000,this);
        let selected = this.state.selected;
        if(this.idActive !== id) {
            for(let i=0; i<this.newArrayId.length; i++) {
                selected[i] = false;
            }
        }
        this.idActive = id;
        selected[id] = !selected[id];
        this.setState({selected: selected});
    };

    buttonIKnow = (that,i1,i2,id) => {
        // setTimeout(function (that,thatThis,i1,i2) {
        //     that.state.enableAutoVoice && that.global.soundSeparator.play();
        //     thatThis.voiceEnable = true;
        //     thatThis.justIKnow(i1, i2);
        // },300,that,this,i1,i2);
        this.checkOut(id); ////
        that.state.enableAutoVoice && !this.state.toggleRepeat && that.global.soundSeparator.play();
        this.voiceEnable = true;
        this.justIKnow(i1, i2);
    };

    buttonCheckOut = (t) => {
        this.voiceEnable = true;
        this.checkOut(t);
    };

    buttonIDontKnow_1 = (that,t) => {
        that.state.enableAutoVoice && !this.state.toggleRepeat && that.global.soundSeparator.play();
        this.voiceEnable = true;
        this.checkOut(t)
    };

    buttonIDontKnow_2 = (that) => {
        that.state.enableAutoVoice && !this.state.toggleRepeat && that.global.soundSeparator.play();
        this.voiceEnable = true;
        this.randomItem();
    };

    componentWillMount = () => {
        this.createArrayRandom();
        this.randomItem();
        console.log('count items: ' + this.lengthItems);
    };

    componentDidMount = () => {
        const { that } = this.props;
        // first category active
        that.global.categoryActive[0] = !this.newArrayId.length?true:false;
    };

    lengthItems = 0;

    // that.state.enableAutoVoice

    render() {
        //const Aux = props => props.children;
        const { that } = this.props;
        //console.log("render");
        //console.log(that.state.enableAutoVoice);

        return (
            !this.newArrayId.length ||
            <div className="category-box">
                <h2 onClick={() => this.showCategory()}  className={'category-tr ' + (this.state.categoryActive?'category-active':'')}> {/* open box: !this.state.categoryActive */}
                    {translate.toRepeat} (<strong>{this.newArrayId.length}</strong>)
                    <span className="icon-down-open"></span>
                </h2>
                <div className="block-to-repeat">
                    <button className="w-100 border-content-bottom" onClick={() => this.toggleRepeat()}>{this.state.toggleRepeat?translate.toggleToRepeatHide:translate.toggleToRepeatShow + ' (' + this.newArrayId.length + ')'}</button>
                    <ul className="main-list-exercise-inset list-to-repeat list-unstyled">
                        {dataJson.map(function (obj1, i1) {
                            return (
                                // eslint-disable-next-line
                                obj1.data.map(function (obj2, i2) {
                                    this.t++;
                                    let t;
                                    // console.log(obj1.youDontKnowID);
                                    if(typeof obj1.youDontKnowID.includes === 'function') {
                                        if (obj1.youDontKnowID.includes(i2)) {
                                            this.ti++;
                                            t = this.ti
                                            return (
                                                (this.ti === this.state.idRand || this.state.toggleRepeat) && //this.randomItem()
                                                <li className={this.state.selected[t] ? 'li-active' : ''} id={"xc-" + i2} key={i2}>
                                                    {(that.state.enableAutoVoice && this.voiceEnable && !this.state.toggleRepeat)?
                                                        ((that.global.flashCardDirection === 'p->e')?
                                                            that.translateVoice(!this.state.selected[t]?obj2._pl:obj2._en, !this.state.selected[t]?"pl":"en",that.state.online)
                                                            :
                                                            that.translateVoice(!this.state.selected[t]?obj2._en:obj2._pl, !this.state.selected[t]?"en":"pl",that.state.online))
                                                        :''}
                                                    {(this.voiceEnable = false)}
                                                    <h4>{that.state.activePL ? obj1.category._pl : obj1.category._en} / {that.state.activePL ? obj1.name._pl : obj1.name._en}</h4>
                                                    <span className="d-none">{t} / {this.t} / {i1} / {i2} / {obj1.youDontKnowID.length}</span>

                                                    <div className="flip-container vertical">
                                                        <div className="flipper">
                                                            <div
                                                                className="front d-flex align-items-center justify-content-center flex-column">
                                                                    <span onClick={() => that.translateVoice((that.global.flashCardDirection === 'e->p') ? obj2._en : obj2._pl, (that.global.flashCardDirection === 'e->p')?"en":"pl",that.state.online) }>
                                                                        <span className="icon-volume"></span> {(that.global.flashCardDirection === 'e->p') ? obj2._en : obj2._pl}
                                                                    </span>
                                                            </div>
                                                            <div
                                                                className="back d-flex align-items-center justify-content-center flex-column">
                                                                    <span onClick={() => that.translateVoice((that.global.flashCardDirection === 'e->p') ? obj2._en : obj2._pl, (that.global.flashCardDirection === 'e->p')?"en":"pl",that.state.online) }>
                                                                        <span className="icon-volume"></span> {(that.global.flashCardDirection === 'e->p') ? obj2._en : obj2._pl}
                                                                    </span>
                                                                <hr/>
                                                                <span onClick={() => that.translateVoice((that.global.flashCardDirection === 'e->p') ? obj2._pl : obj2._en, (that.global.flashCardDirection === 'e->p')?"pl":"en",that.state.online) }>
                                                                        <span className="icon-volume"></span> <strong>{(that.global.flashCardDirection === 'e->p') ? obj2._pl : obj2._en}</strong>
                                                                    </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="buttons-to-repeat nav-buttons">
                                                        <button className="button-check-out" onClick={() => this.buttonCheckOut(t)}>{translate.buttonCheckOut}</button>
                                                        <button className="button-i-know" onClick={() => this.buttonIKnow(that, i1, i2, t)}><span className="icon-ok"></span></button>
                                                        {this.state.toggleRepeat?
                                                            <button className="button-i-dont-know" onClick={() => this.buttonIDontKnow_1(that,t)}><span className="icon-cancel"></span></button>
                                                            :
                                                            <button className="button-i-dont-know" onClick={() => this.buttonIDontKnow_2(that)}><span className="icon-cancel"></span></button>
                                                        }
                                                    </div>
                                                </li>
                                            )
                                        }
                                    }

                                },this)

                            )
                        },this,this.t = -1,this.ti = -1)}
                    </ul>
                </div>
            </div>
        )
    }
}

export { ToRepeat }