import { SortDirections } from './global'

export enum RequestParamName {
  pageNumber = 'pageNumber',
  pageSize = 'pageSize',
  sortDirection = 'sortDirection'
}

export const requestParamErrorMessage = {
  page: `${RequestParamName.pageNumber} should be correct number`,
  pageSize: `${RequestParamName.pageSize} should be correct number`,
  sortDirection: `sortDirection should be correct: ${SortDirections.asc} or ${SortDirections.desc}`
}
