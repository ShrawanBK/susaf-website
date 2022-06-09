import React, {
    useContext,
    useEffect,
} from 'react';

import {
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { ToastBoxContext } from '../../contexts/ToastBoxContext';

// images path

function DimensionQuestions() {
    const {
        toast,
        onCloseToast,
    } = useContext(ToastBoxContext);

    // close toast message if open
    useEffect(
        () => {
            if (toast) {
                onCloseToast();
            }
        },
        [onCloseToast, toast],
    );

    return (
        <Tabs isFitted variant="enclosed">
            <TabList mb="1em">
                <Tab>One</Tab>
                <Tab>Two</Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <p>one!</p>
                </TabPanel>
                <TabPanel>
                    <p>two!</p>
                </TabPanel>
            </TabPanels>
        </Tabs>
    );
}

export default DimensionQuestions;
