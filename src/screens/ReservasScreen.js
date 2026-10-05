import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "../theme";

export default function ReservasScreen() {
  return (
    <View style={styles.pantalla}>
      <Text style={styles.titulo}>Mis reservas</Text>
      <Text style={styles.mensaje}>
        Regístrate para consultar y administrar tus reservas de clases.
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
    ...typography.cuerpo,
    color: colors.textoSuave,
  },
});
