import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = (input) => {
    if (typeof input === "string") {
      // Guest login
      const isGuest = input === "Guest";
      const guestId =
        isGuest && (localStorage.getItem("guestId") || generateGuestId());

      if (isGuest && !localStorage.getItem("guestId")) {
        localStorage.setItem("guestId", guestId);
      }

      const userObj = {
        name: isGuest ? `Guest_${guestId.slice(-5)}` : input,
        isGuest,
        guestId,
      };

      localStorage.setItem("user", JSON.stringify(userObj));
      setUser(userObj);
    } else if (typeof input === "object") {
      // Google user object
      const userObj = {
        name: input.name,
        email: input.email,
        picture: input.picture,
        isGuest: false,
      };

      localStorage.setItem("user", JSON.stringify(userObj));
      setUser(userObj);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);

    // Optional: clear Google login button from DOM
    const btn = document.getElementById("google-login-btn");
    if (btn) btn.innerHTML = ""; // force it to re-render on next mount
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}

function generateGuestId() {
  return "guest_" + crypto.randomUUID();
}
