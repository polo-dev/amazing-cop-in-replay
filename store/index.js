export const state = () => {
  return {
  auth: false
  }
}

export const mutations = {
  SET_AUTH (state, auth) {
    state.auth = auth || false
  }
}

export const getters = {
  isAuthenticated (state) {
    return state.auth
  },
  loggedUser (state) {
    return state.auth
  }
}
