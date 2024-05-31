'use client';

import {
	createContext,
	useContext,
	useEffect,
	useState,
	ReactNode,
} from 'react';
import { io, Socket } from 'socket.io-client';

type SocketContextType = {
	socket: Socket | null;
	isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
	socket: null,
	isConnected: false,
});

export const useSocket = () => {
	return useContext(SocketContext);
};

type SocketProviderProps = {
	children: ReactNode;
};

export const SocketProvider = ({ children }: SocketProviderProps) => {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [isConnected, setIsConnected] = useState(false);

	useEffect(() => {
		const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
		if (!siteUrl) {
			console.error('NEXT_PUBLIC_SITE_URL environment variable is not set.');
			return;
		}

		const socketInstance = io(siteUrl, {
			path: '/api/socket/io',
		});

		socketInstance.on('connect', () => {
			setIsConnected(true);
			console.log('Socket connected');
		});

		socketInstance.on('disconnect', () => {
			setIsConnected(false);
			console.log('Socket disconnected');
		});

		socketInstance.on('connect_error', (err) => {
			console.error('Connection error:', err);
		});

		setSocket(socketInstance);

		return () => {
			socketInstance.disconnect();
		};
	}, []);

	return (
		<SocketContext.Provider value={{ socket, isConnected }}>
			{children}
		</SocketContext.Provider>
	);
};
