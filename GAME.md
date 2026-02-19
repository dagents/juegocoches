# El Destino en tus Manos

> Naces en un lugar totalmente aleatorio: pais, familia, nivel economico, hermanos y circunstancias unicas. A partir de ahi, la vida avanza mes a mes y tu decides que hacer: estudiar, trabajar, ahorrar, invertir, mudarte, enamorarte o arriesgarlo todo. Cada eleccion cambia tu destino. Sobrevive, evoluciona y construye tu historia desde cero.

**Ganador de la votacion comunitaria** — elegido por la comunidad de ForoCoches el 19 de febrero de 2026 con 4 votos.

---

## 1. Vision y filosofia

**Tenemos IA potente e ilimitada.** La v1 no es un prototipo cutre — es un juego avanzado desde el primer dia.

- No hacer MVPs minimos → versiones ambiciosas que ya se sientan como un juego real
- Stack definitivo desde el dia 1 → Babylon.js 3D, no Canvas 2D temporal
- Profundidad desde el inicio → sistema de decisiones rico, no 2-3 opciones genericas
- Cada update diaria anade una capa → el core ya tiene que ser solido para soportar expansiones infinitas

### 📱 RESPONSIVE — MUY IMPORTANTE

**TODO el juego DEBE ser 100% responsive.** La mayoría de usuarios de ForoCoches entran desde móvil. Si no funciona bien en móvil, no funciona.

- **Mobile-first siempre** → diseñar primero para pantallas pequeñas, luego escalar
- **La escena 3D debe adaptarse** → canvas responsive que ocupe el ancho disponible sin romper el layout
- **UI táctil** → botones grandes, touch targets mínimo 44px, sin hover-only interactions
- **Paneles reorganizables** → en desktop: side-by-side (3D + stats). En móvil: stacked vertical
- **Texto legible** → mínimo 14px en móvil, sin scroll horizontal nunca
- **Testear en viewport 375px** (iPhone SE) como referencia mínima
- **No depender de teclado** → todo controlable con taps/clicks

---

## 2. Concepto del juego

Simulacion de vida basada en decisiones. El jugador nace en circunstancias completamente aleatorias y toma decisiones cada mes que afectan su vida: educacion, trabajo, relaciones, finanzas, salud y felicidad. El mundo se siente vivo, inmersivo y con consecuencias reales.

---

## 3. Taku — El villano

**Taku** es una presencia oscura y recurrente que aparece en momentos clave de la vida del jugador. No es un personaje que puedas evitar — es parte del destino.

### Quien es Taku
- Una figura enigmatica que se manifiesta de formas diferentes segun la etapa de tu vida
- En la infancia: es el nino que te manipula, el abuson del colegio, la mala influencia
- En la adolescencia: es el amigo toxico que te arrastra a decisiones destructivas
- En la vida adulta: es el socio que te traiciona, el jefe corrupto, el rival que te sabotea
- En la vejez: es la voz interna que te dice que no hiciste lo suficiente

### Mecanicas de Taku
- **Apariciones aleatorias**: Taku aparece entre 3-8 veces por partida en momentos criticos
- **Tentaciones**: ofrece atajos que parecen buenos pero tienen consecuencias ocultas a largo plazo
- **Sabotaje**: puede arruinar relaciones, inversiones o oportunidades si no lo detectas a tiempo
- **Escalada**: cuanto mas exito tienes, mas poderoso se vuelve Taku (envidia, sabotaje profesional)
- **Confrontacion final**: en algun momento de tu vida puedes enfrentarte a Taku directamente. El resultado depende de tus stats acumulados y decisiones previas
- **Derrota de Taku**: vencerle desbloquea un bonus permanente de stats y un logro epico

### Formas de Taku segun contexto
| Etapa | Manifestacion | Ejemplo |
|-------|--------------|---------|
| Infancia (0-12) | Nino manipulador | Te convence de robar en una tienda |
| Adolescencia (13-17) | Amigo toxico | Te introduce a adicciones o te aisla de tu familia |
| Adulto joven (18-30) | Socio/rival | Te propone un negocio fraudulento que parece genial |
| Adulto (31-55) | Enemigo profesional | Sabotea tu ascenso, roba tu idea, destruye tu reputacion |
| Vejez (56+) | Voz interior | Depresion, arrepentimiento, intenta que desperdicies tus ultimos anos |

---

## 4. Stack tecnico

| Componente | Tecnologia |
|-----------|------------|
| Engine 3D | Babylon.js 7 (embebido como componente React) |
| UI del juego | React + Tailwind (paneles, stats, decisiones) |
| Logica | TypeScript con sistema de eventos y motor de decisiones |
| Datos | JSON/JSONL para eventos, paises, decisiones |
| Audio | Web Audio API (ambiente, efectos) |
| Hosting | Integrado en la app Next.js en `/game` |
| Persistencia | Supabase (PostgreSQL) — nada en localStorage |

---

## 5. Mecanicas principales

### 5.1 Nacimiento aleatorio
- **Pais**: Pool de 50+ paises con stats reales (PIB, esperanza de vida, coste de vida, idioma)
- **Familia**: Nivel economico (5 tiers), numero de hermanos, estado familiar (unida/rota/orfanato)
- **Genetica**: Talentos naturales, predisposiciones de salud, apariencia
- **Epoca**: Empieza en el presente, expandible a otras epocas

### 5.2 Sistema de turnos
| Etapa | Edad | Descripcion |
|-------|------|-------------|
| Infancia | 0-12 | Turnos automaticos con eventos formativos, pocas decisiones |
| Adolescencia | 13-17 | Primeras decisiones reales (estudiar, rebelarse, amistades) |
| Adulto joven | 18-30 | Maxima agencia (carrera, pareja, mudarse, emprender) |
| Adulto | 31-55 | Consolidacion o crisis (familia, inversiones, salud) |
| Vejez | 56+ | Legado, salud decayendo, sabiduria |

Cada turno = 1 mes de vida.

### 5.3 Sistema de stats (8 dimensiones)
| Stat | Descripcion |
|------|-------------|
| Dinero | Ingresos, ahorros, deudas, inversiones |
| Educacion | Nivel academico, habilidades, conocimientos |
| Salud | Fisica y mental, enfermedades, adicciones |
| Felicidad | Satisfaccion general, estres, proposito |
| Relaciones | Pareja, amigos, familia, red de contactos |
| Reputacion | Social, profesional, criminal |
| Inteligencia | Capacidad de aprendizaje, toma de decisiones |
| Carisma | Influencia social, liderazgo, persuasion |

### 5.4 Motor de decisiones
- Cada turno presenta 1-3 situaciones con multiples opciones
- Las opciones dependen de tus stats, ubicacion, edad y contexto
- Consecuencias inmediatas + consecuencias a largo plazo (no siempre visibles)
- Cadenas de eventos: decisiones pasadas desbloquean o bloquean caminos futuros
- Sistema de probabilidades: no todo sale como esperas

### 5.5 Eventos aleatorios
- Crisis economicas globales
- Pandemias, desastres naturales
- Oportunidades unicas (herencia, loteria, contacto clave)
- Eventos personales (enfermedad, accidente, embarazo inesperado)
- Eventos segun pais (guerra, revolucion, boom economico)
- **Apariciones de Taku** (ver seccion 3)

### 5.6 Fin de partida
- Muerte natural (vejez) o prematura (enfermedad, accidente, decisiones)
- Pantalla de resumen epica: timeline visual de tu vida
- Score calculado por multiples factores (riqueza, felicidad, impacto, longevidad)
- Bonus si derrotaste a Taku
- Rankings globales de la comunidad

---

## 6. Visualizacion 3D (Babylon.js)

### V1 — Escena inmersiva
- Escenario 3D que cambia segun tu ubicacion (ciudad, campo, pais)
- Personaje 3D estilizado que envejece visualmente
- Efectos de particulas para eventos (lluvia de dinero, corazones, rayos)
- Transiciones cinematograficas entre meses/anos
- Skybox dinamico (dia/noche, estaciones)
- **Taku tiene modelo/silueta propia** — aparece como sombra o figura distorsionada

### Futuro (updates de la comunidad)
- Ciudades modeladas por pais
- Interior de tu casa/oficina que evoluciona con tu nivel economico
- NPCs con los que interactuar visualmente
- Mapa mundi interactivo para mudanzas
- Cutscenes generadas para momentos clave
- Cutscene de confrontacion con Taku

---

## 7. Persistencia

**Nada en localStorage. Nada en memoria. Todo en Supabase.**

- Estado de partida del jugador (stats, edad, ubicacion, historial de decisiones)
- Progreso guardado automaticamente cada turno
- Si el jugador cierra el navegador y vuelve, retoma exactamente donde estaba
- Rankings y scores globales en BD
- Historial completo de cada partida (para replay/resumen final)
- Registro de encuentros con Taku y resultado de cada confrontacion
- Configuracion del juego (version activa, parametros) en BD

---

## 8. Changelog — Visible y bien descrito

El changelog es pieza central de la experiencia. Los usuarios ven como evoluciona el juego dia a dia.

- **Visible en la web** en seccion dedicada, accesible desde el juego y desde `/poll`
- **Cada update tiene**: fecha, titulo descriptivo, descripcion detallada, quien lo propuso (usuario anonimo #id)
- **Formato legible**: escrito para jugadores, no tecnico (ej: "Ahora puedes invertir en bolsa y perder todo tu dinero" en vez de "Added investment system")
- **Versionado**: v1.0, v1.1, v1.2... cada update diaria incrementa
- **Historico completo**: desde la v1 hasta la version actual
- **Destacar la idea ganadora**: mostrar votos que recibio y el usuario que la propuso

---

## 9. Arquitectura extensible

```
src/game/
  engine/          — Motor del juego (GameState, TurnManager, DecisionEngine)
  data/            — JSON con paises, eventos, decisiones, carreras, taku-events
  components/      — UI React del juego (StatsPanel, DecisionCard, Timeline)
  scene/           — Babylon.js scenes y assets
  types/           — TypeScript types del juego
```

El sistema de datos basado en JSON permite que cada update diaria anade:
- Nuevos eventos
- Nuevas decisiones
- Nuevos paises/ciudades
- Nuevas carreras/trabajos
- Nuevas mecanicas
- Nuevas apariciones y formas de Taku

Sin tocar el core del engine.

---

## 10. Roadmap semanal

| Semana | Objetivo |
|--------|----------|
| 1 | V1 completa: nacimiento, decisiones, stats, 3D, Taku basico, game over |
| 2 | Mas paises, relaciones, sistema de pareja, Taku adolescencia |
| 3 | Economia avanzada (inversiones, negocios, propiedades), Taku profesional |
| 4 | Eventos historicos, multijugador (rankings), confrontacion final con Taku |
| 5+ | Lo que vote la comunidad: guerra, politica, fama, crimen... |

---

## 11. Checklist diario para updates de IA

Usa esta lista como guia antes de cada sesion de desarrollo:

### Pre-desarrollo
- [ ] Revisar la idea ganadora del dia en `/poll`
- [ ] Leer el changelog actual para saber el estado del juego
- [ ] Identificar en que semana/fase estamos del roadmap
- [ ] Comprobar issues abiertos o bugs reportados

### Desarrollo
- [ ] Implementar la feature/mejora del dia
- [ ] Si la feature afecta a stats, actualizar el motor de decisiones
- [ ] Si se anade contenido nuevo, hacerlo via JSON/JSONL (no hardcodear)
- [ ] Comprobar si la feature interactua con Taku (anade aparicion si tiene sentido)
- [ ] Verificar que la persistencia en Supabase funciona correctamente
- [ ] Probar la visualizacion 3D si hay cambios de escena

### Post-desarrollo
- [ ] Actualizar el changelog con la descripcion de la update
- [ ] Incrementar la version (v1.X)
- [ ] Hacer build y verificar que no hay errores
- [ ] Commit con mensaje descriptivo siguiendo conventional commits
- [ ] Push a repositorio

### Calidad
- [ ] El codigo sigue los patrones de `CLAUDE.md` (Server Components, Server Actions, Zod)
- [ ] No se han expuesto secretos ni API keys
- [ ] Los inputs de usuario estan validados y sanitizados
- [ ] El juego funciona si cierras y abres el navegador (persistencia)

---

## 12. Inspiracion

- **BitLife**: mecanicas de decisiones de vida
- **Reigns**: interfaz de decisiones simple pero profunda
- **The Sims**: simulacion de vida, stats
- **Civilization**: progresion epica, escala
- **No Man's Sky**: exploracion, escala masiva, 3D inmersivo
- **Persona series**: villano recurrente que escala con el jugador (inspiracion para Taku)
