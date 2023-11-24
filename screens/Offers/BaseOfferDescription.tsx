import { MaterialIcons } from '@expo/vector-icons'
import useRTL from '@hooks/useRTL'
import useRTLText from '@hooks/useRTLText'
import { FC, Fragment, memo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { Divider, Text, withTheme } from 'react-native-paper'

type Props = {
  style?: StyleProp<ViewStyle>
  theme: ReactNativePaper.Theme
}

const FEATURES = {
  fr: [
    'Cours vidéo',
    'Exercices vidéo',
    'Tests interactifs',
    'Examens corrigés',
    'Téléchargement de résumés',
  ],
  ar: [
    'دورة الفيديو',
    'تمارين الفيديو',
    'اختبارات تفاعلية',
    'الامتحانات المصححة',
    'تنزيل الملخصات',
  ],
}

const BaseOfferFeatures: FC<Props> = ({ style, theme }) => {
  const rtlText = useRTLText()
  const rtl = useRTL()
  const { i18n } = useTranslation()

  return (
    <View
      style={[
        styles.container,
        { borderRadius: theme.roundness, paddingVertical: theme.spacing.s },
        style,
      ]}>
      <View
        style={{
          backgroundColor: '#0002',
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: rtl ? undefined : 0,
          left: rtl ? 0 : undefined,
          width: (theme.spacing.m + theme.spacing.s) * 2 + 24,
          borderRadius: theme.roundness,
        }}
      />
      {FEATURES[i18n.language].map((f, i, arr) => (
        <Fragment key={f}>
          <View
            style={[
              styles.feature,
              {
                padding: theme.spacing.m,
                flexDirection: rtl ? 'row-reverse' : 'row',
              },
            ]}>
            <Text variant="bodyMedium" style={[styles.featureText, rtlText]}>
              {f}
            </Text>
            <MaterialIcons
              name="check"
              size={24}
              color="white"
              style={{ marginHorizontal: theme.spacing.s }}
            />
          </View>
          {i !== arr.length - 1 && <Divider style={{ backgroundColor: 'white', opacity: 0.5 }} />}
        </Fragment>
      ))}
    </View>
  )
}
export default memo(withTheme(BaseOfferFeatures))
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  feature: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featureText: {
    color: 'white',
    fontWeight: 'bold',
  },
})
