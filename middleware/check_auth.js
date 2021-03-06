import { getUserFromCookie, getUserFromLocalStorage } from '~/utils/auth'

export default function ({ store, req }) {
  // If nuxt generate, pass this middleware
 if (process.server && !req) return
 const access_token = process.server ? getUserFromCookie(req) : getUserFromLocalStorage()
 store.commit('SET_TOKEN', access_token)
}