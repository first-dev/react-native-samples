/* eslint-disable @typescript-eslint/no-unused-vars */
import { Audio } from 'expo-av'
import ExponentAV from 'expo-av/src/ExponentAV'

export default class AR {
  private static recording = new Audio.Recording()

  private static isOperating = false

  public static startRecording = async () => {
    if (AR.isOperating) return false
    try {
      AR.isOperating = true
      const status = await AR.status
      if (status.isRecording) {
        await AR.prepare()
      }
      if (status.canRecord) {
        await AR.recording.startAsync()
        return true
      } else {
        return false
      }
    } catch (e: any) {
      await AR.handleStopError(e)
      return false
    } finally {
      AR.isOperating = false
    }
  }

  public static stopRecording = async () => {
    if (AR.isOperating) return null
    let uri: string | null = null
    try {
      AR.isOperating = true
      if ((await AR.status).isRecording) {
        await AR.recording.stopAndUnloadAsync()
        uri = AR.recording.getURI()
      }
    } catch (e: any) {
      await AR.handleStopError(e)
    } finally {
      await AR.prepare()
      AR.isOperating = false
    }
    return uri
  }

  private static prepare = async () => {
    const status = await AR.status
    if (status.canRecord) return
    try {
      if (status.isRecording) await AR.recording.stopAndUnloadAsync()
    } catch (e: any) {
      await AR.handleStopError(e)
    }
    AR.recording = new Audio.Recording()
    await AR.recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY)
  }

  private static handleStopError = async (e: any) => {
    if (e.message.includes('Stop encountered an error')) {
      await ExponentAV.unloadAudioRecorder()
      await AR.recording._cleanupForUnloadedRecorder({ durationMillis: 0 } as any)
    }
  }

  public static get status() {
    return AR.recording.getStatusAsync()
  }

  static {
    AR.prepare()
  }
}

export { AR as AudioRecorder }
