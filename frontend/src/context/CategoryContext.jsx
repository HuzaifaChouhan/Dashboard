import React, { createContext, useContext, useState } from 'react';

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
    const [category, setCategory] = useState(() => {
        return localStorage.getItem('dashboard_category') || 'ecommerce';
    });

    const changeCategory = (newCategory) => {
        setCategory(newCategory);
        localStorage.setItem('dashboard_category', newCategory);
    };

    return (
        <CategoryContext.Provider value={{ category, setCategory: changeCategory }}>
            {children}
        </CategoryContext.Provider>
    );
};

export const useCategory = () => useContext(CategoryContext);

export default CategoryContext;
