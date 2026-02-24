/**
 * CategoryContext.jsx — Global state for the selected dashboard category
 * 
 * Stores which category (ecommerce/education/healthcare) is active.
 * Persisted in localStorage so it survives page refreshes.
 * 
 * Usage in components:
 *   const { category, setCategory } = useCategory();
 */
import React, { createContext, useContext, useState } from 'react';

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
    // Initialize from localStorage or default to 'ecommerce'
    const [category, setCategory] = useState(() => {
        return localStorage.getItem('dashboard_category') || 'ecommerce';
    });

    const changeCategory = (newCategory) => {
        setCategory(newCategory);
        localStorage.setItem('dashboard_category', newCategory); // Persist selection
    };

    return (
        <CategoryContext.Provider value={{ category, setCategory: changeCategory }}>
            {children}
        </CategoryContext.Provider>
    );
};

// Custom hook for easy access in any component
export const useCategory = () => useContext(CategoryContext);

export default CategoryContext;
