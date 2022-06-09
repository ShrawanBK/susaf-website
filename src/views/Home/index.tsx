import React, {
    useContext,
    useEffect,
} from 'react';

import {
    Box,
    Divider,
    Flex,
    Heading,
    VStack,
    Image,
    Spacer,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { ToastBoxContext } from '../../contexts/ToastBoxContext';

// images path
import theDiagramPath from '../../resources/theDiagram.png';
import theProcessPath from '../../resources/theProcess.jpg';
import theQuestionsPath from '../../resources/theQuestions.png';
import theReportPath from '../../resources/theReport.jpg';
import theTemplatesPath from '../../resources/theTemplates.jpg';

import TitledImage from '../../components/TitledImage';
import PageTitle from '../../components/PageTitle';

function Home() {
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

    const navigate = useNavigate();

    return (
        <VStack
            align="stretch"
            spacing={4}
            p={4}
            role="main"
        >
            <PageTitle
                title="Overview: The SusA Framework Elements"
            />
            <Flex
                justifyContent="center"
                alignItems="center"
                alignContent="center"
                background="white"
            >
                <TitledImage
                    title="The Process"
                    imagePath={theProcessPath}
                    width="90%"
                />
            </Flex>
            <Flex>
                <TitledImage
                    title="The Questions"
                    imagePath={theQuestionsPath}
                />
                <Spacer />
                <TitledImage
                    title="The Templates"
                    imagePath={theTemplatesPath}
                />
            </Flex>
            <Flex>
                <TitledImage
                    title="The Report"
                    imagePath={theReportPath}
                    width="80%"
                />
                <TitledImage
                    title="The Diagram"
                    imagePath={theDiagramPath}
                />
            </Flex>
        </VStack>
    );
}

export default Home;
