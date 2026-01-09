// src/lib/utils/logger.ts

export const createTimer = (context: string) => {
  const startTime = performance.now();
  console.log(
    `[${context}] Process Started at: ${new Date().toLocaleTimeString()}`
  );
  return {
    lap: (label: string) => {
      const lapTime = performance.now();
      const duration = (lapTime - startTime).toFixed(2);
      console.log(`[${context}] ${label}: ${duration}ms`);
    },
    stop: (finalLabel = "Total Execution") => {
      const endTime = performance.now();
      const duration = (endTime - startTime).toFixed(2);
      console.log(`[${context}] ✅ ${finalLabel}: ${duration}ms`);
      return duration;
    },
  };
};
