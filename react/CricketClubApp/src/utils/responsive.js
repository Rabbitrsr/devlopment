import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base guideline size (can adjust if designing for bigger screens)
const guidelineBaseWidth = 375;  // iPhone 11 Pro width
const guidelineBaseHeight = 812; // iPhone 11 Pro height

export const scale = (size) => (SCREEN_WIDTH / guidelineBaseWidth) * size;
export const verticalScale = (size) => (SCREEN_HEIGHT / guidelineBaseHeight) * size;
export const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

export const responsiveFont = (size) => {
  const newSize = scale(size);
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

export default {
  scale,
  verticalScale,
  moderateScale,
  responsiveFont,
};
