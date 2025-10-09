'use client';

import React from 'react';

import BasicStack from '@client-common/components/Layout/Stacks/BasicStack';
import LinkMenu, { MenuItemData } from '@client-common/components/navigations/Menus/LinkMenu';
import BasicDialog from '@client-common/components/feedback/dialog/BasicDialog';

export default function LinkMenuDemoPage() {
    const menuItems: MenuItemData[] = [
        {
            title: 'Home',
            url: '/',
        },
        {
            title: 'Sample Dialog',
            dialog: (
                <BasicDialog title='Sample Dialog'>
                    {() => (
                        <div>
                            This is a sample dialog opened from the LinkMenu.
                            The dialog can be opened by clicking the menu item.
                        </div>
                    )}
                </BasicDialog>
            ),
        },
        {
            title: 'Info Dialog with Confirm',
            dialog: (
                <BasicDialog
                    title='Information'
                    onConfirm={async () => {
                        console.log('Confirmed from LinkMenu dialog!');
                    }}
                >
                    {() => (
                        <div>
                            This dialog has a confirm button.
                            Click OK to see console output.
                        </div>
                    )}
                </BasicDialog>
            ),
        },
        {
            title: 'Chat Page (URL)',
            url: '/sample/data/chat',
        },
    ];

    return (
        <BasicStack>
            <h1>LinkMenu Dialog Demo</h1>
            <p>This page demonstrates the extended LinkMenu component with dialog support.</p>
            <p>The LinkMenu below contains both URL navigation items and dialog items:</p>
            <ul>
                <li><strong>Home</strong> - Navigates to home page via URL</li>
                <li><strong>Sample Dialog</strong> - Opens a basic dialog</li>
                <li><strong>Info Dialog with Confirm</strong> - Opens a dialog with confirm button</li>
                <li><strong>Chat Page (URL)</strong> - Navigates to chat page via URL</li>
            </ul>
            
            <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
                <h3>Try the menu:</h3>
                <LinkMenu menuItems={menuItems} />
            </div>
        </BasicStack>
    );
}
