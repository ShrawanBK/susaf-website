import React, { ReactElement, useContext } from 'react';

import { NavLink } from 'react-router-dom';
import {
    Container,
    Flex,
    Image,
    Spacer,
    Text,
    VStack,
} from '@chakra-ui/react';
import { AtSignIcon, InfoOutlineIcon, QuestionOutlineIcon, SearchIcon, StarIcon } from '@chakra-ui/icons';

import logoPath from '../../resources/logo.png';
import karlskronaLogoPath from '../../resources/karlskronaLogo.png';

import { SideBarContext } from '../../contexts/SideBarContext';

import './styles.css';

export interface SidebarMenu {
    path: string;
    title: string;
    icon: ReactElement;
    ariaLabel: string;
}

const sidebarMenus: SidebarMenu[] = [
    {
        path: '/',
        title: 'Home',
        icon: <SearchIcon />,
        ariaLabel: 'scan-website',
    },
    {
        path: '/dimension_questions',
        title: 'Dimension Questions',
        icon: <QuestionOutlineIcon />,
        ariaLabel: 'question',
    },
    {
        path: '/help',
        title: 'Help',
        icon: <InfoOutlineIcon />,
        ariaLabel: 'help',
    },
    {
        path: '/apply_susaf',
        title: 'Apply Susaf',
        icon: <AtSignIcon />,
        ariaLabel: 'apply-susaf',
    },
    {
        path: '/appendix',
        title: 'Appendix',
        icon: <InfoOutlineIcon />,
        ariaLabel: 'appendix',
    },
    {
        path: '/about',
        title: 'About',
        icon: <InfoOutlineIcon />,
        ariaLabel: 'about',
    },
];

function Sidebar() {
    const {
        sideBarNegativeTabIndex,
    } = useContext(SideBarContext);
    return (
        <VStack
            p={2}
            spacing={4}
            role="complementary"
        >
            <NavLink
                to="/"
                aria-label="Home Page"
                tabIndex={sideBarNegativeTabIndex ? -1 : undefined}
            >
                <Image
                    src={logoPath}
                    alt="logo"
                    role="img"
                />
            </NavLink>

            <span
                role="heading"
                aria-level={1}
                style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}
            >
                SUSAF
                <br />
                The Sustainability Awareness Framework
            </span>
            {sidebarMenus.map((menu) => (
                <Container
                    key={menu.title}
                    role="navigation"
                    width="100%"
                    display="flex"
                    id={menu.ariaLabel}
                    aria-label={menu.ariaLabel}
                    tabIndex={sideBarNegativeTabIndex ? -1 : undefined}
                >
                    <NavLink
                        to={menu.path}
                        className={({ isActive }) => (isActive ? 'nav-link-active' : 'nav-link')}
                        aria-labelledby={menu.ariaLabel}
                        tabIndex={sideBarNegativeTabIndex ? -1 : undefined}
                    >
                        <Flex
                            justifyContent="space-around"
                            alignItems="center"
                            tabIndex={sideBarNegativeTabIndex ? -1 : undefined}
                        >
                            {menu.icon}
                            <Text width="70%">
                                {menu.title}
                            </Text>
                        </Flex>
                    </NavLink>
                </Container>
            ))}
            <Spacer />
            <Image
                src={karlskronaLogoPath}
                alt="logo"
                role="img"
                width="80%"
            />
        </VStack>
    );
}

export default Sidebar;
