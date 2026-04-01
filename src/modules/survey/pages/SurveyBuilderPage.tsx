import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SurveyBuilder } from "../components/SurveyBuilder";

export const SurveyBuilderPage = () => {
  return <ProtectedRoute allowedRoles={["admin","super_admin"]}>
    <SurveyBuilder />
  </ProtectedRoute>;  
};
