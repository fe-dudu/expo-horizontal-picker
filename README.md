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

Make sure to follow the additional setup instructions for Reanimated in the [official docs](https://docs.expo.dev/versions/latest/sdk/reanimated/#installation).

## 🎬 Demo
```ts
import { HorizontalPicker } from 'expo-horizontal-picker';
import { View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <View>
        <HorizontalPicker
          items={Array.from({ length: 1000 }, (_, i) => ({
            label: `${i + 1}`,
            value: i + 1,
          }))}
          initialScrollIndex={500}
          visibleItemCount={7}
        />

        <HorizontalPicker
          items={Array.from({ length: 20 }, (_, i) => ({
            label: `${i + 1}k`,
            value: (i + 1) * 1000,
          }))}
          initialScrollIndex={9}
          visibleItemCount={5}
        />

        <HorizontalPicker
          items={Array.from({ length: 24 }, (_, i) => ({
            label: `${i + 1}h`,
            value: i + 1,
          }))}
          initialScrollIndex={11}
          visibleItemCount={3}
        />

        <HorizontalPicker
          items={Array.from({ length: 5 }, (_, i) => ({
            label: `${(i + 1) * 10000}`,
            value: (i + 1) * 10000,
          }))}
          initialScrollIndex={2}
          visibleItemCount={1}
        />
      </View>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
};
```

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

## ⚡ Performance Notes

The `focusedTransformStyle` and `unfocusedTransformStyle` props only accept GPU-accelerated transform properties (e.g., `scale`, `translateX`, `translateY`, `rotate`) for optimal performance. These properties are processed directly on the GPU without triggering layout recalculations.