//export const TOKEN = "accessToken";
export const TOKEN = "";


 export const getLoggedInUser = (): any | null => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };