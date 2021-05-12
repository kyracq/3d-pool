import { Scene3D, Canvas, Cameras, THREE, ExtendedObject3D } from 'enable3d';
import { Table, Ball } from 'objects';
import { BasicLights } from 'lights';
import * as DAT from 'dat.gui';
import {Color} from 'three';

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
        this.warpSpeed('-sky', '-grid', '-ground');
        this.scene.background = new Color('#40E0D0');
        var ground = this.physics.add.box({width: 25, height: 0.4, depth: 15, collisionFlags: 1}, {lambert: {color: 'white', transparent: true, opacity: 0.1}});
        // position camera
        //this.camera.position.set(10, 10, 20);

        // add drop down list to choose theme
        var gui = new DAT.GUI();
        var theme_folder = gui.addFolder("Theme");
        var current_theme = {theme: "Default"};
        theme_folder.add(current_theme, 'theme', {Pink: "pink", Sunny_Park: "sunPark", Default: "default"}).onChange(newValue => {switchTheme(newValue)});
        var temp = this;

        // set theme based on dropdown
        function switchTheme(stringTheme) {
            switch (stringTheme) {
                case "pink":
                    temp.scene.background = new Color('#FFC0CB');
                  break;
                case "sunPark":
                    // load background
                    const loader = new THREE.TextureLoader();
                    const texture = loader.load('src/components/backgrounds/sunny_vondelpark.jpg', 
                    () => {
                    const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
                    rt.fromEquirectangularTexture(temp.renderer, texture);
                    temp.scene.background = rt.texture;
                    });
                  break;
                case "default":
                    temp.scene.background = new Color('#40E0D0');
                    ground.body.Color = new Color('#90EE90')
                  break;
                default:
                  break;
              }
        }

        // enable physics debug
        //this.physics.debug.enable();

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
        ball.body.applyForce(-2, 0, 0);
    }
}

export default TableScene;
