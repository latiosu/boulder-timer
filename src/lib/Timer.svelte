<script lang="ts">
	import { tap, type TapCustomEvent, press, type PressCustomEvent } from 'svelte-gestures';

	let {
		duration = 60 * 4,
		transition = 15,
		startBeep,
		oneMinBeep,
		countdownBeep,
		endBeep
	} = $props();
	let isPaused: boolean = $state(true);
	let timer: number = $state(duration);
	let phase: string = $state('climb');
	let timeString: string = $derived(
		String(Math.floor(timer / 60)).padStart(1, '0') + ':' + String(timer % 60).padStart(2, '0')
	);

	let wakeLock: WakeLockSentinel | null = null;

	function toggleTimer() {
		if (transition == 0 && timer == 0) {
			timer = duration;
		} else {
			isPaused = !isPaused;
		}
	}

	function resetTimer() {
		timer = duration;
		phase = 'climb';
		isPaused = true;
	}

	function onkeydown(event: { key: string }) {
		switch (event.key) {
			case 'Enter':
			case ' ':
				toggleTimer();
				break;
			case 'Escape':
				resetTimer();
				break;
		}
	}

	function ontap(event: TapCustomEvent) {
		toggleTimer();
	}

	function onpress(event: PressCustomEvent) {
		resetTimer();
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
			} else {
				// phase === 'transition'
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

	$effect(() => {
		const requestWakeLock = async () => {
			if ('wakeLock' in navigator) {
				try {
					wakeLock = await navigator.wakeLock.request('screen');
				} catch (err) {
					// The wake lock request can fail if the document is not visible,
					// or for other reasons.
					// eslint-disable-next-line no-console
					console.error('Screen Wake Lock request failed:', err);
				}
			}
		};

		requestWakeLock();

		return () => {
			if (wakeLock) {
				wakeLock.release();
				wakeLock = null;
			}
		};
	});
</script>

<svelte:window {onkeydown} />
<div
	class="timer-container"
	use:tap={() => ({ timeframe: 300 })}
	{ontap}
	use:press={() => ({ timeframe: 2000, triggerBeforeFinished: true })}
	{onpress}
>
	<div class="timer-text font-[oswald] select-none">
		{#each timeString as token}
			<span class={token === ':' ? '' : 'digit'}>{token}</span>
		{/each}
	</div>
</div>

<style>
	.timer-container {
		display: flex;
		width: 100vw;
		height: 100vh;
		align-items: center;
		justify-content: center;
	}

	.timer-text {
		display: flex;
		font-size: 50vmin;
	}

	.digit {
		width: 26vmin;
		text-align: center;
	}
</style>
