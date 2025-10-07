'use client';

import React from 'react';

import BasicStack from '@client-common/components/Layout/Stacks/BasicStack';
import DirectionStack from '@client-common/components/Layout/Stacks/DirectionStack';
import SportsEsportsIcon from '@client-common/components/data/icon/SportsEsports';
import TrainIcon from '@client-common/components/data/icon/Train';
import { Typography, Paper } from '@mui/material';

export default function IconSamplePage() {
    const icons = [
        { name: 'SportsEsports', component: SportsEsportsIcon },
        { name: 'Train', component: TrainIcon },
    ];

    return (
        <BasicStack>
            <Typography variant="h4" gutterBottom>
                Icon Demo
            </Typography>
            <DirectionStack>
                {icons.map(({ name, component: IconComponent }) => (
                    <Paper
                        key={name}
                        elevation={3}
                        sx={{
                            padding: 3,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 2,
                            minWidth: 150,
                        }}
                    >
                        <IconComponent sx={{ fontSize: 48 }} />
                        <Typography variant="body1">{name}</Typography>
                    </Paper>
                ))}
            </DirectionStack>
        </BasicStack>
    );
}
