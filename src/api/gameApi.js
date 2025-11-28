// Use environment variable or fallback to production backend
const API_URL = import.meta.env.VITE_API_URL || "https://smart-horses-backend.onrender.com";

/**
 * API service for Smart Horses game
 */
class GameAPI {
  /**
   * Create a new game with selected difficulty
   * @param {string} difficulty - 'beginner', 'amateur', or 'expert'
   * @returns {Promise<Object>} Initial game state
   */
  async createNewGame(difficulty = "beginner") {
    try {
      const response = await fetch(`${API_URL}/api/game/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ difficulty }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create new game");
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating new game:", error);
      if (error.message === "Failed to fetch") {
        throw new Error("Cannot connect to game server. Please check your internet connection.");
      }
      throw error;
    }
  }

  /**
   * Make a player move and get machine response
   * @param {Object} gameState - Current game state
   * @param {Array} move - [row, col] position to move
   * @returns {Promise<Object>} Updated game state with machine move
   */
  async makeMove(gameState, move) {
    try {
      const response = await fetch(`${API_URL}/api/game/move`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          game_state: gameState,
          move: move,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Invalid move");
      }

      return await response.json();
    } catch (error) {
      console.error("Error making move:", error);
      if (error.message === "Failed to fetch") {
        throw new Error("Cannot connect to game server. Please check your internet connection.");
      }
      throw error;
    }
  }

  /**
   * Get valid moves for a knight at given position
   * @param {Object} gameState - Current game state
   * @param {string} knight - 'white' or 'black'
   * @returns {Promise<Array>} Array of valid move positions
   */
  async getValidMoves(gameState, knight = "black") {
    try {
      const response = await fetch(`${API_URL}/api/game/valid-moves`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          game_state: gameState,
          knight: knight,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get valid moves");
      }

      const data = await response.json();
      // Return full response object (may include penalty_applied, game_state, etc.)
      return data;
    } catch (error) {
      console.error("Error getting valid moves:", error);
      throw error;
    }
  }

  /**
   * Get machine's next move (for testing/manual triggers)
   * @param {Object} gameState - Current game state
   * @returns {Promise<Object>} Machine's move and evaluation
   */
  async getMachineMove(gameState) {
    try {
      const response = await fetch(`${API_URL}/api/game/machine-move`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ game_state: gameState }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to get machine move");
      }

      return await response.json();
    } catch (error) {
      console.error("Error getting machine move:", error);
      throw error;
    }
  }

  /**
   * Health check endpoint
   * @returns {Promise<Object>} Server health status
   */
  async healthCheck() {
    try {
      const response = await fetch(`${API_URL}/health`);
      return await response.json();
    } catch (error) {
      console.error("Health check failed:", error);
      throw error;
    }
  }
}

export default new GameAPI();
