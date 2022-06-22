// Dit is de standaardvalue voor als de gebruiker nog geen toegang heeft gegeven
let userLocation = { latitude: 52.835358, longitude: 6.897585 };

const reverseGeocoding = async (data) => {
	const newData = await data.map(async (cs) => {
		const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${cs.coordinates.longitude},${cs.coordinates.latitude}.json?access_token=pk.eyJ1IjoiYnV0dHoxIiwiYSI6ImNsNDVka2UwcTAwMzEzaWxnbDQ2cTZwMmYifQ.0pMJC9U0PPpu8m0krUrkVA`;
		const response = await fetch(url);
		const geocodingData = await response.json();

		cs.name = `${geocodingData.features[0].text} ${geocodingData.features[0].address}`;
		return cs;
	});

	return Promise.all(newData);
};

export const get = async () => {
	const url = `https://ui-map.shellrecharge.com/api/map/v2/markers/${userLocation.longitude - 0.05}/${userLocation.longitude + 0.05}/${userLocation.latitude - 0.05}/${userLocation.latitude + 0.05}/15`;
	const response = await fetch(url);
	let data = await response.json();
	data = await reverseGeocoding(data).then((result) => {
		return result;
	});

	if (response.ok) {
		return {
			status: 200,
			body: data
		};
	}

	return {
		status: response.status
	};
};

// https://www.youtube.com/watch?v=J5sJJr4cNWs
export const post = async ({ request }) => {
	let userLocation = await request.json();

	const url = `https://ui-map.shellrecharge.com/api/map/v2/markers/${userLocation.longitude - 0.01}/${userLocation.longitude + 0.01}/${userLocation.latitude - 0.01}/${userLocation.latitude + 0.01}/20`;
	const response = await fetch(url);
	let data = await response.json();
	let reversedData = await reverseGeocoding(data);
	console.log(reversedData);

	if (response.ok) {
		return {
			status: 200,
			body: reversedData
		};
	}

	return {
		status: response.status
	};
};
