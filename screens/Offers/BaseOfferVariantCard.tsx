import Card from '@components/UI/Card'
import PlatformTouchable from '@components/UI/PlatformTouchable'
import { FontAwesome } from '@expo/vector-icons'
import { BaseOffer } from '@models/offers'
import { decode } from 'html-entities'
import { FC, memo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, ViewStyle } from 'react-native'
import { Text, withTheme } from 'react-native-paper'
import Animated, {
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
  onSelect?: (variantId: string) => void
  variant: BaseOffer['variants'][0]
  selectedVariantId: SharedValue<string | null>
}

const BaseOfferVariantCard: FC<Props> = ({
  style,
  theme,
  selectedVariantId,
  variant,
  onSelect,
}) => {
  const { t } = useTranslation()
  const progress = useDerivedValue(() =>
    withTiming(selectedVariantId.value === variant.id ? 1 : 0, { duration: 200 }),
  )
  const cardAnimatedStyle = useAnimatedStyle(() => ({
    flex: 1,
    alignItems: 'center',
    borderColor: interpolateColor(progress.value, [0, 1], ['transparent', theme.colors.primary]),
    opacity: interpolate(progress.value, [0, 1], [0.8, 1]),
    height: 56,
    paddingVertical: 0,
    justifyContent: 'center',
  }))
  const checkCircleAnimatedStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    right: -2,
    backgroundColor: theme.colors.primary,
    borderRadius: 100,
    top: -2,
    opacity: progress.value,
    transform: [{ scale: progress.value }],
  }))
  return (
    <PlatformTouchable
      style={{ flex: 1 }}
      onPress={variant.disabled ? undefined : () => onSelect?.(variant.id)}
      disabled={variant.disabled}>
      <Card animated style={[cardAnimatedStyle, style]}>
        <Text
          variant="titleMedium"
          numberOfLines={2}
          style={{
            color: variant.disabled ? theme.colors.onSurfaceDisabled : undefined,
            textAlignVertical: 'center',
            lineHeight: 20,
            marginBottom: -6,
            textAlign: 'center',
          }}>
          {variant.title ? decode(variant.title) : t(variant.id)}
        </Text>
      </Card>
      <Animated.View style={checkCircleAnimatedStyle}>
        <FontAwesome name="check-circle" size={24} color="white" style={{ marginVertical: -4 }} />
      </Animated.View>
    </PlatformTouchable>
  )
}

export default memo(withTheme(BaseOfferVariantCard))
