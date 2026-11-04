import { useEffect, useState } from 'react';
import TextContentBox from './TextContentBox';

export default function DateContextBox() {
	const [date, setDate] = useState<string>('');
	const [time, setTime] = useState<string>('');

	const updateDateTime = () => {
		const currentDateTime = new Date();
		const day = currentDateTime.getDate().toString().padStart(2, '0');
		const month = currentDateTime.toLocaleString('en-US', { month: 'long' });
		const year = currentDateTime.getFullYear().toString();

		const hours = currentDateTime.getHours().toString().padStart(2, '0');
		const minutes = currentDateTime.getMinutes().toString().padStart(2, '0');
		const seconds = currentDateTime.getSeconds().toString().padStart(2, '0');

		setDate(`${day} ${month} ${year}`);
		setTime(`${hours}:${minutes}:${seconds}`);
	};

	useEffect(() => {
		const intervalId = setInterval(updateDateTime, 1000);
		return () => clearInterval(intervalId);
	}, []);

	return <TextContentBox title={date} content={time} />;
}
