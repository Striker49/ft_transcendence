import * as THREE from 'three'

export function createField() {
	
	const geometry = new THREE.PlaneGeometry(65, 45);
	const material = new THREE.MeshStandardMaterial({color: 0xB2BEB5, side: THREE.DoubleSide});
	const plane = new THREE.Mesh(geometry, material);
	plane.position.z -= 2.6;
	return (plane);
}