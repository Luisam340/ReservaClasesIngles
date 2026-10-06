import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { colors, spacing, typography } from "../theme";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useResponsive from "../hooks/useResponsive";

export default function PerfilScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { isTablet } = useResponsive();
  return (
    <View style={[
      styles.pantalla,
      { paddingTop: insets.top, paddingBottom: insets.bottom },
    ]}>
      <Text style={styles.titulo}>Bienvenido
      </Text>

      <Pressable
        onPress={() => navigation.navigate("Login")}
        style={({ pressed }) => [
          styles.boton,
          styles.botonInicio,
          pressed && styles.botonPresionado,
        ]}
      >
        <Text style={[styles.textoBoton, styles.textoInicio]}>
          Iniciar Sesión
        </Text>
      </Pressable>

      <Pressable
        onPress={() => navigation.navigate("Registro")}
        style={({ pressed }) => [
          styles.boton,
          styles.botonRegistro,
          pressed && styles.botonPresionado,
        ]}
      >
        <Text style={[styles.textoBoton, styles.textoRegistro]}>
          Registrarme
        </Text>
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
    backgroundColor: colors.fondo,
  },
  titulo: {
    ...typography.titulo,
    marginBottom: spacing.md,
  },
  mensaje: {
    ...typography.subtitulo,
    marginBottom: spacing.sm,
  },
  detalle: {
    ...typography.cuerpo,
    color: colors.textoSuave,
  },
  textoBoton: {
    fontSize: 16,
    fontWeight: "600",
  },
  boton: {
    paddingVertical: 12,
    width: 200,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 25,
    marginVertical: 5,
  },
  botonInicio: {
    backgroundColor: colors.superficie,
  },
  botonRegistro: {
    backgroundColor: colors.exito,
  },
  botonPresionado: {
    opacity: 0.8,
  },
  textoInicio: {
    color: colors.texto,
  },
  textoRegistro: {
    color: colors.superficie,
  },
});
