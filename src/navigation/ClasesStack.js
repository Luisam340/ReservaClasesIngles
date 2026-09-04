import react from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ClasesScreen from "../screens/ClasesScreen";

// para la navegación Stack, la constante debe ser Stack
const Stack = createNativeStackNavigator();
export default function ClasesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        //nombre que se le dará al componente
        name="Home"
        component={ClasesScreen}
        // va en doble llave porque es un atributo
        option={{ headerShow: false }}
      />
    </Stack.Navigator>
  );
}
