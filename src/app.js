/**
 * app.js
 */
import { TableScene } from 'scenes';
import { Project, PhysicsLoader } from 'enable3d';

const style =
    '<style type="text/css">' +
    'body, h1 { font-family: "Oxygen", sans-serif;}' +
    'h1 {font-weight: 700; text-align:center; font-size: 80px;}' +
    '#title-div {position: absolute; left: 50%; top: 30%; -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%);' +
    'border: 1px solid green; padding: 40px; border-radius: 15px; box-shadow: 5px 10px 7px 1px #3d3d3d;}' +
    'p {text-align: center;}' +
    '#start {font-size: 24px;}';
('</style>');

document.body.innerHTML += style;

// source: https://tholman.com/github-corners/
document.body.innerHTML +=
    '<a href="https://github.com/kyracq/3d-pool" class="github-corner" aria-label="View source on GitHub"><svg width="80" height="80" viewBox="0 0 250 250" style="fill:#151513; color:#fff; position: absolute; top: 0; border: 0; right: 0;" aria-hidden="true"><path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path></svg></a><style>.github-corner:hover .octo-arm{animation:octocat-wave 560ms ease-in-out}@keyframes octocat-wave{0%,100%{transform:rotate(0)}20%,60%{transform:rotate(-25deg)}40%,80%{transform:rotate(10deg)}}@media (max-width:500px){.github-corner:hover .octo-arm{animation:none}.github-corner .octo-arm{animation:octocat-wave 560ms ease-in-out}}</style>';

const head = document.getElementsByTagName('head')[0];
const link = document.createElement('link');
link.type = 'text/css';
link.rel = 'stylesheet';
link.href =
    'https://fonts.googleapis.com/css2?family=Oxygen:wght@400;700&display=swap';
head.appendChild(link);

const container = document.createElement('div');
container.id = 'title-div';
const title = document.createElement('h1');
title.innerHTML = '3D Pool';
document.body.appendChild(container);
container.appendChild(title);
const text1 = document.createElement('p');
text1.innerText = 'Press enter to start';
text1.id = 'start';
const text2 = document.createElement('p');
text2.innerText =
    '3D Pool is a traditional 8-ball pool game. Use the left and ' +
    'right arrow keys to change the direction of the shot, press and hold the space bar to set your power level, and release the space bar to take the shot.';
container.appendChild(text2);
container.appendChild(text1);

let gameStarted = false;

window.onload = () => {
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Enter' && gameStarted === false) {
            gameStarted = true;
            document.body.innerHTML = ''; // clear landing page
            // Load game
            PhysicsLoader(
                'lib',
                () => new Project({ scenes: [TableScene], antialias: true })
            );
        }
    });
};
