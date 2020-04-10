document.addEventListener('DOMContentLoaded', () => {
    const squares = document.querySelectorAll('.grid div')
    const resultDisplay = document.querySelector('#result')
    let currentShooterIndex = 202
    let currentInvaderIndex = 0
    let invadersShotDown = []
    let direction = 1
    let result = 0
    let width = 15
    let invaderId

    // define invaders
    const invaders = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
        15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
        30, 31, 32, 33, 34, 35, 36, 37, 38, 39
    ]

    // draw invaders
    invaders.forEach(invader => squares[currentInvaderIndex + invader].classList.add('invader'))

    // draw shooter
    squares[currentShooterIndex].classList.add('shooter')

    // move shooter
    function moveShooter(event) {
        squares[currentShooterIndex].classList.remove('shooter')
        switch (event.keyCode) {
            case 37:
                if (currentShooterIndex % width !== 0) currentShooterIndex -= 1
                break
            case 39:
                if (currentShooterIndex % width < width - 1) currentShooterIndex += 1
                break
        }
        squares[currentShooterIndex].classList.add('shooter')
    }

    document.addEventListener('keydown', moveShooter)

    // move invaders
    function moveInvaders() {
        const leftEdge = invaders[0] % width === 0
        const rightEdge = invaders[invaders.length - 1] % width === width - 1

        if ((leftEdge && direction === -1) || (rightEdge && direction === 1)) {
            direction = width
        } else if (direction === width) {
            // leftEdge ? direction = 1 : direction = -1
            if (leftEdge) direction = 1
            else direction = -1
        }

        for (let x = 0; x <= invaders.length -1; x++) {
            squares[invaders[x]].classList.remove('invader')
        }

        for (let x = 0; x <= invaders.length -1; x++) {
            invaders[x] += direction
        }

        for (let x = 0; x <= invaders.length -1; x++) {
            if (!invadersShotDown.includes(x)) {
                squares[invaders[x]].classList.add('invader')
            }
        }

        // game over
        if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
            resultDisplay.textContent = 'Game Over'
            squares[currentShooterIndex].classList.add('boom')
            clearInterval(invaderId)
        }

        for (let x = 0; x <= invaders.length -1; x++) {
            if (invaders[x] > (squares.length - (width - 1))) {
                resultDisplay.textContent = 'Game Over'
                clearInterval(invaderId)
            }
        }

        // win
        if (invadersShotDown.length === invaders.length) {
            resultDisplay.textContent = 'You Win'
            clearInterval(invaderId)
        }
    }

    invaderId = setInterval(moveInvaders, 500)

    // shoot
    function shoot(event) {
        let laserId
        let currentLaserIndex = currentShooterIndex

        function moveLaser() {
            squares[currentLaserIndex].classList.remove('laser')
            currentLaserIndex -= width
            squares[currentLaserIndex].classList.add('laser')

            // kill invader
            if (squares[currentLaserIndex].classList.contains('invader')) {
                squares[currentLaserIndex].classList.remove('invader')
                squares[currentLaserIndex].classList.remove('laser')
                squares[currentLaserIndex].classList.add('boom')

                setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 250)
                clearInterval(laserId)

                const killedInvaders = invaders.indexOf(currentLaserIndex)
                invadersShotDown.push(killedInvaders)
                result++
                resultDisplay.textContent = result
            }

            if (currentLaserIndex < width) {
                clearInterval(laserId)
                setTimeout(() => squares[currentLaserIndex].classList.remove('laser'), 100)
            }
        }

        switch (event.keyCode) {
            case 32:
                laserId = setInterval(moveLaser, 100)
                break
        }
    }

    document.addEventListener('keyup', shoot)
})