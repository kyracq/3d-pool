import { Group, LoadingManager } from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import MATERIAL from './PoolTable.mtl';
import OBJ from './PoolTable.obj';

class Table extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        this.name = 'table';

        const manager = new LoadingManager();

        new MTLLoader(manager).load(MATERIAL, (materials) => {
            materials.preload();

            new OBJLoader(manager)
                .setMaterials(materials)
                .load(OBJ, (object) => this.add(object));
        });
        // loader.load(MODEL, (object) => this.add(object));
    }
}

export default Table;
