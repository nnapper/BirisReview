import { Button, TextInput, Text } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useAuthenticateMutation, useLazyBelongsQuery } from '../auth/authApi'
import { setAuthUser } from './authSlice'
import { useDispatch, useSelector } from 'react-redux'
import { appAuth, userAuth } from './../../config'
import { useNavigate } from 'react-router'
import { useEffect, useState } from 'react'
import '../../styles/App.css'
import { useFetchPdfsQuery } from '../pdf/pdfApi'
import { setPdfs } from '../pdf/pdfSlice'
import { app } from '../../config'
import { type RootState } from '../../store'

export const Login = () => {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      snumber: 's127577',
      password: 'Sacsummer2026.b',
    },

    validate: {
      snumber: value =>
        /[s, p]\d{3,6}/.test(value) ? null : (
          'Your Caltrans ID starts with p or s'
        ),
    },
  })

  const [errorMessage, setErrorMessage] = useState<string>('')

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [authenticate] = useAuthenticateMutation()
  const [authorized] = useLazyBelongsQuery()
  const authorizeUser = async () => {
    try {
      const appAuthObj = await authorized().unwrap()
      localStorage.setItem(appAuth, appAuthObj.token)
      dispatch(setAuthUser(appAuthObj))
      navigate('/pdf')
    } catch (err) {
      console.log('app auth error', err)
      setErrorMessage(
        'You are not authorized.  Please contact andrew.ao@dot.ca.gov.',
      )
      localStorage.removeItem(appAuth)
    }
  }
  const authenticateUser = async () => {
    const { snumber, password } = form.getValues()
    try {
      const userAuthObj = await authenticate({
        snumber,
        password,
        app: app,
      }).unwrap()
      localStorage.setItem(userAuth, userAuthObj.token)
    } catch (err) {
      console.log('user auth error', err)
      form.setErrors({ snumber: 'Check s-number', password: 'Check password' })
      return
    }
  }
  const handleLogin = async () => {
    await authenticateUser()
    authorizeUser()
  }

  const { data: pdfsData } = useFetchPdfsQuery()
  useEffect(() => {
    if (pdfsData) {
      dispatch(setPdfs({ pdfs: pdfsData }))
      console.log('updating pdfs to', pdfsData)
    }

    const appAuthToken = localStorage.getItem(appAuth)
    if (appAuthToken) {
      console.log('app auth is', appAuthToken, 'token is', token)
      dispatch(setAuthUser({ token: appAuthToken }))
    }
  }, [pdfsData, dispatch])

  const token = useSelector((state: RootState) => state.auth.token)
  useEffect(() => {
    if (token) {
      console.log('auto login')
      navigate('/pdf')
    }
  }, [token])

  return (
    <div className="login">
      Login
      <form
        onSubmit={form.onSubmit(value => {
          console.log('Login submission', value)
          handleLogin()
        })}
      >
        <TextInput
          label="Caltrans ID"
          placeholder="s-number"
          key={form.key('snumber')}
          {...form.getInputProps('snumber')}
        />
        <TextInput
          label="Password"
          placeholder="password"
          key={form.key('password')}
          {...form.getInputProps('password')}
        />

        {errorMessage !== '' && <Text c="red">{errorMessage}</Text>}
        <Button type="submit">Submit</Button>
      </form>
    </div>
  )
}
