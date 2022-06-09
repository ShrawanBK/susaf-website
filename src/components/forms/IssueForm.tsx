import React, { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import {
    Button,
    FormControl,
    FormLabel,
    Input,
    HStack,
    VStack,
    Textarea,
    FormErrorMessage,
    useBoolean,
    Checkbox,
} from '@chakra-ui/react';

import { MultiValue, OptionBase, Select } from 'chakra-react-select';

import SelectField from '../SelectField';
import { Criteria, Impact, IssueObject, FoundType } from '../../typings/webpage';
import { IssueFormData } from '../../typings/forms';

interface Props {
    onSaveAction: (formData: IssueFormData) => void;
    // onCloseAction: (() => void) | undefined;
    editableIssue: IssueObject | undefined;
    criteriaListForForm: Criteria[] | undefined;
    onCloseAction: () => void;
}

const impactOptions = [
    { label: 'Critical', value: 'critical' },
    { label: 'Minor', value: 'minor' },
    { label: 'Moderate', value: 'moderate' },
    { label: 'Serious', value: 'serious' },
];

interface MultiCriteriaOption extends OptionBase {
    label: string;
    value: string;
    note: string;
    criteriaId: string;
    name: string;
}

function IssueForm(props: Props) {
    const {
        onSaveAction,
        onCloseAction,
        editableIssue,
        // onResetEditableIssue,
        criteriaListForForm,
    } = props;

    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [note, setNote] = useState<string>('');
    const [selectedImpact, setSelectedImpact] = useState<string>('');

    const [needsReview, setNeedsReview] = useBoolean();

    const [selectedCriteria, setSelectedCriteria] = useState<MultiValue<MultiCriteriaOption>>();

    const [nameError, setNameError] = useState('');
    const [criteriaError, setCriteriaError] = useState('');
    const [impactError, setImpactError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');

    // Display when the form submitted without editing - for update
    const [notEditedError, setNotEditedError] = useState('');

    const handleNameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        if (nameError) {
            setNameError('');
        }
        if (notEditedError) {
            setNotEditedError('');
        }
        setName(e.target.value);
    }, [nameError, notEditedError]);

    const handleDescriptionChange = useCallback((
        e: ChangeEvent<HTMLTextAreaElement>,
    ) => {
        if (descriptionError) {
            setDescriptionError('');
        }
        if (notEditedError) {
            setNotEditedError('');
        }
        setDescription(e.target.value);
    }, [descriptionError, notEditedError]);

    const handleNoteChange = useCallback(
        (e: ChangeEvent<HTMLTextAreaElement>) => {
            setNote(e.target.value);
            if (notEditedError) {
                setNotEditedError('');
            }
        }, [notEditedError],
    );

    const onSelectCriteria = useCallback(
        (newValue: MultiValue<MultiCriteriaOption>) => {
            if (criteriaError) {
                setCriteriaError('');
            }
            if (notEditedError) {
                setNotEditedError('');
            }
            setSelectedCriteria(newValue);
        }, [criteriaError, notEditedError],
    );

    useEffect(
        () => {
            if (!editableIssue) {
                return;
            }
            setName(editableIssue.name);
            setDescription(editableIssue.occurences[0].description);
            setNote(editableIssue.occurences[0].note ?? '');
            const formMappedSelectedCriteria = editableIssue.criteria.map(
                (criteria) => ({
                    ...criteria,
                    label: criteria.name,
                    value: criteria.criteriaId,
                }),
            );
            setSelectedCriteria(formMappedSelectedCriteria);
            setSelectedImpact(editableIssue.impact);
            if (editableIssue.occurences[0].needsReview) {
                setNeedsReview.on();
            } else {
                setNeedsReview.off();
            }
        },
        [editableIssue, setNeedsReview],
    );

    const onCancelSave = useCallback(
        () => {
            setName('');
            setDescription('');
            setNote('');
            onCloseAction();
        },
        [onCloseAction],
    );

    const onSelectImpact = useCallback(
        (value: string) => {
            if (impactError) {
                setImpactError('');
            }
            if (notEditedError) {
                setNotEditedError('');
            }
            setSelectedImpact(value);
        },
        [impactError, notEditedError],
    );

    const criteriaOptions: MultiCriteriaOption[] = useMemo(
        () => {
            if (!criteriaListForForm || criteriaListForForm.length <= 0) {
                return [];
            }
            const mappedCriteriaList = criteriaListForForm.filter(
                (c) => !!c.name,
            ).map((criteria) => ({
                value: criteria.criteriaId,
                label: criteria.name,
                note: criteria.note,
                criteriaId: criteria.criteriaId,
                name: criteria.name,
            }));

            //  sorted list by name
            return mappedCriteriaList.sort((a, b) => {
                if (a.name.toLowerCase() < b.name.toLowerCase()) {
                    return -1;
                }
                if (a.name.toLowerCase() > b.name.toLowerCase()) {
                    return 1;
                }
                return 0;
            });
        },
        [criteriaListForForm],
    );

    const formattedSelectedCriteria = useMemo(
        () => {
            if (!selectedCriteria || selectedCriteria.length <= 0) {
                return [];
            }
            return selectedCriteria.map((sc) => ({
                criteriaId: sc.criteriaId,
                note: sc.note,
                name: sc.name,
            }));
        },
        [selectedCriteria],
    );

    const handleSubmit = useCallback(
        (event) => {
            let errorCount = 0;
            event.preventDefault();
            if (!name) {
                setNameError('Please enter issue name');
                errorCount += 1;
            }
            if (formattedSelectedCriteria.length <= 0) {
                setCriteriaError('Please select at least one criteria');
                errorCount += 1;
            }
            if (!selectedImpact) {
                setImpactError('Please select at impact');
                errorCount += 1;
            }
            if (!description) {
                setDescriptionError('Please enter description');
                errorCount += 1;
            }
            if (editableIssue) {
                // NOTE: for criteria field changed
                let criteriaChanged = false;
                const editableIssueCriteriaId = editableIssue.criteria.map((c) => c.criteriaId);
                const formIssueCriteriaId = formattedSelectedCriteria.map((c) => c.criteriaId);

                if (editableIssueCriteriaId.length !== formIssueCriteriaId.length) {
                    criteriaChanged = true;
                }

                const idDifference = editableIssueCriteriaId.filter(
                    (eID) => !formIssueCriteriaId.includes(eID),
                );
                criteriaChanged = !(idDifference.length === 0);

                const otherFieldsChanged = name !== editableIssue.name
                    || selectedImpact !== editableIssue.impact
                    || description !== editableIssue.occurences[0].description
                    || needsReview !== editableIssue.occurences[0].needsReview
                    || note !== editableIssue.occurences[0].note;

                const formUpdated = otherFieldsChanged || criteriaChanged;

                if (!formUpdated) {
                    setNotEditedError('Please update at least one field');
                    errorCount += 1;
                }
            }
            if (errorCount > 0) {
                return;
            }
            onSaveAction({
                name,
                impact: selectedImpact as Impact,
                found: editableIssue ? editableIssue.found as FoundType : 'manual',
                occurences: [
                    {
                        occurenceId: editableIssue?.occurences[0].occurenceId,
                        note,
                        description,
                        needsReview,
                    },
                ],
                criteria: formattedSelectedCriteria,
            });
        },
        [
            name,
            formattedSelectedCriteria,
            note,
            onSaveAction,
            selectedImpact,
            description,
            editableIssue,
            needsReview,
        ],
    );

    const submitButtonLabel = editableIssue ? 'Update' : 'Add';

    return (
        <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
                <FormControl isInvalid={!!nameError}>
                    <FormLabel htmlFor="name">
                        Name *
                    </FormLabel>
                    <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={handleNameChange}
                        placeholder="Enter issue name"
                        background="whiteAlpha.900"
                        // isRequired
                        height={12}
                        autoComplete="off"
                    />
                    {nameError && (
                        <FormErrorMessage>
                            {nameError}
                        </FormErrorMessage>
                    )}
                </FormControl>
                <FormControl isInvalid={!!criteriaError}>
                    <FormLabel>
                        Criteria / Tags *
                    </FormLabel>
                    <Select
                        isMulti
                        name="criteria"
                        options={criteriaOptions}
                        placeholder="Select Criteria / Tag"
                        closeMenuOnSelect={false}
                        onChange={onSelectCriteria}
                        value={selectedCriteria}
                        placeholderColor="black"
                    />
                    {criteriaError && (
                        <FormErrorMessage>
                            {criteriaError}
                        </FormErrorMessage>
                    )}
                </FormControl>
                <SelectField
                    options={impactOptions}
                    placeholder="Select option"
                    label="Impact *"
                    onSelectOption={onSelectImpact}
                    value={selectedImpact}
                    isInvalid={!!impactError}
                    errorMessage={impactError}
                />
                <FormControl isInvalid={!!descriptionError}>
                    <FormLabel htmlFor="description">
                        Description *
                    </FormLabel>
                    <Textarea
                        id="description"
                        value={description}
                        onChange={handleDescriptionChange}
                        placeholder="Enter issue description"
                        // isRequired
                        rows={3}
                        autoComplete="off"
                        isInvalid={!!descriptionError}
                    />
                    {descriptionError && (
                        <FormErrorMessage>
                            {descriptionError}
                        </FormErrorMessage>
                    )}
                </FormControl>
                <FormControl>
                    <FormLabel htmlFor="note">
                        Notes
                    </FormLabel>
                    <Textarea
                        id="note"
                        value={note}
                        onChange={handleNoteChange}
                        placeholder="Enter notes for the issue."
                        rows={3}
                        autoComplete="off"
                    />
                </FormControl>
                <Checkbox
                    aria-label="needs-review"
                    width="100%"
                    margin={4}
                    borderColor="#045981"
                    onChange={() => setNeedsReview.toggle()}
                    isChecked={needsReview}
                    alignItems="center"
                >
                    Needs Review
                </Checkbox>
                {notEditedError && (
                    <FormControl isInvalid={!!notEditedError}>
                        <FormErrorMessage>
                            {notEditedError}
                        </FormErrorMessage>
                    </FormControl>
                )}
                <HStack
                    width="100%"
                    justifyContent="flex-end"
                    spacing={4}
                >
                    <Button
                        type="reset"
                        colorScheme="brand"
                        variant="outline"
                        letterSpacing={1}
                        onClick={onCancelSave}
                        py={4}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        letterSpacing={1}
                        colorScheme="brand"
                        py={4}
                    >
                        {submitButtonLabel}
                    </Button>
                </HStack>
            </VStack>
        </form>
    );
}
export default IssueForm;
