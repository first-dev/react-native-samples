import { getLivesList, GET_LIVES_LIST_LIMIT } from '@apis/v1/get-lives-list'
import useAuthState from '@hooks/useAuthState'
import { useInfiniteQuery } from '@tanstack/react-query'
import { merge } from 'lodash'
import { PartialDeep } from 'type-fest'

const useLiveLessonsListInfiniteQuery = (
  props?: PartialDeep<Parameters<typeof getLivesList>[0]>,
) => {
  const { auth } = useAuthState()
  return useInfiniteQuery({
    queryKey: ['liveLessonsList', props],
    queryFn: async context => {
      const { offset = 0, limit = GET_LIVES_LIST_LIMIT } = context.pageParam ?? {}
      const finalProps = merge(
        {
          userId: auth.userId,
          offset: offset,
          limit,
          filter: {
            status: 'ongoing' as any,
          },
        },
        props ?? {},
      )
      const { items, count } = await getLivesList(finalProps)
      return {
        items,
        offset,
        limit,
        count,
      }
    },
    getNextPageParam: lastPage => {
      const { count, limit, offset } = lastPage
      const newOffset = offset + limit
      if (newOffset >= count) return
      return {
        offset: newOffset,
        limit: GET_LIVES_LIST_LIMIT,
      }
    },
  })
}

export default useLiveLessonsListInfiniteQuery
