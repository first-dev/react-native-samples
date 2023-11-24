import { getALLfields } from '@apis/v1/get-all-fields'
import { useQuery } from '@tanstack/react-query'

const useAllFieldsQuery = () => {
  return useQuery(['allFields'], () => getALLfields())
}

export default useAllFieldsQuery
