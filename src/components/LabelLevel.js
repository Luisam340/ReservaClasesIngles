import { React } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../theme';

export default function LabelLevel({ nivel }) {
  return (
    <View style={[styles.container]}>
      <Text style={styles.text}>{nivel}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    borderRadius: 12,
    paddingVertical: 5,
    paddingHorizontal: 6,
    marginHorizontal: 18
  },
  text: {
    color: colors.primario,
    fontSize: 13,
    fontWeight: '600',
  },
});