import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/galereia')({
  component: GalleryLayout,
})

function GalleryLayout() {
  return <Outlet />
}
