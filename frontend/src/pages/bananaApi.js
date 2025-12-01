/**
 * Banana Challenge API
 * Simulates the banana mini-game challenge for earning extra time
 */

export const BANANA_CHALLENGE_CONFIG = {
  difficulty: {
    easy: {
      successRate: 0.85,
      duration: 6000
    },
    medium: {
      successRate: 0.75,
      duration: 8000
    },
    hard: {
      successRate: 0.65,
      duration: 10000
    }
  }
};

/**
 * Play the banana challenge mini-game
 * In a real scenario, this would call an external API
 * For now, it simulates the challenge completion
 * 
 * @param {string} difficulty - 'easy', 'medium', or 'hard'
 * @returns {Promise<{success: boolean, timeBonus: number}>}
 */
export async function playBananaChallenge(difficulty = 'medium') {
  const config = BANANA_CHALLENGE_CONFIG.difficulty[difficulty] || BANANA_CHALLENGE_CONFIG.difficulty.medium;
  
  return new Promise((resolve) => {
    // Simulate challenge duration
    setTimeout(() => {
      // Determine success based on difficulty success rate
      const success = Math.random() < config.successRate;
      
      resolve({
        success,
        timeBonus: success ? getTimeBonus(difficulty) : 0,
        difficulty
      });
    }, config.duration);
  });
}

/**
 * Get time bonus for winning the banana challenge
 * @param {string} difficulty - 'easy', 'medium', or 'hard'
 * @returns {number} seconds to add
 */
export function getTimeBonus(difficulty) {
  const bonuses = {
    easy: 30,
    medium: 45,
    hard: 60
  };
  return bonuses[difficulty] || 30;
}

/**
 * Get banana challenge difficulty based on game difficulty
 * Banana challenge is slightly easier than the main game for fairness
 * @param {string} gameDifficulty - 'easy', 'medium', or 'hard'
 * @returns {string} banana challenge difficulty
 */
export function getBananaChallengeLevel(gameDifficulty) {
  // Map game difficulty to banana challenge level
  // Game hard -> banana medium, Game medium -> banana easy, etc.
  const mapping = {
    hard: 'medium',
    medium: 'easy',
    easy: 'easy'
  };
  return mapping[gameDifficulty] || 'medium';
}

/**
 * Format time remaining for display
 * @param {number} seconds - total seconds remaining
 * @returns {string} formatted time string (MM:SS)
 */
export function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}
