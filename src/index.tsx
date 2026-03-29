import { type Ref, useImperativeHandle, useMemo, useRef, useState } from 'react';
import {
  type FlatList as NativeFlatList,
  PixelRatio,
  Pressable,
  StyleSheet,
  type TextStyle,
  View,
  type ViewStyle,
} from 'react-native';
import Animated, {
  type FlatListPropsWithLayout,
  type SharedValue,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';

interface FlatListProps
  extends Omit<
    FlatListPropsWithLayout<PickerOption>,
    | 'ref'
    | 'horizontal'
    | 'data'
    | 'renderItem'
    | 'initialScrollIndex'
    | 'onScroll'
    | 'snapToOffsets'
    | 'contentContainerStyle'
    | 'getItemLayout'
  > {}

export interface PickerOption {
  label: string;
  value: string | number;
}

export interface PickerValues {
  index: number;
  value: PickerOption['value'];
}

export interface HorizontalPickerRef {
  scrollToEnd: (params?: { animated?: boolean | null }) => void;
  scrollToIndex: (params: {
    animated?: boolean | null;
    index: number;
    viewOffset?: number;
    viewPosition?: number;
  }) => void;
  scrollToItem: (params: {
    animated?: boolean | null;
    item: PickerOption;
    viewOffset?: number;
    viewPosition?: number;
  }) => void;
  scrollToOffset: (params: { animated?: boolean | null; offset: number }) => void;
}

export interface HorizontalPickerProps extends FlatListProps {
  ref?: Ref<HorizontalPickerRef | null>;
  items: PickerOption[];
  initialScrollIndex?: number;
  visibleItemCount?: number;
  onChange?: (value: PickerOption['value'], index: number) => void;
  focusedTransformStyle?: ViewStyle['transform'];
  unfocusedTransformStyle?: ViewStyle['transform'];
  focusedOpacityStyle?: number;
  unfocusedOpacityStyle?: number;
  pickerItemStyle?: ViewStyle;
  pickerItemTextStyle?: TextStyle;
}

export function HorizontalPicker({
  ref,
  items,
  initialScrollIndex = 0,
  visibleItemCount = 7,
  onChange,
  keyExtractor = (item, index) => `${item.value}-${index}`,
  scrollEventThrottle = 16,
  decelerationRate = 'fast',
  onLayout,
  showsHorizontalScrollIndicator = false,
  initialNumToRender = 15,
  maxToRenderPerBatch = 15,
  removeClippedSubviews = true,
  focusedTransformStyle = [{ scale: 1.15 }],
  unfocusedTransformStyle = [{ scale: 1 }],
  focusedOpacityStyle = 1,
  unfocusedOpacityStyle = 0.2,
  pickerItemStyle,
  pickerItemTextStyle,
  style,
  ...props
}: HorizontalPickerProps) {
  const listRef = useRef<NativeFlatList<PickerOption> | null>(null);
  const [width, setWidth] = useState<number>(0);

  const currentIndex = useSharedValue<number>(initialScrollIndex);

  const { itemWidth, paddingSide } = useMemo(() => {
    const itemWidth = PixelRatio.roundToNearestPixel(width / visibleItemCount);
    const paddingSide = PixelRatio.roundToNearestPixel(width / 2 - itemWidth / 2);
    return {
      itemWidth: itemWidth,
      paddingSide: paddingSide,
    };
  }, [width, visibleItemCount]);

  const snapOffsets = useMemo(() => {
    return items.map((_, index) => PixelRatio.roundToNearestPixel(index * itemWidth));
  }, [items, itemWidth]);

  const handleOnChange = (index: number) => {
    const item = items[index];
    if (item) {
      onChange?.(item.value, index);
    }
  };

  const scrollToIndex = (index: number) => {
    listRef.current?.scrollToOffset({
      offset: index * itemWidth,
      animated: true,
    });
  };

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      const newIndex = Math.round(e.contentOffset.x / itemWidth);
      const safeIndex = Math.max(0, Math.min(items.length - 1, newIndex));
      currentIndex.value = safeIndex;
    },
    onMomentumEnd: (e) => {
      const newIndex = Math.round(e.contentOffset.x / itemWidth);
      const safeIndex = Math.max(0, Math.min(items.length - 1, newIndex));
      currentIndex.value = safeIndex;
      runOnJS(handleOnChange)(safeIndex);
    },
  });

  useImperativeHandle(
    ref,
    () => ({
      scrollToEnd: (params) => listRef.current?.scrollToEnd(params),
      scrollToIndex: (params) => listRef.current?.scrollToIndex(params),
      scrollToItem: (params) => listRef.current?.scrollToItem(params),
      scrollToOffset: (params) => listRef.current?.scrollToOffset(params),
    }),
    [],
  );

  return (
    <Animated.FlatList
      {...props}
      ref={listRef}
      horizontal={true}
      data={items}
      keyExtractor={keyExtractor}
      renderItem={({ item, index }) => (
        <PickerItem
          label={item.label}
          index={index}
          itemWidth={itemWidth}
          currentIndex={currentIndex}
          onPress={() => scrollToIndex(index)}
          focusedTransformStyle={focusedTransformStyle}
          unfocusedTransformStyle={unfocusedTransformStyle}
          focusedOpacityStyle={focusedOpacityStyle}
          unfocusedOpacityStyle={unfocusedOpacityStyle}
          pickerItemStyle={pickerItemStyle}
          pickerItemTextStyle={pickerItemTextStyle}
        />
      )}
      onScroll={onScroll}
      scrollEventThrottle={scrollEventThrottle}
      decelerationRate={decelerationRate}
      onLayout={(e) => {
        if (typeof onLayout === 'function') {
          onLayout(e);
        }
        setWidth(e.nativeEvent.layout.width);
      }}
      showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
      snapToOffsets={snapOffsets}
      contentContainerStyle={{ paddingHorizontal: paddingSide }}
      getItemLayout={(_, index) => ({
        length: itemWidth,
        offset: itemWidth * index,
        index,
      })}
      initialScrollIndex={initialScrollIndex}
      initialNumToRender={initialNumToRender}
      maxToRenderPerBatch={maxToRenderPerBatch}
      removeClippedSubviews={removeClippedSubviews}
      style={[styles.container, style]}
    />
  );
}
interface PickerItemProps
  extends Pick<
    HorizontalPickerProps,
    | 'focusedTransformStyle'
    | 'unfocusedTransformStyle'
    | 'focusedOpacityStyle'
    | 'unfocusedOpacityStyle'
    | 'pickerItemStyle'
    | 'pickerItemTextStyle'
  > {
  label: string;
  index: number;
  itemWidth: number;
  currentIndex: SharedValue<number>;
  onPress: () => void;
}

function PickerItem({
  label,
  index,
  itemWidth,
  currentIndex,
  onPress,
  focusedTransformStyle,
  unfocusedTransformStyle,
  focusedOpacityStyle,
  unfocusedOpacityStyle,
  pickerItemStyle,
  pickerItemTextStyle,
}: PickerItemProps) {
  const isFocused = useDerivedValue(() => currentIndex.value === index);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: isFocused.value ? focusedTransformStyle : unfocusedTransformStyle,
      opacity: isFocused.value ? focusedOpacityStyle : unfocusedOpacityStyle,
    };
  }, [index]);

  return (
    <Pressable onPress={onPress}>
      <View style={[styles.itemContainer, { width: itemWidth }, pickerItemStyle]}>
        <Animated.Text style={[styles.itemText, animatedStyle, pickerItemTextStyle]}>{label}</Animated.Text>
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
  },
  itemText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000000',
  },
});
