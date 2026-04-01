import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SurveyBuilder } from "../components/SurveyBuilder";

export const SurveyBuilderPage = () => {
  return <ProtectedRoute requiredRole={"admin"}>
    <SurveyBuilder />
  </ProtectedRoute>;  
};
