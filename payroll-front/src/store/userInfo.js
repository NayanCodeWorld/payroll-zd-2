import axios from "axios";
import host from "../pages/utils";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export const UserInfoContext = createContext();

export const UserInfoProvider = ({ children }) => {
  const userId = JSON.parse(localStorage.getItem("userInfo"))?.id;
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await axios.get(`${host}/emp/emp_1/${userId}`);
      setUserData(response.data);
    };
    if (userId !== undefined) {
      fetchUserData();
    }
  }, []);
  return (
    <UserInfoContext.Provider value={{ userData }}>
      {children}
    </UserInfoContext.Provider>
  );
};

export const useUserData = () => useContext(UserInfoContext);
