export const MediaConfig = {
  allowVideo: true,
  allowAudio: true,
  allowSnapshots: true,
  snapshotsInterval: 20000,
  local: {
    containerId: 'local-video',
    containerWidth: 500,
    containerHeight: 500,
    useNoise: true
  },
  remote: {
    containerId: 'remote-video',
    containerWidth: 500,
    containerHeight: 500,
    useNoise: false
  }
}
