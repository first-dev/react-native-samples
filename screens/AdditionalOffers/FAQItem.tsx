import Icon from '@components/UI/Icon'
import PlatformTouchable from '@components/UI/PlatformTouchable'
import Space from '@components/UI/Space'
import { FAQ } from '@constants/faq'
import { FC, memo } from 'react'
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native'
import { Text, withTheme } from 'react-native-paper'
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

type Props = {
  style?: StyleProp<ViewStyle>
  theme: ReactNativePaper.Theme
  faq: FAQ
  focusedIndex: SharedValue<number>
  index: number
  onPress?: (index: number) => void
}

const FAQItem: FC<Props> = ({ style, theme, faq, onPress, focusedIndex, index }) => {
  const progress = useDerivedValue(() =>
    withTiming(focusedIndex.value === index ? 1 : 0, { duration: 200 }),
  )
  const answerHeight = useSharedValue<number | undefined>(undefined)
  const answerAnimatedStyle = useAnimatedStyle(() => ({
    height: answerHeight.value
      ? interpolate(progress.value, [0, 1], [0, answerHeight.value])
      : undefined,
    overflow: 'hidden',
  }))
  const plusIconAnimatedStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    position: 'absolute',
  }))
  const minusIconAnimatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    position: 'absolute',
  }))
  return (
    <View style={[styles.container, style]}>
      <PlatformTouchable style={styles.questionContainer} onPress={() => onPress?.(index)}>
        <View style={{ width: 24, aspectRatio: 1 }}>
          <Animated.View style={plusIconAnimatedStyle}>
            <Icon source={{ pack: 'AntDesign', name: 'pluscircle' }} color={theme.colors.surface} />
          </Animated.View>
          <Animated.View style={minusIconAnimatedStyle}>
            <Icon
              source={{ pack: 'AntDesign', name: 'minuscircle' }}
              color={theme.colors.surface}
            />
          </Animated.View>
        </View>
        <Space width={theme.spacing.s} />
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text
            numberOfLines={2}
            variant="bodyMedium"
            style={{ color: theme.colors.surface, fontWeight: 'bold', position: 'absolute' }}>
            {faq.question}
          </Text>
          {/* workaround to fix number of lines to 2 (this is life with react native ;)) */}
          <Text variant="bodyLarge">{`\n`}</Text>
        </View>
      </PlatformTouchable>
      <Animated.View style={answerAnimatedStyle}>
        <View
          onLayout={e =>
            !answerHeight.value &&
            (answerHeight.value = e.nativeEvent.layout.height + theme.spacing.s)
          }
          style={{
            marginTop: theme.spacing.s,
            padding: theme.spacing.m,
            backgroundColor: '#0002',
            borderRadius: theme.roundness,
          }}>
          <Text variant="bodySmall" style={{ color: theme.colors.surface}}>
            {faq.answer}
          </Text>
        </View>
      </Animated.View>
    </View>
  )
}
export default memo(withTheme(FAQItem))
const styles = StyleSheet.create({
  container: {},
  questionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})
