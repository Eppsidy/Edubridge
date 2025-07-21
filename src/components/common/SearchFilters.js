import React from 'react';
import { Search } from 'lucide-react';
import '../../styles/components/common/SearchFilters.css';

// Define courses array
const courses = [
  'All Courses',
  'Computer Science',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Engineering',
  'Business',
  'Psychology',
  'History',
  'Literature',
  'Economics',
  'Other'
];

const SearchFilters = ({ searchTerm, setSearchTerm, selectedCourse, setSelectedCourse }) => (
  <div className="search-filters">
    <div className="search-bar">
      <Search className="search-icon" size={20} />
      <input
        type="text"
        className="search-input"
        placeholder="Search by title, author, or ISBN..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
    <select 
      className="filter-select"
      value={selectedCourse}
      onChange={(e) => setSelectedCourse(e.target.value)}
    >
      {courses.map(course => (
        <option key={course} value={course}>{course}</option>
      ))}
    </select>
  </div>
);

export default SearchFilters;
