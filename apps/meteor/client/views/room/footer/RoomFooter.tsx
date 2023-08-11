import type { ReactNode } from 'react';
import React, { useCallback } from 'react';

import ComposerContainer from '../composer/ComposerContainer';
import { useChat } from '../contexts/ChatContext';
import { useRoom, useRoomSubscription } from '../contexts/RoomContext';

const RoomFooter = ({ children }: { children?: ReactNode }) => {
	const room = useRoom();
	const chat = useChat();
	const subscription = useRoomSubscription();

	if (!chat) {
		throw new Error('No ChatContext provided');
	}

	const handleNavigateToPreviousMessage = useCallback((): void => {
		chat.messageEditing.toPreviousMessage();
	}, [chat.messageEditing]);

	const handleNavigateToNextMessage = useCallback((): void => {
		chat.messageEditing.toNextMessage();
	}, [chat.messageEditing]);

	const handleUploadFiles = useCallback(
		(files: readonly File[]): void => {
			chat.flows.uploadFiles(files);
		},
		[chat],
	);

	if (children) {
		return <footer className='rc-message-box footer'>{children}</footer>;
	}

	return (
		<footer className='rc-message-box footer'>
			<ComposerContainer
				rid={room._id}
				subscription={subscription}
				onNavigateToPreviousMessage={handleNavigateToPreviousMessage}
				onNavigateToNextMessage={handleNavigateToNextMessage}
				onUploadFiles={handleUploadFiles}
			/>
		</footer>
	);
};

export default RoomFooter;
