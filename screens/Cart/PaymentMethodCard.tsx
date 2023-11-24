import Card from '@components/UI/Card'
import Icon from '@components/UI/Icon'
import PlatformTouchable from '@components/UI/PlatformTouchable'
import Space from '@components/UI/Space'
import useRTL from '@hooks/useRTL'
import useRTLText from '@hooks/useRTLText'
import { PaymentMethod } from '@models/offers'
import Color from 'color'
import { FC, memo, ReactNode, useState } from 'react'
import { Image, ImageSourcePropType, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { Text, useTheme } from 'react-native-paper'
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
  label: string
  description?: string
  icon: ImageSourcePropType
  footer?: ReactNode
  selectedMethod: SharedValue<PaymentMethod>
  method: PaymentMethod
}

const PaymentMethodCard: FC<Props> = ({
  style,
  label,
  description,
  icon,
  footer,
  selectedMethod,
  method,
}) => {
  const theme: ReactNativePaper.Theme = useTheme()
  const progress = useDerivedValue(() =>
    withTiming(selectedMethod.value === method ? 1 : 0, { duration: 200 }),
  )
  const checkCircleSelectedColor = Color(theme.colors.secondary).alpha(0.4).rgb().string()
  const borderSelectedColor = Color(theme.colors.secondary).alpha(0.6).rgb().string()
  const cardAnimatedStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      progress.value,
      [0, 1],
      [theme.colors.outline, borderSelectedColor],
    ),
  }))
  const checkCircleAnimatedStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      progress.value,
      [0, 1],
      [theme.colors.outline, checkCircleSelectedColor],
    ),
  }))
  const iconAnimatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }))
  const [descriptionMaxHeight, setDescriptionMaxHeight] = useState<number>()
  const descriptionAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: descriptionMaxHeight
        ? interpolate(progress.value, [0, 1], [0, descriptionMaxHeight])
        : undefined,
      overflow: 'hidden',
    }
  })
  const rtl = useRTL()
  const rtlText = useRTLText()

  return (
    <PlatformTouchable onPress={() => (selectedMethod.value = method)}>
      <Card animated style={[cardAnimatedStyle, style]}>
        <View
          style={{
            flexDirection: rtl ? 'row-reverse' : 'row',
            alignItems: 'center',
          }}>
          <Animated.View
            style={[
              checkCircleAnimatedStyle,
              {
                borderRadius: 100,
                borderWidth: theme.spacing.borderWidthM,
                padding: theme.spacing.xs,
              },
            ]}>
            <Animated.View style={iconAnimatedStyle}>
              <Icon
                source={{ pack: 'FontAwesome', name: 'check' }}
                size={16}
                color={theme.colors.primary}
              />
            </Animated.View>
          </Animated.View>
          <Space width={theme.spacing.m} />
          <Text numberOfLines={1} variant="titleMedium" style={[{ flex: 1 }, rtlText]}>
            {label}
          </Text>
          <Space width={theme.spacing.m} />
          {icon && (
            <Image source={icon} style={{ width: 30, aspectRatio: 1 }} resizeMode="contain" />
          )}
        </View>
        {(description || footer) && (
          <Animated.View
            style={descriptionAnimatedStyle}
            onLayout={
              !descriptionMaxHeight
                ? e => {
                    if (e.nativeEvent.layout.width === 0) return
                    if (descriptionMaxHeight) return
                    setDescriptionMaxHeight(e.nativeEvent.layout.height)
                  }
                : undefined
            }>
            {description && (
              <>
                <Space height={theme.spacing.m} />
                <Text variant="bodyMedium">{description}</Text>
              </>
            )}
            {footer && (
              <>
                <Space />
                {footer}
              </>
            )}
          </Animated.View>
        )}
      </Card>
    </PlatformTouchable>
  )
}
export default memo(PaymentMethodCard)
