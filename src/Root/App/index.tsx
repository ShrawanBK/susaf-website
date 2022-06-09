import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { Box, ChakraProvider, Flex, extendTheme } from '@chakra-ui/react';

import Fonts from './Fonts';

import Sidebar from '../../components/Sidebar';
import Home from '../../views/Home';
import SavedScans from '../../views/SavedScans';
import ScannedWebpageDetail from '../../views/ScannedWebpageDetail';

import ToastBoxContextProvider from '../../contexts/ToastBoxContext';
import SideBarContextProvider from '../../contexts/SideBarContext';
import Wip from '../../components/Wip';
import DimensionQuestions from '../../views/DimensionQuestions';

const theme = extendTheme({
    colors: {
        brand: {
            100: '#045981',
            200: '#045981',
            300: '#045981',
            400: '#045981',
            500: '#045981',
            600: '#045981',
            700: '#045981',
            800: '#045981',
            900: '#045981',
        },
        danger: '#B00D0D',
    },
    fonts: {
        heading: 'Roboto',
        body: 'Roboto',
    },
});

function App() {
    return (
        <ChakraProvider theme={theme}>
            <Fonts />
            <SideBarContextProvider>
                <ToastBoxContextProvider>
                    <Flex minHeight="100vh">
                        <Box borderRightWidth="1px" width="16vw" paddingTop={8}>
                            <Sidebar />
                        </Box>
                        <Box p={8} flex={1} background="#fbfcfd">
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/help" element={<Wip />} />
                                <Route path="/dimension_questions" element={<DimensionQuestions />} />
                                <Route path="/apply_susaf" element={<Wip />} />
                                <Route path="/appendix" element={<Wip />} />
                                <Route path="/about" element={<Wip />} />
                                <Route path="/saved_scans" element={<SavedScans />} />
                                <Route path="/saved_scans/:id" element={<ScannedWebpageDetail />} />
                            </Routes>
                        </Box>
                    </Flex>
                </ToastBoxContextProvider>
            </SideBarContextProvider>
        </ChakraProvider>
    );
}

export default App;
