import * as THREE from 'three'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';


export function createScoreText(callback, scoreP1, scoreP2) {

	const loader = new FontLoader();

	let textScore = `${scoreP1} - ${scoreP2}`;

	loader.load('/src/fonts/helvetiker_regular.typeface.json', function (font) {
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
		geometry.computeBoundingBox();
		const centerOffset = - 0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x)
		const material2 = new THREE.MeshStandardMaterial({ color: 0xffd700 });
		const text = new THREE.Mesh(geometry, material2);
		text.position.y = -2;
		text.position.x = centerOffset;
		text.position.z = -6;
		text.rotation.x = -1.5;
		
		callback(text);
	});
}

export function createText(callback, string, positionx, positionz, color) {

	const loader = new FontLoader();

	let text = string;
	console.log(string);

	loader.load('/src/fonts/helvetiker_regular.typeface.json', function (font) {
		const geometry = new TextGeometry(text, {
			font: font,
			size: 1,
			depth: 1,
			height: 0.25,
			curveSegments: 3,
			bevelEnabled: false,
			bevelThickness: 0.25,
			bevelSize: 0.28,
			bevelOffset: -0.1,
			bevelSegments: 20
		});
		geometry.computeBoundingBox();
		const centerOffset = - 0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x)
		const material2 = new THREE.MeshStandardMaterial({ color: color });
		const newText = new THREE.Mesh(geometry, material2);
		// newText.position.y = -2;
		newText.position.x = centerOffset + positionx;
		newText.position.z = positionz;
		newText.rotation.x = -1.5;
		
		callback(newText);
	});
}

export function createWinnerText(callback, winnerWord, nameWinner) {

	const loader = new FontLoader();

	let textWinner = `${winnerWord}\n${nameWinner}`;
	console.log(textWinner);

	loader.load('/src/fonts/helvetiker_regular.typeface.json', function (font) {
		const geometry = new TextGeometry(textWinner, {
			font: font,
			size: 2,
			depth: 1,
			height: 0.25,
			curveSegments: 3,
			bevelEnabled: false,
			bevelThickness: 0.25,
			bevelSize: 0.28,
			bevelOffset: -0.1,
			bevelSegments: 20
		});
		geometry.computeBoundingBox();
		const centerOffset = - 0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x)
		const material2 = new THREE.MeshStandardMaterial({ color: 0xffd700 });
		const winnerText = new THREE.Mesh(geometry, material2);
		// winnerText.position.y = -2;
		winnerText.position.x = centerOffset;
		winnerText.position.z = -2;
		winnerText.rotation.x = -1.5;
		
		callback(winnerText);
	});
}
