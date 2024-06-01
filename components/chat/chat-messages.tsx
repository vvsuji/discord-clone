'use client';

import { Member, Message, Profile } from '@prisma/client';
import { ChatWelcome } from './chat-welcome';
import { useChatQuery } from '@/hooks/use-chat-query';
import { Loader2, ServerCrash } from 'lucide-react';
import { Fragment } from 'react';
import { ChatItem } from './chat-item';
import { format } from 'date-fns';

const DATE_FORMAT = 'd MMM yyyy, HH:mm';

type MessageWithMemberWithProfile = Message & {
	member: Member & {
		profile: Profile;
	};
};

interface ChatMessagesProps {
	name: string;
	member: Member;
	chatId: string;
	apiUrl: string;
	socketUrl: string;
	socketQuery: Record<string, string>;
	paramKey: 'channelId' | 'conversationId';
	paramValue: string;
	type: 'channel' | 'conversation';
}

export const ChatMessages = ({
	name,
	member,
	chatId,
	apiUrl,
	socketUrl,
	socketQuery,
	paramKey,
	paramValue,
	type,
}: ChatMessagesProps) => {
	const queryKey = `chat:${chatId}`;

	const { data, fetchNextPage, isFetchingNextPage, hasNextPage, status } =
		useChatQuery({
			queryKey,
			apiUrl,
			paramKey,
			paramValue,
		});

	if (status === 'pending') {
		return (
			<div className='flex-1 flex flex-col justify-center items-center'>
				<Loader2 className='w-7 h-7 text-zinc-500 my-4 animate-spin' />
				<p className='text-zinc-500 text-xs dark:text-zinc-400'>
					Loading messages...
				</p>
			</div>
		);
	}

	if (status === 'error') {
		return (
			<div className='flex-1 flex flex-col justify-center items-center'>
				<ServerCrash className='w-7 h-7 text-zinc-500 my-4' />
				<p className='text-zinc-500 text-xs dark:text-zinc-400'>
					Something went wrong!
				</p>
			</div>
		);
	}

	return (
		<div className='flex-1 flex flex-col py-4 overflow-y-auto'>
			<div className='flex-1' />
			<ChatWelcome type={type} name={name} />
			<div className='flex flex-col-reverse mt-auto'>
				{data?.pages?.map((group, i) => (
					<Fragment key={i}>
						{group.items.map((message: MessageWithMemberWithProfile) => (
							<ChatItem
								currentMember={member}
								key={message.id}
								id={message.id}
								content={message.content}
								member={message.member}
								timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
								isUpdated={message.updatedAt !== message.createdAt}
								fileUrl={message.fileUrl}
								deleted={message.deleted}
								socketUrl={socketUrl}
								socketQuery={socketQuery}
							/>
						))}
					</Fragment>
				))}
			</div>
		</div>
	);
};
