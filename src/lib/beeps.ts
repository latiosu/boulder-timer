import { base } from '$app/paths';

export function loadBeeps(beepStyle: string) {
    const longBeepIFSCPrague = base + '/beeps/sin_300Hz_-9dBFS_1s.wav';
    const longBeepIFSCInnsbruck = base + '/beeps/sin_500Hz_-9dBFS_1s.wav';
    const shortBeepIFSCPrague = base + '/beeps/sin_990Hz_-9dBFS_0.3s.wav';
    const shortBeepIFSCInnsbruck = base + '/beeps/sin_1200Hz_-9dBFS_0.3s.wav';
    const startBeepJMSCA = base + '/beeps/sqr_523.25Hz_-14LUFS_0.6s.wav';
    const oneMinBeepJMSCA = base + '/beeps/sqr_1760Hz_-9dBFS_0.4s.wav';
    const countdownBeepJMSCA = base + '/beeps/sqr_440Hz_-9dBFS_0.1s.wav';
    const endBeepJMSCA = base + '/beeps/sqr_880Hz_-14LUFS_1s.wav';

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