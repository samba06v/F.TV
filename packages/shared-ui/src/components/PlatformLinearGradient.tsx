import React, { ReactNode } from 'react';
import { View, ViewStyle, StyleProp, Platform } from 'react-native';

/**
 * Universal linear gradient component
 * Uses CSS linear-gradient on Web and safe fallback on native/Vega
 */

interface PlatformLinearGradientProps {
  colors: string[];
  style?: StyleProp<ViewStyle>;
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  locations?: number[];
  children?: ReactNode;
}

const PlatformLinearGradient: React.FC<PlatformLinearGradientProps> = ({
  colors,
  style,
  start = { x: 0, y: 0 },
  end = { x: 0, y: 1 },
  children,
}) => {
  if (Platform.OS === 'web') {
    let direction = 'to bottom';
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    if (Math.abs(dx) > Math.abs(dy)) {
      direction = dx > 0 ? 'to right' : 'to left';
    } else {
      direction = dy > 0 ? 'to bottom' : 'to top';
    }

    const gradientCss = `linear-gradient(${direction}, ${colors.join(', ')})`;

    return (
      <View
        style={[
          style as any,
          {
            // @ts-ignore
            backgroundImage: gradientCss,
          },
        ]}
      >
        {children}
      </View>
    );
  }

  // Native fallback: use the deepest color for contrast protection
  const fallbackColor = colors.find((c) => !c.includes('transparent')) || 'rgba(0, 0, 0, 0.75)';

  return (
    <View
      style={[
        style as StyleProp<ViewStyle>,
        { backgroundColor: fallbackColor },
      ]}
    >
      {children}
    </View>
  );
};

export default PlatformLinearGradient;
