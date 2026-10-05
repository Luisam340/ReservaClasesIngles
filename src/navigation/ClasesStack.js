import React from "react";
import { Pressable, Text } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import InicioScreen from "../screens/InicioScreen";
import DetalleClase from "../screens/DetalleClasesScreen";
import ReservasScreen from "../screens/ReservasScreen";
import PerfilScreen from "../screens/PerfilScreen";

const Stack = createNativeStackNavigator();
export default function ClasesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Inicio"
        component={InicioScreen}
        options={({ navigation }) => ({
          title: "Clases de Inglés",
          headerRight: () => (
            <Pressable
              accessibilityRole="button"
              onPress={() => navigation.navigate("Perfil")}
            >
              <Text>Perfil</Text>
            </Pressable>
          ),
        })}
      />
      <Stack.Screen
        name="DetalleClase"
        component={DetalleClase}
        options={{ title: "Detalle", headerBackTitle: "Atrás" }}
      />
      <Stack.Screen
        name="Perfil"
        component={PerfilScreen}
        options={{ title: "Perfil", headerBackTitle: "Atrás" }}
      />

      <Stack.Screen
        name="Reservas"
        component={ReservasScreen}
        options={{ title: "Reservas", headerBackTitle: "Atrás" }}
      />
    </Stack.Navigator>
  );
}
