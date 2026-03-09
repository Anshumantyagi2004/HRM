import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { BaseUrl } from "../../BaseApi/Api";
import { Link, useNavigate } from "react-router-dom";

export default function SearchBar() {
    const [allUsers, setAllUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const navigate = useNavigate();

    useEffect(() => {
        async function fetchUsers() {
            try {
                const res = await fetch(BaseUrl + "users", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const data = await res.json();
                setAllUsers(data.data);
            } catch (error) {
                console.error("Fetch users error:", error);
            }
        }

        fetchUsers();
    }, []);

    // Filter users
    useEffect(() => {
        if (search.trim() === "") {
            setFilteredUsers([]);
        } else {
            const results = allUsers?.filter((user) =>
                user?.username?.toLowerCase()?.includes(search?.toLowerCase())
            );
            setFilteredUsers(results);
        }

        setSelectedIndex(-1);
    }, [search, allUsers]);

    // Handle keyboard navigation
    const handleKeyDown = (e) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((prev) =>
                prev < filteredUsers.length - 1 ? prev + 1 : prev
            );
        }

        if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        }

        if (e.key === "Enter") {
            if (selectedIndex >= 0) {
                const user = filteredUsers[selectedIndex];
                navigate(`/userProfile/${user._id}`);
                setSearch("");
            }
        }
    };

    return (
        <div className="relative w-full sm:w-64 mr-1 md:flex hidden">
            <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />

            {filteredUsers.length > 0 && (
                <div className="absolute top-11 left-0 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
                    {filteredUsers.map((user, index) => (
                        <Link
                            key={user?._id}
                            to={`/userProfile/${user?._id}`}
                            className={`block px-4 py-2 text-sm cursor-pointer ${
                                index === selectedIndex
                                    ? "bg-indigo-100"
                                    : "hover:bg-gray-100"
                            }`}
                            onClick={() => setSearch("")}
                        >
                            {user?.username}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}