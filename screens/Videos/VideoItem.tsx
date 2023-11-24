import Card from '@components/UI/Card'
import Depth from '@components/UI/Depth'
import PlatformTouchable from '@components/UI/PlatformTouchable'
import Space from '@components/UI/Space'
import { VideoDetails } from '@models/content'
import { format } from 'date-fns'
import { Image } from 'expo-image'
import { FC } from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import { Divider, Text, useTheme } from 'react-native-paper'

type Props = {
  style?: StyleProp<ViewStyle>
  videoDetails: VideoDetails
  selected: boolean
  index: number
  onVideoPress?: () => void
  onTestPress?: () => void
}

const VideoItem: FC<Props> = ({
  style,
  videoDetails,
  index,
  selected,
  onTestPress,
  onVideoPress,
}) => {
  const theme: ReactNativePaper.Theme = useTheme()

  return (
    <Depth depth={4} color="#dbdbdb" exactColor>
      <View
        style={{
          position: 'absolute',
          zIndex: 1,
          right: -14,
          top: 0,
          bottom: 0,
          justifyContent: 'center',
        }}>
        <View
          style={{
            width: 28,
            height: 28,
            backgroundColor: '#dbdbdb',
            borderRadius: 100,
            borderWidth: 2,
            borderColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            variant="labelLarge"
            style={{
              color: 'white',
              lineHeight: 22,
              // textAlign: 'center',
              // textAlignVertical: 'center',
            }}>
            {index + 1}
          </Text>
        </View>
      </View>
      <Card style={[{ padding: 0, overflow: 'hidden' }, style]}>
        <PlatformTouchable
          onPress={onVideoPress}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: theme.spacing.l,
            backgroundColor: selected ? 'rgba(143, 92, 234, 0.1)' : undefined,
          }}>
          <Image
            source={require('@assets/images/play-icon-black.png')}
            style={{
              width: 14,
              aspectRatio: 1,
              tintColor: selected ? '#8f5cea' : undefined,
            }}
            contentFit="contain"
          />
          <Space />
          <Text
            variant="bodyMedium"
            numberOfLines={1}
            style={{
              flex: 1,
              fontWeight: 'bold',
              color: selected ? '#8f5cea' : undefined,
            }}>
            {videoDetails.title}
          </Text>
          <Space />
          <Text
            variant="labelMedium"
            style={{
              fontWeight: 'bold',
              color: selected ? '#8f5cea' : undefined,
            }}>
            {format(videoDetails.length * 1000, 'mm:ss')}
          </Text>
        </PlatformTouchable>
        <Divider />
        <PlatformTouchable
          onPress={onTestPress}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: theme.spacing.l,
          }}>
          <Image
            source={require('@assets/images/quizzes-icon-2.png')}
            style={{
              width: 14,
              aspectRatio: 1,
            }}
            contentFit="contain"
          />
          <Space />
          <Text
            variant="bodyMedium"
            numberOfLines={1}
            style={{
              fontWeight: 'bold',
              flex: 1,
            }}>
            this is a long title
          </Text>
        </PlatformTouchable>
      </Card>
    </Depth>
  )
}
export default VideoItem
