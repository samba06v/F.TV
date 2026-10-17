import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { AppNavigator } from '@multi-tv/shared-ui';
import { LogBox } from 'react-native';
import '../../packages/shared-ui/src/app/configureRemoteControl';

// Suppress specific deprecation warnings that don't affect functionality
// These warnings come from libraries using deprecated React methods
if (__DEV__) {
  // Suppress in LogBox
  LogBox.ignoreLogs([
    /findNodeHandle is deprecated/,
    /findHostInstance_DEPRECATED is deprecated/,
  ]);

  // Also suppress at console level for warnings that slip through
  const originalWarn = console.warn;
  console.warn = (...args) => {
    const message = args[0]?.toString() || '';
    if (
      message.includes('findNodeHandle is deprecated') ||
      message.includes('findHostInstance_DEPRECATED is deprecated')
    ) {
      return;
    }
    originalWarn(...args);
  };
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [loaded, error] = useFonts({
    SpaceMono: require('./assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
      if (error) {
        console.warn(`Error in loading fonts: ${error}`);
      }
    }

    // Inject visible Fire TV styled scrollbars on web
    if (typeof document !== 'undefined') {
      const styleId = 'fire-tv-custom-scrollbars';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
          /* Ensure scrollbars are always visible on every page */
          html, body, #root, [data-testid="root"], div {
            scrollbar-width: thin !important;
            scrollbar-color: #FF9900 rgba(15, 23, 42, 0.8) !important;
          }
          ::-webkit-scrollbar {
            width: 10px !important;
            height: 10px !important;
            display: block !important;
          }
          ::-webkit-scrollbar-track {
            background: rgba(15, 23, 42, 0.85) !important;
            border-radius: 6px !important;
          }
          ::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, #FF9900, #F97316) !important;
            border-radius: 6px !important;
            border: 2px solid rgba(15, 23, 42, 0.8) !important;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: #22D3EE !important;
          }
        `;
        document.head.appendChild(style);
      }
    }
  }, [loaded, error]);

  return <AppNavigator fontsLoaded={loaded || !!error} />;
}
