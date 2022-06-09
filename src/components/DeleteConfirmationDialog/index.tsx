import React from 'react';
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogCloseButton,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
    Spacer,
} from '@chakra-ui/react';

interface Props {
    open: boolean;
    onCancelDelete: () => void;
    onDelete: () => void;
    header?: string;
    areYouSureMsg?: string;
    dialogBody?: React.ReactNode;
}

function DeleteConfirmationDialog(props: Props) {
    const {
        open,
        onCancelDelete,
        onDelete,
        header = 'Delete',
        areYouSureMsg = 'Are you sure?',
        dialogBody,
    } = props;
    return (
        <AlertDialog
            motionPreset="slideInBottom"
            isOpen={open}
            onClose={onCancelDelete}
            leastDestructiveRef={undefined}
            isCentered
        >
            <AlertDialogOverlay role="alertdialog" />
            <AlertDialogContent py={2}>
                <AlertDialogHeader as="h1">
                    {header}
                </AlertDialogHeader>
                <AlertDialogCloseButton />
                <AlertDialogBody role="main">
                    {areYouSureMsg}
                    <Spacer />
                    {dialogBody}
                </AlertDialogBody>

                <AlertDialogFooter>
                    <Button
                        variant="outline"
                        ref={undefined}
                        onClick={onCancelDelete}
                    >
                        Cancel
                    </Button>
                    <Button
                        colorScheme="red"
                        onClick={onDelete}
                        ml={3}
                        background="red.700"
                    >
                        Delete
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default DeleteConfirmationDialog;
