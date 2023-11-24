import { FC, memo } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { Text, withTheme } from 'react-native-paper'

import { StyleProp, ViewStyle } from 'react-native'
import Space from '@components/UI/Space'
import { useTranslation } from 'react-i18next'

type Props = {
  style?: StyleProp<ViewStyle>
  theme: ReactNativePaper.Theme
}

const TopSection: FC<Props> = ({ style, theme }) => {
  const { t } = useTranslation()
  return (
    <View style={[styles.container, style]}>
      <Image
        source={require('@assets/images/kezakoo-logo-unlocked.png')}
        style={{ width: 240, height: undefined, aspectRatio: 998 / 141 }}
        resizeMode="contain"
      />
      <Space height={theme.spacing.l} />
      <Text
        variant="titleLarge"
        style={{ color: theme.colors.onPrimary, textAlign: 'center' }}>
        {t('openSuccessDoors')}
      </Text>
    </View>
  )
}
export default memo(withTheme(TopSection))
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
})
