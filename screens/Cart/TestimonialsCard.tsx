import Card from '@components/UI/Card'
import Icon from '@components/UI/Icon'
import Space from '@components/UI/Space'
import { Testimonial } from '@constants/testimonials'
import { FC, memo } from 'react'
import { StyleProp, StyleSheet, ViewStyle, View, Image } from 'react-native'
import { Text, withTheme } from 'react-native-paper'

type Props = {
  style?: StyleProp<ViewStyle>
  theme: ReactNativePaper.Theme
  testimonial: Testimonial
}

const TestimonialsCard: FC<Props> = ({ style, theme, testimonial }) => {
  return (
    <Card style={[styles.container, { borderWidth: 0, backgroundColor: '#fffc' }, style]}>
      <View style={styles.top}>
        <Image
          source={{ uri: testimonial.imageUri, width: 40, height: 40 }}
          style={{ borderRadius: 100 }}
        />
        <Space width={theme.spacing.m} />
        <Text variant="bodyLarge" style={{ fontWeight: 'bold' }} numberOfLines={2}>
          {testimonial.username}
        </Text>
      </View>
      <Space height={theme.spacing.m} />
      <Icon
        color={theme.colors.tertiary}
        source={{ pack: 'FontAwesome', name: 'quote-left' }}
        size={16}
      />
      <Text style={{ opacity: 0.7 }}>{testimonial.text}</Text>
      <Icon
        color={theme.colors.tertiary}
        source={{ pack: 'FontAwesome', name: 'quote-right' }}
        size={16}
        style={{ alignSelf: 'flex-end' }}
      />
    </Card>
  )
}
export default memo(withTheme(TestimonialsCard))
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})
