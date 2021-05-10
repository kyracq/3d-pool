import { Group, LoadingManager, Material } from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import MATERIAL from './8Ball.mtl';
import OBJ from './8Ball.obj';

class Ball extends Group {
    constructor() {
        super();

        this.name = 'table';

        const manager = new LoadingManager();

        new MTLLoader(manager).load(MATERIAL, (materials) => {
            materials.preload();

            new OBJLoader(manager)
                .setMaterials(materials)
                .load(OBJ, (object) => this.add(object));
        });
    }
}

export default Ball;
