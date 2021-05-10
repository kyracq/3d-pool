// import 3D scene
import {PhysicsLoader, Project, Scene3D} from 'enable3d'
//import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'
//import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
//import MATERIAL from 'src/components/PoolTable.mtl'
//import OBJ from 'src/components/PoolTable.obj'

// create class
export class PhysicsTest extends Scene3D {
  // override methods
  async init() {
    this.renderer.setPixelRatio(1)
    this.renderer.setSize(window.innerWidth, window.innerHeight)

  }

  async create() {
    this.warpSpeed();
    // create "pool table"
    let ground = this.physics.add.box({width: 20, height: 0.4, depth: 20, collisionFlags: 1}, {lambert: {color: 'forestgreen'}});
    // add walls
    let wall1 = this.physics.add.box({x: 0, y: 1, z: 10.1, width: 20, height: 1.8, depth: 0.8, collisionFlags: 1}, {lambert: {color: 'black'}});
    let wall2 = this.physics.add.box({x: 10.1, y: 1, z: 0, width: 0.8, height: 1.8, depth: 20, collisionFlags: 1}, {lambert: {color: 'black'}});
    let wall3 = this.physics.add.box({x: 0, y: 1, z: -10.1, width: 20, height: 1.8, depth: 0.8, collisionFlags: 1}, {lambert: {color: 'black'}});
    let wall4 = this.physics.add.box({x: -10.1, y: 1, z: 0, width: 0.8, height: 1.8, depth: 20, collisionFlags: 1}, {lambert: {color: 'black'}});

    // add rudimentary ball
    let ball = this.physics.add.sphere({radius: 0.5, collisionFlags: 0});
    ball.body.applyForceX(5);

    //let ball2 = this.physics.add.sphere({radius: 0.5, collisionFlags: 0}, {lambert: {color: 'red'}});
    //ball2.body.applyForceX(5);


    // apply collisions
    this.physics.add.collider(ball, wall1, event => {
      console.log(`ball and wall1: ${event}`)
    });
    this.physics.add.collider(ball, wall2, event => {
      console.log(`ball and wall2: ${event}`)
    });
    this.physics.add.collider(ball, wall3, event => {
      console.log(`ball and wall3: ${event}`)
    });
    this.physics.add.collider(ball, wall4, event => {
      console.log(`ball and wall4: ${event}`)
    });
  }
}

const config = { scenes: [PhysicsTest], antialias: true}
PhysicsLoader('/ammo', () => new Project(config))




