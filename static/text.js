import * as THREE from 'three'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';


export function createText(callback, scoreP1, scoreP2) {

	const loader = new FontLoader();

	let textScore = `${scoreP1} - ${scoreP2}`;

	loader.load('resources/fonts/helvetiker_regular.typeface.json', function (font) {
		const geometry = new TextGeometry(textScore, {
			font: font,
			size: 2,
			depth: 1,
			height: 0.25,
			curveSegments: 3,
			bevelEnabled: true,
			bevelThickness: 0.25,
			bevelSize: 0.28,
			bevelOffset: -0.1,
			bevelSegments: 20
		});
		const material2 = new THREE.MeshStandardMaterial({ color: 0xffd700 });
		const text = new THREE.Mesh(geometry, material2);
		text.position.y = -2;
		// text.position.x = 0;
		text.position.z = -6;
		text.rotation.x = -1.55;
		
		callback(text);
	});
}