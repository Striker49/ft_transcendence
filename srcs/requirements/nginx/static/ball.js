import * as THREE from 'three';

// Function to create the ball
export function createBall() {
    const geometry = new THREE.SphereGeometry(1.5, 15, 15);

    // Create the ball
    const material = new THREE.MeshBasicMaterial({ color: 0xffd700 });
    const ball = new THREE.Mesh(geometry, material);
	ball.position.x = 0;
	ball.position.y = 0;

    return { ball };
}