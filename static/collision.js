import * as THREE from 'three'

export function boxCollision({box1, box2}) {
    const xCollision = box1.right >= box2.left && box1.left <= box2.right;
    const yCollision = box1.bottom + box1.velocity.y <= box2.top && box1.top >= box2.bottom;
    const zCollision = box1.front >= box2.back && box1.back <= box2.front;
    return (xCollision && yCollision && zCollision);
}

export function ballCollision({ball, box}) {
	let collision = 0;
	if (ball.velocity.x > 0)
    	collision = (ball.right + (ball.velocity.x * 2) >= box.left && ball.left < box.right);
	if (ball.velocity.x < 0)
    	collision = ball.left + (ball.velocity.x * 2) <= box.right && ball.right > box.left;
    return (collision);
}