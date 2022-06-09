import React, { createContext, useMemo } from 'react';
import { useBoolean } from '@chakra-ui/react';

interface ToastContextType {
    sideBarNegativeTabIndex: boolean;
    setSideBarNegativeTabIndex: {
        on: () => void;
        off: () => void;
        toggle: () => void;
    };
}

const initialSideBarContext: ToastContextType = {
    sideBarNegativeTabIndex: false,
    setSideBarNegativeTabIndex: {
        on: () => console.warn('sidebar on'),
        off: () => console.warn('sidebar off'),
        toggle: () => console.warn('sidebar toggle'),
    },
};

export const SideBarContext = createContext(initialSideBarContext);

function SideBarContextProvider({ children }: { children: React.ReactChild }) {
    const [sideBarNegativeTabIndex, setSideBarNegativeTabIndex] = useBoolean();

    const value = useMemo(
        () => ({
            sideBarNegativeTabIndex,
            setSideBarNegativeTabIndex,
        }),
        [setSideBarNegativeTabIndex, sideBarNegativeTabIndex],
    );
    return (
        <SideBarContext.Provider value={value}>
            {children}
        </SideBarContext.Provider>
    );
}

export default SideBarContextProvider;
