import { Scene3D, Canvas, Cameras, THREE, ExtendedObject3D } from 'enable3d';

class Ball {
    constructor(color) {
        this.name = 'ball';
        const geometry = new THREE.SphereGeometry(0.1, 16, 16);
        const material = new THREE.MeshLambertMaterial({ color: color });
        const sphere = new THREE.Mesh(geometry, material);
        this.mesh = sphere;
    }
}

export default Ball;
