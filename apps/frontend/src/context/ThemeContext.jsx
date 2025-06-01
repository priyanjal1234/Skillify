import React, { createContext, useState } from 'react'

export const ThemeDataContext = createContext()

const ThemeContext = ({children}) => {
    const [darkMode, setDarkMode] = useState(true)
    return (
        <ThemeDataContext.Provider value={{darkMode,setDarkMode}}>
            {children}
        </ThemeDataContext.Provider>
    )
}

export default ThemeContext