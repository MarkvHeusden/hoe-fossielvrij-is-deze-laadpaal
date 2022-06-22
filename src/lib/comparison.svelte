<script>
	import { onMount } from 'svelte';

	export let letItRain;
	export let itemName;
	export let itemAmount;
	export let itemEmoji;
	export let nextPage;
	export let button

	let item;

	const createItem = () => {
		const element = document.createElement('span');
		let itemContent = document.createTextNode(`${itemEmoji}`);
		addClassProperties(element);
		element.appendChild(itemContent);
		item.appendChild(element);
	};

	const addClassProperties = (element) => {
		let animationDelay = Math.random() * 14;
		element.style.setProperty('--animation-delay', `${animationDelay}s`);

		let startPositie = Math.floor(Math.random() * 95);
		element.style.setProperty('--startpositie', `${startPositie}%`);

		let fontSize = Math.floor(Math.random() * 200);
		element.style.fontSize = `${fontSize}%`;

		element.classList.add('vallende');
		item.classList.add('vergelijking-tonen');
	};

	const disableButton = () => {
		button.style.opacity = 0
		button.style.visibility = 'hidden'

		setTimeout(enableButton, 25000)
	}

	const enableButton = () => {
		button.style.opacity = 1
		button.style.visibility = 'visible'
	}

	 letItRain = () => {
		disableButton()
		for (let index = 0; index < itemAmount; index++) {
			createItem();
		}
	};
</script>

<div id="{itemEmoji}" class="vergelijking" bind:this={item}>
	<h2><span>{itemAmount}</span> {itemName}</h2>
	<p>15kg CO2</p>
	<button bind:this={button} on:click|preventDefault={letItRain}>Visualiseer</button>
	<a class="material-symbols-outlined right" href='#{nextPage}'>arrow_right_alt</a>
</div>

<style>
	.vergelijking {
		flex: 0 0 auto;
		width: 100%;
		scroll-snap-align: center;
		text-align: center;
		position: relative;
	}

	.vergelijking p {
		color: var(--text-color);
		position: relative;
		z-index: 100;
		text-shadow: 0 0 5px #fff;
	}

	.vergelijking h2 {
		margin-top: 10rem;
		position: relative;
		z-index: 100;
		text-shadow: 0 0 4px #fff;
	}

	button {
		all: unset;
		display: inline-block;
		margin-top: 2rem;
		cursor: pointer;
		background-color:  var(--primary-color);
		font-size: 1.25rem;
		font-weight: 600;
		color: white;
		padding: .75em 1.5em;
		border-radius: 2em;
		box-shadow: 0 5px 20px #4bcb8d66;
		transition: opacity 1s, visibility 1s, transform .3s;
	}

	button:hover {
		transform: scale(1.02);
	}

	.vergelijking .right {
		content: '';
		font-size: 2.5rem;
		width: 2.5rem;
		height: 2.5rem;
		position: absolute;
		bottom: 1.5rem;
		right: 1.5rem;
		z-index: 1000;
	}
</style>
