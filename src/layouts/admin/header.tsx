type HeaderProps = {
  className?: string;
};

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <div className={`flex items-center justify-between p-4 bg-white shadow ${className || ""}`}>
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search"
          className="border rounded-lg pl-10 pr-4 py-2 w-72 bg-gray-50 focus:ring-2 focus:ring-blue-600"
        />
        <span className="absolute left-3 top-2.5 text-gray-500">🔍</span>
      </div>

      {/* Right icons */}
      <div className="flex items-center space-x-4 text-xl">
        <button className="hover:bg-gray-100 p-2 rounded-full">🔔</button>
        <button className="hover:bg-gray-100 p-2 rounded-full">🌙</button>

        <img
          src="https://i.pravatar.cc/40"
          className="w-10 h-10 rounded-full border"
          alt="User avatar"
        />
      </div>
    </div>
  );
};

export default Header;
