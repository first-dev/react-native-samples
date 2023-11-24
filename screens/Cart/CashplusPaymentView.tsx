import Card from '@components/UI/Card'
import Icon from '@components/UI/Icon'
import PlatformTouchable from '@components/UI/PlatformTouchable'
import Screen from '@components/UI/Screen'
import Space from '@components/UI/Space'
import useRTL from '@hooks/useRTL'
import useRTLText from '@hooks/useRTLText'
import Color from 'color'
import * as Clipboard from 'expo-clipboard'
import { FC, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, Image, Share, StyleProp, StyleSheet, ViewStyle } from 'react-native'
import { Text, useTheme } from 'react-native-paper'
import Toast from 'react-native-root-toast'

type Props = {
  style?: StyleProp<ViewStyle>
  paymentCode?: string
}

const COPY_EASTER_EGG = [
  'Copied!',
  'Double Copy!',
  'Triple Copy!',
  'Dominating!!',
  'Rampage!!',
  'Mega Copy!!',
  'Unstoppable!!',
  'Wicked Sick!!',
  'Monster Copy!!!',
  'GODLIKE!!!',
  'BEYOND GODLIKE!!!!',
]
const COPY_EASTER_EGG_LENGTH = COPY_EASTER_EGG.length
const TOAST_DURATION = 1000

const CashplusPaymentView: FC<Props> = ({ style, paymentCode }) => {
  const theme: ReactNativePaper.Theme = useTheme()
  const [copyCount, setCopyCount] = useState(0)
  const [lastCopyTime, setLastCopyTime] = useState(0)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setCopyCount(0)
    }, TOAST_DURATION * 4)
    return () => clearTimeout(timeout)
  }, [copyCount])
  const copyCodeHandler = useCallback(() => {
    if (!paymentCode) return
    const now = new Date().getTime()
    if (now - lastCopyTime < TOAST_DURATION) return
    Toast.show(COPY_EASTER_EGG[copyCount] ?? COPY_EASTER_EGG[COPY_EASTER_EGG_LENGTH - 1], {
      duration: TOAST_DURATION,
      containerStyle: { borderRadius: 100, paddingHorizontal: theme.spacing.m },
      position: -theme.spacing.xl,
      backgroundColor:
        COPY_EASTER_EGG_LENGTH - copyCount > 2 ? theme.colors.green : theme.colors.red,
      opacity: 1,
    })
    setCopyCount(o => o + 1)
    setLastCopyTime(now)
    Clipboard.setStringAsync('hello world')
  }, [
    copyCount,
    lastCopyTime,
    paymentCode,
    theme.colors.green,
    theme.colors.red,
    theme.spacing.m,
    theme.spacing.xl,
  ])
  const rtlText = useRTLText()
  const { t } = useTranslation()
  const rtl = useRTL()

  return (
    <Screen
      padding
      scrollable
      style={[styles.container, style]}
      scrollViewProps={{ contentContainerStyle: { flexGrow: 1 } }}>
      <Image
        source={require('@assets/images/cashplus-wide-logo.png')}
        style={{
          width: '50%',
          height: undefined,
          aspectRatio: 1024 / 326,
        }}
        resizeMode="contain"
      />
      <Space height={theme.spacing.xl} />
      <Text variant="titleMedium" style={rtlText}>
        {t('yourPayCode')}
      </Text>
      <Space />
      <PlatformTouchable activeOpacity={0.8} onPress={copyCodeHandler}>
        <Card
          style={[
            styles.codeContainer,
            {
              borderWidth: 0,
              backgroundColor: '#008b97',
              padding: 0,
            },
          ]}>
          <Space width={24 + 2 * theme.spacing.m} />
          {paymentCode ? (
            <Text
              variant="titleLarge"
              style={{ color: theme.colors.onPrimary, fontWeight: 'bold' }}>
              {paymentCode}
            </Text>
          ) : (
            <ActivityIndicator color={theme.colors.onPrimary} />
          )}
          <PlatformTouchable
            onPress={() => {
              if (paymentCode)
                Share.share({
                  message: paymentCode,
                })
            }}>
            <Icon
              source={{ pack: 'MaterialIcons', name: 'share' }}
              color={theme.colors.onPrimary}
              style={{
                backgroundColor: Color(theme.colors.onPrimary).alpha(0.2).rgb().string(),
                padding: theme.spacing.m,
                borderRadius: 100,
              }}
            />
          </PlatformTouchable>
        </Card>
      </PlatformTouchable>
      <Space height={theme.spacing.xs} />
      <Text variant="labelSmall" style={{ textAlign: 'center', opacity: 0.7 }}>
        {t('clickToCopy')}
      </Text>
      <Space height={theme.spacing.xl} />
      <Card
        style={{
          backgroundColor: Color(theme.colors.info).alpha(0.2).rgb().string(),
          borderWidth: 0,
          flexDirection: rtl ? 'row-reverse' : 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Icon source={{ pack: 'MaterialIcons', name: 'info' }} color={theme.colors.info} />
        <Space />
        <Text variant="bodyLarge" style={[{ flex: 1 }, rtlText]}>
          {t('pleaseProvideThisNumber')}
        </Text>
      </Card>
      <Space />
      {/* <Button
        style={{
          marginHorizontal: theme.spacing.m,
        }}
        contentStyle={{
          backgroundColor: '#008b97',
          borderColor: Color('#008b97').mix(Color('white'), 0.4).hex(),
        }}
        backdropStyle={{
          backgroundColor: '#ffd263',
        }}
        round
        label="Near by agencies"
        textColor="white"
        depth={4}
        rightIcon={{ pack: 'Ionicons', name: 'location-outline' }}
      /> */}
    </Screen>
  )
}
export default CashplusPaymentView
const styles = StyleSheet.create({
  container: {},
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 100,
    alignItems: 'center',
  },
})
