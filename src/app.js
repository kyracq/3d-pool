/**
 * app.js
 */
import { TableScene } from 'scenes';
import { Project, PhysicsLoader } from 'enable3d';

PhysicsLoader(
    'lib',
    () => new Project({ scenes: [TableScene], antialias: true })
);
