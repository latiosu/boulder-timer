<script lang="ts">
	import { onMount } from 'svelte';
    import { page } from '$app/state';
    import longBeepIFSCPrague from './sin_300Hz_1s.wav';
    import longBeepIFSCInnsbruck from './sin_500Hz_1s.wav';
    import shortBeepIFSCPrague from './sin_990Hz_0.3s.wav';
    import shortBeepIFSCInnsbruck from './sin_1200Hz_0.3s.wav';
    import startBeepJMSCA from './sqr_523.25Hz_0.6s.wav';
    import oneMinBeepJMSCA from './sqr_1760Hz_0.4s.wav';
    import countdownBeepJMSCA from './sqr_440Hz_0.1s.wav';
    import endBeepJMSCA from './sqr_880Hz_1s.wav';

    const { number: propDuration = 60 * 4, number: propTransition = 15, string: propBeepStyle = 'JMSCA' } = $props();
    let duration: number = propDuration, transition: number = propTransition, beepStyle: string = propBeepStyle;
    let isPaused: boolean = $state(true);
    let timer: number = $state(duration);
    let phase: string = $state('climb');
    let startBeep: HTMLAudioElement, oneMinBeep: HTMLAudioElement, countdownBeep: HTMLAudioElement, endBeep: HTMLAudioElement;

    function loadSearchParams() {
        const paramDuration = page.url.searchParams.get('duration');
        const paramTransition = page.url.searchParams.get('transition');
        const paramBeepStyle = page.url.searchParams.get('beepStyle');

        if (paramDuration) {
            duration = parseInt(paramDuration) || propDuration;
        }
        if (paramTransition) {
            transition = parseInt(paramTransition) ?? propTransition;
        }
        if (paramBeepStyle) {
            beepStyle = paramBeepStyle;
        }
    }
    
    function loadBeeps() {
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
    }
    
    function handleKeyDown(event: { key: string; }) {
        switch (event.key) {
            case 'Enter':
            case ' ':
                if (transition == 0 && timer == 0) {
                    timer = duration;
                } else {
                    isPaused = !isPaused;
                }
                break;
            case 'Escape':
                timer = duration;
                phase = 'climb';
                isPaused = true;
                break;
        }
    }

    function timerLogic() {
        timer -= 1;

        // Beep logic, applicable to both phases for countdown
        if (phase === 'climb' && timer === 60) {
            oneMinBeep.play();
        } else if (timer > 0 && timer <= 5) {
            countdownBeep.play();
        } else if (timer === 0) {
            if (phase === 'climb') {
                endBeep.play();
                if (transition > 0) {
                    phase = 'transition';
                    timer = transition;
                } else {
                    isPaused = true;
                }
            } else { // phase === 'transition'
                startBeep.play();
                phase = 'climb';
                timer = duration;
            }
        }
    }

    onMount(() => {
        loadSearchParams();
        loadBeeps();
    });

    $effect(() => {
        if (isPaused) {
            return;
        }

        if (timer === duration) {
            startBeep.play();
        }

        const id = setInterval(timerLogic, 1000);
        return () => clearInterval(id);
    });
</script>

<svelte:window onkeydown={handleKeyDown} />
<div class="w-full h-full flex items-center justify-center">
    <div class="text-[50vh] font-[oswald] select-none flex min-w-[100vh]">
        <span>{String(Math.floor(timer / 60)).padStart(1, '0')}</span>
        <span>:</span>
        <span>{String(timer % 60).padStart(2, '0')}</span>
    </div>
</div>
