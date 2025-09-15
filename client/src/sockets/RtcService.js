// export const createPeerConnection = (onTrackCallback) => {
//   const pc = new RTCPeerConnection({
//     iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
//   });

//   pc.ontrack = (event) => {
//     if (onTrackCallback) onTrackCallback(event.streams[0]);
//   };

//   return pc;
// };

export const createPeerConnection = (onTrackCallback, onIceCandidateCallback) => {
  const pc = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  });

  pc.ontrack = (event) => {
    if (onTrackCallback) onTrackCallback(event.streams[0]);
  };

  pc.onicecandidate = (event) => {
    if (event.candidate && onIceCandidateCallback) {
      onIceCandidateCallback(event.candidate);
    }
  };

  return pc;
};


export const addLocalStream = (pc, stream) => {
  stream.getTracks().forEach(track => pc.addTrack(track, stream));
};

export const createOffer = async (pc) => {
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  return offer;
};

export const createAnswer = async (pc) => {
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
  return answer;
};

export const setRemoteDescription = async (pc, desc) => {
  await pc.setRemoteDescription(new RTCSessionDescription(desc));
};

export const addIceCandidate = async (pc, candidate) => {
  await pc.addIceCandidate(new RTCIceCandidate(candidate));
};
