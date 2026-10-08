import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import LabelLevel from './LabelLevel';
import { colors, radius, spacing, typography } from '../theme';
import useResponsive from '../hooks/useResponsive';
import { formatearPrecio } from '../data/classes';

export default function Card({ clase, onPress }) {
  const { paddingHorizantal, esTablet } = useResponsive();
  return (
    <View style={estilos.tarjeta}>
      <Pressable onPress={onPress} style={{ overflow: 'hidden' }}>
        <Image
          source={{ uri: clase.imagen }}
          resizeMethod='cover'
          style={[
            estilos.portada,
            { height: esTablet ? 300 : 220, width: 'auto' },
          ]}
        />

        <LabelLevel nivel={clase.nivel} />

        <Text style={[estilos.profesor, estilos.margin]}>{clase.titulo}</Text>

        <Text style={[estilos.profesor, estilos.margin]}>
          Profesor(a): {clase.profesor.nombre}
        </Text>

        <Text style={[estilos.horario, estilos.margin]}>
          {clase.horarios.join(' - ')}
        </Text>

        <Text style={[estilos.precio, estilos.margin]}>
          {formatearPrecio(clase.precio)}
        </Text>
      </Pressable>
    </View>
  );
}

const estilos = StyleSheet.create({
  margin: {
    marginHorizontal: 25,
    marginVertical:2
  },
  tarjeta: {
    marginHorizontal: 10,
    marginVertical: 10,
    backgroundColor: colors.tarjetas,
    borderRadius: 35,
    overflow: 'hidden',
  },
  portada: {
    width: '100%',
    height: 180,
  },
  profesor: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.texto,
  },
  horario: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textoSuave,
  },
  precio: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primario,
    marginBottom: 10,
  },
  textoBoton: {
    color: colors.primarioSuave,
    fontSize: 16,
    fontWeight: '600',
  },
  contenidoScroll: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scroll: {
    flexGrow: 1,
  },
});
