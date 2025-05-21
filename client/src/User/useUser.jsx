// useUser.js
import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = (name) => {
    const isGuest = name === "Guest";

    const guestId = isGuest
      ? localStorage.getItem("guestId") || generateGuestId()
      : null;

    if (isGuest && !localStorage.getItem("guestId")) {
      localStorage.setItem("guestId", guestId);
    }

    const userObj = {
      name: isGuest ? `Guest_${guestId.slice(-5)}` : name,
      isGuest,
      guestId,
    };
    localStorage.setItem("user", JSON.stringify(userObj));
    setUser(userObj);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
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
  return "guest_" + crypto.randomUUID(); // unique ID
}

export default {
  useUser,
};