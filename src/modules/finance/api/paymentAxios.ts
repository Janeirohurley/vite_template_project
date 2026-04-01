import { createModuleAxios } from "@/lib/createModuleAxios";

const paymentAxios = createModuleAxios("dashboard/finance/");
export default paymentAxios;
