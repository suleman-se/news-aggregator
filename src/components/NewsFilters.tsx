import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useNewsStore } from "../store/useNewsStore";
import { useDebounce } from "../hooks/useDebounce";

const categories: string[] = ['general', 'business', 'technology', 'sports', 'entertainment', 'science', 'health'];

export const NewsFilters: React.FC = () => {
  const { filters, setFilters, sources, toggleSource } = useNewsStore();
  const [searchTerm, setSearchTerm] = useState(filters.search);
  const debouncedSearch = useDebounce(searchTerm, 500);

  const [fromDate, setFromDate] = useState(filters.fromDate || "");
  const [toDate, setToDate] = useState(filters.toDate || "");

  useEffect(() => {
    setFilters({ search: debouncedSearch });
  }, [debouncedSearch, setFilters]);

  useEffect(() => {
    setFilters({ fromDate, toDate });
  }, [fromDate, toDate, setFilters]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="flex flex-col gap-4">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search articles..."
            className="w-full pl-10 pr-4 py-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Source Selection */}
        <div className="flex flex-wrap gap-3">
          {sources.map((source) => (
            <button key={source.id} onClick={() => toggleSource(source.id)} className={`px-3 py-1 rounded-full text-sm ${source.enabled ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
              {source.name}
            </button>
          ))}
        </div>

        {/* Category Selection */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button key={category} className={`px-3 py-1 rounded-full text-sm ${filters.categories.includes(category) ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"}`} 
              onClick={() => setFilters({ categories: filters.categories.includes(category) ? filters.categories.filter(c => c !== category) : [...filters.categories, category] })}>
              {category}
            </button>
          ))}
        </div>

        {/* Author Selection */}
        {/* <div className="relative">
          <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Filter by Author"
            className="w-full pl-10 pr-4 py-2 border rounded-md"
            value={filters.authors.join(", ")}
            onChange={(e) => setFilters({ authors: e.target.value.split(",").map(a => a.trim()) })}
          />
        </div> */}

        {/* Date Range Filter */}
        <div className="flex flex-wrap gap-4">
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="pl-10 pr-4 py-2 border rounded-md" />
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="pl-10 pr-4 py-2 border rounded-md" />
        </div>
      </div>
    </div>
  );
};
