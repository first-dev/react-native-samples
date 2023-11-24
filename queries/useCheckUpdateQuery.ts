import { checkUpdate } from '@apis/v1/check-update'
import { useQuery } from '@tanstack/react-query'

const useCheckUpdateQuery = () => {
  return useQuery(['checkUpdate'], () => checkUpdate(), {
    staleTime: Infinity,
    cacheTime: Infinity,
  })
}

export default useCheckUpdateQuery
