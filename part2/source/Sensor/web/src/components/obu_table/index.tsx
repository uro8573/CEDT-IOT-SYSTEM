import { useQuery } from "@tanstack/react-query";

import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { getOBU } from "@/services/obu";

export default function OBU_table() {
    const { data } = useQuery({
        queryKey: ['getOBU'],
        queryFn: async () => await getOBU()
    })

    return (
        <DataTable
            columns={columns}
            data={data ?? []}
        />
    )
}