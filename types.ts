import { Server as NetServer } from 'http';
import { NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';
import { Server, Member, Profile } from '@prisma/client';

export type ServerWithMembersWithProfiles = Server & {
	members: (Member & { profile: Profile })[];
};

export type NextApiResponseServerIO = NextApiResponse & {
	socket: {
		server: NetServer & {
			io: SocketIOServer;
		};
	};
};
