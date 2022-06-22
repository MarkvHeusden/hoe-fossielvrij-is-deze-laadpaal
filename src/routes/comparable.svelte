<script>
	import { onMount } from 'svelte';
	import Comparison from '../lib/comparison.svelte';
</script>

<div class="main">
	<div class="bubble">
		<h1>Hoeveel CO2 komt er vrij?</h1>
		<p>Zelfs bij het opladen van je elektrische auto komt er CO<sub>2</sub> vrij. Swipe om vergelijkingen te zien.</p>
	</div>
	<section class="rain">
		<Comparison itemAmount={1072} itemName={'sigaretten'} itemEmoji={'🚬'} nextPage={'🫖'}/>
		<Comparison itemAmount={653} itemName={'theetjes'} itemEmoji={'🫖'} nextPage={'🚿'}/>
		<Comparison itemAmount={180} itemName={'minuten douchen'} itemEmoji={'🚿'} nextPage={'✈️'}/>
		<Comparison itemAmount={60} itemName={'km vliegen'} itemEmoji={'✈️'} nextPage={'🛍'}/>
		<Comparison itemAmount={1500} itemName={'plastic tasjes'} itemEmoji={'🛍'} nextPage={'🚬'}/>
	</section>
</div>

<style>

	.bubble {
		text-align: center;
		padding: 2rem 0;
		position: relative;
		overflow: hidden;
		/* margin-bottom: 1.5rem; */
		border-radius: 0.5rem;
		padding-bottom: 3rem;
		z-index: 1000;
	}

	.bubble::before {
		position: absolute;
		content: '';
		width: 120%;
		height: 100%;
		inset: 0 0 0 -10%;
		background-color: var(--primary-color);
		border-radius: 0 0 80% 80%;
		z-index: -1;
	}

	.bubble * {
		color: #fff;
	}
	.main {
		/* background-color: var(--primary-color); */
		height: 100%;
		/* padding-top: 3rem; */
		overflow-y: hidden;
	}

	.rain {
		height: 37.7rem;
		display: flex;
		overflow-x: scroll;
		scroll-snap-type: x mandatory;
		scroll-behavior: smooth;
		margin-top: -3rem;
	}

	.rain::-webkit-scrollbar {
  display: none;
}

	h1,
	p {
		color: white;
		text-align: center;
		width: 90%;
		margin: 0 auto;
	}

	h1 {
		margin: 0.5rem auto 0.75rem auto;
		font-size: 1.5rem;
	}

	/* p:first-of-type {
		opacity: 0.6;
		font-size: 18px;
	} */
</style>
