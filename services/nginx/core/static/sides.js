import * as THREE from 'three';

// Function to create the paddles
export function createSides() {
    const geometry = new THREE.BoxGeometry(65, 1, 5);

    // Create the first paddle
    const material = new THREE.MeshBasicMaterial({ color: 0x818589 });
    const side1 = new THREE.Mesh(geometry, material);
    side1.position.y = 22;

    // Create the second paddle
    // const material2 = new THREE.MeshBasicMaterial({ color: 0xB2BEB5 });
    const side2 = new THREE.Mesh(geometry, material);
    side2.position.y = -22;

    return { side1, side2 };
}