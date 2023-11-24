import SubscriptionStackHeader from '@components/Headers/SubscriptionStackHeader'
import Button from '@components/UI/Button'
import Screen from '@components/UI/Screen'
import Space from '@components/UI/Space'
import { SubscriptionStackParamList } from '@navigation/SubscriptionStack'
import useOffersQuery from '@queries/useOffersQuery'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, ScrollView } from 'react-native'
import { Divider, useTheme } from 'react-native-paper'
import BaseOfferDescription from './BaseOfferDescription'
import BaseOffersList from './BaseOffersList'
import LiveLessonsCard from './LiveLessonsCard'
import TopSection from './TopSection'

type Props = NativeStackScreenProps<SubscriptionStackParamList, 'offers'>

const Offers: FC<Props> = ({ navigation }) => {
  const theme: ReactNativePaper.Theme = useTheme()
  const [selectedOfferId, setSelectedOfferId] = useState<string>()
  const [offerVariantId, setOfferVariantId] = useState<string | null>()
  const { data: offers } = useOffersQuery()
  useEffect(() => {
    if (offers) {
      setSelectedOfferId(offers.defaultBaseOffer)
      setOfferVariantId(
        offers.baseOffers.find(o => o.id === offers.defaultBaseOffer)?.variants[0]?.id,
      )
    }
  }, [offers])
  const handleContinue = useCallback(() => {
    if (selectedOfferId && offerVariantId)
      navigation.navigate('cart', {
        selectedBaseOfferId: selectedOfferId,
        selectedBaseOfferVariant: offerVariantId,
      })
  }, [navigation, offerVariantId, selectedOfferId])
  const selectedOffer = useMemo(
    () => offers?.baseOffers?.find(o => o.id === selectedOfferId),
    [offers?.baseOffers, selectedOfferId],
  )
  const variants = useMemo(() => selectedOffer?.variants, [selectedOffer?.variants])
  const { t } = useTranslation()
  // console.log(offers?.baseOffers[0].variants[0].id)

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
          flexGrow: 1,
          marginTop: theme.spacing.screenVerticalSpacing,
          paddingHorizontal: theme.spacing.screenHorizontalSpacing,
          paddingBottom: theme.spacing.screenVerticalSpacing,
        }}>
        <SubscriptionStackHeader type="back-exit" />
        <Space height={theme.spacing.m} />
        <TopSection />
        <Space height={theme.spacing.m} />
        {offers ? (
          <>
            <BaseOffersList
              baseOffers={offers.baseOffers}
              defaultOfferId={offers.defaultBaseOffer}
              onSelectOffer={setSelectedOfferId}
              variants={variants ?? []}
              defaultVariantId={
                offers.baseOffers.find(o => o.id === offers.defaultBaseOffer)?.variants[0]?.id ??
                null
              }
              onSelectVariant={setOfferVariantId}
            />
            <Space height={theme.spacing.m} />
            <Divider style={{ backgroundColor: 'white' }} />
            <Space height={theme.spacing.m} />
            <LiveLessonsCard
              active={offers.baseOffers.find(o => o.id === selectedOfferId)?.includeLiveLessons}
            />
            <Space height={theme.spacing.m} />
            <BaseOfferDescription />
          </>
        ) : (
          <ActivityIndicator style={{ flex: 1 }} size={32} color="white" />
        )}
        <Space height={theme.spacing.m} />
      </ScrollView>
      <Divider style={{ backgroundColor: 'white' }} />
      <Space height={theme.spacing.m} />
      <Button
        mode="perspective"
        label={t('continue')}
        buttonColor={theme.colors.primary}
        style={{ marginHorizontal: theme.spacing.screenHorizontalSpacing }}
        rightIcon={{ pack: 'MaterialCommunityIcons', name: 'arrow-right' }}
        onPress={handleContinue}
      />
    </Screen>
  )
}
export default Offers
