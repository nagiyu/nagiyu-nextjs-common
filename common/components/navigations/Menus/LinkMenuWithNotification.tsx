'use client';

import LinkMenu, { MenuItemData } from '@client-common/components/navigations/Menus/LinkMenu';
import NotificationSettingDialog from '@client-common/components/feedback/dialog/NotificationSettingDialog';

type LinkMenuWithNotificationProps = {
    menuItems: MenuItemData[];
    enableNotification?: boolean;
};

export default function LinkMenuWithNotification({ 
    menuItems, 
    enableNotification = false 
}: LinkMenuWithNotificationProps) {
    // Add notification settings to menu items if enabled
    const allMenuItems = [...menuItems];
    
    if (enableNotification) {
        allMenuItems.push({
            title: 'Notification Settings',
            dialog: (open, onClose) => (
                <NotificationSettingDialog open={open} onClose={onClose} />
            ),
        });
    }

    return <LinkMenu menuItems={allMenuItems} />;
}
