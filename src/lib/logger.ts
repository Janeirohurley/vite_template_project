/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/logger.ts
export const logger = {
    info: (...args: any[]) => console.log("ℹ️", ...args),
    warn: (...args: any[]) => console.warn("⚠️", ...args),
    error: (...args: any[]) => console.error("❌", ...args),
};
