<script context="module">
	export async function load({ fetch, params }) {
		const id = params.id;
		const chargerRes = await fetch(`/chargers/${id}.json`);
		const charger = await chargerRes.json();

		const nearbyChargersRes = await fetch(
			`https://ui-map.shellrecharge.com/api/map/v2/markers/${charger.coordinates.longitude - 0.01}/${charger.coordinates.longitude + 0.01}/${charger.coordinates.latitude - 0.01}/${
				charger.coordinates.latitude + 0.01
			}/15`
		);
		const nearbyChargers = await nearbyChargersRes.json();
		const top5Chargers = nearbyChargers.slice(0, 5);

		const providerRes = await fetch('/api/providers.json');
		const providers = await providerRes.json();

		const co2 = charger.operatorName === 'Vattenfall' ? Math.floor((providers[0][1][0]._value * 50) / 100) / 10 : Math.floor((providers[10][1][0]._value * 50) / 100) / 10;
		const facts = [
			{
				co2g: 5000,
				markup: 'uur douchen'
			},
			{
				co2g: 14,
				markup: 'sigaretten'
			},
			{
				co2g: 23,
				markup: 'theetjes'
			},
			{
				co2g: 250,
				markup: 'km vliegen'
			},
			{
				co2g: 10,
				markup: 'plastic tasjes'
			}
		];
		const randomFact = facts[Math.floor(Math.random() * facts.length)];

		const forecastRes = await fetch('/api/forecast.json');
		const forecast = await forecastRes.json();

		let totalEnergy = 0;
		forecast.forEach((energy) => {
			totalEnergy += energy[1][0]._value;
		});

		const dirtyEnergy = forecast[1][1][0]._value + forecast[2][1][0]._value + forecast[5][1][0]._value;
		const sustainableEnergy = Math.floor((dirtyEnergy / totalEnergy) * 100);

		if (chargerRes.ok && nearbyChargersRes.ok && providerRes.ok) {
			return {
				props: {
					charger,
					top5Chargers,
					co2,
					randomFact,
					sustainableEnergy
				}
			};
		}

		return {
			status: res.status,
			error: new Error('Failed to fetch')
		};
	}
</script>

<script>
	export let charger;
	export let top5Chargers;
	export let co2;
	export let randomFact;
	export let sustainableEnergy;
</script>

<div class="bubble">
	<p>{charger.operatorName} Laadpaal</p>
	<h1>{charger.address.streetAndNumber}</h1>
	<ul>
		<li>
			<span class="material-symbols-outlined"> bolt </span>
			Max. {charger.evses[0].connectors[0].electricalProperties.maxElectricPower} kW
		</li>
		<li>
			<span class="material-symbols-outlined"> euro_symbol </span>
			{charger.evses[0].connectors[0].tariff.perKWh} per kW
		</li>
	</ul>
</div>
<section class="facts">
	<a href="https://app.electricitymap.org/zone/NL" target="_blank">
		<svg xmlns="http://www.w3.org/2000/svg" width="77" height="116" viewBox="0 0 77 116" fill="none">
			<path
				d="M48.125 113.414C48.1731 114.091 47.9325 114.743 47.4753 115.227C47.0181 115.71 46.3925 116 45.7188 116H31.2813C30.6075 116 29.9819 115.71 29.5247 115.227C29.0675 114.743 28.8269 114.091 28.875 113.414L32.725 59.2083C34.4816 59.9816 36.4547 60.4166 38.5 60.4166C40.5453 60.4166 42.5185 59.9816 44.275 59.2083L48.125 113.414Z"
				fill="#2C2C2C"
			/>
			<g class="windmill" clip-path="url(#clip0_83_274)">
				<path
					d="M45.6706 24.1667C45.6706 29.4592 45.2856 34.4617 44.5397 38.425C44.4434 38.9808 44.3231 39.5367 44.2028 40.0442C43.9622 41.1558 42.9756 41.9292 41.8687 41.9292H41.195C40.425 41.3975 39.4865 41.0833 38.5 41.0833C37.5134 41.0833 36.575 41.3975 35.805 41.9292H35.0831C33.9522 41.9292 32.9656 41.1558 32.725 40.0442C32.6047 39.5367 32.5084 39.0292 32.4122 38.4733C31.6422 34.51 31.2331 29.4833 31.2331 24.1667C31.2331 18.4875 31.7625 0 38.4518 0C45.1412 0 45.6706 18.4875 45.6706 24.1667Z"
					fill="white"
				/>
				<path
					d="M35.42 53.1425C34.9869 53.5775 34.5297 54.0367 34.0484 54.4717C33.7115 54.81 33.3506 55.1242 32.9897 55.4625C30.3428 57.8792 27.1425 60.3442 23.7256 62.64C17.349 66.9659 9.31217 71.195 4.49967 71.195C3.94623 71.195 3.41685 71.1467 2.95967 71.0017C1.7806 70.7117 0.890292 69.9867 0.38498 68.9959C-2.6469 62.8817 13.3065 51.7167 16.555 49.5417C21.0787 46.4484 25.6987 43.935 29.5247 42.485C29.6209 42.4367 29.7172 42.3884 29.8134 42.3642C30.9925 41.905 32.34 42.4609 32.8453 43.645L33.7115 45.5784C33.6875 45.675 33.6875 45.7959 33.6875 45.9167C33.6875 47.4634 34.4094 48.8409 35.5403 49.7109L35.7087 50.1217L35.8772 50.4842C36.2862 51.3784 36.0937 52.4417 35.42 53.1425Z"
					fill="white"
				/>
				<path
					d="M76.615 69.02C76.1338 69.9867 75.2434 70.7117 74.0644 71.0017C73.6072 71.1225 73.0778 71.195 72.5244 71.195C67.7119 71.195 59.669 66.9659 53.2623 62.64C49.3642 60.03 45.7729 57.1784 42.9576 54.4717C42.4763 54.0367 42.0191 53.5775 41.586 53.1425C40.9123 52.4417 40.7198 51.3784 41.1288 50.4842L41.4657 49.7109C42.5966 48.8409 43.3185 47.4634 43.3185 45.9167C43.3185 45.7959 43.3185 45.675 43.2945 45.5784L44.1607 43.645C44.666 42.4609 46.0135 41.905 47.1926 42.3642C47.2888 42.3884 47.3851 42.4367 47.4813 42.485C51.3073 43.935 55.9333 46.4484 60.4811 49.5417C63.7055 51.7167 79.6709 62.8817 76.615 69.02Z"
					fill="white"
				/>
				<path
					d="M38.5 55.5833C33.1942 55.5833 28.875 51.2454 28.875 45.9167C28.875 40.5879 33.1942 36.25 38.5 36.25C43.8058 36.25 48.125 40.5879 48.125 45.9167C48.125 51.2454 43.8058 55.5833 38.5 55.5833ZM38.5 41.0833C35.8471 41.0833 33.6875 43.2523 33.6875 45.9167C33.6875 48.581 35.8471 50.75 38.5 50.75C41.1529 50.75 43.3125 48.581 43.3125 45.9167C43.3125 43.2523 41.1529 41.0833 38.5 41.0833Z"
					fill="#2C2C2C"
				/>
			</g>
			<defs>
				<clipPath id="clip0_83_274">
					<rect width="77" height="116" fill="white" />
				</clipPath>
			</defs>
		</svg>
		<h3>{sustainableEnergy}%</h3>
		<p>Is momenteel duurzame energie</p>
	</a>
	<a href="/comparable" rel="external">
		<h3>{co2}KG CO<sub>2</sub></h3>
		<p>Per gemiddelde laadsessie (50kWh)</p>
	</a>
	<a href="/comparable" rel="external">
		<p>Dat is gelijk aan</p>
		<h3>{Math.floor((co2 * 10000) / randomFact.co2g) / 10} {randomFact.markup}</h3>
	</a>
	<a href="https://www.greencrvn.com/forecast/" target="_blank">
		<h3>49%</h3>
		<p>CO2 bespaar je vandaag door te laden tussen 11:00 en 14:00</p>
	</a>
</section>
<h2>Top 5 alternatieven de buurt</h2>
<p>Vergelijk de CO<sub>2</sub> waardes en navigeer naar schonere laadpalen</p>
<ul class="alternatives">
	{#each top5Chargers as nearbyCharger, i}
		<li>
			<a href={`http://www.google.com/maps/place/${nearbyCharger.coordinates.latitude},${nearbyCharger.coordinates.longitude}`}>
			{#if i < 2}
				<div class="percentage">
					<p class="percentage-text">11%</p>
					<p class="percentage-desc">&#60; CO<sub>2</sub></p>
				</div>
			{:else if i < 3}
			<div class="percentage">
				<p class="percentage-text">9%</p>
				<p class="percentage-desc">&#60; CO<sub>2</sub></p>
			</div>
				<!-- <span class="material-symbols-outlined bolt-2"> bolt </span> -->
			{:else}
			<div class="percentage">
				<p class="percentage-text">7%</p>
				<p class="percentage-desc">&#60; CO<sub>2</sub></p>
			</div>
				<!-- <span class="material-symbols-outlined bolt-3"> bolt </span> -->
			{/if}
			<div class="info">
				<h3>{nearbyCharger.operatorName}</h3>
				{#if i < 1}
					<p>84m verwijderd</p>
				{:else if i < 2}
					<p>196m verwijderd</p>
				{:else if i < 3}
					<p>120m verwijderd</p>
				{:else}
					<p>240m verwijderd</p>
				{/if}
				<span class={nearbyCharger.status}>{nearbyCharger.status}</span>
			</div>
		</a>
		</li>
	{/each}
</ul>

<style>
	.bubble {
		text-align: center;
		padding: 2rem 0;
		position: relative;
		overflow: hidden;
		margin-bottom: 1.5rem;
		border-radius: 0.5rem;
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

	.bubble li {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.bubble span {
		text-align: right;
		font-size: 1.75rem;
	}

	h1 {
		margin: 0 1rem 1rem;
	}

	h2 {
		margin: 2rem 1rem 1rem;
	}

	h3 {
		font-size: 1.625rem;
		font-weight: 800;
	}

	.facts {
		margin: 0 1rem;
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr 1fr 0.8fr;
		gap: 0.75rem;
	}

	.facts h3 {
		font-size: 1.5rem;
	}

	.facts a {
		all: unset;
		cursor: pointer;
		padding: 0.75rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		border-radius: 0.5rem;
		transition: transform .3s;
	}

	.facts a:hover {
		transform: scale(1.02);
	}

	.facts a p {
		font-size: 1rem;
	}

	.facts > a:nth-of-type(1) {
		background-color: var(--primary-color);
		color: #fff;
		grid-row-end: span 2;
	}

	.facts > a:nth-of-type(1) svg {
		width: 4rem;
		margin-bottom: 1rem;
		overflow: visible;
	}

	.facts > a:nth-of-type(1) p {
		color: #fff;
	}

	.facts > a:not(:first-of-type) {
		border: 2px solid #e7e7e7;
	}

	.facts > a:nth-of-type(4) {
		grid-column-end: span 2;
		flex-direction: row;
		gap: 1rem;
		text-align: left;
	}

	.facts > a:nth-of-type(4) h3 {
		color: var(--primary-color);
	}

	.alternatives {
		margin-inline: 1rem;
	}

	.alternatives li a {
		all: unset;
		cursor: pointer;
		display: flex;
		align-items: center;
		border: 2px solid #e7e7e7;
		border-radius: 0.5rem;
		margin-bottom: 1rem;
		padding: 0.75rem;
		gap: 1rem;
		transition: transform .3s;
	}

	.alternatives li a:hover {
		transform: scale(1.02);
	}

	.alternatives h3 {
		font-size: 1.14rem;
		font-weight: 700;
		margin-bottom: 0.1rem;
	}

	.alternatives p {
		font-size: 0.9rem;
		margin-block: 0.2rem;
	}

	.alternatives span {
		font-weight: 800;
		color: var(--primary-color);
	}

	.alternatives span.Occupied {
		color: #ed4517;
	}

	.windmill {
		animation: rotate 8s ease infinite;
		animation-delay: 2s;
		transform-origin: 50% 39%;
	}

	h2 + p {
		margin: -0.5rem 1rem 1rem;
		font-size: 1.075rem;
	}

	.percentage {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
		/* width: 6rem; */
		flex-basis: 3rem;
	}
	.percentage .percentage-text {
		font-size: 1.5rem;
		color: var(--primary-color);
		font-weight: 800;
		margin-bottom: -.25rem;
	}

	.percentage .percentage-desc {
		line-height: 1rem;
		font-size: .8rem;
		width: 3rem;
		margin-bottom: 0;
	}

	@keyframes rotate {
		20%,
		100% {
			transform: rotate(360deg);
		}
	}
</style>
