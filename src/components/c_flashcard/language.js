export let translate = {};
export const setLanguage = (x) => {
    switch (x) {
        case 'en':
            translate = {
                lang: 'en',
                buttonCloseExercise: 'Your state will be automatically saved',
                infoCongratulation: 'Congratultaion!',
                buttonInfoCongratulation: 'Back to exercises menu',
                buttonInfoCongratulationRestart: 'Start this exercise all over again',
                buttonIKnow: 'I knew',
                buttonIDontKnow: "I don't knew",
                buttonCheckOut: 'Check out',
                textSummary: 'Summary',
                buttonEnableAutoVoice: 'Enable automatically voice',
                buttonDisableRotate: 'Disable rotate',
                buttonRestartProgress: 'Restart progress',
                buttonCloseApplication: 'Close application',
                yourPlatform: 'Your platform',
                polish: 'Polish',
                english: 'English',
                abouts: 'Autor: semDesign<br />Contact: aleksander.nyczyk@gmail.com<br />Version: ',
                gt: 'Google Translate',
                privacy: 'Privacy',
                fullItemsList: 'Full items list',
                flashcards: 'Flashcards',
                lottery: 'Lottery'
            };
            break;
        default: //pl
            translate = {
                lang: 'pl',
                buttonCloseExercise: 'Twój stan zostanie automatycznie zapisany',
                infoCongratulation: 'Gratulacje!',
                buttonInfoCongratulation: 'Wróć do menu ćwiczeń',
                buttonInfoCongratulationRestart: 'Zacznij to ćwiczenie od nowa',
                buttonIKnow: 'Wiedziałem/am',
                buttonIDontKnow: "Nie wiedziałem/am",
                buttonCheckOut: 'Sprawdź',
                textSummary: 'Podsumowanie',
                buttonEnableAutoVoice: 'Włączaj automatycznie głos',
                buttonDisableRotate: 'Wyłącz obracanie',
                buttonRestartProgress: 'Restartuj postęp',
                buttonCloseApplication: 'Zamknij aplikacje',
                yourPlatform: 'Twoja platforma',
                polish: 'Polski',
                english: 'Angielski',
                abouts: 'Autor: semDesign<br />Kontakt: aleksander.nyczyk@gmail.com<br />Wersja: ',
                gt: 'Google Translator',
                privacy: 'Prywatność',
                fullItemsList: 'Pełna lista',
                flashcards: 'Fiszki',
                lottery: 'Losowanie'
            };
    }
};