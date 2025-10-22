import { Alert } from '@mui/material';

type InfoAlertProps = {
    message: string;
}

export default function InfoAlert({ message }: InfoAlertProps) {
    return (
        <Alert severity='info'>
            {message}
        </Alert>
    )
}
