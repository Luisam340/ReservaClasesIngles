import react from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import ClasesStack from './src/navigation/ClasesStack';
import { colors } from './src/theme';
import { ReservaProvider } from './src/context/ReservaContext';

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
      <StatusBar style='auto' />
    </View>*/
    <SafeAreaProvider>
      <ReservaProvider>
        <NavigationContainer theme={temaNavegacion}>
          <StatusBar style='dark'></StatusBar>
          <ClasesStack />
        </NavigationContainer>
      </ReservaProvider>
    </SafeAreaProvider>
  );
}
