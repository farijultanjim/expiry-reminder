import Image from "next/image";
import { useState } from "react";

const Search = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 bg-red-200 p-2 rounded-md w-full max-w-md border">
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="Search by Domain name, Customer name, or Email"
          className="w-full border-none focus:outline-none placeholder:text-neutral-500 px-2 bg-transparent"
        />
        {/* <Image src="/search.png" alt="search" width={25} height={14} /> */}
      </div>
    </div>
  );
};

export default Search;
