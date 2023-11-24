import { FC } from 'react'
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native'
import { Text } from 'react-native-paper'

type Props = {
  style?: StyleProp<ViewStyle>
}

const CreditCardPaymentView: FC<Props> = ({ style }) => {
  return (
    <View style={[styles.container, style]}>
      <Text variant="titleLarge" style={{ opacity: 0.5 }}>
        Coming soon
      </Text>
    </View>
  )
}
export default CreditCardPaymentView
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
