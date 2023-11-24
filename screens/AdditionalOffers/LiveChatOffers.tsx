import Space from '@components/UI/Space'
import useOffersQuery from '@queries/useOffersQuery'
// import { liveChatOffers } from '@constants/offers'
import { FC, Fragment, memo, useCallback } from 'react'
import { ActivityIndicator, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { Divider, withTheme } from 'react-native-paper'
import { useSharedValue } from 'react-native-reanimated'
import LiveChatOfferCard from './LiveChatOfferCard'
import TopSection from './TopSection'

type Props = {
  style?: StyleProp<ViewStyle>
  theme: ReactNativePaper.Theme
  onSelect?: (offerId: string) => void
}

const LiveChatOffers: FC<Props> = ({ style, theme, onSelect }) => {
  const selectedOfferId = useSharedValue('')
  const pressHandler = useCallback(
    (offerId: string) => {
      if (offerId === selectedOfferId.value) {
        selectedOfferId.value = ''
      } else {
        selectedOfferId.value = offerId
      }
      onSelect?.(offerId)
    },
    [onSelect, selectedOfferId],
  )
  const { data: offers } = useOffersQuery()
  return (
    <View style={[styles.container, style]}>
      <TopSection />
      <Space height={theme.spacing.m} />
      <Divider style={{ backgroundColor: 'white' }} />
      <Space height={theme.spacing.m} />
      {offers ? (
        offers.liveChatOffers.map((o, i, arr) => (
          <Fragment key={o.id}>
            <LiveChatOfferCard offer={o} onSelect={pressHandler} selectedId={selectedOfferId} />
            {i !== arr.length - 1 && <Space height={theme.spacing.s} />}
          </Fragment>
        ))
      ) : (
        <ActivityIndicator
          style={{ height: 2 * 80 + theme.spacing.s }}
          size={theme.spacing.xl}
          color="white"
        />
      )}
    </View>
  )
}

export default memo(withTheme(LiveChatOffers))
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
})
