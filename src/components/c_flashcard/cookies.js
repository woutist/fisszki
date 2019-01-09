import Cookies from 'universal-cookie';
import { detectionDevice } from './varibles';

const cookies = new Cookies(),
    cookiesMaxAge = 60*60*24*7*4*12;

export const setCookies = (name, value) => {
    if(detectionDevice){
        localStorage.setItem(name, value);
    } else {
        cookies.set(name, value, { path: '/', maxAge: cookiesMaxAge });
    }
};
export const removeCookies = (name) => {
    if(detectionDevice){
        localStorage.removeItem(name);
    } else {
        cookies.remove(name, { path: '/', maxAge: cookiesMaxAge });
    }
};
export const getCookies = (name,array) => {
    if(detectionDevice) {
        if(array) {
            return JSON.parse(localStorage.getItem(name));
        } else {
            return localStorage.getItem(name);
        }
    } else {
        if(typeof cookies.get(name) === "undefined") {
            return null;
        } else {
            return cookies.get(name);
        }
    }
};