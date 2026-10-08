import React, { useCallback, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View, Image } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, typography } from '../theme';

export default function PerfilScreen() {
  const navigation = useNavigation();
  const [estudiante, setEstudiante] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [fotoPerfil, setFotoPerfil] = useState(null);

  useFocusEffect(
    useCallback(() => {
      let activa = true;

      async function cargar() {
        setCargando(true);
        try {
          const guardado = await AsyncStorage.getItem('estudiante');
          if (activa) setEstudiante(guardado ? JSON.parse(guardado) : null);
          if(guardado) setFotoPerfil(`https://api.dicebear.com/10.x/avataaars/png?seed=${encodeURIComponent(guardado.foto)}`,)
        } catch {
          if (activa) Alert.alert('Error', 'No se pudo cargar el perfil.');
        } finally {
          if (activa) setCargando(false);
        }
      }

      cargar();
      return () => {
        activa = false;
      };
    }, []),
  );

  return (
    <View style={styles.pantalla}>
      {cargando ? (
        <Text style={styles.detalle}>Cargando perfil...</Text>
      ) : estudiante ? (
        <>
          {fotoPerfil && (
            <Image source={{ uri: fotoPerfil }} style={styles.avatar} />
          )}
          <Text style={styles.titulo}>Perfil del estudiante</Text>
          <Text style={styles.detalle}>
            {estudiante.nombre} {estudiante.apellido}
          </Text>
          <Text style={styles.detalle}>{estudiante.correo}</Text>
          <Pressable
            onPress={() => navigation.navigate('Reservas')}
            style={({ pressed }) => [
              styles.boton,
              styles.botonInicio,
              pressed && styles.botonPresionado,
            ]}
          >
            <Text style={[styles.textoBoton, styles.textoInicio]}>
              Mis reservas
            </Text>
          </Pressable>
        </>
      ) : (
        <>
          <Text style={styles.titulo}>Bienvenido</Text>
          <Pressable
            onPress={() => navigation.navigate('Login')}
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
            onPress={() => navigation.navigate('Registro')}
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
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: spacing.sm,
  },
  textoBoton: {
    fontSize: 16,
    fontWeight: '600',
  },
  boton: {
    paddingVertical: 12,
    width: 200,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
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
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.borde,
  },
});
