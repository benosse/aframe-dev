import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		name: 'Home',
		component: Home
	},

	{
		path: '/scene-1',
		name: 'Scene1',
		component: () => import('../views/Scene1.vue')
	},

	{
		path: '/scene-2',
		name: 'Scene2',
		component: () => import('../views/Scene2.vue')
	}

]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

export default router
