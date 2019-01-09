export const isIE = false || !!document.documentMode;

export const centerClass = 'd-flex align-items-center justify-content-center flex-column';

const dD = () => {
    if (typeof cordova === "object") {
        return (window.cordova.platformId === "android") ? true : false;
    } else {
        return false;
    }
};
export const detectionDevice = dD();