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
      const isGuest = input === "Guest";

      // Get existing guestId or create new
      let guestId = localStorage.getItem("guestId");
      if (!guestId) {
        guestId = generateGuestId();
        localStorage.setItem("guestId", guestId);
      }

      // Look up prior user in case of renamed guest
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const isSameGuest = storedUser?.guestId === guestId;

      const name =
        isSameGuest && storedUser?.name
          ? storedUser.name
          : `Guest_${guestId.slice(-5)}`;

      const userObj = {
        name,
        isGuest,
        guestId,
      };

      // Always persist current user object
      localStorage.setItem("user", JSON.stringify(userObj));
      setUser(userObj);
    } else if (typeof input === "object") {
      const userObj = {
        name: input.name,
        email: input.email,
        picture: input.picture,
        isGuest: false,
        guestId: input.email,
      };

      localStorage.setItem("user", JSON.stringify(userObj));
      setUser(userObj);
    }
  };

  const logout = () => {
    setUser(null);

    // Optional: clear Google login button from DOM
    const btn = document.getElementById("google-login-btn");
    if (btn) btn.innerHTML = ""; // force it to re-render on next mount
  };

  return (
    <UserContext.Provider value={{ user, login, logout, setUser }}>
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
