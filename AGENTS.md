# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing any code.

---

# Bitácora de desarrollo: Reserva de clases de inglés

**Estudiante:** Luisa  
**Fecha:** 8 de octubre de 2026  
**Proyecto:** Aplicación móvil para reservar clases de inglés  
**Tecnologías:** React Native, Expo, React Navigation, Context API y AsyncStorage

## 1. Revisión inicial de `ReservaContext`

**Luisa preguntó:** Si la estructura inicial de `ReservaContext` estaba correctamente organizada.

**Se le respondió:** La estructura general era adecuada porque cargaba reservas desde AsyncStorage, administraba un estado de carga y compartía información mediante un provider. Sin embargo, faltaba importar `createContext` y la función `agregarReserva` no retornaba el resultado esperado.

**Aprendizaje:** El contexto debe concentrar la información compartida, mientras que las pantallas deben encargarse principalmente de mostrarla y ejecutar acciones.

---

## 2. Uso de `cargarReservas`

**Luisa preguntó:** Cómo podía utilizar `cargarReservas` desde otra pantalla.

**Se le respondió:** La función estaba declarada dentro de un `useEffect`, por lo que no podía utilizarse fuera de ese bloque. Para compartirla debía declararse dentro del provider y añadirse al objeto `value` del contexto.

**Aprendizaje:** Solo los valores incluidos en el `value` de un provider pueden ser consumidos por sus componentes descendientes.

---

## 3. Revisión de la estructura real del proyecto

**Luisa solicitó:** Revisar el proyecto porque parte de la lógica del contexto estaba implementada directamente en las pantallas.

**Se encontró:**

- `ReservaProvider` existía, pero inicialmente no envolvía la navegación.
- `ReservasScreen` leía reservas directamente desde AsyncStorage.
- `DetalleClasesScreen` también cargaba y guardaba reservas.
- Se utilizaban las claves `"reservas"` y `"@reservas_ingles"` en lugares diferentes.
- Las reservas creadas por el contexto tenían una estructura distinta a las creadas por `DetalleClasesScreen`.

**Se le respondió:** Existían dos sistemas de reservas desconectados. Era necesario elegir una única clave y definir claramente qué componente sería responsable de leer y escribir.

**Aprendizaje:** Si dos archivos utilizan claves o estructuras distintas, aunque ambos funcionen de manera independiente, no estarán compartiendo realmente la misma información.

---

## 4. Provider y montaje

**Luisa preguntó:** Qué era un provider y cómo se montaba.

**Se le respondió:** El provider es un componente que comparte datos y funciones con todos los componentes que se encuentran dentro de él. En este proyecto debía envolver el `NavigationContainer` desde `App.js`.

**Estructura comprendida:**

```text
ReservaProvider
└── NavigationContainer
    └── ClasesStack
        ├── InicioScreen
        ├── ReservasScreen
        ├── PerfilScreen
        └── DetalleClasesScreen
```

**Aprendizaje:** Un contexto no puede utilizarse si su provider no está montado por encima de las pantallas que intentan consumirlo.

---

## 5. Hook personalizado `useReservas`

**Luisa preguntó:** Si tenía sentido utilizar un Hook llamado `useReserva` o `useReservas`.

**Se le respondió:** Sí, porque evita importar manualmente `useContext` y `ReservaContext` en cada pantalla. También permite comprobar que el Hook se esté utilizando dentro de `ReservaProvider`.

---

## 6. Estado y actualizaciones de React

**Luisa preguntó:** Por qué no podía retornar `reservas` inmediatamente después de ejecutar `setReservas`.

**Se le respondió:** `setReservas` no modifica inmediatamente la variable del render actual. React coloca la actualización en una cola y aplica el nuevo valor durante el siguiente render.

**Ejemplo conceptual:**

```text
reservas actual = []
        ↓
setReservas(datos)
        ↓
React programa otro render
        ↓
reservas contiene datos en el nuevo render
```

**Aprendizaje:** Si una función necesita utilizar inmediatamente la información obtenida, debe trabajar con la variable local, como `datos` o `lista`, y no con el estado que acaba de solicitar actualizar.

---

## 7. AsyncStorage y las reservas

**Luisa preguntó:** Por qué solo aparecía una reserva o por qué las reservas nuevas no se cargaban.

**Se le respondió:** Se identificaron varias causas posibles dentro del código:

- Uso de claves diferentes.
- Escrituras realizadas tanto desde el contexto como desde `DetalleClasesScreen`.
- Posibilidad de sobrescribir una lista nueva con un estado anterior.
- Filtrado por correo del estudiante.
- Reservas antiguas almacenadas bajo otra clave.

**Decisión tomada:** Mantener temporalmente el guardado en `DetalleClasesScreen` y utilizar `ReservaContext` para compartir y recargar la lista.

**Aprendizaje:** Debe existir una sola fuente responsable de modificar una colección persistente para evitar escrituras simultáneas o sobrescrituras.

---

## 8. Eliminación de reservas

**Luisa mostró:** Una primera implementación que utilizaba `AsyncStorage.removeItem`.

**Se le respondió:** `removeItem` elimina toda la clave y no devuelve el contenido eliminado. Por ello no era correcto intentar aplicar `JSON.parse` al resultado.

Para eliminar una reserva individual era necesario:

1. Obtener el arreglo actual.
2. Filtrar la reserva por su identificador.
3. Guardar el arreglo actualizado.
4. Actualizar el estado del contexto.
5. Controlar el estado `eliminando`.

---

## 9. Error `Invalid hook call`

**Luisa reportó:**

```text
Invalid hook call
Cannot read property 'useContext' of null
```

**Se encontró:** `useReservas()` estaba siendo ejecutado fuera del componente.

**Se le respondió:** Los Hooks solo pueden ejecutarse dentro del cuerpo de un componente funcional o dentro de otro Hook personalizado.

**Aprendizaje:** No se puede llamar un Hook en el nivel superior de un archivo ni dentro de una función común que no sea un componente o Hook.

---

## 10. Uso de `useFocusEffect`

**Luisa preguntó:** Si `useFocusEffect` podía utilizarse con una constante, de manera similar a `useEffect`.

**Se le respondió:** Sí. Se puede guardar el callback en una constante creada con `useCallback` y posteriormente entregarla a `useFocusEffect`.

**Luisa recibió posteriormente el aviso:**

```text
It looks like you wrote useFocusEffect(async () => ...)
```

**Se encontró:** El callback entregado a `useFocusEffect` estaba marcado directamente como `async`.

**Se le respondió:** El callback exterior debe ser una función normal. Dentro de él debe declararse y ejecutarse una función asíncrona.

**Estructura correcta comprendida:**

```text
useFocusEffect
└── callback normal
    ├── declara la variable activa
    ├── crea una función async
    ├── ejecuta la función async
    └── retorna la limpieza
```

**Aprendizaje:** `useFocusEffect` espera una función de limpieza o ningún retorno; una función `async` siempre devuelve una promesa.

---

## 11. Variable `activa`

**Luisa reportó:**

```text
ReferenceError: Property 'activa' doesn't exist
```

**Se encontró:** La variable se utilizaba fuera del bloque donde debía declararse.

**Se le respondió:** `activa` debe existir dentro del callback de `useFocusEffect`, de forma que la función asíncrona pueda consultarla y la función de limpieza pueda cambiarla a `false`.

**Objetivo de la variable:**

```text
Pantalla enfocada   → activa = true
Pantalla abandonada → activa = false
```

**Aprendizaje:** Esta bandera evita actualizar el estado de un componente después de que la pantalla haya perdido el foco.

---

## 12. Navegación con Tab y Stack

**Luisa preguntó:** La diferencia entre `Tab.Screen` y `Stack.Screen`.

**Se le respondió:**

- `Tab.Navigator` administra las secciones principales de la aplicación.
- `Stack.Navigator` abre pantallas encima de otras y permite regresar.

**Jerarquía del proyecto:**

```text
Stack.Navigator
├── ClasesTabs
│   └── Tab.Navigator
│       ├── Inicio
│       ├── Reservas
│       └── Perfil
├── DetalleClase
├── Registro
└── Login
```

**Luisa también preguntó:** Si el nombre de una ruta debía coincidir con el nombre del archivo.

**Se le respondió:** No. El atributo `name` es el identificador interno de la ruta. `component` indica qué componente se renderiza y `title` controla el texto visible.

**Aprendizaje:** El botón “Atrás” no se configura con el nombre de la ruta; para eso se utiliza `headerBackTitle`.

---

## 13. Perfil e inicio de sesión

**Luisa preguntó:** Si era posible cerrar sesión sin eliminar al estudiante almacenado del AsyncStorage.

**Se le respondió:** La estructura ideal sería separar:

- Datos permanentes del estudiante.
- Sesión activa.
- Reservas.

Sin embargo, se decidió mantener temporalmente la implementación actual, donde la existencia de `"estudiante"` representa también que existe un usuario activo.

**Se encontró además:** `LoginScreen` todavía no contiene un formulario real. Actualmente solo consulta y muestra los datos almacenados.

**Aprendizaje:** Una cuenta registrada y una sesión activa son conceptos diferentes, aunque temporalmente puedan manejarse juntos en una aplicación sencilla.

---

## 14. Librería o servicio para la foto de perfil

**Luisa solicitó:** Una librería o servicio que generara automáticamente una foto de perfil mediante una URL fija, sin pedirle al estudiante que seleccionara una imagen.

**Se le respondió:** Se recomendó DiceBear, un servicio para generar avatares automáticamente a partir de una URL y una semilla. No se solicitó ni se realizó la implementación; únicamente se explicó qué herramienta podía utilizarse y cómo determina la imagen generada.

- Si se utiliza el correo del estudiante como semilla, el avatar será estable para ese estudiante.
- Si se utiliza una semilla aleatoria o basada en la fecha, el avatar cambiará en cada consulta.

**Aprendizaje:** Un servicio como DiceBear permite obtener avatares automáticos sin usar un selector de imágenes ni pedir archivos al estudiante. La semilla controla si la imagen se conserva o cambia.

---

## 15. Limpieza de datos de la aplicación

**Luisa preguntó:** Cómo reiniciar la aplicación desde cero.

**Se le respondió:** Limpiar la caché de Metro no elimina AsyncStorage. Para borrar los datos era necesario eliminar las claves almacenadas o reinstalar Expo Go en el simulador.

**Claves principales identificadas:**

```text
estudiante
@reservas_ingles
```

**Aprendizaje:** La caché de desarrollo y los datos persistentes son elementos diferentes.

---

## Problemas técnicos resueltos o analizados

- Falta de importación de `createContext`.
- Uso incorrecto de Hooks fuera de componentes.
- Uso directo de funciones `async` en `useFocusEffect`.
- Variable `activa` fuera de alcance.
- Claves incompatibles en AsyncStorage.
- Escrituras duplicadas de reservas.
- Navegación hacia rutas no registradas.
- Diferencia entre ruta, componente y título.
- Eliminación incorrecta mediante `removeItem`.
- Actualización de estado durante el render.
- Uso incorrecto de datos JSON como si fueran objetos.
- Diferencia entre perfil almacenado y sesión activa.
- Incompatibilidad entre Expo Go y algunos módulos nativos.

## Conclusión

Durante el desarrollo se comprendió cómo distribuir responsabilidades entre pantallas, Hooks personalizados, Context y AsyncStorage.

La principal mejora fue entender que:

```text
Contexto
└── comparte datos y operaciones globales

Pantalla
├── administra su estado visual
├── responde a la navegación
├── muestra alertas
└── renderiza la información

AsyncStorage
└── conserva los datos entre ejecuciones
```

También se fortaleció el conocimiento sobre estados de React, funciones asíncronas, navegación anidada, persistencia local, desestructuración de objetos y manejo del ciclo de vida de las pantallas.
