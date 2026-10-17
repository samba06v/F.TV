import { StyleSheet, View, Text, Image, Platform, Pressable } from 'react-native';
import {
  SpatialNavigationRoot,
  SpatialNavigationNode,
  SpatialNavigationScrollView,
  DefaultFocus,
} from 'react-tv-space-navigation';
import { DrawerActions, useIsFocused, useNavigation } from '@react-navigation/native';
import { Direction } from '@bam.tech/lrud';
import { scaledPixels } from '../hooks/useScale';
import { colors, safeZones } from '../theme';
import FocusablePressable from '../components/FocusablePressable';
import { useCallback, useState, useEffect } from 'react';
import { useMenuContext } from '../components/MenuContext';
import { getOpenDrawerDirection } from '../utils/rtl';

export default function SettingsScreen() {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const { isOpen: isMenuOpen, toggleMenu } = useMenuContext();
  const [selectedQuality, setSelectedQuality] = useState('Auto');
  const [notifications, setNotifications] = useState(true);
  const [autoplay, setAutoplay] = useState(true);

  const qualityOptions = ['Auto', '1080p', '720p', '480p'];

  // Web keyboard: Escape or Backspace goes back to Home
  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' || e.key === 'Backspace') {
          // @ts-ignore
          navigation.jumpTo?.('Home');
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [navigation]);

  const onDirectionHandledWithoutMovement = useCallback(
    (movement: Direction) => {
      if (movement === getOpenDrawerDirection()) {
        navigation.dispatch(DrawerActions.openDrawer());
        toggleMenu(true);
      }
    },
    [toggleMenu, navigation],
  );

  return (
    <SpatialNavigationRoot
      isActive={isFocused && !isMenuOpen}
      onDirectionHandledWithoutMovement={onDirectionHandledWithoutMovement}
    >
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          {/* Top Bar with Menu and Back to Home */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Pressable
                onPress={() => {
                  navigation.dispatch(DrawerActions.openDrawer());
                  toggleMenu(true);
                }}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  borderColor: 'rgba(255, 255, 255, 0.25)',
                  borderWidth: 1,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>☰ Menu</Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  // @ts-ignore
                  navigation.jumpTo?.('Home');
                }}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  borderColor: 'rgba(255, 255, 255, 0.25)',
                  borderWidth: 1,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>← Back to Home</Text>
              </Pressable>
            </View>

            <Text style={{ color: '#FF9900', fontWeight: '800', fontSize: 18 }}>
              F.TV · Settings
            </Text>
          </View>

          <Text style={styles.title}>Device & App Settings</Text>
          <SpatialNavigationScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={true}
          >
            <View style={styles.scrollContent}>
              {/* Video Quality Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Video Quality</Text>
                <SpatialNavigationNode orientation="horizontal">
                  <View style={styles.optionsRow}>
                    {qualityOptions.map((quality, index) => (
                      index === 0 ? (
                        <DefaultFocus key={quality}>
                          <FocusablePressable
                            text={quality}
                            onSelect={() => setSelectedQuality(quality)}
                            style={[
                              styles.optionButton,
                              selectedQuality === quality && styles.selectedOption,
                            ]}
                          />
                        </DefaultFocus>
                      ) : (
                        <FocusablePressable
                          key={quality}
                          text={quality}
                          onSelect={() => setSelectedQuality(quality)}
                          style={[
                            styles.optionButton,
                            selectedQuality === quality && styles.selectedOption,
                          ]}
                        />
                      )
                    ))}
                  </View>
                </SpatialNavigationNode>
              </View>

              {/* Playback Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Playback</Text>
                <SpatialNavigationNode orientation="vertical">
                  <View style={styles.optionsColumn}>
                    <FocusablePressable
                      text={`Autoplay: ${autoplay ? 'On' : 'Off'}`}
                      onSelect={() => setAutoplay(!autoplay)}
                      style={styles.toggleButton}
                    />
                    <FocusablePressable
                      text={`Notifications: ${notifications ? 'On' : 'Off'}`}
                      onSelect={() => setNotifications(!notifications)}
                      style={styles.toggleButton}
                    />
                  </View>
                </SpatialNavigationNode>
              </View>

              {/* About Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>About</Text>
                <View style={styles.infoContainer}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Version</Text>
                    <Text style={styles.infoValue}>1.0.0</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Build</Text>
                    <Text style={styles.infoValue}>2025.11.04</Text>
                  </View>
                </View>
              </View>

              {/* Actions Section */}
              <View style={styles.section}>
                <SpatialNavigationNode orientation="vertical">
                  <View style={styles.optionsColumn}>
                    <FocusablePressable
                      text="Clear Cache"
                      onSelect={() => console.log('Clear cache')}
                      style={styles.actionButton}
                    />
                    <FocusablePressable
                      text="Sign Out"
                      onSelect={() => console.log('Sign out')}
                      style={styles.actionButton}
                    />
                  </View>
                </SpatialNavigationNode>
              </View>
            </View>
          </SpatialNavigationScrollView>
        </View>
      </View>
    </SpatialNavigationRoot>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    zIndex: 100,
  },
  headerContainer: {
    width: '100%',
    height: scaledPixels(700),
    position: 'relative',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradientLeft: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  gradientBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
  },
  innerContainer: {
    flex: 1,
    backgroundColor: 'black',
    paddingTop: scaledPixels(20),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: scaledPixels(safeZones.titleSafe.horizontal),
    paddingTop: scaledPixels(16),
    paddingBottom: scaledPixels(safeZones.actionSafe.vertical + 60),
  },
  title: {
    fontSize: scaledPixels(48),
    fontWeight: 'bold',
    color: colors.text,
    paddingHorizontal: scaledPixels(safeZones.titleSafe.horizontal),
    marginBottom: scaledPixels(32),
  },
  section: {
    marginBottom: scaledPixels(40),
  },
  sectionTitle: {
    fontSize: scaledPixels(28),
    fontWeight: '600',
    color: colors.text,
    marginBottom: scaledPixels(20),
  },
  optionsRow: {
    flexDirection: 'row',
    gap: scaledPixels(16),
    flexWrap: 'wrap',
  },
  optionsColumn: {
    gap: scaledPixels(16),
  },
  optionButton: {
    marginEnd: scaledPixels(12),
    marginBottom: scaledPixels(12),
  },
  selectedOption: {
    backgroundColor: colors.primary,
  },
  toggleButton: {
    alignSelf: 'flex-start',
    minWidth: scaledPixels(300),
  },
  actionButton: {
    alignSelf: 'flex-start',
    minWidth: scaledPixels(250),
  },
  infoContainer: {
    backgroundColor: colors.card,
    borderRadius: scaledPixels(12),
    padding: scaledPixels(24),
    gap: scaledPixels(16),
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: scaledPixels(24),
    color: colors.textSecondary,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: scaledPixels(24),
    color: colors.text,
    fontWeight: '600',
  },
});
