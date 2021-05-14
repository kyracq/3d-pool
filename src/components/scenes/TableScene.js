import * as Dat from 'dat.gui';
import { Scene3D, Canvas, Cameras, THREE, ExtendedObject3D } from 'enable3d';
import { Table, Ball } from 'objects';
import { BasicLights } from 'lights';

class TableScene extends Scene3D {
    constructor() {
        super('TableScene');
    }

    create() {
        this.warpSpeed();
        const resize = () => {
            const newWidth = window.innerWidth;
            const newHeight = window.innerHeight;

            this.renderer.setSize(newWidth, newHeight);
            this.camera.aspect = newWidth / newHeight;
            this.camera.updateProjectionMatrix();
        };

        window.onresize = resize;
        resize();

        // Initialize state and scene properties
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            updateList: [], // Maintains all meshes to be updated

            // Direction/Power for golf ball
            spacePressed: false,
            power: 10,
            complete: false,
        };

        this.state.gui.add(this.state, 'power', 1, 20).listen();

        // enable physics debug
        // this.physics.debug.enable();

        // position camera
        this.camera.position.set(10, 10, 20);

        // Add meshes to scene
        const table = new Table();
        const lights = new BasicLights();
        this.scene.add(lights);
        this.scene.add(table);
        table.scale.set(5, 5, 5);

        this.physics.add.existing(table, {
            shape: 'box',
            width: 2,
            height: 0.62,
            depth: 1,
        });

        let positions = [
            { x: -3.5, z: 0 },
            { x: -3.5, z: 0.25 },
            { x: -3.5, z: 0.5 },
            { x: -3.5, z: -0.25 },
            { x: -3.5, z: -0.5 },
            { x: -3.25, z: 0.125 },
            { x: -3.25, z: 0.375 },
            { x: -3.25, z: -0.125 },
            { x: -3.25, z: -0.375 },
            { x: -3, z: 0.25 },
            { x: -3, z: 0 },
            { x: -3, z: -0.25 },
            { x: -2.75, z: 0.125 },
            { x: -2.75, z: -0.125 },
            { x: -2.5, z: 0 },
        ];
        this.poolBalls = [];

        for (let i = 0; i < positions.length; i++) {
            // random color
            let color = new THREE.Color(0xffffff);
            color.setHex(Math.random() * 0xffffff);
            let ball = new Ball(color);
            ball.mesh.position.y = 2.4;
            ball.mesh.position.setX(positions[i].x);
            ball.mesh.position.setZ(positions[i].z);
            this.scene.add(ball.mesh);
            // add physics to an existing object
            this.physics.add.existing(ball.mesh);
            this.poolBalls.push(ball.mesh);
            ball.mesh.body.setBounciness(0.8);
        }

        // add physics to an existing object
        let cue = this.physics.add.sphere(
            { radius: 0.1, x: 3, y: 2.4, z: 0 },
            { lambert: { color: 'white' } }
        );
        cue.body.setBounciness(0.8);

        this.cue = cue;

        document.addEventListener('keydown', (event) => {
            if (event.code === 'Space') {
                this.state.spacePressed = true;
            }
        });
        document.addEventListener('keyup', (event) => {
            if (event.code === 'Space') {
                cue.body.applyForce(-this.state.power / 2, 0, 0);
                this.state.spacePressed = false;
            }
        });
    }

    update(time, delta) {
        let cueVel = this.cue.body.velocity;
        if (
            Math.abs(cueVel.x) < 0.05 &&
            Math.abs(cueVel.y) < 0.05 &&
            Math.abs(cueVel.z) < 0.05
        ) {
            this.cue.body.setVelocity(0, 0, 0);
        }
        for (let i = 0; i < this.poolBalls.length; i++) {
            let vel = this.poolBalls[i].body.velocity;
            if (
                Math.abs(vel.x) < 0.05 &&
                Math.abs(vel.y) < 0.05 &&
                Math.abs(vel.z) < 0.05
            ) {
                this.poolBalls[i].body.setVelocity(0, 0, 0);
            }
        }

        if (this.state.spacePressed) {
            this.state.power = Math.ceil(10 * Math.sin(Date.now() / 400) + 10);
        }
    }
}

export default TableScene;
