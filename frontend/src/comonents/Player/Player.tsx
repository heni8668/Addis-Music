import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

import ReactAudioPlayer from "react-h5-audio-player";
import {
  togglePlayPause,
  setSelectedMusic,
} from "../../redux/actions/musicActions";
import "react-h5-audio-player/lib/styles.css";
import styled from "styled-components";
import {
  FaVolumeUp,
  FaVolumeMute,
  FaArrowRight,
  FaArrowLeft,
  FaExpand,
  FaCompress,
} from "react-icons/fa";
import { RootState } from "../../redux/store"; // Adjust based on your store location
import { Music } from "../../redux/Types/musicTypes"; // Ensure you're importing the correct Music type

interface PlayerProps {
  musicList: Music[];
}


const Player: React.FC<PlayerProps> = ({ musicList}) => {
  const dispatch = useAppDispatch();
  const selectedMusic = useAppSelector((state) => state.musics.selectedMusic);

  const isPlaying = useAppSelector((state) => state.musics.isPlaying);

  const [volume, setVolume] = useState(1); // Volume range 0 to 1
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Handle play/pause
  const handlePlayPause = (play: boolean) => {
    dispatch(togglePlayPause(play));
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value));
  };

  // Go to next track
  const playNext = () => {
    const currentIndex = musicList.findIndex(
      (song) => song._id === selectedMusic?._id
    );
    const nextIndex = (currentIndex + 1) % musicList.length; // Loop back to start
    dispatch(setSelectedMusic(musicList[nextIndex]));
    dispatch(togglePlayPause(true)); // Automatically play the next song
  };

  // Go to previous track
  const playPrevious = () => {
    const currentIndex = musicList.findIndex(
      (song) => song._id === selectedMusic?._id
    );
    const previousIndex =
      (currentIndex - 1 + musicList.length) % musicList.length; // Loop back to end
    dispatch(setSelectedMusic(musicList[previousIndex]));
    dispatch(togglePlayPause(true)); // Automatically play the previous song
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (isFullscreen) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  if (!selectedMusic) {
    return null; // Don't show the player if no music is selected
  }
  return (
    <PlayerContainer>
      <PlayerDetails>
        <CoverImage
          src={selectedMusic.coverImage.secure_url}
          alt={selectedMusic.title}
        />
        <Details>
          <Title>{selectedMusic.title}</Title>
          <Artist>{selectedMusic.artist}</Artist>
        </Details>
      </PlayerDetails>
      <ReactAudioPlayer
        src={selectedMusic.file?.secure_url}
        autoPlay={isPlaying}
        onPlay={() => handlePlayPause(true)}
        onPause={() => handlePlayPause(false)}
        volume={volume}
        showSkipControls={false} // Hide default skip controls
        layout="stacked-reverse"
      />
      <Controls>
        <ControlButton onClick={playPrevious}>
          <FaArrowLeft />
        </ControlButton>
        <ControlButton onClick={playNext}>
          <FaArrowRight />
        </ControlButton>
        <VolumeControl>
          <VolumeButton onClick={() => setVolume(volume > 0 ? 0 : 1)}>
            {volume > 0 ? <FaVolumeUp /> : <FaVolumeMute />}
          </VolumeButton>
          <VolumeInput
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
          />
        </VolumeControl>
        <ControlButton onClick={toggleFullscreen}>
          {isFullscreen ? <FaCompress /> : <FaExpand />}
        </ControlButton>
      </Controls>
    </PlayerContainer>
  );
}

// Styled components for custom layout
const PlayerContainer = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #fff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  z-index: 1000;
`;

const PlayerDetails = styled.div`
  display: flex;
  align-items: center;
`;

const CoverImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 5px;
  object-fit: cover;
  margin-right: 10px;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.p`
  margin: 0;
  font-weight: bold;
`;

const Artist = styled.p`
  margin: 0;
  color: #555;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
`;

const ControlButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #2980b9;
  font-size: 1.2em;
  margin: 0 5px;

  &:hover {
    color: #f1c40f;
  }
`;

const VolumeControl = styled.div`
  display: flex;
  align-items: center;
  margin: 0 10px;
`;

const VolumeButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #2980b9;
`;

const VolumeInput = styled.input`
  margin-left: 5px;
  cursor: pointer;
  width: 100px;
`;

export default Player