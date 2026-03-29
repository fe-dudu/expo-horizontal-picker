# expo-horizontal-picker
[![npm version](https://badge.fury.io/js/expo-horizontal-picker.svg)](https://badge.fury.io/js/expo-horizontal-picker)
[![npm downloads](https://img.shields.io/npm/dm/expo-horizontal-picker.svg?style=flat-square)](https://www.npmjs.com/package/expo-horizontal-picker)

A performant horizontal picker component for React Native and Expo apps.
- **Smooth Horizontal Scrolling**  
  Optimized with [`react-native-reanimated`](https://docs.expo.dev/versions/latest/sdk/reanimated/) for buttery-smooth, performant scroll animations.

- **Snapping Behavior**  
  Automatically snaps to the closest item to give users a precise and polished interaction.

- **GPU-Accelerated Animations**  
  Customize transform and opacity styles for focused/unfocused items with GPU-accelerated properties for optimal performance.

- **Initial Index Support**  
  Set the starting index to highlight a default item.

- **TypeScript Support**  
  Fully typed API for a better developer experience.

- **Works with Expo and Bare React Native**  
  Supports both managed and bare workflows out of the box.

## 📦 Installation

#### 1. Install the package
This package requires [`react-native-reanimated`](https://docs.expo.dev/versions/latest/sdk/reanimated/) to work:

```bash
npm install expo-horizontal-picker react-native-reanimated
```

`ref` support uses React 19's ref-as-prop model, so install this package in a React 19 app.

Make sure to follow the additional setup instructions for Reanimated in the [official docs](https://docs.expo.dev/versions/latest/sdk/reanimated/#installation).

## 🎬 Demo

![expo-horizontal-picker demo](https://raw.githubusercontent.com/fe-dudu/expo-horizontal-picker/main/assets/demo.gif)

```ts
import { HorizontalPicker, type HorizontalPickerRef, type PickerValues } from 'expo-horizontal-picker';
import { useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const numberItems = Array.from({ length: 600 }, (_, i) => ({
  label: `${i + 1}`,
  value: i + 1,
}));

export default function App() {
  const firstPickerRef = useRef<HorizontalPickerRef | null>(null);
  const secondPickerRef = useRef<HorizontalPickerRef | null>(null);
  const [selected, setSelected] = useState<PickerValues>({
    index: 499,
    value: numberItems[499].value,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sync · 7 visible → {selected.value}</Text>

      <HorizontalPicker
        ref={firstPickerRef}
        items={numberItems}
        initialScrollIndex={499}
        visibleItemCount={7}
        onChange={(value, index) => {
          setSelected({ index, value });
          secondPickerRef.current?.scrollToIndex({ index, animated: true });
        }}
        pickerItemStyle={styles.pickerItem}
      />

      <HorizontalPicker
        ref={secondPickerRef}
        items={numberItems}
        initialScrollIndex={499}
        visibleItemCount={7}
        onChange={(value, index) => {
          setSelected({ index, value });
          firstPickerRef.current?.scrollToIndex({ index, animated: true });
        }}
        pickerItemStyle={styles.pickerItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#eeeeee',
  },
  title: {
    marginBottom: 12,
    fontSize: 18,
    fontWeight: '700',
    color: '#111111',
  },
  pickerItem: {
    paddingVertical: 20,
  },
});
```

## Ref Usage

Pass a ref when you need the picker scroll methods: `scrollToEnd`, `scrollToIndex`, `scrollToItem`, or `scrollToOffset`.

The picker is intentionally stateful around its own scroll position. A ref is meant for imperative coordination, such as keeping two pickers visually in sync or jumping to a specific item from another control. If you choose that pattern, keep any mirrored app state in the parent and update it alongside the ref call, just like the example below.

```ts
import { HorizontalPicker, type HorizontalPickerRef, type PickerValues } from 'expo-horizontal-picker';
import { useRef, useState } from 'react';
import { Text, View } from 'react-native';

export default function RefExample() {
  const firstPickerRef = useRef<HorizontalPickerRef | null>(null);
  const secondPickerRef = useRef<HorizontalPickerRef | null>(null);
  const [selected, setSelected] = useState<PickerValues>({
    index: 0,
    value: items[0].value,
  });

  return (
    <View>
      <Text>Selected: {selected.value}</Text>

      <HorizontalPicker
        ref={firstPickerRef}
        items={items}
        onChange={(value, index) => {
          setSelected({ index, value });
          secondPickerRef.current?.scrollToIndex({ index, animated: true });
        }}
      />

      <HorizontalPicker
        ref={secondPickerRef}
        items={items}
        onChange={(value, index) => {
          setSelected({ index, value });
          firstPickerRef.current?.scrollToIndex({ index, animated: true });
        }}
      />
    </View>
  );
}
```

## 📱 Example App

A runnable Expo example app is included in [`example`](./example). It mirrors the README demo and includes ref-driven scroll controls.

```bash
cd example
yarn
yarn start
```

The example app resolves `expo-horizontal-picker` to this repository's local `src` directory through Metro, so you can iterate on the library and see changes immediately in the app.

## 🎨 Customization Example

Customize the focused and unfocused item styles with GPU-accelerated properties:

```ts
<HorizontalPicker
  items={items}
  focusedTransformStyle={[{ scale: 1.2 }]}
  unfocusedTransformStyle={[{ scale: 0.9 }]}
  focusedOpacityStyle={1}
  unfocusedOpacityStyle={0.3}
  pickerItemStyle={{ height: 80 }}
  onChange={(value, index) => console.log('Selected:', value, index)}
/>
```

## 🧩 Props

| Prop                        | Type                                                   | Default              | Description                                                                    |
|----------------------------|--------------------------------------------------------|----------------------|---------------------------------------------------------------------------------|
| `items`                     | `PickerOption[]`                                       | –                    | Array of options to display. Each option is an object with `label` and `value`. |
| `initialScrollIndex`       | `number`                                               | `0`                  | Index of the item initially selected.                                           |
| `visibleItemCount`         | `number`                                               | `7`                  | Number of items visible on screen at once.                                      |
| `onChange`                 | `(value: string \| number, index: number) => void`     | –                    | Callback triggered when the selected item changes.                              |
| `focusedTransformStyle`    | `ViewStyle['transform']`                               | `[{ scale: 1.15 }]`  | Transform style applied to the focused item (GPU-accelerated).                  |
| `unfocusedTransformStyle`  | `ViewStyle['transform']`                               | `[{ scale: 1 }]`     | Transform style applied to unfocused items (GPU-accelerated).                   |
| `focusedOpacityStyle`      | `number`                                               | `1`                  | Opacity value for the focused item (GPU-accelerated).                           |
| `unfocusedOpacityStyle`    | `number`                                               | `0.2`                | Opacity value for unfocused items (GPU-accelerated).                            |
| `pickerItemStyle`          | `ViewStyle`                                            | –                    | Style applied to each picker item container.                                    |
| `pickerItemTextStyle`      | `TextStyle`                                            | –                    | Style applied to the text inside each picker item.                              |
| `style`                    | `ViewStyle`                                            | –                    | Style applied to the scroll container.                                          |

### Additional FlatList Props

The component extends `FlatListPropsWithLayout`, so you can also pass any valid FlatList props such as:
- `keyExtractor` (default: `(item, index) => ${item.value}-${index}`)
- `scrollEventThrottle` (default: `16`)
- `decelerationRate` (default: `'fast'`)
- `onLayout`
- `showsHorizontalScrollIndicator` (default: `false`)
- `initialNumToRender` (default: `15`)
- `maxToRenderPerBatch` (default: `15`)
- `removeClippedSubviews` (default: `true`)
- `ref` to call `scrollToEnd`, `scrollToIndex`, `scrollToItem`, and `scrollToOffset`

## ⚡ Performance Notes

The `focusedTransformStyle` and `unfocusedTransformStyle` props only accept GPU-accelerated transform properties (e.g., `scale`, `translateX`, `translateY`, `rotate`) for optimal performance. These properties are processed directly on the GPU without triggering layout recalculations.
