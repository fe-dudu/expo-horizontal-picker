import { HorizontalPicker, type HorizontalPickerRef, type PickerOption } from 'expo-horizontal-picker';
import { type ReactNode, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type PickerValues = {
  index: number;
  value: PickerOption['value'];
};

const numberItems = Array.from({ length: 600 }, (_, i) => ({
  label: `${i + 1}`,
  value: i + 1,
}));

const thousandItems = Array.from({ length: 20 }, (_, i) => ({
  label: `${i + 1}k`,
  value: (i + 1) * 1000,
}));

const hourItems = Array.from({ length: 24 }, (_, i) => ({
  label: `${i + 1}h`,
  value: i + 1,
}));

const largeNumberItems = Array.from({ length: 5 }, (_, i) => ({
  label: `${(i + 1) * 10000}`,
  value: (i + 1) * 10000,
}));

function PickerSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

export default function HomeScreen() {
  const sectionFirstPickerRef = useRef<HorizontalPickerRef | null>(null);
  const sectionSecondPickerRef = useRef<HorizontalPickerRef | null>(null);
  const [selectedFirst, setSelectedFirst] = useState<PickerValues>({
    index: 499,
    value: numberItems[499].value,
  });
  const [selectedSecond, setSelectedSecond] = useState<PickerValues>({
    index: 9,
    value: thousandItems[9].value,
  });
  const [selectedThird, setSelectedThird] = useState<PickerValues>({
    index: 11,
    value: hourItems[11].value,
  });
  const [selectedFourth, setSelectedFourth] = useState<PickerValues>({
    index: 2,
    value: largeNumberItems[2].value,
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>expo-horizontal-picker</Text>
        </View>

        <PickerSection title={`Sync · 7 visible → ${selectedFirst.value}`}>
          <HorizontalPicker
            ref={sectionFirstPickerRef}
            items={numberItems}
            initialScrollIndex={499}
            visibleItemCount={7}
            onChange={(value, index) => {
              setSelectedFirst({
                index: index,
                value: value,
              });
              sectionSecondPickerRef.current?.scrollToIndex({ index: index, animated: true });
            }}
            pickerItemStyle={styles.pickerItem}
          />
          <HorizontalPicker
            ref={sectionSecondPickerRef}
            items={numberItems}
            initialScrollIndex={499}
            visibleItemCount={7}
            onChange={(value, index) => {
              setSelectedFirst({
                index: index,
                value: value,
              });
              sectionFirstPickerRef.current?.scrollToIndex({ index: index, animated: true });
            }}
            pickerItemStyle={styles.pickerItem}
          />
        </PickerSection>

        <PickerSection title={`5 visible → ${selectedSecond.value}`}>
          <HorizontalPicker
            items={thousandItems}
            initialScrollIndex={9}
            visibleItemCount={5}
            onChange={(value, index) =>
              setSelectedSecond({
                index: index,
                value: value,
              })
            }
            pickerItemStyle={styles.pickerItem}
          />
        </PickerSection>

        <PickerSection title={`3 visible → ${selectedThird.value}`}>
          <HorizontalPicker
            items={hourItems}
            initialScrollIndex={11}
            visibleItemCount={3}
            onChange={(value, index) =>
              setSelectedThird({
                index: index,
                value: value,
              })
            }
            pickerItemStyle={styles.pickerItem}
          />
        </PickerSection>

        <PickerSection title={`1 visible → ${selectedFourth.value}`}>
          <HorizontalPicker
            items={largeNumberItems}
            initialScrollIndex={2}
            visibleItemCount={1}
            onChange={(value, index) =>
              setSelectedFourth({
                index: index,
                value: value,
              })
            }
            pickerItemStyle={styles.pickerItem}
          />
        </PickerSection>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eeeeee',
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 24,
  },
  header: {
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111111',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#555555',
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 2,
  },
  sectionHeader: {
    gap: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111111',
  },
  pickerItem: {
    paddingVertical: 20,
  },
});
