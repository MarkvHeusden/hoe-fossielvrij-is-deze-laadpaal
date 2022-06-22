<script>
	import { onMount } from 'svelte';

	let videoEl;
	onMount(() => {
		if ('BarcodeDetector' in window) {
			getCamera(videoEl);
		} else {
		}
	});

	async function getCamera(video) {
		const camera = await navigator.mediaDevices.getUserMedia({
			video: {
				facingMode: {
					ideal: 'environment'
				}
			},
			audio: false
		});
		videoEl.srcObject = camera;
		await video.play();

		detectBarcode(video);
	}

	function detectBarcode(video) {
		const barcodeDetector = new BarcodeDetector({ formats: ['qr_code'] });

		window.setInterval(async () => {
			const barcodes = await barcodeDetector.detect(video);
			if (barcodes.length <= 0) {
				return;
			} else {
				window.location.pathname = `/charger/${barcodes[0].rawValue}`;
			}
		}, 1000);
	}
</script>
<div class="camera">
	<video bind:this={videoEl} />
</div>

<style>
.camera::after {
	content: '';
	width: 20rem;
  height: 20rem;
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(var(--primary-color), var(--primary-color)) left top, linear-gradient(var(--primary-color), var(--primary-color)) left top, linear-gradient(var(--primary-color), var(--primary-color)) right top, linear-gradient(var(--primary-color), var(--primary-color)) right top, linear-gradient(var(--primary-color), var(--primary-color)) left bottom, linear-gradient(var(--primary-color), var(--primary-color)) left bottom, linear-gradient(var(--primary-color), var(--primary-color)) right bottom, linear-gradient(var(--primary-color), var(--primary-color)) right bottom;
  background-repeat: no-repeat;
  background-size: .5rem 6rem, 6rem .5rem;
}
</style>
