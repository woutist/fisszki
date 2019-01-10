export let translate = {};
export const setLanguage = (x) => {
    switch (x) {
        case 'en':
            translate = {
                buttonCloseExercise: 'Your state will be automatically saved',
                infoCongratulation: 'Congratultaion!',
                buttonInfoCongratulation: 'Back to exercises menu',
                buttonInfoCongratulationRestart: 'Start this exercise all over again',
                buttonIKnow: 'I knew',
                buttonIDontKnow: "I don't knew",
                buttonCheckOut: 'Check out',
                textSummary: 'Summary',
                buttonEnableAutoVoice: 'Enable auto-voice',
                buttonDisableRotate: 'Disable rotate',
                buttonRestartProgress: 'Restart progress',
                buttonCloseApplication: 'Close application',
                yourPlatform: 'Your platform',
                polish: 'Polish',
                english: 'English'
            };
            break;
        default: //pl
            translate = {
                buttonCloseExercise: 'Twój stan zostanie automatycznie zapisany',
                infoCongratulation: 'Gratulacje!',
                buttonInfoCongratulation: 'Wróć do menu ćwiczeń',
                buttonInfoCongratulationRestart: 'Zacznij to ćwiczenie od nowa',
                buttonIKnow: 'Wiedziałem/am',
                buttonIDontKnow: "Nie wiedziałem/am",
                buttonCheckOut: 'Sprawdź',
                textSummary: 'Podsumowanie',
                buttonEnableAutoVoice: 'Włącz auto-głos',
                buttonDisableRotate: 'Wyłącz obracanie',
                buttonRestartProgress: 'Restartuj postęp',
                buttonCloseApplication: 'Zamknij aplikacje',
                yourPlatform: 'Twoja platforma',
                polish: 'Polski',
                english: 'Angielski'
            };
    }
};