import * as THREE from 'three'
import {ballCollision} from './collision.js'
import {boxCollision} from './collision.js'
// import {resetBallPosition} from './main_old.js'

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

    this.bottom = this.position.y - this.radius;
    this.top = this.position.y + this.radius;
    this.right = this.position.x + this.radius;
    this.left = this.position.x - this.radius;
    this.front = this.position.z + this.radius;
    this.back = this.position.z - this.radius;

    this.velocity = velocity;
    this.gravity = -0.002;
    this.zAcceleration = zAcceleration;
    }

    updateSides() {
        this.bottom = this.position.y - this.radius;
        this.top = this.position.y + this.radius;
        this.right = this.position.x + this.radius;
        this.left = this.position.x - this.radius;
        this.front = this.position.z + this.radius;
        this.back = this.position.z - this.radius;
    }

    update(box, ground) {

        this.updateSides();

        if (this.zAcceleration)
            this.velocity.z += 0.0003;

        this.velocity.y += this.gravity;
        this.position.x += this.velocity.x;
        this.position.z += this.velocity.z;

        this.applyGravity(ground);
        this.paddleBounce(box);
        this.sideBounce(ground);
		return (this.outOfBounds(ground));
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

    paddleBounce(box) {
        //This is where we hit the box
        if (ballCollision({
			ball: this,
            box: box
		})){
            //Checks if the ball is on the paddle on the z axis
			if (this.front > box.back && this.back < box.front)
            {
                //Accelerates ball x velocity
            	this.velocity.x *= -(1.075);
                if (this.velocity.x > 0.25)
                    this.velocity.x = 0.25;
                // Checks if the ball is hitting the top of the paddle and inverts z velocity
                if (this.back < box.back && this.velocity.z > 0)
                    this.velocity.z *= -1;
                // Checks if the ball is hitting the bottom of the paddle and inverts z velocity
                if (this.front > box.front && this.velocity.z < 0)
                    this.velocity.z *= -1;
                //Accelerates ball z velocity
                // this.velocity.z *= ((this.front - this.radius) / box.front);
                if (this.velocity.z > 0.25)
                    this.velocity.z = 0.25;
            }
        }
    }

    //Checks for to and bottom boundary bounce
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
    //Checks if ball is a proportional (0.5x) distance away from ground
	outOfBounds(ground) {
        let winner = 0;
        if (this.position.x < (ground.left - ground.width / 2))
            winner = 1;
        else if (this.position.x > (ground.right + ground.width / 2))
            winner = 2;
		if (this.position.x < (ground.left - ground.width / 2) || this.position.z > (ground.front + ground.depth / 2) || 
            this.position.x > (ground.right + ground.width / 2) || this.position.z < (ground.back - ground.depth / 2))
			    return (winner);
        return (winner);
	}

    kill() {
        this.material.dispose();
        this.geometry.dispose();
    }
}
