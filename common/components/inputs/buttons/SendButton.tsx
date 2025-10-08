'use client';

import React from 'react';

import { Button } from '@mui/material';

type SendButtonProps = {
    onClick: () => void;
    disabled?: boolean;
    label?: string;
};

export default function SendButton({
    onClick,
    disabled = false,
    label = '送信'
}: SendButtonProps) {
    return (
        <Button
            variant="contained"
            onClick={onClick}
            disabled={disabled}
            sx={{ minWidth: '100px' }}
        >
            {label}
        </Button>
    );
}
