import { authUser } from '../../db/db'

export const checkAuthorziation = (authToken?: string): boolean => {
  if (authToken === `Basic ${authUser.password}`) {
    return true
  }

  return false
}
