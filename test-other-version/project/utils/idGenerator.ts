/**
 * Generates a unique ID for a victim
 * Format: GEF-XXXX-XXXX where X is a hex digit
 */
export function generateVictimId(): string {
  // Random component of the ID
  const randomComponent = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
      .toUpperCase();
  };
  
  return `GEF-${randomComponent()}-${randomComponent()}`;
}