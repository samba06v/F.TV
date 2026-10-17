// ============================================================================
// ViewAI — Enhanced Player Screen
// Integrates the AI Companion Panel, Highlights Timeline, and Viewing
// Context Panel into the existing video player.
// ============================================================================

import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
} from 'react';

import { View, Platform, StyleSheet, Pressable, Text } from 'react-native';

import {
  SpatialNavigationRoot,
} from 'react-tv-space-navigation';

import {
  useIsFocused,
  useNavigation,
  useRoute,
  RouteProp,
} from '@react-navigation/native';

import {
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import RemoteControlManager from '../app/remote-control/RemoteControlManager';
import { SupportedKeys } from '../app/remote-control/SupportedKeys';

import VideoOverlay from '../components/player/VideoOverlay';
import { VideoRef } from 'react-native-video';
import VideoPlayer from '../components/player/VideoPlayer';

import { RootStackParamList } from '../navigation/types';

// ViewAI Components
import AICompanionPanel from '../components/ai/AICompanionPanel';
import HighlightsTimeline from '../components/highlights/HighlightsTimeline';
import ViewingContextPanel from '../components/context/ViewingContextPanel';

const SHOW_NATIVE_CONTROLS = Platform.OS === 'ios';

type PlayerScreenRouteProp = RouteProp<
  RootStackParamList,
  'Player'
>;

type PlayerScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Player'
>;

// Which ViewAI panel is currently open
type ActivePanel = 'none' | 'ai' | 'highlights';

export default function PlayerScreen() {
  const route = useRoute<PlayerScreenRouteProp>();
  const navigation = useNavigation<PlayerScreenNavigationProp>();

  // Receive the selected movie's information from the Details screen.
  const {
    movie,
    headerImage,
    title,
    description,
    category,
    genres,
    releaseYear,
    rating,
    ratingCount,
    contentRating,
    duration,
  } = route.params;

  const isFocused = useIsFocused();

  const [paused, setPaused] = useState<boolean>(false);
  const [controlsVisible, setControlsVisible] = useState<boolean>(false);
  const [isVideoBuffering, setIsVideoBuffering] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);

  const videoRef = useRef<VideoRef>(null);
  const hideControlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const currentTimeRef = useRef<number>(0);
  const durationRef = useRef<number>(0);

  // ViewAI state
  const [activePanel, setActivePanel] = useState<ActivePanel>('none');
  const [contextVisible, setContextVisible] = useState<boolean>(false);

  // --------------------------------------------------------------------------
  // Playback controls
  // --------------------------------------------------------------------------

  const showControls = useCallback(() => {
    setControlsVisible(true);
    setContextVisible(true);

    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current);
    }

    hideControlsTimeoutRef.current = setTimeout(() => {
      setControlsVisible(false);

      if (activePanel === 'none') {
        setContextVisible(false);
      }
    }, 6000);
  }, [activePanel]);

  const seek = useCallback(
    (time: number) => {
      const durationSeconds = durationRef.current;

      let targetTime = Math.max(0, time);

      if (durationSeconds > 0) {
        targetTime = Math.min(targetTime, durationSeconds);
      }

      videoRef.current?.seek(targetTime);

      currentTimeRef.current = targetTime;
      setCurrentTime(targetTime);

      showControls();
    },
    [showControls],
  );

  const togglePausePlay = useCallback(() => {
    setPaused((previous) => !previous);
    showControls();
  }, [showControls]);

  // --------------------------------------------------------------------------
  // ViewAI panel toggling
  // --------------------------------------------------------------------------

  const openAIPanel = useCallback(() => {
    setActivePanel('ai');
    setContextVisible(false);
  }, []);

  const openHighlightsPanel = useCallback(() => {
    setActivePanel('highlights');
    setContextVisible(false);
  }, []);

  const closePanel = useCallback(() => {
    setActivePanel('none');
    showControls();
  }, [showControls]);

  const handleSeekTo = useCallback(
    (timestamp: number) => {
      seek(timestamp);
      setActivePanel('none');
      showControls();
    },
    [seek, showControls],
  );

  // --------------------------------------------------------------------------
  // Remote-control handling
  // --------------------------------------------------------------------------

  useEffect(() => {
    if (SHOW_NATIVE_CONTROLS) {
      return;
    }

    const handleKeyDown = (key: SupportedKeys) => {
      // Back closes an open ViewAI panel before leaving the player.
      if (activePanel !== 'none' && key === SupportedKeys.Back) {
        closePanel();
        return;
      }

      switch (key) {
        case SupportedKeys.Right:
        case SupportedKeys.Rewind:
          if (activePanel === 'none') {
            seek(currentTimeRef.current + 10);
          }
          break;

        case SupportedKeys.Left:
        case SupportedKeys.FastForward:
          if (activePanel === 'none') {
            seek(currentTimeRef.current - 10);
          }
          break;

        case SupportedKeys.Back:
          navigation.goBack();
          break;

        case SupportedKeys.PlayPause:
          togglePausePlay();
          break;

        case SupportedKeys.Up:
          if (activePanel === 'none') {
            showControls();
          }
          break;

        default:
          if (activePanel === 'none') {
            showControls();
          }
          break;
      }
    };

    // Register the handler and use its cleanup function when the
    // effect is removed or the handler changes.
    const unsubscribe =
      RemoteControlManager.addKeydownListener(handleKeyDown);

    return unsubscribe;
  }, [
    seek,
    togglePausePlay,
    showControls,
    navigation,
    activePanel,
    closePanel,
  ]);

  // Clear the controls timer when the player screen unmounts.
  useEffect(() => {
    return () => {
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current);
      }
    };
  }, []);

  // Show controls when the video has a known duration.
  useEffect(() => {
    if (durationRef.current > 0 && !SHOW_NATIVE_CONTROLS) {
      showControls();
    }
  }, [showControls]);

  // Keyboard navigation on Web: Escape or Backspace goes back
  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' || e.key === 'Backspace') {
          if (activePanel !== 'none') {
            closePanel();
          } else {
            navigation.goBack();
          }
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [navigation, activePanel, closePanel]);

  // Determine if spatial navigation should be active (on all platforms when focused)
  const spatialNavActive = isFocused;

  // --------------------------------------------------------------------------
  // Render
  // --------------------------------------------------------------------------

  return (
    <SpatialNavigationRoot isActive={spatialNavActive}>
      <View style={playerStyles.container}>
        {/* Quick Exit / Back Button on Web / TV */}
        <View style={playerStyles.topExitBar}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={playerStyles.exitButton}
          >
            <Text style={playerStyles.exitButtonText}>← Exit Player</Text>
          </Pressable>
        </View>

        {/* Video Player */}
        <View
          style={[
            playerStyles.videoContainer,
            activePanel !== 'none' &&
              playerStyles.videoContainerWithPanel,
          ]}
        >
          <VideoPlayer
            ref={videoRef}
            movie={movie}
            headerImage={headerImage}
            paused={paused}
            controls={SHOW_NATIVE_CONTROLS}
            onBuffer={setIsVideoBuffering}
            onProgress={(time) => {
              currentTimeRef.current = time;
              setCurrentTime(time);
            }}
            onLoad={(videoDuration) => {
              durationRef.current = videoDuration;
            }}
            onEnd={() => {
              setPaused(true);
              navigation.goBack();
            }}
          />

          {/* Standard video overlay */}
          {!SHOW_NATIVE_CONTROLS && durationRef.current > 0 && (
            <VideoOverlay
              visible={
                controlsVisible && activePanel === 'none'
              }
              paused={paused}
              onPlayPause={togglePausePlay}
              onExit={() => navigation.goBack()}
              currentTime={currentTime}
              duration={durationRef.current}
              isBuffering={isVideoBuffering}
            />
          )}

          {/* ViewAI: Context-Aware Viewing Bar */}
          <ViewingContextPanel
            visible={
              contextVisible && activePanel === 'none'
            }
            currentTimestamp={currentTime}
            onOpenAI={openAIPanel}
            onOpenHighlights={openHighlightsPanel}
          />
        </View>

        {/* ViewAI: AI Companion Panel */}
        <AICompanionPanel
          visible={activePanel === 'ai'}
          currentTimestamp={currentTime}
          onClose={closePanel}
          onSeekTo={handleSeekTo}
          title={title}
          description={description}
          category={category}
          genres={genres}
          releaseYear={releaseYear}
          rating={rating}
          ratingCount={ratingCount}
          contentRating={contentRating}
          duration={duration}
        />

        {/* ViewAI: Highlights Timeline */}
        <HighlightsTimeline
          visible={activePanel === 'highlights'}
          currentTimestamp={currentTime}
          onSeekTo={handleSeekTo}
          onClose={closePanel}
        />
      </View>
    </SpatialNavigationRoot>
  );
}

// ============================================================================
// Styles
// ============================================================================

const playerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    flexDirection: 'row',
  },

  videoContainer: {
    flex: 1,
  },

  videoContainerWithPanel: {
    // The video shrinks when a side panel is open.
    flex: 0.58,
  },

  controlsContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'space-between',
    zIndex: 1,
  },

  topExitBar: {
    position: 'absolute',
    top: 24,
    start: 32,
    zIndex: 999,
  },

  exitButton: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },

  exitButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});