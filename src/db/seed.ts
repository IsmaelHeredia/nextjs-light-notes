import { db } from "./index";
import { workspaces, notes } from "./schema";
import crypto from "crypto";

const PREDEFINED_NOTES = {
  short: [
    "Revisar la implementación del middleware de Auth.",
    "Comprar café en grano (tueste natural).",
    "Actualizar dependencias de React Query.",
    "Investigar Drizzle ORM para el próximo proyecto.",
    "Corregir el bug de las cookies en Safari.",
    "Enviar factura al cliente de Madrid.",
    "Limpiar la carpeta de descargas.",
    "Subir la cobertura de tests al 80%.",
    "Pedir feedback a Laura sobre el nuevo diseño.",
    "Renovar el dominio .com que vence pronto.",
    "Mirar la documentación de las Server Actions en Next.js.",
    "Hacer backup de las fotos del viaje.",
    "Revisar logs de Vercel por errores 500.",
    "Preparar la demo para la reunión del viernes.",
    "Cambiar la tipografía de la landing page.",
    "Aprender más sobre Flexbox vs Grid.",
    "Configurar las variables de entorno en producción.",
    "Borrar ramas antiguas de Git.",
    "Llamar a soporte por el problema del internet."
  ],
  long: [
    "Refactorizar la lógica del carrito de compras: Actualmente está muy acoplada al componente UI. Debería mover la lógica a un custom hook o un store para mejorar la mantenibilidad.",
    "Idea de app: Un rastreador de plantas que use la cámara para identificar problemas de salud y te notifique cuándo regarlas según el clima local.",
    "Resumen de la reunión: El cliente prefiere los colores oscuros para el dashboard. Necesitamos ajustar el contraste de los botones para cumplir con la accesibilidad WCAG.",
    "Análisis de rendimiento: El bundle size ha crecido mucho. Hay que revisar si 'moment.js' se puede reemplazar por 'date-fns' o nativo de JS para ahorrar espacio.",
    "Notas de estudio: Los decoradores en TypeScript son útiles para metaprogramación, pero hay que tener cuidado con la compatibilidad de versiones en el tsconfig.",
    "Reflexión sobre el proyecto actual: Estamos perdiendo mucho tiempo en reuniones. Quizás un daily asíncrono en Slack sea más eficiente para el equipo.",
    "Estructura de la base de datos: La tabla de usuarios necesita un campo para el rol y otro para la fecha de última conexión para la analítica del mes que viene.",
    "Pendiente urgente: Migrar la base de datos de staging a producción antes de las 10 PM. Verificar que los secretos de la API estén configurados.",
    "Mejoras de UI/UX: El formulario de registro es muy largo. Dividirlo en pasos (stepper) aumentaría la tasa de conversión significativamente."
  ],
  multiline: [
    "Pendientes de Backend:\n- Implementar Rate Limiting con Redis\n- Migrar schemas de Prisma a Drizzle\n- Validar payloads de entrada con Zod\n- Configurar logs con Winston",
    "Stack Tecnológico sugerido:\n* Next.js 14 (App Router)\n* Tailwind CSS para estilos\n* Supabase como Auth y DB\n* Shadcn/ui para componentes rápidos",
    "Comandos para Docker:\n$ docker-compose up --build\n$ docker system prune -a\n$ docker exec -it api_container /bin/sh",
    "Checklist de Pull Request:\n[ ] Tests unitarios aprobados\n[ ] Código documentado con JSDoc\n[ ] No hay secretos en el código\n[ ] Revisado por al menos un senior",
    "Configuración de Git Rebase:\n1. git checkout develop\n2. git pull origin develop\n3. git checkout feature/auth\n4. git rebase develop\n5. git push --force-with-lease",
    "Debug Log - Error de Hidratación:\n- Causado por: Date.now() en el render\n- Solución: Mover la lógica a useEffect\n- Impacto: Baja prioridad (solo warning en dev)",
    "Pasos para el Deploy:\n- npm run build local para verificar\n- Push a rama 'main'\n- Revisar Webhooks en Vercel Dashboard\n- Limpiar caché de Cloudflare",
    "Arquitectura de Carpetas:\n/src\n  /app (routes)\n  /components (shared ui)\n  /hooks (logic separation)\n  /lib (external utils)",
    "Variables de Entorno Necesarias:\nDATABASE_URL=postgres://...\nNEXTAUTH_SECRET=base64_string\nSTRIPE_API_KEY=sk_test_...\nNODE_ENV=production",
    "Mejoras de Seguridad:\n> Implementar cabeceras CSP\n> Sanitizar inputs contra XSS\n> Usar cookies HttpOnly para sesiones\n> Habilitar 2FA para el panel de admin"
  ]
};

function realisticDate(offsetType: string) {
  const date = new Date();
  const offsets: any = { today: 0, yesterday: 1, "1month": 30, "2months": 60, "1year": 365 };
  date.setDate(date.getDate() - (offsets[offsetType] || 0));
  date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
  return date;
}

async function seed() {
  console.log("Generando seed");

  await db.delete(notes);
  await db.delete(workspaces);

  const wsNames = ["Trabajo", "Proyectos Personales", "Estudios", "Casa", "Ideas", "Lectura", "Viajes"];

  const wsData = wsNames.map(name => ({
    id: crypto.randomUUID(),
    name,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  await db.insert(workspaces).values(wsData);
  const wsIds = wsData.map(w => w.id);

  const notesData: any[] = [];
  const dateOffsets = ["today", "yesterday", "1month", "2months", "1year"];

  let noteIndex = 0;

  PREDEFINED_NOTES.short.forEach((text) => {
    const offset = dateOffsets[noteIndex % dateOffsets.length];
    notesData.push({
      id: crypto.randomUUID(),
      text,
      idWorkspace: wsIds[noteIndex % wsIds.length],
      createdAt: realisticDate(offset),
      updatedAt: realisticDate(offset),
    });
    noteIndex++;
  });

  PREDEFINED_NOTES.long.forEach((text) => {
    const offset = dateOffsets[noteIndex % dateOffsets.length];
    notesData.push({
      id: crypto.randomUUID(),
      text,
      idWorkspace: wsIds[noteIndex % wsIds.length],
      createdAt: realisticDate(offset),
      updatedAt: realisticDate(offset),
    });
    noteIndex++;
  });

  PREDEFINED_NOTES.multiline.forEach((text) => {
    const offset = dateOffsets[noteIndex % dateOffsets.length];
    notesData.push({
      id: crypto.randomUUID(),
      text,
      idWorkspace: wsIds[noteIndex % wsIds.length],
      createdAt: realisticDate(offset),
      updatedAt: realisticDate(offset),
    });
    noteIndex++;
  });

  await db.insert(notes).values(notesData);

  console.log("Finalizado");
  process.exit(0);
}

seed().catch(console.error);