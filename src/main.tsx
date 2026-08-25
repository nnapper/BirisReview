import React from 'react'
import { createRoot } from 'react-dom/client'

import { Provider } from 'react-redux'
import { store } from './store'
import { router } from './router'
import { RouterProvider } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import './styles/index.css'
const root = createRoot(document.getElementById('root') as HTMLElement)
const routerInstance = router(store)

// read data from localStorage
// dispatch(updateSetting)

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <MantineProvider>
        <RouterProvider router={routerInstance} />
      </MantineProvider>
    </Provider>
  </React.StrictMode>,
)
