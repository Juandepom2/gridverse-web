import { SupportedLocale } from '../types';

export type LevelType = 'lesson' | 'practice' | 'boss' | 'chest';
export type LevelStatus = 'done' | 'current' | 'locked';

export interface LevelItem {
  ref: string;
  title: string;
  titleByLocale: Record<SupportedLocale, string>;
  type?: LevelType;
  status?: LevelStatus;
  stars?: number;
  bossError?: string;
  bossErrorByLocale?: Record<SupportedLocale, string>;
}

export interface RegionItem {
  column: string;
  title: string;
  titleByLocale: Record<SupportedLocale, string>;
  subtitle: string;
  subtitleByLocale: Record<SupportedLocale, string>;
  color: string;
  levels: LevelItem[];
}

export const MOCK_REGIONS: RegionItem[] = [
  {
    column: 'A',
    title: 'Lo básico',
    titleByLocale: {'es': 'Lo básico', 'en': 'The Basics', 'de': 'Die Grundlagen', 'fr': 'Les bases', 'ja': '基本操作', 'pt': 'O básico'},
    subtitle: 'Celdas, formatos y operaciones',
    subtitleByLocale: {'es': 'Celdas, formatos y operaciones', 'en': 'Cells, formats, and operations', 'de': 'Zellen, Formate und Rechenarten', 'fr': 'Cellules, formats et opérations', 'ja': 'セル、書式、四則演算', 'pt': 'Células, formatos e operações'},
    color: "#21C26B",
    levels: [
      {ref: 'A1', title: 'Hola, celda', titleByLocale: {'es': 'Hola, celda', 'en': 'Hello, Cell', 'de': 'Hallo, Zelle', 'fr': 'Bonjour, cellule', 'ja': 'ハロー、セル', 'pt': 'Olá, célula'}, status: "done", stars: 3},
      {ref: 'A2', title: 'Filas y columnas', titleByLocale: {'es': 'Filas y columnas', 'en': 'Rows and Columns', 'de': 'Zeilen und Spalten', 'fr': 'Lignes et colonnes', 'ja': '行と列', 'pt': 'Linhas e colunas'}, status: "done", stars: 3},
      {ref: 'A3', title: 'Tipos de datos', titleByLocale: {'es': 'Tipos de datos', 'en': 'Data Types', 'de': 'Datentypen', 'fr': 'Types de données', 'ja': 'データ型', 'pt': 'Tipos de dados'}, status: "done", stars: 2},
      {ref: 'A4', title: 'Formato de celdas', titleByLocale: {'es': 'Formato de celdas', 'en': 'Cell Formatting', 'de': 'Zellformatierung', 'fr': 'Format de cellule', 'ja': 'セルの書式設定', 'pt': 'Formatação de células'}},
      {ref: 'A5', title: 'Operaciones + − × ÷', titleByLocale: {'es': 'Operaciones + − × ÷', 'en': 'Operations + − × ÷', 'de': 'Grundrechenarten + − × ÷', 'fr': 'Opérations + − × ÷', 'ja': '四則演算 + − × ÷', 'pt': 'Operações + − × ÷'}},
      {ref: 'A6', title: 'Autorrelleno y arrastre', titleByLocale: {'es': 'Autorrelleno y arrastre', 'en': 'Autofill and Flash Fill', 'de': 'AutoAusfüllen und Ziehen', 'fr': 'Remplissage automatique', 'ja': 'オートフィルと連続データ', 'pt': 'Preenchimento automático'}},
      {ref: 'A7', title: 'Cofre', titleByLocale: {'es': 'Cofre', 'en': 'Chest', 'de': 'Schatztruhe', 'fr': 'Coffre', 'ja': '宝箱', 'pt': 'Baú'}, type: "chest"},
      {ref: 'A8', title: 'Jefe: División por cero', titleByLocale: {'es': 'Jefe: División por cero', 'en': 'Boss: Division by Zero', 'de': 'Boss: Division durch Null', 'fr': 'Boss : Division par zéro', 'ja': 'ボス：ゼロ除算エラー', 'pt': 'Chefe: Divisão por zero'}, type: "boss", bossError: '#¡DIV/0!', bossErrorByLocale: {'es': '#¡DIV/0!', 'en': '#DIV/0!', 'de': '#DIV/0!', 'fr': '#DIV/0!', 'ja': '#DIV/0!', 'pt': '#DIV/0!'}},
    ],
  },
  {
    column: 'B',
    title: 'Fórmulas esenciales',
    titleByLocale: {'es': 'Fórmulas esenciales', 'en': 'Essential Formulas', 'de': 'Grundlegende Formeln', 'fr': 'Formules essentielles', 'ja': '基本の数式', 'pt': 'Fórmulas essenciais'},
    subtitle: 'SUMA, PROMEDIO y referencias \$A\$1',
    subtitleByLocale: {'es': 'SUMA, PROMEDIO y referencias \$A\$1', 'en': 'SUM, AVERAGE, and \$A\$1 references', 'de': 'SUMME, MITTELWERT und \$A\$1-Bezüge', 'fr': 'SOMME, MOYENNE et références \$A\$1', 'ja': 'SUM、AVERAGE、および \$A\$1 参照', 'pt': 'SOMA, MÉDIA e referências \$A\$1'},
    color: "#4DA3FF",
    levels: [
      {ref: 'B1', title: 'SUMA', titleByLocale: {'es': 'SUMA', 'en': 'SUM', 'de': 'SUMME', 'fr': 'SOMME', 'ja': 'SUM', 'pt': 'SOMA'}},
      {ref: 'B2', title: 'PROMEDIO', titleByLocale: {'es': 'PROMEDIO', 'en': 'AVERAGE', 'de': 'MITTELWERT', 'fr': 'MOYENNE', 'ja': 'AVERAGE', 'pt': 'MÉDIA'}},
      {ref: 'B3', title: 'MIN y MAX', titleByLocale: {'es': 'MIN y MAX', 'en': 'MIN and MAX', 'de': 'MIN und MAX', 'fr': 'MIN et MAX', 'ja': 'MIN と MAX', 'pt': 'MÍN e MÁX'}},
      {ref: 'B4', title: 'CONTAR y CONTARA', titleByLocale: {'es': 'CONTAR y CONTARA', 'en': 'COUNT and COUNTA', 'de': 'ANZAHL und ANZAHL2', 'fr': 'NB et NBVAL', 'ja': 'COUNT と COUNTA', 'pt': 'CONT.NÚM e CONT.VALORES'}},
      {ref: 'B5', title: 'REDONDEAR y ENTERO', titleByLocale: {'es': 'REDONDEAR y ENTERO', 'en': 'ROUND and INT', 'de': 'RUNDEN und GANZZAHL', 'fr': 'ARRONDI et ENT', 'ja': 'ROUND と INT', 'pt': 'ARRED e INT'}},
      {ref: 'B6', title: 'Porcentajes: Descuento e IVA', titleByLocale: {'es': 'Porcentajes: Descuento e IVA', 'en': 'Percentages: Discounts and Tax', 'de': 'Prozentsätze: Rabatt und MwSt.', 'fr': 'Pourcentages : Remises et TVA', 'ja': 'パーセンテージ：割引と消費税', 'pt': 'Porcentagens: Descontos e Impostos'}},
      {ref: 'B7', title: 'Variación porcentual', titleByLocale: {'es': 'Variación porcentual', 'en': 'Percentage Change', 'de': 'Prozentuale Veränderung', 'fr': 'Variation en pourcentage', 'ja': '変化率（％）', 'pt': 'Variação percentual'}},
      {ref: 'B8', title: 'Referencias relativas', titleByLocale: {'es': 'Referencias relativas', 'en': 'Relative References', 'de': 'Relative Bezüge', 'fr': 'Références relatives', 'ja': '相対参照', 'pt': 'Referências relativas'}},
      {ref: 'B9', title: 'Referencias absolutas \$A\$1', titleByLocale: {'es': 'Referencias absolutas \$A\$1', 'en': 'Absolute References \$A\$1', 'de': 'Absolute Bezüge \$A\$1', 'fr': 'Références absolues \$A\$1', 'ja': '絶対参照 \$A\$1', 'pt': 'Referências absolutas \$A\$1'}},
      {ref: 'B10', title: 'Referencias entre hojas', titleByLocale: {'es': 'Referencias entre hojas', 'en': 'Cross-Sheet References', 'de': 'Blattübergreifende Bezüge', 'fr': 'Références entre feuilles', 'ja': 'シート間参照', 'pt': 'Referências entre planilhas'}},
      {ref: 'B11', title: 'Proyecto: Presupuesto mensual', titleByLocale: {'es': 'Proyecto: Presupuesto mensual', 'en': 'Project: Monthly Budget', 'de': 'Projekt: Monatsbudget', 'fr': 'Projet : Budget mensuel', 'ja': 'プロジェクト：月間予算シート', 'pt': 'Projeto: Orçamento mensal'}, type: "practice"},
      {ref: 'B12', title: 'Jefe: Referencia rota', titleByLocale: {'es': 'Jefe: Referencia rota', 'en': 'Boss: Broken Reference', 'de': 'Boss: Ungültiger Bezug', 'fr': 'Boss : Référence rompue', 'ja': 'ボス：参照エラー', 'pt': 'Chefe: Referência corrompida'}, type: "boss", bossError: '#¡REF!', bossErrorByLocale: {'es': '#¡REF!', 'en': '#REF!', 'de': '#BEZUG!', 'fr': '#REF!', 'ja': '#REF!', 'pt': '#REF!'}},
    ],
  },
  {
    column: 'C',
    title: 'Organizar datos',
    titleByLocale: {'es': 'Organizar datos', 'en': 'Organize Data', 'de': 'Daten organisieren', 'fr': 'Organiser les données', 'ja': 'データの整理', 'pt': 'Organizar dados'},
    subtitle: 'Ordenar, filtros y tablas oficiales',
    subtitleByLocale: {'es': 'Ordenar, filtros y tablas oficiales', 'en': 'Sort, filter, and official tables', 'de': 'Sortieren, Filtern und offizielle Tabellen', 'fr': 'Tri, filtres et tableaux officiels', 'ja': '並べ替え、フィルター、テーブル化', 'pt': 'Classificar, filtros e tabelas oficiais'},
    color: "#0D9488",
    levels: [
      {ref: 'C1', title: 'Ordenar de A-Z y multicriterio', titleByLocale: {'es': 'Ordenar de A-Z y multicriterio', 'en': 'Sort A-Z and Multi-Level Sort', 'de': 'Sortieren A-Z und Mehrfachebenen', 'fr': 'Trier de A à Z et multicritères', 'ja': '昇順・降順と複数キー並べ替え', 'pt': 'Classificar de A-Z e multicritério'}},
      {ref: 'C2', title: 'Filtros', titleByLocale: {'es': 'Filtros', 'en': 'Filters', 'de': 'Filter', 'fr': 'Filtres', 'ja': 'フィルター', 'pt': 'Filtros'}},
      {ref: 'C3', title: 'Inmovilizar paneles', titleByLocale: {'es': 'Inmovilizar paneles', 'en': 'Freeze Panes', 'de': 'Fenster einfrieren', 'fr': 'Figer les volets', 'ja': 'ウィンドウ枠の固定', 'pt': 'Congelar painéis'}},
      {ref: 'C4', title: 'Quitar duplicados', titleByLocale: {'es': 'Quitar duplicados', 'en': 'Remove Duplicates', 'de': 'Duplikate entfernen', 'fr': 'Supprimer les doublons', 'ja': '重複の削除', 'pt': 'Remover duplicatas'}},
      {ref: 'C5', title: 'Convertir en tabla (Ctrl+T},', titleByLocale: {'es': 'Convertir en tabla (Ctrl+T},', 'en': 'Convert to Table (Ctrl+T},', 'de': 'In Tabelle konvertieren (Strg+T},', 'fr': 'Convertir en tableau (Ctrl+L/T},', 'ja': 'テーブルの作成 (Ctrl+T},', 'pt': 'Converter em tabela (Ctrl+Alt+T},'}},
      {ref: 'C6', title: 'Rangos con nombre', titleByLocale: {'es': 'Rangos con nombre', 'en': 'Named Ranges', 'de': 'Benannte Bereiche', 'fr': 'Plages nommées', 'ja': '名前の定義と名前の管理', 'pt': 'Intervalos nomeados'}},
      {ref: 'C7', title: 'Copiar y pegar especial', titleByLocale: {'es': 'Copiar y pegar especial', 'en': 'Copy and Paste Special', 'de': 'Inhalte einfügen (Paste Special},', 'fr': 'Copier et collage spécial', 'ja': '形式を選択して貼り付け', 'pt': 'Colar especial'}},
      {ref: 'C8', title: 'Cofre', titleByLocale: {'es': 'Cofre', 'en': 'Chest', 'de': 'Schatztruhe', 'fr': 'Coffre', 'ja': '宝箱', 'pt': 'Baú'}, type: "chest"},
      {ref: 'C9', title: 'Jefe: Ordenamiento roto', titleByLocale: {'es': 'Jefe: Ordenamiento roto', 'en': 'Boss: Broken Sorting', 'de': 'Boss: Sortierchaos', 'fr': 'Boss : Tri corrompu', 'ja': 'ボス：並べ替え不整合', 'pt': 'Chefe: Classificação desordenada'}, type: "boss", bossError: '#¡DESFASE!', bossErrorByLocale: {'es': '#¡DESFASE!', 'en': '#OFFSET_ERROR!', 'de': '#VERSATZ!', 'fr': '#DECALAGE!', 'ja': '#ズレエラー!', 'pt': '#DESLOC_ERRO!'}},
    ],
  },
  {
    column: 'D',
    title: 'Lógica',
    titleByLocale: {'es': 'Lógica', 'en': 'Logic', 'de': 'Logik', 'fr': 'Logique', 'ja': '論理関数', 'pt': 'Lógica'},
    subtitle: 'SI, Y, O, SI.ERROR y SI.CONJUNTO',
    subtitleByLocale: {'es': 'SI, Y, O, SI.ERROR y SI.CONJUNTO', 'en': 'IF, AND, OR, IFERROR, and IFS', 'de': 'WENN, UND, ODER, WENNFEHLER und WENNS', 'fr': 'SI, ET, OU, SIERREUR et SI.CONDITIONS', 'ja': 'IF、AND、OR、IFERROR、IFS', 'pt': 'SE, E, OU, SEERRO e SES'},
    color: "#FFC53D",
    levels: [
      {ref: 'D1', title: 'Decisiones con SI', titleByLocale: {'es': 'Decisiones con SI', 'en': 'Decisions with IF', 'de': 'Entscheidungen mit WENN', 'fr': 'Décisions avec SI', 'ja': 'IF による条件分岐', 'pt': 'Decisões com SE'}},
      {ref: 'D2', title: 'Y / O', titleByLocale: {'es': 'Y / O', 'en': 'AND / OR', 'de': 'UND / ODER', 'fr': 'ET / OU', 'ja': 'AND / OR', 'pt': 'E / OU'}},
      {ref: 'D3', title: 'SI anidado', titleByLocale: {'es': 'SI anidado', 'en': 'Nested IF', 'de': 'Verschachteltes WENN', 'fr': 'SI imbriqués', 'ja': 'ネストされた IF', 'pt': 'SE aninhado'}},
      {ref: 'D4', title: 'SI.ERROR', titleByLocale: {'es': 'SI.ERROR', 'en': 'IFERROR', 'de': 'WENNFEHLER', 'fr': 'SIERREUR', 'ja': 'IFERROR', 'pt': 'SEERRO'}},
      {ref: 'D5', title: 'SI con texto y vacías', titleByLocale: {'es': 'SI con texto y vacías', 'en': 'IF with Text and Blanks', 'de': 'WENN mit Text und leeren Zellen', 'fr': 'SI avec texte et cellules vides', 'ja': '文字列や空白判定の IF', 'pt': 'SE com texto e células vazias'}},
      {ref: 'D6', title: 'SI.CONJUNTO', titleByLocale: {'es': 'SI.CONJUNTO', 'en': 'IFS', 'de': 'WENNS', 'fr': 'SI.CONDITIONS', 'ja': 'IFS', 'pt': 'SES'}},
      {ref: 'D7', title: 'Cofre', titleByLocale: {'es': 'Cofre', 'en': 'Chest', 'de': 'Schatztruhe', 'fr': 'Coffre', 'ja': '宝箱', 'pt': 'Baú'}, type: "chest"},
      {ref: 'D8', title: 'Proyecto: Boleta de calificaciones', titleByLocale: {'es': 'Proyecto: Boleta de calificaciones', 'en': 'Project: Report Card', 'de': 'Projekt: Notenübersicht', 'fr': 'Projet : Bulletin de notes', 'ja': 'プロジェクト：成績評価シート', 'pt': 'Projeto: Boletim escolar'}, type: "practice"},
      {ref: 'D9', title: 'Jefe: Valor inválido', titleByLocale: {'es': 'Jefe: Valor inválido', 'en': 'Boss: Invalid Value', 'de': 'Boss: Ungültiger Wert', 'fr': 'Boss : Valeur invalide', 'ja': 'ボス：不正な値エラー', 'pt': 'Chefe: Valor inválido'}, type: "boss", bossError: '#¡VALOR!', bossErrorByLocale: {'es': '#¡VALOR!', 'en': '#VALUE!', 'de': '#WERT!', 'fr': '#VALEUR!', 'ja': '#VALUE!', 'pt': '#VALOR!'}},
    ],
  },
  {
    column: 'E',
    title: 'Texto',
    titleByLocale: {'es': 'Texto', 'en': 'Text', 'de': 'Text', 'fr': 'Texte', 'ja': '文字列操作', 'pt': 'Texto'},
    subtitle: 'Unir, limpiar y extraer cadenas',
    subtitleByLocale: {'es': 'Unir, limpiar y extraer cadenas', 'en': 'Concatenate, clean, and extract strings', 'de': 'Verketten, bereinigen und extrahieren', 'fr': 'Joindre, nettoyer et extraire des chaînes', 'ja': '文字列の結合・クリーニング・抽出', 'pt': 'Unir, limpar e extrair strings'},
    color: "#8B5CF6",
    levels: [
      {ref: 'E1', title: 'Unir con &', titleByLocale: {'es': 'Unir con &', 'en': 'Join with &', 'de': 'Verbinden mit &', 'fr': 'Joindre avec &', 'ja': '& による文字列結合', 'pt': 'Concatenar com &'}},
      {ref: 'E2', title: 'MAYUSC, MINUSC, NOMPROPIO', titleByLocale: {'es': 'MAYUSC, MINUSC, NOMPROPIO', 'en': 'UPPER, LOWER, PROPER', 'de': 'GROSS, KLEIN, GROSS2', 'fr': 'MAJUSCULE, MINUSCULE, NOMPROPRE', 'ja': 'UPPER、LOWER、PROPER', 'pt': 'MAIÚSCULA, MINÚSCULA, PRI.MAIÚSCULA'}},
      {ref: 'E3', title: 'ESPACIOS y LARGO', titleByLocale: {'es': 'ESPACIOS y LARGO', 'en': 'TRIM and LEN', 'de': 'GLÄTTEN und LÄNGE', 'fr': 'SUPPRESPACE et NBCAR', 'ja': 'TRIM と LEN', 'pt': 'TIRAR.ESPAÇOS e NÚM.CARACT'}},
      {ref: 'E4', title: 'IZQUIERDA y DERECHA', titleByLocale: {'es': 'IZQUIERDA y DERECHA', 'en': 'LEFT and RIGHT', 'de': 'LINKS und RECHTS', 'fr': 'GAUCHE et DROITE', 'ja': 'LEFT と RIGHT', 'pt': 'ESQUERDA e DIREITA'}},
      {ref: 'E5', title: 'EXTRAE', titleByLocale: {'es': 'EXTRAE', 'en': 'MID', 'de': 'TEIL', 'fr': 'STXT', 'ja': 'MID', 'pt': 'EXT.TEXTO'}},
      {ref: 'E6', title: 'ENCONTRAR', titleByLocale: {'es': 'ENCONTRAR', 'en': 'FIND', 'de': 'FINDEN', 'fr': 'TROUVE', 'ja': 'FIND', 'pt': 'LOCALIZAR / PROCURAR'}},
      {ref: 'E7', title: 'SUSTITUIR', titleByLocale: {'es': 'SUSTITUIR', 'en': 'SUBSTITUTE', 'de': 'WECHSELN', 'fr': 'SUBSTITUE', 'ja': 'SUBSTITUTE', 'pt': 'SUBSTITUIR'}},
      {ref: 'E8', title: 'TEXTO (formato en fórmula},', titleByLocale: {'es': 'TEXTO (formato en fórmula},', 'en': 'TEXT (Format inside formula},', 'de': 'TEXT (Format in Formeln},', 'fr': 'TEXTE (Format en formule},', 'ja': 'TEXT（数式内での表示形式）', 'pt': 'TEXTO (formatação na fórmula},'}},
      {ref: 'E9', title: 'Texto en columnas', titleByLocale: {'es': 'Texto en columnas', 'en': 'Text to Columns', 'de': 'Text in Spalten', 'fr': 'Texte en colonnes', 'ja': '区切り位置（テキストを列に分割）', 'pt': 'Texto para colunas'}},
      {ref: 'E10', title: 'Jefe: Nombre inválido', titleByLocale: {'es': 'Jefe: Nombre inválido', 'en': 'Boss: Invalid Name', 'de': 'Boss: Ungültiger Name', 'fr': 'Boss : Nom non reconnu', 'ja': 'ボス：無効な名前エラー', 'pt': 'Chefe: Nome inválido'}, type: "boss", bossError: '#¿NOMBRE?', bossErrorByLocale: {'es': '#¿NOMBRE?', 'en': '#NAME?', 'de': '#NAME?', 'fr': '#NOM?', 'ja': '#NAME?', 'pt': '#NOME?'}},
    ],
  },
  {
    column: 'F',
    title: 'Fechas',
    titleByLocale: {'es': 'Fechas', 'en': 'Dates', 'de': 'Datumsfunktionen', 'fr': 'Dates', 'ja': '日付と時刻', 'pt': 'Datas'},
    subtitle: 'Tiempo, vencimientos y días hábiles',
    subtitleByLocale: {'es': 'Tiempo, vencimientos y días hábiles', 'en': 'Time, deadlines, and working days', 'de': 'Zeit, Fälligkeiten und Werktage', 'fr': 'Temps, échéances et jours ouvrés', 'ja': '時間計算、締切、営業日', 'pt': 'Tempo, prazos e dias úteis'},
    color: "#FF8A3D",
    levels: [
      {ref: 'F1', title: 'Cómo guarda Excel las fechas', titleByLocale: {'es': 'Cómo guarda Excel las fechas', 'en': 'How Excel Stores Dates', 'de': 'Wie Excel Datumsangaben speichert', 'fr': 'Comment Excel stocke les dates', 'ja': 'Excelの日付シリアル値の仕組み', 'pt': 'Como o Excel armazena datas'}},
      {ref: 'F2', title: 'HOY y AHORA', titleByLocale: {'es': 'HOY y AHORA', 'en': 'TODAY and NOW', 'de': 'HEUTE und JETZT', 'fr': 'AUJOURDHUI et MAINTENANT', 'ja': 'TODAY と NOW', 'pt': 'HOJE e AGORA'}},
      {ref: 'F3', title: 'DÍA, MES y AÑO', titleByLocale: {'es': 'DÍA, MES y AÑO', 'en': 'DAY, MONTH, and YEAR', 'de': 'TAG, MONAT und JAHR', 'fr': 'JOUR, MOIS et ANNEE', 'ja': 'DAY、MONTH、YEAR', 'pt': 'DIA, MÊS e ANO'}},
      {ref: 'F4', title: 'Sumar y restar fechas', titleByLocale: {'es': 'Sumar y restar fechas', 'en': 'Adding and Subtracting Dates', 'de': 'Datumsrechnung (+ / -},', 'fr': 'Ajouter et soustraire des dates', 'ja': '日付の加算・減算', 'pt': 'Somar e subtrair datas'}},
      {ref: 'F5', title: 'SIFECHA (edad y antigüedad},', titleByLocale: {'es': 'SIFECHA (edad y antigüedad},', 'en': 'DATEDIF (Age and Tenure},', 'de': 'DATEDIF (Alter und Betriebszugehörigkeit},', 'fr': 'DATEDIF (Âge et ancienneté},', 'ja': 'DATEDIF（年齢や勤続年数）', 'pt': 'DATADIF (Idade e tempo de casa},'}},
      {ref: 'F6', title: 'DIAS.LAB (días hábiles},', titleByLocale: {'es': 'DIAS.LAB (días hábiles},', 'en': 'NETWORKDAYS (Workdays},', 'de': 'NETTOARBEITSTAGE (Werktage},', 'fr': 'NB.JOURS.OUVRES (Jours ouvrés},', 'ja': 'NETWORKDAYS（稼働日・営業日数）', 'pt': 'DIATRABALHOTOTAL (Dias úteis},'}},
      {ref: 'F7', title: 'Cofre', titleByLocale: {'es': 'Cofre', 'en': 'Chest', 'de': 'Schatztruhe', 'fr': 'Coffre', 'ja': '宝箱', 'pt': 'Baú'}, type: "chest"},
      {ref: 'F8', title: 'Jefe: Fechas como texto', titleByLocale: {'es': 'Jefe: Fechas como texto', 'en': 'Boss: Dates as Text', 'de': 'Boss: Datumsangaben als Text', 'fr': 'Boss : Dates au format texte', 'ja': 'ボス：文字列日付エラー', 'pt': 'Chefe: Datas como texto'}, type: "boss", bossError: '#¡FECHA!', bossErrorByLocale: {'es': '#¡FECHA!', 'en': '#DATE_ERR!', 'de': '#DATUM!', 'fr': '#DATE!', 'ja': '#日付エラー!', 'pt': '#DATA_ERRO!'}},
    ],
  },
  {
    column: 'G',
    title: 'Visual y Calidad',
    titleByLocale: {'es': 'Visual y Calidad', 'en': 'Visuals & Quality', 'de': 'Visualisierung & Datenqualität', 'fr': 'Visuels et qualité', 'ja': '視覚化とデータ品質', 'pt': 'Visual e Qualidade'},
    subtitle: 'Formato condicional, validación y gráficos',
    subtitleByLocale: {'es': 'Formato condicional, validación y gráficos', 'en': 'Conditional formatting, validation, and charts', 'de': 'Bedingte Formatierung, Gültigkeit und Diagramme', 'fr': 'Mise en forme conditionnelle, validation et graphiques', 'ja': '条件付き書式、入力規則、グラフ', 'pt': 'Formatação condicional, validação e gráficos'},
    color: "#E11D48",
    levels: [
      {ref: 'G1', title: 'Formato condicional: Reglas simples', titleByLocale: {'es': 'Formato condicional: Reglas simples', 'en': 'Conditional Formatting: Basic Rules', 'de': 'Bedingte Formatierung: Einfache Regeln', 'fr': 'Mise en forme conditionnelle : Règles simples', 'ja': '条件付き書式：基本ルール', 'pt': 'Formatação condicional: Regras básicas'}},
      {ref: 'G2', title: 'Formato condicional: Barras y escalas', titleByLocale: {'es': 'Formato condicional: Barras y escalas', 'en': 'Conditional Formatting: Data Bars & Color Scales', 'de': 'Bedingte Formatierung: Datenbalken & Farbskalen', 'fr': 'Mise en forme conditionnelle : Barres et nuances', 'ja': '条件付き書式：データバーとカラースケール', 'pt': 'Formatação condicional: Barras e escalas de cor'}},
      {ref: 'G3', title: 'Formato condicional con fórmula', titleByLocale: {'es': 'Formato condicional con fórmula', 'en': 'Formula-Based Conditional Formatting', 'de': 'Bedingte Formatierung mit Formeln', 'fr': 'Mise en forme conditionnelle par formule', 'ja': '数式を使った高度な条件付き書式', 'pt': 'Formatação condicional com fórmula'}},
      {ref: 'G4', title: 'Validación de datos', titleByLocale: {'es': 'Validación de datos', 'en': 'Data Validation', 'de': 'Datenüberprüfung', 'fr': 'Validation des données', 'ja': 'データの入力規則', 'pt': 'Validação de dados'}},
      {ref: 'G5', title: 'Listas desplegables', titleByLocale: {'es': 'Listas desplegables', 'en': 'Dropdown Lists', 'de': 'Dropdown-Listen', 'fr': 'Listes déroulantes', 'ja': 'ドロップダウンリスト', 'pt': 'Listas suspensas'}},
      {ref: 'G6', title: 'Gráficos de barras y columnas', titleByLocale: {'es': 'Gráficos de barras y columnas', 'en': 'Bar and Column Charts', 'de': 'Balken- und Säulendiagramme', 'fr': 'Graphiques à barres et histogrammes', 'ja': '棒グラフと縦棒グラフ', 'pt': 'Gráficos de barras e colunas'}},
      {ref: 'G7', title: 'Gráficos de líneas', titleByLocale: {'es': 'Gráficos de líneas', 'en': 'Line Charts', 'de': 'Liniendiagramme', 'fr': 'Graphiques en courbes', 'ja': '折れ線グラフ', 'pt': 'Gráficos de linha'}},
      {ref: 'G8', title: 'Gráfico circular (y riesgos},', titleByLocale: {'es': 'Gráfico circular (y riesgos},', 'en': 'Pie Charts (and Pitfalls},', 'de': 'Kreisdiagramme (und Fallstricke},', 'fr': 'Graphiques à secteurs (et pièges},', 'ja': '円グラフ（とその注意点）', 'pt': 'Gráfico de pizza (e armadilhas},'}},
      {ref: 'G9', title: 'Elegir el gráfico correcto', titleByLocale: {'es': 'Elegir el gráfico correcto', 'en': 'Choosing the Right Chart', 'de': 'Das richtige Diagramm wählen', 'fr': 'Choisir le bon graphique', 'ja': '最適なグラフの選び方', 'pt': 'Escolher o gráfico certo'}, type: "practice"},
      {ref: 'G10', title: 'Proyecto: Mini dashboard', titleByLocale: {'es': 'Proyecto: Mini dashboard', 'en': 'Project: Mini Dashboard', 'de': 'Projekt: Mini-Dashboard', 'fr': 'Projet : Mini tableau de bord', 'ja': 'プロジェクト：ミニダッシュボード', 'pt': 'Projeto: Mini dashboard'}, type: "practice"},
    ],
  },
  {
    column: 'H',
    title: 'Búsqueda',
    titleByLocale: {'es': 'Búsqueda', 'en': 'Lookups', 'de': 'Suchfunktionen', 'fr': 'Recherche', 'ja': '検索と行列', 'pt': 'Pesquisa e Busca'},
    subtitle: 'BUSCARV, BUSCARX e ÍNDICE/COINCIDIR',
    subtitleByLocale: {'es': 'BUSCARV, BUSCARX e ÍNDICE/COINCIDIR', 'en': 'VLOOKUP, XLOOKUP, and INDEX/MATCH', 'de': 'SVERWEIS, XVERWEIS und INDEX/VERGLEICH', 'fr': 'RECHERCHEV, RECHERCHEX et INDEX/EQUIV', 'ja': 'VLOOKUP、XLOOKUP、INDEX/MATCH', 'pt': 'PROCV, PROCX e ÍNDICE/CORRESP'},
    color: "#4DE1FF",
    levels: [
      {ref: 'H1', title: 'BUSCARV coincidencia exacta', titleByLocale: {'es': 'BUSCARV coincidencia exacta', 'en': 'VLOOKUP Exact Match', 'de': 'SVERWEIS Genaue Übereinstimmung', 'fr': 'RECHERCHEV correspondance exacte', 'ja': 'VLOOKUP 完全一致', 'pt': 'PROCV Correspondência exata'}},
      {ref: 'H2', title: 'BUSCARV aproximada', titleByLocale: {'es': 'BUSCARV aproximada', 'en': 'VLOOKUP Approximate Match', 'de': 'SVERWEIS Ungefähre Übereinstimmung', 'fr': 'RECHERCHEV correspondance approximative', 'ja': 'VLOOKUP 近似一致', 'pt': 'PROCV Correspondência aproximada'}},
      {ref: 'H3', title: 'BUSCARV + SI.ERROR', titleByLocale: {'es': 'BUSCARV + SI.ERROR', 'en': 'VLOOKUP + IFERROR', 'de': 'SVERWEIS + WENNFEHLER', 'fr': 'RECHERCHEV + SIERREUR', 'ja': 'VLOOKUP + IFERROR', 'pt': 'PROCV + SEERRO'}},
      {ref: 'H4', title: 'BUSCARX (El rey moderno},', titleByLocale: {'es': 'BUSCARX (El rey moderno},', 'en': 'XLOOKUP (The Modern King},', 'de': 'XVERWEIS (Der moderne Champion},', 'fr': 'RECHERCHEX (Le roi moderne},', 'ja': 'XLOOKUP（最新最強の検索関数）', 'pt': 'PROCX (O novo padrão},'}},
      {ref: 'H5', title: 'INDICE', titleByLocale: {'es': 'INDICE', 'en': 'INDEX', 'de': 'INDEX', 'fr': 'INDEX', 'ja': 'INDEX', 'pt': 'ÍNDICE'}},
      {ref: 'H6', title: 'COINCIDIR', titleByLocale: {'es': 'COINCIDIR', 'en': 'MATCH', 'de': 'VERGLEICH', 'fr': 'EQUIV', 'ja': 'MATCH', 'pt': 'CORRESP'}},
      {ref: 'H7', title: 'INDICE + COINCIDIR', titleByLocale: {'es': 'INDICE + COINCIDIR', 'en': 'INDEX + MATCH', 'de': 'INDEX + VERGLEICH', 'fr': 'INDEX + EQUIV', 'ja': 'INDEX + MATCH', 'pt': 'ÍNDICE + CORRESP'}},
      {ref: 'H8', title: 'Búsqueda con dos criterios', titleByLocale: {'es': 'Búsqueda con dos criterios', 'en': 'Two-Way Lookup', 'de': 'Zwei-Wege-Suche (2 Kriterien},', 'fr': 'Recherche à deux critères', 'ja': '2軸（縦横）クロス検索', 'pt': 'Busca com dois critérios'}},
      {ref: 'H9', title: 'Jefe: Dato no disponible', titleByLocale: {'es': 'Jefe: Dato no disponible', 'en': 'Boss: Data Not Available', 'de': 'Boss: Keine Daten verfügbar', 'fr': 'Boss : Donnée indisponible', 'ja': 'ボス：該当データなしエラー', 'pt': 'Chefe: Valor não disponível'}, type: "boss", bossError: '#N/D', bossErrorByLocale: {'es': '#N/D', 'en': '#N/A', 'de': '#NV', 'fr': '#N/A', 'ja': '#N/A', 'pt': '#N/D'}},
    ],
  },
  {
    column: 'I',
    title: 'Agregación',
    titleByLocale: {'es': 'Agregación', 'en': 'Aggregation', 'de': 'Aggregation', 'fr': 'Agrégation', 'ja': '集計・条件付き計算', 'pt': 'Agregação'},
    subtitle: 'SUMAR.SI, CONTAR.SI y SUBTOTALES',
    subtitleByLocale: {'es': 'SUMAR.SI, CONTAR.SI y SUBTOTALES', 'en': 'SUMIF, COUNTIF, and SUBTOTAL', 'de': 'SUMMEWENN, ZÄHLENWENN und TEILERGEBNIS', 'fr': 'SOMME.SI, NB.SI et SOUS.TOTAL', 'ja': 'SUMIF、COUNTIF、SUBTOTAL', 'pt': 'SOMASE, CONT.SE e SUBTOTAL'},
    color: "#D97706",
    levels: [
      {ref: 'I1', title: 'SUMAR.SI', titleByLocale: {'es': 'SUMAR.SI', 'en': 'SUMIF', 'de': 'SUMMEWENN', 'fr': 'SOMME.SI', 'ja': 'SUMIF', 'pt': 'SOMASE'}},
      {ref: 'I2', title: 'CONTAR.SI', titleByLocale: {'es': 'CONTAR.SI', 'en': 'COUNTIF', 'de': 'ZÄHLENWENN', 'fr': 'NB.SI', 'ja': 'COUNTIF', 'pt': 'CONT.SE'}},
      {ref: 'I3', title: 'PROMEDIO.SI', titleByLocale: {'es': 'PROMEDIO.SI', 'en': 'AVERAGEIF', 'de': 'MITTELWERTWENN', 'fr': 'MOYENNE.SI', 'ja': 'AVERAGEIF', 'pt': 'MÉDIA.SE'}},
      {ref: 'I4', title: 'SUMAR.SI.CONJUNTO', titleByLocale: {'es': 'SUMAR.SI.CONJUNTO', 'en': 'SUMIFS', 'de': 'SUMMEWENNS', 'fr': 'SOMME.SI.ENS', 'ja': 'SUMIFS', 'pt': 'SOMASES'}},
      {ref: 'I5', title: 'CONTAR.SI.CONJUNTO', titleByLocale: {'es': 'CONTAR.SI.CONJUNTO', 'en': 'COUNTIFS', 'de': 'ZÄHLENWENNS', 'fr': 'NB.SI.ENS', 'ja': 'COUNTIFS', 'pt': 'CONT.SES'}},
      {ref: 'I6', title: 'SUMAPRODUCTO', titleByLocale: {'es': 'SUMAPRODUCTO', 'en': 'SUMPRODUCT', 'de': 'SUMMENPRODUKT', 'fr': 'SOMMEPROD', 'ja': 'SUMPRODUCT', 'pt': 'SOMARPRODUTO'}},
      {ref: 'I7', title: 'SUBTOTALES (con filtros},', titleByLocale: {'es': 'SUBTOTALES (con filtros},', 'en': 'SUBTOTAL (With Filters},', 'de': 'TEILERGEBNIS (mit Filtern},', 'fr': 'SOUS.TOTAL (avec filtres},', 'ja': 'SUBTOTAL（フィルター連動集計）', 'pt': 'SUBTOTAL (com filtros},'}},
      {ref: 'I8', title: 'Cofre', titleByLocale: {'es': 'Cofre', 'en': 'Chest', 'de': 'Schatztruhe', 'fr': 'Coffre', 'ja': '宝箱', 'pt': 'Baú'}, type: "chest"},
      {ref: 'I9', title: 'Jefe: Argumento numérico', titleByLocale: {'es': 'Jefe: Argumento numérico', 'en': 'Boss: Numeric Argument Error', 'de': 'Boss: Zahlenwertfehler', 'fr': 'Boss : Erreur d\'argument numérique', 'ja': 'ボス：数値エラー', 'pt': 'Chefe: Argumento numérico'}, type: "boss", bossError: '#¡NUM!', bossErrorByLocale: {'es': '#¡NUM!', 'en': '#NUM!', 'de': '#ZAHL!', 'fr': '#NOMBRE!', 'ja': '#NUM!', 'pt': '#NÚM!'}},
    ],
  },
  {
    column: 'J',
    title: 'Tablas Dinámicas',
    titleByLocale: {'es': 'Tablas Dinámicas', 'en': 'Pivot Tables', 'de': 'Pivot-Tabellen', 'fr': 'Tableaux croisés dynamiques', 'ja': 'ピボットテーブル', 'pt': 'Tabelas Dinâmicas'},
    subtitle: 'Cuadrantes, segmentaciones y reportes',
    subtitleByLocale: {'es': 'Cuadrantes, segmentaciones y reportes', 'en': 'Quadrants, slicers, and reporting', 'de': 'Felder, Datenschnitte und Berichte', 'fr': 'Champs, segments et rapports', 'ja': '4領域、スライサー、レポート作成', 'pt': 'Quadrantes, segmentações e relatórios'},
    color: "#6366F1",
    levels: [
      {ref: 'J1', title: 'Qué es y cuándo usarla', titleByLocale: {'es': 'Qué es y cuándo usarla', 'en': 'What It Is & When to Use It', 'de': 'Was es ist & Wann man es nutzt', 'fr': 'Qu\'est-ce que c\'est et quand l\'utiliser', 'ja': 'ピボットテーブルの基本と活用場面', 'pt': 'O que é e quando usar'}},
      {ref: 'J2', title: 'Crear la primera', titleByLocale: {'es': 'Crear la primera', 'en': 'Creating Your First Pivot Table', 'de': 'Die erste Pivot-Tabelle erstellen', 'fr': 'Créer son premier TCD', 'ja': '最初のピボットテーブルを作成する', 'pt': 'Criar a primeira tabela dinâmica'}},
      {ref: 'J3', title: 'Filas, columnas y valores', titleByLocale: {'es': 'Filas, columnas y valores', 'en': 'Rows, Columns, and Values', 'de': 'Zeilen, Spalten und Werte', 'fr': 'Lignes, colonnes et valeurs', 'ja': '行・列・値・フィルターの配置', 'pt': 'Linhas, colunas e valores'}},
      {ref: 'J4', title: 'Agrupar por fechas', titleByLocale: {'es': 'Agrupar por fechas', 'en': 'Grouping by Dates', 'de': 'Nach Datum gruppieren', 'fr': 'Grouper par dates', 'ja': '日付のグループ化（年・四半期・月）', 'pt': 'Agrupar por datas'}},
      {ref: 'J5', title: 'Segmentaciones (Slicers},', titleByLocale: {'es': 'Segmentaciones (Slicers},', 'en': 'Slicers & Timelines', 'de': 'Datenschnitte (Slicers},', 'fr': 'Segments (Slicers},', 'ja': 'スライサーとタイムライン', 'pt': 'Segmentações de dados (Slicers},'}},
      {ref: 'J6', title: 'Gráfico dinámico', titleByLocale: {'es': 'Gráfico dinámico', 'en': 'Pivot Chart', 'de': 'Pivot-Diagramm', 'fr': 'Graphique croisé dynamique', 'ja': 'ピボットグラフ', 'pt': 'Gráfico dinâmico'}},
      {ref: 'J7', title: 'Proyecto: Reporte de ventas', titleByLocale: {'es': 'Proyecto: Reporte de ventas', 'en': 'Project: Sales Report', 'de': 'Projekt: Verkaufsbericht', 'fr': 'Projet : Rapport des ventes', 'ja': 'プロジェクト：売上分析ダッシュボード', 'pt': 'Projeto: Relatório de vendas'}, type: "practice"},
    ],
  },
  {
    column: 'K',
    title: 'Funciones Dinámicas',
    titleByLocale: {'es': 'Funciones Dinámicas', 'en': 'Dynamic Arrays', 'de': 'Dynamische Arrays', 'fr': 'Tableaux dynamiques', 'ja': '動的配列関数 (スピル},', 'pt': 'Matrizes Dinâmicas'},
    subtitle: 'FILTRAR, ORDENAR, UNICOS y matrices',
    subtitleByLocale: {'es': 'FILTRAR, ORDENAR, UNICOS y matrices', 'en': 'FILTER, SORT, UNIQUE, and arrays', 'de': 'FILTER, SORTIEREN, EINDEUTIG und Matrizen', 'fr': 'FILTRE, TRIER, UNIQUE et matrices', 'ja': 'FILTER、SORT、UNIQUE、スピル配列', 'pt': 'FILTRO, CLASSIFICAR, ÚNICO e matrizes'},
    color: "#10B981",
    levels: [
      {ref: 'K1', title: 'FILTRAR', titleByLocale: {'es': 'FILTRAR', 'en': 'FILTER', 'de': 'FILTER', 'fr': 'FILTRE', 'ja': 'FILTER', 'pt': 'FILTRO'}},
      {ref: 'K2', title: 'ORDENAR', titleByLocale: {'es': 'ORDENAR', 'en': 'SORT', 'de': 'SORTIEREN', 'fr': 'TRIER', 'ja': 'SORT', 'pt': 'CLASSIFICAR'}},
      {ref: 'K3', title: 'UNICOS', titleByLocale: {'es': 'UNICOS', 'en': 'UNIQUE', 'de': 'EINDEUTIG', 'fr': 'UNIQUE', 'ja': 'UNIQUE', 'pt': 'ÚNICO'}},
      {ref: 'K4', title: 'SECUENCIA y TRANSPONER', titleByLocale: {'es': 'SECUENCIA y TRANSPONER', 'en': 'SEQUENCE and TRANSPOSE', 'de': 'SEQUENZ und MTRANS', 'fr': 'SEQUENCE et TRANSPOSER', 'ja': 'SEQUENCE と TRANSPOSE', 'pt': 'SEQUÊNCIA e TRANSPOR'}},
      {ref: 'K5', title: 'Jefe: Desbordamiento', titleByLocale: {'es': 'Jefe: Desbordamiento', 'en': 'Boss: Spill Overflow', 'de': 'Boss: Überlauffehler', 'fr': 'Boss : Erreur de propagation', 'ja': 'ボス：スピル（オーバーフロー）エラー', 'pt': 'Chefe: Erro de despejo'}, type: "boss", bossError: '#¡DESBORDAR!', bossErrorByLocale: {'es': '#¡DESBORDAR!', 'en': '#SPILL!', 'de': '#ÜBERLAUF!', 'fr': '#PROPAGATION!', 'ja': '#SPILL!', 'pt': '#DESPEJAR!'}},
      {ref: 'K6', title: 'LET (variables locales},', titleByLocale: {'es': 'LET (variables locales},', 'en': 'LET (Local Variables},', 'de': 'LET (Lokale Variablen},', 'fr': 'LET (Variables locales},', 'ja': 'LET（数式内の変数定義）', 'pt': 'LET (variáveis locais},'}},
      {ref: 'K7', title: 'Introducción a LAMBDA', titleByLocale: {'es': 'Introducción a LAMBDA', 'en': 'Intro to LAMBDA', 'de': 'Einführung in LAMBDA', 'fr': 'Introduction à LAMBDA', 'ja': 'LAMBDA 入門（自作関数）', 'pt': 'Introdução ao LAMBDA'}},
    ],
  },
  {
    column: 'L',
    title: 'Auditoría y Depuración',
    titleByLocale: {'es': 'Auditoría y Depuración', 'en': 'Auditing & Debugging', 'de': 'Formelüberwachung & Fehlersuche', 'fr': 'Audit et débogage', 'ja': '数式の検証とデバッグ', 'pt': 'Auditoria e Depuração'},
    subtitle: 'Precedentes, circulares y gran auditoría',
    subtitleByLocale: {'es': 'Precedentes, circulares y gran auditoría', 'en': 'Precedents, circular refs, and full audit', 'de': 'Spuren, Zirkelbezüge und Komplettprüfung', 'fr': 'Antécédents, dépendants et grand audit', 'ja': '参照元のトレース、循環参照、総合監査', 'pt': 'Precedentes, circulares e grande auditoria'},
    color: "#EF4444",
    levels: [
      {ref: 'L1', title: 'Rastrear precedentes y dependientes', titleByLocale: {'es': 'Rastrear precedentes y dependientes', 'en': 'Trace Precedents and Dependents', 'de': 'Spur zum Vorgänger / Nachfolger', 'fr': 'Repérer les antécédents et dépendants', 'ja': '参照元・参照先のトレース', 'pt': 'Rastrear precedentes e dependentes'}},
      {ref: 'L2', title: 'Evaluar fórmula paso a paso', titleByLocale: {'es': 'Evaluar fórmula paso a paso', 'en': 'Evaluate Formula Step-by-Step', 'de': 'Formel Schritt für Schritt auswerten', 'fr': 'Évaluer la formule pas à pas', 'ja': '数式の検証（ステップイン評価）', 'pt': 'Avaliar fórmula passo a passo'}},
      {ref: 'L3', title: 'Errores ocultos (números como texto},', titleByLocale: {'es': 'Errores ocultos (números como texto},', 'en': 'Hidden Errors (Numbers as Text},', 'de': 'Versteckte Fehler (Zahlen als Text},', 'fr': 'Erreurs cachées (Nombres stockés sous forme de texte},', 'ja': '潜むエラー（文字列として保存された数値）', 'pt': 'Erros ocultos (números como texto},'}},
      {ref: 'L4', title: 'Referencias circulares', titleByLocale: {'es': 'Referencias circulares', 'en': 'Circular References', 'de': 'Zirkelbezüge', 'fr': 'Références circulaires', 'ja': '循環参照', 'pt': 'Referências circulares'}},
      {ref: 'L5', title: 'Revisar una hoja ajena', titleByLocale: {'es': 'Revisar una hoja ajena', 'en': 'Reviewing Someone Else\'s Sheet', 'de': 'Fremde Tabellen prüfen', 'fr': 'Auditer une feuille inconnue', 'ja': '他人が作ったシートの検証実践', 'pt': 'Revisar planilha de terceiros'}, type: "practice"},
      {ref: 'L6', title: 'Jefe Final: La hoja rota', titleByLocale: {'es': 'Jefe Final: La hoja rota', 'en': 'Final Boss: The Broken Workbook', 'de': 'Endboss: Das zerstörte Arbeitsblatt', 'fr': 'Boss Final : La feuille corrompue', 'ja': '最終ボス：崩壊したスプレッドシート', 'pt': 'Chefe Final: A planilha corrompida'}, type: "boss", bossError: '#¡HOJA_ROTA!', bossErrorByLocale: {'es': '#¡HOJA_ROTA!', 'en': '#BROKEN_SHEET!', 'de': '#DEFEKTE_TABELLE!', 'fr': '#FEUILLE_ROMPUE!', 'ja': '#破損シート!', 'pt': '#PLANILHA_QUEBRADA!'}},
    ],
  },
];
