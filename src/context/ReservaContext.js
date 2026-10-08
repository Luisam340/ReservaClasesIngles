import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Alert } from 'react-native';

const CLAVE_RESERVAS = '@reservas_ingles';

export const ReservaContext = createContext(null);

export function ReservaProvider({ children }) {
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [eliminando, setEliminando] = useState(false);

  const cargarReservas = useCallback(async () => {
    setCargando(true);

    try {
      const guardado = await AsyncStorage.getItem(CLAVE_RESERVAS);
      if (guardado === null) {
        setReservas([]);
        return;
      }

      const datos = JSON.parse(guardado);
      setReservas(Array.isArray(datos) ? datos : []);
    } catch (error) {
      console.log('Error leyendo las reservas:', error);
      setReservas([]);
    } finally {
      setCargando(false);
    }
  }, []);

  const eliminarReserva = useCallback(async (id) => {
    setEliminando(true);

    try {
      const guardado = await AsyncStorage.getItem(CLAVE_RESERVAS);
      const datos = guardado ? JSON.parse(guardado) : [];
      const reservasActuales = Array.isArray(datos) ? datos : [];

      const reservasActualizadas = reservasActuales.filter(
        (reserva) => reserva.id !== id,
      );
      await AsyncStorage.setItem(
        CLAVE_RESERVAS,
        JSON.stringify(reservasActualizadas),
      );

      setReservas(reservasActualizadas);
      return true;
    } catch (error) {
      console.log('Error eliminando la reserva:', error);
      return false;
    } finally {
      setEliminando(false);
    }
  }, []);
  
  // Carga inicial
  useEffect(() => {
    cargarReservas();
  }, [cargarReservas]);

  // Guardar cuando cambien las reservas
  useEffect(() => {
    if (cargando) return;

    async function guardarReservas() {
      try {
        await AsyncStorage.setItem(CLAVE_RESERVAS, JSON.stringify(reservas));
      } catch (error) {
        console.log('Error guardando las reservas:', error);
      }
    }

    guardarReservas();
  }, [reservas, cargando]);

  const agregarReserva = useCallback((clase, horario) => {
    const nuevaReserva = {
      id: `${clase.id}-${horario}`,
      titulo: clase.titulo,
      nivel: clase.nivel,
      profesor: clase.profesor.nombre,
      precio: clase.precio,
      horario,
      creadoEn: new Date().toISOString(),
    };

    setReservas((reservasAnteriores) => {
      const yaExiste = reservasAnteriores.some(
        (reserva) => reserva.id === nuevaReserva.id,
      );

      if (yaExiste) {
        return reservasAnteriores;
      }

      return [nuevaReserva, ...reservasAnteriores];
    });
  }, []);

  const valor = useMemo(
    () => ({
      reservas,
      cargando,
      cargarReservas,
      agregarReserva,
      eliminando,
      eliminarReserva
    }),
    [
      reservas,
      cargando,
      cargarReservas,
      agregarReserva,
      eliminando,
      eliminarReserva
    ],
  );

  return (
    <ReservaContext.Provider value={valor}>{children}</ReservaContext.Provider>
  );
}

export function useReservas() {
  const contexto = useContext(ReservaContext);
  if (contexto === null) {
    throw new Error('useReservas debe utilizarse dentro de ReservaProvider');
  }
  return contexto;
}
