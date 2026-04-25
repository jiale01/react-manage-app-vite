const TOKEN_KEY = 'token_key'
const cacheToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token)
}

const getToken = () => {
  return localStorage.getItem(TOKEN_KEY)
}

const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY)
}

export {
  cacheToken,
  getToken,
  removeToken
}
