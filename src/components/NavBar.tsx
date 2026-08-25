import { Button, Flex, Text } from '@mantine/core'
import { useDispatch } from 'react-redux'
import { logout } from '../features/auth/authSlice'
import { useNavigate } from 'react-router'
import { appAuth, clientVer, userAuth } from '../config'

export const NavBar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleLogout = () => {
    dispatch(logout())
    localStorage.removeItem(userAuth)
    localStorage.removeItem(appAuth)
    navigate('/login')
  }

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
        Logout
      </Button>
    </Flex>
  )
}
