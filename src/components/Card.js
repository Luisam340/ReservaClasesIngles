import React from "react";
import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import LabelLevel from "./LabelLevel";
import { colors, radius, spacing, typography } from "../theme";
import { formatearPrecio } from "../data/classes";

export default function Card({ clase /*, onPress*/ }) {
  return (
    <Pressable
    //onPress={onPress}
    >
      <Image source={{ uri: clase.imagen }} />
      <View>
        <LabelLevel nivel={clase.nivel} />
      </View>
      {/*nombre profesor
      -- horario
      -- precio*/}
      <Text>Profesor: {clase.profesor.nombre}</Text>
      <Text>Horario: {clase.horarios.join("\n")}</Text>
      <Text>Precio: {formatearPrecio(clase.precio)}</Text>
    </Pressable>
  );
}
