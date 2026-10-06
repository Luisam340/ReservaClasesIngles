import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { colors } from "../theme";
import InicioScreen from "../screens/InicioScreen";
import DetalleClase from "../screens/DetalleClasesScreen";
import ReservasScreen from "../screens/ReservasScreen";
import PerfilScreen from "../screens/PerfilScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function ClasesTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: { backgroundColor: colors.superficie },
        headerTintColor: colors.texto,
        tabBarActiveTintColor: colors.primario,
        tabBarInactiveTintColor: colors.textoSuave,
        tabBarStyle: {
          backgroundColor: colors.superficie,
          borderTopColor: colors.borde,
        },
        tabBarIcon: ({ color, size, focused }) => {
          const icons = {
            Inicio: focused ? "home" : "home-outline",
            Reservas: focused ? "calendar" : "calendar-outline",
            Perfil: focused ? "person" : "person-outline",
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Inicio"
        component={InicioScreen}
        options={{ title: "Clases de Inglés", tabBarLabel: "Clases" }}
      />
      <Tab.Screen
        name="Reservas"
        component={ReservasScreen}
        options={{ title: "Reservas" }}
      />
      <Tab.Screen
        name="Perfil"
        component={PerfilScreen}
        options={{ title: "Perfil" }}
      />
    </Tab.Navigator>
  );
}

export default function ClasesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ClasesTabs"
        component={ClasesTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DetalleClase"
        component={DetalleClase}
        options={{ title: "Detalle", headerBackTitle: "Atrás" }}
      />
    </Stack.Navigator>
  );
}
