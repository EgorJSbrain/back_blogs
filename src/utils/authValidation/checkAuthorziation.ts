import { authUser } from '../../db/db'

export const checkAuthorziation = (authToken?: string): boolean => {
  const code = authToken?.split(' ')[1]

  if (code === authUser.password) {
    return true
  }

  return false
}
