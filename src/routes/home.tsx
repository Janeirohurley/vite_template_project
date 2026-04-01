import { createFileRoute } from '@tanstack/react-router'
import Home from "@/modules/home/HomePage"
export const Route = createFileRoute('/home')({
  component: Home,
})


