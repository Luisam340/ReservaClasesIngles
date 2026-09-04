import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import LabelLevel from "../components/LabelLevel";
import NivelChip from "../components/NivelChip";
import { colors, radius, spacing, typography } from "../theme";
import { formatearPrecio, CLASES, NIVELES } from "../data/classes";

/*todos los screen necesitan la variable navigation, esto para cambiarse entre pantallas en cualquier momento
se instala la librería en este orden: 
1. npx expo install @react-navigation/native
2. npx expo install @react-navigation/native-stack
3. npx expo install @react-navigation/bottom-tabs
*/

export default function ClasesScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [nivel, setNivel] = useState();
  const [busqueda, setBusqueda] = useState("");

  return (
    <View style={[style.pantalla, { paddingTop: insets.top + spacing.md }]}>
      <View>
        <Text>Aplicación para clase de Inglés</Text>
        <Ionicons name="search" size={18} color={colors.textoSuave} />
        {/*Poner color al textpo porque por defecto la caja (text input) y el texto son color blanco*/}
        <TextInput
          placeholder="Buscar por nivel"
          value={nivel}
          onChangeText={setNivel}
          autoCorrect={false}
        />
        {busqueda.length > 0 && (
          <Ionicons
            name="close-circle"
            size={18}
            color={colors.textoSuave}
            onPress={() => setBusqueda("")}
          />
        )}
      </View>
      <ScrollView style={{ flexGrow: 0 }} horizontal>
        {NIVELES.map((item) => (
          <NivelChip
            key={item}
            etiqueta={item}
            activo={item}
            onPress={() => setNivel(item)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const style = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colors.fondo },
  buscador: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.superficie,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    height: 46,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borde,
  },
  input: { flex: 1, fontSize: 14, color: colors.texto, paddingVertical: 0 },
});
