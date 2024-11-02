import * as THREE from 'three'
import {boxCollision} from './collision.js'

export class Box extends THREE.Mesh {
    constructor({width,
        height,
        depth,
        color = '#00ff00',
        velocity = {
            x: 0,
            y: 0,
            z: 0
        },
        position = {
            x: 0,
            y: 0,
            z: 0
        },
        zAcceleration
    }) {
        super(new THREE.BoxGeometry(width, height, depth),
        new THREE.MeshStandardMaterial({ color })
        )

    this.width = width;
    this.height = height;
    this.depth = depth;

    this.position.set(position.x, position.y, position.z);

    this.bottom = this.position.y - this.height / 2;
    this.top = this.position.y + this.height / 2;
    this.right = this.position.x + this.width / 2;
    this.left = this.position.x - this.width / 2;
    this.front = this.position.z + this.depth / 2;
    this.back = this.position.z - this.depth / 2;

    this.velocity = velocity;
    this.gravity = -0.002;
    this.zAcceleration = zAcceleration;
    }

    updateSides() {
        this.bottom = this.position.y - this.height / 2;
        this.top = this.position.y + this.height / 2;
        this.right = this.position.x + this.width / 2;
        this.left = this.position.x - this.width / 2;
        this.front = this.position.z + this.depth / 2;
        this.back = this.position.z - this.depth / 2;
    }

    update(ground) {

        this.updateSides();

        if (this.zAcceleration)
            this.velocity.z += 0.0003;

        this.velocity.y += this.gravity;
        this.position.x += this.velocity.x;
        this.position.z += this.velocity.z;

        this.applyGravity(ground);
    }

    applyGravity(ground) {
        //This is where we hit the ground
        if (boxCollision({
            box1: this,
            box2: ground
            })){
            const friction = 0.5;
            this.velocity.y *= friction;
            this.velocity.y = -this.velocity.y;
        }   
        else {
            this.position.y += this.velocity.y;
        }
    }
    
    kill() {
        this.material.dispose();
        this.geometry.dispose();
    }
};