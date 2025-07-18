import { useNavigate } from 'react-router-dom';

export const useSearch = () => {
  const navigate = useNavigate();

  const handleSearch = (term) => {
    console.log("Searching for:", term);
    // TODO: Implement actual search functionality
    // navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  return { handleSearch };
};