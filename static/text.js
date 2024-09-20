import * as THREE from 'three'

import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

export function createText(callback, scoreP1, scoreP2) {

	const loader = new FontLoader();

	let textScore = `${scoreP1} - ${scoreP2}`;

	loader.load('resources/fonts/helvetiker_regular.typeface.json', function (font) {
		const geometry = new TextGeometry(textScore, {
			font: font,
			size: 15,
			depth: 0.5,
			height: 2,
			curveSegments: 12,
			bevelEnabled: true,
			bevelThickness: 0.2,
			bevelSize: 1,
			bevelOffset: 0,
			bevelSegments: 10
		});
		const material2 = new THREE.MeshStandardMaterial({ color: 0xffd700 });
		const text = new THREE.Mesh(geometry, material2);
		text.position.y = 30;
		text.position.x = -22;
		text.position.z = 0;
		
		callback(text);
	});
}