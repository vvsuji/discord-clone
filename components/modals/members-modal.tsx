'use client';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { useModal } from '@/hooks/use-modal-store';
import { ServerWithMembersWithProfiles } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserAvatar } from '@/components/user-avatar';
import {
	MoreVertical,
	ShieldAlert,
	ShieldCheck,
	ShieldQuestion,
} from 'lucide-react';
import { useState } from 'react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';

const roleIconMap = {
	GUEST: null,
	MODERATOR: <ShieldCheck className='h-4 w-4 ml-2 text-indigo-500' />,
	ADMIN: <ShieldAlert className='h-4 w-4 text-rose-500' />,
};
export const MembersModal = () => {
	const { onOpen, isOpen, onClose, type, data } = useModal();
	const [loadingId, setLoadingId] = useState('');

	const isModalOpen = isOpen && type === 'members';
	const { server } = data as { server: ServerWithMembersWithProfiles };

	return (
		<Dialog open={isModalOpen} onOpenChange={onClose}>
			<DialogContent className='bg-white text-black overflow-hidden'>
				<DialogHeader className='pt-8 px-6'>
					<DialogTitle className='text-2xl text-center font-bold'>
						Manage Members
					</DialogTitle>
					<DialogDescription className='text-center text-zinc-500'>
						{server?.members?.length} Members
					</DialogDescription>
				</DialogHeader>
				<ScrollArea className='mt-8 max-h-[420px] pr-6'>
					{server?.members?.map((member) => (
						<div
							key={member.id}
							className='flex items-center gap-x-2 mb-6 hover:bg-zinc-100 dark:hover:bg-zinc-800'>
							<UserAvatar src={member.profile.imageUrl} />
							<div className='flex flex-col gap-y-1'>
								<div className='text-xs font-semibold flex items-center gap-x-1'>
									{member.profile.name}
									{roleIconMap[member.role]}
								</div>
								<p className='text-sm text-zinc-500'>{member.profile.email}</p>
							</div>
							{server.profileId !== member.profileId &&
								loadingId !== member.id && (
									<div className='ml-auto'>
										<DropdownMenu>
											<DropdownMenuTrigger>
												<MoreVertical className='h-4 w-4 text-zinc-500' />
											</DropdownMenuTrigger>
											<DropdownMenuContent side='left'>
												<DropdownMenuSub>
													<DropdownMenuSubTrigger className='flex items-center'>
														<ShieldQuestion className='h-4 w-4 mr-2' />
														<span>Role</span>
													</DropdownMenuSubTrigger>
													<DropdownMenuPortal></DropdownMenuPortal>
												</DropdownMenuSub>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								)}
						</div>
					))}
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
};
