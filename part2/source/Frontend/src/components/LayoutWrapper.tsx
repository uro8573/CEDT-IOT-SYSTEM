'use client';

import {
	Dispatch,
	SetStateAction,
	createContext,
	useEffect,
	useState,
} from 'react';
import { io } from 'socket.io-client';

export interface AuthData {
	token: string;
	role: string;
	car_id: string;
}
interface CarData {
	speed: number;
	unit: string;
	latitude: number;
	longitude: number;
	color: string;
}

export const AuthContext = createContext<
	[AuthData, Dispatch<SetStateAction<AuthData>>]
>([{} as AuthData, () => {}]);
export const CarContext = createContext<CarData>({} as CarData);

export default function LayoutWrapper(props: { children: React.ReactNode }) {
	const [auth, setAuth] = useState<AuthData>({
		token: '',
		role: '',
		car_id: process.env.NEXT_PUBLIC_CAR_IDENTIFIER ?? '',
	});

	const [car, setCar] = useState<CarData>({
		speed: 0.0,
		unit: 'km/h',
		latitude: 13.738044,
		longitude: 100.529944,
		color: 'no',
	});

	useEffect(() => {
		const socket = io('ws://localhost:8002/', {
			transports: ['websocket', 'polling'],
		});
		socket.on('connect', () => {
			console.log('Connect to OBU backend');
		});
		socket.on('car info', (message) => {
			if (message['id'].toString() === auth.car_id.toString()) {
			setCar({
				speed: message['velocity'],
				unit: message['unit'],
				latitude: message['latitude'],
				longitude: message['longitude'],
				color: message['color'],
			});
			}
		});

		socket.on('disconnect', () => {
			console.log('Disconnected from OBU backend');
		});
	}, []);

	return (
		<>
			<CarContext.Provider value={car}>
				{props.children}
			</CarContext.Provider>
		</>
	);
}
