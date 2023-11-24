import useRTL from '@hooks/useRTL'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native'
import { Text, useTheme } from 'react-native-paper'

type Props = {
  style?: StyleProp<ViewStyle>
  totalPrice?: number
}

const CheckoutHeader: FC<Props> = ({ style, totalPrice }) => {
  const theme: ReactNativePaper.Theme = useTheme()
  const { t } = useTranslation()
  const rtl = useRTL()
  return (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal: theme.spacing.screenHorizontalSpacing,
          paddingVertical: theme.spacing.xl,
          borderBottomWidth: theme.spacing.borderWidthXS,
          borderColor: theme.colors.outline,
          flexDirection: rtl ? 'row-reverse' : 'row',
        },
        style,
      ]}>
      <Text variant="headlineMedium" style={styles.text}>
        {t('total')}
      </Text>
      <Text variant="headlineMedium" style={[styles.text, { color: theme.colors.tertiary }]}>
        {totalPrice}
        <Text
          variant="headlineMedium"
          style={[styles.text, { color: theme.colors.tertiary, fontSize: 16 }]}>
          {' DH'}
        </Text>
      </Text>
    </View>
  )
}
export default CheckoutHeader
const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    // important for gesture handler to insure react-native doesn't remove the native View
    backgroundColor: 'transparent',
  },
  text: {
    fontWeight: 'bold',
  },
})
