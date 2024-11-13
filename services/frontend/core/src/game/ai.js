export function calculateBallEndPoint(ball, powerUps, powerUpLocation, paddleL, paddleR, ground) {
    if (powerUps[1])
        powerUpLocation = powerUps[1].position.z;
    let endPointx = ball.position.x;
    let endPointz = ball.position.z;
    let velocityx = ball.velocity.x;
    let velocityz = ball.velocity.z;
    let ballRadius = ball.radius;
    let paddleLength = (paddleL.width / 2);
    while (endPointx < (paddleR.position.x - paddleLength))
    {
        if ((endPointx - (velocityx)) <= (paddleL.position.x + paddleLength) && velocityx < 0)
            velocityx *= -1.075;
        if ((endPointz + (velocityz) >= ground.front && velocityz > 0) || (endPointz - velocityz <= ground.back && velocityz < 0))
            velocityz *= -1;
        if (velocityx > 0.25)
            velocityx = 0.25;

        endPointx += velocityx;
        endPointz += velocityz;
    }
    return ({newZPosition: endPointz, powerUpLocation: powerUpLocation});
}

//Tells if the center of the paddle is where the ball will land or where the powerUp is located
export function approximate(newZPosition, paddlePosition, powerUpLocation, paddleDepth) {
    if (powerUpLocation && powerUpLocation <= paddlePosition + (paddleDepth / 2) && powerUpLocation >= paddlePosition - (paddleDepth / 2))
        return (1);
    else if (newZPosition <= paddlePosition + 0.5 && newZPosition >= paddlePosition - 0.5)
        return (1);
    return (0);
}

export function targetLocation(powerUpLocation, newZPosition) {
    if (powerUpLocation)
        return (powerUpLocation);
    else
        return (newZPosition);
}
