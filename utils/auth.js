import Cookie from 'cookie'

export const setToken = (access_token) => {
   if (process.SERVER_BUILD) return
   window.localStorage.setItem('access_token', access_token)
   Cookie.set('access_token', access_token)
 }
 
 export const unsetToken = () => {
   if (process.SERVER_BUILD) return
   window.localStorage.removeItem('access_token')
   Cookie.remove('access_token')
 }

export const getUserFromCookie = (req) => {
   if (!req.headers.cookie) return
   const access_token = req.headers.cookie.split(';').find(c => c.trim().startsWith('access_token='))
   if (!access_token) return
   let token = access_token.split('=')[1]
   return token
 }

 export const getUserFromLocalStorage = () => {
   const json = window.localStorage.access_token
   return json ? JSON.parse(json) : undefined
 }
 