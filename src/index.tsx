import { useCallback, useMemo, useRef, useState } from 'react';
import {
  type LayoutChangeEvent,
  PixelRatio,
  Platform,
  Pressable,
  type StyleProp,
  StyleSheet,
  Text,
  type TextStyle,
  View,
  type ViewStyle,
} from 'react-native';
import Animated, {
  type AnimatedScrollViewProps,
  runOnJS,
  type SharedValue,
  useAnimatedScrollHandler,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';

interface PickerOption {
  label: string;
  value: string | number;
}

interface Props extends Omit<AnimatedScrollViewProps, 'style'> {
  data: PickerOption[];
  initialIndex?: number;
  visibleItemCount?: number;
  onChange?: (value: PickerOption['value'], index: number) => void;
  onHapticFeedback?: () => void;
  containerStyle?: AnimatedScrollViewProps['style'];
  itemContainerStyle?: StyleProp<ViewStyle>;
  itemTextStyle?: StyleProp<TextStyle>;
  selectedItemTextStyle?: StyleProp<TextStyle>;
}

export function HorizontalPicker({
  data,
  initialIndex = 0,
  visibleItemCount = 7,
  onChange,
  onHapticFeedback,
  containerStyle,
  itemContainerStyle,
  itemTextStyle,
  selectedItemTextStyle,
  ...props
}: Props) {
  const scrollViewRef = useRef<Animated.ScrollView>(null);
  const lastHapticIndexRef = useRef<number>(-1);
  const [scrollViewWidth, setScrollViewWidth] = useState<number>(0);

  const scrollX = useSharedValue<number>(0);
  const currentIndex = useSharedValue<number>(initialIndex);

  const { itemWidth, paddingSide } = useMemo(() => {
    const width = PixelRatio.roundToNearestPixel(scrollViewWidth / visibleItemCount);
    const padding = PixelRatio.roundToNearestPixel(scrollViewWidth / 2 - width / 2);
    return {
      itemWidth: width,
      paddingSide: padding,
    };
  }, [scrollViewWidth, visibleItemCount]);

  const snapOffsets = useMemo(() => {
    return data.map((_, index) => PixelRatio.roundToNearestPixel(index * itemWidth));
  }, [data, itemWidth]);

  const handleOnLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const layoutWidth = e.nativeEvent.layout.width;
      setScrollViewWidth(layoutWidth);

      const safeIndex = Math.max(0, Math.min(data.length - 1, initialIndex));
      const rawItemWidth = layoutWidth / visibleItemCount;
      const x = PixelRatio.roundToNearestPixel(safeIndex * rawItemWidth);

      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ x, y: 0, animated: true });
      }, 0);
    },
    [initialIndex, data.length, visibleItemCount],
  );

  const handleOnScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const handleOnPress = useCallback(
    (newIndex: number) => {
      const safeIndex = Math.max(0, Math.min(data.length - 1, newIndex));
      const x = PixelRatio.roundToNearestPixel(safeIndex * itemWidth);
      scrollViewRef.current?.scrollTo({ x, y: 0, animated: true });
    },
    [data.length, itemWidth],
  );

  const handleOnChange = useCallback(
    (index: number) => {
      const item = data[index];
      if (item) {
        onChange?.(item.value, index);
      }
    },
    [onChange, data],
  );

  const handleOnHapticFeedback = useCallback(
    (index: number) => {
      if (index !== lastHapticIndexRef.current && index >= 0 && index < data.length) {
        lastHapticIndexRef.current = index;
        onHapticFeedback?.();
      }
    },
    [data.length, onHapticFeedback],
  );

  useDerivedValue(() => {
    if (scrollViewWidth === 0) {
      return;
    }

    const newIndex = Math.round(scrollX.value / itemWidth);
    const safeIndex = Math.max(0, Math.min(data.length - 1, newIndex));

    if (safeIndex !== currentIndex.value) {
      currentIndex.value = safeIndex;
      runOnJS(handleOnChange)(safeIndex);
      runOnJS(handleOnHapticFeedback)(safeIndex);
    }
  }, [itemWidth, data.length]);

  return (
    <Animated.ScrollView
      ref={scrollViewRef}
      horizontal
      onLayout={handleOnLayout}
      onScroll={handleOnScroll}
      showsHorizontalScrollIndicator={false}
      scrollEventThrottle={Platform.select({ ios: 16, android: 2 })}
      decelerationRate={Platform.select({ ios: undefined, android: 'fast' })}
      snapToOffsets={snapOffsets}
      contentContainerStyle={{ paddingHorizontal: paddingSide }}
      style={[styles.container, containerStyle]}
      {...props}
    >
      {data.map((item, index) => (
        <PickerItem
          key={`picker-item-${item.value}`}
          label={item.label}
          index={index}
          currentIndex={currentIndex}
          itemWidth={itemWidth}
          onPress={() => handleOnPress(index)}
          itemContainerStyle={itemContainerStyle}
          itemTextStyle={itemTextStyle}
          selectedItemTextStyle={selectedItemTextStyle}
        />
      ))}
    </Animated.ScrollView>
  );
}

function PickerItem({
  label,
  index,
  currentIndex,
  itemWidth,
  onPress,
  itemContainerStyle,
  itemTextStyle,
  selectedItemTextStyle,
}: {
  label: PickerOption['label'];
  index: number;
  currentIndex: SharedValue<number>;
  itemWidth: number;
  onPress: () => void;
  itemContainerStyle?: StyleProp<ViewStyle>;
  itemTextStyle?: StyleProp<TextStyle>;
  selectedItemTextStyle?: StyleProp<TextStyle>;
}) {
  const [isFocused, setIsFocused] = useState(false);

  useDerivedValue(() => {
    const shouldBeFocused = currentIndex.value === index;
    if (shouldBeFocused !== isFocused) {
      runOnJS(setIsFocused)(shouldBeFocused);
    }
  });

  return (
    <Pressable onPress={onPress}>
      <View style={[{ width: itemWidth }, styles.itemContainer, itemContainerStyle]}>
        <Text style={isFocused ? [styles.itemTextSelected, selectedItemTextStyle] : [styles.itemText, itemTextStyle]}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  itemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
  },
  itemText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#C9CED9',
  },
  itemTextSelected: {
    fontSize: 15,
    fontWeight: '800',
    color: '#000000',
  },
});
