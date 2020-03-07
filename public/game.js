export default function createGame() {
    const state = {
        players: {},
        fruits: {},
        screen: {
            width: 25,
            height: 25
        }
    }

    const observers = []

    const start = () => {
        const frequency = 5000

        setInterval(addFruit, frequency)
    }

    const subscribe = (observerFunction) => {
        observers.push(observerFunction)
    }

    const notifyAll = (command) => {
        console.log(`Notifying ${observers.length} observers.`)

        for (const observerFunction of observers) {
            observerFunction(command)
        }
    }

    const setState = newState => {
        Object.assign(state, newState)
    }

    const addPlayer = (command) => {
        const playerId = command.playerId
        const playerX = 'playerX' in command ? command.playerX : Math.floor(Math.random() * state.screen.width)
        const playerY = 'playerY' in command ? command.playerY : Math.floor(Math.random() * state.screen.height)

        state.players[playerId] = {
            x: playerX,
            y: playerY
        }

        notifyAll({
            type: 'add-player',
            playerId: playerId,
            playerX: playerX,
            playerY: playerY
        })
    }

    const removePlayer = (command) => {
        const playerId = command.playerId

        delete state.players[playerId]
        notifyAll({
            type: 'remove-player',
            playerId: playerId
        })
    }

    const addFruit = (command) => {
        const fruitId = command ? command.fruitId : Math.floor(Math.random() * 1000000)
        const fruitX = command ? command.fruitX : Math.floor(Math.random() * state.screen.width)
        const fruitY = command ? command.fruitY : Math.floor(Math.random() * state.screen.height)

        state.fruits[fruitId] = {
            x: fruitX,
            y: fruitY
        }

        notifyAll({
            type: 'add-fruit',
            fruitId: fruitId,
            fruitX: fruitX,
            fruitY: fruitY
        })
    }

    const removeFruit = (command) => {
        const fruitId = command.fruitId

        delete state.fruits[fruitId]
        notifyAll({
            type: 'remove-fruit',
            fruitId: fruitId
        })
    }

    const movePlayer = (command) => {
        console.log(`Moving ${command.playerId} with ${command.keyPressed}`)
        notifyAll(command)

        const acceptedMoves = {
            ArrowUp(player) {
                console.log('Arrow Up');
                if (player.y - 1 >= 0) {
                    player.y = player.y - 1
                }
            },
            ArrowRight(player) {
                console.log('Arrow Right');
                if (player.x + 1 < state.screen.width) {
                    player.x = player.x + 1
                }
            },
            ArrowDown(player) {
                console.log('Arrow Down');
                if (player.y + 1 < state.screen.height) {
                    player.y = player.y + 1
                }
            },
            ArrowLeft(player) {
                console.log('Arrow Left');
                if (player.x - 1 >= 0) {
                    player.x = player.x - 1
                }
            }
        }

        const keyPressed = command.keyPressed;
        const playerId = command.playerId;
        const player = state.players[playerId];
        const moveFunction = acceptedMoves[keyPressed];
        if (player && moveFunction) {
            moveFunction(player);
            checkForFruitCollision(playerId);
        }
    }

    const checkForFruitCollision = (playerId) => {
        const player = state.players[playerId];
        for (const fruitId in state.fruits) {
            const fruit = state.fruits[fruitId];
            
            console.log(`Checking ${playerId} and ${fruitId}`);
            if (player.x === fruit.x && player.y === fruit.y) {
                console.log(`Collition between ${playerId} and ${fruitId}`);
                removeFruit({ fruitId: fruitId })
            }
        }
    }

    return  {
        addPlayer,
        removePlayer,
        addFruit,
        removeFruit,
        movePlayer,
        state,
        setState,
        subscribe,
        start
    }
}