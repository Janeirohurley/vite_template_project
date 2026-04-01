/* eslint-disable @typescript-eslint/no-explicit-any */

export const toSnakeCase = (str: string): string => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

export const toCamelCase = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

export const transformKeysToSnakeCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map((item) => transformKeysToSnakeCase(item));
  }
  
  if (obj !== null && typeof obj === "object" && !(obj instanceof Date)) {
    return Object.keys(obj).reduce((acc, key) => {
      const snakeKey = toSnakeCase(key);
      acc[snakeKey] = transformKeysToSnakeCase(obj[key]);
      return acc;
    }, {} as any);
  }
  
  return obj;
};

export const transformKeysToCamelCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map((item) => transformKeysToCamelCase(item));
  }
  
  if (obj !== null && typeof obj === "object" && !(obj instanceof Date)) {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = toCamelCase(key);
      acc[camelKey] = transformKeysToCamelCase(obj[key]);
      return acc;
    }, {} as any);
  }
  
  return obj;
};
