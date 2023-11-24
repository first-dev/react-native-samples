import PlatformTouchable from '@components/UI/PlatformTouchable'
import Space from '@components/UI/Space'
import { FontAwesome } from '@expo/vector-icons'
import { BaseOffer } from '@models/offers'
import { FC, memo, useMemo } from 'react'
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native'
import { Text, withTheme } from 'react-native-paper'
import Animated, {
  AnimatableValue,
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated'

type Props = {
  style?: StyleProp<ViewStyle>
  theme: ReactNativePaper.Theme
  offer: BaseOffer
  variantId: string | null
  selectedId?: SharedValue<string>
  onPress?: (offerId: string) => void
}

const animatingFunction = <T extends AnimatableValue>(toValue: T) => {
  'worklet'
  // return withSpring(toValue, { mass: 0.3, stiffness: 200, damping: 8 })
  return withTiming(toValue, { duration: 200 })
}

const BaseOfferCard: FC<Props> = ({ style, offer, theme, onPress, selectedId, variantId }) => {
  const selectedColor = theme.colors.primary
  const selected = selectedId?.value === offer.id
  const progress = useDerivedValue(
    () => animatingFunction(selectedId?.value === offer.id ? 1 : 0),
    [selected],
  )
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    borderWidth: theme.spacing.borderWidthM,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    overflow: 'hidden',
    borderColor: interpolateColor(progress.value, [0, 1], ['transparent', selectedColor]),
    transform: [{ translateY: interpolate(progress.value, [0, 1], [0, -10]) }],
    opacity: interpolate(progress.value, [0, 1], [0.8, 1]),
  }))
  const titleContainerAnimatedStyle = useAnimatedStyle(() => ({
    paddingHorizontal: theme.spacing.xs,
    //* workaround to fix random gap between background and border (white space)
    width: '101%',
    height: 48,
    justifyContent: 'center',
    backgroundColor: interpolateColor(progress.value, [0, 1], ['transparent', selectedColor]),
  }))
  const checkCircleAnimatedStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    right: -6,
    backgroundColor: selectedColor,
    borderRadius: 100,
    top: interpolate(progress.value, [0, 1], [-6, -16]),
    opacity: progress.value,
    transform: [{ scale: progress.value }],
  }))
  const titleAnimatedStyle = useAnimatedStyle(() => ({
    textAlign: 'center',
    color: interpolateColor(progress.value, [0, 1], ['black', 'white']),
    fontFamily: 'LeagueHelv',
  }))
  const priceTextStyle = useMemo<TextStyle>(
    () => ({
      color: theme.colors.tertiary,
      // fontWeight: 'bold',
      fontFamily: 'LeagueHelv',
    }),
    [theme.colors.tertiary],
  )
  const prices = useMemo(
    () => offer.variants.find(p => p.id === variantId) ?? offer.variants[0],
    [variantId, offer.variants],
  )
  const subtitleAnimatedStyle = useAnimatedStyle(() => ({
    height: interpolate(progress.value, [0, 1], [60, 60 + theme.spacing.m * 2]),
    justifyContent: 'center',
  }))

  return (
    <View style={styles.container}>
      <PlatformTouchable onPress={() => onPress?.(offer.id)}>
        <Animated.View style={[containerAnimatedStyle, style]}>
          <Animated.View style={titleContainerAnimatedStyle}>
            <Animated.Text ellipsizeMode="clip" numberOfLines={2} style={titleAnimatedStyle}>
              {offer.title}
            </Animated.Text>
          </Animated.View>
          <Animated.View style={subtitleAnimatedStyle}>
            <Text
              variant="titleMedium"
              style={[styles.subtitle, { paddingHorizontal: theme.spacing.s }]}>
              {offer.subtitle}
            </Text>
          </Animated.View>
          {prices ? (
            <View style={styles.priceContainer}>
              {prices.basePrice !== prices.price && (
                <Text
                  variant="bodySmall"
                  style={[
                    priceTextStyle,
                    { textDecorationLine: 'line-through', opacity: 0.5, color: theme.colors.red },
                  ]}>
                  {prices.basePrice} DH
                </Text>
              )}
              <Text variant="bodyMedium" style={priceTextStyle}>
                {prices.price} DH
              </Text>
            </View>
          ) : (
            <Space height={60} />
          )}
          <Space animated height={theme.spacing.s} />
        </Animated.View>
      </PlatformTouchable>
      <Animated.View style={checkCircleAnimatedStyle}>
        <FontAwesome name="check-circle" size={24} color="white" style={{ marginVertical: -4 }} />
      </Animated.View>
    </View>
  )
}

export default memo(withTheme(BaseOfferCard))
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subtitle: {
    textAlign: 'center',
  },
  priceContainer: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
