# Hoe fossielvrij is deze laadpaal?

## Inhoudsopgave

- [Design challenge](#design-challenge)
- [User story](#user-story)
- [Beschrijving](#beschrijving)
- [Gebruikte API's](#gebruikte-API's)
- [Opdrachtgever](#opdrachtgever)
- [Contactpersonen](#contactpersonen)
- [Wishlist](#wishlist)
- [Licentie](#licentie)

## Design challenge

Ontwerp en ontwikkel een web applicatie die inzicht geeft in het gebruik van fossiele brandstoffen voor laadsessies van elektrische auto's.

## User story

Als elektrisch rijder, wil ik weten hoeveel fossiele elektriciteit er uit de laadpaal komt waar ik naast sta, zodat ik weet hoe (on)duurzaam dat is.

## Beschrijving

Nederland gaat in hoog tempo over op elektrisch rijden. Maar elektriciteit is nog niet fossielvrij. En met het laden van je elektrische auto stoot je dus CO2 uit. Hoeveel CO2 er vrijkomt hangt af
van waar, wanneer en natuurlijk hoeveel energie (kWh) je laadt. Dus hoe weet je hoeveel CO2 er vrijkomt als je je elektrische auto in een specifieke laadpaal plugt?

De oplossing hiervoor is als volgt, in een mogelijke toekomst zijn de meest laadpalen voorzien van een QR code, deze kan je scannen met onze applicatie om zo informatie te krijgen van de laadpaal. Deze informatie bestaat uit:

- De prijs per kWh
- Maximale vermogen
- Hoe duurzaam de energie is op dat moment, dit wordt berekend met de energiebronnen - gas en kolen en dat vervolgens delen door het totaal aantal energie wat er momenteel wordt gebruikt en dan keer honderd om een percentage te tonen.
- Hoeveel CO2 deze laadpaal uitstoot, dit getal zegt de gebruiker niks en daarom vergelijken we het met iets wat de gebruiker wel kent, zoals de uitstoot van sigaretten, plastic tasjes en minuten douchen.
- De beste tijd om op te laden, dus wanneer er zo min mogelijke fossiele brandstof wordt uitgestoten, dus als de gebruiker de tijd heeft nog even kan wachten.
- Alternatieve laadpalen in de buurt, als het laadpaal is die de gebruiker vaak gebruikt, kan hij mogelijk overwegen om een stukje om te rijden voor een schonere oplaadbeurt.

Het kan natuurlijk zo zijn dat er geen QR code beschikbaar is, dan kan je ook aan de hand van de huidige locatie van de gebruiker de laadpalen in de buurt ophalen.

De applicatie is gebouwd met [Sveltekit](https://kit.svelte.dev/), waar we voor het eerst mee hebben geëxperimenteerd.

## Gebruikte API's

- Om de QR codes te scannen is er gebruik gemaakt van de native [Barcode Detection API](https://developer.mozilla.org/en-US/docs/Web/API/Barcode_Detection_API). Helaas werkt deze API niet op Safari (en dus ook niet op IOS).

- Om de locatie van de gebruiker op te halen hebben we de native [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API) gebruikt. Met `Geolocation.getCurrentPosition()` krijg je de de latitude en longitude terug (de breedte- en lengtegraad).

- Die coördinaten kunnen we vervolgens weer gebruiken in de Shell [B2B EV Locations API](https://developer.shell.com/api-catalog/v1.0.1/b2b-ev-locations), door de coördinaten in te vullen in de fetch krijg je een lijst met markers terug. De `15` op het eind staat voor het zoom level (1: World, 5: Landmass/continent, 10: City, 15: Streets, 20: Buildings).

- ```js
  `https://ui-map.shellrecharge.com/api/map/v2/markers/${
    userLocation.longitude - 0.05
  }/${userLocation.longitude + 0.05}/${userLocation.latitude - 0.05}/${
    userLocation.latitude + 0.05
  }/15`;
  ```

- Het was alleen niet mogelijk om informatie per laadpaal op te halen aan de hand van een uuid, hiervoor is een API key nodig. Wel kan je aan de hand van [Reverse Geocoding](https://docs.mapbox.com/api/search/geocoding/) van Mapbox een coordinaten omzetten in een adres, dit hebben we gebruikt voor de laadpalen in de buurt.

- ```js
  const reverseGeocoding = async (data) => {
    const newData = await data.map(async (cs) => {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${cs.coordinates.longitude},${cs.coordinates.latitude}.json?access_token=${process.env.VITE_NAME}`;
      const response = await fetch(url);
      const geocodingData = await response.json();

      cs.name = `${geocodingData.features[0].text} ${geocodingData.features[0].address}`;
      return cs;
    });

    return Promise.all(newData);
  };
  ```

- Om aan te tonen hoe duurzaam de energie momenteel is in Nederland hebben we de [ElectricityMap API](https://app.electricitymap.org/zone/NL) gebruikt, je kan een range instellen met hoe ver je in de toekomst wil kijken.

- Met de [Energy Providers API](https://codesandbox.io/s/gc-providers-65hd8r) kunnen we kijken hoe schoon een leverancier is, dit kunnen we koppelen aan de ElectricityMap API om aan te tonen hoe duurzaam een specifieke paal is.

## Opdrachtgever

De opdrachtgever is de Green Caravan en hun missie is: 'U de keuze bieden voor fossielvrij EV-laden. Nu. Niet in 2050.'
Want het elektriciteitssysteem in de meeste landen is een mix van fossielvrije (zon, wind, waterkracht, nucleair, geothermie, biomassa) en fossiele (kolen, olie, aardgas) elektriciteitsbronnen. Het doel van de energietransitie is om in 2050 een fossielvrij elektriciteitsnet te realiseren. Tot die tijd, wanneer je je EV oplaadt, is het fossielvrije aandeel van de elektriciteit die je verbruikt vooral afhankelijk van het weer!

### Contactpersonen

- [Victor Zumpolle](https://www.linkedin.com/in/victor-zumpolle-52260b113) van de Voorhoede, voor technische vragen.
- [Tom Visser](tom.visser@gcrvn.com), van de Green Caravan, is product owner voor de software producten van Green Caravan. Hij stuurt nu het team aan dat de websites (greencrvn.com, www.co2smartcharging.com en
  app.co2smartcharging.com) en de native apps (for Android en ioS) ontwikkelt.

## Wishlist

Dingen waar we (nog) niet aan toegekomen zijn op basis van MoScoW.

- [ ] Push notificaties met een Service Worker om de gebruiker een bericht te sturen met wat de beste tijd is om te laden, voor een prototype is dit alleen niet helemaal interessant en werkt ook alles behalve fijn om mee te testen.
- [ ] Elementen in components zetten, we kregen dit niet helemaal aan de praat met het fetchen, maar zo kan de data ook meegenomen worden naar het vergelijkscherm om dat actueel te maken.
- [ ] Optie om locaties te bookmarken, om locaties die je vaak bezoekt makkelijk terug te vinden of een locatie die je binnenkort wil bezoeken.

## Licentie

![GNU GPL V3](https://www.gnu.org/graphics/gplv3-127x51.png)

This work is licensed under [GNU GPLv3](./LICENSE).
