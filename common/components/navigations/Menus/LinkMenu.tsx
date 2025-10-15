'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationSettingDialog from '@client-common/components/feedback/dialog/NotificationSettingDialog';

export type MenuItemData = {
    title: string;
    url?: string;
    dialog?: (open: boolean, onClose: () => void) => React.ReactNode;
};

type LinkMenuProps = {
    menuItems: MenuItemData[];
    enableNotification?: boolean;
};

export default function LinkMenu({ menuItems, enableNotification = false }: LinkMenuProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [dialogOpen, setDialogOpen] = useState<number | null>(null);
    const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);
    const open = Boolean(anchorEl);

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

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenuItemClick = (index: number) => {
        const item = allMenuItems[index];
        
        if (item.dialog) {
            setDialogOpen(index);
        }
        
        handleClose();
    };

    const handleDialogClose = () => {
        setDialogOpen(null);
    };

    return (
        <>
            <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleClick}
                sx={{ mr: 2 }}
            >
                <MenuIcon />
            </IconButton>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                {allMenuItems.map((item, index) => (
                    <MenuItem 
                        onClick={() => handleMenuItemClick(index)} 
                        key={item.url || `dialog-${index}`}
                    >
                        {item.url ? (
                            <Link href={item.url} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                                {item.title}
                            </Link>
                        ) : (
                            <span style={{ width: '100%' }}>
                                {item.title}
                            </span>
                        )}
                    </MenuItem>
                ))}
            </Menu>
            {allMenuItems.map((item, index) => 
                item.dialog && dialogOpen === index ? (
                    <React.Fragment key={`dialog-${index}`}>
                        {item.dialog(true, handleDialogClose)}
                    </React.Fragment>
                ) : null
            )}
        </>
    );
}
