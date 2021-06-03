import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

Vue.config.ignoredElements = [
    'a-scene',
    'a-entity',
    'a-camera',
    'a-box',
    'a-sky',
    'a-sphere',
    'a-cylinder',
    'a-plane',
    'a-gltf-model',
    'a-assets',
    'a-asset-item',
    'a-cone',
];

require('./assets/style.css');

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')