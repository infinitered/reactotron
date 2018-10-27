import React from 'react'

function TabHeader({ children }: { children: any }) {
    return (
        <div className="flex bg-contentHeader m-3">
            {children}
        </div>
    )
}

export { TabHeader }
