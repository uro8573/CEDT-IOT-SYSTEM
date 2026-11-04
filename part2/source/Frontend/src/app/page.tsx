'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { TailSpin } from 'react-loader-spinner';

export default function Home() {
	const router = useRouter();

	useEffect(() => {
		router.push('/dashboard');
	}, []);

	return (
		<div className="flex h-[100dvh] w-[100dvw] items-center justify-center">
			<Image
				className="-z-10"
				src="/background.png"
				fill={true}
				alt={'Background Image'}
			/>
			<TailSpin color="#17A5D3" height={100} width={100} />
		</div>
	);
}