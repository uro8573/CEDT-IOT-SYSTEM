import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { updateOBU } from "@/services/obu"
import { Status } from "@/constant"

interface HeartbeatProps {
    id: string
    heartbeat: Status
}

export default function Heartbeat(props: HeartbeatProps) {
    const { id, heartbeat } = props
    return (
        <div className="flex flex-wrap gap-6">
            <div className="flex flex-col gap-2">
                <h2 className="font-bold">Status</h2>
                <Select onValueChange={(value) => updateOBU(id, { heartbeat: value })}>
                    <SelectTrigger defaultValue={heartbeat} className="w-[150px]">
                        <SelectValue placeholder={heartbeat} />
                    </SelectTrigger>
                    <SelectContent defaultValue={heartbeat} >
                        <SelectItem value={Status.INACTIVE}>{Status.INACTIVE}</SelectItem>
                        <SelectItem value={Status.ACTIVE}>{Status.ACTIVE}</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}