import { useEffect, useState } from "react";
import {View, Text, StyleSheet, ScrollView, Alert, Image, Pressable} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useResponsive from "../hooks/useResponsive";
import { colors, spacing, radius, typography, sombra } from "../theme";
import { formatearPrecio } from "../data/classes";
import LabelLevel from "../components/LabelLevel";

const CLAVE_RESERVAS = "reservas";

async function cargarReservas() {
  const guardadas = await AsyncStorage.getItem(CLAVE_RESERVAS);
  if (!guardadas) return [];

  const reservas = JSON.parse(guardadas);
  return Array.isArray(reservas) ? reservas : [];
}

export default function DetalleClasesScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { clase } = route.params;// otra manera de desestructurar objetos
  const { paddingHorizontal, esTablet } = useResponsive();
  const [cupos, setCupos] = useState(clase.cupos);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    async function cargarCupos() {
      const reservas = await cargarReservas();
      const ocupados = reservas.filter(
        (reserva) => reserva.claseId === clase.id,
      ).length;
      setCupos(Math.max(0, clase.cupos - ocupados));
    }

    cargarCupos().catch(() => {
      Alert.alert("Error", "No se pudieron cargar los cupos.");
    });
  }, [clase.cupos, clase.id]);

  async function reservar() {
    if (!horarioSeleccionado) {
      Alert.alert("Elige un horario", "Selecciona un horario para continuar.");
      return;
    }

    if (cupos < 1) {
      Alert.alert("Sin cupos", "Esta clase ya no tiene cupos disponibles.");
      return;
    }

    setGuardando(true);
    try {
      const datosEstudiante = await AsyncStorage.getItem("estudiante");
      if (!datosEstudiante) {
        Alert.alert(
          "Regístrate primero",
          "Necesitas un perfil para guardar la reserva.",
          [
            { text: "Cancelar", style: "cancel" },
            {
              text: "Registrarme",
              onPress: () => navigation.navigate("Registro"),
            },
          ],
        );
        return;
      }

      const estudiante = JSON.parse(datosEstudiante);
      const correo = estudiante.correo.trim().toLowerCase();
      const reservas = await cargarReservas();
      const horarioOcupado = reservas.some(
        (reserva) =>
          reserva.estudianteCorreo === correo &&
          reserva.horario === horarioSeleccionado,
      );

      if (horarioOcupado) {
        Alert.alert("Horario ocupado", "Ya reservaste ese horario.");
        return;
      }

      const reservasClase = reservas.filter(
        (reserva) => reserva.claseId === clase.id,
      );
      if (reservasClase.length >= clase.cupos) {
        setCupos(0);
        Alert.alert("Sin cupos", "Esta clase ya no tiene cupos disponibles.");
        return;
      }

      const nuevaReserva = {
        id: `${Date.now()}`, //
        estudianteCorreo: correo,
        estudianteNombre: `${estudiante.nombre} ${estudiante.apellido}`,
        claseId: clase.id,
        claseTitulo: clase.titulo,
        horario: horarioSeleccionado,
        duracion: clase.duracion,
        precio: clase.precio,
      };

      await AsyncStorage.setItem(
        CLAVE_RESERVAS,
        JSON.stringify([...reservas, nuevaReserva]),
      );
      setCupos(Math.max(0, clase.cupos - reservasClase.length - 1));
      Alert.alert(
        "Reserva guardada",
        "La reserva quedó asociada a tu perfil.",
        [
          {
            text: "Ver reservas",
            onPress: () =>
              navigation.navigate("ClasesTabs", { screen: "Reservas" }),
          },
          { text: "Seguir aquí", style: "cancel" },
        ],
      );
    } catch (error) {
      const detalle = error instanceof Error ? error.message : String(error);
      Alert.alert("Error", `No se pudo guardar la reserva. ${detalle}`);
    } finally {
      setGuardando(false);
    }
  }
  return (
    <View style={estilos.pantalla}>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 130 + insets.bottom,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={{ uri: clase.imagen }}
          resizeMode="cover"
          style={[estilos.portada, { height: esTablet ? 300 : 220 }]}
        />

        <View
          style={{
            paddingHorizontal,
            paddingTop: spacing.lg,
          }}
        >
          <LabelLevel nivel={clase.nivel} />

          <Text style={estilos.titulo}>{clase.titulo}</Text>

          <View style={estilos.datos}>
            <View style={estilos.dato}>
              <Ionicons name="time-outline" size={20} color={colors.primario} />

              <Text style={estilos.datoValor}>{clase.duracion} minutos</Text>

              <Text style={estilos.datoTexto}>Duración</Text>
            </View>

            <View style={estilos.dato}>
              <Ionicons
                name="people-outline"
                size={20}
                color={colors.primario}
              />

              <Text style={estilos.datoValor}>{cupos}</Text>

              <Text style={estilos.datoTexto}>Cupos</Text>
            </View>
          </View>

          <View style={estilos.profesor}>
            <Image
              source={{ uri: clase.profesor.foto }}
              resizeMode="cover"
              style={estilos.avatar}
            />

            <View style={estilos.profesorInfo}>
              <Text style={estilos.profesorNombre}>
                {clase.profesor.nombre}
              </Text>

              <Text style={estilos.profesorDetalle}>
                {clase.profesor.pais} - {clase.modalidad}
              </Text>
            </View>
          </View>

          <Text style={estilos.datoValor}>Sobre la clase</Text>

          <Text style={estilos.descripcion}>{clase.descripcion}</Text>

          <Text style={estilos.datoValor}>Elige tu horario</Text>

          <View style={estilos.horarios}>
            {clase.horarios.map((horario) => {
              const seleccionado = horario === horarioSeleccionado;
              return (
                <Pressable
                  key={horario}
                  accessibilityRole="button"
                  accessibilityState={{ selected: seleccionado }}
                  onPress={() => setHorarioSeleccionado(horario)}
                  style={[
                    estilos.horario,
                    seleccionado && estilos.horarioSeleccionado,
                  ]}
                >
                  <Text
                    style={[
                      estilos.horarioTexto,
                      seleccionado && estilos.horarioTextoSeleccionado,
                    ]}
                  >
                    {horario}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          estilos.barra,
          {
            paddingHorizontal,
            paddingBottom: Math.max(insets.bottom, spacing.lg),
          },
        ]}
      >
        <View style={estilos.precioContenedor}>
          <Text style={estilos.precioLabel}>Precio por clase</Text>

          <Text style={estilos.precio}>{formatearPrecio(clase.precio)}</Text>
        </View>

        <Pressable
          onPress={reservar}
          disabled={!horarioSeleccionado || cupos < 1 || guardando}
          style={({ pressed }) => [
            estilos.botonReservar,
            pressed && estilos.botonPresionado,
            (!horarioSeleccionado || cupos < 1 || guardando) &&
              estilos.botonDeshabilitado,
          ]}
        >
          <Text style={estilos.textoBoton}>
            {guardando ? "Guardando..." : "Reservar"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: colors.fondo,
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

  datos: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: colors.superficie,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    marginBottom: spacing.lg,
  },

  dato: {
    alignItems: "center",
    gap: 2,
  },

  datoValor: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.texto,
    marginHorizontal: 10,
  },

  datoTexto: {
    fontSize: 12,
    color: colors.textoSuave,
  },

  profesor: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.superficie,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.borde,
  },

  profesorInfo: {
    flex: 1,
  },

  profesorNombre: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.texto,
  },

  profesorDetalle: {
    fontSize: 13,
    color: colors.textoSuave,
    marginTop: 2,
  },

  descripcion: {
    ...typography.cuerpo,
    color: colors.textoSuave,
    lineHeight: 22,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    marginHorizontal: 10,
  },

  horarios: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },

  horario: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.superficie,
    borderWidth: 1,
    borderColor: colors.borde,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginHorizontal: 10,
  },

  horarioSeleccionado: {
    backgroundColor: colors.primario,
    borderColor: colors.primario,
  },

  horarioTexto: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.texto,
  },

  horarioTextoSeleccionado: {
    color: colors.primarioSuave,
  },

  botonReservar: {
    backgroundColor: colors.primario,
    paddingVertical: 12,
    width: 200,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: radius.md,
    marginVertical: 5,
  },

  botonPresionado: {
    backgroundColor: colors.primarioOscuro,
  },

  botonDeshabilitado: {
    opacity: 0.5,
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

  precioContenedor: {
    flex: 1,
  },

  precioLabel: {
    fontSize: 12,
    color: colors.textoSuave,
    marginHorizontal: 10,
    
  },

  textoBoton: {
    color: colors.primarioSuave,
    fontSize: 16,
    fontWeight: "600",
  },

  precio: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.primario,
    marginHorizontal: 10,
  },
});
