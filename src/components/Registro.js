import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors, radius, sombra, spacing, typography } from "../theme";

const STORAGE_KEY = "estudiante";

export default function Registro({ navigation }) {
  const [formulario, setFormulario] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    contrasena: "",
    confirmarContrasena: "",
  });

  function cambiarFormulario(campo, valor) {
    setFormulario((actual) => ({ ...actual, [campo]: valor }));
  }

  async function registrar() {
    const nombre = formulario.nombre.trim();
    const apellido = formulario.apellido.trim();
    const correo = formulario.correo.trim().toLowerCase();

    if (!nombre || !apellido || !correo || !formulario.contrasena || !formulario.confirmarContrasena) {
      Alert.alert("Campos incompletos", "Completa todos los campos.");
      return;
    }

    if (formulario.contrasena !== formulario.confirmarContrasena) {
      Alert.alert("Revisa la contraseña", "Las contraseñas no coinciden.");
      return;
    }

    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ nombre, apellido, correo }),
      );
      Alert.alert("Registro guardado", "Tus datos quedaron guardados en este dispositivo.", [
        { text: "Continuar", onPress: () => navigation.replace("Login") },
      ]);
    } catch {
      Alert.alert("Error", "No se pudieron guardar los datos.");
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.pantalla}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.contenido}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formulario}>
          <Text style={styles.titulo}>Regístrate</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={formulario.nombre}
            onChangeText={(valor) => cambiarFormulario("nombre", valor)}
          />
          <TextInput
            style={styles.input}
            placeholder="Apellido"
            value={formulario.apellido}
            onChangeText={(valor) => cambiarFormulario("apellido", valor)}
          />
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            value={formulario.correo}
            onChangeText={(valor) => cambiarFormulario("correo", valor)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            value={formulario.contrasena}
            onChangeText={(valor) => cambiarFormulario("contrasena", valor)}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Confirmar contraseña"
            value={formulario.confirmarContrasena}
            onChangeText={(valor) =>
              cambiarFormulario("confirmarContrasena", valor)
            }
            secureTextEntry
          />
          <Pressable
            accessibilityRole="button"
            onPress={registrar}
            style={({ pressed }) => [
              styles.boton,
              pressed && styles.presionado,
            ]}
          >
            <Text style={styles.textoBoton}>Registrarme</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: colors.fondo,
  },
  contenido: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  formulario: {
    width: "100%",
    maxWidth: 460,
    padding: spacing.xl,
    backgroundColor: colors.superficie,
    borderColor: colors.borde,
    borderWidth: 1,
    borderRadius: radius.lg,
    ...sombra,
  },
  titulo: {
    ...typography.titulo,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  input: {
    height: 52,
    backgroundColor: colors.fondo,
    borderColor: colors.borde,
    borderRadius: radius.md,
    borderWidth: 1,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  boton: {
    alignItems: "center",
    backgroundColor: colors.exito,
    borderRadius: radius.md,
    justifyContent: "center",
    marginTop: spacing.sm,
    minHeight: 52,
  },
  presionado: {
    opacity: 0.8,
  },
  textoBoton: {
    color: colors.superficie,
    fontWeight: "600",
  },
});