export function sanitizeObject<T>(obj: T, fieldsToRemove: string[]): T {
  function sanitize<T>(obj: T) {
    const sanitizedObj = { ...obj };
    fieldsToRemove.forEach((field) => {
      if (sanitizedObj.hasOwnProperty(field)) {
        delete sanitizedObj[field];
      }
    });
    return sanitizedObj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitize(item)) as unknown as T;
  } else if (typeof obj === "object" && obj !== null) {
    return sanitize(obj);
  }
}
