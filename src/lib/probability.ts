/**
 * Calculate probability weights for coffee assignment based on registration position.
 * Formula: Position 1 = 10%, Position 2 = 40%, Position 3+ = 40% + (position - 2) × 5%
 *
 * @param positions - Number of registered positions
 * @returns Array of weights for each position (1-indexed)
 */
export function calculateWeights(positions: number): number[] {
  if (positions === 0) return [];
  if (positions === 1) return [100];

  const weights: number[] = [];

  for (let pos = 1; pos <= positions; pos++) {
    if (pos === 1) {
      weights.push(10);
    } else if (pos === 2) {
      weights.push(40);
    } else {
      // Position 3+: 40% + (position - 2) × 5%
      weights.push(40 + (pos - 2) * 5);
    }
  }

  return weights;
}

/**
 * Normalize weights to probabilities (sum to 1.0)
 */
export function normalizeWeights(weights: number[]): number[] {
  const sum = weights.reduce((acc, w) => acc + w, 0);
  if (sum === 0) return weights;
  return weights.map((w) => w / sum);
}

/**
 * Select an index based on weighted probabilities using cumulative distribution
 *
 * @param probabilities - Array of probabilities (should sum to 1.0)
 * @returns Selected index (0-based)
 */
export function weightedRandomSelect(probabilities: number[]): number {
  if (probabilities.length === 0) {
    throw new Error("Cannot select from empty probabilities array");
  }

  const random = Math.random();
  let cumulative = 0;

  for (let i = 0; i < probabilities.length; i++) {
    cumulative += probabilities[i];
    if (random <= cumulative) {
      return i;
    }
  }

  // Fallback to last index (shouldn't happen if probabilities sum to 1.0)
  return probabilities.length - 1;
}

/**
 * Select a member index from registration order using probability distribution
 *
 * @param registrationCount - Number of registered members
 * @returns Selected index (0-based, representing position in registration order)
 */
export function selectMemberByProbability(
  registrationCount: number
): number {
  if (registrationCount === 0) {
    throw new Error("Cannot select from empty registrations");
  }

  const weights = calculateWeights(registrationCount);
  const probabilities = normalizeWeights(weights);
  return weightedRandomSelect(probabilities);
}

