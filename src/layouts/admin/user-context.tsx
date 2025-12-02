// context/UserContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { UserInfo } from "../../types/user-info";
import { API_URL_GET_LIST_USERS } from "../../constant/url";


interface UserContextType {
  users: UserInfo[];
  filteredUsers: UserInfo[];
  setFilteredUsers: (users: UserInfo[]) => void;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(API_URL_GET_LIST_USERS);
        const data = await res.json();
        setUsers(data.users);
        setFilteredUsers(data.users);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <UserContext.Provider value={{ users, filteredUsers, setFilteredUsers, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUserContext must be used inside UserProvider");
  return context;
};
