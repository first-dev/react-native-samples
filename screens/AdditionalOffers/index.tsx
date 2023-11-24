import SubscriptionStackHeader from '@components/Headers/SubscriptionStackHeader'
import Button from '@components/UI/Button'
import Screen from '@components/UI/Screen'
import Space from '@components/UI/Space'
import faq from '@constants/faq'
import { SubscriptionStackParamList } from '@navigation/SubscriptionStack'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { FC, Fragment, useCallback, useState } from 'react'
import { ScrollView } from 'react-native'
import { Divider, Text, useTheme } from 'react-native-paper'
import { useSharedValue } from 'react-native-reanimated'
import FAQItem from './FAQItem'

import LiveChatOffers from './LiveChatOffers'

type Props = NativeStackScreenProps<SubscriptionStackParamList, 'additionalOffers'>

const AdditionalOffers: FC<Props> = ({ navigation, route }) => {
  const theme: ReactNativePaper.Theme = useTheme()
  const [selectedLiveChatOffer, setSelectedLiveChatOffer] = useState<string>()
  const focusedQuestionIndex = useSharedValue(-1)
  const questionPressHandler = useCallback(
    (index: number) => {
      if (index === focusedQuestionIndex.value) {
        focusedQuestionIndex.value = -1
      } else {
        focusedQuestionIndex.value = index
      }
    },
    [focusedQuestionIndex],
  )

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
          paddingHorizontal: theme.spacing.screenHorizontalSpacing,
          paddingBottom: theme.spacing.screenVerticalSpacing,
        }}>
        <SubscriptionStackHeader type="back-exit" />
        <Space height={theme.spacing.m} />
        <LiveChatOffers onSelect={setSelectedLiveChatOffer} />
        <Space height={theme.spacing.m} />
        <Divider style={{ backgroundColor: theme.colors.surface }} />
        <Space height={theme.spacing.m} />
        <Text variant="titleLarge" style={{ color: theme.colors.onPrimary }}>
          Les questions les plus fréquentes
        </Text>
        <Space height={theme.spacing.m} />
        {faq.map((f, i, arr) => (
          <Fragment key={f.question}>
            <FAQItem
              faq={f}
              index={i}
              focusedIndex={focusedQuestionIndex}
              onPress={questionPressHandler}
            />
            {i !== arr.length - 1 && (
              <>
                <Space height={theme.spacing.s} />
                <Divider style={{ backgroundColor: theme.colors.surface, opacity: 0.5 }} />
                <Space height={theme.spacing.s} />
              </>
            )}
          </Fragment>
        ))}
        <Space height={theme.spacing.m} />
      </ScrollView>
      <Divider style={{ backgroundColor: 'white' }} />
      <Space height={theme.spacing.m} />
      <Button
        mode="perspective"
        label="Continue"
        buttonColor={theme.colors.primary}
        style={{ marginHorizontal: theme.spacing.screenHorizontalSpacing }}
        rightIcon={{ pack: 'MaterialCommunityIcons', name: 'arrow-right' }}
        onPress={() =>
          navigation.navigate('cart', {
            selectedBaseOfferId: route.params.selectedBaseOfferId,
            selectedLiveChatOffer: selectedLiveChatOffer,
            selectedBaseOfferVariant: route.params.selectedBaseOfferVariant,
          })
        }
      />
    </Screen>
  )
}
export default AdditionalOffers
