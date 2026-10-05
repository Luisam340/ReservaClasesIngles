import React, { useState, useMemo } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import NivelChip from "../components/NivelChip";
import EstadoVacio from "../components/EstadoVacio";
import Card from "../components/Card";
import useResponsive from "../hooks/useResponsive";
import { colors, radius, spacing } from "../theme";
import { CLASES, NIVELES } from "../data/classes";

/*todos los screen necesitan la variable navigation, esto para cambiarse entre pantallas en cualquier momento
se instala la librería en este orden:
1. npx expo install @react-navigation/native
2. npx expo install @react-navigation/native-stack
3. npx expo install @react-navigation/bottom-tabs
*/

export default function InicioScreen({ navigation }) {
  const { columnas, paddingHorizontal } = useResponsive();
  const [nivel, setNivel] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");

  const resultados = useMemo(() => {
    const textoBusqueda = busqueda.trim().toLocaleLowerCase();
    return CLASES.filter((clase) => {
      const coincidenciaNivel = nivel === "Todos" || clase.nivel === nivel;
      const coincidenciaTexto =
        textoBusqueda == "" ||
        clase.titulo.toLocaleLowerCase().includes(textoBusqueda) ||
        clase.profesor.nombre.toLocaleLowerCase().includes(textoBusqueda);
      return coincidenciaNivel && coincidenciaTexto;
    });
  }, [nivel, busqueda]);

  return (
    <View style={[style.pantalla, { paddingTop: spacing.md }]}>
      {/*<Text>Aplicación para clase de Inglés</Text>*/}
      <View style={style.buscador}>
        <Ionicons name="search" size={18} color={colors.textoSuave} />
        <TextInput
          style={{ flex: 1 }}
          placeholder={nivel}
          value={busqueda}
          onChangeText={setBusqueda}
          autoCorrect={false}
        />
      </View>

      {busqueda.length > 0 && (
        <Ionicons
          name="close-circle"
          size={18}
          color={colors.textoSuave}
          onPress={() => setBusqueda("")}
        />
      )}
      <ScrollView
        style={{ flexGrow: 0, flexShrink: 0 }}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {NIVELES.map((item) => (
          <NivelChip
            key={item}
            etiqueta={item} // Esta linea da el nombre
            activo={nivel === item} // Para que un solo item quede activo
            onPress={() => setNivel(item)}
          />
        ))}
      </ScrollView>
      <FlatList
        data={resultados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return (
            <Card
              clase={item}
              onPress={() => navigation.navigate("DetalleClase", { clase: item })}
              showVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal,
                flexGrow: 1,
              }}
            />
          );
        }}
        numColumns={columnas}
        ListEmptyComponent={
          <EstadoVacio
            icono="search-outline"
            titulo="No encontramos resultados"
            mensaje="La combinación de búsqueda no tiene resultados"
            onAction={() => {
              (setNivel("Todos"), setBusqueda(""));
            }}
          />
        }
      />
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
