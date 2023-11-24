import SubscriptionStackHeader from '@components/Headers/SubscriptionStackHeader'
import BottomSheet, { BottomSheetRef } from '@components/UI/BottomSheet'
import Button from '@components/UI/Button'
import Screen from '@components/UI/Screen'
import Space from '@components/UI/Space'
import testimonials from '@constants/testimonials'
import useRTLText from '@hooks/useRTLText'
import { SubscriptionStackParamList } from '@navigation/SubscriptionStack'
import useOffersQuery from '@queries/useOffersQuery'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import mixpanel from '@utils/mixpanel'
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, useWindowDimensions, View } from 'react-native'
import { Divider, Text, useTheme } from 'react-native-paper'
import Animated, { FadeIn } from 'react-native-reanimated'
import Carousel from 'react-native-snap-carousel'
import CartCard from './CartCard'
import CheckoutHeader from './CheckoutHeader'
import CheckoutView from './CheckoutView'
import TestimonialsCard from './TestimonialsCard'

type Props = NativeStackScreenProps<SubscriptionStackParamList, 'cart'>

const Cart: FC<Props> = ({ route: { params }, navigation }) => {
  const theme: ReactNativePaper.Theme = useTheme()
  const { t } = useTranslation()
  const windowWidth = useWindowDimensions().width
  const bottomSheetRef = useRef<BottomSheetRef>(null)
  const [bottomSheetState, setBottomSheetState] = useState<'open' | 'closed'>('closed')
  const { data: offers } = useOffersQuery()
  const baseOffer = useMemo(
    () => offers?.baseOffers.find(o => o.id === params.selectedBaseOfferId),
    [offers?.baseOffers, params.selectedBaseOfferId],
  )
  const baseOfferPrice = useMemo(
    () => baseOffer?.variants.find(v => v.id === params.selectedBaseOfferVariant)?.price,
    [baseOffer?.variants, params.selectedBaseOfferVariant],
  )
  const baseOfferProductId = useMemo(
    () => baseOffer?.variants.find(v => v.id === params.selectedBaseOfferVariant)?.product_id,
    [baseOffer?.variants, params.selectedBaseOfferVariant],
  )
  const liveChatOffer = useMemo(
    () => offers?.liveChatOffers.find(o => o.id === params.selectedLiveChatOffer),
    [offers?.liveChatOffers, params.selectedLiveChatOffer],
  )
  const totalPrice = (baseOfferPrice ?? 0) + (liveChatOffer?.price ?? 0)
  const [transactionFinished, setTransactionFinished] = useState(false)
  useEffect(
    () =>
      navigation.addListener('transitionEnd', () => {
        setTransactionFinished(true)
      }),
    [navigation],
  )
  const finishHandler = useCallback(
    () => {
      navigation.popToTop()
      navigation.goBack()
      navigation.navigate('mySubscriptions' as any)
    },
    [navigation],
  )
  const rtlText = useRTLText()
  const openCheckoutHandler = useCallback(() => {
    bottomSheetRef.current?.open()
    mixpanel.track('View Mobile Payment Methods')
  }, [])

  return (
    <Screen
      safeArea
      gradient
      style={{ paddingBottom: theme.spacing.screenVerticalSpacing }}
      gradientProps={{
        start: { x: 0, y: 0 },
        end: { x: 0, y: 1 },
        colors: theme.colors.primaryGradient,
      }}>
      <ScrollView
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          marginTop: theme.spacing.screenVerticalSpacing,
          paddingBottom: theme.spacing.screenVerticalSpacing,
        }}>
        <View
          style={{
            paddingHorizontal: theme.spacing.screenHorizontalSpacing,
          }}>
          <SubscriptionStackHeader
            type="back-exit"
            downBackButton={bottomSheetState === 'open'}
            onBack={bottomSheetState === 'open' ? () => bottomSheetRef.current?.close() : undefined}
          />
        </View>
        <View
          style={{
            paddingHorizontal: theme.spacing.screenHorizontalSpacing,
          }}>
          <Space height={theme.spacing.m} />
          <Text variant="titleLarge" style={[{ color: theme.colors.onPrimary }, rtlText]}>
            {t('yourOrder')}
          </Text>
          <Space height={theme.spacing.m} />
          <CartCard
            baseOffer={baseOffer}
            baseOfferVariantId={params.selectedBaseOfferVariant}
            baseOfferPrice={baseOfferPrice}
            liveChatOffer={liveChatOffer}
            totalPrice={totalPrice}
          />
          <Space height={theme.spacing.m} />
          <Divider style={{ backgroundColor: 'white' }} />
          <Space height={theme.spacing.m} />
          <Text variant="titleLarge" style={[{ color: theme.colors.onPrimary }, rtlText]}>
            {t('testimonialsTitle')}
          </Text>
          <Space height={theme.spacing.m} />
          <View
            style={{
              backgroundColor: '#0002',
              padding: theme.spacing.m,
              borderRadius: theme.roundness,
            }}>
            <Text variant="bodyLarge" style={[{ color: theme.colors.onPrimary }, rtlText]}>
              {t('testimonialsDescription')}
            </Text>
          </View>
        </View>
        <Space height={theme.spacing.m} />
        {transactionFinished && (
          <Animated.View entering={FadeIn}>
            <Carousel
              autoplay
              loop
              autoplayInterval={10000}
              data={testimonials}
              renderItem={({ item }) => <TestimonialsCard testimonial={item} />}
              sliderWidth={windowWidth}
              itemWidth={windowWidth - theme.spacing.screenHorizontalSpacing * 2}
            />
          </Animated.View>
        )}
        <Space height={theme.spacing.m} />
      </ScrollView>
      <Divider style={{ backgroundColor: 'white' }} />
      <Space height={theme.spacing.m} />
      <Button
        mode="perspective"
        label={t('checkout')}
        buttonColor={theme.colors.primary}
        style={{ marginHorizontal: theme.spacing.screenHorizontalSpacing }}
        rightIcon={{ pack: 'MaterialCommunityIcons', name: 'arrow-up' }}
        onPress={openCheckoutHandler}
      />
      {transactionFinished && (
        <BottomSheet
          style={{ marginTop: 100 }}
          ref={bottomSheetRef}
          onClose={() => setBottomSheetState('closed')}
          onOpen={() => setBottomSheetState('open')}
          headerComponent={<CheckoutHeader totalPrice={totalPrice} />}>
          <CheckoutView
            onFinish={finishHandler}
            productsIds={baseOfferProductId ? [baseOfferProductId] : []}
            baseOffer={baseOffer}
            selectedBaseOfferVariant={params.selectedBaseOfferVariant}
            totalPrice={totalPrice}
          />
        </BottomSheet>
      )}
    </Screen>
  )
}
export default Cart
