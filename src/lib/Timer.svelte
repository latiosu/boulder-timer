<script lang="ts">
    let { duration = 60 * 4, transition = 15, beepStyle = 'JMSCA', startBeep, oneMinBeep, countdownBeep, endBeep } = $props();
    let isPaused: boolean = $state(true);
    let timer: number = $state(duration);
    let phase: string = $state('climb');
    
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