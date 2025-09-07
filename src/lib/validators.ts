// Validation utilities

export const validators = {
  email: (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },
  
  password: (value: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (value.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    if (!/[A-Z]/.test(value)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(value)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/[0-9]/.test(value)) {
      errors.push("Password must contain at least one number");
    }
    
    return {
      valid: errors.length === 0,
      errors,
    };
  },
  
  required: (value: unknown): boolean => {
    if (value === null || value === undefined) return false;
    if (typeof value === "string") return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    return true;
  },
  
  minLength: (value: string, min: number): boolean => {
    return value.length >= min;
  },
  
  maxLength: (value: string, max: number): boolean => {
    return value.length <= max;
  },
  
  match: (value1: string, value2: string): boolean => {
    return value1 === value2;
  },
};