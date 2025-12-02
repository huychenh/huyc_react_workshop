import Search from "./search";
import { useUserContext } from "./user-context";
import RightUserInfo from "./right-user-info";

const Header = () => {
  const { users, setFilteredUsers } = useUserContext();

  return (
    <div className="flex items-center justify-between p-4 bg-white shadow">
      <Search users={users} onSearch={setFilteredUsers} />
      <RightUserInfo />
    </div>
  );
};

export default Header;
