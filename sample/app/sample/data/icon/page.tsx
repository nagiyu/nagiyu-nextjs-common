'use client';

import React from 'react';

import BasicStack from '@client-common/components/Layout/Stacks/BasicStack';
import DirectionStack from '@client-common/components/Layout/Stacks/DirectionStack';
import SportsEsportsIcon from '@client-common/components/data/icon/SportsEsports';
import TrainIcon from '@client-common/components/data/icon/Train';

export default function IconSamplePage() {
    const icons = [
        { name: 'SportsEsports', component: SportsEsportsIcon },
        { name: 'Train', component: TrainIcon },
    ];

    return (
        <BasicStack>
            <h2>Icon Demo</h2>
            <DirectionStack>
                {icons.map(({ name, component: IconComponent }) => (
                    <div
                        key={name}
                        style={{
                            padding: '24px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '16px',
                            minWidth: '150px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        }}
                    >
                        <IconComponent style={{ fontSize: '48px' }} />
                        <span>{name}</span>
                    </div>
                ))}
            </DirectionStack>
        </BasicStack>
    );
}
