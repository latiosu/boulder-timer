<script lang="ts">
	import posthog from 'posthog-js';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { loadBeeps } from '$lib/beeps';
	import Timer from '$lib/Timer.svelte';

	let countdownColourVisible = $state(false);
	onMount(() => {
		if (browser) {
			countdownColourVisible = posthog.getFeatureFlag('countdown-colour') == 'option';
		}
	});

	let timerStyle = $state('noTransition');
	let beepStyle = $state('JMSCA');
	let durationMinutes = $state('4');
	let durationSeconds = $state('00');
	let parsedMinutes = $derived(parseInt(durationMinutes));
	let parsedSeconds = $derived(parseInt(durationSeconds));
	let transitionSeconds = $state(15);
	let showTimer = $state(false);
	let hasCountdownColour = $state(true);
	let hasTransitionColour = $state(true);

	let startBeep = $state<HTMLAudioElement>();
	let oneMinBeep = $state<HTMLAudioElement>();
	let countdownBeep = $state<HTMLAudioElement>();
	let endBeep = $state<HTMLAudioElement>();

	function playStartBeep() {
		startBeep?.play();
	}

	function playOneMinBeep() {
		oneMinBeep?.play();
	}

	function playCountdownBeep() {
		countdownBeep?.play();
	}

	function playEndBeep() {
		endBeep?.play();
	}

	function startTimer() {
		showTimer = true;
		posthog.capture('timer_start');
	}

	$effect(() => {
		({ startBeep, oneMinBeep, countdownBeep, endBeep } = loadBeeps(beepStyle));
	});
</script>

{#if showTimer}
	<Timer
		duration={(isNaN(parsedMinutes) ? 0 : parsedMinutes) * 60 +
			(isNaN(parsedSeconds) ? 0 : parsedSeconds)}
		transition={timerStyle === 'withTransition' ? transitionSeconds : 0}
		{startBeep}
		{oneMinBeep}
		{countdownBeep}
		{endBeep}
		{hasCountdownColour}
		{hasTransitionColour}
	/>
{:else}
	<main>
		<h1>Boulder Timer</h1>

		<section class="instructions">
			<h2>Instructions</h2>
			<ol>
				<li>
					1. Tap <strong>Spacebar</strong>/<strong>screen</strong> to start and stop timer.
				</li>
				<li>
					2. Hold down <strong>Spacebar</strong>/<strong>screen</strong> to reset timer.
				</li>
				<li>3. <strong>Reload page</strong> to exit timer.</li>
			</ol>
		</section>

		<section class="timer-style">
			<h2>Timer type</h2>
			<div class="options-container">
				<label>
					<input type="radio" bind:group={timerStyle} value="noTransition" />
					Finals (climbing time only; timer stops at 0:00)
				</label>
				<label>
					<!-- Should transition time be renamed to preparation time? -->
					<input type="radio" bind:group={timerStyle} value="withTransition" />
					Qualifiers & Semi-finals (alternates between climbing and transition time; timer does not stop)
				</label>
			</div>
		</section>

		<section class="options">
			<h2>Settings</h2>
			<div class="option-group">
				<span id="climbing-time">Climbing time (min:sec):</span>
				<div>
					<input
						id="climbing-time-min"
						aria-labelledby="climbing-time"
						aria-label="Climbing time minutes"
						type="text"
						inputmode="numeric"
						pattern="\d*"
						minlength="1"
						maxlength="2"
						placeholder="00"
						bind:value={durationMinutes}
					/>
					<span>:</span>
					<input
						id="climbing-time-sec"
						aria-labelledby="climbing-time"
						aria-label="Climbing time seconds"
						type="text"
						inputmode="numeric"
						pattern="\d*"
						minlength="1"
						maxlength="2"
						placeholder="00"
						bind:value={durationSeconds}
					/>
				</div>
			</div>
			{#if timerStyle === 'withTransition'}
				<div class="option-group">
					<label for="transition-time">Transition time (s):</label>
					<input
						id="transition-time"
						type="text"
						inputmode="numeric"
						pattern="\d*"
						bind:value={transitionSeconds}
					/>
				</div>

				<div class="option-group">
					<label>
						<input id="transition-colour" type="checkbox" bind:checked={hasTransitionColour} />
						Use a different colour for the transition time
					</label>
				</div>
			{/if}

			{#if countdownColourVisible}
				<div class="option-group">
					<label>
						<input id="countdown-colour" type="checkbox" bind:checked={hasCountdownColour} />
						Use a different colour during 5s countdown
					</label>
				</div>
			{/if}

			<div class="option-group">
				<label for="beep-style">Beep style:</label>
				<select id="beep-style" bind:value={beepStyle}>
					<option value="JMSCA">Boulder Japan Cup 2025 (recommended)</option>
					<option value="IFSC_INNSBRUCK">IFSC Innsbruck 2025</option>
					<option value="IFSC_PRAGUE">IFSC Prague 2025</option>
				</select>
			</div>
			<div class="option-group">
				{#if beepStyle === 'JMSCA'}
					<button class="example-sound" onclick={playStartBeep}>🔊 Start</button>
					<button class="example-sound" onclick={playOneMinBeep}>🔊 1 min</button>
					<button class="example-sound" onclick={playCountdownBeep}>🔊 Countdown</button>
					<button class="example-sound" onclick={playEndBeep}>🔊 End</button>
				{:else if beepStyle === 'IFSC_PRAGUE' || beepStyle === 'IFSC_INNSBRUCK'}
					<button class="example-sound" onclick={playStartBeep}>🔊 Start/End</button>
					<button class="example-sound" onclick={playOneMinBeep}>🔊 1 min/Countdown</button>
				{/if}
			</div>
		</section>

		<button class="start-button" onclick={startTimer}>Start</button>
	</main>
	<footer>
		<p>
			<a
				href="https://github.com/latiosu/boulder-timer"
				target="_blank"
				rel="noopener noreferrer"
				class="underline">Open-source</a
			>
			and made with love by
			<a
				href="https://www.instagram.com/eric.c.liu/"
				target="_blank"
				rel="noopener noreferrer"
				class="underline">Eric Liu</a
			> ❤️
		</p>
	</footer>
{/if}

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		padding: 1.5rem;
	}

	h1 {
		font-size: 2.5rem;
		font-weight: bold;
	}

	h2 {
		font-size: 1.5rem;
		font-weight: bold;
		margin-bottom: 0.5rem;
	}

	section {
		width: 100%;
		max-width: 600px;
		padding: 1.5rem;
		border: 1px solid #ccc;
		border-radius: 8px;
	}

	.options-container {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.option-group {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	label {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-right: 0.5rem;
	}

	input[type='text'] {
		width: 3rem;
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		text-align: center;
	}

	select {
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
	}
	@media only screen and (max-width: 600px) {
		select[id='beep-style'] {
			width: 100%;
		}
	}

	option {
		background-color: black;
	}

	button {
		padding: 0.333rem 1.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		cursor: pointer;
		font-size: 1rem;
	}

	.example-sound {
		background-color: #223;
	}

	.start-button {
		background-color: #28a745;
		color: white;
		font-weight: bold;
		font-size: 1.5rem;
		border: none;
		padding: 0.75rem 3rem;
	}

	footer {
		text-align: center;
		color: #999;
		margin-top: 1rem;
		margin-bottom: 1rem;
	}
</style>
