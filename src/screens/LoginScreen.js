import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, typography } from '../theme';

export default function LoginScreen() {
	const [estudiante, setEstudiante] = useState(null);

	useEffect(() => {
		async function cargarEstudiante() {
			try {
				const guardado = await AsyncStorage.getItem('estudiante');
				setEstudiante(guardado ? JSON.parse(guardado) : null);
			} catch {
				Alert.alert('Error', 'No se pudieron cargar los datos guardados.');
			}
		}

		cargarEstudiante();
	}, []);

	return (
		<View style={styles.pantalla}>
			<Text style={styles.titulo}>Datos del estudiante</Text>
			{estudiante ? (
				<>
					<Text style={styles.dato}>Nombre: {estudiante.nombre}</Text>
					<Text style={styles.dato}>Apellido: {estudiante.apellido}</Text>
					<Text style={styles.dato}>Correo: {estudiante.correo}</Text>
				</>
			) : (
				<Text style={styles.mensaje}>No hay estudiantes registrados.</Text>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	pantalla: {
		flex: 1,
		justifyContent: 'center',
		padding: spacing.xl,
		backgroundColor: colors.fondo,
	},
	titulo: {
		...typography.titulo,
		marginBottom: spacing.lg,
	},
	dato: {
		...typography.cuerpo,
		marginBottom: spacing.sm,
	},
	mensaje: {
		...typography.cuerpo,
		color: colors.textoSuave,
	},
});


