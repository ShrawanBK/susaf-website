import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
    Box,
    Button,
    Divider,
    Heading,
    HStack,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Spacer,
    Text,
    useBoolean,
    VStack,
} from '@chakra-ui/react';
import { useParams, Link } from 'react-router-dom';
import axios, { AxiosError } from 'axios';

import IssueStats from '../../components/IssueStats';
import SelectField from '../../components/SelectField';

import IssueForm from '../../components/forms/IssueForm';

import EditableIssueList from '../../components/EditableIssueList';
import NextArrowIcon from '../../components/icons/NextArrow';
import DeleteConfirmationDialog from '../../components/DeleteConfirmationDialog';
import ToastBox from '../../components/ToastBox';
import Loading from '../../components/Loading';

import {
    IssueObject,
    ImpactStatistics,
    FoundStatistics,
    Criteria,
    Impact,
    BasicData,
    DeletableOccurenceData,
    ScanWebsiteResponse,
} from '../../typings/webpage';
import { IssueFormData } from '../../typings/forms';
import apis from '../../utils/apis';
import { getCriteriaOptions, getImpactLevelOptions } from '../../utils/options';
import { formatDateTime, getBaseUrl } from '../../utils/common';
import { getFilteredIssues, getTotalIssuesCount } from '../../utils/issues';

import { SideBarContext } from '../../contexts/SideBarContext';
import { ToastBoxContext } from '../../contexts/ToastBoxContext';
import Info from '../../components/Info';
import InvalidUrlIcon from '../../components/icons/InvalidUrl';

interface ResponseError {
    message: string;
    status: 'error';
}

function ScannedWebsiteDetail() {
    const { id } = useParams();

    const [processingUrl, setProcessingUrl] = useBoolean();
    const [issues, setIssues] = useState<IssueObject[]>();
    const [impactStatistics, setImpactStatistics] = useState<ImpactStatistics[]>();
    const [foundStatistics, setFoundStatistics] = useState<FoundStatistics[]>();

    const [modalOpened, setModalOpened] = useBoolean();

    const [filterableImpactLevel, setFilterableImpactLevel] = useState<Impact>();
    const [filterableCriteria, setFilterableCriteria] = useState<Criteria['criteriaId']>();

    const [basicData, setBasicData] = useState<BasicData>();

    const issuesShown = issues && !processingUrl;

    const [responseError, setResponseError] = useState<ResponseError>();

    const filteredIssues = useMemo(
        () => getFilteredIssues(
            issues,
            filterableImpactLevel,
            filterableCriteria,
        ),
        [issues, filterableCriteria, filterableImpactLevel],
    );

    const impactLevelOptions = useMemo(
        () => getImpactLevelOptions(issues),
        [issues],
    );

    const criteriaOptions = useMemo(
        () => getCriteriaOptions(issues, filterableImpactLevel),
        [issues, filterableImpactLevel],
    );

    useEffect(() => {
        const getWebpageDetail = async () => {
            try {
                setProcessingUrl.on();
                const response = await apis.get(`/webpage/${id}`);
                const dataResponse: ScanWebsiteResponse = response.data;
                if (!dataResponse) {
                    setProcessingUrl.off();
                    return;
                }
                setIssues(dataResponse.issues);
                setImpactStatistics(dataResponse.impactStatistics);
                setFoundStatistics(dataResponse.foundStatistics);
                setBasicData({
                    scantime: dataResponse.scanTime,
                    url: dataResponse.url,
                    webpageName: dataResponse.webpageName,
                    websiteName: getBaseUrl(dataResponse.url),
                });
                setProcessingUrl.off();
                setResponseError(undefined);
            } catch (error) {
                if (!axios.isAxiosError(error)) {
                    return;
                }
                const axiosError = error as AxiosError;
                const dataError = axiosError?.response?.data as ResponseError;
                setResponseError(dataError);
                setProcessingUrl.off();
            }
        };
        getWebpageDetail();
    }, [id, setProcessingUrl]);

    const [criteriaListForForm, setCriteriaListForForm] = useState<Criteria[]>();

    useEffect(() => {
        const getCriteria = async () => {
            try {
                const response = await apis.get('/criteria');
                if (response.status === 200) {
                    const criteriaList: Criteria[] = await response.data;
                    setCriteriaListForForm(criteriaList);
                }
            } catch (error) {
                // TODO: HANDLE THIS ERROR
                setCriteriaListForForm([]);
            }
        };
        getCriteria();
    }, []);

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

    const totalIssuesCount = useMemo(
        () => getTotalIssuesCount(impactStatistics),
        [impactStatistics],
    );

    const [deletableOccurenceData, setDeletableOccurenceData] = useState<DeletableOccurenceData>();

    const {
        toast,
        showToast,
        onCloseToast,
    } = useContext(ToastBoxContext);

    const {
        sideBarNegativeTabIndex,
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

    const onCancelDeleteOccurence = useCallback(
        () => {
            setDeletableOccurenceData(undefined);
            setSideBarNegativeTabIndex.off();
        },
        [setSideBarNegativeTabIndex],
    );

    const onSetDeletableOccurenceData = useCallback(
        (data: DeletableOccurenceData) => {
            setDeletableOccurenceData(data);
            setSideBarNegativeTabIndex.on();
        },
        [setSideBarNegativeTabIndex],
    );

    const onDeleteOccurence = useCallback(
        async () => {
            if (!deletableOccurenceData) {
                return;
            }
            try {
                console.log('eta aayo');
                const apiUrl = `/occurence?webpageId=${id}&issueId=${deletableOccurenceData.issueId}&occurenceId=${deletableOccurenceData.occurenceId}`;
                const response = await apis.delete(apiUrl);
                const deleteResponse = await response.data;
                if (deleteResponse === 'successfully deleted') {
                    setIssues((prevIssues) => {
                        if (!prevIssues || prevIssues.length <= 0) {
                            return undefined;
                        }
                        const tmpIssueList = [...prevIssues];
                        const updatedIssueList = tmpIssueList.map((issueItem) => {
                            if (issueItem.issueId !== deletableOccurenceData.issueId) {
                                return issueItem;
                            }
                            return {
                                ...issueItem,
                                occurences: issueItem.occurences.filter(
                                    (o) => o.occurenceId !== deletableOccurenceData.occurenceId,
                                ),
                            };
                        });
                        return updatedIssueList;
                    });
                    // setImpactStatistics((prevSta));
                    setImpactStatistics((prevStat) => {
                        if (!prevStat) {
                            return undefined;
                        }
                        return prevStat.map((stat) => {
                            if (stat.impact === deletableOccurenceData.impact) {
                                return {
                                    ...stat,
                                    count: stat.count - 1,
                                };
                            }
                            return stat;
                        });
                    });

                    // NOTE - Update the manual count
                    setFoundStatistics((prevStat) => {
                        if (!prevStat) {
                            return undefined;
                        }
                        return prevStat.map((stat) => {
                            if (stat.found === 'needsReview' && deletableOccurenceData.needsReview) {
                                return {
                                    ...stat,
                                    count: stat.count - 1,
                                };
                            }
                            if (stat.found !== deletableOccurenceData.found) {
                                return stat;
                            }
                            return {
                                ...stat,
                                count: stat.count - 1,
                            };
                        });
                    });

                    const toastComponent = toast && toast({
                        status: 'success',
                        isClosable: true,
                        variant: 'subtle',
                        id: deletableOccurenceData.occurenceId,
                        duration: null,
                        position: 'top',
                        render: () => (
                            <ToastBox
                                onCloseToast={onCloseToast}
                                title="Delete Success"
                                description={`Issue - ${deletableOccurenceData.issueName} deleted successfully`}
                                status="success"
                            />
                        ),
                    });
                    showToast(toastComponent);
                    setDeletableOccurenceData(undefined);
                }
            } catch (onDeleteOccurenceError) {
                // TODO: HANDLE THIS ERROR
                console.warn({ onDeleteOccurenceError });
            }
        },
        [deletableOccurenceData, id, onCloseToast, showToast, toast],
    );

    const onDeleteIssue = useCallback(
        async () => {
            try {
                if (!deletableOccurenceData) {
                    return;
                }

                const apiUrl = `/issue?issueId=${deletableOccurenceData.issueId}&webpageId=${id}`;
                const response = await apis.delete(apiUrl);
                const deleteResponse = await response.data;

                if (deleteResponse === 'successfully deleted') {
                    setIssues((prevIssues) => {
                        if (!prevIssues) {
                            return undefined;
                        }
                        return [...prevIssues].filter(
                            (issue) => issue.issueId !== deletableOccurenceData.issueId,
                        );
                    });
                }
                const toastComponent = toast && toast({
                    status: 'success',
                    isClosable: true,
                    variant: 'subtle',
                    id: deletableOccurenceData.occurenceId,
                    duration: null,
                    position: 'top',
                    render: () => (
                        <ToastBox
                            onCloseToast={onCloseToast}
                            title="Delete Success"
                            description={`Issue - ${deletableOccurenceData.issueName} deleted successfully`}
                            status="success"
                        />
                    ),
                });
                showToast(toastComponent);
                setDeletableOccurenceData(undefined);
            } catch (onDeleteOccurenceError) {
                // TODO: HANDLE THIS ERROR
                console.warn({ onDeleteOccurenceError });
            }
        },
        [deletableOccurenceData, id, onCloseToast, showToast, toast],
    );

    const openDeleteOccurenceDialog = !!deletableOccurenceData;

    const [editableIssue, setEditableIssue] = useState<IssueObject>();

    const onOpenIssueFormModal = useCallback(
        () => {
            setModalOpened.on();
            setSideBarNegativeTabIndex.on();
        },
        [setModalOpened, setSideBarNegativeTabIndex],
    );
    const onSetEditableIssue = useCallback(
        (issueItem: IssueObject) => {
            setEditableIssue(issueItem);
            onOpenIssueFormModal();
        },
        [onOpenIssueFormModal],
    );

    const onResetEditableIssue = useCallback(
        () => {
            setEditableIssue(undefined);
            setModalOpened.off();
            setSideBarNegativeTabIndex.off();
        },
        [setModalOpened, setSideBarNegativeTabIndex],
    );

    const onSaveIssue = useCallback(
        async (formData: IssueFormData) => {
            try {
                const requestBody = formData;
                const apiUrl = `issue?webpageId=${id}`;
                const response = await apis.post(apiUrl, requestBody);
                if (response.status === 200) {
                    const issueData: IssueObject = response.data;
                    setIssues((prevIssues) => {
                        if (!prevIssues || prevIssues.length <= 0) {
                            return [issueData];
                        }
                        return [...prevIssues, issueData];
                    });
                    setModalOpened.off();

                    // NOTE - Update the manual count
                    setFoundStatistics((prevStat) => {
                        if (!prevStat) {
                            return undefined;
                        }
                        return prevStat.map((stat) => {
                            if (stat.found === 'needsReview' && formData.occurences[0].needsReview) {
                                return {
                                    ...stat,
                                    count: stat.count + 1,
                                };
                            }
                            if (stat.found !== 'manual') {
                                return stat;
                            }

                            return {
                                ...stat,
                                count: stat.count + 1,
                            };
                        });
                    });

                    // NOTE - Update the impact statistics
                    setImpactStatistics((prevStat) => {
                        if (!prevStat) {
                            return undefined;
                        }
                        return prevStat.map((stat) => {
                            if (stat.impact === issueData.impact) {
                                return {
                                    ...stat,
                                    count: stat.count + 1,
                                };
                            }
                            return stat;
                        });
                    });

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
                                title="Issue added successfully"
                                description="Your issue has been added successfully"
                                status="success"
                            />
                        ),
                    });
                    showToast(successToastComponent);
                }
            } catch (error) {
                // TODO: HANDLE THIS ERROR

                if (!axios.isAxiosError(error)) {
                    return;
                }
                const axiosError = error as AxiosError;
                const dataError = axiosError?.response?.data;
                console.log({ dataError });
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
        [id, setModalOpened, toast, showToast, onCloseToast],
    );

    const onUpdateIssue = useCallback(
        async (formData: IssueFormData) => {
            try {
                if (!editableIssue) {
                    return;
                }
                const { occurenceId } = editableIssue.occurences[0];
                // FIXME - pass only data that was modified
                const requestBody = formData;
                const apiUrl = `issue?webpageId=${id}&issueId=${editableIssue.issueId}&occurenceId=${occurenceId}`;
                const updateResponse = await apis.put(apiUrl, requestBody);

                if (updateResponse.status === 200) {
                    const updatedIssueData: IssueObject = updateResponse.data;
                    setIssues((prevIssues) => {
                        if (!prevIssues || prevIssues.length <= 0) {
                            return [updatedIssueData];
                        }
                        const tmpIssueList = [...prevIssues];
                        const updatedIssueList = tmpIssueList.map(
                            (issueItem) => (issueItem.issueId === updatedIssueData.issueId
                                ? updatedIssueData : issueItem),
                        );
                        return updatedIssueList;
                    });

                    setFoundStatistics((prevStat) => {
                        if (!prevStat) {
                            return undefined;
                        }
                        return prevStat.map((stat) => {
                            if (stat.found !== 'needsReview') {
                                return stat;
                            }
                            // NOTE: MAKE IT BETTER
                            const prevNeedsReview = editableIssue.occurences[0].needsReview;
                            const responseNeedsReview = updatedIssueData.occurences[0].needsReview;
                            if (prevNeedsReview === responseNeedsReview) {
                                return stat;
                            }
                            return {
                                ...stat,
                                count: responseNeedsReview ? stat.count + 1 : stat.count - 1,
                            };
                        });
                    });
                    setModalOpened.off();

                    setEditableIssue(undefined);
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
                                title="Issue updated successfully"
                                description="Your issue has been updated successfully"
                                status="success"
                            />
                        ),
                    });
                    showToast(successToastComponent);
                    // setEditableIssue(undefined);
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
        [editableIssue, id, setModalOpened, toast, showToast, onCloseToast],
    );

    const onSaveAction = useMemo(
        () => (editableIssue ? onUpdateIssue : onSaveIssue),
        [editableIssue, onSaveIssue, onUpdateIssue],
    );

    const scannedTime = useMemo(
        () => {
            const dateString = basicData ? basicData.scantime : new Date().toISOString();
            return formatDateTime(dateString);
        },
        [basicData],
    );

    const areYouSureMsg = `Are you sure you want to delete the occurence?${deletableOccurenceData?.issueDeletable ? 'This will delete the issue as well' : ''}`;

    const negativeTabIndex = openDeleteOccurenceDialog || modalOpened;
    return (
        <VStack
            align="stretch"
            spacing={4}
            p={4}
            role="main"
        >
            <HStack spacing={0}>
                <Link
                    to="/saved_scans"
                    tabIndex={sideBarNegativeTabIndex ? -1 : undefined}
                >
                    <Text
                        textDecoration="underline"
                        color="blue.700"
                        fontWeight="semibold"
                        letterSpacing={1}
                    >
                        Saved Scans
                    </Text>
                </Link>
                <Box width={10}>
                    <NextArrowIcon fill="black" />
                </Box>
                <Text>
                    {basicData?.webpageName}
                </Text>
                <Spacer />
            </HStack>
            <Heading
                as="h1"
                size="lg"
                role="heading"
            >
                {basicData?.webpageName}
                {basicData?.webpageName && ' - '}
                Scan Detail
                <Divider />
            </Heading>

            {processingUrl && !issuesShown && (
                <Loading message="Waiting for data to load" />
            )}
            {!processingUrl && responseError && (
                <Info
                    title="Error Getting Webpage Detail"
                    message={responseError.message}
                    icon={<InvalidUrlIcon />}
                />
            )}
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
                        <VStack
                            alignItems="baseline"
                            maxWidth="80%"
                        >
                            <Heading
                                fontWeight="semibold"
                                letterSpacing="wide"
                                fontSize="2xl"
                                as="h2"
                                wordBreak="break-word"
                            >
                                {`URL: ${basicData?.url}`}
                            </Heading>
                            <Text>
                                {`Website: ${basicData?.websiteName} | Scanned on ${scannedTime}`}
                            </Text>
                        </VStack>
                        <Button
                            type="button"
                            colorScheme="brand"
                            letterSpacing={1}
                            onClick={onOpenIssueFormModal}
                            tabIndex={negativeTabIndex ? -1 : undefined}
                            py={4}
                        >
                            Add Issue
                        </Button>
                    </Box>
                    <Modal
                        isOpen={modalOpened}
                        onClose={onResetEditableIssue}
                        blockScrollOnMount={false}
                        closeOnOverlayClick={false}
                        aria-label="save-result-modal"
                        id="modalling"
                        aria-describedby="save-result-modal"
                        aria-modal="false"
                        isCentered
                    >
                        <ModalOverlay role="dialog" />
                        <ModalContent
                            py={2}
                            minW="xl"
                        >
                            <ModalHeader as="h1">
                                {editableIssue ? 'Edit Issue' : 'Add Issue'}
                            </ModalHeader>
                            <ModalCloseButton />
                            <ModalBody role="main">
                                <IssueForm
                                    onSaveAction={onSaveAction}
                                    onCloseAction={onResetEditableIssue}
                                    editableIssue={editableIssue}
                                    // onResetEditableIssue={onResetEditableIssue}
                                    criteriaListForForm={criteriaListForForm}
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
                        <HStack width="80%">
                            <SelectField
                                options={impactLevelOptions}
                                placeholder={`All Issues (${totalIssuesCount})`}
                                label="Select Issues"
                                onSelectOption={onSelectFilterableImpactLevel}
                                negativeTabIndex={negativeTabIndex}
                            />
                            <SelectField
                                options={criteriaOptions}
                                placeholder="All Criteria / Tags"
                                label="Select Criteria / Tag"
                                onSelectOption={onSelectFilterableCriteria}
                                negativeTabIndex={negativeTabIndex}
                            />
                        </HStack>
                    </HStack>
                    <Box marginTop={4}>
                        <EditableIssueList
                            issueList={filteredIssues}
                            onSetDeletableOccurenceData={onSetDeletableOccurenceData}
                            onSetEditableIssue={onSetEditableIssue}
                            negativeTabIndex={negativeTabIndex}
                        />
                    </Box>
                </Box>
            )}
            <DeleteConfirmationDialog
                open={openDeleteOccurenceDialog}
                onCancelDelete={onCancelDeleteOccurence}
                onDelete={deletableOccurenceData?.issueDeletable
                    ? onDeleteIssue : onDeleteOccurence}
                header="Delete Issue"
                areYouSureMsg={areYouSureMsg}
                dialogBody={(
                    <>
                        <br />
                        {deletableOccurenceData?.issueName}
                    </>
                )}
            />
        </VStack>
    );
}

export default ScannedWebsiteDetail;
