# CookVerse: Plataforma Gamificada de Aprendizaje Culinario
> **Documento de Diseño de Proyecto (GDD & Arquitectura Técnica)**  
> Inspirado en el motor y la experiencia de usuario de **Gridverse**.

---

## 1. Visión General del Proyecto

**CookVerse** es una plataforma web progresiva (PWA) interactiva y gamificada que enseña el arte y la ciencia de la cocina (desde nivel cero hasta técnicas de alta cocina) utilizando la misma psicología de microaprendizaje de **Duolingo** combinada con un **simulador interactivo de cocina** (el equivalente a la hoja de cálculo interactiva de Gridverse).

### Propuesta de Valor
- **Aprender haciendo**: No solo leer recetas pasivas, sino entender *por qué* suceden las cosas (química culinaria, balance de sabores, técnicas de corte y control térmico).
- **Feedback instantáneo**: Simulación interactiva de mise en place, balance de condimentos y rescate de desastres en la cocina.
- **Hábito diario**: Rachas de fuego (*Kitchen Fire Streak*), ligas semanales y recompensas.

---

## 2. Equivalencias y Mapeo: Gridverse vs. CookVerse

| Componente | Gridverse (Excel / Sheets) | CookVerse (Cocina / Gastronomía) |
| :--- | :--- | :--- |
| **Mascota Guía** | **Celdi** (celda carismática con emociones) | **Guiso** o **Flamby** (un gorrito de chef o sartencita animada) |
| **Lienzo Interactivo** | `SpreadsheetGrid` (grilla interactiva A1:D10) | `KitchenWorkbench` (tabla de corte, sartén/olla y despensa) |
| **Unidad Elemental** | Celdas, Fórmulas (`=SUMA`) y Rangos | Ingredientes, Cortes, Técnicas de Cocción y Temperaturas |
| **Mecánica 1** | `build_formula` (bloques de fórmulas) | `assemble_recipe` (ordenar la secuencia culinaria óptima) |
| **Mecánica 2** | `select_range` (marcar celdas) | `mise_en_place_select` (preparar estación con ingredientes exactos) |
| **Mecánica 3** | `predict` (predecir el valor de la fórmula) | `flavor_prediction` / `chemical_reaction` (predecir qué pasará) |
| **Mecánica 4** | `find_error` / `fix_error` (`#¡DIV/0!`, etc.) | `kitchen_rescue` (salvar una mayonesa cortada o exceso de sal) |
| **Jefes de Región** | Errores de hoja (`#¡REF!`, `#¡N/A`) | **Pesadillas en la Cocina** (Emulsión rota, Suflé desinflado) |
| **Economía** | Gemas, XP, Vidas (Corazones), Rachas | Granos de Pimienta/Sal de Oro, Chef XP, Cucharones (Vidas), Fuego |
| **Rangos de Usuario** | Novato, Analista Jr., Master Excel | Pinche de Cocina, Commis, Sous Chef, Chef Ejecutivo, 3 Estrellas |

---

## 3. Arquitectura del Sistema y Tech Stack

Siguiendo el stack liviano y reactivo de Gridverse:

```
┌────────────────────────────────────────────────────────┐
│                      COOKVERSE                         │
├──────────────────────────┬─────────────────────────────┤
│ Frontend                 │ React 19 + TypeScript +     │
│                          │ Tailwind CSS v4 + Vite      │
├──────────────────────────┼─────────────────────────────┤
│ Iconografía & Animación  │ Lucide React + canvas-      │
│                          │ confetti + CSS Keyframes    │
├──────────────────────────┼─────────────────────────────┤
│ Audio & Efectos          │ Web Audio API (sintetizador │
│                          │ procedural para cocina:     │
│                          │ sizzle, chop-chop, ding!)   │
├──────────────────────────┼─────────────────────────────┤
│ Persistencia             │ LocalStorage (offline-first)│
│                          │ + Firebase Firestore sync   │
└──────────────────────────┴─────────────────────────────┘
```

### Estructura de Directorios Recomendada

```text
cookverse-web/
├── public/
│   ├── audio/           # SFX de cocina (burbujas, cuchillo, campana)
│   └── icons/           # SVGs e ilustraciones de ingredientes
├── src/
│   ├── components/
│   │   ├── workbench/   # El "SpreadsheetGrid" culinario
│   │   │   ├── KitchenWorkbench.tsx
│   │   │   ├── PanSimulator.tsx
│   │   │   ├── CuttingBoard.tsx
│   │   │   └── FlavorWheel.tsx
│   │   ├── map/         # Ruta de progresión por regiones
│   │   │   ├── CulinaryMapTab.tsx
│   │   │   └── RecipeNode.tsx
│   │   ├── practice/    # Retos y ligas
│   │   │   ├── DailySpecialCard.tsx
│   │   │   └── ChefLeagueCard.tsx
│   │   ├── mascot/
│   │   │   └── GuisoMascot.tsx (expresiones: cooking, burnt, proud, alert)
│   │   ├── shop/        # Bazar del Gourmet
│   │   │   └── KitchenShopTab.tsx
│   │   ├── VictoryCeremony.tsx
│   │   └── LessonModal.tsx
│   ├── data/
│   │   ├── culinaryMapData.ts
│   │   ├── recipesData.ts
│   │   └── flavorMatrixData.ts
│   ├── lib/
│   │   ├── audio.ts     # Sonidos sintéticos de cocina
│   │   ├── storage.ts   # Progreso de estrellas, vidas y rachas
│   │   └── i18n.ts      # Multi-idioma (es, en, fr, it)
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   └── main.tsx
```

---

## 4. Modelado de Datos y Tipos TypeScript (`src/types/index.ts`)

```typescript
export type SupportedLocale = 'es' | 'en' | 'fr' | 'it';

export type ExerciseType =
  | 'assemble_recipe'     // Armar la secuencia correcta de preparación
  | 'mise_en_place'       // Seleccionar ingredientes y cantidades
  | 'temperature_control' // Escoger fuego bajo, medio, alto o sellado
  | 'flavor_balance'      // Corregir acidez, salazón, dulzor o amargor
  | 'cut_technique'       // Relacionar corte (Juliana, Brunoise, Chiffonade)
  | 'kitchen_rescue';     // Reparar un plato al borde del desastre

export interface Ingredient {
  id: string;
  name: string;
  category: 'protein' | 'vegetable' | 'dairy' | 'spice' | 'liquid';
  flavorProfile: {
    sweet?: number;
    salty?: number;
    sour?: number;
    bitter?: number;
    umami?: number;
    fat?: number;
  };
}

export interface CookingExercise {
  type: ExerciseType;
  prompt: string;
  promptByLocale?: Record<SupportedLocale, string>;
  targetDish: string;
  correct: string | string[];
  options?: string[];
  explanation: string;
  panState?: {
    temperature: 'low' | 'medium' | 'high' | 'off';
    currentIngredients: string[];
    cookingTimeSec: number;
  };
  flavorTarget?: {
    sour: number;
    salty: number;
    sweet: number;
  };
}

export interface CulinaryLevelData {
  ref: string;            // Ej: "C1", "SALSAS-3"
  title: string;
  station: 'prep' | 'stovetop' | 'oven' | 'pastry';
  rewardXp: number;
  exercises: CookingExercise[];
}

export interface UserChefStats {
  lives: number;          // Cucharones disponibles (default: 5)
  maxLives: number;
  streak: number;         // Días seguidos con el fuego encendido
  spices: number;         // Moneda virtual (pimienta / gemas)
  xp: number;             // Puntos de experiencia
  rank: 'Pinche' | 'Commis' | 'Demi-Chef' | 'Sous-Chef' | 'Chef de Cuisine' | 'Master Michelin';
  completedRecipes: Record<string, { stars: number; date: string }>;
  unlockedLevel: string;
}
```

---

## 5. El Árbol de Regiones del Mapa (`culinaryMapData.ts`)

Inspirado en la división por columnas de Gridverse (A: Básicos, B: Fórmulas, C: Tablas):

### Estación 1 (Columna A): "El Cuchillo y la Tabla"
- **A1: Higiene y Seguridad de Corte** (Posición de garra de oso).
- **A2: La Tríada Básica de Cortes** (Brunoise, Juliana, Mirepoix).
- **A3: Mise en Place** (Organización previa del espacio).
- **A4: Cofre de Recompensas** (Gana 50 Especias).
- **A5: Jefe de Estación: El Desliz del Cuchillo** (Identificar y corregir posturas peligrosas y tablas inestables).

### Estación 2 (Columna B): "La Ciencia del Fuego y el Sartén"
- **B1: Reacción de Maillard** (Por qué se dora la carne y cómo lograr corteza perfecta).
- **B2: Niveles de Fuego y Grasas** (Puntos de humo del aceite de oliva vs mantequilla).
- **B3: Saltear vs Sudar** (Diferencia de temperatura y humedad).
- **B4: Deglasado y Fondos** (Aprovechar los jugos pegados con vino o caldo).
- **B5: Jefe: Sabor a Quemado** (Rescate de una preparación antes de que el amargor la arruine).

### Estación 3 (Columna C): "Las Salsas Madre"
- **Béchamel**: Harina + Mantequilla (Roux) + Leche.
- **Velouté**: Roux rubio + Caldo blanco.
- **Española**: Fondo oscuro + Roux oscuro.
- **Holandesa**: Emulsión de yema y mantequilla clarificada.
- **Jefe: La Mayonesa/Holandesa Cortada** (Rescate de emulsión con gota de agua fría y yema fresca).

### Estación 4 (Columna D): "La Rueda del Balance de Sabores"
- Si está muy dulce $\to$ Agrega ácido o sal.
- Si está muy salado $\to$ Agrega grasa o almidón (papa/crema).
- Si está soso $\to$ Potenciador Umami o sal en el momento exacto.

---

## 6. Mecánicas de Juego Detalladas

### 1. `KitchenWorkbench` (El Canvas Interactivo)
Al igual que en Gridverse ves una hoja interactiva en vivo:
- Un **Sartén Central** que cambia visualmente (burbujea, humea, cambia de color al dorarse).
- Una **Bandeja de Mise en Place** donde arrastras o tocas ingredientes para echarlos al sartén.
- **Termómetro Interactivo**: Un slider para modular el calor (Off / Fuego Lento / Medio / Vivo).
- Si mantienes el fuego muy alto demasiado tiempo, ¡comienza a salir humo y "Guiso" se asusta!

### 2. Combates de Jefe ("Pesadilla en la Cocina")
Simula una crisis de restaurante con un temporizador de 60 segundos:
- *Crisis*: "¡Se nos cortó la vinagreta para el banquete!"
- *Acción requerida*: Diagnosticar la causa física (demasiado aceite añadido de golpe), elegir la herramienta de rescate (batir con vigor una cucharada de mostaza Dijon o agua) y restaurar la emulsión antes de perder vidas.

### 3. La Mascota: "Guiso"
- **Neutral**: Con su gorro bien puesto sonriendo.
- **Pensando**: Olfateando un cucharón.
- **Celebrando**: Sacando chispas y fuego controlado del sartén.
- **Alarmado**: Con el gorro chamuscado y ojos abiertos (cuando fallas un paso).

---

## 7. Plan de Implementación Paso a Paso (Roadmap)

### Fase 1: Scaffold & Estructura Base
1. Inicializar con Vite + React 19 + TypeScript + Tailwind CSS.
2. Portar el sistema de diseño de Gridverse (Navbar con vidas, monedas, rachas y selector de idioma).
3. Implementar el mapa de nodos vertical con scroll suave (`CulinaryMapTab`).

### Fase 2: Componente del Banco de Cocina (`KitchenWorkbench`)
1. Crear el simulador visual del sartén con animaciones CSS (burbujas, vapor).
2. Implementar los chips de ingredientes seleccionables.
3. Crear el evaluador de pasos culinarios.

### Fase 3: Audio Procedural de Cocina
1. Crear con Web Audio API los efectos de:
   - *Chop*: Sonido de golpe seco y crujiente sobre madera.
   - *Sizzle*: Ruido blanco filtrado paso bajo que emula fritura.
   - *Timer Bell*: Campana de orden lista.
   - *Victory Jingle*: Fanfarria alegre al completar la receta.

### Fase 4: Retención y Gamificación
1. Misiones diarias del Chef ("Prepara 2 salsas", "Completa una lección sin quemar nada").
2. Bazar de Utensilios: Cuchillos dorados, delantales temáticos, congeladores de racha (*Hielo seco culinario*).
3. Sincronización en la nube con Firebase.
