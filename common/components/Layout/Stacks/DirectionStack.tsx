import React from 'react';

import { Stack } from '@mui/material';

type DirectionStackProps = {
    spacing?: number;
    justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
    alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
    style?: React.CSSProperties;
    children: React.ReactNode;
};

export default function DirectionStack({
    spacing = 2,
    justifyContent = 'center',
    alignItems = 'center',
    style,
    children,
}: DirectionStackProps) {
    return (
        <Stack
            direction="row"
            spacing={spacing}
            justifyContent={justifyContent}
            alignItems={alignItems}
            style={style}
        >
            {children}
        </Stack>
    );
}
