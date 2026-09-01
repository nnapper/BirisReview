const { VITE_VER, VITE_USER_GROUP, VITE_SERVER_AD, VITE_SERVER_APP, VITE_SERVER_BMAP } =
  import.meta.env

const userAuth = '_fuhao_'
const appAuth = '_fuhao-biris-admin_'
const httpHeaderSecurity = 'x-access-token'


const clientVer = VITE_VER
const adminUserGroup = VITE_USER_GROUP
const adServer = VITE_SERVER_AD
const appServer = VITE_SERVER_APP
const bmapServer = VITE_SERVER_BMAP
const app = 'BirisAdmin'

export {
  appServer, adServer, bmapServer,
  userAuth, appAuth, clientVer, adminUserGroup, app,
  httpHeaderSecurity
}
