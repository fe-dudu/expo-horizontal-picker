import { HorizontalPicker } from 'expo-horizontal-picker';
import { type ReactNode, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const numberItems = Array.from({ length: 1000 }, (_, i) => ({
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

function PickerSection({ value, children }: { value: string | number; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionValue}>Selected: {value}</Text>
      </View>
      {children}
    </View>
  );
}

export default function HomeScreen() {
  const [selectedNumber, setSelectedNumber] = useState(numberItems[499]?.value ?? 0);
  const [selectedThousand, setSelectedThousand] = useState(thousandItems[9]?.value ?? 0);
  const [selectedHour, setSelectedHour] = useState(hourItems[11]?.value ?? 0);
  const [selectedLargeNumber, setSelectedLargeNumber] = useState(largeNumberItems[2]?.value ?? 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>expo-horizontal-picker</Text>
        </View>

        <PickerSection value={selectedNumber}>
          <HorizontalPicker
            items={numberItems}
            initialScrollIndex={499}
            visibleItemCount={7}
            onChange={(value) => setSelectedNumber(Number(value))}
          />
        </PickerSection>

        <PickerSection value={selectedThousand}>
          <HorizontalPicker
            items={thousandItems}
            initialScrollIndex={9}
            visibleItemCount={5}
            onChange={(value) => setSelectedThousand(Number(value))}
          />
        </PickerSection>

        <PickerSection value={selectedHour}>
          <HorizontalPicker
            items={hourItems}
            initialScrollIndex={11}
            visibleItemCount={3}
            onChange={(value) => setSelectedHour(Number(value))}
          />
        </PickerSection>

        <PickerSection value={selectedLargeNumber}>
          <HorizontalPicker
            items={largeNumberItems}
            initialScrollIndex={2}
            visibleItemCount={1}
            onChange={(value) => setSelectedLargeNumber(Number(value))}
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
    paddingVertical: 24,
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
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 4,
  },
  sectionHeader: {
    gap: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111111',
  },
  sectionValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
});
