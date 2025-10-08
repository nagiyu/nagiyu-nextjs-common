'use client';

import React from 'react';

import BasicStack from '@client-common/components/Layout/Stacks/BasicStack';
import DirectionStack from '@client-common/components/Layout/Stacks/DirectionStack';
import { ResponsiveUtil } from '@client-common/utils/ResponsiveUtil';
import SportsEsportsIcon from '@client-common/components/data/icon/SportsEsports';
import TrainIcon from '@client-common/components/data/icon/Train';
import HomeIcon from '@client-common/components/data/icon/Home';
import SettingsIcon from '@client-common/components/data/icon/Settings';
import SearchIcon from '@client-common/components/data/icon/Search';
import StarIcon from '@client-common/components/data/icon/Star';
import DeleteIcon from '@client-common/components/data/icon/Delete';
import EditIcon from '@client-common/components/data/icon/Edit';
import AddIcon from '@client-common/components/data/icon/Add';
import CheckIcon from '@client-common/components/data/icon/Check';
import CloseIcon from '@client-common/components/data/icon/Close';
import MenuIcon from '@client-common/components/data/icon/Menu';
import RefreshIcon from '@client-common/components/data/icon/Refresh';

export default function IconSamplePage() {
    const isMobile = ResponsiveUtil.useMobileDetection();

    const icons = [
        { name: 'SportsEsports', component: SportsEsportsIcon },
        { name: 'Train', component: TrainIcon },
        { name: 'Home', component: HomeIcon },
        { name: 'Settings', component: SettingsIcon },
        { name: 'Search', component: SearchIcon },
        { name: 'Star', component: StarIcon },
        { name: 'Delete', component: DeleteIcon },
        { name: 'Edit', component: EditIcon },
        { name: 'Add', component: AddIcon },
        { name: 'Check', component: CheckIcon },
        { name: 'Close', component: CloseIcon },
        { name: 'Menu', component: MenuIcon },
        { name: 'Refresh', component: RefreshIcon },
    ];

    // モバイルなら3つずつ、PCなら4つずつグループ化
    const groupSize = isMobile ? 3 : 4;
    const grouped = Array.from(
        { length: Math.ceil(icons.length / groupSize) },
        (_, i) => icons.slice(i * groupSize, i * groupSize + groupSize)
    );

    return (
        <BasicStack>
            <h2>Icon Demo</h2>
            {grouped.map((group, idx) => (
                <DirectionStack key={idx}>
                    {group.map(({ name, component: IconComponent }) => (
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
            ))}
        </BasicStack>
    );
}
