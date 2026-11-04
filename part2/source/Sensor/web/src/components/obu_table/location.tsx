import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { updateOBU } from '@/services/obu';

interface LocationProps {
	id: string;
	route: string;
}

export default function Location(props: LocationProps) {
	const { id, route } = props;
	return (
		<div className="min-w-fit w-[180px] flex flex-col gap-2">
			<h2 className="font-bold">Simulation route</h2>
			<Select
				onValueChange={(value) => updateOBU(id, { route: value })}
				defaultValue={route}
			>
				<SelectTrigger className="w-[130px] min-w-fit">
					<SelectValue placeholder="Select Route" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="chula">จุฬา</SelectItem>
					<SelectItem value="fixed">Fixed</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
}
