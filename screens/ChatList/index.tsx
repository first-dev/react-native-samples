import LoadingFailed from '@components/LoadingFailed'
import Screen from '@components/UI/Screen'
import Space from '@components/UI/Space'
import useLiveChat from '@hooks/useLiveChat'
import { Fragment } from 'react'
import { ActivityIndicator, useTheme } from 'react-native-paper'
import Subject from './Subject'

const ChatList = () => {
  const theme: ReactNativePaper.Theme = useTheme()
  const { fullSubjects, availableSubjectsStatus } = useLiveChat()
  return (
    <Screen padding>
      {availableSubjectsStatus === 'error' ? (
        <LoadingFailed />
      ) : availableSubjectsStatus === 'loading' ? (
        <ActivityIndicator style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }} />
      ) : (
        fullSubjects.map((subject, index, array) => {
          return (
            <Fragment key={subject.id}>
              <Subject subject={subject} />
              {index !== array.length - 1 && <Space height={theme.spacing.m} />}
            </Fragment>
          )
        })
      )}
    </Screen>
  )
}

export default ChatList
