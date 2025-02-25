import React, { createContext, useEffect, useState } from 'react'

export const ButtonDisabilityDataContext = createContext()

const ButtonDisabilityContext = ({children}) => {
    const [disabled, setdisabled] = useState(() => {
        let savedDisabled = localStorage.getItem("disabled")
        return savedDisabled ? JSON.parse(savedDisabled) : false
    })

    useEffect(() => {
        localStorage.setItem("disabled",JSON.stringify(disabled))
    },[disabled])

    return (
        <ButtonDisabilityDataContext.Provider value={{disabled,setdisabled}}>
            {children}
        </ButtonDisabilityDataContext.Provider>
    )
}

export default ButtonDisabilityContext