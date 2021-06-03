<template>
	<div>
		<h1>scene 1</h1>

		<a-scene id="a-scene" embedded cursor="rayOrigin: mouse" >
			<a-entity camera look-controls wasd-controls>
			</a-entity>

			<a-box
				position="1 0.5 -3"
				color="#FF0000"				
				sound-control="src:/sounds/tri.mp3"
			></a-box>

			<a-sphere position ="0 2 0" sound-control-pool>
				<a-box position="10 0 1" color="#FF0000" sound-control="src:/sounds/tri.mp3;"></a-box>
				<a-box position="1 0 -10" color="#FF0000" sound-control="src:/sounds/testEau.mp3"></a-box>
			</a-sphere>


			<a-sphere position ="100 2 0" sound-control-pool>
				<a-box position="10 0 1" color="#FF0000" sound-control="src:/sounds/tri.mp3"></a-box>
				<a-box position="1 0 -10" color="#FF0000" sound-control="src:/sounds/testEau.mp3"></a-box>
			</a-sphere>

			<a-plane
				position="0 0 -4"
				rotation="-90 0 0"
				width="4"
				height="4"
				color="#7BC8A4"
			></a-plane>

			<a-sky color="#ECECEC"></a-sky>
		</a-scene>
	</div>
</template>

<script>
require("aframe");
import "../aframe_components/audio_components.js";

export default {
	name: "Scene1",
};
</script>



<style scoped>
#a-scene {
	position: relative;
	width: 100%;
	height: 800px;
}
</style>
