<script context="module">
	// https://kit.svelte.dev/docs/loading
	export const load = async ({ fetch }) => {
		const response = await fetch('api/ev.json');
		const data = await response.json();
		if (response.ok) {
			return {
				props: {
					data
				}
			};
		}

		return {
			status: response.status
		};
	};
</script>

<script>
	import { onMount } from 'svelte';
	import { bind } from 'svelte/internal';
	export let data;
	export let button;

	let userLocation;

	const getLocation = () => {
		navigator.geolocation.getCurrentPosition((position) => {
			userLocation = { latitude: position.coords.latitude, longitude: position.coords.longitude };
		});
	};

	const sendLocation = async () => {
		console.log(userLocation);
		getLocation();
		const response = await fetch('api/ev.json', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(userLocation)
		});
		data = await response.json();

		if (data) {
			document.querySelector('section').style.display = 'none';
		}
	};

	// https://svelte.dev/tutorial/onmount -> zodat eerst de DOM wordt geladen, anders werkt navigator niet.
	onMount(() => {
		getLocation(userLocation);
		const disableButton = () => {
			button.disabled = false;
			button.style.cursor = 'pointer';
		};
		const timeOut = setTimeout(disableButton, 4000);
	});
</script>

<section>
	<p>Om de laadpalen in de buurt te vinden, hebben we eerst je locatie nodig. Klik hieronder om toegang te geven tot je locatie.</p>
	<button disabled on:click={() => sendLocation()} bind:this={button}>Geef toegang</button>
</section>
<ul>
	{#each data as cs}
		<li>
			<a href={`/charger/${cs.locationUid}`}>
				<span class="material-symbols-outlined"> bolt </span>
				<div>
					<h3>{cs.name}</h3>
					<!-- <a href="/">{[cs.coordinates.latitude, cs.coordinates.longitude]}</a> -->
					<span class={cs.status}>{cs.status}</span>
					<a href={`https://www.google.com/maps/search/?api=1&query=${cs.coordinates.latitude}%2C${cs.coordinates.longitude}`} target="_blank">Routebeschrijving</a>
				</div>
			</a>
		</li>
	{/each}
</ul>

<style>
	section {
		width: 90%;
		margin: 0 auto;
		border: 2px solid #e7e7e7;
		border-radius: 0.5rem;
		padding: 1rem;
		margin-top: 1rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	button {
		background-color: var(--primary-color);
		color: white;
		padding: 1em 4em;
		margin-top: 1rem;
		border-radius: 2em;
		border: none;
		-webkit-box-shadow: 0 5px 20px #4bcb8d66;
		box-shadow: 0 5px 20px #4bcb8d66;
		transition: 0.2s;
	}

	button:hover,
	button:focus {
		opacity: 0.8;
		transition: 0.2s;
	}

	button:disabled {
		background-color: lightgray;
		box-shadow: none;
	}

	ul {
		margin-inline: 1rem;
		margin-top: 1rem;
	}

	ul li {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		border: 2px solid #e7e7e7;
		border-radius: 0.5rem;
		margin-bottom: 1rem;
	}

	ul li > a {
		width: 100%;
		padding: 0.75rem;
	}

	ul li > a > span {
		font-size: 3rem;
	}

	span.Occupied,
	span.Unknown {
		color: #ed4517;
	}

	ul li h3 {
		font-size: 1.5rem;
		font-weight: 700;
		margin-bottom: 0.1rem;
		color: black;
	}
</style>
