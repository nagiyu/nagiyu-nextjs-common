'use client';

import React, { useState } from 'react';

import BasicStack from '@client-common/components/Layout/Stacks/BasicStack';
import ChatContainer from '@client-common/components/data/chat/ChatContainer';
import { ChatMessageData } from '@client-common/components/data/chat/ChatMessage';
import ChatInputField from '@client-common/components/inputs/TextFields/ChatInputField';
import SendButton from '@client-common/components/inputs/buttons/SendButton';
import DirectionStack from '@client-common/components/Layout/Stacks/DirectionStack';
import PersonIcon from '@client-common/components/data/icon/Person';
import SmartToyIcon from '@client-common/components/data/icon/SmartToy';

export default function ChatSamplePage() {
    const [messages, setMessages] = useState<ChatMessageData[]>([
        {
            id: '1',
            content: 'こんにちは！何かお手伝いできることはありますか？',
            sender: 'system',
            senderName: 'AI Assistant',
            timestamp: new Date(Date.now() - 300000),
            avatarIcon: <SmartToyIcon />,
        },
        {
            id: '2',
            content: 'はい、チャット機能のテストをしています。',
            sender: 'user',
            senderName: 'User',
            timestamp: new Date(Date.now() - 240000),
            avatarIcon: <PersonIcon />,
        },
        {
            id: '3',
            content: '素晴らしいですね！この UI は LINE や ChatGPT のような2者間の対話を表現するためのものです。メッセージは自動的にスクロールします。',
            sender: 'system',
            senderName: 'AI Assistant',
            timestamp: new Date(Date.now() - 180000),
            avatarIcon: <SmartToyIcon />,
        },
        {
            id: '4',
            content: '改行のテストです。\nこのメッセージは複数行にわたります。\n\n段落の区切りも表示されます。\n長い行も適切に折り返されます。',
            sender: 'system',
            senderName: 'AI Assistant',
            timestamp: new Date(Date.now() - 120000),
            avatarIcon: <SmartToyIcon />,
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
            avatarIcon: <PersonIcon />,
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
                avatarIcon: <SmartToyIcon />,
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
                <ChatInputField
                    value={inputText}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <SendButton
                    onClick={handleSendMessage}
                    disabled={inputText.trim() === ''}
                />
            </DirectionStack>
        </BasicStack>
    );
}
