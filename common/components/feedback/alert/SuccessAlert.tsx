import { Alert } from '@mui/material';

type SuccessAlertProps = {
    message: string;
}

export default function SuccessAlert({ message }: SuccessAlertProps) {
    return (
        <Alert severity='success'>
            {message}
        </Alert>
    )
}
