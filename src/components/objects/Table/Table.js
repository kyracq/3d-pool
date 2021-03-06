import { Group, LoadingManager, Mesh } from 'three';
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

            materials.materials.Color_G17.customProgramCacheKey = () => {};
            materials.materials.Color_M00.customProgramCacheKey = () => {};
            materials.materials.Color_M09.customProgramCacheKey = () => {};

            new OBJLoader(manager)
                .setMaterials(materials)
                .load(OBJ, (model) => {
                    model.traverse(function (child) {
                        if (child instanceof Mesh) {
                            child.geometry.center();
                        }
                    });

                    this.add(model);
                });
        });
    }
}

export default Table;
