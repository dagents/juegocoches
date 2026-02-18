# Politica de Seguridad - JuegoCoches

## Reportar una Vulnerabilidad

Si descubres una vulnerabilidad de seguridad en este proyecto, por favor reportala de forma responsable.

### Como reportar

1. **GitHub Security Advisories** (preferido): Ve a la pestana [Security](../../security/advisories) del repositorio y crea un nuevo advisory privado.
2. **Issue privado**: Si no puedes usar Security Advisories, abre un issue con el titulo "Security: [descripcion breve]" y marca que contiene informacion sensible.

### NO hacer

- No publiques vulnerabilidades en issues publicos.
- No explotes la vulnerabilidad mas alla de lo necesario para demostrarla.

## Alcance

### Que reportar
- Bypass de autenticacion o autorizacion
- Inyeccion SQL, XSS, CSRF
- Exposicion de datos de usuarios
- Prompt injection en el sistema de moderacion IA
- Exposicion de API keys o secretos en el codigo fuente
- Vulnerabilidades en dependencias criticas

### Fuera de alcance
- Ataques de denegacion de servicio (DoS)
- Social engineering
- Self-XSS (requiere que la victima ejecute codigo en su propio navegador)
- Vulnerabilidades en servicios de terceros (Supabase, OpenRouter) — reportalas directamente a ellos

## Limitaciones Conocidas

Estas limitaciones son de diseno y no se consideran vulnerabilidades a reportar:

- **Rate limiter in-memory**: El rate limiting usa un `Map` en memoria que no persiste entre instancias serverless. Las constraints de la base de datos (unique indexes) actuan como capa de seguridad adicional.
- **Moderacion IA no es infalible**: El sistema de moderacion basado en LLM puede tener falsos positivos/negativos. El contenido aprobado por la IA aun puede ser reportado por la comunidad.

## Tiempos de Respuesta

- **Confirmacion**: Intentaremos confirmar la recepcion del reporte en 48 horas.
- **Evaluacion**: Evaluaremos la severidad en un plazo de 7 dias.
- **Correccion**: Las vulnerabilidades criticas se priorizaran para su correccion inmediata.

## Reconocimiento

Agradecemos a quienes reportan vulnerabilidades de forma responsable. Si lo deseas, te mencionaremos en los agradecimientos del proyecto (salvo que prefieras anonimato).
