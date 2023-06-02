/* eslint-disable @typescript-eslint/no-empty-function */
import { useEffect, useRef } from "react";
import { audioContext, gainNode } from "./contexts/audioContext";

export interface Track {
  position: number;
  coverArt: string;
  songFile: string;
  title: string;
  artist: string;
  playing: boolean;
}

export interface TrackProps extends Track {
  index: number;
  updateTrack: (track: Partial<Track>) => void;
}

export default function Track({
  updateTrack,
  position,
  index,
  coverArt,
  playing,
  songFile,
  title,
  artist,
}: TrackProps) {
  const audioRef = useRef<HTMLAudioElement>();

  const play = () => {
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }
    audioRef.current?.play();
    updateTrack({ playing: true });
  };
  const pause = () => {
    audioRef.current?.pause();
    updateTrack({ playing: false });
  };

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

  return (
    <li key={`${artist}-${title}`} className="flex">
      <div>{artist}</div>
      <div>{title}</div>
      {!playing ? (
        <div onClick={play}>Play</div>
      ) : (
        <div onClick={pause}>Pause</div>
      )}
      <audio
        src={songFile}
        ref={(ref) => {
          audioRef.current = ref ?? undefined;
        }}
      />
    </li>
  );
}
