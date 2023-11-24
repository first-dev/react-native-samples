import Button from '@components/UI/Button'
import * as FileSystem from 'expo-file-system'
import Card from '@components/UI/Card'
import Icon from '@components/UI/Icon'
import PlatformTouchable from '@components/UI/PlatformTouchable'
import Screen from '@components/UI/Screen'
import Space from '@components/UI/Space'
import useRTL from '@hooks/useRTL'
import useRTLText from '@hooks/useRTLText'
import Color from 'color'
import * as Clipboard from 'expo-clipboard'
import { FC, useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, Image, Linking, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { Text, useTheme } from 'react-native-paper'
import ViewShot from 'react-native-view-shot'
import * as MediaLibrary from 'expo-media-library'
import Toast from 'react-native-root-toast'

type Props = {
  style?: StyleProp<ViewStyle>
  orderCode?: string
}

const RIB = '021 780 0000 358 030 03000 1 89'
const WireTransferPaymentView: FC<Props> = ({ style, orderCode }) => {
  const theme: ReactNativePaper.Theme = useTheme()
  const rtlText = useRTLText()
  const { t } = useTranslation()
  const rtl = useRTL()
  const contentRef = useRef<ViewShot>(null)
  const [status, requestPermission] = MediaLibrary.usePermissions()
  const [screenShotSaved, setScreenShotSaved] = useState(false)
  const saveHandler = useCallback(async () => {
    if (!orderCode) return
    if (screenShotSaved) return
    if (!status?.granted) {
      if (!(await requestPermission()).granted) return
    }
    const uri = await contentRef.current?.capture?.()
    if (!uri) return
    const newUri = uri.replace(/cache.*$/g, `cache/kezakoo-wire-transfer-order-${orderCode}.jpg`)
    await FileSystem.moveAsync({
      from: uri,
      to: newUri,
    })
    await MediaLibrary.saveToLibraryAsync(newUri)
    Toast.show(t('savedAnImage'), {
      containerStyle: { borderRadius: 100, paddingHorizontal: theme.spacing.m },
      position: -theme.spacing.xl,
    })
    setScreenShotSaved(true)
  }, [
    orderCode,
    requestPermission,
    screenShotSaved,
    status?.granted,
    t,
    theme.spacing.m,
    theme.spacing.xl,
  ])

  return (
    <Screen
      // padding
      scrollable
      style={style}
      scrollViewProps={{ contentContainerStyle: { flexGrow: 1 } }}>
      <Button
        style={{
          position: 'absolute',
          zIndex: 1,
          right: theme.spacing.screenHorizontalSpacing,
          top: theme.spacing.screenVerticalSpacing,
        }}
        buttonColor={theme.colors.secondary}
        depth={4}
        round
        compact
        rightIcon={{ pack: 'MaterialIcons', name: 'save-alt' }}
        onPress={saveHandler}
      />
      {/* @ts-ignore bug due to the removal of children prop from default props type in react 18 */}
      <ViewShot
        style={{
          backgroundColor: theme.colors.surface,
          paddingHorizontal: theme.spacing.screenHorizontalSpacing,
          paddingTop: theme.spacing.screenVerticalSpacing,
          paddingBottom: theme.spacing.m,
        }}
        ref={contentRef}
        options={{
          format: 'jpg',
          quality: 1,
        }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Image
            source={require('@assets/images/wire-transfer-logo.png')}
            style={{
              width: '50%',
              height: undefined,
              aspectRatio: 1024 / 326,
            }}
            resizeMode="contain"
          />
        </View>
        <Space height={theme.spacing.xl} />
        <PlatformTouchable
          activeOpacity={0.6}
          onPress={() => {
            Clipboard.setStringAsync(RIB)
          }}>
          <Card>
            <Text variant="labelMedium">RIB</Text>
            <Text variant="titleLarge" style={styles.text}>
              {RIB}
            </Text>
          </Card>
        </PlatformTouchable>
        <Space />
        <View style={{ flexDirection: 'row' }}>
          <Card style={{ flexGrow: 1 }}>
            <Text variant="labelMedium">NOM</Text>
            <Text variant="titleLarge" style={styles.text}>
              KEZAKOO
            </Text>
          </Card>
          <Space />
          <Card style={{ flexGrow: 1 }}>
            <Text variant="labelMedium">BANQUE</Text>
            <Text variant="titleLarge" style={styles.text}>
              Crédit du Maroc
            </Text>
          </Card>
        </View>
        <Space height={theme.spacing.xl} />
        <Text variant="titleLarge" style={[{ flex: 1, fontSize: 20 }, rtlText]}>
          {t('yourOrderNumber')}
        </Text>
        <Space height={theme.spacing.s} />
        <View
          style={{
            flexDirection: rtl ? 'row' : 'row-reverse',
            alignItems: 'center',
          }}>
          <Card
            style={{
              width: 104,
              height: 64,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
            }}>
            {orderCode ? (
              <Text variant="titleLarge" style={styles.text}>
                {orderCode}
              </Text>
            ) : (
              <ActivityIndicator color={theme.colors.primary} />
            )}
          </Card>
          <Space />
          <View style={{ flex: 1 }}>
            <Text variant="bodyMedium" style={rtlText}>
              {t('pleaseProvideThisNumber')}
            </Text>
          </View>
        </View>
      </ViewShot>
      <PlatformTouchable onPress={() => Linking.openURL('http://wa.me/212688873407')}>
        <Card
          style={{
            backgroundColor: Color(theme.colors.info).alpha(0.2).rgb().string(),
            borderWidth: 0,
            flexDirection: rtl ? 'row-reverse' : 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginHorizontal: theme.spacing.screenHorizontalSpacing,
          }}>
          <Icon source={{ pack: 'MaterialIcons', name: 'info' }} color={theme.colors.info} />
          <Space />
          <Text variant="bodySmall" style={[{ flex: 1 }, rtlText]}>
            {t('sendUsACopyOfTheReceipt')}
          </Text>
        </Card>
      </PlatformTouchable>
      <Space />
    </Screen>
  )
}

export default WireTransferPaymentView
const styles = StyleSheet.create({
  text: {
    fontWeight: 'bold',
    fontSize: 18,
  },
})
