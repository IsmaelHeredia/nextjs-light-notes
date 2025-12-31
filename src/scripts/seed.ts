import { db } from "../db";
import { workspaces, notes } from "../db/schema";
import crypto from "crypto";

async function main() {
  console.log("Checking existing data...");

  const existing = await db.select().from(workspaces).limit(1);

  if (existing.length > 0) {
    console.log("Database already seeded, skipping");
    return;
  }

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
      "Refactorizar la lógica del carrito de compras: Actualmente está muy acoplada al componente UI...",
      "Idea de app: Un rastreador de plantas que use la cámara...",
      "Resumen de la reunión: El cliente prefiere los colores oscuros...",
      "Análisis de rendimiento: El bundle size ha crecido mucho...",
      "Notas de estudio: Los decoradores en TypeScript...",
      "Reflexión sobre el proyecto actual...",
      "Estructura de la base de datos...",
      "Pendiente urgente: Migrar la base de datos...",
      "Mejoras de UI/UX..."
    ],
    multiline: [
      "Pendientes de Backend:\n- Implementar Rate Limiting con Redis\n- Migrar schemas de Prisma a Drizzle",
      "Stack Tecnológico sugerido:\n* Next.js\n* Tailwind CSS\n* Supabase",
      "Checklist de Pull Request:\n[ ] Tests\n[ ] Docs\n[ ] Review",
      "Debug Log:\n- Error de hidratación\n- Solución: useEffect",
      "Pasos para el Deploy:\n- Build\n- Push\n- Verificar"
    ]
  };

  function realisticDate(offsetType: string) {
    const date = new Date();
    const offsets: Record<string, number> = {
      today: 0,
      yesterday: 1,
      "1month": 30,
      "2months": 60,
      "1year": 365
    };

    date.setDate(date.getDate() - (offsets[offsetType] ?? 0));
    date.setHours(
      Math.floor(Math.random() * 24),
      Math.floor(Math.random() * 60)
    );
    return date;
  }

  console.log("Cleaning tables...");
  await db.delete(notes);
  await db.delete(workspaces);

  const wsNames = [
    "Trabajo",
    "Proyectos Personales",
    "Estudios",
    "Casa",
    "Ideas",
    "Lectura",
    "Viajes"
  ];

  const wsData = wsNames.map(name => ({
    id: crypto.randomUUID(),
    name,
    createdAt: new Date(),
    updatedAt: new Date()
  }));

  await db.insert(workspaces).values(wsData);
  const wsIds = wsData.map(w => w.id);

  const notesData: any[] = [];
  const dateOffsets = ["today", "yesterday", "1month", "2months", "1year"];
  let noteIndex = 0;

  [...PREDEFINED_NOTES.short, ...PREDEFINED_NOTES.long, ...PREDEFINED_NOTES.multiline]
    .forEach(text => {
      const offset = dateOffsets[noteIndex % dateOffsets.length];
      notesData.push({
        id: crypto.randomUUID(),
        text,
        idWorkspace: wsIds[noteIndex % wsIds.length],
        createdAt: realisticDate(offset),
        updatedAt: realisticDate(offset)
      });
      noteIndex++;
    });

  await db.insert(notes).values(notesData);

  console.log("Seed completed successfully");
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error("Seed failed", err);
    process.exit(1);
  });
