import Screen from '@components/UI/Screen'
import Space from '@components/UI/Space'
import { useKezakooContent } from '@hooks/useKezakooContent'
import { MainStackParamList } from '@navigation/MainStackNavigator'
import { useHeaderHeight } from '@react-navigation/elements'
import { StackScreenProps } from '@react-navigation/stack'
import { FlashList } from '@shopify/flash-list'
import { FC, useEffect, useMemo, useState } from 'react'
import { useWindowDimensions } from 'react-native'
import { useTheme } from 'react-native-paper'
import Video from 'react-native-video'
import VideoItem from './VideoItem'

type Props = StackScreenProps<MainStackParamList, 'videos'>

const Videos: FC<Props> = ({ route, navigation }) => {
  const { lessonId } = route.params
  const theme: ReactNativePaper.Theme = useTheme()
  const window = useWindowDimensions()
  const { getVideosByLessonId, getLessonById } = useKezakooContent()
  const videosData = useMemo(() => getVideosByLessonId(lessonId), [getVideosByLessonId, lessonId])
  const [selectedVideo, setSelectedVideo] = useState('')
  const { getVideoUriById } = useKezakooContent()
  const videoUri = useMemo(() => getVideoUriById(selectedVideo), [getVideoUriById, selectedVideo])
  useEffect(() => {
    if (!selectedVideo) setSelectedVideo(videosData[0].id)
  }, [selectedVideo, videosData])
  useEffect(() => {
    navigation.setOptions({
      title: getLessonById(lessonId)?.title,
    })
  }, [getLessonById, lessonId, navigation])
  const headerHeight = useHeaderHeight()

  return (
    <Screen>
      <Space height={headerHeight} />
      <Video
        // source={{
        //   uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        // }}
        source={{
          uri: videoUri,
        }}
        controls
        style={{
          width: window.width,
          height: window.width * (9 / 16),
        }}
      />
      <FlashList
        estimatedItemSize={143}
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.screenHorizontalSpacing,
          paddingTop: theme.spacing.xl,
          paddingBottom: theme.spacing.screenHorizontalSpacing,
        }}
        data={videosData}
        extraData={selectedVideo}
        ItemSeparatorComponent={Space}
        renderItem={({ index, item }) => (
          <VideoItem
            key={item.id}
            videoDetails={item}
            index={index}
            selected={selectedVideo == item.id}
            onVideoPress={() => setSelectedVideo(item.id)}
          />
        )}
      />
    </Screen>
  )
}
export default Videos
