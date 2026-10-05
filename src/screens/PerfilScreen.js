import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "../theme";

export default function PerfilScreen() {
  return (
    <View style={styles.pantalla}>
      <Text style={styles.titulo}>Perfil del estudiante</Text>
      <Text style={styles.mensaje}>
        Aún no hay información de estudiante registrada.
      </Text>
      <Text style={styles.detalle}>
        El registro y la consulta de tus datos estarán disponibles aquí.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    justifyContent: "center",
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
});
