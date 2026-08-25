const { VITE_VER, VITE_USER_GROUP, VITE_SERVER_AD, VITE_SERVER_APP } =
  import.meta.env

const userAuth = '_fuhao_'
const appAuth = '_fuhao-biris-admin_'

const clientVer = VITE_VER
const adminUserGroup = VITE_USER_GROUP
const adServer = VITE_SERVER_AD
const appServer = VITE_SERVER_APP
const app = 'BirisAdmin'
//const adServer = "http://localhost:8082"

// console.log(clientVer)
// console.log("app server", VITE_SERVER_APP)

export { appServer, adServer, userAuth, appAuth, clientVer, adminUserGroup, app }
