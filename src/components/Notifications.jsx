import React from 'react'
import { useSelector } from 'react-redux'

const Notifications = () => {
    let {allNotifications} = useSelector(state => state.notification)

    
    return (
        <div className='w-full h-screen text-white bg-[#101828] flex items-center justify-center'>
            <div className='px-3 py-2 bg-[#1E2939] rounded-lg w-fit'>
                {
                  Array.isArray(allNotifications) && allNotifications.length > 0 && allNotifications.map((notification,index) => (
                    <p>{notification?.message}</p>
                  ))
                }
            </div>
        </div>
    )
}

export default Notifications