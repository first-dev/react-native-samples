import Space from '@components/UI/Space'
import { BaseOffer } from '@models/offers'
import { FC, Fragment, memo, useCallback, useState } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { withTheme } from 'react-native-paper'
import { useDerivedValue, useSharedValue } from 'react-native-reanimated'
import BaseOfferCard from './BaseOfferCard'
import BaseOfferVariantPicker from './BaseOfferVariantPicker'

type Props = {
  theme: ReactNativePaper.Theme
  style?: StyleProp<ViewStyle>
  baseOffers?: BaseOffer[]
  defaultOfferId?: string
  onSelectOffer?: (selectedOfferId: string) => void
  variants: BaseOffer['variants']
  defaultVariantId: string | null
  onSelectVariant?: (variantId: string | null) => void
}

const BaseOffersList: FC<Props> = ({
  style,
  theme,
  baseOffers,
  defaultOfferId,
  onSelectOffer,
  variants,
  defaultVariantId,
  onSelectVariant,
}) => {
  const selectedOfferId = useSharedValue(defaultOfferId ?? '')
  const selectedVariantId = useSharedValue(defaultVariantId)
  const [variantId, setVariantId] = useState(defaultVariantId)
  const offerPressHandler = useCallback(
    (offerId: string) => {
      if (selectedOfferId.value === offerId) return
      selectedOfferId.value = offerId
      setTimeout(() => {
        const newOffer = baseOffers?.find(o => o.id === offerId)
        const newVariant = newOffer?.variants[0]?.id ?? null
        onSelectOffer?.(offerId)
        setVariantId(newVariant)
        onSelectVariant?.(newVariant)
        selectedVariantId.value = newVariant
      }, 200)
    },
    [baseOffers, onSelectOffer, onSelectVariant, selectedOfferId, selectedVariantId],
  )
  const variantSelectHandler = useCallback(
    (variantId: string) => {
      setVariantId(variantId)
      onSelectVariant?.(variantId)
    },
    [onSelectVariant],
  )
  const variantBy = useDerivedValue(() => baseOffers?.find(o => o.id === selectedOfferId.value)?.variantBy)

  return (
    <View style={{ zIndex: 1 }}>
      <View style={[styles.container, style]}>
        {baseOffers?.map((o, i, arr) => (
          <Fragment key={o.id}>
            <BaseOfferCard
              variantId={variantId}
              offer={o}
              selectedId={selectedOfferId}
              onPress={offerPressHandler}
            />
            {i !== arr.length - 1 && <Space width={theme.spacing.s} />}
          </Fragment>
        ))}
      </View>
      <Space height={theme.spacing.m} />
      <BaseOfferVariantPicker
        type={variantBy.value === 'duration' ? 'buttons' : 'dropdown'}
        variants={variants}
        defaultVariantId={defaultVariantId}
        onSelect={variantSelectHandler}
        selectedVariantId={selectedVariantId}
      />
    </View>
  )
}
export default memo(withTheme(BaseOffersList))
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 240,
    // height: 340,
  },
})
