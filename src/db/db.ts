export const authUser = {
  login: 'admin',
  password: 'YWRtaW46cXdlcnR5'
}

export let dbData: Record<string, any[]> = {}

export const db = <T>(
  data?: string,
  clearData?: boolean
): Record<string, T[]> => {
  if (clearData) {
    dbData = {}

    return dbData
  } else if (data && !dbData[data]) {
    dbData[data] = []

    return dbData
  }

  return dbData
}
