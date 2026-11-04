import { Slider } from "@/components/ui/slider"
import { updateOBU } from "@/services/obu"
import { useState } from "react"

interface SpeedProps {
    id: string
    speed: number
}

export default function Speed(props: SpeedProps) {
    const { id, speed } = props
    const [speedValue, setSpeedValue] = useState<number>(speed)

    return (
        <div className="min-w-fit w-[300px] flex flex-col gap-4">
            <div className="flex justify-end">{speedValue ?? "-"} km/h</div>
            {/* TODO: Debouncing */}
            <Slider className="w-full"
                onValueChange={
                    async (e) => {
                        setSpeedValue(e[0])
                        await updateOBU(id, { speed: e[0] })
                    }
                }
                defaultValue={[speed]} max={100} step={1} />
        </div>
    )
}