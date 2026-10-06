import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { colors, spacing, typography } from "../theme";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useResponsive from "../hooks/useResponsive";

export default function Registro({ })  {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { isTablet } = useResponsive();

  return (
  <KeyboardAvoidingView style={{ flex: 1 }}
    behavior={Platform.OS === "ios" ? "padding" : "height"}>
    <ScrollView
      style={[
        styles.pantalla,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
      contentContainerStyle={styles.contenido}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.titulo}>Regístrate</Text>

        <View style={styles.formulario}>
            <TextInput style={styles.TextInput} placeholder="Nombre" />
            <TextInput style={styles.TextInput} placeholder="Apellido" />
            <TextInput style={styles.TextInput} placeholder="Correo electrónico" />
            <TextInput style={styles.TextInput} placeholder="Contraseña" secureTextEntry={true} />
            <TextInput style={styles.TextInput} placeholder="Confirmar contraseña"
            secureTextEntry={true} />
        </View>
        <View>
            <Pressable
              onPress={() => navigation.navigate("#")}
              style={({ pressed }) => [
                styles.boton,
                styles.botonRegistro,
                pressed && styles.botonPresionado,
              ]}>
              <Text style={[styles.textoBoton, styles.textoRegistro]}>
                Registrarme
              </Text>
            </Pressable>
        </View>
    </ScrollView>
  </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    padding: spacing.sm,
    backgroundColor: colors.fondo,
  },
  contenido: {
    flexGrow: 1,
    justifyContent: "center",
  },

  portada: {
    width: "100%",
    backgroundColor: colors.primarioSuave,
  },

  titulo: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.texto,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    marginHorizontal: 10,
  },

  formulario: {
    width: "100%",
  },

  datoTexto: {
    fontSize: 12,
    color: colors.textoSuave,
  },

  descripcion: {
    ...typography.cuerpo,
    color: colors.textoSuave,
    lineHeight: 22,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    marginHorizontal: 10,
  },

  barra: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.superficie,
    borderTopWidth: 1,
    borderTopColor: colors.borde,
    paddingVertical: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.lg,
  },

  textoBoton: {
    color: colors.primarioSuave,
    fontSize: 16,
    fontWeight: "600",
  },

  botonRegistro: {
    backgroundColor: colors.exito,
  },

  boton: {
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.md,
    borderRadius: spacing.sm,
    marginTop: spacing.sm,
  },

  botonPresionado: {
    opacity: 0.8,
  },

  textoRegistro: {
    color: colors.superficie,
  },

  TextInput: {
    borderWidth: 1,
    borderColor: colors.borde,
    borderRadius: spacing.sm,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
});
