import ChatConversation, { ChatConversationRef } from '@components/ChatConversation'
import Card from '@components/UI/Card'
import PlatformTouchable from '@components/UI/PlatformTouchable'
import Space from '@components/UI/Space'
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import useSettingsState from '@hooks/useSettingsState'
import { FullSubject } from '@models/liveChat'
import Color from 'color'
import { format } from 'date-fns'
import { FC, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { Text, useTheme } from 'react-native-paper'

const frDays = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']
const arDays = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']

type Props = {
  style?: StyleProp<ViewStyle>
  subject: FullSubject
}

const Subject: FC<Props> = ({ style, subject }) => {
  const theme: ReactNativePaper.Theme = useTheme()
  const { t } = useTranslation()
  const { settings } = useSettingsState()
  const chatConversationRef = useRef<ChatConversationRef>(null)
  const daysNames = settings.general.language === 'ar' ? arDays : frDays
  const {available, color, days, image, name, time} = subject

  return (
    <>
      <Card style={[styles.container, style]}>
        <View
          style={[
            styles.imageContainer,
            { backgroundColor: Color(color).alpha(0.4).rgb().string() },
          ]}>
          {image ? (
            <Image source={image} style={{ height: 100, aspectRatio: 1 }} />
          ) : (
            <Space width={100} />
          )}
        </View>
        <View
          style={{ padding: theme.spacing.m, flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.textContainer}>
            <View style={styles.nameContainer}>
              <Text numberOfLines={1} ellipsizeMode="clip" style={{ fontSize: 20, flexShrink: 1 }}>
                {name}
              </Text>
              <View
                style={{
                  width: 12,
                  aspectRatio: 1,
                  borderRadius: 20,
                  backgroundColor: available ? '#77d483' : '#ff756f',
                }}
              />
            </View>
            <View style={{ flex: 1 }} />
            <View style={styles.subtitleContainer}>
              <MaterialIcons name="calendar-today" size={18} />
              <Space width={theme.spacing.s} />
              <Text numberOfLines={1} style={{ fontSize: 10, flex: 1 }}>
                {days &&
                  t('fromXToY', {
                    x: daysNames[days.from],
                    y: daysNames[days.to],
                  })}
                {}
              </Text>
            </View>
            <View style={styles.subtitleContainer}>
              <MaterialCommunityIcons name="clock-outline" size={18} />
              <Space width={theme.spacing.s} />
              <Text numberOfLines={1} style={{ fontSize: 10, flex: 1 }}>
                {time && `${format(time.from, 'hh:mm aaa')} - ${format(time.to, 'hh:mm aaa')}`}
              </Text>
            </View>
          </View>
        </View>
        <PlatformTouchable
          onPress={() => chatConversationRef.current?.open()}
          style={[
            styles.button,
            {
              backgroundColor: color,
            },
          ]}>
          <MaterialIcons name="chevron-right" size={48} color="white" />
        </PlatformTouchable>
        {/* <LinearGradient
          colors={['white', color ?? 'white']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        /> */}
      </Card>
      <ChatConversation subject={subject} ref={chatConversationRef} />
    </>
  )
}

export default Subject

const styles = StyleSheet.create({
  container: {
    borderWidth: 0,
    flexDirection: 'row',
    elevation: 4,
    padding: 0,
    overflow: 'hidden',
    height: 120,
    alignItems: 'center',
  },
  imageContainer: {
    aspectRatio: 1,
    width: 140,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -60,
    paddingLeft: 40,
  },
  textContainer: {
    flex: 1,
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    opacity: 0.7,
  },
  nameContainer: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  button: {
    width: 60,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // gradient: {
  //   position: 'absolute',
  //   right: 0,
  //   top: 0,
  //   bottom: 0,
  //   width: 120,
  //   zIndex: -1,
  // },
})
