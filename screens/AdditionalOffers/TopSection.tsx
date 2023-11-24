import Space from '@components/UI/Space'
import { FC, memo } from 'react'
import { Image, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { Text, withTheme } from 'react-native-paper'

type Props = {
  style?: StyleProp<ViewStyle>
  theme: ReactNativePaper.Theme
}

const TopSection: FC<Props> = ({ theme }) => {
  return (
    <>
      <View style={styles.topContainer}>
        <Image
          source={require('@assets/images/chat-phone.png')}
          style={{
            height: 160,
            width: undefined,
            aspectRatio: 1,
          }}
          resizeMode="contain"
        />
        <Space width={theme.spacing.m} />
        <Text variant="titleLarge" style={{ color: 'white', flexShrink: 1 }}>
          Prof en ligne disponible pour répondre à tes questions
        </Text>
      </View>
      <Space height={theme.spacing.m} />
      <View
        style={{
          backgroundColor: '#0002',
          padding: theme.spacing.m,
          borderRadius: theme.roundness,
        }}>
        <Text variant="bodyLarge" style={styles.text}>
          Du lundi au samedi de 18h à 20h, nos professeurs sont disponibles sur le chat pour
          t’accompagner. Tu as des questions de cours, des exercices ou des choses à clarifier, on
          est toujours là pour t’aider.
        </Text>
      </View>
    </>
  )
}
export default memo(withTheme(TopSection))
const styles = StyleSheet.create({
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: 'white',
  },
})
