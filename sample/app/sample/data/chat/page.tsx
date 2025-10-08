'use client';

import React, { useState } from 'react';

import BasicStack from '@client-common/components/Layout/Stacks/BasicStack';
import ChatContainer from '@client-common/components/data/chat/ChatContainer';
import { ChatMessageData } from '@client-common/components/data/chat/ChatMessage';
import { Button, TextField } from '@mui/material';
import DirectionStack from '@client-common/components/Layout/Stacks/DirectionStack';
import Person from '@mui/icons-material/Person';
import SmartToy from '@mui/icons-material/SmartToy';

export default function ChatSamplePage() {
    const [messages, setMessages] = useState<ChatMessageData[]>([
        {
            id: '1',
            content: 'こんにちは！何かお手伝いできることはありますか？',
            sender: 'system',
            senderName: 'AI Assistant',
            timestamp: new Date(Date.now() - 300000),
            avatarIcon: <SmartToy />,
        },
        {
            id: '2',
            content: 'はい、チャット機能のテストをしています。',
            sender: 'user',
            senderName: 'User',
            timestamp: new Date(Date.now() - 240000),
            avatarIcon: <Person />,
        },
        {
            id: '3',
            content: '素晴らしいですね！この UI は LINE や ChatGPT のような2者間の対話を表現するためのものです。メッセージは自動的にスクロールします。',
            sender: 'system',
            senderName: 'AI Assistant',
            timestamp: new Date(Date.now() - 180000),
            avatarIcon: <SmartToy />,
        },
    ]);
    const [inputText, setInputText] = useState('');

    const handleSendMessage = () => {
        if (inputText.trim() === '') return;

        const newMessage: ChatMessageData = {
            id: Date.now().toString(),
            content: inputText,
            sender: 'user',
            senderName: 'User',
            timestamp: new Date(),
            avatarIcon: <Person />,
        };

        setMessages([...messages, newMessage]);
        setInputText('');

        // Simulate AI response after a short delay
        setTimeout(() => {
            const aiResponse: ChatMessageData = {
                id: (Date.now() + 1).toString(),
                content: 'メッセージを受け取りました: "' + inputText + '"',
                sender: 'system',
                senderName: 'AI Assistant',
                timestamp: new Date(),
                avatarIcon: <SmartToy />,
            };
            setMessages((prev) => [...prev, aiResponse]);
        }, 1000);
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <BasicStack spacing={2}>
            <h2>Chat Component Demo</h2>
            <ChatContainer messages={messages} height="500px" />
            <DirectionStack spacing={1}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="メッセージを入力..."
                    value={inputText}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    multiline
                    maxRows={3}
                />
                <Button
                    variant="contained"
                    onClick={handleSendMessage}
                    disabled={inputText.trim() === ''}
                    sx={{ minWidth: '100px' }}
                >
                    送信
                </Button>
            </DirectionStack>
        </BasicStack>
    );
}
