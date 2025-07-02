import React, { useEffect, useState } from "react";
import Footer from "../Footer.jsx";
import { useNavigate } from "react-router-dom";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

function Explore() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const url = "http://localhost:8080/auth/display";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch users");
      const result = await response.json();
      setUsers(result.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  return (
     <div className="min-h-screen container flex flex-col justify-between bg-black">
      <div className="row mt-4">
        <Command className="rounded-lg border shadow-md md:min-w-[450px] bg-black text-white">
          <CommandInput placeholder="Search Account..." />
          <CommandList className="bg-black text-white">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions" className="bg-black text-white">
              {users.map((item) => (
                <CommandItem
                  key={item._id || item.id}
                  onSelect={() => navigate(`/account/${item._id || item.id}`)}
                  className="cursor-pointer"
                >
                  {item.username || item.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
      <Footer />
    </div>
  );
}

export default Explore;
