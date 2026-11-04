'use client';

import DateContextBox from '@/components/DateContextBox';
import { CarContext } from '@/components/LayoutWrapper';
import Map from '@/components/Map';
import TextContentBox from '@/components/TextContentBox';
import { useContext } from 'react';

export default function Home() {
	const car = useContext(CarContext);
	return (
		<>
			<div className="h-[100dvh] w-[100dvw] flex flex-col gap-12 p-8 bg-light_grey">
				<div className="h-4/5 w-full bg-white rounded-lg p-16 items-center justify-center">
					<Map />
				</div>
				<div className="h-1/5 w-full flex flex-col gap-12">
					<div className="h-full w-full flex flex-row gap-12">
						<div className="w-2/5">
							<TextContentBox
								title="Current Speed"
								content={car.speed.toFixed(1)}
								helperText={car.unit}
							/>
						</div>
						<div className="w-3/5">
							<DateContextBox />
						</div>
					</div>
				</div>
			</div>
		</>
	);
}