import * as THREE from 'three'
import {ballCollision} from './collision.js'
import {resetBallPosition} from './main.js'

export class Ball extends THREE.Mesh{
    constructor({radius,
        width,
        height,
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
        super(new THREE.SphereGeometry(radius, width, height),
        new THREE.MeshStandardMaterial({ color })
        )

    this.radius = radius;
    this.width = width;
    this.height = height;

    this.position.set(position.x, position.y, position.z);

    this.bottom = this.position.y - this.radius / 2;
    this.top = this.position.y + this.radius / 2;
    this.right = this.position.x + this.radius / 2;
    this.left = this.position.x - this.radius / 2;
    this.front = this.position.z + this.radius / 2;
    this.back = this.position.z - this.radius / 2;

    this.velocity = velocity;
    this.gravity = -0.002;
    this.zAcceleration = zAcceleration;
    }

    updateSides() {
        this.bottom = this.position.y - this.radius / 2;
        this.top = this.position.y + this.radius / 2;
        this.right = this.position.x + this.radius / 2;
        this.left = this.position.x - this.radius / 2;
        this.front = this.position.z + this.radius / 2;
        this.back = this.position.z - this.radius / 2;
    }

    update(box, ground) {

        this.updateSides();

        if (this.zAcceleration)
            this.velocity.z += 0.0003;

        this.velocity.y += this.gravity;
        this.position.x += this.velocity.x;
        this.position.z += this.velocity.z;

        this.paddleBounce(box);
        this.sideBounce(ground);
		this.outOfBounds(ground);
    }

    paddleBounce(box) {
        //This is where we hit the box
        if (ballCollision({
			ball: this,
            box: box
		})){
			// // const friction = 0.5;
			if (this.front > box.back && this.back < box.front)
            {
            	this.velocity.x *= -(1.075);
                if (this.velocity.x > 0.25)
                    this.velocity.x = 0.25;
                if (this.back < box.back && this.velocity.z > 0)
                    this.velocity.z *= -1;
                if (this.front > box.front && this.velocity.z < 0)
                    this.velocity.z *= -1;
                this.velocity.z *= (1.075);
                if (this.velocity.z > 0.25)
                    this.velocity.z = 0.25;
            }
        }
    }

	sideBounce(ground) {
		//if the ball is inside the ground
		if (this.right >= ground.left && this.left <= ground.right)
		{
			//if the ball touches the top or bottom side
			if (this.velocity.z > 0 && (this.front + (this.velocity.z)) >= ground.front)
				this.velocity.z *= -1;
			else if (this.velocity.z < 0 && this.back + (this.velocity.z) <= ground.back)
				this.velocity.z *= -1;
		}
	}

	outOfBounds(ground) {
		if (this.position.x < (ground.left - ground.width / 2) || this.position.z > (ground.front + ground.depth / 2))
			resetBallPosition(this, 1);
		else if (this.position.x > (ground.right + ground.width / 2) || this.position.z < (ground.back - ground.depth / 2))
			resetBallPosition(this, 2);
	}
}