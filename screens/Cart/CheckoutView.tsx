import Button from '@components/UI/Button'
import Screen from '@components/UI/Screen'
import Space from '@components/UI/Space'
import useAuthState from '@hooks/useAuthState'
import { BaseOffer, OfferDuration, PaymentMethod } from '@models/offers'
import mixpanel from '@utils/mixpanel'
import { isEmpty } from 'lodash'
import { FC, useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, View } from 'react-native'
import PagerView from 'react-native-pager-view'
import { useTheme } from 'react-native-paper'
import { runOnJS, useAnimatedReaction, useSharedValue } from 'react-native-reanimated'
import CashplusPaymentView from './CashplusPaymentView'
import CreditCardPaymentView from './CreditCardPaymentView'

import PaymentMethodCard from './PaymentMethodCard'
import WireTransferPaymentView from './WireTransferPaymentView'

type Props = {
  onFinish: () => void
  baseOffer?: BaseOffer
  selectedBaseOfferVariant?: string
  productsIds: number[]
  totalPrice?: number
}

const CheckoutView: FC<Props> = ({
  onFinish,
  productsIds,
  baseOffer,
  selectedBaseOfferVariant,
  totalPrice,
}) => {
  const theme: ReactNativePaper.Theme = useTheme()
  const { t } = useTranslation()
  const { auth } = useAuthState()
  const defaultMethod = 'cashplus'
  const selectedMethodSharedValue = useSharedValue<PaymentMethod>(defaultMethod)
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(defaultMethod)
  const [cashplusPaymentCode, setCashplusPaymentCode] = useState<string>()
  const [wireTransferOrderCode, setWireTransferOrderCode] = useState<string>()
  const [pageIndex, setPageIndex] = useState(0)
  const pagerViewRef = useRef<PagerView>(null)
  const methodChangedHandler = useCallback((newMethod: PaymentMethod) => {
    //* delay rerender until paymentMethodCard animations are done
    setTimeout(() => {
      setSelectedMethod(newMethod)
    }, 200)
  }, [])
  useAnimatedReaction(
    () => selectedMethodSharedValue.value,
    (result, previous) => {
      if (result === previous) return
      runOnJS(methodChangedHandler)(result)
    },
  )
  const trackOrder = useCallback(() => {
    let duration: OfferDuration | undefined = undefined
    if (baseOffer?.variantBy === 'duration') duration = selectedBaseOfferVariant as any
    else if (baseOffer?.variantBy === 'subject') duration = 'year'
    mixpanel.track('Order', {
      'Payment method': selectedMethod,
      Product:
        baseOffer?.title +
        (baseOffer?.variantBy === 'subject'
          ? ' ' + baseOffer?.variants.find(v => v.id === selectedBaseOfferVariant)?.title ?? ''
          : ''),
      'Subscriptions duration': duration,
      Value: totalPrice,
    })
  }, [
    baseOffer?.title,
    baseOffer?.variantBy,
    baseOffer?.variants,
    selectedBaseOfferVariant,
    selectedMethod,
    totalPrice,
  ])
  const nextHandler = useCallback(() => {
    if (pageIndex === 0) {
      ;(async () => {
        if (isEmpty(productsIds)) return
        switch (selectedMethod) {
          case 'cashplus': {
            if (cashplusPaymentCode) return
            try {
              const response = await api.get<{
                user_id: string
                order_id: number
                order_total: number
                cashplus_pin: string
              }>('order-cashplus', {
                params: {
                  user_id: auth.userId,
                  // TODO: work on orders back-end logic
                  product_id: productsIds[0],
                },
              })
              setCashplusPaymentCode(response.data.cashplus_pin)
            } catch (error) {
              console.error('fetching cashplus payment code failed', error)
            }
            trackOrder()
            break
          }
          case 'wire-transfer': {
            if (wireTransferOrderCode) return
            try {
              const response = await api.get<{
                user_id: string
                order_id: number
                order_total: number
              }>('order-wiretransfer', {
                params: {
                  user_id: auth.userId,
                  product_id: productsIds[0],
                },
              })
              setWireTransferOrderCode(response.data.order_id.toString())
            } catch (error) {
              console.error('fetching wire transfer order code failed', error)
            }
            trackOrder()
            break
          }
        }
      })()
      pagerViewRef.current?.setPage(1)
    } else if (pageIndex === 1) {
      switch (selectedMethod) {
        case 'cashplus': {
          if (!cashplusPaymentCode) return
          break
        }
        case 'wire-transfer': {
          if (!wireTransferOrderCode) return
          break
        }
      }
      onFinish()
    }
  }, [
    auth.userId,
    cashplusPaymentCode,
    onFinish,
    pageIndex,
    productsIds,
    selectedMethod,
    trackOrder,
    wireTransferOrderCode,
  ])

  return (
    <Screen>
      <PagerView
        scrollEnabled={false}
        ref={pagerViewRef}
        initialPage={0}
        style={{ flex: 1 }}
        onPageSelected={e => setPageIndex(e.nativeEvent.position)}>
        <View key={0}>
          <Screen padding scrollable>
            {/* <PaymentMethodCard
              method="credit-card"
              selectedMethod={selectedMethodSharedValue}
              label={t('creditCard')}
              description="Payez en toute sécurité par Carte bancaire marocaine ou internationale à travers AmanPay"
              icon={require('@assets/images/card.png')}
              footer={
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                  <Image
                    source={require('@assets/images/visa.png')}
                    style={{ width: undefined, height: theme.spacing.m, aspectRatio: 2560 / 829 }}
                    resizeMode="contain"
                  />
                  <Space width={theme.spacing.s} />
                  <Image
                    source={require('@assets/images/mastercard.png')}
                    style={{ width: undefined, height: theme.spacing.m, aspectRatio: 3840 / 2160 }}
                    resizeMode="contain"
                  />
                  <Space width={theme.spacing.s} />
                  <Image
                    source={require('@assets/images/cmi.png')}
                    style={{ width: undefined, height: theme.spacing.m, aspectRatio: 278 / 181 }}
                    resizeMode="contain"
                  />
                </View>
              }
            />
            <Space height={theme.spacing.m} /> */}
            <PaymentMethodCard
              label={t('cashplus')}
              selectedMethod={selectedMethodSharedValue}
              method="cashplus"
              icon={require('@assets/images/cashplus-logo.png')}
            />
            <Space height={theme.spacing.m} />
            <PaymentMethodCard
              label={t('wireTransfer')}
              selectedMethod={selectedMethodSharedValue}
              method="wire-transfer"
              icon={require('@assets/images/wire-transfer-logo.png')}
            />
          </Screen>
        </View>
        <View key={1}>
          {selectedMethod === 'cashplus' ? (
            <CashplusPaymentView paymentCode={cashplusPaymentCode} />
          ) : selectedMethod === 'credit-card' ? (
            <CreditCardPaymentView />
          ) : selectedMethod === 'wire-transfer' ? (
            <WireTransferPaymentView orderCode={wireTransferOrderCode} />
          ) : (
            <ActivityIndicator
              color={theme.colors.primary}
              size={theme.spacing.xl}
              style={{ flex: 1 }}
            />
          )}
        </View>
      </PagerView>
      <Space height={theme.spacing.m} />
      <Button
        style={{
          borderRadius: 100,
          marginHorizontal: theme.spacing.screenHorizontalSpacing + theme.spacing.m,
        }}
        label={t(pageIndex === 0 ? 'continue' : 'finish')}
        gradient
        gradientProps={{
          colors: theme.colors.primaryGradient,
          start: { x: 0, y: 0 },
          end: { x: 1, y: 0 },
        }}
        buttonColor={theme.colors.primaryGradient[0]}
        depth={4}
        rightIcon={{ pack: 'MaterialCommunityIcons', name: 'arrow-right' }}
        onPress={nextHandler}
      />
      <Space height={theme.spacing.screenVerticalSpacing} />
    </Screen>
  )
}
export default CheckoutView
