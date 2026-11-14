import { SupportedLocale } from '../types';

export interface MissionData {
  ref: string;
  courseId: string;
  order: number;
  emoji: string;
  title: string;
  client: string;
  description: string;
  skills: string;
  color: string;
  earnedXp: number;
  earnedBytes: number;
  prerequisiteRef?: string;
  prerequisiteTitle?: string;
  initialSheetData: Record<string, string>;
  targetFormula: string;
  correctAnswer: string;
  instruction: string;
}

export interface PracticeCourseData {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  emoji: string;
  color: string;
  prerequisiteCourseId?: string;
  prerequisiteCourseTitle?: string;
  missions: MissionData[];
}

export const PRACTICE_COURSES: PracticeCourseData[] = [
  {
    id: 'COURSE_1',
    order: 1,
    title: 'Curso 1 · Operaciones y Negocios',
    subtitle: 'Domina sumas, promedios y control de presupuesto real',
    emoji: '🏪',
    color: '#21C26B',
    missions: [
      {
        ref: 'MISSION_BAKERY',
        courseId: 'COURSE_1',
        order: 1,
        emoji: '🥐',
        title: 'Panadería de Doña Rosa',
        client: 'Doña Rosa',
        description:
          'Doña Rosa lleva las cuentas de su panadería y necesita automatizar el cálculo de las ventas de conchas y bolillos de toda la semana, el promedio diario y el gran total general.',
        skills: 'SUMA · PROMEDIO · MAX',
        color: '#FF8A3D',
        earnedXp: 35,
        earnedBytes: 25,
        instruction: 'En la celda B5, calcula el total de panes vendidos usando la función SUMA.',
        targetFormula: '=SUM(B2:B4)',
        correctAnswer: '=SUM(B2:B4)',
        initialSheetData: {
          A1: 'Producto',
          B1: 'Ventas',
          A2: 'Conchas',
          B2: '120',
          A3: 'Bolillos',
          B3: '250',
          A4: 'Donas',
          B4: '80',
          A5: 'Total',
          B5: '',
        },
      },
      {
        ref: 'MISSION_BUDGET',
        courseId: 'COURSE_1',
        order: 2,
        emoji: '💸',
        title: 'Presupuesto del mes',
        client: 'Finanzas del Hogar',
        description:
          'Organiza los ingresos y egresos familiares, calcula el saldo de ahorro neto restando los gastos e identifica si el mes cerró con superávit o déficit.',
        skills: 'Resta · SI · Balance',
        color: '#21C26B',
        earnedXp: 40,
        earnedBytes: 30,
        prerequisiteRef: 'MISSION_BAKERY',
        prerequisiteTitle: 'Panadería de Doña Rosa',
        instruction: 'Calcula el ahorro neto en la celda B4 restando los Gastos (B3) de los Ingresos (B2).',
        targetFormula: '=B2-B3',
        correctAnswer: '=B2-B3',
        initialSheetData: {
          A1: 'Concepto',
          B1: 'Monto',
          A2: 'Ingresos',
          B2: '3200',
          A3: 'Gastos',
          B3: '2400',
          A4: 'Ahorro',
          B4: '',
        },
      },
    ],
  },
  {
    id: 'COURSE_2',
    order: 2,
    title: 'Curso 2 · Lógica y Auditoría',
    subtitle: 'Condicionales SI, conteo inteligente y referencias fijas $A$1',
    emoji: '🧠',
    color: '#4DA3FF',
    prerequisiteCourseId: 'COURSE_1',
    prerequisiteCourseTitle: 'Curso 1 · Operaciones y Negocios',
    missions: [
      {
        ref: 'MISSION_GRADES',
        courseId: 'COURSE_2',
        order: 1,
        emoji: '🎓',
        title: 'Calificaciones del curso',
        client: 'Colegio San Lucas',
        description:
          'El profesor Martínez necesita determinar de forma automatizada qué estudiantes aprueban con nota mayor o igual a 70 puntos y contar cuántos alumnos aprobaron.',
        skills: 'SI · CONTAR.SI · PROMEDIO',
        color: '#4DA3FF',
        earnedXp: 45,
        earnedBytes: 30,
        prerequisiteRef: 'MISSION_BUDGET',
        prerequisiteTitle: 'Presupuesto del mes (Curso 1)',
        instruction: 'En C2 usa SI para verificar si la Nota (B2) es >= 70 ("Aprobado" / "Reprobado").',
        targetFormula: '=IF(B2>=70,"Aprobado","Reprobado")',
        correctAnswer: '=IF(B2>=70,"Aprobado","Reprobado")',
        initialSheetData: {
          A1: 'Alumno',
          B1: 'Nota',
          C1: 'Estado',
          A2: 'Carlos',
          B2: '85',
          C2: '',
          A3: 'Elena',
          B3: '62',
          C3: '',
        },
      },
      {
        ref: 'MISSION_INVENTORY',
        courseId: 'COURSE_2',
        order: 2,
        emoji: '📦',
        title: 'Auditoría de Impuestos e IVA',
        client: 'TecnoStore S.A.',
        description:
          'Calcula el impuesto de múltiples productos anclando la celda de tasa de IVA con referencia absoluta ($B$5) y resuelve fórmulas con jerarquía de operadores.',
        skills: '$A$1 · Jerarquía · SUMA',
        color: '#FFC53D',
        earnedXp: 50,
        earnedBytes: 35,
        prerequisiteRef: 'MISSION_GRADES',
        prerequisiteTitle: 'Calificaciones del curso',
        instruction: 'En C2 multiplica el Precio (B2) por el IVA fijo anclado ($B$5).',
        targetFormula: '=B2*$B$5',
        correctAnswer: '=B2*$B$5',
        initialSheetData: {
          A1: 'Artículo',
          B1: 'Precio',
          C1: 'Impuesto',
          A2: 'Mouse',
          B2: '250',
          C2: '',
          A3: 'Teclado',
          B3: '600',
          C3: '',
          A5: 'Tasa IVA',
          B5: '0.16',
        },
      },
    ],
  },
  {
    id: 'COURSE_3',
    order: 3,
    title: 'Curso 3 · Búsqueda y Reparación',
    subtitle: 'Cruza bases de datos con BUSCARV y repara errores #N/A',
    emoji: '🔍',
    color: '#B18CFF',
    prerequisiteCourseId: 'COURSE_2',
    prerequisiteCourseTitle: 'Curso 2 · Lógica y Auditoría',
    missions: [
      {
        ref: 'MISSION_LOOKUP',
        courseId: 'COURSE_3',
        order: 1,
        emoji: '🛠️',
        title: 'Catálogo con BUSCARV',
        client: 'Logística Global',
        description:
          'El sistema de inventario arroja errores #N/A. Repara las fórmulas de búsqueda vertical, fija el rango de la matriz y blinda el reporte con SI.ERROR.',
        skills: 'BUSCARV · SI.ERROR · #N/A',
        color: '#B18CFF',
        earnedXp: 60,
        earnedBytes: 45,
        prerequisiteRef: 'MISSION_INVENTORY',
        prerequisiteTitle: 'Auditoría de Impuestos e IVA (Curso 2)',
        instruction: 'En B2 busca el Precio del código A2 en la tabla de referencia D2:E10.',
        targetFormula: '=VLOOKUP(A2, D2:E10, 2, FALSE)',
        correctAnswer: '=VLOOKUP(A2, D2:E10, 2, FALSE)',
        initialSheetData: {
          A1: 'Código',
          B1: 'Precio',
          D1: 'Item',
          E1: 'Costo',
          A2: 'SKU-1',
          B2: '',
          D2: 'SKU-1',
          E2: '45.00',
          D3: 'SKU-2',
          E3: '89.50',
        },
      },
    ],
  },
];
