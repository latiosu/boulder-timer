export function loadBeeps(beepStyle: string) {
    const longBeepIFSCPrague = '/sin_300Hz_1s.wav';
    const longBeepIFSCInnsbruck = '/sin_500Hz_1s.wav';
    const shortBeepIFSCPrague = '/sin_990Hz_0.3s.wav';
    const shortBeepIFSCInnsbruck = '/sin_1200Hz_0.3s.wav';
    const startBeepJMSCA = '/sqr_523.25Hz_0.6s.wav';
    const oneMinBeepJMSCA = '/sqr_1760Hz_0.4s.wav';
    const countdownBeepJMSCA = '/sqr_440Hz_0.1s.wav';
    const endBeepJMSCA = '/sqr_880Hz_1s.wav';

    let startBeep, oneMinBeep, countdownBeep, endBeep;

    if (beepStyle === 'JMSCA') {
        startBeep = new Audio(startBeepJMSCA);
        oneMinBeep = new Audio(oneMinBeepJMSCA);
        countdownBeep = new Audio(countdownBeepJMSCA);
        endBeep = new Audio(endBeepJMSCA);
    } else if (beepStyle === 'IFSC_PRAGUE') {
        // IFSC Prague style
        startBeep = new Audio(longBeepIFSCPrague);
        oneMinBeep = new Audio(shortBeepIFSCPrague);
        countdownBeep = new Audio(shortBeepIFSCPrague);
        endBeep = new Audio(longBeepIFSCPrague);
    } else {
        // IFSC Innsbruck style
        startBeep = new Audio(longBeepIFSCInnsbruck);
        oneMinBeep = new Audio(shortBeepIFSCInnsbruck);
        countdownBeep = new Audio(shortBeepIFSCInnsbruck);
        endBeep = new Audio(longBeepIFSCInnsbruck);
    }

    return { startBeep, oneMinBeep, countdownBeep, endBeep };
}