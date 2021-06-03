<template>
	<div id="app">
		<div id="nav">
			<router-link to="/">Home</router-link> |
			<router-link to="/scene-1">Scene 1</router-link>
			<router-link to="/scene-2">Scene 2</router-link>
		</div>

		<router-view />
	</div>
</template>

<style scoped>
#app {
	background-color: grey;

	position:fixed;
	top:0;
	bottom:0;
	left:0;
	right:0;

	overflow: scroll;
}
</style>
