import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store'
import { router } from './router'
import { RouterProvider } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/notifications/styles.css'
import './styles/index.css'
import { Notifications } from '@mantine/notifications'

const root = createRoot(document.getElementById('root') as HTMLElement)
const routerInstance = router(store)

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <MantineProvider>
        <Notifications />
        <RouterProvider router={routerInstance} />
      </MantineProvider>
    </Provider>
  </React.StrictMode>,
)
