import React, { Component } from 'react';
import {removeCookies} from "../cookies";
import {translate} from "../language";
import {centerClass, prefixResetProgressCookies} from "../varibles";
import dataJson from '../data_json/data.json';

/**
 * Sub component Congratulation
 */
class Congratulation extends Component {
    render() {
        const {that, ide, idC} = this.props;
        const obj = dataJson[ide];
        obj.youKnowID.length=obj.data.length;
        return (
            <div className={'congratulation-info ' + centerClass}>
                <h2>{translate.infoCongratulation}<span className="icon-award"></span></h2>
                <h3>"{that.state.langNameExercise(obj.name)}"</h3>
                <p className="text-center">{translate.textSummary}:  <span className="icon-up color-5">{obj.youKnowID.length}/{obj.data.length} = {Math.ceil(obj.youKnowID.length*100/obj.data.length)}%</span> - <span className="icon-down color-17">{obj.youDontKnowID.length} ({obj.dontKnowClick})</span></p>
                <button className="border-content-bottom" onClick={() => {
                    that.clearExercise();
                    that.setState({classHideNavButtons: ''})
                }}>{translate.buttonInfoCongratulation}</button>
                <button className="border-content-bottom" onClick={(e) => that.setExercise(e,ide,false,false,idC,false,'show-list')}>{translate.summary}</button>
                <button className="border-content-bottom" onClick={() => {
                    obj.youKnowID=[];
                    obj.youDontKnowID=[];
                    obj.dontKnowClick=0;
                    removeCookies(prefixResetProgressCookies+'obj_exercise_cookie_'+ide);
                    removeCookies(prefixResetProgressCookies+'obj_exercise_cookie_you_dont_know_'+ide);
                    removeCookies(prefixResetProgressCookies+'obj_exercise_cookie_dk_click_'+ide);
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

export { Congratulation }