import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/proekty')({
  component: ProjectsLayout,
})

function ProjectsLayout() {
  return <Outlet />
}
