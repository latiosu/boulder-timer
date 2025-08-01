<script lang="ts">
	import posthog from 'posthog-js';
	import { tap, press } from 'svelte-gestures';

	const HOLD_THRESHOLD = 2000;

	let {
		duration = 60 * 4,
		transition = 15,
		startBeep,
		oneMinBeep,
		countdownBeep,
		endBeep,
		hasCountdownColour,
		hasTransitionColour
	} = $props();
	let isPaused: boolean = $state(true);
	let timer: number = $state(duration);
	let phase: string = $state('climb');
	let timeString: string = $derived(
		String(Math.floor(timer / 60)).padStart(1, '0') + ':' + String(timer % 60).padStart(2, '0')
	);

	let wakeLock: WakeLockSentinel | null = null;

	let isPressing: boolean = $state(false);
	let pressStartTime: number = $state(0);
	let pressDuration: number = $state(0);

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
				if (!isPressing) {
					pressStartTime = Date.now();
					isPressing = true;
				} else if (pressDuration >= HOLD_THRESHOLD) {
					resetTimer();
					posthog.capture('timer_reset', { input: event.key });
				}
				break;
		}
	}

	function onkeyup(event: { key: string }) {
		switch (event.key) {
			case 'Enter':
			case ' ':
				if (isPressing && pressDuration < HOLD_THRESHOLD) {
					toggleTimer();
				}
				isPressing = false;
				break;
		}
	}

	function ontap() {
		toggleTimer();
	}

	function onpress() {
		resetTimer();
		posthog.capture('timer_reset', { input: 'press' });
	}

	function onpressdown() {
		isPressing = true;
		pressStartTime = Date.now();
	}

	function onpressup() {
		isPressing = false;
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

		if (phase === 'climb' && timer === duration) {
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

	$effect(() => {
		if (!isPressing) {
			pressDuration = 0;
			return;
		}

		let frameId: number;
		const update = () => {
			pressDuration = Date.now() - pressStartTime;
			frameId = requestAnimationFrame(update);
		};
		frameId = requestAnimationFrame(update);

		return () => {
			cancelAnimationFrame(frameId);
		};
	});
</script>

<svelte:window {onkeydown} {onkeyup} />
<div
	class="timer-container"
	use:tap={() => ({ timeframe: HOLD_THRESHOLD })}
	use:press={() => ({ timeframe: HOLD_THRESHOLD, triggerBeforeFinished: true })}
	{ontap}
	{onpress}
	{onpressdown}
	{onpressup}
>
	<div
		class="timer-text font-[oswald] select-none {hasCountdownColour &&
		phase === 'climb' &&
		timer <= 5
			? 'countdown-colour'
			: ''} {hasTransitionColour && phase === 'transition' ? 'transition-colour' : ''}"
	>
		{#each timeString as token, i (i)}
			<span class={token === ':' ? '' : 'digit'}>{token}</span>
		{/each}
	</div>
</div>

{#if isPressing}
	<div class="press-indicator-bar" style="width: {Math.min(pressDuration / 20, 100)}vw;"></div>
{/if}

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

	.transition-colour {
		color: green;
	}

	.countdown-colour {
		color: red;
	}

	.press-indicator-bar {
		position: fixed;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		height: 1vh;
		background-color: white;
		will-change: width;
	}
</style>
