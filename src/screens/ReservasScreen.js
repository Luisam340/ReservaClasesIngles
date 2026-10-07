import React, { useCallback, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors, spacing, typography } from "../theme";
import { formatearPrecio } from "../data/classes";

export default function ReservasScreen() {
  const [estudiante, setEstudiante] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let activa = true;

      async function cargar() {
        setCargando(true);
        try {
          const [datosEstudiante, datosReservas] = await Promise.all([
            AsyncStorage.getItem("estudiante"),
            AsyncStorage.getItem("reservas"),
          ]);

          if (!activa) return;

          if (!datosEstudiante) {
            setEstudiante(null);
            setReservas([]);
            return;
          }

          const estudianteActual = JSON.parse(datosEstudiante);
          const todasLasReservas = datosReservas
            ? JSON.parse(datosReservas)
            : [];
          const correo = estudianteActual.correo.trim().toLowerCase();

          setEstudiante(estudianteActual);
          setReservas(
            todasLasReservas.filter(
              (reserva) => reserva.estudianteCorreo === correo,
            ),
          );
        } catch {
          if (activa) Alert.alert("Error", "No se pudieron cargar los datos.");
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
      <Text style={styles.titulo}>Mis reservas</Text>
      {cargando ? (
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
  perfil: {
    ...typography.subtitulo,
    marginBottom: spacing.xs,
  },
  correo: {
    ...typography.secundario,
    marginBottom: spacing.md,
  },
  lista: {
    width: "100%",
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
});
