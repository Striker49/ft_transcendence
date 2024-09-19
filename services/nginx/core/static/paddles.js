import * as THREE from 'three';

// Function to create the paddles
export function createPaddles() {
    const geometry = new THREE.BoxGeometry(5, 15, 5);

    // Create the first paddle
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const paddle1 = new THREE.Mesh(geometry, material);
    paddle1.position.x = -30;

    // Create the second paddle
    const material2 = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const paddle2 = new THREE.Mesh(geometry, material2);
    paddle2.position.x = 30;

    return { paddle1, paddle2 };
}