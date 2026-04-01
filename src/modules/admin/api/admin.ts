
import axios from "@/lib/axios"
import type { DjangoSuccessResponse } from "@/types";
import type { UniversityStatistics } from "../types";
export const getUnveristeOverView = async (): Promise<UniversityStatistics> =>
    (await axios.get<DjangoSuccessResponse<UniversityStatistics>>("/dashboard/admin/overview")).data.data;