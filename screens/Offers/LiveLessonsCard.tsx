import Card from '@components/UI/Card'
import Space from '@components/UI/Space'
import { AntDesign } from '@expo/vector-icons'
import useRTL from '@hooks/useRTL'
import useRTLText from '@hooks/useRTLText'
import { FC, memo } from 'react'
import { Image, StyleProp, StyleSheet, ViewStyle } from 'react-native'
import { Text, withTheme } from 'react-native-paper'
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

type Props = {
  style?: StyleProp<ViewStyle>
  theme: ReactNativePaper.Theme
  active?: boolean
}

const LiveLessonsCard: FC<Props> = ({ style, theme, active }) => {
  const progress = useDerivedValue(() => withTiming(active ? 1 : 0))
  const layoutHeight = useSharedValue<number | undefined>(undefined)
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: interpolate(progress.value, [0, 1], [-20, 0]) }],
    height: layoutHeight.value
      ? interpolate(progress.value, [0, 1], [0, layoutHeight.value])
      : undefined,
    alignItems: 'center',
  }))
  const rtlText = useRTLText()
  const rtl = useRTL()
  return (
    <Animated.View style={containerAnimatedStyle} pointerEvents="none">
      <Card
        style={[
          styles.card,
          {
            borderWidth: 0,
            backgroundColor: '#0002',
            flexDirection: rtl ? 'row-reverse' : 'row',
          },
          style,
        ]}
        onLayout={e => {
          layoutHeight.value = e.nativeEvent.layout.height + theme.spacing.s * 2 + 32
        }}>
        <Image
          source={require('@assets/images/live-lessons-teacher.png')}
          style={{
            height: 60,
            width: undefined,
            aspectRatio: 805 / 582,
          }}
          resizeMode="contain"
        />
        <Space width={theme.spacing.m} />
        <Text variant="titleSmall" style={[styles.text, rtlText]}>
          {t('twentyPlusHourOfLive')}
        </Text>
      </Card>
      <Space height={theme.spacing.m} />
      <AntDesign name="plus" size={32} color="white" />
      <Space height={theme.spacing.m} />
    </Animated.View>
  )
}
export default memo(withTheme(LiveLessonsCard))
const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: 'center',
  },
  text: {
    flex: 1,
    fontWeight: 'bold',
    color: 'white',
  },
})
