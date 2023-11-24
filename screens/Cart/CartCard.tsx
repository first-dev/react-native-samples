import Card from '@components/UI/Card'
import Space from '@components/UI/Space'
import { BaseOffer, LiveChatOffer } from '@models/offers'
import { FC, memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { Divider, Text, withTheme } from 'react-native-paper'

type Props = {
  style?: StyleProp<ViewStyle>
  theme: ReactNativePaper.Theme
  baseOffer?: BaseOffer
  liveChatOffer?: LiveChatOffer
  baseOfferVariantId?: string
  baseOfferPrice?: number
  totalPrice?: number
}

const CartCard: FC<Props> = ({
  style,
  theme,
  baseOffer,
  liveChatOffer,
  baseOfferVariantId,
  baseOfferPrice,
  totalPrice,
}) => {
  const { t } = useTranslation()
  const baseOfferVariant = useMemo(() => baseOffer?.variants.find(v => v.id === baseOfferVariantId), [baseOffer?.variants, baseOfferVariantId])
  return (
    <Card style={[styles.container, style]}>
      {baseOffer && (
        <View style={[styles.row, { marginHorizontal: theme.spacing.m }]}>
          <Text variant="bodyMedium" style={styles.text}>
            {baseOffer.title} •{' '}
            <Text style={{ fontWeight: 'normal' }}>{baseOfferVariant?.title ?? t(baseOfferVariantId ?? '')}</Text>
          </Text>
          <Text variant="bodyMedium" style={[styles.text, { color: theme.colors.tertiary }]}>
            {baseOfferPrice} DH
          </Text>
        </View>
      )}
      <Space height={theme.spacing.xs} />
      {liveChatOffer && (
        <View style={[styles.row, { marginHorizontal: theme.spacing.m }]}>
          <Text variant="bodyMedium" style={styles.text}>
            {'Live Chat'} •{' '}
            <Text style={{ fontWeight: 'normal' }}>{t(liveChatOffer.duration)}</Text>
          </Text>
          <Text variant="bodyMedium" style={[styles.text, { color: theme.colors.tertiary }]}>
            {liveChatOffer.price} DH
          </Text>
        </View>
      )}
      <Space height={theme.spacing.m} />
      <Divider style={{ backgroundColor: 'black' }} />
      <Space height={theme.spacing.m} />
      <View style={[styles.row, { marginHorizontal: theme.spacing.m }]}>
        <Text variant="bodyMedium" style={styles.text}>
          Total
        </Text>
        <Text variant="bodyMedium" style={[styles.text, { color: theme.colors.tertiary }]}>
          {totalPrice} DH
        </Text>
      </View>
    </Card>
  )
}
export default memo(withTheme(CartCard))
const styles = StyleSheet.create({
  container: {
    flex: 1,
    elevation: 9,
    borderWidth: 0,
    paddingHorizontal: 0,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    fontWeight: 'bold',
  },
})
