/* eslint-disable @typescript-eslint/no-empty-function */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { audioContext, gainNode } from "./audioContext";

interface TrackInfo {
  position: number;
  coverArt: string;
  songFile: string;
  title: string;
  artist: string;
}

type Tracks = {
  [trackKey: string]: TrackInfo;
};

interface PlayerContext {
  tracks: Tracks;
  trackPlayingKey: string;
  addTrack: (track: TrackInfo) => void;
  setTrackPlayingKey: (key: string) => void;
}

const playerContext = createContext<PlayerContext>({
  tracks: {},
  trackPlayingKey: "",
  addTrack: () => {},
  setTrackPlayingKey: () => {},
});

const { Provider } = playerContext;

const usePlayerContext = () => useContext(playerContext);

function PlayerProvider({ children }: React.PropsWithChildren) {
  const [tracks, setTracks] = useState<Tracks>({});
  const [trackPlayingKey, setTrackPlayingKey] = useState("");

  const addTrack = (track: TrackInfo) => {
    setTracks({ ...tracks, [track.songFile]: track });
  };

  return (
    <Provider value={{ tracks, trackPlayingKey, addTrack, setTrackPlayingKey }}>
      {children}
    </Provider>
  );
}

function useTrack(track: TrackInfo) {
  const { tracks, addTrack, trackPlayingKey, setTrackPlayingKey } =
    usePlayerContext();
  const audioRef = useRef<HTMLAudioElement>();

  const play = useCallback(() => {
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }
    audioRef.current?.play();
    setTrackPlayingKey(track.songFile);
  }, [setTrackPlayingKey, track.songFile]);

  useEffect(() => {
    if (!tracks[track.songFile]) {
      addTrack(track);
    }
  }, [tracks, track, addTrack]);

  useEffect(() => {
    if (trackPlayingKey === track.songFile) {
      play();
    } else {
      audioRef.current?.pause();
    }
  }, [trackPlayingKey, track, play]);

  useEffect(() => {
    if (audioRef.current) {
      const node = audioContext.createMediaElementSource(audioRef.current);
      node.connect(gainNode);
      return () => {
        node.disconnect();
      };
    }
    return () => {};
  }, [audioRef]);

  return {
    audioRef,
  };
}
