// Module-level mutable object shared between React and R3F useFrame loops.
// Avoids re-renders while keeping scroll state accessible inside the Canvas.
export const scrollStore = { heroProgress: 0 };
