import React, { useCallback, useState, useMemo } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import useReservas from '../hooks/useReservas';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, typography, radius } from '../theme';
import { formatearPrecio } from '../data/classes';

export default function ReservasScreen() {
  //se usa reserva:todasLasReservas para renombrar pq más adelante tenemos una constante llamada reserva
  const {
    reservas: todasLasReservas,
    cargando,
    cargarReservas,
    eliminarReserva,
    eliminando,
  } = useReservas();

  const [estudiante, setEstudiante] = useState(null);
  const [cargandoEstudiante, setCargandoEstudiante] = useState(true);

  function confirmarEliminar(id) {
    Alert.alert(
      'Eliminar reserva',
      '¿Estás seguro de que quieres eliminar esta reserva?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Aceptar',
          style: 'destructive',
          onPress: async () => {
            const eliminada = await eliminarReserva(id);

            if (!eliminada) {
              Alert.alert('Error', 'No se pudo eliminar la reserva.', [
                {
                  text: 'Ok',
                  style: 'destructive',
                },
              ]);
            }
          },
        },
      ],
    );
  }
  
  useFocusEffect(
    useCallback(() => {
      let activa = true;

      async function cargarPantalla() {
        setCargandoEstudiante(true);

        try {
          const datosEstudiante = await AsyncStorage.getItem('estudiante');

          if (!activa) return;

          setEstudiante(datosEstudiante ? JSON.parse(datosEstudiante) : null);

          await cargarReservas();
        } catch (error) {
          if (activa) {
            Alert.alert('Error', 'No se pudieron cargar los datos.');
          }
        } finally {
          if (activa) {
            setCargandoEstudiante(false);
          }
        }
      }

      cargarPantalla();

      return () => {
        activa = false;
      };
    }, [cargarReservas]),
  );

  const reservas = useMemo(() => {
    if (!estudiante) return [];

    const correo = estudiante.correo.trim().toLowerCase();

    return todasLasReservas.filter(
      (reserva) => reserva.estudianteCorreo === correo,
    );
  }, [todasLasReservas, estudiante]);

  const estaCargando = cargando || cargandoEstudiante;

  return (
    <View style={styles.pantalla}>
      <Text style={styles.titulo}>Mis reservas</Text>

      {estaCargando ? (
        <Text style={styles.mensaje}>Cargando...</Text>
      ) : !estudiante ? (
        <Text style={styles.mensaje}>Regístrate para guardar una reserva.</Text>
      ) : (
        <>
          <Text style={styles.perfil}>
            Reservas de {estudiante.nombre} {estudiante.apellido}
          </Text>

          <Text style={styles.correo}>{estudiante.correo}</Text>

          {reservas.length === 0 ? (
            <Text style={styles.mensaje}>Todavía no tienes reservas.</Text>
          ) : (
            <FlatList
              data={reservas}
              keyExtractor={(reserva) => reserva.id}
              contentContainerStyle={styles.lista}
              renderItem={({ item }) => (
                <View style={styles.reserva}>
                  <Text style={styles.tituloReserva}>{item.claseTitulo}</Text>

                  <Text style={styles.dato}>{item.horario}</Text>

                  <Text style={styles.dato}>
                    {item.duracion} min · {formatearPrecio(item.precio)}
                  </Text>

                  <Text style={styles.correo}>
                    Estudiante: {item.estudianteNombre}
                  </Text>
                  <Pressable
                    onPress={() => confirmarEliminar(item.id)}
                    disabled={eliminando}
                    style={({ pressed }) => [
                      styles.botonEliminar,
                      pressed && styles.botonPresionado,
                      eliminando && styles.botonDeshabilitado,
                    ]}
                  >
                    <Text style={styles.textoBoton}>
                      {eliminando ? 'Eliminando...' : 'Eliminar reserva'}
                    </Text>
                  </Pressable>
                </View>
              )}
            />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    justifyContent: 'center',
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
  perfil: {
    ...typography.subtitulo,
    marginBottom: spacing.xs,
  },
  correo: {
    ...typography.secundario,
    marginBottom: spacing.md,
  },
  lista: {
    width: '100%',
    paddingBottom: spacing.xl,
  },
  reserva: {
    backgroundColor: colors.superficie,
    borderColor: colors.borde,
    borderRadius: spacing.md,
    borderWidth: 1,
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  tituloReserva: {
    ...typography.subtitulo,
    marginBottom: spacing.sm,
  },
  dato: {
    ...typography.cuerpo,
    marginBottom: spacing.xs,
  },
  botonEliminar: {
    backgroundColor: colors.primario,
    paddingVertical: 12,
    width: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: radius.md,
    marginVertical: 5,
  },
  botonPresionado: {
    backgroundColor: colors.primarioOscuro,
  },
  botonDeshabilitado: {
    opacity: 0.5,
  },
  textoBoton: {
    color: colors.primarioSuave,
    fontSize: 16,
    fontWeight: '600',
  },
});
