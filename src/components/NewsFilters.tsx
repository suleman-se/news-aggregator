import React, { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { useNewsStore } from "../store/useNewsStore";
import { useDebounce } from "../hooks/useDebounce";

const categories: string[] = ['general', 'business', 'technology', 'sports', 'entertainment', 'science', 'health'];

export const NewsFilters: React.FC = () => {
  const { filters, setFilters, sources, toggleSource } = useNewsStore();
  const [searchTerm, setSearchTerm] = useState(filters.search);
  const debouncedSearch = useDebounce(searchTerm, 500); 

  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      setFilters({ search: debouncedSearch });
    }
  }, [debouncedSearch, filters.search, setFilters]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search articles..."
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Update local state
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center">
            <Filter size={20} className="text-gray-500 mr-2" />
            <span className="font-medium">Sources:</span>
          </div>
          {sources.map((source) => (
            <button
              key={source.id}
              onClick={() => toggleSource(source.id)}
              className={`px-3 py-1 rounded-full text-sm ${source.enabled ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
                }`}
            >
              {source.name}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-3 py-1 rounded-full text-sm ${
              filters.categories.includes(category)
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() =>
              setFilters({
                categories: filters.categories.includes(category)
                  ? filters.categories.filter((c) => c !== category)
                  : [...filters.categories, category],
              })
            }
          >
            {category}
          </button>
        ))}
        </div>
      </div>
    </div>
  );
};
