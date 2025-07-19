<script lang="ts">
	import { loadBeeps } from '$lib/beeps';
	import Timer from '$lib/Timer.svelte';

	let timerStyle = $state('A');
	let beepStyle = $state('JMSCA');
	let durationMinutes = $state(4);
	let transitionPeriod = $state(15);
	let showTimer = $state(false);

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
	}

	$effect(() => {
		({ startBeep, oneMinBeep, countdownBeep, endBeep } = loadBeeps(beepStyle));
	});
</script>

{#if showTimer}
	<Timer
		duration={durationMinutes * 60}
		transition={timerStyle === 'A' ? transitionPeriod : 0}
		{beepStyle}
		{startBeep}
		{oneMinBeep}
		{countdownBeep}
		{endBeep}
	/>
{:else}
	<main>
		<h1>Boulder Timer</h1>

		<section class="instructions">
			<h2>How to Use the Timer</h2>
			<p>
				Select the timer style, set your options, and press "Start" to begin the competition.
			</p>
		</section>

		<section class="timer-style">
			<h2>Select timer style</h2>
			<div class="options-container">
				<label>
					<input type="radio" bind:group={timerStyle} value="A" />
					(A) Qualifications & Semi-finals flow (with transition period)
				</label>
				<label>
					<input type="radio" bind:group={timerStyle} value="B" />
					(B) Finals flow (no transition period, auto-pause on end)
				</label>
			</div>
		</section>

		<section class="options">
			<h2>Options</h2>

			<div class="option-group">
				<label for="time-a">Time (min):</label>
				<input type="number" id="time-a" bind:value={durationMinutes} />
			</div>
			{#if timerStyle === 'A'}
				<div class="option-group">
					<label for="transition">Transition Period (s):</label>
					<input type="number" id="transition" bind:value={transitionPeriod} />
				</div>
			{/if}

			<div class="option-group">
				<label for="beep-style">Beep style:</label>
				<select id="beep-style" bind:value={beepStyle}>
					<option value="JMSCA">JMSCA (recommended)</option>
					<option value="IFSC_INNSBRUCK">IFSC Innsbruck 2025</option>
					<option value="IFSC_PRAGUE">IFSC Prague 2025</option>
				</select>
			</div>
			<div class="option-group">
				{#if beepStyle === 'JMSCA'}
					<button onclick={playStartBeep}>🔊 Start</button>
					<button onclick={playOneMinBeep}>🔊 1 min</button>
					<button onclick={playCountdownBeep}>🔊 Countdown</button>
					<button onclick={playEndBeep}>🔊 End</button>
				{:else if beepStyle === 'IFSC_PRAGUE' || beepStyle === 'IFSC_INNSBRUCK'}
					<button onclick={playStartBeep}>🔊 Start/End</button>
					<button onclick={playOneMinBeep}>🔊 1 min/Countdown</button>
				{/if}

			</div>
		</section>

		<button class="start-button" onclick={startTimer}>Start</button>
	</main>
	<footer>
		<p>
			<a href="https://github.com/latiosu/boulder-timer" target="_blank" rel="noopener noreferrer" class="underline">Open-source</a> and made
			with love by <a href="https://www.instagram.com/eric.c.liu/" target="_blank" rel="noopener noreferrer" class="underline">Eric Liu</a> ❤️
		</p>
	</footer>
{/if}

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
		padding: 2rem;
		font-family: sans-serif;
	}

	h1 {
		font-size: 2.5rem;
		font-weight: bold;
		margin-bottom: 1rem;
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
		gap: 1rem;
		margin-bottom: 1rem;
	}

	label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	input[type='number'] {
		width: 60px;
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
	}

	select {
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
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

	.start-button {
		background-color: #28a745;
		color: white;
		font-weight: bold;
		border: none;
	}

	footer {
		margin-top: 2rem;
		text-align: center;
		color: #666;
	}
</style>
