import React, {
    ChangeEvent,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';

import {
    Box,
    Button,
    Checkbox,
    Divider,
    Flex,
    Heading,
    HStack,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
    useBoolean,
    VStack,
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import ScanForm from '../../components/forms/ScanForm';
import IssueStats from '../../components/IssueStats';
import IssueList from '../../components/IssueList';
import SelectField from '../../components/SelectField';
import Loading from '../../components/Loading';
import Info from '../../components/Info';
import ScanAndAuditIcon from '../../components/icons/ScanAndAudit';
import InvalidUrlIcon from '../../components/icons/InvalidUrl';
import SaveResultForm from '../../components/forms/SaveResult';
import ToastBox from '../../components/ToastBox';

import {
    IssueObject,
    ImpactStatistics,
    FoundStatistics,
    Criteria,
    Impact,
    BasicData,
    ScanWebsiteResponse,
} from '../../typings/webpage';

import { SaveResultFormData } from '../../typings/forms';

import apis from '../../utils/apis';
import { getCriteriaOptions, getImpactLevelOptions } from '../../utils/options';
import { formatDateTime, getBaseUrl } from '../../utils/common';
import { getFilteredIssues, getSelectedIssues, getTotalIssuesCount } from '../../utils/issues';

import { SideBarContext } from '../../contexts/SideBarContext';
import { ToastBoxContext } from '../../contexts/ToastBoxContext';

const scanBaseUrl = 'https://axe-playwright-nodejs.herokuapp.com';

function ScanWebsite() {
    const [processingUrl, setProcessingUrl] = useBoolean();
    const [webpageUrl, setWebpageUrl] = useState<string>('');
    const handleUrlChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => setWebpageUrl(e.target.value), [],
    );

    const [issues, setIssues] = useState<IssueObject[]>();
    const [impactStatistics, setImpactStatistics] = useState<ImpactStatistics[]>();
    const [foundStatistics, setFoundStatistics] = useState<FoundStatistics[]>();
    const [urlInvalidStatus, setUrlInvalidStatus] = useBoolean();
    const [selectedIssueIds, setSelectedIssueIds] = useState<IssueObject['issueId'][]>();

    const [modalOpened, setModalOpened] = useBoolean();

    // handle control of Checkbox correspoding to "Select Issue"
    const [allIdsSelected, setAllIdsSelected] = useBoolean();

    const [filterableImpactLevel, setFilterableImpactLevel] = useState<Impact>();
    const [filterableCriteria, setFilterableCriteria] = useState<Criteria['criteriaId']>();

    const [basicData, setBasicData] = useState<BasicData>();

    const issuesShown = !urlInvalidStatus && issues && !processingUrl;
    const onScanWebpage = useCallback(
        async () => {
            try {
                setProcessingUrl.on();
                setUrlInvalidStatus.off();
                const response = await axios.get(`${scanBaseUrl}/scan?url=${webpageUrl}`);
                const dataResponse: ScanWebsiteResponse = response.data;

                if (!dataResponse) {
                    setProcessingUrl.off();
                    return;
                }

                setIssues(dataResponse.issues);
                setImpactStatistics(dataResponse.impactStatistics);
                setFoundStatistics(dataResponse.foundStatistics);
                setSelectedIssueIds(undefined);
                setBasicData({
                    scantime: dataResponse.scanTime,
                    url: dataResponse.url,
                    webpageName: dataResponse.webpageName,
                    websiteName: getBaseUrl(dataResponse.url),
                });
                const ids = dataResponse.issues.map((issue) => issue.name);
                setSelectedIssueIds(ids);
                setAllIdsSelected.on();

                setUrlInvalidStatus.off();
                setProcessingUrl.off();
            } catch (error) {
                // TODO: HANDLE THIS ERROR

                setProcessingUrl.off();
                setUrlInvalidStatus.on();
            }
        },
        [setAllIdsSelected, setProcessingUrl, setUrlInvalidStatus, webpageUrl],
    );

    const onSelectFilterableImpactLevel = useCallback(
        (value: string) => {
            setFilterableImpactLevel(
                value === '' ? undefined : value as Impact,
            );
            if (filterableCriteria) {
                setFilterableCriteria(undefined);
            }
        },
        [filterableCriteria],
    );

    const onSelectFilterableCriteria = useCallback(
        (value: string) => setFilterableCriteria(value === '' ? undefined : value),
        [],
    );

    const filteredIssues = useMemo(
        () => getFilteredIssues(
            issues,
            filterableImpactLevel,
            filterableCriteria,
        ),
        [issues, filterableCriteria, filterableImpactLevel],
    );

    const totalIssuesCount = useMemo(
        () => getTotalIssuesCount(impactStatistics),
        [impactStatistics],
    );

    const onSelectAllIssues = useCallback(
        () => {
            if (!filteredIssues || filteredIssues.length <= 0) {
                return;
            }
            // filteredIssues
            if (!selectedIssueIds || selectedIssueIds.length < filteredIssues.length) {
                // const ids = impactLevelOptions.map((i) => i.value);
                const ids = [...filteredIssues ?? []].map((issue) => issue.name);
                setSelectedIssueIds(ids);
                setAllIdsSelected.on();
            } else {
                setSelectedIssueIds(undefined);
                setAllIdsSelected.off();
            }
        },
        [filteredIssues, selectedIssueIds, setAllIdsSelected],
    );

    // NOTE - name used as ids as they are found to be unique
    const onUpdateSelectedIssue = useCallback(
        (id: IssueObject['issueId']) => {
            // Add first checkbox
            if (!selectedIssueIds || selectedIssueIds.length <= 0) {
                setSelectedIssueIds([id]);
                return;
            }

            const tmpSelectedIssueIds = [...selectedIssueIds];

            // check if the id exists
            const selectedIdIndex = tmpSelectedIssueIds.findIndex((item) => item === id);

            if (selectedIdIndex < 0) {
                // if id does not exist, add the id to check the checkbox
                setSelectedIssueIds([...tmpSelectedIssueIds, id]);
                if (!filteredIssues) {
                    return;
                }
                if ([...tmpSelectedIssueIds, id].length === [...filteredIssues].length) {
                    // mark the "all checkbox" if all issues selected individually
                    setAllIdsSelected.on();
                }
                return;
            }

            // if id exist, remove the id to uncheck the checkbox
            setSelectedIssueIds(tmpSelectedIssueIds.filter((item) => item !== id));
            setAllIdsSelected.off();
        },
        [filteredIssues, selectedIssueIds, setAllIdsSelected],
    );

    const selectedIssues = useMemo(
        () => getSelectedIssues(filteredIssues, selectedIssueIds),
        [filteredIssues, selectedIssueIds],
    );

    const impactLevelOptions = useMemo(
        () => getImpactLevelOptions(issues),
        [issues],
    );

    const criteriaOptions = useMemo(
        () => getCriteriaOptions(issues, filterableImpactLevel),
        [issues, filterableImpactLevel],
    );

    const {
        toast,
        showToast,
        onCloseToast,
    } = useContext(ToastBoxContext);

    const {
        setSideBarNegativeTabIndex,
    } = useContext(SideBarContext);

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

    const onRedirectToDetailPage = useCallback(
        (id: string) => {
            onCloseToast();
            navigate(`/saved_scans/${id}`);
        },
        [onCloseToast, navigate],
    );

    const onSaveResult = useCallback(
        async (formData: SaveResultFormData) => {
            try {
                if (!basicData) {
                    return;
                }
                const requestBody = {
                    name: formData.webpageName,
                    url: basicData.url,
                    scantime: basicData.scantime,
                    note: formData.note,
                    website: {
                        name: getBaseUrl(basicData.url),
                        url: getBaseUrl(basicData.url),
                    },
                    issues: selectedIssues,
                };

                const response = await apis.post(
                    'webpage', requestBody,
                );

                if (response.status === 200) {
                    const { id } = await response.data;
                    setIssues(undefined);
                    setImpactStatistics(undefined);
                    setFoundStatistics(undefined);
                    setSelectedIssueIds(undefined);
                    setBasicData(undefined);
                    setUrlInvalidStatus.off();
                    setAllIdsSelected.off();
                    setProcessingUrl.off();
                    setWebpageUrl('');
                    const successToastComponent = toast && toast({
                        status: 'success',
                        isClosable: true,
                        variant: 'subtle',
                        id: undefined,
                        duration: null,
                        position: 'top',
                        render: () => (
                            <ToastBox
                                onCloseToast={onCloseToast}
                                title="Webpage added successfully"
                                description="Your webpage has been added successfully"
                                status="success"
                                actionableView={(
                                    <Button
                                        type="button"
                                        h={10}
                                        letterSpacing={1}
                                        colorScheme="white"
                                        background="white.700"
                                        onClick={() => onRedirectToDetailPage(id)}
                                        variant="link"
                                        color="white"
                                    >
                                        Click here to go see the detail!
                                    </Button>
                                )}
                            />
                        ),
                    });
                    showToast(successToastComponent);
                }
            } catch (error) {
                // TODO: HANDLE THIS ERROR

                const failureToastComponent = toast && toast({
                    status: 'error',
                    isClosable: true,
                    variant: 'subtle',
                    id: undefined,
                    duration: null,
                    position: 'top',
                    render: () => (
                        <ToastBox
                            onCloseToast={onCloseToast}
                            title="Error adding"
                            description="Could not add. Try again"
                            status="error"
                        />
                    ),
                });

                showToast(failureToastComponent);
            }
        },
        [
            basicData,
            onCloseToast,
            onRedirectToDetailPage,
            setAllIdsSelected,
            setProcessingUrl,
            setUrlInvalidStatus,
            toast,
            showToast,
            selectedIssues,
        ],
    );

    const scannedTime = useMemo(
        () => {
            const dateString = basicData ? basicData.scantime : new Date().toISOString();
            return formatDateTime(dateString);
        },
        [basicData],
    );

    const onOpenSaveResultModal = useCallback(
        () => {
            setSideBarNegativeTabIndex.on();
            setModalOpened.on();
        }, [setModalOpened, setSideBarNegativeTabIndex],
    );

    const onCloseSaveResultModal = useCallback(
        () => {
            setSideBarNegativeTabIndex.off();
            setModalOpened.off();
        }, [setModalOpened, setSideBarNegativeTabIndex],
    );

    return (
        <VStack
            align="stretch"
            spacing={8}
            p={4}
            role="main"
        >
            <Flex>
                <Heading
                    as="h1"
                    size="lg"
                    role="heading"
                >
                    Scan Website
                    <Divider />
                </Heading>
            </Flex>
            <Box
                width="60%"
                marginTop="1vh"
            >
                <ScanForm
                    processingUrl={processingUrl}
                    onScanWebpage={onScanWebpage}
                    handleUrlChange={handleUrlChange}
                    url={webpageUrl}
                    negativeTabIndex={modalOpened}
                />
            </Box>
            <Box width="60%">
                {!processingUrl && !issues && !urlInvalidStatus && (
                    <Info
                        title="Scan & Audit Webpage"
                        message="Get accessibility test result of your webpage by inputting URL and scan it."
                        icon={<ScanAndAuditIcon />}
                    />
                )}
                {processingUrl && <Loading message="Waiting for Result" />}
                {urlInvalidStatus && !processingUrl && (
                    <Info
                        title="Something went wrong"
                        message="There was something wrong while processing the webpage. Try again with different url."
                        icon={<InvalidUrlIcon />}
                    />
                )}
            </Box>

            {issuesShown && (
                <Box
                    background="white"
                    p={8}
                    borderWidth="1px"
                    borderRadius="md"
                >
                    <Box
                        display="flex"
                        justifyContent="space-between"
                    >
                        <VStack alignItems="baseline">
                            <Heading
                                fontWeight="semibold"
                                letterSpacing="wide"
                                fontSize="2xl"
                                role="heading"
                                as="h2"
                            >
                                Result
                            </Heading>
                            <Text>
                                {`Scanned on ${scannedTime}`}
                            </Text>
                        </VStack>
                        <Button
                            type="button"
                            colorScheme="brand"
                            letterSpacing={1}
                            onClick={onOpenSaveResultModal}
                            tabIndex={modalOpened ? -1 : undefined}
                            py={4}
                        >
                            SAVE
                        </Button>
                    </Box>
                    <Modal
                        isOpen={modalOpened}
                        onClose={onCloseSaveResultModal}
                        closeOnOverlayClick={false}
                        isCentered
                    >
                        <ModalOverlay role="dialog" />
                        <ModalContent py={2}>
                            <ModalHeader as="h1">
                                Save Result
                            </ModalHeader>
                            <ModalCloseButton />
                            <ModalBody role="main">
                                <SaveResultForm
                                    onSaveAction={onSaveResult}
                                    basicData={basicData}
                                    onCloseAction={onCloseSaveResultModal}
                                />
                            </ModalBody>
                        </ModalContent>
                    </Modal>
                    <Box
                        width="80%"
                        marginTop={8}
                    >
                        <IssueStats
                            impactStatistics={impactStatistics}
                            foundStatistics={foundStatistics}
                            totalIssuesCount={totalIssuesCount}
                        />
                    </Box>
                    <HStack
                        justifyContent="flex-start"
                        marginTop={8}
                    >
                        <Checkbox
                            aria-label="Select all issues"
                            maxWidth="20px"
                            margin={4}
                            borderColor="#045981"
                            onChange={onSelectAllIssues}
                            isChecked={allIdsSelected}
                            tabIndex={modalOpened ? -1 : undefined}
                        />
                        <HStack width="80%">
                            <SelectField
                                options={impactLevelOptions}
                                placeholder={`All Issues (${totalIssuesCount})`}
                                label="Select Issues"
                                onSelectOption={onSelectFilterableImpactLevel}
                                negativeTabIndex={modalOpened}
                            />
                            <SelectField
                                options={criteriaOptions}
                                placeholder="All Criteria / Tags"
                                label="Select Criteria / Tag"
                                onSelectOption={onSelectFilterableCriteria}
                                negativeTabIndex={modalOpened}
                            />
                        </HStack>
                    </HStack>
                    <Box marginTop={4}>
                        <IssueList
                            issueList={filteredIssues}
                            selectedIssueIds={selectedIssueIds}
                            onUpdateSelectedIssue={onUpdateSelectedIssue}
                            negativeTabIndex={modalOpened}
                        />
                    </Box>
                </Box>
            )}
        </VStack>
    );
}

export default ScanWebsite;
