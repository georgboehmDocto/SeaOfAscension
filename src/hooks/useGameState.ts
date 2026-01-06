import { loadFromLocalStorage } from "../engine/persistence"

export const useGameState = () => {
    const currentGameState = loadFromLocalStorage()

    return {
        gameState: currentGameState
    }
}