import { SupportedLocale } from '../types';

export interface SheetTabData {
  id: string;
  name: string;
  columns: number;
  rows: number;
  initialData: Record<string, string>;
  initialDisplayValues?: Record<string, string>;
}

export interface ExerciseStepData {
  sheetId: string;
  title: string;
  instruction: string;
  targetCell: string;
  acceptedFormulas: string[];
  resultValue: string;
  pedagogicalHint: string;
  emergencySolution: string;
  suggestions: string[];
  formulaBarInitial?: string;
}

export interface StepByStepExerciseData {
  id: string;
  title: string;
  subtitle: string;
  scenario: string;
  badgeEmoji: string;
  color: string;
  earnedXp: number;
  earnedBytes: number;
  sheets: SheetTabData[];
  steps: ExerciseStepData[];
}

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

/**
 * Normaliza fórmulas tal como en `ExerciseStep._normalize` de Flutter
 */
export function normalizeStepFormula(s: string): string {
  let str = s
    .replace(/\s+/g, '')
    .toUpperCase()
    .replace(/;/g, ',')
    .replace(/"/g, '')
    .replace(/'/g, '');

  const funcAliases: Record<string, string> = {
    'SUMA(': 'SUM(',
    'SUMME(': 'SUM(',
    'SOMME(': 'SUM(',
    'SOMA(': 'SUM(',
    'PROMEDIO(': 'AVERAGE(',
    'MITTELWERT(': 'AVERAGE(',
    'MOYENNE(': 'AVERAGE(',
    'MÉDIA(': 'AVERAGE(',
    'MEDIA(': 'AVERAGE(',
    'SI(': 'IF(',
    'WENN(': 'IF(',
    'SE(': 'IF(',
    'SI.ERROR(': 'IFERROR(',
    'WENNFEHLER(': 'IFERROR(',
    'SIERREUR(': 'IFERROR(',
    'SEERRO(': 'IFERROR(',
    'CONTAR.SI(': 'COUNTIF(',
    'ZÄHLENWENN(': 'COUNTIF(',
    'NB.SI(': 'COUNTIF(',
    'CONT.SE(': 'COUNTIF(',
    'BUSCARV(': 'VLOOKUP(',
    'SVERWEIS(': 'VLOOKUP(',
    'RECHERCHEV(': 'VLOOKUP(',
    'PROCV(': 'VLOOKUP(',
    'BUSCARX(': 'XLOOKUP(',
    'XVERWEIS(': 'XLOOKUP(',
    'RECHERCHEX(': 'XLOOKUP(',
    'PROCX(': 'XLOOKUP(',
    'POTENCIA(': 'POWER(',
  };

  for (const [key, val] of Object.entries(funcAliases)) {
    str = str.split(key).join(val);
  }

  const literalEquivalences: Record<string, string> = {
    'METACUMPLIDA': 'GOALMET',
    'OBJECTIFATTEINT': 'GOALMET',
    'ZIELERREICHT': 'GOALMET',
    'METACUMPRIDA': 'GOALMET',
    '目標達成': 'GOALMET',
    'ENPROGRESO': 'INPROGRESS',
    'ENCOURS': 'INPROGRESS',
    'INBEARBEITUNG': 'INPROGRESS',
    'EMPROGRESSO': 'INPROGRESS',
    '進行中': 'INPROGRESS',
    'APROBADO': 'PASSED',
    'REPROBADO': 'FAILED',
  };

  for (const [key, val] of Object.entries(literalEquivalences)) {
    str = str.split(key).join(val);
  }

  return str;
}

export function checkStepFormula(input: string, acceptedFormulas: string[]): boolean {
  const norm = normalizeStepFormula(input);
  for (const expected of acceptedFormulas) {
    if (norm === normalizeStepFormula(expected)) return true;
  }
  return false;
}

export function shuffleStepSuggestions(original: string[]): string[] {
  if (original.length <= 1) return [...original];
  const hasEquals = original.includes('=');
  const pool = original.filter((t) => t !== '=');

  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  if (pool.length > 1 && pool[0] === ')') {
    const idx = pool.findIndex((t) => t !== ')');
    if (idx !== -1) {
      [pool[0], pool[idx]] = [pool[idx], pool[0]];
    }
  }

  if (hasEquals) {
    return ['=', ...pool];
  }

  const isIdentical =
    pool.length === original.length && pool.every((v, i) => v === original[i]);
  const allEqual = original.every((v) => v === original[0]);
  if (isIdentical && !allEqual && pool.length > 1) {
    const first = pool.shift()!;
    pool.push(first);
  }
  return pool;
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
      },
    ],
  },
];

export const STEP_BY_STEP_EXERCISES: Record<string, StepByStepExerciseData> = {
  // ─────────────────────────────────────────────────────────────────────────
  // 1. PANADERÍA DE DOÑA ROSA (11 PASOS EN 3 HOJAS)
  // ─────────────────────────────────────────────────────────────────────────
  MISSION_BAKERY: {
    id: 'MISSION_BAKERY',
    title: 'Panadería de Doña Rosa',
    subtitle: 'Ventas, Costos y Balance',
    scenario:
      'Doña Rosa lleva las cuentas de su panadería y necesita automatizar su libro contable completo: ventas de toda la semana, costos e ingresos brutos, y consolidar el reporte ejecutivo final.',
    badgeEmoji: '🥐',
    color: '#FF8A3D',
    earnedXp: 50,
    earnedBytes: 40,
    sheets: [
      {
        id: 'ventas',
        name: 'Ventas',
        columns: 8,
        rows: 6,
        initialData: {
          A1: 'Pan',
          B1: 'Lun',
          C1: 'Mar',
          D1: 'Mié',
          E1: 'Jue',
          F1: 'Vie',
          G1: 'Total',
          H1: 'Promedio',
          A2: 'Conchas',
          B2: '40',
          C2: '45',
          D2: '50',
          E2: '55',
          F2: '60',
          A3: 'Bolillos',
          B3: '100',
          C3: '110',
          D3: '105',
          E3: '120',
          F3: '130',
          A4: 'Baguettes',
          B4: '20',
          C4: '25',
          D4: '30',
          E4: '25',
          F4: '35',
          A5: 'Donas',
          B5: '50',
          C5: '60',
          D5: '55',
          E5: '70',
          F5: '65',
        },
      },
      {
        id: 'costos',
        name: 'Costos e Ingresos',
        columns: 7,
        rows: 6,
        initialData: {
          A1: 'Pan',
          B1: 'Vendido',
          C1: 'Precio',
          D1: 'Ingreso',
          E1: 'Costo U.',
          F1: 'Costo Total',
          G1: 'Ganancia',
          A2: 'Conchas',
          B2: '250',
          C2: '12',
          E2: '6',
          A3: 'Bolillos',
          B3: '565',
          C3: '5',
          E3: '2',
          A4: 'Baguettes',
          B4: '135',
          C4: '20',
          E4: '9',
          A5: 'Donas',
          B5: '300',
          C5: '15',
          E5: '7',
        },
      },
      {
        id: 'reporte',
        name: 'Reporte Ejecutivo',
        columns: 5,
        rows: 6,
        initialData: {
          A1: 'Indicador',
          B1: 'Valor',
          C1: 'Meta Semanal',
          D1: 'Diagnóstico',
          A2: 'Gran Total Panes',
          C2: '1000',
          A3: 'Producto Estrella',
          C3: '500',
          A4: 'Ganancia Total',
          C4: '4000',
          A5: 'Resultado Meta',
        },
      },
    ],
    steps: [
      {
        sheetId: 'ventas',
        title: 'Paso 1: Total semanal de Conchas',
        instruction:
          'En la hoja Ventas, calcula en G2 la suma de conchas vendidas de lunes a viernes (B2:F2) usando la función SUMA.',
        targetCell: 'G2',
        acceptedFormulas: ['=SUMA(B2:F2)', '=SUMA(B2,C2,D2,E2,F2)', '=SUM(B2:F2)'],
        resultValue: '250',
        pedagogicalHint:
          'Aplica la función que agrupa varias celdas consecutivas separando la celda inicial y la final con dos puntos (:).',
        emergencySolution: '=SUMA(B2:F2)',
        suggestions: ['=', 'SUMA(', 'B2:F2', ')', 'PROMEDIO(', 'B2:E2', 'MAX(', '+'],
      },
      {
        sheetId: 'ventas',
        title: 'Paso 2: Total semanal de Bolillos',
        instruction:
          'En G3, calcula el total semanal de bolillos vendidos sumando el rango horizontal B3:F3.',
        targetCell: 'G3',
        acceptedFormulas: ['=SUMA(B3:F3)', '=SUM(B3:F3)'],
        resultValue: '565',
        pedagogicalHint:
          'Repite la estructura de suma abarcando la fila 3 desde la columna B hasta la F.',
        emergencySolution: '=SUMA(B3:F3)',
        suggestions: ['=', 'SUMA(', 'B3:F3', ')', 'PROMEDIO(', 'B3:E3', '+', '-'],
      },
      {
        sheetId: 'ventas',
        title: 'Paso 3: Total semanal de Baguettes',
        instruction:
          'En G4, calcula la suma de ventas de baguettes de lunes a viernes (B4:F4).',
        targetCell: 'G4',
        acceptedFormulas: ['=SUMA(B4:F4)', '=SUM(B4:F4)'],
        resultValue: '135',
        pedagogicalHint:
          'Identifica la fila de baguettes (fila 4) y suma el rango de días hábiles.',
        emergencySolution: '=SUMA(B4:F4)',
        suggestions: ['=', 'SUMA(', 'B4:F4', ')', 'PROMEDIO(', 'B4:E4', '*', '+'],
      },
      {
        sheetId: 'ventas',
        title: 'Paso 4: Promedio diario de Donas',
        instruction:
          'En H5, obtén la media o venta promedio diaria de donas en la semana usando la función PROMEDIO.',
        targetCell: 'H5',
        acceptedFormulas: ['=PROMEDIO(B5:F5)', '=AVERAGE(B5:F5)'],
        resultValue: '60',
        pedagogicalHint:
          'Utiliza la función estadística para calcular la media aritmética de la fila 5.',
        emergencySolution: '=PROMEDIO(B5:F5)',
        suggestions: ['=', 'PROMEDIO(', 'B5:F5', ')', 'SUMA(', 'B5:E5', 'MAX(', '/'],
      },
      {
        sheetId: 'costos',
        title: 'Paso 5: Ingreso bruto de Conchas',
        instruction:
          '¡Cambiamos a la hoja Costos e Ingresos! En D2, calcula el ingreso multiplicando unidades vendidas (B2) por el precio unitario (C2).',
        targetCell: 'D2',
        acceptedFormulas: ['=B2*C2', '=C2*B2'],
        resultValue: '3000',
        pedagogicalHint:
          'Multiplica la cantidad vendida por el precio usando el operador asterisco (*).',
        emergencySolution: '=B2*C2',
        suggestions: ['=', 'B2', '*', 'C2', 'E2', '+', '-', '/'],
      },
      {
        sheetId: 'costos',
        title: 'Paso 6: Ingreso bruto de Bolillos',
        instruction:
          'En D3, calcula el ingreso total de bolillos multiplicando B3 por C3.',
        targetCell: 'D3',
        acceptedFormulas: ['=B3*C3', '=C3*B3'],
        resultValue: '2825',
        pedagogicalHint:
          'Realiza la multiplicación correspondiente a la fila 3 de bolillos.',
        emergencySolution: '=B3*C3',
        suggestions: ['=', 'B3', '*', 'C3', 'E3', '+', '/', '-'],
      },
      {
        sheetId: 'costos',
        title: 'Paso 7: Costo total de producción',
        instruction:
          'En F3, calcula el costo total de bolillos multiplicando unidades vendidas (B3) por el costo unitario de harina y gas (E3).',
        targetCell: 'F3',
        acceptedFormulas: ['=B3*E3', '=E3*B3'],
        resultValue: '1130',
        pedagogicalHint:
          'Multiplica la columna de unidades vendidas por la columna de costo unitario.',
        emergencySolution: '=B3*E3',
        suggestions: ['=', 'B3', '*', 'E3', 'C3', 'F3', '+', '-', '/'],
      },
      {
        sheetId: 'costos',
        title: 'Paso 8: Ganancia neta de Bolillos',
        instruction:
          'En G3, calcula la ganancia neta restando el costo total (F3) del ingreso total (D3).',
        targetCell: 'G3',
        acceptedFormulas: ['=D3-F3'],
        resultValue: '1695',
        pedagogicalHint:
          'Resta directamente la celda de costos a la celda de ingresos con el signo menos (-).',
        emergencySolution: '=D3-F3',
        suggestions: ['=', 'D3', '-', 'F3', 'B3', 'E3', '+', '*', '/'],
      },
      {
        sheetId: 'reporte',
        title: 'Paso 9: Gran Total de Panes Vendidos',
        instruction:
          'Pasamos a la hoja Reporte Ejecutivo. En B2, suma las ventas totales de los 4 productos de la panadería: 250 conchas, 565 bolillos, 135 baguettes y 300 donas.',
        targetCell: 'B2',
        acceptedFormulas: [
          '=SUMA(250,565,135,300)',
          '=SUM(250,565,135,300)',
          '=250+565+135+300',
        ],
        resultValue: '1250',
        pedagogicalHint:
          'Puedes totalizar los valores numéricos de las cuatro variedades sumándolos con SUMA.',
        emergencySolution: '=SUMA(250,565,135,300)',
        suggestions: ['=', 'SUMA(', '250', ',', '565', ',', '135', ',', '300', ')', 'PROMEDIO(', '+'],
      },
      {
        sheetId: 'reporte',
        title: 'Paso 10: Venta del Producto Estrella',
        instruction:
          'En B3, identifica la cantidad vendida más alta entre los 4 tipos de panes usando la función MAX (250, 565, 135, 300).',
        targetCell: 'B3',
        acceptedFormulas: ['=MAX(250,565,135,300)'],
        resultValue: '565',
        pedagogicalHint:
          'Aplica la función que devuelve el valor más grande de una lista de argumentos.',
        emergencySolution: '=MAX(250,565,135,300)',
        suggestions: ['=', 'MAX(', '250', ',', '565', ',', '135', ',', '300', ')', 'MIN(', 'SUMA('],
      },
      {
        sheetId: 'reporte',
        title: 'Paso 11: Diagnóstico de Meta con SI',
        instruction:
          'En D5, escribe la evaluación condicional: si el Gran Total B2 es mayor o igual a 1000 devuelve "Meta Cumplida", de lo contrario "En Progreso".',
        targetCell: 'D5',
        acceptedFormulas: [
          '=SI(B2>=1000,"Meta Cumplida","En Progreso")',
          '=SI(B2>=1000,Meta Cumplida,En Progreso)',
          '=IF(B2>=1000,"Goal Met","In Progress")',
        ],
        resultValue: 'Meta Cumplida',
        pedagogicalHint:
          'La función condicional evalúa la prueba lógica B2>=1000 y devuelve dos posibles textos entre comillas.',
        emergencySolution: '=SI(B2>=1000,"Meta Cumplida","En Progreso")',
        suggestions: ['=', 'SI(', 'B2>=1000', ',"Meta Cumplida"', ',"En Progreso"', ')', 'B2<1000', 'Y('],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 2. CALIFICACIONES DEL CURSO (10 PASOS EN 3 HOJAS)
  // ─────────────────────────────────────────────────────────────────────────
  MISSION_GRADES: {
    id: 'MISSION_GRADES',
    title: 'Calificaciones del curso',
    subtitle: 'Promedios, Asistencia y Dictamen',
    scenario:
      'Automatiza el libro de calificaciones del profesor Martínez procesando los parciales de los estudiantes, ponderando asistencias con condicionales y emitiendo el acta final.',
    badgeEmoji: '🎓',
    color: '#4DA3FF',
    earnedXp: 50,
    earnedBytes: 40,
    sheets: [
      {
        id: 'parciales',
        name: 'Parciales',
        columns: 7,
        rows: 6,
        initialData: {
          A1: 'Alumno',
          B1: 'P1',
          C1: 'P2',
          D1: 'P3',
          E1: 'Promedio',
          A2: 'Sofía',
          B2: '90',
          C2: '95',
          D2: '85',
          A3: 'Mateo',
          B3: '60',
          C3: '65',
          D3: '55',
          A4: 'Lucía',
          B4: '80',
          C4: '75',
          D4: '90',
          A5: 'Daniel',
          B5: '50',
          C5: '60',
          D5: '40',
        },
      },
      {
        id: 'asistencia',
        name: 'Asistencias',
        columns: 6,
        rows: 6,
        initialData: {
          A1: 'Alumno',
          B1: 'Clases',
          C1: 'Asistió',
          D1: 'Tasa Asistencia',
          E1: 'Bono Puntos',
          A2: 'Sofía',
          B2: '20',
          C2: '19',
          A3: 'Mateo',
          B3: '20',
          C3: '14',
          A4: 'Lucía',
          B4: '20',
          C4: '20',
          A5: 'Daniel',
          B5: '20',
          C5: '12',
        },
      },
      {
        id: 'acta',
        name: 'Acta Final',
        columns: 6,
        rows: 7,
        initialData: {
          A1: 'Alumno',
          B1: 'Nota Final',
          C1: 'Dictamen',
          A2: 'Sofía',
          B2: '95',
          A3: 'Mateo',
          B3: '60',
          A4: 'Lucía',
          B4: '85',
          A5: 'Daniel',
          B5: '50',
          A6: 'Total Aprobados',
        },
      },
    ],
    steps: [
      {
        sheetId: 'parciales',
        title: 'Paso 1: Promedio de notas de Sofía',
        instruction:
          'En la hoja Parciales, calcula el promedio de los 3 exámenes de Sofía en la celda E2 (B2 a D2).',
        targetCell: 'E2',
        acceptedFormulas: ['=PROMEDIO(B2:D2)', '=AVERAGE(B2:D2)', '=(B2+C2+D2)/3'],
        resultValue: '90',
        pedagogicalHint:
          'Aplica la función que suma automáticamente y divide entre la cantidad de exámenes.',
        emergencySolution: '=PROMEDIO(B2:D2)',
        suggestions: ['=', 'PROMEDIO(', 'B2:D2', ')', 'SUMA('],
      },
      {
        sheetId: 'parciales',
        title: 'Paso 2: Promedio de notas de Mateo',
        instruction:
          'En E3, obtén el promedio de los exámenes de Mateo abarcando B3:D3.',
        targetCell: 'E3',
        acceptedFormulas: ['=PROMEDIO(B3:D3)', '=AVERAGE(B3:D3)', '=(B3+C3+D3)/3'],
        resultValue: '60',
        pedagogicalHint:
          'Aplica la función PROMEDIO en la fila 3 del alumno Mateo.',
        emergencySolution: '=PROMEDIO(B3:D3)',
        suggestions: ['=', 'PROMEDIO(', 'B3:D3', ')', '/3'],
      },
      {
        sheetId: 'parciales',
        title: 'Paso 3: Promedio de notas de Lucía',
        instruction:
          'En E4, calcula el promedio de exámenes de Lucía con el rango B4:D4.',
        targetCell: 'E4',
        acceptedFormulas: ['=PROMEDIO(B4:D4)', '=AVERAGE(B4:D4)'],
        resultValue: '81.6',
        pedagogicalHint:
          'Utiliza la misma función PROMEDIO para el rango horizontal de Lucía.',
        emergencySolution: '=PROMEDIO(B4:D4)',
        suggestions: ['=', 'PROMEDIO(', 'B4:D4', ')', '+'],
      },
      {
        sheetId: 'parciales',
        title: 'Paso 4: Examen con nota máxima',
        instruction:
          'En B6, calcula la calificación más alta obtenida en el Parcial 1 usando MAX sobre B2:B5.',
        targetCell: 'B6',
        acceptedFormulas: ['=MAX(B2:B5)'],
        resultValue: '90',
        pedagogicalHint:
          'La función MAX evalúa verticalmente la columna B de calificaciones del primer parcial.',
        emergencySolution: '=MAX(B2:B5)',
        suggestions: ['=', 'MAX(', 'B2:B5', ')', 'MIN('],
      },
      {
        sheetId: 'asistencia',
        title: 'Paso 5: Tasa de asistencia de Sofía',
        instruction:
          'Cambiamos a la hoja Asistencias. En D2, calcula la tasa dividiendo las asistencias (C2) entre el total de clases (B2).',
        targetCell: 'D2',
        acceptedFormulas: ['=C2/B2'],
        resultValue: '0.95',
        pedagogicalHint:
          'Divide el valor de asistencia entre el total mediante la barra de división (/).',
        emergencySolution: '=C2/B2',
        suggestions: ['=', 'C2', '/', 'B2', '*'],
      },
      {
        sheetId: 'asistencia',
        title: 'Paso 6: Tasa de asistencia de Mateo',
        instruction:
          'En D3, calcula la proporción de asistencia de Mateo dividiendo C3 entre B3.',
        targetCell: 'D3',
        acceptedFormulas: ['=C3/B3'],
        resultValue: '0.7',
        pedagogicalHint:
          'Aplica la misma división para la fila correspondiente a Mateo.',
        emergencySolution: '=C3/B3',
        suggestions: ['=', 'C3', '/', 'B3', '-'],
      },
      {
        sheetId: 'asistencia',
        title: 'Paso 7: Bono de puntos por asistencia',
        instruction:
          'En E2, usa la función SI: si la asistencia D2 es mayor o igual a 0.9 otorga 5 puntos de bono, sino 0.',
        targetCell: 'E2',
        acceptedFormulas: ['=SI(D2>=0.9,5,0)', '=IF(D2>=0.9,5,0)'],
        resultValue: '5',
        pedagogicalHint:
          'La función condicional requiere la condición D2>=0.9 y los valores si es verdadero (5) y si es falso (0).',
        emergencySolution: '=SI(D2>=0.9,5,0)',
        suggestions: ['=', 'SI(', 'D2>=0.9', ',5', ',0', ')'],
      },
      {
        sheetId: 'acta',
        title: 'Paso 8: Dictamen de Sofía',
        instruction:
          'Pasamos al Acta Final. En C2, evalúa con la función SI: si la nota final B2 es mayor o igual a 70 escribe "Aprobado", sino "Reprobado".',
        targetCell: 'C2',
        acceptedFormulas: [
          '=SI(B2>=70,"Aprobado","Reprobado")',
          '=SI(B2>=70,Aprobado,Reprobado)',
          '=IF(B2>=70,"Passed","Failed")',
        ],
        resultValue: 'Aprobado',
        pedagogicalHint:
          'Escribe la estructura condicional SI comparando si la nota es >= 70.',
        emergencySolution: '=SI(B2>=70,"Aprobado","Reprobado")',
        suggestions: ['=', 'SI(', 'B2>=70', ',"Aprobado"', ',"Reprobado"', ')'],
      },
      {
        sheetId: 'acta',
        title: 'Paso 9: Dictamen de Mateo',
        instruction:
          'En C3, evalúa la condición para Mateo con SI(B3>=70, "Aprobado", "Reprobado").',
        targetCell: 'C3',
        acceptedFormulas: [
          '=SI(B3>=70,"Aprobado","Reprobado")',
          '=SI(B3>=70,Aprobado,Reprobado)',
          '=IF(B3>=70,"Passed","Failed")',
        ],
        resultValue: 'Reprobado',
        pedagogicalHint:
          'Aplica la función lógica en la fila de Mateo para clasificar su resultado.',
        emergencySolution: '=SI(B3>=70,"Aprobado","Reprobado")',
        suggestions: ['=', 'SI(', 'B3>=70', ',"Aprobado"', ',"Reprobado"', ')'],
      },
      {
        sheetId: 'acta',
        title: 'Paso 10: Total de Alumnos Aprobados',
        instruction:
          'En B6, cuenta cuántos alumnos aprobaron en el rango C2:C5 usando la función CONTAR.SI buscando "Aprobado".',
        targetCell: 'B6',
        acceptedFormulas: [
          '=CONTAR.SI(C2:C5,"Aprobado")',
          '=CONTAR.SI(C2:C5,Aprobado)',
          '=COUNTIF(C2:C5,"Passed")',
        ],
        resultValue: '2',
        pedagogicalHint:
          'CONTAR.SI toma dos parámetros: el rango donde buscar y el criterio entre comillas.',
        emergencySolution: '=CONTAR.SI(C2:C5,"Aprobado")',
        suggestions: ['=', 'CONTAR.SI(', 'C2:C5', ',"Aprobado"', ')'],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 3. PRESUPUESTO DEL MES (10 PASOS EN 3 HOJAS)
  // ─────────────────────────────────────────────────────────────────────────
  MISSION_BUDGET: {
    id: 'MISSION_BUDGET',
    title: 'Presupuesto del mes',
    subtitle: 'Ingresos, Gastos y Balance',
    scenario:
      'Gestiona las finanzas familiares a lo largo de un libro con 3 hojas: registra ingresos y gastos fijos, vigila gastos variables con alertas condicionales y calcula el balance anual de ahorro.',
    badgeEmoji: '💸',
    color: '#21C26B',
    earnedXp: 50,
    earnedBytes: 40,
    sheets: [
      {
        id: 'ingresos',
        name: 'Ingresos y Fijos',
        columns: 6,
        rows: 6,
        initialData: {
          A1: 'Concepto',
          B1: 'Estimado',
          C1: 'Real',
          D1: 'Diferencia',
          A2: 'Salario Titular',
          B2: '2000',
          C2: '2000',
          A3: 'Ingresos Extra',
          B3: '400',
          C3: '550',
          A4: 'Alquiler Casa',
          B4: '750',
          C4: '750',
          A5: 'Total Ingresos',
        },
      },
      {
        id: 'gastos',
        name: 'Gastos Variables',
        columns: 6,
        rows: 6,
        initialData: {
          A1: 'Categoría',
          B1: 'Límite',
          C1: 'Gastado',
          D1: 'Margen',
          E1: 'Alerta',
          A2: 'Alimentos y Super',
          B2: '600',
          C2: '540',
          A3: 'Transporte y Auto',
          B3: '200',
          C3: '230',
          A4: 'Entretenimiento',
          B4: '150',
          C4: '190',
        },
      },
      {
        id: 'balance',
        name: 'Balance Anual',
        columns: 5,
        rows: 6,
        initialData: {
          A1: 'Métrica',
          B1: 'Valor',
          C1: 'Objetivo',
          A2: 'Total Gastos Mes',
          C2: '1600',
          A3: 'Ahorro Neto',
          C3: '500',
          A4: 'Tasa de Ahorro',
          C4: '0.20',
          A5: 'Evaluación Salud',
        },
      },
    ],
    steps: [
      {
        sheetId: 'ingresos',
        title: 'Paso 1: Totalizar Ingresos Estimados',
        instruction:
          'En la hoja Ingresos y Fijos, calcula en B5 la suma de los ingresos estimados sumando B2 y B3 con SUMA.',
        targetCell: 'B5',
        acceptedFormulas: ['=SUMA(B2:B3)', '=SUM(B2:B3)', '=B2+B3'],
        resultValue: '2400',
        pedagogicalHint:
          'Aplica la función SUMA sobre el rango vertical de ingresos B2:B3.',
        emergencySolution: '=SUMA(B2:B3)',
        suggestions: ['=', 'SUMA(', 'B2:B3', ')', '+'],
      },
      {
        sheetId: 'ingresos',
        title: 'Paso 2: Totalizar Ingresos Reales',
        instruction:
          'En C5, calcula la suma de los ingresos reales efectivamente cobrados sumando C2:C3.',
        targetCell: 'C5',
        acceptedFormulas: ['=SUMA(C2:C3)', '=SUM(C2:C3)', '=C2+C3'],
        resultValue: '2550',
        pedagogicalHint: 'Suma los ingresos cobrados de la columna C.',
        emergencySolution: '=SUMA(C2:C3)',
        suggestions: ['=', 'SUMA(', 'C2:C3', ')', '+'],
      },
      {
        sheetId: 'ingresos',
        title: 'Paso 3: Diferencia en Ingresos Extra',
        instruction:
          'En D3, calcula la diferencia restando el ingreso estimado (B3) del ingreso real (C3).',
        targetCell: 'D3',
        acceptedFormulas: ['=C3-B3'],
        resultValue: '150',
        pedagogicalHint:
          'Resta la celda estimada a la celda real para ver el superávit.',
        emergencySolution: '=C3-B3',
        suggestions: ['=', 'C3', '-', 'B3', '+'],
      },
      {
        sheetId: 'gastos',
        title: 'Paso 4: Margen en Alimentos',
        instruction:
          'Pasamos a Gastos Variables. En D2, calcula el margen restante restando lo gastado (C2) del límite presupuestado (B2).',
        targetCell: 'D2',
        acceptedFormulas: ['=B2-C2'],
        resultValue: '60',
        pedagogicalHint: 'Resta lo gastado al límite presupuestado.',
        emergencySolution: '=B2-C2',
        suggestions: ['=', 'B2', '-', 'C2', '+'],
      },
      {
        sheetId: 'gastos',
        title: 'Paso 5: Margen en Transporte',
        instruction:
          'En D3, calcula el margen restante en transporte restando C3 de B3.',
        targetCell: 'D3',
        acceptedFormulas: ['=B3-C3'],
        resultValue: '-30',
        pedagogicalHint:
          'Resta el gasto de la fila 3 a su límite correspondiente.',
        emergencySolution: '=B3-C3',
        suggestions: ['=', 'B3', '-', 'C3', '+'],
      },
      {
        sheetId: 'gastos',
        title: 'Paso 6: Alerta de Alimentos con SI',
        instruction:
          'En E2, usa la función SI: si el margen D2 es menor que 0 escribe "Excedido", de lo contrario "En Presupuesto".',
        targetCell: 'E2',
        acceptedFormulas: [
          '=SI(D2<0,"Excedido","En Presupuesto")',
          '=SI(D2<0,Excedido,En Presupuesto)',
          '=IF(D2<0,"Excedido","En Presupuesto")',
        ],
        resultValue: 'En Presupuesto',
        pedagogicalHint:
          'La prueba lógica comprueba si el margen cayó por debajo de cero (D2 < 0).',
        emergencySolution: '=SI(D2<0,"Excedido","En Presupuesto")',
        suggestions: ['=', 'SI(', 'D2<0', ',"Excedido"', ',"En Presupuesto"', ')'],
      },
      {
        sheetId: 'gastos',
        title: 'Paso 7: Alerta de Transporte con SI',
        instruction:
          'En E3, aplica la misma fórmula condicional para transporte evaluando si D3 es menor a 0.',
        targetCell: 'E3',
        acceptedFormulas: [
          '=SI(D3<0,"Excedido","En Presupuesto")',
          '=SI(D3<0,Excedido,En Presupuesto)',
          '=IF(D3<0,"Excedido","En Presupuesto")',
        ],
        resultValue: 'Excedido',
        pedagogicalHint:
          'Evalúa si el margen D3 es negativo para alertar el desvío.',
        emergencySolution: '=SI(D3<0,"Excedido","En Presupuesto")',
        suggestions: ['=', 'SI(', 'D3<0', ',"Excedido"', ',"En Presupuesto"', ')'],
      },
      {
        sheetId: 'balance',
        title: 'Paso 8: Total de Gastos del Mes',
        instruction:
          'En la hoja Balance Anual, suma en B2 los gastos totales sumando alquiler (750) más variables (540, 230, 190).',
        targetCell: 'B2',
        acceptedFormulas: [
          '=750+540+230+190',
          '=SUMA(750,540,230,190)',
          '=SUM(750,540,230,190)',
          '=SUMA(750+540+230+190)',
        ],
        resultValue: '1710',
        pedagogicalHint:
          'Suma los cuatro rubros de gasto para obtener la cifra consolidada.',
        emergencySolution: '=SUMA(750,540,230,190)',
        suggestions: ['=', 'SUMA(', '750', ',', '540', ',', '230', ',', '190', ')', '+'],
      },
      {
        sheetId: 'balance',
        title: 'Paso 9: Ahorro Neto del Mes',
        instruction:
          'En B3, calcula el ahorro neto restando los gastos totales (B2) del ingreso real (2550).',
        targetCell: 'B3',
        acceptedFormulas: ['=2550-B2'],
        resultValue: '840',
        pedagogicalHint: 'Resta la celda B2 del total de ingresos percibidos.',
        emergencySolution: '=2550-B2',
        suggestions: ['=', '2550', '-', 'B2', '+'],
      },
      {
        sheetId: 'balance',
        title: 'Paso 10: Tasa de Ahorro',
        instruction:
          'En B4, calcula la proporción de ahorro dividiendo el ahorro neto (B3) entre el ingreso total (2550).',
        targetCell: 'B4',
        acceptedFormulas: ['=B3/2550'],
        resultValue: '0.33',
        pedagogicalHint:
          'Divide el monto ahorrado entre el total de ingresos para obtener el ratio.',
        emergencySolution: '=B3/2550',
        suggestions: ['=', 'B3', '/', '2550', '*'],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 4. DESAFÍO DIARIO / CATÁLOGO BUSCARV (10 PASOS EN 3 HOJAS)
  // ─────────────────────────────────────────────────────────────────────────
  DAILY: {
    id: 'DAILY',
    title: 'Desafío Diario: La hoja rota',
    subtitle: 'Auditoría y Reparación de Errores',
    scenario:
      'Audita y repara una planilla de facturación empresarial que tiene fórmulas rotas y celdas con errores #N/A, #¡DIV/0! y referencias fijas desconfiguradas.',
    badgeEmoji: '🛠️',
    color: '#B18CFF',
    earnedXp: 60,
    earnedBytes: 50,
    sheets: [
      {
        id: 'precios',
        name: 'Facturación',
        columns: 6,
        rows: 6,
        initialData: {
          A1: 'Código',
          B1: 'Artículo',
          C1: 'Precio',
          D1: 'Envío Fijo',
          E1: 'Total',
          A2: 'P01',
          B2: 'Teclado',
          C2: '45',
          A3: 'P02',
          B3: 'Mouse',
          C3: '25',
          A4: 'P03',
          B4: 'Monitor',
          C4: '180',
          A5: 'Tarifa Base',
          B5: '15',
        },
      },
      {
        id: 'busqueda',
        name: 'Búsquedas BUSCARV',
        columns: 6,
        rows: 6,
        initialData: {
          A1: 'Consulta',
          B1: 'ID Buscado',
          C1: 'Resultado Crudo',
          D1: 'Resultado Seguro',
          A2: 'Item 1',
          B2: 'P01',
          C2: '45',
          A3: 'Item 2',
          B3: 'P99',
          C3: '#N/A',
          A4: 'Item 3',
          B4: 'P03',
          C4: '180',
        },
        initialDisplayValues: {
          C3: '#N/A',
        },
      },
      {
        id: 'metricas',
        name: 'Métricas y Resumen',
        columns: 5,
        rows: 6,
        initialData: {
          A1: 'Indicador',
          B1: 'Cálculo',
          A2: 'Promedio Válidos',
          A3: 'Total Protegido',
          A4: 'Estado Planilla',
        },
      },
    ],
    steps: [
      {
        sheetId: 'precios',
        title: 'Paso 1: Fijar tarifa de envío con dólar',
        instruction:
          'En E2, calcula el total sumando el precio (C2) más la tarifa fija de envío en B5 usando referencia absoluta ($B$5).',
        targetCell: 'E2',
        acceptedFormulas: ['=C2+$B$5', '=$B$5+C2', '=C2+B5'],
        resultValue: '60',
        pedagogicalHint:
          'Para fijar una celda al arrastrar, antepón el signo de dólar ($) a la columna y a la fila.',
        emergencySolution: '=C2+$B$5',
        suggestions: ['=', 'C2', '+', '$B$5', 'B5'],
      },
      {
        sheetId: 'precios',
        title: 'Paso 2: Total con envío para Mouse',
        instruction:
          'En E3, suma el precio del mouse (C3) más la tarifa fija en $B$5.',
        targetCell: 'E3',
        acceptedFormulas: ['=C3+$B$5', '=$B$5+C3', '=C3+B5'],
        resultValue: '40',
        pedagogicalHint:
          'Aplica la misma referencia absoluta fijada en B5 sobre el precio de la fila 3.',
        emergencySolution: '=C3+$B$5',
        suggestions: ['=', 'C3', '+', '$B$5', 'B5'],
      },
      {
        sheetId: 'precios',
        title: 'Paso 3: Total con envío para Monitor',
        instruction:
          'En E4, suma el precio C4 más la tarifa fija $B$5.',
        targetCell: 'E4',
        acceptedFormulas: ['=C4+$B$5', '=$B$5+C4', '=C4+B5'],
        resultValue: '195',
        pedagogicalHint:
          'Completa la columna sumando C4 y la celda absoluta $B$5.',
        emergencySolution: '=C4+$B$5',
        suggestions: ['=', 'C4', '+', '$B$5', 'B5'],
      },
      {
        sheetId: 'precios',
        title: 'Paso 4: Gran Total de Facturación',
        instruction:
          'En E5, calcula la suma de los 3 totales facturados (E2:E4) usando la función SUMA.',
        targetCell: 'E5',
        acceptedFormulas: ['=SUMA(E2:E4)', '=SUM(E2:E4)', '=E2+E3+E4'],
        resultValue: '295',
        pedagogicalHint:
          'Suma los tres subtotales con SUMA abarcando el rango E2 a E4.',
        emergencySolution: '=SUMA(E2:E4)',
        suggestions: ['=', 'SUMA(', 'E2:E4', ')', '+'],
      },
      {
        sheetId: 'busqueda',
        title: 'Paso 5: Proteger error #N/A con SI.ERROR',
        instruction:
          '¡Vamos a la hoja Búsquedas! El código P99 en C3 arroja #N/A. En D3, usa SI.ERROR sobre C3 para devolver 0 si hay error.',
        targetCell: 'D3',
        acceptedFormulas: ['=SI.ERROR(C3,0)', '=IFERROR(C3,0)', '=SI.ERROR(0,0)'],
        resultValue: '0',
        pedagogicalHint:
          'La función SI.ERROR recibe dos argumentos: el valor a evaluar y qué mostrar si falla.',
        emergencySolution: '=SI.ERROR(C3,0)',
        suggestions: ['=', 'SI.ERROR(', 'C3', ',', '0', ')'],
      },
      {
        sheetId: 'busqueda',
        title: 'Paso 6: Proteger Item 1 válido',
        instruction:
          'En D2, aplica también SI.ERROR sobre la celda C2 devolviendo 0 si ocurriese error.',
        targetCell: 'D2',
        acceptedFormulas: ['=SI.ERROR(C2,0)', '=IFERROR(C2,0)'],
        resultValue: '45',
        pedagogicalHint:
          'Aplica SI.ERROR(C2, 0) para estandarizar la columna de resultados seguros.',
        emergencySolution: '=SI.ERROR(C2,0)',
        suggestions: ['=', 'SI.ERROR(', 'C2', ',', '0', ')'],
      },
      {
        sheetId: 'busqueda',
        title: 'Paso 7: Proteger Item 3 válido',
        instruction:
          'En D4, aplica SI.ERROR sobre C4 con valor de respaldo 0.',
        targetCell: 'D4',
        acceptedFormulas: ['=SI.ERROR(C4,0)', '=IFERROR(C4,0)'],
        resultValue: '180',
        pedagogicalHint: 'Aplica la función de protección en la fila 4.',
        emergencySolution: '=SI.ERROR(C4,0)',
        suggestions: ['=', 'SI.ERROR(', 'C4', ',', '0', ')'],
      },
      {
        sheetId: 'metricas',
        title: 'Paso 8: Total Protegido',
        instruction:
          'En la hoja Métricas, calcula en B3 la suma de los valores seguros (D2, D3 y D4 que suman 45 + 0 + 180 = 225).',
        targetCell: 'B3',
        acceptedFormulas: ['=45+0+180', '=SUMA(45,0,180)', '=SUM(45,0,180)', '=SUMA(225)'],
        resultValue: '225',
        pedagogicalHint:
          'Suma los valores limpios calculados en la hoja de búsqueda.',
        emergencySolution: '=SUMA(45,0,180)',
        suggestions: ['=', 'SUMA(', '45', ',', '0', ',', '180', ')'],
      },
      {
        sheetId: 'metricas',
        title: 'Paso 9: Promedio de Artículos Válidos',
        instruction:
          'En B2, calcula el promedio entre los dos artículos existentes (45 y 180) con PROMEDIO(45, 180).',
        targetCell: 'B2',
        acceptedFormulas: ['=PROMEDIO(45,180)', '=AVERAGE(45,180)', '=(45+180)/2'],
        resultValue: '112.5',
        pedagogicalHint:
          'Aplica PROMEDIO pasando ambos números como parámetros.',
        emergencySolution: '=PROMEDIO(45,180)',
        suggestions: ['=', 'PROMEDIO(', '45', ',', '180', ')'],
      },
      {
        sheetId: 'metricas',
        title: 'Paso 10: Validación Final de la Planilla con SI',
        instruction:
          'En B4, usa la función SI: si el total B3 es mayor a 200 escribe "Planilla Segura", de lo contrario "Revisar".',
        targetCell: 'B4',
        acceptedFormulas: [
          '=SI(B3>200,"Planilla Segura","Revisar")',
          '=SI(B3>200,Planilla Segura,Revisar)',
          '=IF(B3>200,"Planilla Segura","Revisar")',
        ],
        resultValue: 'Planilla Segura',
        pedagogicalHint:
          'Compara si B3 es > 200 y devuelve el texto de validación.',
        emergencySolution: '=SI(B3>200,"Planilla Segura","Revisar")',
        suggestions: ['=', 'SI(', 'B3>200', ',"Planilla Segura"', ',"Revisar"', ')'],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 5. REPASO DE PUNTOS DÉBILES / AUDITORÍA IVA (10 PASOS EN 2 HOJAS)
  // ─────────────────────────────────────────────────────────────────────────
  WEAK_POINTS: {
    id: 'WEAK_POINTS',
    title: 'Repasar puntos débiles',
    subtitle: 'Referencias fijas, Jerarquía y Fórmulas',
    scenario:
      'Práctica intensiva de 10 pasos con las dificultades que más hacen tropezar en Excel: fijar celdas con signos de dólar ($), orden de operaciones matemáticas y redondeo.',
    badgeEmoji: '🎯',
    color: '#4DA3FF',
    earnedXp: 45,
    earnedBytes: 35,
    sheets: [
      {
        id: 'referencias',
        name: 'Referencias Fijas ($)',
        columns: 6,
        rows: 6,
        initialData: {
          A1: 'Producto',
          B1: 'Venta Base',
          C1: 'Tasa IVA',
          D1: 'Monto IVA',
          E1: 'Total con IVA',
          A2: 'Laptop',
          B2: '1000',
          A3: 'Monitor',
          B3: '300',
          A4: 'Teclado',
          B4: '50',
          A5: 'IVA Fijo',
          B5: '0.16',
        },
      },
      {
        id: 'jerarquia',
        name: 'Jerarquía y Fórmulas',
        columns: 6,
        rows: 6,
        initialData: {
          A1: 'Operación',
          B1: 'Valor 1',
          C1: 'Valor 2',
          D1: 'Valor 3',
          E1: 'Resultado',
          A2: 'Suma + Mult',
          B2: '10',
          C2: '5',
          D2: '2',
          A3: 'Paréntesis Prioridad',
          B3: '10',
          C3: '5',
          D3: '2',
          A4: 'División y Resta',
          B4: '50',
          C4: '10',
          D4: '5',
          A5: 'Potencia',
          B5: '2',
          C5: '3',
        },
      },
    ],
    steps: [
      {
        sheetId: 'referencias',
        title: 'Paso 1: Calcular IVA de Laptop con referencia fija',
        instruction:
          'En D2, multiplica la venta (B2) por la tasa fija en B5 usando referencia absoluta ($B$5).',
        targetCell: 'D2',
        acceptedFormulas: ['=B2*$B$5', '=$B$5*B2', '=B2*B5'],
        resultValue: '160',
        pedagogicalHint:
          'Multiplica la celda B2 por la celda fijada con signos de dólar ($B$5).',
        emergencySolution: '=B2*$B$5',
        suggestions: ['=', 'B2', '*', '$B$5', 'B5'],
      },
      {
        sheetId: 'referencias',
        title: 'Paso 2: Total con IVA de Laptop',
        instruction:
          'En E2, calcula el total sumando la venta base (B2) más el IVA calculado (D2).',
        targetCell: 'E2',
        acceptedFormulas: ['=B2+D2', '=D2+B2'],
        resultValue: '1160',
        pedagogicalHint: 'Suma directamente el importe base más el impuesto.',
        emergencySolution: '=B2+D2',
        suggestions: ['=', 'B2', '+', 'D2', '*'],
      },
      {
        sheetId: 'referencias',
        title: 'Paso 3: IVA de Monitor con referencia fija',
        instruction:
          'En D3, multiplica la venta del monitor (B3) por la tasa de IVA fija ($B$5).',
        targetCell: 'D3',
        acceptedFormulas: ['=B3*$B$5', '=$B$5*B3', '=B3*B5'],
        resultValue: '48',
        pedagogicalHint:
          'Aplica la fórmula manteniendo $B$5 invariable para la fila 3.',
        emergencySolution: '=B3*$B$5',
        suggestions: ['=', 'B3', '*', '$B$5', 'B5'],
      },
      {
        sheetId: 'referencias',
        title: 'Paso 4: Total con IVA de Monitor',
        instruction: 'En E3, suma la venta base B3 más el IVA D3.',
        targetCell: 'E3',
        acceptedFormulas: ['=B3+D3', '=D3+B3'],
        resultValue: '348',
        pedagogicalHint: 'Suma los valores de la fila 3.',
        emergencySolution: '=B3+D3',
        suggestions: ['=', 'B3', '+', 'D3', '-'],
      },
      {
        sheetId: 'referencias',
        title: 'Paso 5: IVA de Teclado con referencia fija',
        instruction:
          'En D4, multiplica la venta del teclado (B4) por la tasa fija ($B$5).',
        targetCell: 'D4',
        acceptedFormulas: ['=B4*$B$5', '=$B$5*B4', '=B4*B5'],
        resultValue: '8',
        pedagogicalHint:
          'Multiplica la celda B4 por la referencia fija $B$5.',
        emergencySolution: '=B4*$B$5',
        suggestions: ['=', 'B4', '*', '$B$5', 'B5'],
      },
      {
        sheetId: 'jerarquia',
        title: 'Paso 6: Jerarquía de multiplicación antes de suma',
        instruction:
          '¡Vamos a Jerarquía de Operadores! En E2, escribe la fórmula =B2+C2*D2. ¿Cuál operación se ejecutará primero?',
        targetCell: 'E2',
        acceptedFormulas: ['=B2+C2*D2', '=B2+(C2*D2)'],
        resultValue: '20',
        pedagogicalHint:
          'En Excel la multiplicación (*) siempre se calcula antes que la suma (+).',
        emergencySolution: '=B2+C2*D2',
        suggestions: ['=', 'B2', '+', 'C2', '*', 'D2'],
      },
      {
        sheetId: 'jerarquia',
        title: 'Paso 7: Alterar orden con paréntesis',
        instruction:
          'En E3, usa paréntesis para obligar a sumar primero antes de multiplicar: =(B3+C3)*D3.',
        targetCell: 'E3',
        acceptedFormulas: ['=(B3+C3)*D3', '=(C3+B3)*D3'],
        resultValue: '30',
        pedagogicalHint:
          'Los paréntesis tienen la máxima prioridad y se evalúan antes que la multiplicación.',
        emergencySolution: '=(B3+C3)*D3',
        suggestions: ['=', '(', 'B3', '+', 'C3', ')', '*', 'D3'],
      },
      {
        sheetId: 'jerarquia',
        title: 'Paso 8: División antes que resta',
        instruction:
          'En E4, escribe =B4/C4-D4 (50 dividido 10 menos 5).',
        targetCell: 'E4',
        acceptedFormulas: ['=B4/C4-D4'],
        resultValue: '0',
        pedagogicalHint: 'La división tiene prioridad sobre la resta.',
        emergencySolution: '=B4/C4-D4',
        suggestions: ['=', 'B4', '/', 'C4', '-', 'D4'],
      },
      {
        sheetId: 'jerarquia',
        title: 'Paso 9: Operador de Potencia',
        instruction:
          'En E5, eleva B5 (2) a la potencia de C5 (3) usando el símbolo circunflejo (^): =B5^C5.',
        targetCell: 'E5',
        acceptedFormulas: ['=B5^C5', '=POTENCIA(B5,C5)', '=POWER(B5,C5)'],
        resultValue: '8',
        pedagogicalHint:
          'El símbolo ^ eleva la base al exponente (2 al cubo = 8).',
        emergencySolution: '=B5^C5',
        suggestions: ['=', 'B5', '^', 'C5', '*'],
      },
      {
        sheetId: 'jerarquia',
        title: 'Paso 10: Gran Total de Resultados',
        instruction:
          'Por último en E6, suma los cuatro resultados obtenidos en E2:E5 con la función SUMA.',
        targetCell: 'E6',
        acceptedFormulas: ['=SUMA(E2:E5)', '=SUM(E2:E5)', '=E2+E3+E4+E5'],
        resultValue: '58',
        pedagogicalHint:
          'Totaliza la columna de resultados con SUMA abarcando E2 hasta E5.',
        emergencySolution: '=SUMA(E2:E5)',
        suggestions: ['=', 'SUMA(', 'E2:E5', ')', '+'],
      },
    ],
  },
};

const COURSE_TITLES_I18N: Record<string, Record<SupportedLocale, string>> = {
  COURSE_1: {
    es: 'Curso 1 · Operaciones y Negocios',
    en: 'Course 1 · Operations & Business',
    de: 'Kurs 1 · Operationen & Wirtschaft',
    fr: 'Cours 1 · Opérations et Affaires',
    ja: 'コース 1 · 業務とビジネス運用',
    pt: 'Curso 1 · Operações e Negócios',
  },
  COURSE_2: {
    es: 'Curso 2 · Lógica y Auditoría',
    en: 'Course 2 · Logic & Auditing',
    de: 'Kurs 2 · Logik & Prüfung',
    fr: 'Cours 2 · Logique et Audit',
    ja: 'コース 2 · 論理とデータ監査',
    pt: 'Curso 2 · Lógica e Auditoria',
  },
  COURSE_3: {
    es: 'Curso 3 · Búsqueda y Reparación',
    en: 'Course 3 · Lookup & Repair',
    de: 'Kurs 3 · Nachschlagen & Reparieren',
    fr: 'Cours 3 · Recherche et Réparation',
    ja: 'コース 3 · 検索とエラー修復',
    pt: 'Curso 3 · Busca e Reparo',
  },
};

const COURSE_SUBTITLES_I18N: Record<string, Record<SupportedLocale, string>> = {
  COURSE_1: {
    es: 'Domina sumas, promedios y control de presupuesto real',
    en: 'Master sums, averages, and real budget tracking',
    de: 'Meistere Summen, Durchschnitte und reale Budgetkontrolle',
    fr: 'Maîtrisez sommes, moyennes et suivi budgétaire réel',
    ja: '合計、平均、リアルな予算管理をマスター',
    pt: 'Domine somas, médias e controle de orçamento real',
  },
  COURSE_2: {
    es: 'Condicionales SI, conteo inteligente y referencias fijas $A$1',
    en: 'Conditional IF, smart counting, and absolute references $A$1',
    de: 'Bedingtes WENN, intelligentes Zählen und absolute Bezüge $A$1',
    fr: 'Conditions SI, comptage intelligent et références absolues $A$1',
    ja: 'IF条件式、条件付きカウント、絶対参照 $A$1',
    pt: 'Condicionais SE, contagem inteligente e referências fixas $A$1',
  },
  COURSE_3: {
    es: 'Cruza bases de datos con BUSCARV y repara errores #N/A',
    en: 'Cross-reference databases with VLOOKUP and repair #N/A errors',
    de: 'Verknüpfe Datenbanken mit SVERWEIS und behebe #NV-Fehler',
    fr: 'Croisez des bases de données avec RECHERCHEV et réparez les erreurs #N/A',
    ja: 'VLOOKUPでデータベースを照合し、#N/Aエラーを修復',
    pt: 'Cruze bases de dados com PROCV e repare erros #N/D',
  },
};

const MISSION_TITLES_I18N: Record<string, Record<SupportedLocale, string>> = {
  MISSION_BAKERY: {
    es: 'Panadería de Doña Rosa',
    en: "Doña Rosa's Bakery",
    de: 'Bäckerei von Doña Rosa',
    fr: 'Boulangerie de Doña Rosa',
    ja: 'ロサさんのベーカリー',
    pt: 'Padaria da Dona Rosa',
  },
  MISSION_BUDGET: {
    es: 'Presupuesto del mes',
    en: 'Monthly Budget',
    de: 'Monatsbudget',
    fr: 'Budget du Mois',
    ja: '今月の家計簿',
    pt: 'Orçamento do Mês',
  },
  MISSION_GRADES: {
    es: 'Calificaciones del curso',
    en: 'Course Grades',
    de: 'Kursnoten',
    fr: 'Notes du Cours',
    ja: 'コースの成績表',
    pt: 'Notas do Curso',
  },
  MISSION_INVENTORY: {
    es: 'Auditoría de Impuestos e IVA',
    en: 'Tax & VAT Audit',
    de: 'Steuer- und MwSt.-Prüfung',
    fr: 'Audit Taxes et TVA',
    ja: '税金と消費税の監査',
    pt: 'Auditoria de Impostos e IVA',
  },
  MISSION_LOOKUP: {
    es: 'Catálogo con BUSCARV',
    en: 'Catalog with VLOOKUP',
    de: 'Katalog mit SVERWEIS',
    fr: 'Catalogue avec RECHERCHEV',
    ja: 'VLOOKUP商品カタログ',
    pt: 'Catálogo com PROCV',
  },
};

const MISSION_CLIENTS_I18N: Record<string, Record<SupportedLocale, string>> = {
  MISSION_BAKERY: {
    es: 'Doña Rosa',
    en: 'Doña Rosa',
    de: 'Doña Rosa',
    fr: 'Doña Rosa',
    ja: 'ロサさん',
    pt: 'Dona Rosa',
  },
  MISSION_BUDGET: {
    es: 'Finanzas del Hogar',
    en: 'Household Finances',
    de: 'Haushaltsfinanzen',
    fr: 'Finances du Foyer',
    ja: '家庭の財務',
    pt: 'Finanças Domésticas',
  },
  MISSION_GRADES: {
    es: 'Colegio San Lucas',
    en: 'San Lucas School',
    de: 'San-Lucas-Schule',
    fr: 'École Saint-Luc',
    ja: 'サン・ルーカス校',
    pt: 'Colégio São Lucas',
  },
  MISSION_INVENTORY: {
    es: 'TecnoStore S.A.',
    en: 'TecnoStore Inc.',
    de: 'TecnoStore AG',
    fr: 'TecnoStore S.A.',
    ja: 'テクノストア株式会社',
    pt: 'TecnoStore S.A.',
  },
  MISSION_LOOKUP: {
    es: 'Logística Global',
    en: 'Global Logistics',
    de: 'Global Logistics',
    fr: 'Logistique Globale',
    ja: 'グローバル・ロジスティクス',
    pt: 'Logística Global',
  },
};

const MISSION_DESCRIPTIONS_I18N: Record<string, Record<SupportedLocale, string>> = {
  MISSION_BAKERY: {
    es: 'Doña Rosa lleva las cuentas de su panadería y necesita automatizar el cálculo de las ventas de conchas y bolillos de toda la semana, el promedio diario y el gran total general.',
    en: 'Doña Rosa runs her local bakery and needs to automate sales tracking for croissants and bread rolls all week, calculating the daily average and grand total.',
    de: 'Doña Rosa führt ihre Bäckerei und muss die wöchentlichen Backwarenverkäufe von Croissants und Brötchen, Tagesdurchschnitte und die Gesamtsumme berechnen.',
    fr: 'Doña Rosa gère sa boulangerie et doit automatiser le calcul des ventes hebdomadaires de croissants et baguettes, des moyennes journalières et du total général.',
    ja: 'ロサさんはパン屋の売り上げを自動計算し、1週間のクロワッサンとロールパンの販売数、日次平均、総合計を算出する必要があります。',
    pt: 'Dona Rosa administra sua padaria e precisa automatizar o cálculo das vendas semanais de pães doces e franceses, a média diária e o total geral.',
  },
  MISSION_BUDGET: {
    es: 'Organiza los ingresos y egresos familiares, calcula el saldo de ahorro neto restando los gastos e identifica si el mes cerró con superávit o déficit.',
    en: 'Organize family income and expenses, calculate net savings, and check whether the month closed with a surplus or deficit.',
    de: 'Erfasse Familieneinkünfte und -ausgaben, berechne Ersparnisse und prüfe Überschuss oder Defizit.',
    fr: "Organisez revenus et dépenses du foyer, calculez l'épargne nette et vérifiez si le mois s'est terminé par un excédent ou un déficit.",
    ja: '家族の収入と支出を整理し、支出を引いた純貯蓄残高を計算して黒字か赤字かを判定します。',
    pt: 'Organize receitas e despesas familiares, calcule o saldo líquido de poupança subtraindo gastos e verifique se o mês fechou com superávit ou déficit.',
  },
  MISSION_GRADES: {
    es: 'El profesor Martínez necesita determinar de forma automatizada qué estudiantes aprueban con nota mayor o igual a 70 puntos y contar cuántos alumnos aprobaron.',
    en: 'Teacher Martinez needs to automatically determine which students pass with a grade of 70 or higher and count how many students passed.',
    de: 'Lehrer Martinez möchte ermitteln, welche Schüler mit mindestens 70 Punkten bestehen, und die Anzahl der bestandenen Schüler zählen.',
    fr: 'Le professeur Martinez doit déterminer automatiquement les étudiants admis avec 70 points ou plus et compter le nombre de reçus.',
    ja: 'マルティネス先生は70点以上の合格者を自動判定し、合格者総数を集計する必要があります。',
    pt: 'O professor Martinez precisa determinar automaticamente quais alunos foram aprovados com nota igual ou superior a 70 e contar o total de aprovados.',
  },
  MISSION_INVENTORY: {
    es: 'Calcula el impuesto de múltiples productos anclando la celda de tasa de IVA con referencia absoluta ($B$5) y resuelve fórmulas con jerarquía de operadores.',
    en: 'Calculate tax on multiple products by anchoring the VAT rate cell with an absolute reference ($B$5) and solve formulas with operator precedence.',
    de: 'Berechne die Steuer für Produkte durch Fixierung der MwSt.-Zelle mit absolutem Bezug ($B$5) und beachte die Operator-Rangfolge.',
    fr: 'Calculez la taxe de plusieurs produits en figeant la cellule de TVA avec une référence absolue ($B$5) et respectez la priorité des opérateurs.',
    ja: '絶対参照 ($B$5) で消費税率セルを固定し、演算子の優先順位を考慮して複数商品の税額を計算します。',
    pt: 'Calcule o imposto de múltiplos produtos fixando a célula da alíquota de IVA com referência absoluta ($B$5) e respeite a ordem das operações.',
  },
  MISSION_LOOKUP: {
    es: 'El sistema de inventario arroja errores #N/A. Repara las fórmulas de búsqueda vertical, fija el rango de la matriz y blinda el reporte con SI.ERROR.',
    en: 'The inventory system throws #N/A errors. Fix vertical lookup formulas, lock the table array range, and safeguard reports with IFERROR.',
    de: 'Das Inventarsystem wirft #NV-Fehler aus. Repariere Verweisformeln, fixiere den Matrixbereich und sichere Berichte mit WENNFEHLER ab.',
    fr: "Le système d'inventaire affiche des erreurs #N/A. Réparez les formules de recherche verticale, figez la matrice et sécurisez avec SIERREUR.",
    ja: '在庫システムで#N/Aエラーが発生しています。垂直検索の数式を修正し、検索範囲を固定し、IFERRORで保護します。',
    pt: 'O sistema de estoque exibe erros #N/D. Corrija as fórmulas de busca vertical, trave o intervalo da matriz e proteja o relatório com SEERRO.',
  },
};

const MISSION_SKILLS_I18N: Record<string, Record<SupportedLocale, string>> = {
  MISSION_BAKERY: {
    es: 'SUMA · PROMEDIO · MAX',
    en: 'SUM · AVERAGE · MAX',
    de: 'SUMME · MITTELWERT · MAX',
    fr: 'SOMME · MOYENNE · MAX',
    ja: 'SUM · AVERAGE · MAX',
    pt: 'SOMA · MÉDIA · MÁXIMO',
  },
  MISSION_BUDGET: {
    es: 'Resta · SI · Balance',
    en: 'Subtraction · IF · Balance',
    de: 'Subtraktion · WENN · Saldo',
    fr: 'Soustraction · SI · Solde',
    ja: '引き算 · IF · 残高',
    pt: 'Subtração · SE · Saldo',
  },
  MISSION_GRADES: {
    es: 'SI · CONTAR.SI · PROMEDIO',
    en: 'IF · COUNTIF · AVERAGE',
    de: 'WENN · ZÄHLENWENN · MITTELWERT',
    fr: 'SI · NB.SI · MOYENNE',
    ja: 'IF · COUNTIF · AVERAGE',
    pt: 'SE · CONT.SE · MÉDIA',
  },
  MISSION_INVENTORY: {
    es: '$A$1 · Jerarquía · SUMA',
    en: '$A$1 · Precedence · SUM',
    de: '$A$1 · Rangfolge · SUMME',
    fr: '$A$1 · Priorité · SOMME',
    ja: '$A$1 · 演算優先度 · SUM',
    pt: '$A$1 · Precedência · SOMA',
  },
  MISSION_LOOKUP: {
    es: 'BUSCARV · SI.ERROR · #N/A',
    en: 'VLOOKUP · IFERROR · #N/A',
    de: 'SVERWEIS · WENNFEHLER · #NV',
    fr: 'RECHERCHEV · SIERREUR · #N/A',
    ja: 'VLOOKUP · IFERROR · #N/A',
    pt: 'PROCV · SEERRO · #N/D',
  },
};

export function getPracticeCourses(locale: SupportedLocale = 'es'): PracticeCourseData[] {
  return PRACTICE_COURSES.map((course) => ({
    ...course,
    title: COURSE_TITLES_I18N[course.id]?.[locale] || course.title,
    subtitle: COURSE_SUBTITLES_I18N[course.id]?.[locale] || course.subtitle,
    prerequisiteCourseTitle: course.prerequisiteCourseId
      ? COURSE_TITLES_I18N[course.prerequisiteCourseId]?.[locale] || course.prerequisiteCourseTitle
      : course.prerequisiteCourseTitle,
    missions: course.missions.map((m) => ({
      ...m,
      title: MISSION_TITLES_I18N[m.ref]?.[locale] || m.title,
      client: MISSION_CLIENTS_I18N[m.ref]?.[locale] || m.client,
      description: MISSION_DESCRIPTIONS_I18N[m.ref]?.[locale] || m.description,
      skills: MISSION_SKILLS_I18N[m.ref]?.[locale] || m.skills,
      prerequisiteTitle: m.prerequisiteRef
        ? MISSION_TITLES_I18N[m.prerequisiteRef]?.[locale] || m.prerequisiteTitle
        : m.prerequisiteTitle,
    })),
  }));
}

function buildBakeryExercise(locale: SupportedLocale): StepByStepExerciseData {
  if (locale === 'es') {
    return STEP_BY_STEP_EXERCISES.MISSION_BAKERY;
  }

  const item1 = locale === 'pt' ? 'Pães doces' : locale === 'ja' ? 'クロワッサン' : 'Croissants';
  const item2 =
    locale === 'pt'
      ? 'Pães franceses'
      : locale === 'fr'
      ? 'Baguettes'
      : locale === 'de'
      ? 'Brötchen'
      : locale === 'ja'
      ? 'ロールパン'
      : 'Bread rolls';
  const item3 =
    locale === 'pt'
      ? 'Baguetes'
      : locale === 'fr'
      ? 'Pains aux raisins'
      : locale === 'ja'
      ? 'バゲット'
      : 'Baguettes';
  const item4 =
    locale === 'pt'
      ? 'Rosquinhas'
      : locale === 'fr'
      ? 'Beignets'
      : locale === 'ja'
      ? 'ドーナツ'
      : 'Donuts';

  const breadHeader =
    locale === 'pt'
      ? 'Pão'
      : locale === 'fr'
      ? 'Pain'
      : locale === 'de'
      ? 'Brot'
      : locale === 'ja'
      ? 'パン'
      : 'Bread';
  const d1 = locale === 'pt' ? 'Seg' : locale === 'fr' ? 'Lun' : locale === 'de' ? 'Mo' : locale === 'ja' ? '月' : 'Mon';
  const d2 = locale === 'pt' ? 'Ter' : locale === 'fr' ? 'Mar' : locale === 'de' ? 'Di' : locale === 'ja' ? '火' : 'Tue';
  const d3 = locale === 'pt' ? 'Qua' : locale === 'fr' ? 'Mer' : locale === 'de' ? 'Mi' : locale === 'ja' ? '水' : 'Wed';
  const d4 = locale === 'pt' ? 'Qui' : locale === 'fr' ? 'Jeu' : locale === 'de' ? 'Do' : locale === 'ja' ? '木' : 'Thu';
  const d5 = locale === 'pt' ? 'Sex' : locale === 'fr' ? 'Ven' : locale === 'de' ? 'Fr' : locale === 'ja' ? '金' : 'Fri';
  const totalH = locale === 'de' ? 'Gesamt' : locale === 'ja' ? '合計' : 'Total';
  const avgH =
    locale === 'pt'
      ? 'Média'
      : locale === 'fr'
      ? 'Moyenne'
      : locale === 'de'
      ? 'Durchschnitt'
      : locale === 'ja'
      ? '平均'
      : 'Average';

  const sheet1Name =
    locale === 'pt'
      ? 'Vendas'
      : locale === 'fr'
      ? 'Ventes'
      : locale === 'de'
      ? 'Verkäufe'
      : locale === 'ja'
      ? '売上'
      : 'Sales';
  const sheet2Name =
    locale === 'pt'
      ? 'Custos e Receitas'
      : locale === 'fr'
      ? 'Coûts et Revenus'
      : locale === 'de'
      ? 'Kosten & Erlöse'
      : locale === 'ja'
      ? 'コストと収益'
      : 'Costs & Revenue';
  const sheet3Name =
    locale === 'pt'
      ? 'Relatório Executivo'
      : locale === 'fr'
      ? 'Rapport Exécutif'
      : locale === 'de'
      ? 'Bericht'
      : locale === 'ja'
      ? 'エグゼクティブレポート'
      : 'Executive Report';

  const soldH = locale === 'pt' ? 'Vendido' : locale === 'fr' ? 'Vendu' : locale === 'de' ? 'Verkauft' : locale === 'ja' ? '販売数' : 'Sold';
  const priceH = locale === 'pt' ? 'Preço' : locale === 'fr' ? 'Prix' : locale === 'de' ? 'Preis' : locale === 'ja' ? '単価' : 'Price';
  const revH = locale === 'pt' ? 'Receita' : locale === 'fr' ? 'Revenu' : locale === 'de' ? 'Erlös' : locale === 'ja' ? '売上額' : 'Revenue';
  const uCostH = locale === 'pt' ? 'Custo U.' : locale === 'fr' ? 'Coût U.' : locale === 'de' ? 'Stückkosten' : locale === 'ja' ? '原価' : 'Unit Cost';
  const tCostH = locale === 'pt' ? 'Custo Total' : locale === 'fr' ? 'Coût Total' : locale === 'de' ? 'Gesamtkosten' : locale === 'ja' ? '総原価' : 'Total Cost';
  const profH = locale === 'pt' ? 'Lucro' : locale === 'fr' ? 'Profit' : locale === 'de' ? 'Gewinn' : locale === 'ja' ? '粗利益' : 'Profit';

  const kpiH = locale === 'pt' ? 'Métrica' : locale === 'fr' ? 'Métrique' : locale === 'de' ? 'Kennzahl' : locale === 'ja' ? '指標' : 'KPI';
  const valH = locale === 'pt' ? 'Valor' : locale === 'fr' ? 'Valeur' : locale === 'de' ? 'Wert' : locale === 'ja' ? '値' : 'Value';
  const kpi1 =
    locale === 'pt'
      ? 'Total de Pães Vendidos'
      : locale === 'fr'
      ? 'Total Produits Vendus'
      : locale === 'de'
      ? 'Gesamtverkäufe'
      : locale === 'ja'
      ? '総販売数'
      : 'Total Items Sold';
  const kpi2 =
    locale === 'pt'
      ? 'Venda do Produto Estrela'
      : locale === 'fr'
      ? 'Vente Produit Phare'
      : locale === 'de'
      ? 'Bestseller-Verkauf'
      : locale === 'ja'
      ? 'トップ商品売上'
      : 'Top Seller Sales';
  const kpi3 = locale === 'pt' ? 'Meta' : locale === 'fr' ? 'Objectif' : locale === 'de' ? 'Ziel' : locale === 'ja' ? '目標' : 'Target';
  const kpi4 = locale === 'pt' ? 'Status da Meta' : locale === 'fr' ? 'Statut Objectif' : locale === 'de' ? 'Status' : locale === 'ja' ? '判定' : 'Goal Status';

  const sumName = locale === 'pt' ? 'SOMA' : locale === 'fr' ? 'SOMME' : locale === 'de' ? 'SUMME' : 'SUM';
  const avgName = locale === 'pt' ? 'MÉDIA' : locale === 'fr' ? 'MOYENNE' : locale === 'de' ? 'MITTELWERT' : 'AVERAGE';
  const ifName = locale === 'pt' ? 'SE' : locale === 'de' ? 'WENN' : locale === 'fr' ? 'SI' : 'IF';

  const goalMet =
    locale === 'pt'
      ? 'Meta Cumprida'
      : locale === 'fr'
      ? 'Objectif Atteint'
      : locale === 'de'
      ? 'Ziel Erreicht'
      : locale === 'ja'
      ? '目標達成'
      : 'Goal Met';
  const inProgress =
    locale === 'pt'
      ? 'Em Progresso'
      : locale === 'fr'
      ? 'En Cours'
      : locale === 'de'
      ? 'In Bearbeitung'
      : locale === 'ja'
      ? '進行中'
      : 'In Progress';

  return {
    id: 'MISSION_BAKERY',
    title: MISSION_TITLES_I18N.MISSION_BAKERY[locale],
    subtitle:
      locale === 'pt'
        ? 'Vendas, Custos e Balanço'
        : locale === 'fr'
        ? 'Ventes, Coûts et Bilan'
        : locale === 'de'
        ? 'Verkäufe, Kosten und Bilanz'
        : locale === 'ja'
        ? '売上・コスト・収支決算'
        : 'Sales, Costs and Balance',
    scenario: MISSION_DESCRIPTIONS_I18N.MISSION_BAKERY[locale],
    badgeEmoji: '🥐',
    color: '#FF8A3D',
    earnedXp: 35,
    earnedBytes: 25,
    sheets: [
      {
        id: 'ventas',
        name: sheet1Name,
        columns: 8,
        rows: 6,
        initialData: {
          A1: breadHeader,
          B1: d1,
          C1: d2,
          D1: d3,
          E1: d4,
          F1: d5,
          G1: totalH,
          H1: avgH,
          A2: item1,
          B2: '40',
          C2: '45',
          D2: '50',
          E2: '55',
          F2: '60',
          A3: item2,
          B3: '100',
          C3: '110',
          D3: '105',
          E3: '120',
          F3: '130',
          A4: item3,
          B4: '20',
          C4: '25',
          D4: '30',
          E4: '25',
          F4: '35',
          A5: item4,
          B5: '50',
          C5: '60',
          D5: '55',
          E5: '70',
          F5: '65',
        },
      },
      {
        id: 'costos',
        name: sheet2Name,
        columns: 7,
        rows: 6,
        initialData: {
          A1: breadHeader,
          B1: soldH,
          C1: priceH,
          D1: revH,
          E1: uCostH,
          F1: tCostH,
          G1: profH,
          A2: item1,
          B2: '250',
          C2: '12',
          E2: '6',
          A3: item2,
          B3: '565',
          C3: '5',
          E3: '2',
          A4: item3,
          B4: '135',
          C4: '18',
          E4: '8',
          A5: item4,
          B5: '300',
          C5: '8',
          E5: '3',
        },
      },
      {
        id: 'reporte',
        name: sheet3Name,
        columns: 6,
        rows: 7,
        initialData: {
          A1: kpiH,
          B1: valH,
          A2: kpi1,
          A3: kpi2,
          A4: kpi3,
          B4: '1000',
          A5: kpi4,
        },
      },
    ],
    steps: [
      {
        sheetId: 'ventas',
        title:
          locale === 'pt'
            ? `Passo 1: Total semanal de ${item1}`
            : locale === 'fr'
            ? `Étape 1 : Total hebdomadaire de ${item1}`
            : locale === 'de'
            ? `Schritt 1: Wöchentliche ${item1}-Gesamtsumme`
            : locale === 'ja'
            ? `ステップ 1: ${item1}の1週間合計`
            : `Step 1: Weekly total for ${item1}`,
        instruction:
          locale === 'pt'
            ? `Na aba ${sheet1Name}, calcule em G2 a soma de ${item1} vendidos de segunda a sexta (B2:F2) usando ${sumName}.`
            : locale === 'fr'
            ? `Dans l'onglet ${sheet1Name}, calcule en G2 la somme des ${item1} vendus du lundi au vendredi (B2:F2) avec ${sumName}.`
            : locale === 'de'
            ? `Berechne in Zelle G2 des Blattes ${sheet1Name} die Summe der verkauften ${item1} (B2:F2) mit ${sumName}.`
            : locale === 'ja'
            ? `${sheet1Name}シートのG2セルで、${sumName}関数を使って月曜から金曜の${item1}販売数（B2:F2）を合計してください。`
            : `On the ${sheet1Name} sheet, calculate in G2 the sum of ${item1} sold from Monday to Friday (B2:F2) using ${sumName}.`,
        targetCell: 'G2',
        acceptedFormulas: [
          `=${sumName}(B2:F2)`,
          '=SUM(B2:F2)',
          '=SUMA(B2:F2)',
          `=${sumName}(B2,C2,D2,E2,F2)`,
          '=SUM(B2,C2,D2,E2,F2)',
        ],
        resultValue: '250',
        pedagogicalHint: `=${sumName}(B2:F2)`,
        emergencySolution: `=${sumName}(B2:F2)`,
        suggestions: ['=', `${sumName}(`, 'B2:F2', ')', `${avgName}(`, '+'],
      },
      {
        sheetId: 'ventas',
        title:
          locale === 'pt'
            ? `Passo 2: Total semanal de ${item2}`
            : locale === 'fr'
            ? `Étape 2 : Total hebdomadaire de ${item2}`
            : locale === 'de'
            ? `Schritt 2: Wöchentliche ${item2}-Gesamtsumme`
            : locale === 'ja'
            ? `ステップ 2: ${item2}の1週間合計`
            : `Step 2: Weekly total for ${item2}`,
        instruction:
          locale === 'pt'
            ? `Em G3, calcule o total semanal de ${item2} somando o intervalo B3:F3.`
            : locale === 'fr'
            ? `En G3, calcule le total hebdomadaire de ${item2} en additionnant la plage B3:F3.`
            : locale === 'de'
            ? `Berechne in G3 die Summe der verkauften ${item2} über den Bereich B3:F3.`
            : locale === 'ja'
            ? `G3で、範囲B3:F3を合算して${item2}の週間販売数を計算してください。`
            : `In G3, calculate the weekly total of ${item2} sold by summing the range B3:F3.`,
        targetCell: 'G3',
        acceptedFormulas: [`=${sumName}(B3:F3)`, '=SUM(B3:F3)', '=SUMA(B3:F3)'],
        resultValue: '565',
        pedagogicalHint: `=${sumName}(B3:F3)`,
        emergencySolution: `=${sumName}(B3:F3)`,
        suggestions: ['=', `${sumName}(`, 'B3:F3', ')', '+', '-'],
      },
      {
        sheetId: 'ventas',
        title:
          locale === 'pt'
            ? `Passo 3: Total semanal de ${item3}`
            : locale === 'fr'
            ? `Étape 3 : Total hebdomadaire de ${item3}`
            : locale === 'de'
            ? `Schritt 3: Wöchentliche ${item3}-Gesamtsumme`
            : locale === 'ja'
            ? `ステップ 3: ${item3}の1週間合計`
            : `Step 3: Weekly total for ${item3}`,
        instruction:
          locale === 'pt'
            ? `Em G4, calcule a soma das vendas de ${item3} de segunda a sexta (B4:F4).`
            : locale === 'fr'
            ? `En G4, calcule la somme des ventes de ${item3} de lundi à vendredi (B4:F4).`
            : locale === 'de'
            ? `Berechne in G4 die Summe der Verkäufe von ${item3} (B4:F4).`
            : locale === 'ja'
            ? `G4で、月曜から金曜の${item3}売上（B4:F4）を合計してください。`
            : `In G4, calculate the sum of ${item3} sales from Monday to Friday (B4:F4).`,
        targetCell: 'G4',
        acceptedFormulas: [`=${sumName}(B4:F4)`, '=SUM(B4:F4)', '=SUMA(B4:F4)'],
        resultValue: '135',
        pedagogicalHint: `=${sumName}(B4:F4)`,
        emergencySolution: `=${sumName}(B4:F4)`,
        suggestions: ['=', `${sumName}(`, 'B4:F4', ')', '+'],
      },
      {
        sheetId: 'ventas',
        title:
          locale === 'pt'
            ? `Passo 4: Média diária de ${item4}`
            : locale === 'fr'
            ? `Étape 4 : Moyenne journalière de ${item4}`
            : locale === 'de'
            ? `Schritt 4: Tagesdurchschnitt von ${item4}`
            : locale === 'ja'
            ? `ステップ 4: ${item4}の日次平均`
            : `Step 4: Daily average for ${item4}`,
        instruction:
          locale === 'pt'
            ? `Em H5, calcule a média diária de vendas de ${item4} usando ${avgName}.`
            : locale === 'fr'
            ? `En H5, obtiens la moyenne journalière de ventes de ${item4} avec ${avgName}.`
            : locale === 'de'
            ? `Ermittle in H5 den Tagesdurchschnitt der verkauften ${item4} mit ${avgName}.`
            : locale === 'ja'
            ? `H5で、${avgName}関数を使って${item4}の日次平均売上を算出してください。`
            : `In H5, find the daily average sales of ${item4} using the ${avgName} function.`,
        targetCell: 'H5',
        acceptedFormulas: [
          `=${avgName}(B5:F5)`,
          '=AVERAGE(B5:F5)',
          '=PROMEDIO(B5:F5)',
          '=MÉDIA(B5:F5)',
        ],
        resultValue: '60',
        pedagogicalHint: `=${avgName}(B5:F5)`,
        emergencySolution: `=${avgName}(B5:F5)`,
        suggestions: ['=', `${avgName}(`, 'B5:F5', ')', `${sumName}(`, '/'],
      },
      {
        sheetId: 'costos',
        title:
          locale === 'pt'
            ? `Passo 5: Receita bruta de ${item1}`
            : locale === 'fr'
            ? `Étape 5 : Revenu brut de ${item1}`
            : locale === 'de'
            ? `Schritt 5: Bruttoerlös für ${item1}`
            : locale === 'ja'
            ? `ステップ 5: ${item1}の総売上`
            : `Step 5: Gross revenue for ${item1}`,
        instruction:
          locale === 'pt'
            ? `Acesse a aba ${sheet2Name}! Em D2, calcule a receita multiplicando unidades vendidas (B2) pelo preço (C2).`
            : locale === 'fr'
            ? `Passe à l'onglet ${sheet2Name} ! En D2, calcule le revenu en multipliant les unités vendues (B2) par le prix (C2).`
            : locale === 'de'
            ? `Wechsle zum Blatt ${sheet2Name}! Berechne in D2 den Erlös durch Multiplikation von Verkaufsmenge (B2) und Preis (C2).`
            : locale === 'ja'
            ? `${sheet2Name}シートに移動！D2で、販売数（B2）に単価（C2）を掛けて売上額を計算してください。`
            : `Switch to ${sheet2Name}! In D2, calculate revenue by multiplying units sold (B2) by unit price (C2).`,
        targetCell: 'D2',
        acceptedFormulas: ['=B2*C2', '=C2*B2'],
        resultValue: '3000',
        pedagogicalHint: '=B2*C2',
        emergencySolution: '=B2*C2',
        suggestions: ['=', 'B2', '*', 'C2', 'E2', '+', '-'],
      },
      {
        sheetId: 'costos',
        title:
          locale === 'pt'
            ? `Passo 6: Receita bruta de ${item2}`
            : locale === 'fr'
            ? `Étape 6 : Revenu brut de ${item2}`
            : locale === 'de'
            ? `Schritt 6: Bruttoerlös für ${item2}`
            : locale === 'ja'
            ? `ステップ 6: ${item2}の総売上`
            : `Step 6: Gross revenue for ${item2}`,
        instruction:
          locale === 'pt'
            ? `Em D3, calcule a receita total de ${item2} multiplicando B3 por C3.`
            : locale === 'fr'
            ? `En D3, calcule le revenu total de ${item2} en multipliant B3 par C3.`
            : locale === 'de'
            ? `Berechne in D3 den Gesamterlös für ${item2} durch B3*C3.`
            : locale === 'ja'
            ? `D3で、B3とC3を掛けて${item2}の総売上を計算してください。`
            : `In D3, calculate total revenue for ${item2} by multiplying B3 by C3.`,
        targetCell: 'D3',
        acceptedFormulas: ['=B3*C3', '=C3*B3'],
        resultValue: '2825',
        pedagogicalHint: '=B3*C3',
        emergencySolution: '=B3*C3',
        suggestions: ['=', 'B3', '*', 'C3', 'E3', '+', '/'],
      },
      {
        sheetId: 'costos',
        title:
          locale === 'pt'
            ? `Passo 7: Custo total de ${item2}`
            : locale === 'fr'
            ? `Étape 7 : Coût total pour ${item2}`
            : locale === 'de'
            ? `Schritt 7: Gesamtkosten für ${item2}`
            : locale === 'ja'
            ? `ステップ 7: ${item2}の総原価`
            : `Step 7: Production cost for ${item2}`,
        instruction:
          locale === 'pt'
            ? `Em F3, calcule o custo total de ${item2} multiplicando unidades (B3) pelo custo unitário (E3).`
            : locale === 'fr'
            ? `En F3, calcule le coût total pour ${item2} en multipliant les unités (B3) par le coût unitaire (E3).`
            : locale === 'de'
            ? `Berechne in F3 die Gesamtkosten für ${item2} durch Multiplikation von Menge (B3) mit Stückkosten (E3).`
            : locale === 'ja'
            ? `F3で、販売数（B3）に原価（E3）を掛けて${item2}の総原価を計算してください。`
            : `In F3, calculate total cost for ${item2} by multiplying units sold (B3) by unit cost (E3).`,
        targetCell: 'F3',
        acceptedFormulas: ['=B3*E3', '=E3*B3'],
        resultValue: '1130',
        pedagogicalHint: '=B3*E3',
        emergencySolution: '=B3*E3',
        suggestions: ['=', 'B3', '*', 'E3', 'C3', '+', '-'],
      },
      {
        sheetId: 'costos',
        title:
          locale === 'pt'
            ? `Passo 8: Lucro líquido de ${item2}`
            : locale === 'fr'
            ? `Étape 8 : Bénéfice net pour ${item2}`
            : locale === 'de'
            ? `Schritt 8: Reingewinn für ${item2}`
            : locale === 'ja'
            ? `ステップ 8: ${item2}の純利益`
            : `Step 8: Net profit for ${item2}`,
        instruction:
          locale === 'pt'
            ? 'Em G3, calcule o lucro líquido subtraindo o custo total (F3) da receita total (D3).'
            : locale === 'fr'
            ? 'En G3, calcule le bénéfice net en soustrayant le coût total (F3) du revenu total (D3).'
            : locale === 'de'
            ? 'Berechne in G3 den Reingewinn: Erlös (D3) minus Gesamtkosten (F3).'
            : locale === 'ja'
            ? 'G3で、総売上（D3）から総原価（F3）を引いて純利益を計算してください。'
            : 'In G3, calculate net profit by subtracting total cost (F3) from total revenue (D3).',
        targetCell: 'G3',
        acceptedFormulas: ['=D3-F3'],
        resultValue: '1695',
        pedagogicalHint: '=D3-F3',
        emergencySolution: '=D3-F3',
        suggestions: ['=', 'D3', '-', 'F3', 'B3', '+', '*'],
      },
      {
        sheetId: 'reporte',
        title:
          locale === 'pt'
            ? 'Passo 9: Total Geral de Pães Vendidos'
            : locale === 'fr'
            ? 'Étape 9 : Grand Total de Produits Vendus'
            : locale === 'de'
            ? 'Schritt 9: Gesamtzahl aller Backwaren'
            : locale === 'ja'
            ? 'ステップ 9: 全商品の総合計販売数'
            : 'Step 9: Grand Total of Items Sold',
        instruction:
          locale === 'pt'
            ? `Passe para a aba ${sheet3Name}. Em B2, some as vendas totais dos 4 produtos: 250, 565, 135 e 300.`
            : locale === 'fr'
            ? `Passe à l'onglet ${sheet3Name}. En B2, additionne les ventes des 4 produits : 250, 565, 135 et 300.`
            : locale === 'de'
            ? `Wechsle zu ${sheet3Name}. Addiere in B2 die Verkäufe aller 4 Produkte: 250, 565, 135 und 300.`
            : locale === 'ja'
            ? `${sheet3Name}シートに移動。B2で、4種類の商品の総販売数（250, 565, 135, 300）を合算してください。`
            : `Switch to the ${sheet3Name} sheet. In B2, sum the sales of all 4 products: 250, 565, 135, and 300.`,
        targetCell: 'B2',
        acceptedFormulas: [
          `=${sumName}(250,565,135,300)`,
          '=SUM(250,565,135,300)',
          '=SUMA(250,565,135,300)',
          '=250+565+135+300',
        ],
        resultValue: '1250',
        pedagogicalHint: `=${sumName}(250,565,135,300)`,
        emergencySolution: `=${sumName}(250,565,135,300)`,
        suggestions: ['=', `${sumName}(`, '250', ',', '565', ',', '135', ',', '300', ')', '+'],
      },
      {
        sheetId: 'reporte',
        title:
          locale === 'pt'
            ? 'Passo 10: Venda do Produto Estrela'
            : locale === 'fr'
            ? 'Étape 10 : Vente du Produit Phare'
            : locale === 'de'
            ? 'Schritt 10: Bestseller-Höchstwert'
            : locale === 'ja'
            ? 'ステップ 10: トップ商品の最高販売数'
            : 'Step 10: Top Seller Sales with MAX',
        instruction:
          locale === 'pt'
            ? 'Em B3, identifique a maior quantidade vendida entre os 4 produtos usando MAX (250, 565, 135, 300).'
            : locale === 'fr'
            ? 'En B3, trouve la plus grande quantité vendue parmi les 4 produits avec MAX (250, 565, 135, 300).'
            : locale === 'de'
            ? 'Ermittle in B3 den Maximalwert der 4 Produkte mit MAX (250, 565, 135, 300).'
            : locale === 'ja'
            ? 'B3で、MAX関数を使って4商品の中の最大販売数を算出してください（250, 565, 135, 300）。'
            : 'In B3, find the highest quantity sold among the 4 items using MAX (250, 565, 135, 300).',
        targetCell: 'B3',
        acceptedFormulas: ['=MAX(250,565,135,300)'],
        resultValue: '565',
        pedagogicalHint: '=MAX(250,565,135,300)',
        emergencySolution: '=MAX(250,565,135,300)',
        suggestions: ['=', 'MAX(', '250', ',', '565', ',', '135', ',', '300', ')', 'MIN('],
      },
      {
        sheetId: 'reporte',
        title:
          locale === 'pt'
            ? `Passo 11: Avaliação de Meta com ${ifName}`
            : locale === 'fr'
            ? 'Étape 11 : Évaluation avec SI'
            : locale === 'de'
            ? `Schritt 11: Zielstatus mit ${ifName}`
            : locale === 'ja'
            ? 'ステップ 11: IF関数による目標判定'
            : 'Step 11: Goal Diagnosis with IF',
        instruction:
          locale === 'pt'
            ? `Em D5, escreva a condição: se B2 >= 1000 retorne "${goalMet}", caso contrário "${inProgress}".`
            : locale === 'fr'
            ? `En D5, écris la condition : si B2 >= 1000 renvoie "${goalMet}", sinon "${inProgress}".`
            : locale === 'de'
            ? `Schreibe in D5 die Formel: wenn B2 >= 1000 gib "${goalMet}" aus, sonst "${inProgress}".`
            : locale === 'ja'
            ? `D5で、条件式を作成：B2が1000以上なら「${goalMet}」、未満なら「${inProgress}」を返してください。`
            : `In D5, write the conditional formula: if B2 >= 1000, return "${goalMet}", otherwise "${inProgress}".`,
        targetCell: 'D5',
        acceptedFormulas: [
          `=${ifName}(B2>=1000,"${goalMet}","${inProgress}")`,
          `=${ifName}(B2>=1000,${goalMet},${inProgress})`,
          '=IF(B2>=1000,"Goal Met","In Progress")',
          '=SI(B2>=1000,"Meta Cumplida","En Progreso")',
        ],
        resultValue: goalMet,
        pedagogicalHint: `=${ifName}(B2>=1000,"${goalMet}","${inProgress}")`,
        emergencySolution: `=${ifName}(B2>=1000,"${goalMet}","${inProgress}")`,
        suggestions: ['=', `${ifName}(`, 'B2>=1000', `,"${goalMet}"`, `,"${inProgress}"`, ')'],
      },
    ],
  };
}

function localizeFormulaText(text: string, locale: SupportedLocale): string {
  if (locale === 'es') return text;
  const fnMap: Record<SupportedLocale, Record<string, string>> = {
    es: {},
    en: {
      'SUMA(': 'SUM(',
      'PROMEDIO(': 'AVERAGE(',
      'SI.ERROR(': 'IFERROR(',
      'CONTAR.SI(': 'COUNTIF(',
      'BUSCARV(': 'VLOOKUP(',
      'SI(': 'IF(',
      'POTENCIA(': 'POWER(',
      'SUMA': 'SUM',
      'PROMEDIO': 'AVERAGE',
      'SI.ERROR': 'IFERROR',
      'CONTAR.SI': 'COUNTIF',
      'BUSCARV': 'VLOOKUP',
    },
    de: {
      'SUMA(': 'SUMME(',
      'PROMEDIO(': 'MITTELWERT(',
      'SI.ERROR(': 'WENNFEHLER(',
      'CONTAR.SI(': 'ZÄHLENWENN(',
      'BUSCARV(': 'SVERWEIS(',
      'SI(': 'WENN(',
      'POTENCIA(': 'POTENZ(',
      'SUMA': 'SUMME',
      'PROMEDIO': 'MITTELWERT',
      'SI.ERROR': 'WENNFEHLER',
      'CONTAR.SI': 'ZÄHLENWENN',
      'BUSCARV': 'SVERWEIS',
    },
    fr: {
      'SUMA(': 'SOMME(',
      'PROMEDIO(': 'MOYENNE(',
      'SI.ERROR(': 'SIERREUR(',
      'CONTAR.SI(': 'NB.SI(',
      'BUSCARV(': 'RECHERCHEV(',
      'POTENCIA(': 'PUISSANCE(',
      'SUMA': 'SOMME',
      'PROMEDIO': 'MOYENNE',
      'SI.ERROR': 'SIERREUR',
      'CONTAR.SI': 'NB.SI',
      'BUSCARV': 'RECHERCHEV',
    },
    pt: {
      'SUMA(': 'SOMA(',
      'PROMEDIO(': 'MÉDIA(',
      'SI.ERROR(': 'SEERRO(',
      'CONTAR.SI(': 'CONT.SE(',
      'BUSCARV(': 'PROCV(',
      'SI(': 'SE(',
      'POTENCIA(': 'POTÊNCIA(',
      'SUMA': 'SOMA',
      'PROMEDIO': 'MÉDIA',
      'SI.ERROR': 'SEERRO',
      'CONTAR.SI': 'CONT.SE',
      'BUSCARV': 'PROCV',
    },
    ja: {
      'SUMA(': 'SUM(',
      'PROMEDIO(': 'AVERAGE(',
      'SI.ERROR(': 'IFERROR(',
      'CONTAR.SI(': 'COUNTIF(',
      'BUSCARV(': 'VLOOKUP(',
      'SI(': 'IF(',
      'POTENCIA(': 'POWER(',
      'SUMA': 'SUM',
      'PROMEDIO': 'AVERAGE',
      'SI.ERROR': 'IFERROR',
      'CONTAR.SI': 'COUNTIF',
      'BUSCARV': 'VLOOKUP',
    },
  };
  let out = text;
  for (const [k, v] of Object.entries(fnMap[locale] || {})) {
    out = out.split(k).join(v);
  }
  const stepPrefix: Record<SupportedLocale, string> = {
    es: 'Paso ',
    en: 'Step ',
    de: 'Schritt ',
    fr: 'Étape ',
    ja: 'ステップ ',
    pt: 'Passo ',
  };
  if (out.startsWith('Paso ')) {
    out = stepPrefix[locale] + out.slice(5);
  }
  return out;
}

function localizeWorkbookExercise(
  base: StepByStepExerciseData,
  locale: SupportedLocale
): StepByStepExerciseData {
  if (locale === 'es') return base;
  return {
    ...base,
    title: MISSION_TITLES_I18N[base.id]?.[locale] || localizeFormulaText(base.title, locale),
    subtitle: localizeFormulaText(base.subtitle, locale),
    scenario:
      MISSION_DESCRIPTIONS_I18N[base.id]?.[locale] || localizeFormulaText(base.scenario, locale),
    steps: base.steps.map((step) => ({
      ...step,
      title: localizeFormulaText(step.title, locale),
      instruction: localizeFormulaText(step.instruction, locale),
      pedagogicalHint: localizeFormulaText(step.pedagogicalHint, locale),
      emergencySolution: localizeFormulaText(step.emergencySolution, locale),
      suggestions: step.suggestions.map((s) => localizeFormulaText(s, locale)),
    })),
  };
}

export function getStepByStepExercise(
  ref: string,
  locale: SupportedLocale = 'es'
): StepByStepExerciseData {
  const upper = ref.toUpperCase();
  if (upper === 'MISSION_BAKERY') {
    return buildBakeryExercise(locale);
  }

  if (upper === 'MISSION_INVENTORY') {
    const base = localizeWorkbookExercise(STEP_BY_STEP_EXERCISES.WEAK_POINTS, locale);
    return {
      ...base,
      id: 'MISSION_INVENTORY',
      title: MISSION_TITLES_I18N.MISSION_INVENTORY[locale],
      subtitle: {
        es: 'Referencias Absolutas $A$1 y Jerarquía',
        en: 'Absolute References $A$1 & Order of Operations',
        de: 'Absolute Bezüge $A$1 & Operator-Rangfolge',
        fr: 'Références Absolues $A$1 et Priorité des Opérateurs',
        ja: '絶対参照 $A$1 と演算子の優先順位',
        pt: 'Referências Absolutas $A$1 e Ordem de Operações',
      }[locale],
      scenario: MISSION_DESCRIPTIONS_I18N.MISSION_INVENTORY[locale],
      earnedXp: 50,
      earnedBytes: 35,
      badgeEmoji: '📦',
      color: '#FFC53D',
    };
  }

  if (upper === 'MISSION_LOOKUP') {
    const base = localizeWorkbookExercise(STEP_BY_STEP_EXERCISES.DAILY, locale);
    return {
      ...base,
      id: 'MISSION_LOOKUP',
      title: MISSION_TITLES_I18N.MISSION_LOOKUP[locale],
      subtitle: {
        es: 'Búsqueda Vertical y Manejo de #N/A',
        en: 'Vertical Lookup & Handling #N/A',
        de: 'SVERWEIS & #NV-Fehlerbehandlung',
        fr: 'Recherche Verticale et Gestion #N/A',
        ja: 'VLOOKUP検索と#N/Aエラー対策',
        pt: 'Busca Vertical e Tratamento de #N/D',
      }[locale],
      scenario: MISSION_DESCRIPTIONS_I18N.MISSION_LOOKUP[locale],
      earnedXp: 60,
      earnedBytes: 45,
      badgeEmoji: '🛠️',
      color: '#B18CFF',
    };
  }

  const found = STEP_BY_STEP_EXERCISES[upper] || STEP_BY_STEP_EXERCISES.MISSION_BAKERY;
  return localizeWorkbookExercise(found, locale);
}
