import * as Dat from 'dat.gui';
import { Scene3D, Canvas, Cameras, THREE, ExtendedObject3D } from 'enable3d';
import { Table, Ball } from 'objects';
import { BasicLights } from 'lights';
import * as DAT from 'dat.gui';
import { Color, ArrowHelper, Vector3 } from 'three';

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
            direction: new THREE.Vector3(-1, 0, 0),
            spacePressed: false,
            power: 10,
            complete: false,
            turnOver: false,
            firstTurn: true,
        };

        this.state.gui.add(this.state, 'power', 1, 20).listen();

        // add drop down list to choose theme
        var gui = new DAT.GUI();
        var theme_folder = gui.addFolder('Theme');
        var current_theme = { theme: 'Default' };
        theme_folder
            .add(current_theme, 'theme', {
                Pink: 'pink',
                Sunny_Park: 'sunPark',
                Default: 'default',
            })
            .onChange((newValue) => {
                switchTheme(newValue);
            });
        var temp = this;

        // set theme based on dropdown
        function switchTheme(stringTheme) {
            switch (stringTheme) {
                case 'pink':
                    temp.scene.background = new Color('#FFC0CB');
                    break;
                case 'sunPark':
                    // load background
                    const loader = new THREE.TextureLoader();
                    const texture = loader.load(
                        'src/components/backgrounds/sunny_vondelpark.jpg',
                        () => {
                            const rt = new THREE.WebGLCubeRenderTarget(
                                texture.image.height
                            );
                            rt.fromEquirectangularTexture(
                                temp.renderer,
                                texture
                            );
                            temp.scene.background = rt.texture;
                        }
                    );
                    break;
                case 'default':
                    temp.scene.background = new Color('#40E0D0');
                    ground.body.Color = new Color('#90EE90');
                    break;
                default:
                    break;
            }
        }
        let arrowColor = new Color('#e5ff87');

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
        const arrowHelper = new ArrowHelper(
            this.state.direction,
            new Vector3(0, 0, 0), // set immediately in update()
            this.state.power / 5,
            arrowColor
        );
        this.arrow = arrowHelper;

        arrowHelper.children[0].material.customProgramCacheKey = () => {};
        arrowHelper.children[1].material.customProgramCacheKey = () => {};
        this.scene.add(arrowHelper);

        const diectionOffset = 0.1;

        document.addEventListener('keydown', (event) => {
            if (event.code === 'Space') {
                this.state.spacePressed = true;
            } else if (event.code === 'ArrowLeft') {
                this.updateDirection(diectionOffset);
            } else if (event.code === 'ArrowRight') {
                this.updateDirection(-diectionOffset);
            }
        });
        document.addEventListener('keyup', (event) => {
            if (event.code === 'Space') {
                cue.body.applyForce(
                    (this.state.power * this.state.direction.x) / 2,
                    (this.state.power * this.state.direction.y) / 2,
                    (this.state.power * this.state.direction.z) / 2
                );
                this.state.spacePressed = false;
                this.state.hideArrow = true;
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
            this.arrow.visible = true;
            if (!this.state.firstTurn) {
                this.state.turnOver = true;
            }
        } else {
            this.arrow.visible = false;
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

        this.arrow.position.copy(this.cue.position);
        this.arrow.setLength(this.state.power / 5);

        // friction
        this.cue.body.setVelocity(
            cueVel.x - 0.015 * cueVel.x,
            cueVel.y - 0.015 * cueVel.y,
            cueVel.z - 0.015 * cueVel.z
        );
    }

    updateDirection(offset) {
        let newDirection = this.state.direction.clone();
        let axis = new THREE.Vector3(0, 1, 0);
        newDirection.applyAxisAngle(axis, offset);
        this.state.direction = newDirection;
        this.arrow.setDirection(newDirection);
    }
}

export default TableScene;
