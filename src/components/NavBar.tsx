import { Button, Flex, Text } from '@mantine/core'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../features/auth/authSlice'
import { useNavigate } from 'react-router'
import { appAuth, clientVer, userAuth } from '../config'
import type { RootState } from '../store'

export const NavBar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleLogout = () => {
    dispatch(logout())
    localStorage.removeItem(userAuth)
    localStorage.removeItem(appAuth)
    navigate('/login')
  }

  const username = useSelector((state: RootState) => state.auth.username)

  return (
    <Flex
      gap="md"
      justify="space-between"
      bg="var(--mantine-color-blue-6)"
      mih={50}
      align="center"
    >
      <Text size="md" c="white" mx="sm">
        {'Biris Review ' + clientVer}
      </Text>
      <Button onClick={handleLogout} bg="transparent">
        Logout ({username ? username.split(' ')[0] : ''})
      </Button>
    </Flex>
  )
}
