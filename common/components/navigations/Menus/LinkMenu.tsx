'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

export type MenuItemData = {
    title: string;
    url?: string;
    dialog?: React.ReactNode;
};

type LinkMenuProps = {
    menuItems: MenuItemData[];
};

export default function LinkMenu({ menuItems }: LinkMenuProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [dialogOpen, setDialogOpen] = useState<number | null>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenuItemClick = (index: number) => {
        const item = menuItems[index];
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
                {menuItems.map((item, index) => (
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
            {menuItems.map((item, index) => 
                item.dialog && dialogOpen === index ? (
                    React.cloneElement(item.dialog as React.ReactElement, {
                        key: `dialog-${index}`,
                        open: true,
                        onClose: handleDialogClose,
                    })
                ) : null
            )}
        </>
    );
}
