import * as THREE from 'three'
import { boxCollision } from './collision.js';
import { Box } from './box.js';

function applyPowerUp(paddle, ground) {
    let type = Math.round(Math.random() * (2 - 1) + 1);
    if (type == 1)
    {
        paddle.scale.z = 0.5;
        paddle.depth *= 0.5;
    }
    else if (type == 2)
    {
        paddle.scale.z = 2;
        paddle.depth *= 2;
        paddle.update(ground);
        if (paddle.front > ground.front)
            paddle.position.z -= paddle.front - ground.front;
        if (paddle.back < ground.back)
            paddle.position.z += ground.back - paddle.back;     
    }
}

export function removePowerUp(paddleL, paddleR, paddleDepth) {
    if (paddleL.poweredUp == true)
    {
        paddleL.scale.z = 1;
        paddleL.depth = paddleDepth;
    }
    if (paddleR.poweredUp == true)
    {
        paddleR.scale.z = 1;
        paddleR.depth = paddleDepth;
    }
    paddleL.poweredUp = false;
    paddleR.poweredUp = false;
    // powerUps.forEach((obj, index) => powerUps[index].poweredUp = false);
}

function createPowerBox(scene, paddle, side, powerUps, ground) {
    powerUps[side] = new Box({
        width: 0.35,
        height: 0.35,
        depth: 0.35,
        color: '#de5aed',
        position: {
            x: paddle.position.x,
            y: 0,
            z: paddle.position.z > 0 ? -(ground.depth / 2* 0.75) : (ground.depth / 2 * 0.75)
        }})
    powerUps[side].height = 0.5;
    powerUps[side].castShadow = true;
    scene.add(powerUps[side]);
    
    
}

export function spawnPowerUp(scene, paddleL, paddleR, powerUps, ground, frames) {
    if (frames < 500)
        return;
    if (paddleL.poweredUp == false)
    {
        if (!powerUps[0])
            createPowerBox(scene, paddleL, 0, powerUps, ground);
    }
    if (paddleR.poweredUp == false)
    {
        if (!powerUps[1])
            createPowerBox(scene, paddleR, 1, powerUps, ground);
    }
}

export function updatePowerUps(scene, paddleR, paddleL, powerUps, ground, powerUpLocation) {
    powerUps.forEach((obj, index) => {
        if (!powerUps[index])
            return;
        obj.rotation.z += 0.01;
        obj.rotation.y += 0.01;
        obj.update(ground);
        if (boxCollision({
            box1: obj,
            box2: index == 0 ? paddleL : paddleR
        }))
        {
            if (powerUps[index].poweredUp == false)
                {
                    if (index == 0)
                    {
                        paddleL.poweredUp = true;
                        applyPowerUp(paddleL, ground);
                    }
                    else
                    {
                        paddleR.poweredUp = true;
                        applyPowerUp(paddleR, ground);
                        powerUpLocation = null;
                    }
                    powerUps[index].poweredUp = true;
                    scene.remove(powerUps[index]);
                    powerUps[index].kill();
                    powerUps[index] = null;
                }
            }
        })
		return (powerUpLocation);
}
