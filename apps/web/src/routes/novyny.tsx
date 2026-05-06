import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/novyny')({
  component: NewsLayout,
})

function NewsLayout() {
  return <Outlet />
}
