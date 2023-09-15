import { IVideo } from "../types/videos";

export let dbData: Record<string, any[]> = {
  videos: []
}

export const db = <T,>(clearData?: boolean): Record<string, T[]> => {
  if (clearData) {
    dbData = {}
    return dbData
  }

  return dbData
}
