import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function useAlmacenamiento(clave, valorInicial) {
  const [valor, setValor] = useState(valorInicial);
  const [listo, setListo] = useState(false);

  let activo = true; //esto es una bandera para evitar que se actualice el estado si el componente se desmonta antes de que la promesa de AsyncStorage se resuelva

  useEffect(() => {
    AsyncStorage.getItem(clave)
      .then((guardado) => {
        if (activo && guardado !== null) {
          setValor(JSON.parse(guardado));
          setListo(true);
        }
      })
      .catch((error) => {
        console.log(`Error al obtener el valor de la clave ${clave}:`, error);
      })
      .finally(() => {
        if (activo) {
          setListo(true);
        }
      });

    return () => {
      activo = false; //cuando el componente se desmonte, se cambia la bandera a false para evitar actualizar el estado
    };
  }, [clave]);

  const actualizar = useCallback(
    async (nuevoValor) => {
      setValor(nuevoValor);
      try {
        AsyncStorage.setItem(clave, JSON.stringify(nuevoValor));
      } catch (error) {
        console.log(
          `Error al actualizar el valor de la clave ${clave}:`,
          error,
        );
      }
    },
    [clave],
  );
}

// async await que es y con apis como funciona
// q es un promise y como funciona
// que es un callback y como funciona
//q es try catch y como funciona
//como funciona el await y el async dentro de un useEffect y un useCallback y el try catch
//para que sirve el useMemo
//cuando usar stringfy y cuando usar parse(getItem y setItem de AsyncStorage
