'use client';

import React from 'react';

import { TextField, TextFieldProps } from '@mui/material';

type ChatInputFieldProps = {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyPress?: (e: React.KeyboardEvent) => void;
    placeholder?: string;
    maxRows?: number;
};

export default function ChatInputField({
    value,
    onChange,
    onKeyPress,
    placeholder = 'メッセージを入力...',
    maxRows = 3
}: ChatInputFieldProps) {
    return (
        <TextField
            fullWidth
            variant="outlined"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onKeyPress={onKeyPress}
            multiline
            maxRows={maxRows}
        />
    );
}
