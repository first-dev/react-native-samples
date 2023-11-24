import Space from '@components/UI/Space'
import useRTL from '@hooks/useRTL'
import useRTLText from '@hooks/useRTLText'
import { BaseOffer } from '@models/offers'
import { FC, Fragment, memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'
import { withTheme } from 'react-native-paper'
import { runOnJS, SharedValue, useAnimatedReaction } from 'react-native-reanimated'
import BaseOfferVariantCard from './BaseOfferVariantCard'

type Props = {
  theme: ReactNativePaper.Theme
  style?: StyleProp<ViewStyle>
  variants: BaseOffer['variants']
  onSelect?: (variantId: string) => void
  defaultVariantId: string | null
  selectedVariantId: SharedValue<string | null>
  type: 'buttons' | 'dropdown'
}

type Row = (BaseOffer['variants'][0] | null)[]

const BaseOffersVariantPicker: FC<Props> = ({
  style,
  theme,
  onSelect,
  selectedVariantId,
  variants,
  type,
  defaultVariantId
}) => {
  const { t } = useTranslation()
  const rtl = useRTL()
  const rtlText = useRTLText()
  const variantPressHandler = useCallback(
    (variantId: string) => {
      selectedVariantId.value = variantId
      onSelect?.(variantId)
    },
    [onSelect, selectedVariantId],
  )
  const rows = useMemo(() => {
    const chunkSize = 3
    const rows: Row[] = []
    for (let i = 0; i < variants.length; i += chunkSize) {
      const row: Row = variants.slice(i, i + chunkSize)
      if (i + chunkSize > variants.length) {
        const emptyCells = chunkSize - row.length
        row.push(...Array(emptyCells).fill(null))
      }
      rows.push(row)
    }
    return rows
  }, [variants])
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(defaultVariantId)
  const items = useMemo(
    () =>
      variants.map(v => ({
        value: v.id,
        label: v.title,
      })),
    [variants],
  )
  useAnimatedReaction(
    () => selectedVariantId.value,
    (result, previous) => {
      if (result === previous) return
      runOnJS(setValue)(result)
    },
  )
  useEffect(() => {
    selectedVariantId.value = value
    if (value) variantPressHandler(value)
  }, [selectedVariantId, value, variantPressHandler])

  return (
    <View style={style}>
      {type === 'buttons' ? (
        rows.map((row, i, arr) => (
          <Fragment key={row?.[0]?.id ?? i}>
            <View style={styles.row}>
              {row.map((v, i, arr) =>
                v ? (
                  <Fragment key={v.id}>
                    <BaseOfferVariantCard
                      variant={v}
                      selectedVariantId={selectedVariantId}
                      onSelect={variantPressHandler}
                    />
                    {i !== arr.length - 1 && <Space width={theme.spacing.xs} />}
                  </Fragment>
                ) : (
                  <View style={{ flex: 1 }} key={i} />
                ),
              )}
            </View>
            {i !== arr.length - 1 && <Space height={theme.spacing.xs} />}
          </Fragment>
        ))
      ) : (
        <DropDownPicker
          rtl={rtl}
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          scrollViewProps={{ scrollEnabled: false }}
          textStyle={[theme.typescale?.titleMedium, rtlText]}
          style={{
            height: 56,
            borderWidth: value ? theme.spacing.borderWidthM : 0,
            borderColor: theme.colors.primary,
            borderRadius: theme.roundness,
          }}
          dropDownContainerStyle={{
            borderWidth: value ? theme.spacing.borderWidthM : 0,
            borderTopWidth: value ? theme.spacing.borderWidthM / 2 : 0,
            borderColor: 'transparent',
            borderRadius: theme.roundness,
          }}
          listItemLabelStyle={{
            paddingHorizontal: theme.spacing.m - 10,
          }}
          labelStyle={{
            paddingHorizontal: theme.spacing.m - 10,
          }}
          props={{ activeOpacity: 0.8 }}
          zIndex={100}
          listMode="SCROLLVIEW"
          placeholder={t('selectAnItem')}
        />
      )}
    </View>
  )
}
export default memo(withTheme(BaseOffersVariantPicker))
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
})
