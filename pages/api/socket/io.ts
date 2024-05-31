import { Server as NetServer } from 'http';
import { Server as ServerIO } from 'socket.io';
import { NextApiRequest } from 'next';
import { NextApiResponseServerIO } from '@/types';

export const config = {
	api: {
		bodyParser: false,
	},
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
	if (!res.socket.server.io) {
		const httpServer: NetServer = res.socket.server as any;
		const io = new ServerIO(httpServer, {
			path: '/api/socket/io',
		});
		res.socket.server.io = io;

		io.on('connection', (socket) => {
			console.log('A client connected');

			socket.on('disconnect', () => {
				console.log('A client disconnected');
			});
		});
	}
	res.end();
};

export default ioHandler;
