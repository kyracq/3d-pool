import { Scene3D, Canvas, Cameras, THREE, ExtendedObject3D } from 'enable3d';
import { Table, Ball } from 'objects';
import { BasicLights } from 'lights';
import * as DAT from 'dat.gui';
import {Color, Vector3, ArrowHelper} from 'three';

// function to refresh scene
var startOver = function () {
    window.location.href = window.location.href;
}
var cueReset = function () {
    window.location.href = window.location.href;
}
var cue;

class TableScene extends Scene3D {
    constructor() {
        super('TableScene');
    }

    /*init() {
        this.renderer.setPixelRatio(1);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }*/

    create() {
        // set up scene (light, ground, grid, sky, orbitControls)
        this.warpSpeed('-sky', '-grid', '-ground');
        this.scene.background = new Color('#40E0D0');
        var ground = this.physics.add.box({width: 8, height: 0.4, depth: 8, collisionFlags: 1, y: -4}, {lambert: {color: 'white', transparent: true, opacity: 0.1}});
        ground.body.setFriction(0.5);
        
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
            gui: new DAT.GUI(), // Create GUI for scene
            updateList: [], // Maintains all meshes to be updated
            // Direction/Power for golf ball
            direction: new THREE.Vector3(-1, 0, 0),
            spacePressed: false,
            power: 10,
            player1Turn: true,
            firstTurn: true,
            cuePocketed: false,
            ballPocketed: false,
        };

        this.state.gui.add(this.state, 'power', 1, 20).listen();

        // text
        const head = document.getElementsByTagName('head')[0];
        const link = document.createElement('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.href =
            'https://fonts.googleapis.com/css2?family=Oxygen:wght@400;700&display=swap';
        head.appendChild(link);
        const text1 = document.createElement('div');
        text1.innerText = `Player 1's Turn`;
        text1.id = 'which-player-turn';
        text1.style.position = 'absolute';
        text1.style.top = '40px';
        text1.style.left = '10%';
        text1.style.fontWeight = 'bold';
        text1.style.fontFamily = '"Oxygen", sans-serif';
        document.body.appendChild(text1);

        // add drop down list to choose theme
        var theme_folder = this.state.gui.addFolder("Theme");
        var current_theme = {theme: "Default"};
        theme_folder.add(current_theme, 'theme', {Pink: "pink", Sunny_Park: "sunPark", Default_Blue: "default", Shanghai_Bund: "shanghai", Beach: "beach", Art_Studio: "artStudio", Modern_Building: "modernBuilding", Snowy_Field: "snowyField"}).onChange(newValue => {switchTheme(newValue)});
        var temp = this;
        const loader = new THREE.TextureLoader();
        var texture;

        // set theme based on dropdown
        function switchTheme(stringTheme) {
            switch (stringTheme) {
                case "pink":
                    temp.scene.background = new Color('#FFC0CB');
                  break;
                case "sunPark":
                    // load background
                    texture = loader.load('src/components/backgrounds/sunny_vondelpark.jpg', 
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
                case "shanghai":
                    // load background
                    texture = loader.load('src/components/backgrounds/shanghai_bund.jpg', 
                    () => {
                    const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
                    rt.fromEquirectangularTexture(temp.renderer, texture);
                    temp.scene.background = rt.texture;
                    });
                  break;
                case "beach":
                    // load background
                    texture = loader.load('src/components/backgrounds/umhlanga_sunrise.jpg', 
                    () => {
                    const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
                    rt.fromEquirectangularTexture(temp.renderer, texture);
                    temp.scene.background = rt.texture;
                    });
                  break;
                case "artStudio":
                    // load background
                    texture = loader.load('src/components/backgrounds/art_studio.jpg', 
                    () => {
                    const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
                    rt.fromEquirectangularTexture(temp.renderer, texture);
                    temp.scene.background = rt.texture;
                    });
                  break;
                case "modernBuilding":
                    // load background
                    texture = loader.load('src/components/backgrounds/modern_buildings_night.jpg', 
                    () => {
                    const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
                    rt.fromEquirectangularTexture(temp.renderer, texture);
                    temp.scene.background = rt.texture;
                    });
                  break;
                case "snowyField":
                    // load background
                    texture = loader.load('src/components/backgrounds/snowy_field.jpg', 
                    () => {
                    const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
                    rt.fromEquirectangularTexture(temp.renderer, texture);
                    temp.scene.background = rt.texture;
                    });
                  break;
                default:
                  break;
              }
        }

        let arrowColor = new Color('#e5ff87');

        // Add meshes to scene
        const table = new Table();
        const lights = new BasicLights();
        this.scene.add(lights);
        this.scene.add(table);
        table.scale.set(5, 5, 5);
        table.position.y = -3;

        // enable physics debug
        //this.physics.debug.enable();

        // add physics to the table
        // table ground
        var box1 = this.add.box({width: 8.9, height: 2.5, depth: 4.18, y: -2.655}, {lambert: {color: 'red', transparent: true, opacity: 0.0}});
        this.physics.add.existing(box1, {collisionFlags: 2});
        box1.body.setFriction(0.7);
        
        var sidestrip_1 = this.add.box({width: 0.23, height: 2.5, depth: 4.17, x: 4.55, y: -2.655}, {lambert: {color: 'blue', transparent: true, opacity: 0.0}});
        this.physics.add.existing(sidestrip_1, {collisionFlags: 2});
        sidestrip_1.body.setFriction(0.7);
        var sidestrip_2 = this.add.box({width: 0.23, height: 2.5, depth: 4.17, x: -4.55, y: -2.655}, {lambert: {color: 'blue', transparent: true, opacity: 0.0}});
        this.physics.add.existing(sidestrip_2, {collisionFlags: 2});
        sidestrip_2.body.setFriction(0.7);

        var sidestrip_3 = this.add.box({width: 4.2, height: 2.5, depth: 0.24, x: 2.34, y: -2.655, z: 2.2}, {lambert: {color: 'blue', transparent: true, opacity: 0.0}});
        this.physics.add.existing(sidestrip_3, {collisionFlags: 2});
        sidestrip_3.body.setFriction(0.7);
        var sidestrip_4 = this.add.box({width: 4.2, height: 2.5, depth: 0.24, x: -2.34, y: -2.655, z: 2.2}, {lambert: {color: 'blue', transparent: true, opacity: 0.0}});
        this.physics.add.existing(sidestrip_4, {collisionFlags: 2});
        sidestrip_4.body.setFriction(0.7);
        var sidestrip_5 = this.add.box({width: 4.3, height: 2.5, depth: 0.24, x: 2.34, y: -2.655, z: -2.2}, {lambert: {color: 'blue', transparent: true, opacity: 0.0}});
        this.physics.add.existing(sidestrip_5, {collisionFlags: 2});
        sidestrip_5.body.setFriction(0.7);
        var sidestrip_6 = this.add.box({width: 4.3, height: 2.5, depth: 0.24, x: -2.34, y: -2.655, z: -2.2}, {lambert: {color: 'blue', transparent: true, opacity: 0.0}});
        this.physics.add.existing(sidestrip_6, {collisionFlags: 2});
        sidestrip_6.body.setFriction(0.7);
        

        // long side 1
        var box2 = this.add.box({width: 4.10, height: 3.43, depth: 2, x: -2.35, y: -2, z: -3.33}, {lambert: {color: 'red', transparent: true, opacity: 0.0}});
        this.physics.add.existing(box2, {collisionFlags: 2});
        box2.body.setFriction(0.7);
        var box3 = this.add.box({width: 4.10, height: 3.43, depth: 2, x: 2.35, y: -2, z: -3.33}, {lambert: {color: 'red', transparent: true, opacity: 0.0}});
        this.physics.add.existing(box3, {collisionFlags: 2});
        box3.body.setFriction(0.7);
        // long side 2
        var box4 = this.add.box({width: 4.10, height: 3.43, depth: 2, x: -2.35, y: -2, z: 3.355}, {lambert: {color: 'red', transparent: true, opacity: 0.0}});
        this.physics.add.existing(box4, {collisionFlags: 2});
        box4.body.setFriction(0.7);
        var box5 = this.add.box({width: 4.10, height: 3.43, depth: 2, x: 2.35, y: -2, z: 3.355}, {lambert: {color: 'red', transparent: true, opacity: 0.0}});
        this.physics.add.existing(box5, {collisionFlags: 2});
        box5.body.setFriction(0.7);
        // short side 1
        var box6 = this.add.box({width: 2, height: 3.43, depth: 4.1, y: -2, x: -5.70}, {lambert: {color: 'red', transparent: true, opacity: 0.0}});
        this.physics.add.existing(box6, {collisionFlags: 2});
        box6.body.setFriction(0.7);
        // short side 2
        var box7 = this.add.box({width: 2, height: 3.43, depth: 4.1, y: -2, x: 5.70}, {lambert: {color: 'red', transparent: true, opacity:0.0}});
        this.physics.add.existing(box7, {collisionFlags: 2});
        box7.body.setFriction(0.7);

        // add balls 
        let positions = [
            { x: -3, z: 0 },
            { x: -3, z: 0.35 },
            { x: -3, z: 0.7 },
            { x: -3, z: -0.35 },
            { x: -3, z: -0.7 },
            { x: -2.65, z: 0.1525 },
            { x: -2.65, z: 0.4925 },
            { x: -2.65, z: -0.1525 },
            { x: -2.65, z: -0.4925 },
            { x: -2.3, z: 0.35 },
            { x: -2.3, z: 0 },
            { x: -2.3, z: -0.35 },
            { x: -1.95, z: 0.155 },
            { x: -1.95, z: -0.155 },
            { x: -1.6, z: 0 },
        ];
        this.poolBalls = [];
        for (let i = 0; i < positions.length; i++) {
            var geometry = new THREE.SphereGeometry(0.16, 16, 16);
            var pic = "src/components/ball textures/" + (i + 1) + ".png";
            var ball_material = new THREE.MeshBasicMaterial({map: loader.load(pic),})
            let ball = new THREE.Mesh(geometry, ball_material);
            ball.position.set(positions[i].x, -2.3, positions[i].z);
            this.scene.add(ball);
            // add physics to an existing object
            this.physics.add.existing(ball);
            this.poolBalls.push(ball);
            ball.body.setBounciness(0.8);
            ball.body.setDamping(0.3, 0.3);
        }

        // add cue
        cue = this.physics.add.sphere(
            { radius: 0.2, x: 3, y: 2.4, z: 0 },
            { lambert: { color: 'white' } }
        );
        cue.body.setBounciness(0.8);
        cue.body.setDamping(0.3, 0.3);
        this.cue = cue;
        // add sounds
        const cue_sound = new Audio('src/components/sounds/cue hit.mp3');

        // take care of pockets/ collisions with pockets
        // pocket 1
        const pocket1 = this.add.sphere({ radius: 0.25, x: -4.7, y: -1.45, z: -2.4 }, { lambert: { color: 'green', transparent: true, opacity: 0.0 } });
        this.physics.add.existing(pocket1, {collisionFlags: 5});
        pocket1.body.on.collision((otherObject, event) => {
            // refresh if 8 ball lands in pocket
            if (otherObject == this.poolBalls[7]) {
                startOver();
            }
            // add cue to starting position again if cue ball goes through pocket
            else if (otherObject == this.cue) {
                this.destroy(otherObject);
                this.state.cuePocketed = true;
            }
            else {
                this.state.ballPocketed = true;
                this.destroy(otherObject);
            }
          }); 

        // pocket 2
        const pocket2 = this.add.sphere({ radius: 0.25, x: 0.0, y: -1.5, z: -2.4 }, { lambert: { color: 'green', transparent: true, opacity: 0.0 } });
        this.physics.add.existing(pocket2, {collisionFlags: 5});
        pocket2.body.on.collision((otherObject, event) => {
            // refresh if 8 ball lands in pocket
            if (otherObject == this.poolBalls[7]) {
                startOver();
            }
            // add cue to starting position again if cue ball goes through pocket
            else if (otherObject == this.cue) {
                this.destroy(otherObject);
                this.state.cuePocketed = true;
            }
            else {
                this.state.ballPocketed = true;
                this.destroy(otherObject);
            }
          }); 

        // pocket 3
        const pocket3 = this.add.sphere({ radius: 0.25, x: 4.7, y: -1.5, z: -2.4 }, { lambert: { color: 'green', transparent: true, opacity:0.0 } });
        this.physics.add.existing(pocket3, {collisionFlags: 5});
        pocket3.body.on.collision((otherObject, event) => {
            // refresh if 8 ball lands in pocket
            if (otherObject == this.poolBalls[7]) {
                startOver();
            }
            // add cue to starting position again if cue ball goes through pocket
            else if (otherObject == this.cue) {
                this.destroy(otherObject);
                this.state.cuePocketed = true;
            }
            else {
                this.state.ballPocketed = true;
                this.destroy(otherObject);
            }
          }); 

        // pocket 4
        const pocket4 = this.add.sphere({ radius: 0.25, x: -4.7, y: -1.5, z: 2.4 }, { lambert: { color: 'green', transparent: true, opacity:0.0 } });
        this.physics.add.existing(pocket4, {collisionFlags: 5});
        pocket4.body.on.collision((otherObject, event) => {
            // refresh if 8 ball lands in pocket
            if (otherObject == this.poolBalls[7]) {
                startOver();
            }
            // add cue to starting position again if cue ball goes through pocket
            else if (otherObject == this.cue) {
                this.destroy(otherObject);
                this.state.cuePocketed = true;
            }
            else {
                this.state.ballPocketed = true;
                this.destroy(otherObject);
            }
          }); 

        // pocket 5
        const pocket5 = this.add.sphere({ radius: 0.25, x: 0.0, y: -1.5, z: 2.4 }, { lambert: { color: 'green', transparent: true, opacity:0.0 } });
        this.physics.add.existing(pocket5, {collisionFlags: 5});
        pocket5.body.on.collision((otherObject, event) => {
            // refresh if 8 ball lands in pocket
            if (otherObject == this.poolBalls[7]) {
                startOver();
            }
            // add cue to starting position again if cue ball goes through pocket
            else if (otherObject == this.cue) {
                this.destroy(otherObject);
                this.state.cuePocketed = true;
            }
            else {
                this.state.ballPocketed = true;
                this.destroy(otherObject);
            }
          }); 

        // pocket 6
        const pocket6 = this.add.sphere({ radius: 0.25, x: 4.7, y: -1.5, z: 2.4 }, { lambert: { color: 'green', transparent: true, opacity:0.0 } });
        this.physics.add.existing(pocket6, {collisionFlags: 5});
        pocket6.body.on.collision((otherObject, event) => {
            // refresh if 8 ball lands in pocket
            if (otherObject == this.poolBalls[7]) {
                startOver();
            }
            // add cue to starting position again if cue ball goes through pocket
            else if (otherObject == this.cue) {
                this.destroy(otherObject);
                this.state.cuePocketed = true;
            }
            else {
                this.state.ballPocketed = true;
                this.destroy(otherObject);
            }
          }); 

        // take care of arrow
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
                cue_sound.play();
                this.state.spacePressed = false;
                if (this.state.firstTurn) this.state.firstTurn = false;
            }
        });
    }

    update(time, delta) {
        if (this.state.cuePocketed) {
            cue = this.physics.add.sphere(
                { radius: 0.2, x: 3, y: 2.4, z: 0 },
                { lambert: { color: 'white' } }
            );
            cue.body.setBounciness(0.8);
            cue.body.setDamping(0.3, 0.3);
            this.cue = cue;
            this.state.cuePocketed = false;
        } 
        let cueVel = this.cue.body.velocity;
        if (
            Math.abs(cueVel.x) < 0.05 &&
            Math.abs(cueVel.y) < 0.05 &&
            Math.abs(cueVel.z) < 0.05
        ) {
            this.cue.body.setVelocity(0, 0, 0);
            if (!this.arrow.visible && !this.state.firstTurn && !this.state.ballPocketed) {
                // ball now stopping
                const text = document.getElementById('which-player-turn');
                this.state.player1Turn = !this.state.player1Turn;
                const num = this.state.player1Turn ? `1` : `2`;
                text.innerText = `Player ${num}'s Turn`;
            }
            this.arrow.visible = true;
            this.state.ballPocketed = false;
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
        /*this.cue.body.setVelocity(
            cueVel.x - 0.015 * cueVel.x,
            cueVel.y - 0.015 * cueVel.y,
            cueVel.z - 0.015 * cueVel.z
        );*/
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
