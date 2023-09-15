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
// export const db = <T,>(data?: string, clearData?: boolean): Record<string, T[]> => {  
//   if (data && !dbData[data]) {
//     const qwe = {
//       ...dbData,
//       [data]: []
//     } as any

//     dbData = qwe

//     return {
//       ...dbData,
//       [data]: []
//     } as any
//   }

//   return dbData
// }
