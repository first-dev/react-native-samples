import { getBanners } from '@apis/v1/get-banners'
import useAuthState from '@hooks/useAuthState'
import { useQuery } from '@tanstack/react-query'

const useBannersQuery = () => {
  const { auth } = useAuthState()
  return useQuery(['banners', auth.userId], ({ queryKey }) => getBanners(queryKey[1]))
}

export default useBannersQuery
