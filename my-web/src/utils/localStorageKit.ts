export type LocalStorageKey = "@library/token" | "@library/userId" | "@library/isAdmin" | "@library/customerId";

class LocalStorageKit {
  static set(key: LocalStorageKey, data: any) {
    let jsonData = typeof data === "string" ? data : JSON.stringify(data);
    if (typeof window !== "undefined") {
      localStorage.setItem(key, jsonData);
    }
  }

  static get(key: LocalStorageKey) {
    if (typeof window !== "undefined") {
      const jsonData = localStorage.getItem(key);
      try {
        if (!jsonData) {
          return null;
        }
        return JSON.parse(jsonData);
      } catch (error) {
        return jsonData;
      }
    }
    return null;
  }

  static remove(key: LocalStorageKey) {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    }
  }
}

export default LocalStorageKit;
