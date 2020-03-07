export default function createKeyboardListener (document) {
    const state = {
        observers: [],
        playerId: null
    }

    const registerPlayerId = playerId => {
        state.playerId = playerId
    }

    const subscribe = (observerFunction) => {
        state.observers.push(observerFunction)
    }

    const notifyAll = (command) => {
        console.log(`Notifying ${state.observers.length} observers.`)

        for (const observerFunction of state.observers) {
            observerFunction(command)
        }
    }

    const handleKeydown = (event) => {
        const keyPressed = event.key

        const command = {
            type: 'move-player',
            playerId: state.playerId,
            keyPressed
        }

        notifyAll(command)
    }

    document.addEventListener('keydown', handleKeydown)

    return {
        subscribe,
        registerPlayerId
    }
}