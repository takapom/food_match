// Formatting utilities

export const format = {
  currency: (amount: number, locale = "ja-JP", currency = "JPY"): string => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(amount);
  },
  
  number: (value: number, locale = "ja-JP"): string => {
    return new Intl.NumberFormat(locale).format(value);
  },
  
  percentage: (value: number, decimals = 0): string => {
    return `${(value * 100).toFixed(decimals)}%`;
  },
  
  fileSize: (bytes: number): string => {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + " " + sizes[i];
  },
  
  truncate: (text: string, length: number, suffix = "..."): string => {
    if (text.length <= length) return text;
    return text.substring(0, length).trim() + suffix;
  },
  
  capitalize: (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  },
  
  slug: (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-")
      .trim();
  },
};