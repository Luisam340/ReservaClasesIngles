import { useContext } from 'react';
import { ReservaContext } from '../context/ReservaContext';

export default function useReservas() {
  const contexto = useContext(ReservaContext);
  if (!contexto) {
    throw new Error('useReservas debe ser usado dentro de un ReservaProvider');
  }
  return contexto;
} //encapsulamiento de useContext para no tener que importar useContext y ReservaContext en cada componente que lo necesite
