import { Scene3D, Canvas, Cameras, THREE, ExtendedObject3D } from 'enable3d';
import { Table, Ball } from 'objects';
import { BasicLights } from 'lights';

class TableScene extends Scene3D {
    constructor() {
        super('TableScene');
    }

    init() {
        this.renderer.setPixelRatio(1);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    create() {
        // set up scene (light, ground, grid, sky, orbitControls)
        this.warpSpeed();

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
        // for (let i = 0; i < 3; i++) {
        //     let ball = new Ball();
        //     this.ball = this.scene.add(ball);
        //     ball.position.y = 0.72;
        //     ball.position.z = 0 - 0.2;
        //     ball.position.x = 0.2 * i + 0.2;
        // }

        // add physics to an existing object
        let ball = this.physics.add.sphere(
            { radius: 0.2, x: 4, y: 4, z: 0 },
            { lambert: { color: 'white' } }
        );
        let ball2 = this.physics.add.sphere(
            { radius: 0.2, x: -4, y: 4, z: 0 },
            { lambert: { color: 'white' } }
        );
        ball.body.applyForce(-3, 0, 0);
        ball2.body.applyForce(5, 0, 0);
    }
}

export default TableScene;
