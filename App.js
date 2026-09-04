import react from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import ClasesStack from "./src/navigation/ClasesStack";
import Card from "./src/components/Card";
import { CLASES } from "./src/data/classes";
import { colors } from "./src/theme";

const temaNavegacion = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.fondo,
    card: colors.superficie,
    primary: colors.primario,
    text: colors.texto,
    border: colors.borde,
  },
};

export default function App() {
  return (
    /*<View style={styles.container}>
      <Text>Kevin hiper-heterosensual!</Text>
      {CLASES.map((elemento) => (
        <Card key={elemento.id} clase={elemento} />
      ))}
      <StatusBar style="auto" />
    </View>*/
    <SafeAreaProvider>
      <NavigationContainer theme={temaNavegacion}>
        <StatusBar style="dark"></StatusBar>
        <ClasesStack />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
