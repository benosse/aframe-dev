import AFRAME from "aframe";
const THREE = AFRAME.THREE;

class PositionalAudioHelper extends THREE.Line {

    constructor(audio, range = 1, divisionsInnerAngle = 16, divisionsOuterAngle = 2, colorIn = 0x00ff00, colorOut = 0xffff00) {

        const geometry = new THREE.BufferGeometry();
        const divisions = divisionsInnerAngle + divisionsOuterAngle * 2;
        const positions = new Float32Array((divisions * 3 + 3) * 3);
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const materialInnerAngle = new THREE.LineBasicMaterial({ color: colorIn });
        const materialOuterAngle = new THREE.LineBasicMaterial({ color: colorOut });

        super(geometry, [materialOuterAngle, materialInnerAngle]);

        this.audio = audio;
        this.range = range;
        this.divisionsInnerAngle = divisionsInnerAngle;
        this.divisionsOuterAngle = divisionsOuterAngle;
        this.type = 'PositionalAudioHelper';

        this.update();

    }

    update() {

        const audio = this.audio;
        const range = this.range;
        const divisionsInnerAngle = this.divisionsInnerAngle;
        const divisionsOuterAngle = this.divisionsOuterAngle;

        const coneInnerAngle = THREE.MathUtils.degToRad(audio.panner.coneInnerAngle);
        const coneOuterAngle = THREE.MathUtils.degToRad(audio.panner.coneOuterAngle);

        const halfConeInnerAngle = coneInnerAngle / 2;
        const halfConeOuterAngle = coneOuterAngle / 2;

        let start = 0;
        let count = 0;
        let i;
        let stride;

        const geometry = this.geometry;
        const positionAttribute = geometry.attributes.position;

        geometry.clearGroups();

        //

        function generateSegment(from, to, divisions, materialIndex) {

            const step = (to - from) / divisions;

            positionAttribute.setXYZ(start, 0, 0, 0);
            count++;

            for (i = from; i < to; i += step) {

                stride = start + count;

                positionAttribute.setXYZ(stride, Math.sin(i) * range, 0, Math.cos(i) * range);
                positionAttribute.setXYZ(stride + 1, Math.sin(Math.min(i + step, to)) * range, 0, Math.cos(Math.min(i + step, to)) * range);
                positionAttribute.setXYZ(stride + 2, 0, 0, 0);

                count += 3;

            }

            geometry.addGroup(start, count, materialIndex);

            start += count;
            count = 0;

        }

        //

        generateSegment(-halfConeOuterAngle, -halfConeInnerAngle, divisionsOuterAngle, 0);
        generateSegment(-halfConeInnerAngle, halfConeInnerAngle, divisionsInnerAngle, 1);
        generateSegment(halfConeInnerAngle, halfConeOuterAngle, divisionsOuterAngle, 0);

        //

        positionAttribute.needsUpdate = true;

        if (coneInnerAngle === coneOuterAngle) this.material[0].visible = false;

    }

    dispose() {

        this.geometry.dispose();
        this.material[0].dispose();
        this.material[1].dispose();

    }

}


AFRAME.registerComponent('sound-control-pool', {
    init: function() {
        console.log('init audioControl');

        this.getChildren();

        this.el.addEventListener('click', (e) => {
            if (e.target == e.currentTarget)
                this.playChildren()
        });
    },

    getChildren() {
        this.children = [];

        for (const child of this.el.children) {
            const soundControl = child.components['sound-control'];
            if (soundControl)
                this.children.push(soundControl)
        }

        console.log("ch", this.children)
    },

    playChildren: function() {

        for (const child of this.children) {
            child.playSound();
        }
    },

});




AFRAME.registerComponent('sound-control', {

    schema: {

        //aframe sound attributes
        autoplay: { 'type': 'boolean', 'default': false },
        distanceModel: { 'type': 'string', 'default': 'exponential' },
        maxDistance: { 'type': 'number', 'default': 10000 },
        loop: { 'type': 'boolean', 'default': false },
        refDistance: { 'type': 'number', 'default': 40 },
        rolloffFactor: { 'type': 'number', 'default': 8 },
        src: { 'type': 'string', 'default': '' },
        volume: { 'type': 'number', 'default': 1 },

        //positional audio attributes
        cone: { 'type': 'boolean', 'default': false },
        coneInAngle: { 'type': 'number', 'default': 10 },
        coneOutAngle: { 'type': 'number', 'default': 100 },
        coneOutLevel: { 'type': 'number', 'default': 0 },
        posHelper: { 'type': 'boolean', 'default': false },
        posColorIn: { 'type': 'color', 'default': 'red' },
        posColorOut: { 'type': 'color', 'default': 'green' }
    },

    init: function() {
        console.log('init sound-control', this.data.maxDistance);

        //add aframe sound component
        this.el.setAttribute('sound', {

            autoplay: this.data.autoplay,
            distanceModel: this.data.distanceModel,
            loop: this.data.loop,
            maxDistance: this.data.maxDistance,
            refDistance: this.data.refDistance,
            rolloffFactor: this.data.rolloffFactor,
            src: this.data.src,
            volume: this.data.volume,
        });
        this.sound = this.el.components.sound;

        //event listeners
        this.el.addEventListener('click', this.playSound.bind(this));

        //positional helper
        //if (posHelper) {
        //    const helper = new PositionalAudioHelper(sound, (refDistance / rolloff) * 10, 10, 10, posColorIn, posColorOut);
        //    sound.add(helper);
        //}

        console.log("sound:", this.sound.pool.children[0])
        this.positionalAudio = this.sound.pool.children[0];
        this.helper = new PositionalAudioHelper(this.positionalAudio, (this.data.refDistance / this.data.rolloffFactor) * 10, 10, 10, this.data.posColorIn, this.data.posColorOut);

        this.positionalAudio.add(this.helper);
    },

    playSound: function() {
        console.log("click control, ", this.sound)
        if (!this.sound)
            return;

        this.sound.stopSound();
        this.sound.playSound();
    },

    stopSound: function() {
        this.sound.stopSound();
    }
});