let peerConnection;

export const createPeerConnection = (onTrackCallback) => {
  peerConnection = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  });

  peerConnection.ontrack = (event) => {
    if (onTrackCallback) onTrackCallback(event.streams[0]);
  };

  return peerConnection;
};

export const addLocalStream = (stream) => {
  stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
};

export const createOffer = async () => {
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  return offer;
};

export const createAnswer = async () => {
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  return answer;
};

export const setRemoteDescription = async (desc) => {
  await peerConnection.setRemoteDescription(new RTCSessionDescription(desc));
};

export const addIceCandidate = async (candidate) => {
  await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
};
