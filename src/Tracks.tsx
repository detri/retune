import { useState } from "react";
import TrackListing, { Track } from "./Track";

export default function Tracks() {
  const [tracks, setTracks] = useState<Track[]>([
    {
      position: 0,
      coverArt: "korn-greatest.jpg",
      songFile: "single.mp3",
      title: "Y'all Want a Single",
      artist: "KoRn",
      playing: false,
    },
  ]);

  const makeUpdateTrack = (index: number) => {
    return (newTrackData: Partial<Track>) => {
      const trackToUpdate = tracks[index];
      const updatedTrack = { ...trackToUpdate, ...newTrackData };
      setTracks(tracks.map((track, i) => (index === i ? updatedTrack : track)));
    };
  };

  return tracks && tracks.length > 0 ? (
    <ol>
      {tracks.map((track, i) => (
        <TrackListing
          key={`${track.artist}-${track.title}`}
          {...track}
          index={i}
          updateTrack={makeUpdateTrack(i)}
        />
      ))}
    </ol>
  ) : (
    <div>Initializing tracks</div>
  );
}
