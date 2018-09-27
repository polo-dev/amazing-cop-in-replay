export const state = () => {
  return {
    access_token: false
  }
}

export const mutations = {
  SET_TOKEN (state, access_token) {
    state.access_token = access_token || false
  }
}

export const getters = {
  isAuthenticated (state) {
    return !!state.access_token
  },
  loggedUser (state) {
    return state.access_token
  }
}
