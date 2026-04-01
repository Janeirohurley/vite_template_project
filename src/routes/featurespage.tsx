import { createFileRoute } from '@tanstack/react-router'
import FeaturesPage from "@/modules/home/FeaturesPage"
export const Route = createFileRoute('/featurespage')({
  component: FeaturesPage,
})


