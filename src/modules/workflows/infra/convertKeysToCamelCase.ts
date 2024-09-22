type AnyObject = { [key: string]: unknown };

export function convertKeysToCamelCase<T>(obj: T): T {
  if (Array.isArray(obj)) {
    return obj.map((item) => convertKeysToCamelCase(item)) as unknown as T;
  } else if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((acc, key) => {
      // Check if the key is "nodeType" and replace it with "type"
      const camelKey = key === "node_type" ? "type" : snakeToCamel(key);

      const value = (obj as AnyObject)[key];
      (acc as AnyObject)[camelKey] = convertKeysToCamelCase(value);
      return acc;
    }, {} as AnyObject) as T;
  }

  return obj;
}

function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}
