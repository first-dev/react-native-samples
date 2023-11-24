import Card from '@components/UI/Card'
import PlatformTouchable from '@components/UI/PlatformTouchable'
import Space from '@components/UI/Space'
import { FontAwesome } from '@expo/vector-icons'
import { LiveChatOffer } from '@models/offers'
import { FC, memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
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
  onSelect?: (offerId: string) => void
  offer: LiveChatOffer
  selectedId: SharedValue<string>
}

const LiveChatOfferCard: FC<Props> = ({ style, theme, selectedId, offer, onSelect }) => {
  const { t } = useTranslation()
  const progress = useDerivedValue(() =>
    withTiming(selectedId.value === offer.id ? 1 : 0, { duration: 200 }),
  )
  const cardAnimatedStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(progress.value, [0, 1], ['transparent', theme.colors.primary]),
    opacity: interpolate(progress.value, [0, 1], [0.8, 1]),
  }))
  const checkCircleAnimatedStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    right: -6,
    backgroundColor: theme.colors.primary,
    borderRadius: 100,
    top: -6,
    opacity: progress.value,
    transform: [{ scale: progress.value }],
  }))
  return (
    <PlatformTouchable onPress={() => onSelect?.(offer.id)}>
      <Card animated style={[styles.card, cardAnimatedStyle, style]}>
        <Image
          source={require('@assets/images/live-lessons-teacher.png')}
          style={{
            height: '100%',
            width: undefined,
            aspectRatio: 805 / 582,
          }}
          resizeMode="contain"
        />
        <Space width={theme.spacing.m} />
        <Text variant="bodyMedium" style={styles.text}>
          {t(offer.duration)}
        </Text>
        <View style={{ flex: 1 }} />
        <View style={styles.pricesContainer}>
          {offer.price !== offer.basePrice && (
            <Text
              variant="bodySmall"
              style={[
                styles.text,
                { color: theme.colors.red, opacity: 0.5, textDecorationLine: 'line-through' },
              ]}>
              {offer.basePrice} DH
            </Text>
          )}
          <Text variant="bodyMedium" style={[styles.text, { color: theme.colors.tertiary }]}>
            {offer.price} DH
          </Text>
        </View>
        <Animated.View style={checkCircleAnimatedStyle}>
          <FontAwesome name="check-circle" size={24} color="white" style={{ marginVertical: -4 }} />
        </Animated.View>
      </Card>
    </PlatformTouchable>
  )
}

export default memo(withTheme(LiveChatOfferCard))
const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 80,
  },
  text: {
    fontWeight: 'bold',
  },
  pricesContainer: {
    alignItems: 'center',
  },
})
