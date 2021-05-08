import { Scene, Color, Vector3, Box3, EventDispatcher } from 'three';
import { Table, Ball } from 'objects';
import { BasicLights } from 'lights';

class TableScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            updateList: [],
        };

        // Set background to a nice color
        this.background = new Color(0x7ec0ee);

        // Add meshes to scene
        const table = new Table();
        const lights = new BasicLights();
        this.add(table, lights);
        for (let i = 0; i < 3; i++) {
            let ball = new Ball();
            this.add(ball);
            ball.position.y = 0.72;
            ball.position.z = 0 - 0.2;
            ball.position.x = 0.2 * i + 0.2;
        }
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp) {
        const { updateList } = this.state;

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }
    }
}

export default TableScene;
