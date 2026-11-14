// Auto-generated from mobile Flutter FormulaDatabase & FormulaScenarios (100 formulas + 22 Windows/Mac shortcuts)
export type FormulaCategoryId =
  | "all"
  | "basics"
  | "lookup"
  | "logic"
  | "text"
  | "stats"
  | "date"
  | "financial";

export interface FormulaDoc {
  id: string;
  nameEn: string;
  category: Exclude<FormulaCategoryId, "all">;
  exampleFormula: string;
  nameByLocale: Record<string, string>;
  descriptionByLocale: Record<string, string>;
  syntaxByLocale: Record<string, string>;
  exampleContextByLocale: Record<string, string>;
  exampleResultByLocale: Record<string, string>;
  proTipByLocale: Record<string, string>;
  tags: string[];
}

export interface ExcelShortcutDoc {
  id: string;
  keysWindows: string[];
  keysMac: string[];
  actionByLocale: Record<string, string>;
  categoryByLocale: Record<string, string>;
  tipByLocale: Record<string, string>;
}

export interface SheetScenarioDoc {
  columns: string[];
  rows: string[][];
  targetCell: string;
  formulaEs: string;
  formulaEn: string;
  sourceCells: string[];
  resultValue: string;
  targetLabelByLocale: Record<string, string>;
}

export const FORMULAS_DATA: FormulaDoc[] = [
  {
    "id": "vlookup",
    "nameEn": "VLOOKUP",
    "category": "lookup",
    "exampleFormula": "=VLOOKUP(\"EMP-102\", A2:D50, 3, FALSE)",
    "nameByLocale": {
      "es": "BUSCARV",
      "en": "VLOOKUP",
      "de": "SVERWEIS",
      "fr": "RECHERCHEV",
      "ja": "VLOOKUP",
      "pt": "PROCV"
    },
    "descriptionByLocale": {
      "es": "Busca un valor en la primera columna izquierda de una tabla y devuelve el valor de otra columna en la misma fila.",
      "en": "Searches for a value in the first column of a table and returns a value in the same row from another column.",
      "de": "Sucht nach einem Wert in der ersten Spalte einer Tabelle und gibt den Wert aus derselben Zeile zurück.",
      "fr": "Cherche une valeur dans la première colonne d'un tableau et renvoie une valeur dans la même ligne.",
      "ja": "表の左端の列で特定の値を検索し、同じ行の指定した列の値を返します。",
      "pt": "Procura um valor na primeira coluna à esquerda de uma tabela e retorna o valor na mesma linha de outra coluna."
    },
    "syntaxByLocale": {
      "es": "=BUSCARV(valor_buscado, tabla, indicador_columnas, [ordenado])",
      "en": "=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])",
      "de": "=SVERWEIS(Suchkriterium; Matrix; Spaltenindex; [Bereich_Verweis])",
      "fr": "=RECHERCHEV(valeur_cherchée; table_matrice; no_index_col; [valeur_proche])",
      "ja": "=VLOOKUP(検索値, 範囲, 列番号, [検索方法])",
      "pt": "=PROCV(valor_procurado; matriz_tabela; núm_índice_coluna; [procurar_intervalo])"
    },
    "exampleContextByLocale": {
      "es": "A2:A50 contiene IDs de empleados, y columna 3 contiene el Salario.",
      "en": "A2:A50 contains employee IDs, column 3 holds the Salary.",
      "de": "A2:A50 enthält Mitarbeiter-IDs, Spalte 3 enthält das Gehalt.",
      "fr": "A2:A50 contient les identifiants d'employés, la colonne 3 contient le salaire.",
      "ja": "A2:A50に従業員IDがあり、列3に給与が入っています。",
      "pt": "A2:A50 contém IDs de funcionários e a coluna 3 contém o salário."
    },
    "exampleResultByLocale": {
      "es": "$2,450.00",
      "en": "$2,450.00",
      "de": "2.450,00 €",
      "fr": "2 450,00 €",
      "ja": "¥245,000",
      "pt": "R$ 2.450,00"
    },
    "proTipByLocale": {
      "es": "Usa siempre FALSO (o 0) al final para búsqueda exacta. ¡BUSCARV nunca puede mirar hacia su izquierda!",
      "en": "Always use FALSE (or 0) for exact match. Remember VLOOKUP cannot look to its left!",
      "de": "Verwende am Ende immer FALSCH (oder 0) für exakte Suche. SVERWEIS kann nicht nach links schauen!",
      "fr": "Utilisez toujours FAUX (ou 0) pour une correspondance exacte. RECHERCHEV ne regarde jamais à gauche !",
      "ja": "完全一致には必ず末尾にFALSE (0) を指定します。VLOOKUPは左側を参照できません！",
      "pt": "Use sempre FALSO (ou 0) para busca exata. Lembre-se que o PROCV nunca olha para a esquerda!"
    },
    "tags": [
      "buscar",
      "columna",
      "matriz",
      "vlookup",
      "referencia",
      "search"
    ]
  },
  {
    "id": "xlookup",
    "nameEn": "XLOOKUP",
    "category": "lookup",
    "exampleFormula": "=XLOOKUP(\"EMP-102\", B2:B50, A2:A50, \"No existe\")",
    "nameByLocale": {
      "es": "BUSCARX",
      "en": "XLOOKUP",
      "de": "XVERWEIS",
      "fr": "RECHERCHEX",
      "ja": "XLOOKUP",
      "pt": "PROCX"
    },
    "descriptionByLocale": {
      "es": "La sucesora moderna y más potente de BUSCARV. Busca en cualquier dirección (izquierda o derecha) sin romperse.",
      "en": "The modern successor to VLOOKUP. Searches in any direction (left or right) and does not break with column changes.",
      "de": "Der moderne Nachfolger von SVERWEIS. Sucht in jede Richtung (auch nach links) ohne Probleme.",
      "fr": "Le successeur moderne de RECHERCHEV. Cherche dans toutes les directions (gauche ou droite).",
      "ja": "VLOOKUPの後継となる強力な関数。左方向への検索も可能で列の挿入にも強いです。",
      "pt": "O sucessor moderno do PROCV. Procura em qualquer direção (esquerda ou direita) com total segurança."
    },
    "syntaxByLocale": {
      "es": "=BUSCARX(valor_buscado, matriz_buscada, matriz_devuelta, [si_no_se_encuentra])",
      "en": "=XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found])",
      "de": "=XVERWEIS(Suchkriterium; Suchmatrix; Rückgabematrix; [wenn_nicht_gefunden])",
      "fr": "=RECHERCHEX(valeur_cherchée; tableau_recherche; tableau_renvoyé; [si_non_trouvé])",
      "ja": "=XLOOKUP(検索値, 検索範囲, 戻り範囲, [見つからない場合])",
      "pt": "=PROCX(valor_pesquisa; matriz_pesquisa; matriz_retorno; [se_não_encontrada])"
    },
    "exampleContextByLocale": {
      "es": "Busca el ID en col B y devuelve el Nombre que está a su izquierda en col A.",
      "en": "Looks up the ID in col B and returns the Name to its left in col A.",
      "de": "Sucht ID in Spalte B und gibt Namen links davon in Spalte A zurück.",
      "fr": "Cherche l'ID en col B et renvoie le Nom situé à sa gauche en col A.",
      "ja": "列BでIDを検索し、その左側にある列Aの氏名を返します。",
      "pt": "Procura o ID na col B e devolve o Nome que está à sua esquerda na col A."
    },
    "exampleResultByLocale": {
      "es": "Laura Gómez",
      "en": "Laura Gomez",
      "de": "Laura Gomez",
      "fr": "Laura Gomez",
      "ja": "ローラ・ゴメス",
      "pt": "Laura Gomes"
    },
    "proTipByLocale": {
      "es": "Por defecto hace búsqueda exacta sin necesidad de poner FALSO, e incluye manejo de errores nativo.",
      "en": "Defaults to exact match without needing FALSE, plus has built-in error handling in arg 4.",
      "de": "Standardmäßig exakte Übereinstimmung, inklusive nativer Fehlerbehandlung im 4. Parameter.",
      "fr": "Par défaut en correspondance exacte sans devoir préciser FAUX, avec gestion d'erreurs intégrée.",
      "ja": "標準で完全一致検索となり、第4引数でエラー時の代替値を設定できます。",
      "pt": "Por padrão já faz busca exata sem precisar de FALSO e possui tratamento nativo de erro no 4º argumento."
    },
    "tags": [
      "xlookup",
      "buscarx",
      "moderno",
      "izquierda",
      "procx"
    ]
  },
  {
    "id": "index",
    "nameEn": "INDEX",
    "category": "lookup",
    "exampleFormula": "=INDEX(B2:D20, 5, 2)",
    "nameByLocale": {
      "es": "INDICE",
      "en": "INDEX",
      "de": "INDEX",
      "fr": "INDEX",
      "ja": "INDEX",
      "pt": "ÍNDICE"
    },
    "descriptionByLocale": {
      "es": "Devuelve el contenido de una celda específica indicando su número de fila y columna dentro de un rango.",
      "en": "Returns the value of a cell in a table based on the row and column intersection.",
      "de": "Gibt den Wert einer bestimmten Zelle basierend auf Zeilen- und Spaltennummer zurück.",
      "fr": "Renvoie la valeur d'une cellule dans un tableau selon son numéro de ligne et de colonne.",
      "ja": "指定した行番号と列番号の交点にあるセルの値を返します。",
      "pt": "Retorna o valor de uma célula específica indicando seu número de linha e coluna em um intervalo."
    },
    "syntaxByLocale": {
      "es": "=INDICE(matriz, num_fila, [num_columna])",
      "en": "=INDEX(array, row_num, [column_num])",
      "de": "=INDEX(Matrix; Zeile; [Spalte])",
      "fr": "=INDEX(matrice; no_lig; [no_col])",
      "ja": "=INDEX(範囲, 行番号, [列番号])",
      "pt": "=ÍNDICE(matriz; núm_linha; [núm_coluna])"
    },
    "exampleContextByLocale": {
      "es": "Fila 5 y columna 2 del rango de ventas.",
      "en": "Row 5 and column 2 of the sales matrix.",
      "de": "Zeile 5 und Spalte 2 der Verkaufsmatrix.",
      "fr": "Ligne 5 et colonne 2 du tableau des ventes.",
      "ja": "売上表の5行目・2列目のデータ。",
      "pt": "Linha 5 e coluna 2 do intervalo de vendas."
    },
    "exampleResultByLocale": {
      "es": "450 unidades",
      "en": "450 units",
      "de": "450 Einheiten",
      "fr": "450 unités",
      "ja": "450 個",
      "pt": "450 unidades"
    },
    "proTipByLocale": {
      "es": "Se combina frecuentemente con COINCIDIR (INDEX+MATCH) para buscar en cualquier dirección.",
      "en": "Frequently paired with MATCH (INDEX+MATCH) to create flexible 2D lookups.",
      "de": "Wird häufig mit VERGLEICH (INDEX+VERGLEICH) für flexible 2D-Suchen kombiniert.",
      "fr": "Souvent associé à EQUIV (INDEX+EQUIV) pour des recherches dynamiques bidirectionnelles.",
      "ja": "MATCH関数と組み合わせて(INDEX+MATCH)使うことで、自在な検索を実現できます。",
      "pt": "Frequentemente combinado com CORRESP (ÍNDICE+CORRESP) para buscar em qualquer direção."
    },
    "tags": [
      "index",
      "indice",
      "coincidir",
      "matriz",
      "posicion"
    ]
  },
  {
    "id": "match",
    "nameEn": "MATCH",
    "category": "lookup",
    "exampleFormula": "=MATCH(\"Celdi\", A1:A10, 0)",
    "nameByLocale": {
      "es": "COINCIDIR",
      "en": "MATCH",
      "de": "VERGLEICH",
      "fr": "EQUIV",
      "ja": "MATCH",
      "pt": "CORRESP"
    },
    "descriptionByLocale": {
      "es": "Busca un elemento en una lista y devuelve su posición numérica (en qué fila o columna está).",
      "en": "Searches for an item in a range and returns its relative position.",
      "de": "Sucht nach einem Element in einem Bereich und gibt dessen relative Position zurück.",
      "fr": "Cherche un élément dans une plage et renvoie sa position relative.",
      "ja": "指定した範囲内で項目を検索し、その相対的な位置番号を返します。",
      "pt": "Procura um item em um intervalo e retorna a sua posição relativa."
    },
    "syntaxByLocale": {
      "es": "=COINCIDIR(valor_buscado, matriz_buscada, [tipo_coincidencia])",
      "en": "=MATCH(lookup_value, lookup_array, [match_type])",
      "de": "=VERGLEICH(Suchkriterium; Suchmatrix; [Vergleichstyp])",
      "fr": "=EQUIV(valeur_cherchée; tableau_recherche; [type])",
      "ja": "=MATCH(検索値, 範囲, [照合の種類])",
      "pt": "=CORRESP(valor_procurado; matriz_procurada; [tipo_correspondência])"
    },
    "exampleContextByLocale": {
      "es": "Busca la palabra Celdi en el rango vertical A1:A10.",
      "en": "Searches for the word Celdi in column range A1:A10.",
      "de": "Sucht das Wort Celdi im Spaltenbereich A1:A10.",
      "fr": "Cherche le mot Celdi dans la colonne A1:A10.",
      "ja": "セル範囲 A1:A10 で Celdi という単語を検索します。",
      "pt": "Procura a palavra Celdi no intervalo A1:A10."
    },
    "exampleResultByLocale": {
      "es": "4 (4ta celda)",
      "en": "4 (4th cell)",
      "de": "4 (4. Zelle)",
      "fr": "4 (4e cellule)",
      "ja": "4 (4番目のセル)",
      "pt": "4 (4ª célula)"
    },
    "proTipByLocale": {
      "es": "El tercer parámetro casi siempre debe ser 0 para exigir coincidencia exacta.",
      "en": "The third argument should almost always be 0 for exact matching.",
      "de": "Das 3. Argument sollte fast immer 0 sein für exakte Übereinstimmung.",
      "fr": "Le troisième paramètre doit presque toujours être 0 pour l'exactitude.",
      "ja": "完全一致を求める場合は、第3引数を必ず 0 に設定します。",
      "pt": "O terceiro argumento deve ser quase sempre 0 para exigir correspondência exata."
    },
    "tags": [
      "match",
      "coincidir",
      "posicion",
      "vergleich",
      "corresp"
    ]
  },
  {
    "id": "xmatch",
    "nameEn": "XMATCH",
    "category": "lookup",
    "exampleFormula": "=XMATCH(\"Q4\", A1:A20, 0, -1)",
    "nameByLocale": {
      "es": "COINCIDIRX",
      "en": "XMATCH",
      "de": "XVERGLEICH",
      "fr": "EQUIVX",
      "ja": "XMATCH",
      "pt": "CORRESPX"
    },
    "descriptionByLocale": {
      "es": "Versión moderna de COINCIDIR. Por defecto busca coincidencia exacta y permite buscar de abajo hacia arriba.",
      "en": "Modern version of MATCH. Defaults to exact match and can search in reverse order.",
      "de": "Moderne Version von VERGLEICH. Standardmäßig exakt und erlaubt Rückwärtssuche.",
      "fr": "Version moderne d'EQUIV. Exacte par défaut et capable de chercher en sens inverse.",
      "ja": "MATCHの後継関数。既定で完全一致検索となり、末尾からの逆順検索も可能です。",
      "pt": "Versão moderna do CORRESP. Padrão exato e suporta pesquisa de baixo para cima."
    },
    "syntaxByLocale": {
      "es": "=COINCIDIRX(valor_buscado, matriz_buscada, [modo_coincidencia], [modo_busqueda])",
      "en": "=XMATCH(lookup_value, lookup_array, [match_mode], [search_mode])",
      "de": "=XVERGLEICH(Suchkriterium; Suchmatrix; [Vergleichsmodus]; [Suchmodus])",
      "fr": "=EQUIVX(valeur_cherchée; tableau_recherche; [mode_correspondance]; [mode_recherche])",
      "ja": "=XMATCH(検索値, 検索範囲, [一致モード], [検索モード])",
      "pt": "=CORRESPX(valor_pesquisa; matriz_pesquisa; [modo_correspondência]; [modo_pesquisa])"
    },
    "exampleContextByLocale": {
      "es": "Busca la última aparición de Q4 comenzando desde el final (-1).",
      "en": "Finds the last occurrence of Q4 by searching backwards (-1).",
      "de": "Findet das letzte Vorkommen von Q4 durch Rückwärtssuche (-1).",
      "fr": "Trouve la dernière occurrence de Q4 en cherchant à l'envers (-1).",
      "ja": "末尾から逆順検索(-1)して最新のQ4の位置を特定します。",
      "pt": "Encontra a última ocorrência de Q4 buscando de trás para frente (-1)."
    },
    "exampleResultByLocale": {
      "es": "18",
      "en": "18",
      "de": "18",
      "fr": "18",
      "ja": "18",
      "pt": "18"
    },
    "proTipByLocale": {
      "es": "Configura modo_busqueda en -1 para encontrar siempre el registro más reciente ingresado al final de una lista.",
      "en": "Set search_mode to -1 to easily find the most recent record added at the bottom.",
      "de": "Setze Suchmodus auf -1, um den neuesten Datensatz am Ende einer Tabelle zu finden.",
      "fr": "Réglez le mode_recherche sur -1 pour repérer le dernier enregistrement saisi.",
      "ja": "検索モードを「-1」にすると、リストの最下部に追記された最新データを即座に取得できます。",
      "pt": "Defina o modo_pesquisa como -1 para achar facilmente o registro mais recente adicionado no fim."
    },
    "tags": [
      "xmatch",
      "coincidirx",
      "reversa",
      "posicion",
      "moderno"
    ]
  },
  {
    "id": "filter",
    "nameEn": "FILTER",
    "category": "lookup",
    "exampleFormula": "=FILTER(A2:C20, B2:B20=\"Ventas\", \"Sin datos\")",
    "nameByLocale": {
      "es": "FILTRAR",
      "en": "FILTER",
      "de": "FILTERN",
      "fr": "FILTRE",
      "ja": "FILTER",
      "pt": "FILTRO"
    },
    "descriptionByLocale": {
      "es": "Filtra un rango o matriz según las condiciones que definas y desborda los resultados dinámicamente.",
      "en": "Filters a range of data based on criteria you define and spills results dynamically.",
      "de": "Filtert einen Datenbereich anhand benutzerdefinierter Kriterien dynamisch.",
      "fr": "Filtre une plage de données selon les critères définis et s'étend dynamiquement.",
      "ja": "定義した条件に基づいてデータを動的に抽出し、スピルして展開します。",
      "pt": "Filtra um intervalo de dados com base em critérios definidos e expande os resultados dinamicamente."
    },
    "syntaxByLocale": {
      "es": "=FILTRAR(matriz, incluir, [si_vacio])",
      "en": "=FILTER(array, include, [if_empty])",
      "de": "=FILTERN(Matrix; einschließen; [wenn_leer])",
      "fr": "=FILTRE(tableau; inclure; [si_vide])",
      "ja": "=FILTER(配列, 含む, [空の場合])",
      "pt": "=FILTRO(matriz; incluir; [se_vazia])"
    },
    "exampleContextByLocale": {
      "es": "Filtra empleados donde el departamento en columna B sea Ventas.",
      "en": "Filters employees whose department in column B is Sales.",
      "de": "Filtert Mitarbeiter, deren Abteilung in Spalte B Vertrieb ist.",
      "fr": "Filtre les employés dont le département en col B est Ventes.",
      "ja": "列Bの部署が「Ventas(営業)」である行を抽出します。",
      "pt": "Filtra funcionários cujo departamento na coluna B seja Vendas."
    },
    "exampleResultByLocale": {
      "es": "Tabla filtrada en cascada",
      "en": "Dynamically spilled table",
      "de": "Dynamisch gefilterte Tabelle",
      "fr": "Tableau dynamique filtré",
      "ja": "展開された抽出データ表",
      "pt": "Tabela filtrada dinamicamente"
    },
    "proTipByLocale": {
      "es": "Usa el asterisco (*) para lógica Y (AND) y el signo más (+) para lógica O (OR) entre condiciones.",
      "en": "Use asterisk (*) for AND logic and plus (+) for OR logic between criteria.",
      "de": "Verwende das Sternchen (*) für UND-Logik und Plus (+) für ODER-Logik.",
      "fr": "Utilisez l'astérisque (*) pour la logique ET et le signe plus (+) pour la logique OU.",
      "ja": "条件のAND結合には「*」、OR結合には「+」を使用します。",
      "pt": "Use asterisco (*) para condição E (AND) e mais (+) para condição OU (OR)."
    },
    "tags": [
      "filter",
      "filtrar",
      "dinamico",
      "matriz",
      "spill"
    ]
  },
  {
    "id": "unique",
    "nameEn": "UNIQUE",
    "category": "lookup",
    "exampleFormula": "=UNIQUE(A2:A100)",
    "nameByLocale": {
      "es": "UNICOS",
      "en": "UNIQUE",
      "de": "EINDEUTIG",
      "fr": "UNIQUE",
      "ja": "UNIQUE",
      "pt": "ÚNICO"
    },
    "descriptionByLocale": {
      "es": "Devuelve los valores únicos y sin duplicados de una lista o rango de celdas.",
      "en": "Returns a list of unique values from a list or range.",
      "de": "Gibt eine Liste eindeutiger Werte aus einem Bereich ohne Duplikate zurück.",
      "fr": "Renvoie les valeurs uniques d'une liste sans doublons.",
      "ja": "範囲または配列から重複を除いた一意の値を返します。",
      "pt": "Retorna uma lista de valores únicos e sem duplicatas de um intervalo."
    },
    "syntaxByLocale": {
      "es": "=UNICOS(matriz, [por_columna], [solo_una_vez])",
      "en": "=UNIQUE(array, [by_col], [exactly_once])",
      "de": "=EINDEUTIG(Matrix; [nach_Spalte]; [genau_einmal])",
      "fr": "=UNIQUE(matrice; [par_col]; [exactement_une_fois])",
      "ja": "=UNIQUE(配列, [列の比較], [1回のみ出現])",
      "pt": "=ÚNICO(matriz; [por_coluna]; [exatamente_uma_vez])"
    },
    "exampleContextByLocale": {
      "es": "A2:A100 contiene ciudades con muchas repeticiones.",
      "en": "A2:A100 contains cities with repeated entries.",
      "de": "A2:A100 enthält Städte mit vielen Duplikaten.",
      "fr": "A2:A100 contient des villes avec des doublons.",
      "ja": "A2:A100に重複を含む都市名リストがあります。",
      "pt": "A2:A100 contém cidades com muitas repetições."
    },
    "exampleResultByLocale": {
      "es": "Madrid, Barcelona, Valencia...",
      "en": "Madrid, Barcelona, Valencia...",
      "de": "Berlin, München, Hamburg...",
      "fr": "Paris, Lyon, Marseille...",
      "ja": "東京, 大阪, 名古屋...",
      "pt": "Lisboa, Porto, Coimbra..."
    },
    "proTipByLocale": {
      "es": "Combínalo con ORDENAR (SORT) para obtener listas desplegables limpias y ordenadas alfabéticamente.",
      "en": "Wrap with SORT to get an alphabetized, deduplicated list for dropdown menus.",
      "de": "Mit SORTIEREN umschließen für saubere, alphabetische Dropdown-Listen.",
      "fr": "Associez-le à TRIER pour générer des listes déroulantes parfaitement ordonnées.",
      "ja": "SORT関数と組み合わせると、ドロップダウンリスト用の一意で整列された一覧が作れます。",
      "pt": "Combine com CLASSIFICAR para obter listas suspensas limpas e ordenadas."
    },
    "tags": [
      "unique",
      "unicos",
      "duplicados",
      "distinct",
      "eindeutig"
    ]
  },
  {
    "id": "sort",
    "nameEn": "SORT",
    "category": "lookup",
    "exampleFormula": "=SORT(A2:B20, 2, -1)",
    "nameByLocale": {
      "es": "ORDENAR",
      "en": "SORT",
      "de": "SORTIEREN",
      "fr": "TRIER",
      "ja": "SORT",
      "pt": "CLASSIFICAR"
    },
    "descriptionByLocale": {
      "es": "Ordena el contenido de un rango o matriz de datos de forma ascendente o descendente mediante fórmula.",
      "en": "Sorts the contents of a range or array dynamically.",
      "de": "Sortiert den Inhalt eines Bereichs oder einer Matrix auf- oder absteigend per Formel.",
      "fr": "Trie dynamiquement le contenu d'une plage ou d'un tableau.",
      "ja": "セル範囲や配列のデータを昇順または降順に動的並べ替えします。",
      "pt": "Classifica o conteúdo de um intervalo ou matriz de forma dinâmica."
    },
    "syntaxByLocale": {
      "es": "=ORDENAR(matriz, [criterio_ordenación], [orden], [por_columna])",
      "en": "=SORT(array, [sort_index], [sort_order], [by_col])",
      "de": "=SORTIEREN(Matrix; [Sortierindex]; [Sortierreihenfolge]; [nach_Spalte])",
      "fr": "=TRIER(tableau; [index_tri]; [ordre_tri]; [par_col])",
      "ja": "=SORT(配列, [並べ替え順序の基準], [順序], [列の比較])",
      "pt": "=CLASSIFICAR(matriz; [índice_classificação]; [ordem]; [por_coluna])"
    },
    "exampleContextByLocale": {
      "es": "Ordena productos y ventas por la columna 2 en orden descendente (-1).",
      "en": "Sorts products and sales by column 2 in descending order (-1).",
      "de": "Sortiert Produkte und Umsatz nach Spalte 2 absteigend (-1).",
      "fr": "Trie les produits et ventes selon la col 2 par ordre décroissant (-1).",
      "ja": "商品と売上データを列2(売上)の降順(-1)で並べ替えます。",
      "pt": "Classifica produtos e vendas pela coluna 2 em ordem decrescente (-1)."
    },
    "exampleResultByLocale": {
      "es": "Tabla ordenada de mayor a menor",
      "en": "Table sorted from highest to lowest",
      "de": "Tabelle absteigend sortiert",
      "fr": "Tableau trié du plus grand au plus petit",
      "ja": "降順に整列された表",
      "pt": "Tabela ordenada do maior para o menor"
    },
    "proTipByLocale": {
      "es": "1 significa orden ascendente (A-Z, 0-9) y -1 significa orden descendente (Z-A, 9-0).",
      "en": "1 means ascending (A-Z, 0-9) and -1 means descending (Z-A, 9-0).",
      "de": "1 steht für aufsteigend (A-Z, 0-9) und -1 für absteigend (Z-A, 9-0).",
      "fr": "1 indique un ordre croissant et -1 un ordre décroissant.",
      "ja": "「1」は昇順(A-Z、小→大)、「-1」は降順(Z-A、大→小)を指定します。",
      "pt": "1 significa ascendente (A-Z, 0-9) e -1 significa descendente (Z-A, 9-0)."
    },
    "tags": [
      "sort",
      "ordenar",
      "ascendente",
      "descendente",
      "trier"
    ]
  },
  {
    "id": "hlookup",
    "nameEn": "HLOOKUP",
    "category": "lookup",
    "exampleFormula": "=HLOOKUP(\"Q3\", B1:M10, 4, FALSE)",
    "nameByLocale": {
      "es": "BUSCARH",
      "en": "HLOOKUP",
      "de": "WVERWEIS",
      "fr": "RECHERCHEH",
      "ja": "HLOOKUP",
      "pt": "PROCH"
    },
    "descriptionByLocale": {
      "es": "Busca un valor en la primera fila horizontal de una tabla y devuelve el valor de la fila especificada.",
      "en": "Searches for a value in the top row of a table and returns a value in the same column from a specified row.",
      "de": "Sucht in der obersten Zeile einer Tabelle und gibt den Wert in derselben Spalte zurück.",
      "fr": "Cherche une valeur dans la première ligne d'un tableau et renvoie une valeur dans la même colonne.",
      "ja": "表の最上行で特定の値を検索し、同じ列の指定行にある値を返します。",
      "pt": "Procura um valor na linha superior de uma tabela e retorna o valor na mesma coluna de uma linha indicada."
    },
    "syntaxByLocale": {
      "es": "=BUSCARH(valor_buscado, tabla, indicador_filas, [ordenado])",
      "en": "=HLOOKUP(lookup_value, table_array, row_index_num, [range_lookup])",
      "de": "=WVERWEIS(Suchkriterium; Matrix; Zeilenindex; [Bereich_Verweis])",
      "fr": "=RECHERCHEH(valeur_cherchée; table_matrice; no_index_lig; [valeur_proche])",
      "ja": "=HLOOKUP(検索値, 範囲, 行番号, [検索方法])",
      "pt": "=PROCH(valor_procurado; matriz_tabela; núm_índice_linha; [procurar_intervalo])"
    },
    "exampleContextByLocale": {
      "es": "Fila 1 tiene trimestres y la fila 4 tiene las ventas netas.",
      "en": "Row 1 has quarters and row 4 has net sales.",
      "de": "Zeile 1 enthält Quartale und Zeile 4 Nettoumsätze.",
      "fr": "La ligne 1 contient les trimestres et la ligne 4 les ventes nettes.",
      "ja": "1行目に四半期(Q1~Q4)、4行目に売上額が入っています。",
      "pt": "A linha 1 contém trimestres e a linha 4 as vendas líquidas."
    },
    "exampleResultByLocale": {
      "es": "$12,400",
      "en": "$12,400",
      "de": "12.400 €",
      "fr": "12 400 €",
      "ja": "¥1,240,000",
      "pt": "R$ 12.400"
    },
    "proTipByLocale": {
      "es": "Es la versión horizontal de BUSCARV. Ideal para tablas estructuradas por columnas con encabezados en filas.",
      "en": "Horizontal counterpart of VLOOKUP. Great for reports with horizontal period headers.",
      "de": "Das horizontale Gegenstück zu SVERWEIS, ideal für horizontale Datensätze.",
      "fr": "Le pendant horizontal de RECHERCHEV, parfait pour les tableaux à en-têtes horizontaux.",
      "ja": "VLOOKUPの横方向版です。横長にデータが並ぶ月別レポート等に便利です。",
      "pt": "É a versão horizontal do PROCV. Ideal para tabelas com cabeçalhos em colunas horizontais."
    },
    "tags": [
      "hlookup",
      "buscarh",
      "horizontal",
      "filas"
    ]
  },
  {
    "id": "choose",
    "nameEn": "CHOOSE",
    "category": "lookup",
    "exampleFormula": "=CHOOSE(2, \"Bajo\", \"Medio\", \"Alto\")",
    "nameByLocale": {
      "es": "ELEGIR",
      "en": "CHOOSE",
      "de": "WAHL",
      "fr": "CHOISIR",
      "ja": "CHOOSE",
      "pt": "ESCOLHER"
    },
    "descriptionByLocale": {
      "es": "Elige un valor o acción de una lista de argumentos según un número de índice proporcionado.",
      "en": "Chooses a value or action from a list of arguments based on an index number.",
      "de": "Wählt einen Wert aus einer Liste von Argumenten anhand einer Indexnummer aus.",
      "fr": "Choisit une valeur parmi une liste d'arguments en fonction d'un numéro d'index.",
      "ja": "インデックス番号に基づいて、引数リストから特定の値や処理を選択します。",
      "pt": "Escolhe um valor de uma lista de argumentos com base em um número de índice."
    },
    "syntaxByLocale": {
      "es": "=ELEGIR(núm_índice, valor1, [valor2], ...)",
      "en": "=CHOOSE(index_num, value1, [value2], ...)",
      "de": "=WAHL(Index; Wert1; [Wert2]; ...)",
      "fr": "=CHOISIR(no_index; valeur1; [valeur2]; ...)",
      "ja": "=CHOOSE(インデックス, 値1, [値2], ...)",
      "pt": "=ESCOLHER(núm_índice; valor1; [valor2]; ...)"
    },
    "exampleContextByLocale": {
      "es": "Selecciona el segundo nivel de prioridad.",
      "en": "Selects the second priority level.",
      "de": "Wählt die zweite Prioritätsstufe.",
      "fr": "Sélectionne le deuxième niveau de priorité.",
      "ja": "2番目の優先度レベルを選択。",
      "pt": "Seleciona o segundo nível de prioridade."
    },
    "exampleResultByLocale": {
      "es": "Medio",
      "en": "Medium",
      "de": "Mittel",
      "fr": "Moyen",
      "ja": "中",
      "pt": "Médio"
    },
    "proTipByLocale": {
      "es": "Excelente para modelos financieros donde cambias de escenario (1=Pesimista, 2=Base, 3=Optimista).",
      "en": "Super useful for financial scenario modeling (1=Worst Case, 2=Base Case, 3=Best Case).",
      "de": "Perfekt für Finanzmodelle mit Szenarien (1=Best, 2=Base, 3=Worst).",
      "fr": "Génial pour basculer entre scénarios financiers (1=Pessimiste, 2=Base, 3=Optimiste).",
      "ja": "財務モデルのシナリオ切り替え(1=悲観, 2=標準, 3=楽観)に非常に効果的です。",
      "pt": "Excelente para modelos financeiros onde você alterna cenários (1=Pessimista, 2=Base, 3=Otimista)."
    },
    "tags": [
      "choose",
      "elegir",
      "escenarios",
      "indice",
      "opciones"
    ]
  },
  {
    "id": "offset",
    "nameEn": "OFFSET",
    "category": "lookup",
    "exampleFormula": "=OFFSET(A1, 3, 2)",
    "nameByLocale": {
      "es": "DESREF",
      "en": "OFFSET",
      "de": "BEREICH.VERSCHIEBEN",
      "fr": "DECALER",
      "ja": "OFFSET",
      "pt": "DESLOC"
    },
    "descriptionByLocale": {
      "es": "Devuelve una referencia a un rango desplazado un número determinado de filas y columnas desde una celda base.",
      "en": "Returns a reference to a range that is a specified number of rows and columns from a cell.",
      "de": "Gibt einen Zellbezug zurück, der um Zeilen und Spalten verschoben ist.",
      "fr": "Renvoie une référence déplacée d'un nombre donné de lignes et colonnes.",
      "ja": "基準セルから指定された行数と列数だけシフトした位置にある範囲の参照を返します。",
      "pt": "Retorna uma referência para um intervalo deslocado por linhas e colunas a partir de uma célula base."
    },
    "syntaxByLocale": {
      "es": "=DESREF(ref, filas, columnas, [alto], [ancho])",
      "en": "=OFFSET(reference, rows, cols, [height], [width])",
      "de": "=BEREICH.VERSCHIEBEN(Bezug; Zeilen; Spalten; [Höhe]; [Breite])",
      "fr": "=DECALER(réf; lignes; colonnes; [hauteur]; [largeur])",
      "ja": "=OFFSET(基準, 行数, 列数, [高さ], [幅])",
      "pt": "=DESLOC(referência; linhas; colunas; [altura]; [largura])"
    },
    "exampleContextByLocale": {
      "es": "Se desplaza 3 filas abajo y 2 columnas a la derecha desde A1 (apunta a C4).",
      "en": "Moves 3 rows down and 2 columns right from A1 (points to C4).",
      "de": "Verschiebt sich um 3 Zeilen nach unten und 2 Spalten nach rechts von A1 (ergibt C4).",
      "fr": "Se déplace de 3 lignes en bas et 2 colonnes à droite depuis A1 (cible C4).",
      "ja": "A1から下に3行、右に2列移動したセル(C4)を参照。",
      "pt": "Desloca 3 linhas para baixo e 2 colunas para a direita a partir de A1 (C4)."
    },
    "exampleResultByLocale": {
      "es": "Valor en C4",
      "en": "Value in C4",
      "de": "Wert in C4",
      "fr": "Valeur en C4",
      "ja": "C4の値",
      "pt": "Valor em C4"
    },
    "proTipByLocale": {
      "es": "Es volátil. Para rangos dinámicos modernos, se suele preferir INDEX o funciones de matrices dinámicas.",
      "en": "It is volatile. For modern dynamic ranges, INDEX or dynamic arrays are often preferred.",
      "de": "Ist volatil. Für moderne dynamische Bereiche wird oft INDEX bevorzugt.",
      "fr": "Fonction volatile. Pour les plages dynamiques modernes, préférez INDEX.",
      "ja": "揮発性関数のため、現代のExcelではINDEX関数で代替する構成が推奨されます。",
      "pt": "É volátil. Para intervalos dinâmicos modernos, recomenda-se ÍNDICE."
    },
    "tags": [
      "offset",
      "desref",
      "desplazar",
      "rango",
      "volatil"
    ]
  },
  {
    "id": "indirect",
    "nameEn": "INDIRECT",
    "category": "lookup",
    "exampleFormula": "=INDIRECT(\"Ventas_2026!B5\")",
    "nameByLocale": {
      "es": "INDIRECTO",
      "en": "INDIRECT",
      "de": "INDIREKT",
      "fr": "INDIRECT",
      "ja": "INDIRECT",
      "pt": "INDIRETO"
    },
    "descriptionByLocale": {
      "es": "Convierte un texto con formato de coordenada de celda o nombre de hoja en una referencia viva y funcional.",
      "en": "Returns the reference specified by a text string.",
      "de": "Gibt den Bezug zurück, der durch eine Textzeichenfolge angegeben wird.",
      "fr": "Renvoie la référence spécifiée par une chaîne de texte.",
      "ja": "文字列として指定されたセル参照やシート名を実際の参照に変換します。",
      "pt": "Converte um texto com formato de coordenada ou nome de folha em uma referência funcional."
    },
    "syntaxByLocale": {
      "es": "=INDIRECTO(ref_texto, [a1])",
      "en": "=INDIRECT(ref_text, [a1])",
      "de": "=INDIREKT(Bezug_Text; [A1])",
      "fr": "=INDIRECT(réf_texte; [a1])",
      "ja": "=INDIRECT(参照文字列, [参照形式])",
      "pt": "=INDIRETO(ref_texto; [a1])"
    },
    "exampleContextByLocale": {
      "es": "Lee la celda B5 de la pestaña Ventas_2026 de forma dinámica.",
      "en": "Dynamically references cell B5 on sheet Ventas_2026.",
      "de": "Liest Zelle B5 im Tabellenblatt Ventas_2026 dynamisch aus.",
      "fr": "Lit dynamiquement la cellule B5 de l'onglet Ventas_2026.",
      "ja": "「Ventas_2026」シートのセルB5を動的に参照します。",
      "pt": "Lê a célula B5 da planilha Ventas_2026 de modo dinâmico."
    },
    "exampleResultByLocale": {
      "es": "Valor en B5",
      "en": "Value in B5",
      "de": "Wert in B5",
      "fr": "Valeur en B5",
      "ja": "B5の値",
      "pt": "Valor em B5"
    },
    "proTipByLocale": {
      "es": "Es volátil. Esencial para listas desplegables dependientes creadas con Validación de Datos.",
      "en": "It is volatile. Essential for dependent dropdown lists in Data Validation.",
      "de": "Ist eine volatile Funktion. Unverzichtbar für abhängige Dropdown-Listen.",
      "fr": "Fonction volatile. Essentielle pour les listes dépendantes dans la Validation de données.",
      "ja": "連動ドロップダウンリストの作成において無類の強さを発揮します。",
      "pt": "É uma função volátil. Indispensável para criar listas suspensas dependentes."
    },
    "tags": [
      "indirect",
      "indirecto",
      "volatil",
      "referencia",
      "dinamico"
    ]
  },
  {
    "id": "transpose",
    "nameEn": "TRANSPOSE",
    "category": "lookup",
    "exampleFormula": "=TRANSPOSE(A1:D2)",
    "nameByLocale": {
      "es": "TRANSPONER",
      "en": "TRANSPOSE",
      "de": "MTRANS",
      "fr": "TRANSPOSER",
      "ja": "TRANSPOSE",
      "pt": "TRANSPOR"
    },
    "descriptionByLocale": {
      "es": "Gira la orientación de una matriz: convierte filas en columnas y columnas en filas de forma dinámica.",
      "en": "Rotates orientation: flips rows into columns and columns into rows dynamically.",
      "de": "Kippt die Ausrichtung: wandelt Zeilen in Spalten und Spalten in Zeilen um.",
      "fr": "Bascule l'orientation : convertit lignes en colonnes et inversement.",
      "ja": "表の行と列の配置を動的に入れ替えて転置します。",
      "pt": "Gira a orientação de uma matriz: converte linhas em colunas e vice-versa de modo dinâmico."
    },
    "syntaxByLocale": {
      "es": "=TRANSPONER(matriz)",
      "en": "=TRANSPOSE(array)",
      "de": "=MTRANS(Matrix)",
      "fr": "=TRANSPOSER(matrice)",
      "ja": "=TRANSPOSE(配列)",
      "pt": "=TRANSPOR(matriz)"
    },
    "exampleContextByLocale": {
      "es": "Convierte una tabla horizontal de 2 filas × 4 columnas en 4 filas × 2 columnas.",
      "en": "Flips a 2 rows × 4 cols table into a vertical 4 rows × 2 cols table.",
      "de": "Wandelt 2 Zeilen × 4 Spalten in 4 Zeilen × 2 Spalten um.",
      "fr": "Transforme 2 lignes × 4 colonnes en 4 lignes × 2 colonnes.",
      "ja": "横長(2行×4列)のデータを縦長(4行×2列)に変換します。",
      "pt": "Converte uma tabela de 2 linhas × 4 colunas em 4 linhas × 2 colunas."
    },
    "exampleResultByLocale": {
      "es": "Matriz invertida",
      "en": "Transposed array",
      "de": "Transponierte Matrix",
      "fr": "Matrice inversée",
      "ja": "転置された配列",
      "pt": "Matriz transposta"
    },
    "proTipByLocale": {
      "es": "En Excel moderno desborda automáticamente hacia abajo y a la derecha sin necesidad de Ctrl+Shift+Enter.",
      "en": "In modern Excel, it automatically spills without needing old Ctrl+Shift+Enter.",
      "de": "Spillt in modernem Excel automatisch ohne Alt+Strg+Eingabe.",
      "fr": "Se propage automatiquement dans Excel moderne sans combinaison complexe.",
      "ja": "現在のExcelならスピル機能で自動展開されるため、CSE配列数式は不要です。",
      "pt": "No Excel moderno expande automaticamente sem precisar de combinações legadas."
    },
    "tags": [
      "transpose",
      "transponer",
      "girar",
      "matriz",
      "filas",
      "columnas"
    ]
  },
  {
    "id": "sum",
    "nameEn": "SUM",
    "category": "basics",
    "exampleFormula": "=SUM(A1:A50)",
    "nameByLocale": {
      "es": "SUMA",
      "en": "SUM",
      "de": "SUMME",
      "fr": "SOMME",
      "ja": "SUM",
      "pt": "SOMA"
    },
    "descriptionByLocale": {
      "es": "Suma todos los números de un rango de celdas continuo o discontinuo.",
      "en": "Adds all numbers in a range of cells.",
      "de": "Addiert alle Zahlen in einem Zellbereich.",
      "fr": "Additionne tous les nombres d'une plage de cellules.",
      "ja": "セル範囲に含まれるすべての数値を合計します。",
      "pt": "Soma todos os números de um intervalo de células."
    },
    "syntaxByLocale": {
      "es": "=SUMA(número1, [número2], ...)",
      "en": "=SUM(number1, [number2], ...)",
      "de": "=SUMME(Zahl1; [Zahl2]; ...)",
      "fr": "=SOMME(nombre1; [nombre2]; ...)",
      "ja": "=SUM(数値1, [数値2], ...)",
      "pt": "=SOMA(número1; [número2]; ...)"
    },
    "exampleContextByLocale": {
      "es": "Suma los ingresos totales en la columna A.",
      "en": "Adds all total revenue values in column A.",
      "de": "Addiert die Gesamteinnahmen in Spalte A.",
      "fr": "Calcule le total des revenus en colonne A.",
      "ja": "列Aにあるすべての売上金額を合算します。",
      "pt": "Soma as receitas totais na coluna A."
    },
    "exampleResultByLocale": {
      "es": "12,450",
      "en": "12,450",
      "de": "12.450",
      "fr": "12 450",
      "ja": "12,450",
      "pt": "12.450"
    },
    "proTipByLocale": {
      "es": "Pulsa Alt + = en Windows o Cmd + Shift + T en Mac para insertar la Autosuma al instante.",
      "en": "Press Alt + = on Windows or Cmd + Shift + T on Mac for instant AutoSum.",
      "de": "Drücke Alt + = unter Windows oder Cmd + Shift + T auf dem Mac für automatische Summe.",
      "fr": "Appuyez sur Alt + = sous Windows ou Cmd + Shift + T sur Mac pour l'autosomme immédiate.",
      "ja": "Windowsなら Alt + =、Macなら Cmd + Shift + T で瞬時にオートSUMを挿入できます。",
      "pt": "Pressione Alt + = no Windows ou Cmd + Shift + T no Mac para inserir a Autosoma na hora."
    },
    "tags": [
      "sum",
      "suma",
      "autosuma",
      "matematicas",
      "somme",
      "summe"
    ]
  },
  {
    "id": "sumif",
    "nameEn": "SUMIF",
    "category": "basics",
    "exampleFormula": "=SUMIF(B2:B50, \">1000\", C2:C50)",
    "nameByLocale": {
      "es": "SUMAR.SI",
      "en": "SUMIF",
      "de": "SUMMEWENN",
      "fr": "SOMME.SI",
      "ja": "SUMIF",
      "pt": "SOMASE"
    },
    "descriptionByLocale": {
      "es": "Suma las celdas de un rango que cumplen con un criterio específico determinado.",
      "en": "Adds the cells specified by a given condition or criterion.",
      "de": "Addiert die Zellen, die ein bestimmtes Kriterium erfüllen.",
      "fr": "Additionne les cellules répondant à une condition donnée.",
      "ja": "指定した条件を満たすセルの値だけを合計します。",
      "pt": "Soma as células de um intervalo que atendem a um critério especificado."
    },
    "syntaxByLocale": {
      "es": "=SUMAR.SI(rango, criterio, [rango_suma])",
      "en": "=SUMIF(range, criteria, [sum_range])",
      "de": "=SUMMEWENN(Bereich; Suchkriterien; [Summe_Bereich])",
      "fr": "=SOMME.SI(plage; critère; [somme_plage])",
      "ja": "=SUMIF(範囲, 検索条件, [合計範囲])",
      "pt": "=SOMASE(intervalo; critérios; [intervalo_soma])"
    },
    "exampleContextByLocale": {
      "es": "Suma valores de la col C si la col B es mayor a 1000.",
      "en": "Sums values in col C where col B is greater than 1000.",
      "de": "Summiert Werte in Spalte C, wenn Spalte B > 1000 ist.",
      "fr": "Additionne la col C si la col B est supérieure à 1000.",
      "ja": "列Bが1000を超える行について、列Cの値を合計します。",
      "pt": "Soma valores da col C onde a col B for maior que 1000."
    },
    "exampleResultByLocale": {
      "es": "$8,900.00",
      "en": "$8,900.00",
      "de": "8.900,00 €",
      "fr": "8 900,00 €",
      "ja": "¥890,000",
      "pt": "R$ 8.900,00"
    },
    "proTipByLocale": {
      "es": "Puedes usar comodines: \"*\" para cualquier grupo de caracteres y \"?\" para una sola letra.",
      "en": "Wildcards are supported: \"*\" matches any sequence, \"?\" matches any single character.",
      "de": "Platzhalter möglich: \"*\" für beliebige Zeichen, \"?\" für genau ein Zeichen.",
      "fr": "Les caractères génériques sont supportés : \"*\" pour plusieurs lettres, \"?\" pour une seule.",
      "ja": "ワイルドカード対応: 任意の文字列には「*」、任意の1文字には「?」が使えます。",
      "pt": "Você pode usar caracteres coringa: \"*\" para qualquer grupo e \"?\" para uma única letra."
    },
    "tags": [
      "sumif",
      "sumar.si",
      "criterio",
      "condicion",
      "somase"
    ]
  },
  {
    "id": "sumifs",
    "nameEn": "SUMIFS",
    "category": "basics",
    "exampleFormula": "=SUMIFS(D2:D100, A2:A100, \"Norte\", B2:B100, \">500\")",
    "nameByLocale": {
      "es": "SUMAR.SI.CONJUNTO",
      "en": "SUMIFS",
      "de": "SUMMEWENNS",
      "fr": "SOMME.SI.ENS",
      "ja": "SUMIFS",
      "pt": "SOMASES"
    },
    "descriptionByLocale": {
      "es": "Suma las celdas que cumplen con múltiples criterios simultáneos (ej: Región Norte Y Vendedor Juan).",
      "en": "Adds the cells in a range that meet multiple criteria.",
      "de": "Addiert Zellen, die mehrere Kriterien gleichzeitig erfüllen.",
      "fr": "Additionne les cellules qui répondent à plusieurs critères.",
      "ja": "複数の条件をすべて満たすセルの値を合計します。",
      "pt": "Soma as células que atendem a múltiplos critérios simultâneos."
    },
    "syntaxByLocale": {
      "es": "=SUMAR.SI.CONJUNTO(rango_suma, rango_criterios1, criterio1, ...)",
      "en": "=SUMIFS(sum_range, criteria_range1, criteria1, ...)",
      "de": "=SUMMEWENNS(Summe_Bereich; Bereich1; Kriterium1; ...)",
      "fr": "=SOMME.SI.ENS(somme_plage; plage_critères1; critère1; ...)",
      "ja": "=SUMIFS(合計範囲, 条件範囲1, 条件1, ...)",
      "pt": "=SOMASES(intervalo_soma; intervalo_critérios1; critérios1; ...)"
    },
    "exampleContextByLocale": {
      "es": "Suma ventas (D) donde región (A) es Norte y ventas (B) superan 500.",
      "en": "Sums sales (D) where region (A) is North and units (B) exceed 500.",
      "de": "Summiert Umsatz (D), wo Region (A) Nord ist und Einheiten (B) > 500.",
      "fr": "Somme des ventes (D) où la région (A) est Nord et les unités (B) > 500.",
      "ja": "地域(A)が「Norte(北)」かつ数量(B)が500超の売上(D)を合算。",
      "pt": "Soma vendas (D) onde a região (A) for Norte e vendas (B) superarem 500."
    },
    "exampleResultByLocale": {
      "es": "$45,200.00",
      "en": "$45,200.00",
      "de": "45.200,00 €",
      "fr": "45 200,00 €",
      "ja": "¥4,520,000",
      "pt": "R$ 45.200,00"
    },
    "proTipByLocale": {
      "es": "¡CUIDADO! En SUMIFS el rango que se suma va PRIMERO, a diferencia de SUMIF donde va al final.",
      "en": "BE CAREFUL! In SUMIFS the sum_range comes FIRST, unlike SUMIF where it comes last.",
      "de": "ACHTUNG! Bei SUMMEWENNS steht der Summenbereich ganz VORNE!",
      "fr": "ATTENTION ! Dans SOMME.SI.ENS, la plage à additionner se place au DÉBUT.",
      "ja": "注意！単一条件のSUMIFと異なり、SUMIFSでは「合計範囲」を一番最初に指定します。",
      "pt": "ATENÇÃO! No SOMASES o intervalo de soma vem em PRIMEIRO lugar, diferente do SOMASE."
    },
    "tags": [
      "sumifs",
      "multiples",
      "criterios",
      "sumar.si.conjunto",
      "somases"
    ]
  },
  {
    "id": "sumproduct",
    "nameEn": "SUMPRODUCT",
    "category": "basics",
    "exampleFormula": "=SUMPRODUCT(A2:A10, B2:B10)",
    "nameByLocale": {
      "es": "SUMAPRODUCTO",
      "en": "SUMPRODUCT",
      "de": "SUMMENPRODUKT",
      "fr": "SOMMEPROD",
      "ja": "SUMPRODUCT",
      "pt": "SOMARPRODUTO"
    },
    "descriptionByLocale": {
      "es": "Multiplica los componentes correspondientes de las matrices dadas y devuelve la suma de esos productos.",
      "en": "Multiplies corresponding components in given arrays and returns the sum of those products.",
      "de": "Multipliziert entsprechende Werte von Bereichen und addiert die Produkte.",
      "fr": "Multiplie les composants correspondants des matrices et renvoie la somme des produits.",
      "ja": "配列の対応する要素同士を掛け合わせ、その積の合計を返します。",
      "pt": "Multiplica componentes correspondentes de matrizes e retorna a soma desses produtos."
    },
    "syntaxByLocale": {
      "es": "=SUMAPRODUCTO(matriz1, [matriz2], ...)",
      "en": "=SUMPRODUCT(array1, [array2], ...)",
      "de": "=SUMMENPRODUKT(Matrix1; [Matrix2]; ...)",
      "fr": "=SOMMEPROD(matrice1; [matrice2]; ...)",
      "ja": "=SUMPRODUCT(配列1, [配列2], ...)",
      "pt": "=SOMARPRODUTO(matriz1; [matriz2]; ...)"
    },
    "exampleContextByLocale": {
      "es": "Calcula el costo total multiplicando Cantidad (A) por Precio Unitario (B) sin columna auxiliar.",
      "en": "Computes total revenue by multiplying Quantity (A) by Unit Price (B) without a helper column.",
      "de": "Berechnet Gesamtkosten durch Multiplikation von Menge (A) mit Einzelpreis (B).",
      "fr": "Calcule le coût total (Quantité A × Prix Unitaire B) sans colonne intermédiaire.",
      "ja": "作業列を作ることなく、数量(A)×単価(B)の総売上を一撃で算出します。",
      "pt": "Calcula o custo total multiplicando Quantidade (A) por Preço Unitário (B) sem coluna auxiliar."
    },
    "exampleResultByLocale": {
      "es": "$14,820.00",
      "en": "$14,820.00",
      "de": "14.820,00 €",
      "fr": "14 820,00 €",
      "ja": "¥1,482,000",
      "pt": "R$ 14.820,00"
    },
    "proTipByLocale": {
      "es": "Súper potente: usando el operador doble negativo (--) puedes usarlo como un SUMIFS condicional ultra flexible.",
      "en": "Superpower: using double unary (--) turns SUMPRODUCT into an ultra-flexible conditional engine.",
      "de": "Genialer Trick: mit dem Doppel-Minus (--) wird es zum flexiblen bedingten Rechenmotor.",
      "fr": "Astuce puissante : le double signe moins (--) permet d'évaluer des conditions complexes.",
      "ja": "ハイフン2つ(--)による論理値変換を駆使すれば、重厚な条件付き集計エンジンになります。",
      "pt": "Superpoderoso: com o duplo negativo (--) funciona como um poderoso motor condicional."
    },
    "tags": [
      "sumproduct",
      "sumaproducto",
      "matrices",
      "ponderado",
      "sommeprod"
    ]
  },
  {
    "id": "round",
    "nameEn": "ROUND",
    "category": "basics",
    "exampleFormula": "=ROUND(125.756, 2)",
    "nameByLocale": {
      "es": "REDONDEAR",
      "en": "ROUND",
      "de": "RUNDEN",
      "fr": "ARRONDI",
      "ja": "ROUND",
      "pt": "ARRED"
    },
    "descriptionByLocale": {
      "es": "Redondea un número a un número de decimales especificado según las reglas matemáticas estándar.",
      "en": "Rounds a number to a specified number of digits.",
      "de": "Rundet eine Zahl auf eine bestimmte Anzahl von Dezimalstellen.",
      "fr": "Arrondit un nombre au nombre de décimales spécifié.",
      "ja": "数値を指定した桁数に四捨五入します。",
      "pt": "Arredonda um número até um número especificado de casas decimais."
    },
    "syntaxByLocale": {
      "es": "=REDONDEAR(número, núm_decimales)",
      "en": "=ROUND(number, num_digits)",
      "de": "=RUNDEN(Zahl; Anzahl_Stellen)",
      "fr": "=ARRONDI(nombre; no_chiffres)",
      "ja": "=ROUND(数値, 桁数)",
      "pt": "=ARRED(número; núm_dígitos)"
    },
    "exampleContextByLocale": {
      "es": "Redondea el importe a 2 decimales para facturación.",
      "en": "Rounds currency amount to 2 decimal places for invoicing.",
      "de": "Rundet Betrag auf 2 Nachkommastellen für Rechnungen.",
      "fr": "Arrondit le montant à 2 décimales pour la facturation.",
      "ja": "請求書用に金額を小数点第2位まで四捨五入します。",
      "pt": "Arredonda o valor para 2 casas decimais para faturamento."
    },
    "exampleResultByLocale": {
      "es": "125.76",
      "en": "125.76",
      "de": "125,76",
      "fr": "125,76",
      "ja": "125.76",
      "pt": "125,76"
    },
    "proTipByLocale": {
      "es": "Si pones decimales negativos como -1 o -2, redondea a decenas o centenas (ej: 148 con -1 da 150).",
      "en": "Negative digits like -1 or -2 round to tens or hundreds (e.g. 148 with -1 becomes 150).",
      "de": "Negative Stellen wie -1 oder -2 runden auf Zehner oder Hunderter (z.B. 148 -> 150).",
      "fr": "Des décimales négatives comme -1 arrondissent aux dizaines (ex: 148 -> 150).",
      "ja": "桁数に「-1」や「-2」を指定すると、十の位や百の位で四捨五入できます (148なら150)。",
      "pt": "Se usar dígitos negativos como -1 ou -2, arredonda para dezenas ou centenas (148 com -1 vira 150)."
    },
    "tags": [
      "round",
      "redondear",
      "decimales",
      "matematicas",
      "arred"
    ]
  },
  {
    "id": "roundup_down",
    "nameEn": "ROUNDUP / ROUNDDOWN",
    "category": "basics",
    "exampleFormula": "=ROUNDUP(12.31, 1)",
    "nameByLocale": {
      "es": "REDONDEAR.MAS / MENOS",
      "en": "ROUNDUP / ROUNDDOWN",
      "de": "AUFRUNDEN / ABRUNDEN",
      "fr": "ARRONDI.SUP / INF",
      "ja": "ROUNDUP / ROUNDDOWN",
      "pt": "ARREDONDAR.PARA.CIMA / BAIXO"
    },
    "descriptionByLocale": {
      "es": "REDONDEAR.MAS redondea siempre alejándose del cero; REDONDEAR.MENOS redondea siempre hacia cero.",
      "en": "ROUNDUP always rounds up away from zero; ROUNDDOWN always rounds down toward zero.",
      "de": "AUFRUNDEN rundet immer auf; ABRUNDEN schneidet Nachkommastellen ab.",
      "fr": "ARRONDI.SUP arrondit à la hausse; ARRONDI.INF arrondit à la baisse.",
      "ja": "ROUNDUPは常に切り上げ、ROUNDDOWNは常に切り捨てます。",
      "pt": "ARREDONDAR.PARA.CIMA arredonda sempre para cima; PARA.BAIXO sempre para baixo."
    },
    "syntaxByLocale": {
      "es": "=REDONDEAR.MAS(núm, dec) | =REDONDEAR.MENOS(núm, dec)",
      "en": "=ROUNDUP(number, num_digits) | =ROUNDDOWN(number, num_digits)",
      "de": "=AUFRUNDEN(Zahl; Stellen) | =ABRUNDEN(Zahl; Stellen)",
      "fr": "=ARRONDI.SUP(nombre; no) | =ARRONDI.INF(nombre; no)",
      "ja": "=ROUNDUP(数値, 桁数) | =ROUNDDOWN(数値, 桁数)",
      "pt": "=ARREDONDAR.PARA.CIMA(núm; dec) | =ARREDONDAR.PARA.BAIXO(núm; dec)"
    },
    "exampleContextByLocale": {
      "es": "Fuerza el redondeo hacia arriba a 1 decimal.",
      "en": "Forces round-up to 1 decimal place.",
      "de": "Erzwingt Aufrunden auf 1 Dezimalstelle.",
      "fr": "Force l'arrondi supérieur à 1 décimale.",
      "ja": "小数点第1位へ強制切り上げ。",
      "pt": "Força o arredondamento para cima com 1 casa decimal."
    },
    "exampleResultByLocale": {
      "es": "12.4",
      "en": "12.4",
      "de": "12,4",
      "fr": "12,4",
      "ja": "12.4",
      "pt": "12,4"
    },
    "proTipByLocale": {
      "es": "Usa ROUNDUP con 0 decimales para calcular número de cajas necesarias para despachar un pedido.",
      "en": "Use ROUNDUP with 0 digits to compute minimum boxes required to pack an order.",
      "de": "Perfekt mit 0 Stellen zur Berechnung benötigter Versandkartons.",
      "fr": "Idéal avec 0 décimale pour calculer le nombre de cartons d'emballage nécessaires.",
      "ja": "箱詰め計算などで「端数が出たら1箱追加」する場合は桁数0のROUNDUPが最適です。",
      "pt": "Use ROUNDUP com 0 decimais para calcular caixas necessárias para despacho."
    },
    "tags": [
      "roundup",
      "rounddown",
      "redondear.mas",
      "redondear.menos",
      "corte"
    ]
  },
  {
    "id": "subtotal",
    "nameEn": "SUBTOTAL",
    "category": "basics",
    "exampleFormula": "=SUBTOTAL(9, C2:C100)",
    "nameByLocale": {
      "es": "SUBTOTALES",
      "en": "SUBTOTAL",
      "de": "TEILERGEBNIS",
      "fr": "SOUS.TOTAL",
      "ja": "SUBTOTAL",
      "pt": "SUBTOTAL"
    },
    "descriptionByLocale": {
      "es": "Calcula subtotales (suma, promedio, conteo) ignorando automáticamente las filas ocultas por filtros.",
      "en": "Returns a subtotal in a list or database, ignoring rows hidden by filters.",
      "de": "Berechnet Teilergebnisse und ignoriert automatisch durch Filter ausgeblendete Zeilen.",
      "fr": "Calcule un sous-total en ignorant les lignes masquées par des filtres.",
      "ja": "リストや表の集計値を計算し、フィルターで非表示にした行を自動で除外します。",
      "pt": "Calcula subtotais ignorando automaticamente linhas ocultas por filtros."
    },
    "syntaxByLocale": {
      "es": "=SUBTOTALES(núm_función, ref1, [ref2], ...)",
      "en": "=SUBTOTAL(function_num, ref1, [ref2], ...)",
      "de": "=TEILERGEBNIS(Funktionszahl; Bezug1; ...)",
      "fr": "=SOUS.TOTAL(no_fonction; réf1; ...)",
      "ja": "=SUBTOTAL(集計方法, 参照1, ...)",
      "pt": "=SUBTOTAL(núm_função; ref1; ...)"
    },
    "exampleContextByLocale": {
      "es": "El código 9 representa SUMA activa que se actualiza al filtrar.",
      "en": "Code 9 stands for SUM that automatically recalculates with active filters.",
      "de": "Code 9 steht für SUMME, die gefilterte Zeilen berücksichtigt.",
      "fr": "Le code 9 correspond à la SOMME recalculée selon les filtres actifs.",
      "ja": "コード 9 はフィルター連動のSUM集計を表します。",
      "pt": "O código 9 representa a SOMA que se ajusta ao aplicar filtros."
    },
    "exampleResultByLocale": {
      "es": "$6,320.00",
      "en": "$6,320.00",
      "de": "6.320,00 €",
      "fr": "6 320,00 €",
      "ja": "¥632,000",
      "pt": "R$ 6.320,00"
    },
    "proTipByLocale": {
      "es": "Usa 109 en lugar de 9 si quieres que ignore también las filas ocultadas manualmente con botón derecho.",
      "en": "Use 109 instead of 9 to also ignore rows that were manually hidden via right-click.",
      "de": "Nutze 109 statt 9, um auch manuell ausgeblendete Zeilen zu überspringen.",
      "fr": "Utilisez 109 au lieu de 9 pour exclure également les lignes masquées manuellement.",
      "ja": "手動で非表示にした行も除外したい場合は「9」の代わりに「109」を使用します。",
      "pt": "Use 109 em vez de 9 se quiser ignorar também linhas ocultas manualmente com o botão direito."
    },
    "tags": [
      "subtotal",
      "subtotales",
      "filtros",
      "suma",
      "ocultas"
    ]
  },
  {
    "id": "mod",
    "nameEn": "MOD",
    "category": "basics",
    "exampleFormula": "=MOD(17, 5)",
    "nameByLocale": {
      "es": "RESIDUO",
      "en": "MOD",
      "de": "REST",
      "fr": "MOD",
      "ja": "MOD",
      "pt": "RESTO"
    },
    "descriptionByLocale": {
      "es": "Devuelve el residuo o resto que queda después de dividir un número entre un divisor.",
      "en": "Returns the remainder after number is divided by divisor.",
      "de": "Gibt den Rest einer Division zurück.",
      "fr": "Renvoie le reste d'une division euclidienne.",
      "ja": "数値を除数で割ったときの余り(剰余)を返します。",
      "pt": "Retorna o resto de uma divisão de um número pelo divisor."
    },
    "syntaxByLocale": {
      "es": "=RESIDUO(número, divisor)",
      "en": "=MOD(number, divisor)",
      "de": "=REST(Zahl; Divisor)",
      "fr": "=MOD(nombre; diviseur)",
      "ja": "=MOD(数値, 除数)",
      "pt": "=RESTO(número; divisor)"
    },
    "exampleContextByLocale": {
      "es": "17 dividido entre 5 cabe a 3 y sobran 2.",
      "en": "17 divided by 5 equals 3 with a remainder of 2.",
      "de": "17 geteilt durch 5 ergibt 3 Rest 2.",
      "fr": "17 divisé par 5 donne 3 et reste 2.",
      "ja": "17を5で割ると商が3、余りが2。",
      "pt": "17 dividido por 5 é 3 com resto 2."
    },
    "exampleResultByLocale": {
      "es": "2",
      "en": "2",
      "de": "2",
      "fr": "2",
      "ja": "2",
      "pt": "2"
    },
    "proTipByLocale": {
      "es": "El truco definitivo para alternar colores de fila en Formato Condicional: =RESIDUO(FILA(), 2) = 0 pinta filas pares.",
      "en": "Top hack for zebra striped rows: =MOD(ROW(), 2) = 0 highlights even rows in Conditional Formatting.",
      "de": "Bester Trick für Zebrastreifen: =REST(ZEILE(); 2) = 0 markiert gerade Zeilen.",
      "fr": "L'astuce suprême pour colorer une ligne sur deux : =MOD(LIGNE(); 2) = 0.",
      "ja": "条件付き書式で1行おきに色を塗る定番技: =MOD(ROW(), 2) = 0。",
      "pt": "O truque supremo para linhas zebradas na Formatação Condicional: =RESTO(LIN(); 2) = 0."
    },
    "tags": [
      "mod",
      "residuo",
      "resto",
      "division",
      "zebra"
    ]
  },
  {
    "id": "sequence",
    "nameEn": "SEQUENCE",
    "category": "basics",
    "exampleFormula": "=SEQUENCE(10, 1, 100, 10)",
    "nameByLocale": {
      "es": "SECUENCIA",
      "en": "SEQUENCE",
      "de": "SEQUENZ",
      "fr": "SEQUENCE",
      "ja": "SEQUENCE",
      "pt": "SEQUÊNCIA"
    },
    "descriptionByLocale": {
      "es": "Genera una lista o matriz de números secuenciales (1, 2, 3...) de forma automática y desbordada.",
      "en": "Generates a list of sequential numbers in an array, such as 1, 2, 3, 4.",
      "de": "Erzeugt eine Liste fortlaufender Zahlen als dynamische Matrix.",
      "fr": "Génère une liste de nombres séquentiels dans un tableau.",
      "ja": "指定した行数と列数の連続した数値(連番)配列を生成します。",
      "pt": "Gera uma matriz de números sequenciais de forma dinâmica."
    },
    "syntaxByLocale": {
      "es": "=SECUENCIA(filas, [columnas], [inicio], [paso])",
      "en": "=SEQUENCE(rows, [columns], [start], [step])",
      "de": "=SEQUENZ(Zeilen; [Spalten]; [Start]; [Schritt])",
      "fr": "=SEQUENCE(lignes; [colonnes]; [début]; [pas])",
      "ja": "=SEQUENCE(行数, [列数], [開始値], [増分])",
      "pt": "=SEQUÊNCIA(linhas; [colunas]; [início]; [passo])"
    },
    "exampleContextByLocale": {
      "es": "Crea 10 números secuenciales empezando en 100 y de 10 en 10.",
      "en": "Builds 10 sequential numbers starting at 100 with steps of 10.",
      "de": "Erstellt 10 Zahlen ab 100 in 10er-Schritten.",
      "fr": "Crée 10 nombres à partir de 100 par pas de 10.",
      "ja": "100から始まり10ずつ増加する10個の連番を作成。",
      "pt": "Cria 10 números sequenciais começando em 100 de 10 em 10."
    },
    "exampleResultByLocale": {
      "es": "100, 110, 120... 190",
      "en": "100, 110, 120... 190",
      "de": "100, 110, 120... 190",
      "fr": "100, 110, 120... 190",
      "ja": "100, 110, 120... 190",
      "pt": "100, 110, 120... 190"
    },
    "proTipByLocale": {
      "es": "Olvídate de arrastrar números a mano: =SECUENCIA(FILAS(A2:A100)) numera tus registros automáticamente.",
      "en": "Never drag row numbers manually again: =SEQUENCE(ROWS(A2:A100)) numbers everything dynamically.",
      "de": "Nie wieder manuell Zeilennummern ziehen: =SEQUENZ(ZEILEN(A2:A100)) erledigt das dynamisch.",
      "fr": "Ne tirez plus jamais de numéros à la souris : =SEQUENCE(LIGNES(A2:A100)) numérote tout.",
      "ja": "手作業での連番ドラッグは不要: =SEQUENCE(ROWS(A2:A100)) で行数に応じた自動採番が完成します。",
      "pt": "Chega de arrastar números à mão: =SEQUÊNCIA(LINHAS(A2:A100)) numera tudo dinamicamente."
    },
    "tags": [
      "sequence",
      "secuencia",
      "numeracion",
      "series",
      "dinamico"
    ]
  },
  {
    "id": "if",
    "nameEn": "IF",
    "category": "logic",
    "exampleFormula": "=IF(C2>=70, \"Aprobado\", \"Reprobado\")",
    "nameByLocale": {
      "es": "SI",
      "en": "IF",
      "de": "WENN",
      "fr": "SI",
      "ja": "IF",
      "pt": "SE"
    },
    "descriptionByLocale": {
      "es": "Comprueba si se cumple una condición lógica y devuelve un valor si es VERDADERO y otro si es FALSO.",
      "en": "Checks whether a condition is met, and returns one value if TRUE, and another if FALSE.",
      "de": "Prüft, ob eine Bedingung erfüllt ist, und gibt einen Wert bei WAHR und einen bei FALSCH zurück.",
      "fr": "Vérifie si une condition est remplie et renvoie une valeur si VRAI et une autre si FAUX.",
      "ja": "論理条件を判定し、真(TRUE)の場合と偽(FALSE)の場合で異なる値を返します。",
      "pt": "Verifica se uma condição foi atendida e retorna um valor se VERDADEIRO e outro se FALSO."
    },
    "syntaxByLocale": {
      "es": "=SI(prueba_lógica, valor_si_verdadero, [valor_si_falso])",
      "en": "=IF(logical_test, value_if_true, [value_if_false])",
      "de": "=WENN(Prüfung; Dann_Wert; [Sonst_Wert])",
      "fr": "=SI(test_logique; valeur_si_vrai; [valeur_si_faux])",
      "ja": "=IF(論理式, 値が真の場合, [値が偽の場合])",
      "pt": "=SE(teste_lógico; valor_se_verdadeiro; [valor_se_falso])"
    },
    "exampleContextByLocale": {
      "es": "Calificación mínima de aprobación es 70 en celda C2.",
      "en": "Passing score threshold is 70 in cell C2.",
      "de": "Bestehensgrenze liegt bei 70 in Zelle C2.",
      "fr": "La note minimale de passage est 70 en cellule C2.",
      "ja": "合格ラインが70点の場合の判定 (セルC2)。",
      "pt": "Nota mínima de aprovação é 70 na célula C2."
    },
    "exampleResultByLocale": {
      "es": "Aprobado",
      "en": "Passed",
      "de": "Bestanden",
      "fr": "Admis",
      "ja": "合格",
      "pt": "Aprovado"
    },
    "proTipByLocale": {
      "es": "Evita anidar más de 3 funciones SI; en su lugar usa IFS (SI.CONJUNTO) o BUSCARX para mayor claridad.",
      "en": "Avoid nesting more than 3 IFs; prefer IFS or XLOOKUP for clean and maintainable logic.",
      "de": "Vermeide mehr als 3 verschachtelte WENN-Funktionen; nutze stattdessen WENNS oder XVERWEIS.",
      "fr": "Évitez d'imbriquer trop de SI; privilégiez SI.CONDITIONS ou RECHERCHEX.",
      "ja": "3階層以上のIFネストは避け、IFS関数やXLOOKUPを使うと数式がすっきりします。",
      "pt": "Evite aninhar mais de 3 funções SE; prefira usar SES ou PROCX para lógica limpa."
    },
    "tags": [
      "if",
      "si",
      "condicional",
      "logica",
      "wenn",
      "se"
    ]
  },
  {
    "id": "ifs",
    "nameEn": "IFS",
    "category": "logic",
    "exampleFormula": "=IFS(A1>=90, \"A\", A1>=80, \"B\", A1>=70, \"C\", TRUE, \"F\")",
    "nameByLocale": {
      "es": "SI.CONJUNTO",
      "en": "IFS",
      "de": "WENNS",
      "fr": "SI.CONDITIONS",
      "ja": "IFS",
      "pt": "SES"
    },
    "descriptionByLocale": {
      "es": "Evalúa múltiples condiciones en orden secuencial sin necesidad de anidar varios SI entre paréntesis.",
      "en": "Checks multiple conditions in order without deeply nested IF statements.",
      "de": "Prüft mehrere Bedingungen nacheinander, ohne verschachtelte WENN-Klammern zu benötigen.",
      "fr": "Évalue plusieurs conditions dans l'ordre sans imbrications complexes.",
      "ja": "複数の条件を順に評価し、最初にTRUEとなった条件に対応する値を返します。",
      "pt": "Avalia múltiplas condições em ordem sem a necessidade de aninhar vários parênteses SE."
    },
    "syntaxByLocale": {
      "es": "=SI.CONJUNTO(prueba1, valor1, [prueba2, valor2], ...)",
      "en": "=IFS(logical_test1, value_if_true1, [logical_test2, value_if_true2], ...)",
      "de": "=WENNS(Prüfung1; Wert1; [Prüfung2; Wert2]; ...)",
      "fr": "=SI.CONDITIONS(test1; valeur1; [test2; valeur2]; ...)",
      "ja": "=IFS(論理式1, 値が真の場合1, [論理式2, 値が真の場合2], ...)",
      "pt": "=SES(teste1; valor1; [teste2; valor2]; ...)"
    },
    "exampleContextByLocale": {
      "es": "Asigna una letra según el puntaje de la celda A1.",
      "en": "Assigns a grade letter based on the test score in A1.",
      "de": "Weist eine Note basierend auf der Punktzahl in A1 zu.",
      "fr": "Attribue une lettre de note selon le score en A1.",
      "ja": "セルA1のテスト得点に応じて成績ランクを割り当てます。",
      "pt": "Atribui um conceito de nota conforme a pontuação em A1."
    },
    "exampleResultByLocale": {
      "es": "A",
      "en": "A",
      "de": "A",
      "fr": "A",
      "ja": "A",
      "pt": "A"
    },
    "proTipByLocale": {
      "es": "Pon VERDADERO al final como última condición para que funcione como el caso por defecto (Else).",
      "en": "Put TRUE at the very end as the final condition to act as a fallback 'Else' clause.",
      "de": "Setze WAHR als letzte Bedingung ans Ende, um einen Standardwert (Else) abzufangen.",
      "fr": "Mettez VRAI à la fin comme dernière condition pour servir de cas par défaut (Sinon).",
      "ja": "最後の条件に「TRUE」を指定すると、どれにも該当しない場合の初期値(Else)として機能します。",
      "pt": "Coloque VERDADEIRO ao final como última condição para servir como valor padrão (Else)."
    },
    "tags": [
      "ifs",
      "si.conjunto",
      "multiple",
      "evaluar",
      "grades"
    ]
  },
  {
    "id": "iferror",
    "nameEn": "IFERROR",
    "category": "logic",
    "exampleFormula": "=IFERROR(A1/B1, 0)",
    "nameByLocale": {
      "es": "SI.ERROR",
      "en": "IFERROR",
      "de": "WENNFEHLER",
      "fr": "SI.NON.DISP",
      "ja": "IFERROR",
      "pt": "SEERRO"
    },
    "descriptionByLocale": {
      "es": "Devuelve un valor que tú eliges si una fórmula da error (#N/D, #¡DIV/0!, #VALOR!).",
      "en": "Returns a value you specify if a formula evaluates to an error; otherwise returns the result.",
      "de": "Fängt Fehler (#NV, #DIV/0!, #WERT!) sauber ab und gibt einen Alternativwert zurück.",
      "fr": "Renvoie une valeur spécifiée si une formule génère une erreur (#N/A, #DIV/0!).",
      "ja": "数式がエラー(#N/A, #DIV/0!など)を返した場合に、指定した代替値を返します。",
      "pt": "Retorna um valor especificado caso uma fórmula resulte em erro (#N/D, #DIV/0!)."
    },
    "syntaxByLocale": {
      "es": "=SI.ERROR(valor, valor_si_error)",
      "en": "=IFERROR(value, value_if_error)",
      "de": "=WENNFEHLER(Wert; Wert_wenn_Fehler)",
      "fr": "=SIERREUR(valeur; valeur_si_erreur)",
      "ja": "=IFERROR(値, エラーの場合の値)",
      "pt": "=SEERRO(valor; valor_se_erro)"
    },
    "exampleContextByLocale": {
      "es": "Divide A1 entre B1; si B1 es 0 devuelve 0 en vez de #¡DIV/0!.",
      "en": "Divides A1 by B1; if B1 is 0 it returns 0 instead of #DIV/0!.",
      "de": "Teilt A1 durch B1; ist B1 = 0, wird 0 statt #DIV/0! ausgegeben.",
      "fr": "Divise A1 par B1; si B1 est 0, renvoie 0 au lieu de #DIV/0!.",
      "ja": "A1をB1で除算。B1が0の場合は #DIV/0! の代わりに 0 を返します。",
      "pt": "Divide A1 por B1; se B1 for 0 retorna 0 em vez do feio #DIV/0!."
    },
    "exampleResultByLocale": {
      "es": "0",
      "en": "0",
      "de": "0",
      "fr": "0",
      "ja": "0",
      "pt": "0"
    },
    "proTipByLocale": {
      "es": "Usa \"\" (comillas vacías) como valor de error para dejar la celda visualmente en blanco y limpia.",
      "en": "Use \"\" (empty quotes) as value_if_error to keep cells looking clean and blank.",
      "de": "Verwende \"\" als Fehlerwert, um die Zelle optisch sauber und leer zu halten.",
      "fr": "Utilisez \"\" pour laisser la cellule propre et vide en cas d'erreur.",
      "ja": "エラー時の値に「\"\"」を指定すると、エラー時にセルを空白にして見た目をきれいに保てます。",
      "pt": "Use \"\" (aspas vazias) para manter as células visualmente limpas e sem erros aparentes."
    },
    "tags": [
      "iferror",
      "si.error",
      "error",
      "div0",
      "limpio",
      "seerro"
    ]
  },
  {
    "id": "switch",
    "nameEn": "SWITCH",
    "category": "logic",
    "exampleFormula": "=SWITCH(WEEKDAY(TODAY()), 1, \"Domingo\", 7, \"S\\u00e1bado\", \"D\\u00eda Laboral\")",
    "nameByLocale": {
      "es": "CAMBIAR",
      "en": "SWITCH",
      "de": "ERSTE.WERTE",
      "fr": "SI.CONDITIONS",
      "ja": "SWITCH",
      "pt": "PARÂMETRO"
    },
    "descriptionByLocale": {
      "es": "Evalúa una expresión contra una lista de valores y devuelve el resultado correspondiente a la primera coincidencia.",
      "en": "Evaluates an expression against a list of values and returns corresponding result.",
      "de": "Wertet einen Ausdruck gegen eine Liste von Werten aus.",
      "fr": "Évalue une expression par rapport à une liste de valeurs.",
      "ja": "1つの式を複数の値と照合し、最初に一致した値に対応する結果を返します。",
      "pt": "Avalia uma expressão em relação a uma lista de valores e devolve o resultado correspondente."
    },
    "syntaxByLocale": {
      "es": "=CAMBIAR(expresión, valor1, resultado1, [valor2, resultado2], [por_defecto])",
      "en": "=SWITCH(expression, value1, result1, [value2, result2], [default])",
      "de": "=ERSTE.WERTE(Ausdruck; Wert1; Ergebnis1; ...)",
      "fr": "=SWITCH(expression; valeur1; résultat1; ...)",
      "ja": "=SWITCH(式, 値1, 結果1, [値2, 結果2], [既定値])",
      "pt": "=PARÂMETRO(expressão; valor1; resultado1; ...)"
    },
    "exampleContextByLocale": {
      "es": "Determina si el día actual es fin de semana o día laborable.",
      "en": "Checks if current day is weekend or weekday.",
      "de": "Prüft, ob heute Wochenende oder Werktag ist.",
      "fr": "Vérifie si le jour actuel est un week-end ou jour ouvré.",
      "ja": "今日が週末か平日かを判定。",
      "pt": "Determina se hoje é fim de semana ou dia de trabalho."
    },
    "exampleResultByLocale": {
      "es": "Día Laboral",
      "en": "Weekday",
      "de": "Werktag",
      "fr": "Jour ouvré",
      "ja": "平日",
      "pt": "Dia de Trabalho"
    },
    "proTipByLocale": {
      "es": "A diferencia de IFS, no tienes que repetir la celda evaluada una y otra vez; solo se escribe una vez al inicio.",
      "en": "Unlike IFS, you don't repeat the cell name over and over; write it once as the first argument.",
      "de": "Im Gegensatz zu WENNS musst du die Zelle nicht jedes Mal wiederholen.",
      "fr": "Contrairement à IFS, pas besoin de réécrire la cellule à chaque condition.",
      "ja": "IFS関数と違い、評価対象のセル名を何度も書き直す必要がありません。",
      "pt": "Diferente do SES, você não precisa repetir a célula avaliada em cada condição."
    },
    "tags": [
      "switch",
      "cambiar",
      "casos",
      "evaluar",
      "opciones"
    ]
  },
  {
    "id": "let",
    "nameEn": "LET",
    "category": "logic",
    "exampleFormula": "=LET(x, A1*1.15, IF(x>1000, x*0.9, x))",
    "nameByLocale": {
      "es": "LET",
      "en": "LET",
      "de": "LET",
      "fr": "LET",
      "ja": "LET",
      "pt": "LET"
    },
    "descriptionByLocale": {
      "es": "Asigna nombres a los resultados de cálculos intermedios dentro de una fórmula para mejorar velocidad y claridad.",
      "en": "Assigns names to calculation results inside a formula to boost readability and recalculation speed.",
      "de": "Weist Zwischenergebnissen Namen zu, um Lesbarkeit und Rechenleistung zu maximieren.",
      "fr": "Attribue des noms aux résultats de calculs intermédiaires pour doper les performances.",
      "ja": "数式内で中間計算に名前(変数)を割り当て、可読性と計算速度を飛躍的に高めます。",
      "pt": "Atribui nomes a resultados de cálculos intermediários para melhorar legibilidade e velocidade."
    },
    "syntaxByLocale": {
      "es": "=LET(nombre1, valor1, [nombre2, valor2], ..., cálculo_final)",
      "en": "=LET(name1, name_value1, [name2, name_value2], ..., calculation)",
      "de": "=LET(Name1; Wert1; [Name2; Wert2]; ...; Berechnung)",
      "fr": "=LET(nom1; valeur1; [nom2; valeur2]; ...; calcul)",
      "ja": "=LET(名前1, 値1, [名前2, 値2], ..., 計算式)",
      "pt": "=LET(nome1; valor1; [nome2; valor2]; ...; cálculo)"
    },
    "exampleContextByLocale": {
      "es": "Calcula el precio con impuesto 'x' una sola vez y le aplica descuento si pasa de 1000.",
      "en": "Computes tax price 'x' once, then applies a discount if it exceeds 1000.",
      "de": "Berechnet Steuerpreis 'x' einmalig und wendet Rabatt ab 1000 an.",
      "fr": "Calcule le prix avec taxe 'x' une seule fois et applique une remise si > 1000.",
      "ja": "税込み価格「x」を一度だけ計算し、1000超なら10%オフを適用します。",
      "pt": "Calcula o preço com imposto 'x' uma única vez e aplica desconto se passar de 1000."
    },
    "exampleResultByLocale": {
      "es": "$1,035.00",
      "en": "$1,035.00",
      "de": "1.035,00 €",
      "fr": "1 035,00 €",
      "ja": "¥103,500",
      "pt": "R$ 1.035,00"
    },
    "proTipByLocale": {
      "es": "¡Acelera hojas lentas! Si repites BUSCARV o cálculos pesados varias veces en un SI, guárdalos en LET.",
      "en": "Speed up laggy sheets! If you repeat heavy lookups inside an IF, store them once in LET.",
      "de": "Beschleunigt langsame Mappen drastisch, indem schwere SVERWEIS-Formeln zwischengespeichert werden.",
      "fr": "Accélère considérablement les calculs en évitant de recalculer deux fois le même RECHERCHEV.",
      "ja": "重たいVLOOKUPをIF文の中で何度も計算している場合、LETで変数化すると劇的に高速化します。",
      "pt": "Acelera planilhas lentas! Em vez de repetir PROCV no SE, armazene o resultado no LET."
    },
    "tags": [
      "let",
      "variables",
      "rendimiento",
      "velocidad",
      "moderno"
    ]
  },
  {
    "id": "textjoin",
    "nameEn": "TEXTJOIN",
    "category": "text",
    "exampleFormula": "=TEXTJOIN(\", \", TRUE, A2:A10)",
    "nameByLocale": {
      "es": "UNIRCADENAS",
      "en": "TEXTJOIN",
      "de": "TEXTKETTE",
      "fr": "JOINDRE.TEXTE",
      "ja": "TEXTJOIN",
      "pt": "UNIRTEXTO"
    },
    "descriptionByLocale": {
      "es": "Une textos de múltiples celdas usando un delimitador específico e ignorando celdas vacías.",
      "en": "Combines text from multiple ranges with a delimiter, skipping empty cells.",
      "de": "Verbindet Texte aus mehreren Bereichen mit Trennzeichen und ignoriert leere Zellen.",
      "fr": "Combine le texte de plusieurs plages avec un délimiteur en ignorant les cellules vides.",
      "ja": "区切り文字を指定して複数のセルや文字列を結合し、空のセルを無視できます。",
      "pt": "Combina textos de vários intervalos com um delimitador, ignorando células vazias."
    },
    "syntaxByLocale": {
      "es": "=UNIRCADENAS(delimitador, ignorar_vacias, texto1, ...)",
      "en": "=TEXTJOIN(delimiter, ignore_empty, text1, ...)",
      "de": "=TEXTKETTE(Trennzeichen; Leere_ignorieren; Text1; ...)",
      "fr": "=JOINDRE.TEXTE(délimiteur; ignorer_vide; texte1; ...)",
      "ja": "=TEXTJOIN(区切り文字, 空白を無視, 文字列1, ...)",
      "pt": "=UNIRTEXTO(delimitador; ignorar_vazio; texto1; ...)"
    },
    "exampleContextByLocale": {
      "es": "Crea una lista separada por comas con todos los nombres de A2:A10.",
      "en": "Builds a comma-separated list of all names in A2:A10.",
      "de": "Erstellt eine kommagetrennte Liste aller Namen in A2:A10.",
      "fr": "Génère une liste séparée par des virgules de tous les noms en A2:A10.",
      "ja": "A2:A10の名前をカンマ区切りの1つのテキストにまとめます。",
      "pt": "Cria uma lista separada por vírgulas com todos os nomes de A2:A10."
    },
    "exampleResultByLocale": {
      "es": "Ana, Carlos, Luis, Maria",
      "en": "Ana, Carlos, Luis, Maria",
      "de": "Ana, Carlos, Luis, Maria",
      "fr": "Ana, Carlos, Luis, Maria",
      "ja": "Ana, Carlos, Luis, Maria",
      "pt": "Ana, Carlos, Luis, Maria"
    },
    "proTipByLocale": {
      "es": "¡Mucho más rápida que CONCATENAR! Acepta rangos completos enteros como A1:Z1.",
      "en": "Way better than CONCATENATE! Supports entire rectangular ranges at once.",
      "de": "Viel besser als VERKETTEN! Akzeptiert ganze Zellbereiche wie A1:Z1 auf einmal.",
      "fr": "Bien plus efficace que CONCATENER ! Accepte des plages complètes d'un coup.",
      "ja": "CONCATENATEより圧倒的に便利！セル範囲(A1:A10)をそのまま渡せます。",
      "pt": "Muito mais rápido e moderno que CONCATENAR! Aceita intervalos completos como A1:Z1."
    },
    "tags": [
      "textjoin",
      "unircadenas",
      "unir",
      "delimitador",
      "concatenar"
    ]
  },
  {
    "id": "textsplit",
    "nameEn": "TEXTSPLIT",
    "category": "text",
    "exampleFormula": "=TEXTSPLIT(\"Juan,P\\u00e9rez,32\", \",\")",
    "nameByLocale": {
      "es": "DIVIDIRTEXTO",
      "en": "TEXTSPLIT",
      "de": "TEXTTEILEN",
      "fr": "FRACTIONNER.TEXTE",
      "ja": "TEXTSPLIT",
      "pt": "DIVIDIRTEXTO"
    },
    "descriptionByLocale": {
      "es": "Divide texto en columnas o filas usando delimitadores especificados. El sustituto en fórmula de Texto en Columnas.",
      "en": "Splits text strings into columns or rows using column/row delimiters.",
      "de": "Teilt Zeichenketten anhand von Trennzeichen in Spalten oder Zeilen auf.",
      "fr": "Fractionne des chaînes de texte en colonnes ou lignes avec séparateurs.",
      "ja": "区切り文字を使用して文字列を複数列または複数行に動的分割します。",
      "pt": "Divide cadeias de texto em colunas ou linhas usando delimitadores especificados."
    },
    "syntaxByLocale": {
      "es": "=DIVIDIRTEXTO(texto, delim_columna, [delim_fila], [ignorar_vacías])",
      "en": "=TEXTSPLIT(text, col_delimiter, [row_delimiter], [ignore_empty])",
      "de": "=TEXTTEILEN(Text; Spalten_Trennzeichen; [Zeilen_Trennzeichen])",
      "fr": "=FRACTIONNER.TEXTE(texte; délimiteur_col; [délimiteur_ligne])",
      "ja": "=TEXTSPLIT(テキスト, 列区切り文字, [行区切り文字])",
      "pt": "=DIVIDIRTEXTO(texto; delim_coluna; [delim_linha])"
    },
    "exampleContextByLocale": {
      "es": "Divide nombre, apellido y edad en 3 celdas horizontales contiguas.",
      "en": "Splits name, surname, and age into 3 adjacent horizontal cells.",
      "de": "Teilt Name, Nachname und Alter in 3 nebeneinanderliegende Zellen.",
      "fr": "Sépare nom, prénom et âge dans 3 cellules adjacentes.",
      "ja": "「名前,苗字,年齢」を3つの独立したセルに横展開して分割します。",
      "pt": "Divide nome, sobrenome e idade em 3 células adjacentes."
    },
    "exampleResultByLocale": {
      "es": "[Juan] [Pérez] [32]",
      "en": "[Juan] [Perez] [32]",
      "de": "[Juan] [Perez] [32]",
      "fr": "[Juan] [Perez] [32]",
      "ja": "[Juan] [Perez] [32]",
      "pt": "[Juan] [Perez] [32]"
    },
    "proTipByLocale": {
      "es": "Soporta múltiples delimitadores a la vez pasándolos entre llaves: {\",\", \";\", \"-\"}.",
      "en": "Supports multiple delimiters at once by passing an array constant: {\",\", \";\", \"-\"}.",
      "de": "Unterstützt mehrere Trennzeichen gleichzeitig via geschweifte Klammern: {\",\"; \";\"}.",
      "fr": "Gère plusieurs délimiteurs simultanés entre accolades : {\",\"; \";\"}.",
      "ja": "中括弧で配列を渡せば複数の区切り文字を同時に指定可能: {\",\", \";\", \"-\"}。",
      "pt": "Suporta múltiplos delimitadores de uma vez passando entre chaves: {\",\"; \";\"}."
    },
    "tags": [
      "textsplit",
      "dividirtexto",
      "separar",
      "columnas",
      "delimitar"
    ]
  },
  {
    "id": "trim",
    "nameEn": "TRIM",
    "category": "text",
    "exampleFormula": "=TRIM(A1)",
    "nameByLocale": {
      "es": "ESPACIOS",
      "en": "TRIM",
      "de": "GLÄTTEN",
      "fr": "SUPPRESPACE",
      "ja": "TRIM",
      "pt": "ARRUMAR"
    },
    "descriptionByLocale": {
      "es": "Elimina todos los espacios dobles, al inicio o al final de un texto, dejando solo espacios simples.",
      "en": "Removes all spaces from text except for single spaces between words.",
      "de": "Entfernt überflüssige Leerzeichen am Anfang, Ende und doppelte Leerzeichen.",
      "fr": "Supprime tous les espaces superflus sauf les espaces simples entre mots.",
      "ja": "文字列の前後の空白や、単語間の連続する余分な空白を削除します。",
      "pt": "Remove todos os espaços em excesso no início, final e espaços duplos entre palavras."
    },
    "syntaxByLocale": {
      "es": "=ESPACIOS(texto)",
      "en": "=TRIM(text)",
      "de": "=GLÄTTEN(Text)",
      "fr": "=SUPPRESPACE(texte)",
      "ja": "=TRIM(文字列)",
      "pt": "=ARRUMAR(texto)"
    },
    "exampleContextByLocale": {
      "es": "A1 contiene \"  Excel   Total  \" traído de un sistema externo.",
      "en": "A1 contains \"  Excel   Total  \" imported from an external system.",
      "de": "A1 enthält \"  Excel   Total  \" aus einem Systemimport.",
      "fr": "A1 contient \"  Excel   Total  \" issu d'un export externe.",
      "ja": "外部システムから取り込んだ不要な空白付き文字列「  Excel   Total  」。",
      "pt": "A1 contém \"  Excel   Total  \" importado de sistema legado."
    },
    "exampleResultByLocale": {
      "es": "\"Excel Total\"",
      "en": "\"Excel Total\"",
      "de": "\"Excel Total\"",
      "fr": "\"Excel Total\"",
      "ja": "\"Excel Total\"",
      "pt": "\"Excel Total\""
    },
    "proTipByLocale": {
      "es": "¡El secreto de oro para arreglar BUSCARV cuando falla por espacios invisibles al final!",
      "en": "The #1 lifesaver when VLOOKUP fails due to trailing invisible spaces!",
      "de": "Der ultimative Retter, wenn SVERWEIS wegen unsichtbarer Leerzeichen fehlschlägt!",
      "fr": "L'astuce magique lorsque RECHERCHEV échoue à cause d'espaces invisibles !",
      "ja": "末尾の見えない空白のせいでVLOOKUPが#N/Aエラーになるときの救世主です！",
      "pt": "O segredo de ouro para corrigir PROCV quando falha por espaços invisíveis!"
    },
    "tags": [
      "trim",
      "espacios",
      "limpiar",
      "glätten",
      "arrumar"
    ]
  },
  {
    "id": "substitute",
    "nameEn": "SUBSTITUTE",
    "category": "text",
    "exampleFormula": "=SUBSTITUTE(\"2026-11-03\", \"-\", \"/\")",
    "nameByLocale": {
      "es": "SUSTITUIR",
      "en": "SUBSTITUTE",
      "de": "WECHSELN",
      "fr": "SUBSTITUE",
      "ja": "SUBSTITUTE",
      "pt": "SUBSTITUIR"
    },
    "descriptionByLocale": {
      "es": "Reemplaza texto existente con texto nuevo dentro de una cadena. Es sensible a mayúsculas y minúsculas.",
      "en": "Substitutes new text for old text in a string.",
      "de": "Ersetzt bestehenden Text in einer Zeichenkette durch neuen Text.",
      "fr": "Remplace l'ancien texte par un nouveau dans une chaîne.",
      "ja": "文字列中の指定した文字を新しい文字に置き換えます(大文字・小文字を区別)。",
      "pt": "Substitui texto antigo por novo texto em uma cadeia de caracteres."
    },
    "syntaxByLocale": {
      "es": "=SUSTITUIR(texto, texto_original, texto_nuevo, [núm_de_ocurrencia])",
      "en": "=SUBSTITUTE(text, old_text, new_text, [instance_num])",
      "de": "=WECHSELN(Text; Alter_Text; Neuer_Text; [Exemplar])",
      "fr": "=SUBSTITUE(texte; ancien_texte; nouveau_texte; [no_occurrence])",
      "ja": "=SUBSTITUTE(文字列, 検索文字列, 置換文字列, [置換対象])",
      "pt": "=SUBSTITUIR(texto; texto_antigo; novo_texto; [núm_da_ocorrência])"
    },
    "exampleContextByLocale": {
      "es": "Cambia los guiones por barras inclinadas en el formato de fecha.",
      "en": "Replaces hyphens with slashes in a date text format.",
      "de": "Ersetzt Bindestriche durch Schrägstriche im Datumsformat.",
      "fr": "Remplace les tirets par des barres obliques.",
      "ja": "日付文字列のハイフン(-)をスラッシュ(/)に一括置換。",
      "pt": "Substitui os hífens por barras no formato de data."
    },
    "exampleResultByLocale": {
      "es": "\"2026/11/03\"",
      "en": "\"2026/11/03\"",
      "de": "\"2026/11/03\"",
      "fr": "\"2026/11/03\"",
      "ja": "\"2026/11/03\"",
      "pt": "\"2026/11/03\""
    },
    "proTipByLocale": {
      "es": "Si omites núm_de_ocurrencia, reemplaza todas las veces que aparezca. Si pones 1, solo la primera.",
      "en": "If instance_num is omitted, replaces all occurrences. Specify 1 to replace only the first one.",
      "de": "Ohne Exemplarangabe wird jedes Vorkommen ersetzt; mit 1 nur das allererste.",
      "fr": "Sans précision, remplace toutes les apparitions. Indiquez 1 pour la première seulement.",
      "ja": "第4引数を省略すると全件置換、「1」を指定すると最初に出現した1箇所だけを置換します。",
      "pt": "Se omitir a ocorrência, substitui todas as vezes. Se colocar 1, apenas a primeira."
    },
    "tags": [
      "substitute",
      "sustituir",
      "reemplazar",
      "cambiar",
      "texto"
    ]
  },
  {
    "id": "proper",
    "nameEn": "PROPER",
    "category": "text",
    "exampleFormula": "=PROPER(\"carlos alberto perez\")",
    "nameByLocale": {
      "es": "NOMPROPIO",
      "en": "PROPER",
      "de": "GROSS2",
      "fr": "NOMPROPRE",
      "ja": "PROPER",
      "pt": "PRI.MAIÚSCULA"
    },
    "descriptionByLocale": {
      "es": "Convierte en mayúscula la primera letra de cada palabra en una cadena de texto y el resto en minúsculas.",
      "en": "Capitalizes the first letter in each word of a text value.",
      "de": "Wandelt den ersten Buchstaben jedes Wortes in Großbuchstaben um.",
      "fr": "Met en majuscule la première lettre de chaque mot.",
      "ja": "単語の先頭文字を大文字に、それ以降の文字を小文字に変換します。",
      "pt": "Converte a primeira letra de cada palavra em maiúscula e as demais em minúsculas."
    },
    "syntaxByLocale": {
      "es": "=NOMPROPIO(texto)",
      "en": "=PROPER(text)",
      "de": "=GROSS2(Text)",
      "fr": "=NOMPROPRE(texte)",
      "ja": "=PROPER(文字列)",
      "pt": "=PRI.MAIÚSCULA(texto)"
    },
    "exampleContextByLocale": {
      "es": "Estandariza nombres de clientes mal ingresados en el sistema.",
      "en": "Standardizes messy customer names from web forms.",
      "de": "Standardisiert unordentlich eingegebene Kundennamen.",
      "fr": "Normalise les noms de clients mal saisis.",
      "ja": "小文字で乱れた顧客名を標準的な人名表記に整えます。",
      "pt": "Padroniza nomes de clientes digitados em caixa baixa."
    },
    "exampleResultByLocale": {
      "es": "\"Carlos Alberto Perez\"",
      "en": "\"Carlos Alberto Perez\"",
      "de": "\"Carlos Alberto Perez\"",
      "fr": "\"Carlos Alberto Perez\"",
      "ja": "\"Carlos Alberto Perez\"",
      "pt": "\"Carlos Alberto Perez\""
    },
    "proTipByLocale": {
      "es": "Combínalo con ESPACIOS: =NOMPROPIO(ESPACIOS(A1)) para limpiar y dejar impecables los nombres propios.",
      "en": "Chain with TRIM: =PROPER(TRIM(A1)) to simultaneously clean rogue spaces and fix casing.",
      "de": "Kombiniere mit GLÄTTEN: =GROSS2(GLÄTTEN(A1)) für perfekt aufgeräumte Namen.",
      "fr": "Associez avec SUPPRESPACE : =NOMPROPRE(SUPPRESPACE(A1)) pour un résultat parfait.",
      "ja": "TRIMと連結: =PROPER(TRIM(A1)) で余分な空白除去と先頭大文字化を同時に行えます。",
      "pt": "Combine com ARRUMAR: =PRI.MAIÚSCULA(ARRUMAR(A1)) para limpar espaços e formatar nomes."
    },
    "tags": [
      "proper",
      "nompropio",
      "mayuscula",
      "nombres",
      "estandarizar"
    ]
  },
  {
    "id": "average",
    "nameEn": "AVERAGE",
    "category": "stats",
    "exampleFormula": "=AVERAGE(B2:B30)",
    "nameByLocale": {
      "es": "PROMEDIO",
      "en": "AVERAGE",
      "de": "MITTELWERT",
      "fr": "MOYENNE",
      "ja": "AVERAGE",
      "pt": "MÉDIA"
    },
    "descriptionByLocale": {
      "es": "Calcula el promedio aritmético de los valores numéricos contenidos en un rango de celdas.",
      "en": "Returns the arithmetic average of its arguments.",
      "de": "Berechnet das arithmetische Mittel der Zahlen in einem Bereich.",
      "fr": "Renvoie la moyenne arithmétique de ses arguments.",
      "ja": "引数に含まれる数値の算術平均を返します。",
      "pt": "Calcula a média aritmética dos valores numéricos em um intervalo."
    },
    "syntaxByLocale": {
      "es": "=PROMEDIO(número1, [número2], ...)",
      "en": "=AVERAGE(number1, [number2], ...)",
      "de": "=MITTELWERT(Zahl1; [Zahl2]; ...)",
      "fr": "=MOYENNE(nombre1; [nombre2]; ...)",
      "ja": "=AVERAGE(数値1, [数値2], ...)",
      "pt": "=MÉDIA(número1; [número2]; ...)"
    },
    "exampleContextByLocale": {
      "es": "Calcula el ticket de venta promedio del mes.",
      "en": "Calculates the average order value of the month.",
      "de": "Berechnet den durchschnittlichen Monatsbestellwert.",
      "fr": "Calcule le panier moyen des ventes du mois.",
      "ja": "今月の平均注文単価を計算します。",
      "pt": "Calcula o ticket médio das vendas do mês."
    },
    "exampleResultByLocale": {
      "es": "84.50",
      "en": "84.50",
      "de": "84,50",
      "fr": "84,50",
      "ja": "84.50",
      "pt": "84,50"
    },
    "proTipByLocale": {
      "es": "Ignora celdas vacías y texto, pero SÍ incluye ceros numéricos (0), afectando el promedio.",
      "en": "Ignores empty cells and text, but DOES include numeric zeros (0), lowering the average.",
      "de": "Ignoriert leere Zellen und Text, zählt aber numerische Nullen (0) mit!",
      "fr": "Ignore les cellules vides, mais inclut les zéros (0) numériques !",
      "ja": "空白や文字列は無視しますが、数値のゼロ(0)は集計対象となり平均が下がるため注意。",
      "pt": "Ignora células vazias e texto, mas inclui zeros (0), o que afeta o cálculo."
    },
    "tags": [
      "average",
      "promedio",
      "media",
      "estadistica",
      "mittelwert"
    ]
  },
  {
    "id": "averageifs",
    "nameEn": "AVERAGEIFS",
    "category": "stats",
    "exampleFormula": "=AVERAGEIFS(C2:C50, A2:A50, \"Norte\", B2:B50, \"Directo\")",
    "nameByLocale": {
      "es": "PROMEDIO.SI.CONJUNTO",
      "en": "AVERAGEIFS",
      "de": "MITTELWERTWENNS",
      "fr": "MOYENNE.SI.ENS",
      "ja": "AVERAGEIFS",
      "pt": "MÉDIASES"
    },
    "descriptionByLocale": {
      "es": "Calcula el promedio de las celdas que cumplen con múltiples criterios simultáneos.",
      "en": "Returns the average of cells that meet multiple criteria across ranges.",
      "de": "Berechnet den Mittelwert für Zellen, die mehrere Kriterien erfüllen.",
      "fr": "Calcule la moyenne des cellules répondant à plusieurs conditions.",
      "ja": "複数の検索条件をすべて満たすセルの数値平均を計算します。",
      "pt": "Calcula a média das células que atendem a múltiplos critérios simultâneos."
    },
    "syntaxByLocale": {
      "es": "=PROMEDIO.SI.CONJUNTO(rango_promedio, rango_criterios1, criterio1, ...)",
      "en": "=AVERAGEIFS(average_range, criteria_range1, criteria1, ...)",
      "de": "=MITTELWERTWENNS(Mittelwert_Bereich; Bereich1; Kriterium1; ...)",
      "fr": "=MOYENNE.SI.ENS(plage_moyenne; plage_critères1; critère1; ...)",
      "ja": "=AVERAGEIFS(平均範囲, 条件範囲1, 条件1, ...)",
      "pt": "=MÉDIASES(intervalo_média; intervalo_critérios1; critérios1; ...)"
    },
    "exampleContextByLocale": {
      "es": "Promedio de ventas (C) para canal Directo en zona Norte.",
      "en": "Average sales (C) for Direct channel in North region.",
      "de": "Durchschnittlicher Umsatz (C) für Direktvertrieb in Region Nord.",
      "fr": "Moyenne des ventes (C) du canal Direct en région Nord.",
      "ja": "北地域かつ直販チャネルの平均売上額を算出。",
      "pt": "Média de vendas (C) para canal Direto na região Norte."
    },
    "exampleResultByLocale": {
      "es": "$1,420.00",
      "en": "$1,420.00",
      "de": "1.420,00 €",
      "fr": "1 420,00 €",
      "ja": "¥142,000",
      "pt": "R$ 1.420,00"
    },
    "proTipByLocale": {
      "es": "El rango a promediar se coloca como el primer parámetro de la fórmula.",
      "en": "The average_range always comes as the very first argument.",
      "de": "Der zu mittelnde Bereich steht stets an erster Stelle.",
      "fr": "La plage dont on calcule la moyenne se place au début.",
      "ja": "SUMIFSと同様に「平均対象範囲」を先頭に配置します。",
      "pt": "O intervalo a calcular a média vem sempre no primeiro argumento."
    },
    "tags": [
      "averageifs",
      "promedio.si.conjunto",
      "condicional",
      "criterios"
    ]
  },
  {
    "id": "countif",
    "nameEn": "COUNTIF",
    "category": "stats",
    "exampleFormula": "=COUNTIF(C2:C100, \"Pagado\")",
    "nameByLocale": {
      "es": "CONTAR.SI",
      "en": "COUNTIF",
      "de": "ZÄHLENWENN",
      "fr": "NB.SI",
      "ja": "COUNTIF",
      "pt": "CONT.SE"
    },
    "descriptionByLocale": {
      "es": "Cuenta cuántas celdas dentro de un rango cumplen con un criterio o condición determinada.",
      "en": "Counts the number of cells within a range that meet the given criteria.",
      "de": "Zählt die Zellen in einem Bereich, die das angegebene Kriterium erfüllen.",
      "fr": "Compte le nombre de cellules d'une plage répondant au critère spécifié.",
      "ja": "指定した範囲内で、検索条件に一致するセルの個数を数えます。",
      "pt": "Conta quantas células dentro de um intervalo atendem a um critério ou condição específica."
    },
    "syntaxByLocale": {
      "es": "=CONTAR.SI(rango, criterio)",
      "en": "=COUNTIF(range, criteria)",
      "de": "=ZÄHLENWENN(Bereich; Suchkriterien)",
      "fr": "=NB.SI(plage; critère)",
      "ja": "=COUNTIF(範囲, 検索条件)",
      "pt": "=CONT.SE(intervalo; critérios)"
    },
    "exampleContextByLocale": {
      "es": "Cuenta cuántas facturas tienen estado Pagado.",
      "en": "Counts how many invoices have Paid status.",
      "de": "Zählt, wie viele Rechnungen den Status Bezahlt haben.",
      "fr": "Compte les factures ayant le statut Payé.",
      "ja": "ステータスが「Pagado(支払済)」の請求書数をカウント。",
      "pt": "Conta quantas faturas estão com status Pago."
    },
    "exampleResultByLocale": {
      "es": "42 facturas",
      "en": "42 invoices",
      "de": "42 Rechnungen",
      "fr": "42 factures",
      "ja": "42 件",
      "pt": "42 faturas"
    },
    "proTipByLocale": {
      "es": "Para contar celdas que contienen cierta palabra sin importar dónde esté: =CONTAR.SI(A1:A50, \"*VIP*\").",
      "en": "To count cells containing a word anywhere inside: =COUNTIF(A1:A50, \"*VIP*\").",
      "de": "Um Zellen mit beliebiger Zeichenfolge zu zählen: =ZÄHLENWENN(A1:A50; \"*VIP*\").",
      "fr": "Pour compter les cellules contenant un mot précis : =NB.SI(A1:A50; \"*VIP*\").",
      "ja": "文字列の一部を含むセルを数えるにはワイルドカードを使用: =COUNTIF(A1:A50, \"*VIP*\")。",
      "pt": "Para contar células com texto parcial: =CONT.SE(A1:A50; \"*VIP*\")."
    },
    "tags": [
      "countif",
      "contar.si",
      "conteo",
      "criterio",
      "nb.si"
    ]
  },
  {
    "id": "countifs",
    "nameEn": "COUNTIFS",
    "category": "stats",
    "exampleFormula": "=COUNTIFS(A2:A100, \"Madrid\", B2:B100, \"Pendiente\")",
    "nameByLocale": {
      "es": "CONTAR.SI.CONJUNTO",
      "en": "COUNTIFS",
      "de": "ZÄHLENWENNS",
      "fr": "NB.SI.ENS",
      "ja": "COUNTIFS",
      "pt": "CONT.SES"
    },
    "descriptionByLocale": {
      "es": "Cuenta el número de filas o celdas que cumplen simultáneamente con múltiples criterios.",
      "en": "Counts the number of times multiple criteria are met across cell ranges.",
      "de": "Zählt Zellen, die mehrere Kriterien gleichzeitig erfüllen.",
      "fr": "Compte le nombre de cellules satisfaisant à plusieurs conditions.",
      "ja": "複数の検索条件すべてを満たすセルの個数を数えます。",
      "pt": "Conta o número de vezes que múltiplos critérios são atendidos."
    },
    "syntaxByLocale": {
      "es": "=CONTAR.SI.CONJUNTO(rango_criterios1, criterio1, [rango2, criterio2], ...)",
      "en": "=COUNTIFS(criteria_range1, criteria1, [criteria_range2, criteria2], ...)",
      "de": "=ZÄHLENWENNS(Bereich1; Kriterium1; [Bereich2; Kriterium2]; ...)",
      "fr": "=NB.SI.ENS(plage1; critère1; [plage2; critère2]; ...)",
      "ja": "=COUNTIFS(条件範囲1, 条件1, [条件範囲2, 条件2], ...)",
      "pt": "=CONT.SES(intervalo1; critérios1; [intervalo2; critérios2]; ...)"
    },
    "exampleContextByLocale": {
      "es": "Cuenta pedidos de la ciudad Madrid con estado Pendiente.",
      "en": "Counts orders for Madrid with status Pending.",
      "de": "Zählt Bestellungen für Madrid mit Status Ausstehend.",
      "fr": "Compte les commandes de Madrid en statut En attente.",
      "ja": "都市がMadridかつステータスがPendingの注文件数を集計。",
      "pt": "Conta pedidos da cidade Madrid com status Pendente."
    },
    "exampleResultByLocale": {
      "es": "15",
      "en": "15",
      "de": "15",
      "fr": "15",
      "ja": "15",
      "pt": "15"
    },
    "proTipByLocale": {
      "es": "Para contar registros entre dos fechas: =CONTAR.SI.CONJUNTO(A:A, \">=01/01/2026\", A:A, \"<=31/01/2026\").",
      "en": "To count records between two dates: =COUNTIFS(A:A, \">=2026-01-01\", A:A, \"<=2026-01-31\").",
      "de": "Datumsbereiche zählen: =ZÄHLENWENNS(A:A; \">=01.01.2026\"; A:A; \"<=31.01.2026\").",
      "fr": "Compter entre deux dates : =NB.SI.ENS(A:A; \">=01/01/2026\"; A:A; \"<=31/01/2026\").",
      "ja": "期間内のデータ件数を数える定番: =COUNTIFS(A:A, \">=2026/01/01\", A:A, \"<=2026/01/31\")。",
      "pt": "Para contar entre duas datas: =CONT.SES(A:A; \">=01/01/2026\"; A:A; \"<=31/01/2026\")."
    },
    "tags": [
      "countifs",
      "contar.si.conjunto",
      "fechas",
      "multiple",
      "conteo"
    ]
  },
  {
    "id": "countblank",
    "nameEn": "COUNTBLANK",
    "category": "stats",
    "exampleFormula": "=COUNTBLANK(D2:D50)",
    "nameByLocale": {
      "es": "CONTAR.BLANCO",
      "en": "COUNTBLANK",
      "de": "ANZAHLLEEREZELLEN",
      "fr": "NB.VIDE",
      "ja": "COUNTBLANK",
      "pt": "CONTAR.VAZIO"
    },
    "descriptionByLocale": {
      "es": "Cuenta el número exacto de celdas vacías dentro de un rango determinado.",
      "en": "Counts empty cells in a specified range of cells.",
      "de": "Zählt die leeren Zellen in einem bestimmten Zellbereich.",
      "fr": "Compte le nombre de cellules vides dans une plage.",
      "ja": "指定した範囲内に含まれる空白セルの個数を数えます。",
      "pt": "Conta o número de células vazias em um intervalo especificado."
    },
    "syntaxByLocale": {
      "es": "=CONTAR.BLANCO(rango)",
      "en": "=COUNTBLANK(range)",
      "de": "=ANZAHLLEEREZELLEN(Bereich)",
      "fr": "=NB.VIDE(plage)",
      "ja": "=COUNTBLANK(範囲)",
      "pt": "=CONTAR.VAZIO(intervalo)"
    },
    "exampleContextByLocale": {
      "es": "Detecta clientes a los que les falta ingresar el número telefónico.",
      "en": "Detects customer profiles missing a phone number.",
      "de": "Erkennt Kundenprofile ohne hinterlegte Telefonnummer.",
      "fr": "Repère les fiches clients où manque le numéro de téléphone.",
      "ja": "電話番号欄が未入力になっている顧客数を抽出。",
      "pt": "Detecta clientes com telefone em branco no cadastro."
    },
    "exampleResultByLocale": {
      "es": "7 celdas vacías",
      "en": "7 empty cells",
      "de": "7 leere Zellen",
      "fr": "7 cellules vides",
      "ja": "7 個の空白",
      "pt": "7 células vazias"
    },
    "proTipByLocale": {
      "es": "Celdas que tienen fórmulas que devuelven \"\" (texto vacío) son contadas como en blanco por esta función.",
      "en": "Cells containing formulas that return \"\" (blank text) are treated as blank by this function.",
      "de": "Zellen mit Formeln, die \"\" ausgeben, gelten hier als leer.",
      "fr": "Les cellules avec une formule renvoyant \"\" sont comptabilisées comme vides.",
      "ja": "数式で「\"\"」(空文字)を返しているセルも空白として正しくカウントされます。",
      "pt": "Células com fórmulas retornando \"\" são contadas como vazias por esta função."
    },
    "tags": [
      "countblank",
      "contar.blanco",
      "vacias",
      "faltantes",
      "auditoria"
    ]
  },
  {
    "id": "large_small",
    "nameEn": "LARGE / SMALL",
    "category": "stats",
    "exampleFormula": "=LARGE(B2:B50, 2)",
    "nameByLocale": {
      "es": "K.ESIMO.MAYOR / MENOR",
      "en": "LARGE / SMALL",
      "de": "KGRÖSSTE / KKLEINSTE",
      "fr": "GRANDE.VALEUR / PETITE.VALEUR",
      "ja": "LARGE / SMALL",
      "pt": "MAIOR / MENOR"
    },
    "descriptionByLocale": {
      "es": "Devuelve el k-ésimo valor más grande (LARGE) o más pequeño (SMALL) de un conjunto (ej: el 2do o 3er lugar).",
      "en": "Returns the k-th largest or smallest value in a data set.",
      "de": "Gibt den k-größten oder k-kleinsten Wert eines Datensatzes zurück.",
      "fr": "Renvoie la k-ième plus grande ou plus petite valeur.",
      "ja": "データセットの中でk番目に大きい値(LARGE)、または小さい値(SMALL)を返します。",
      "pt": "Retorna o k-ésimo maior ou menor valor de um conjunto de dados."
    },
    "syntaxByLocale": {
      "es": "=K.ESIMO.MAYOR(matriz, k) | =K.ESIMO.MENOR(matriz, k)",
      "en": "=LARGE(array, k) | =SMALL(array, k)",
      "de": "=KGRÖSSTE(Matrix; k) | =KKLEINSTE(Matrix; k)",
      "fr": "=GRANDE.VALEUR(matrice; k) | =PETITE.VALEUR(matrice; k)",
      "ja": "=LARGE(配列, 順位) | =SMALL(配列, 順位)",
      "pt": "=MAIOR(matriz; k) | =MENOR(matriz; k)"
    },
    "exampleContextByLocale": {
      "es": "Encuentra el segundo salario más alto de la empresa.",
      "en": "Finds the 2nd highest salary in the company.",
      "de": "Ermittelt das zweithöchste Gehalt des Unternehmens.",
      "fr": "Trouve le 2e salaire le plus élevé de l'entreprise.",
      "ja": "社内で2番目に高い給与額を取得。",
      "pt": "Encontra o 2º salário mais alto da empresa."
    },
    "exampleResultByLocale": {
      "es": "$4,800.00",
      "en": "$4,800.00",
      "de": "4.800,00 €",
      "fr": "4 800,00 €",
      "ja": "¥480,000",
      "pt": "R$ 4.800,00"
    },
    "proTipByLocale": {
      "es": "Para crear un Top 3 o Top 5 dinámico, combina: =LARGE(rango, SEQUENCE(3)).",
      "en": "Build a live Top 3 leaderboard instantly: =LARGE(range, SEQUENCE(3)).",
      "de": "Erstelle eine dynamische Top-3-Liste mit =KGRÖSSTE(Bereich; SEQUENZ(3)).",
      "fr": "Créez un Top 3 dynamique immédiat : =GRANDE.VALEUR(plage; SEQUENCE(3)).",
      "ja": "トップ3を一覧出力する最強コンボ: =LARGE(範囲, SEQUENCE(3))。",
      "pt": "Crie um Top 3 dinâmico instantâneo com =MAIOR(intervalo; SEQUÊNCIA(3))."
    },
    "tags": [
      "large",
      "small",
      "ranking",
      "top",
      "podio",
      "k.esimo"
    ]
  },
  {
    "id": "today",
    "nameEn": "TODAY",
    "category": "date",
    "exampleFormula": "=TODAY()",
    "nameByLocale": {
      "es": "HOY",
      "en": "TODAY",
      "de": "HEUTE",
      "fr": "AUJOURDHUI",
      "ja": "TODAY",
      "pt": "HOJE"
    },
    "descriptionByLocale": {
      "es": "Devuelve la fecha actual del sistema. Se actualiza automáticamente cada día que abres la hoja.",
      "en": "Returns the current date. Automatically updates whenever a worksheet is calculated.",
      "de": "Gibt das aktuelle Tagesdatum zurück und aktualisiert sich automatisch.",
      "fr": "Renvoie la date du jour et se met à jour automatiquement.",
      "ja": "現在の日付を返します。ワークシートを開くたびに自動更新されます。",
      "pt": "Retorna a data atual do sistema, atualizando-se sempre que a planilha é recalculada."
    },
    "syntaxByLocale": {
      "es": "=HOY()",
      "en": "=TODAY()",
      "de": "=HEUTE()",
      "fr": "=AUJOURDHUI()",
      "ja": "=TODAY()",
      "pt": "=HOJE()"
    },
    "exampleContextByLocale": {
      "es": "Calcula días transcurridos desde una factura: =HOY() - A2.",
      "en": "Calculates days elapsed since invoice: =TODAY() - A2.",
      "de": "Berechnet vergangene Tage seit Rechnungsstellung: =HEUTE() - A2.",
      "fr": "Calcule les jours écoulés depuis la facture : =AUJOURDHUI() - A2.",
      "ja": "請求日からの経過日数を計算: =TODAY() - A2。",
      "pt": "Calcula os dias decorridos desde a emissão: =HOJE() - A2."
    },
    "exampleResultByLocale": {
      "es": "2026-11-03",
      "en": "2026-11-03",
      "de": "03.11.2026",
      "fr": "03/11/2026",
      "ja": "2026/11/03",
      "pt": "03/11/2026"
    },
    "proTipByLocale": {
      "es": "Si quieres congelar la fecha de hoy estática (que no cambie mañana), usa el atajo Ctrl + ;.",
      "en": "If you want a fixed, static date that won't change tomorrow, press Ctrl + ; instead.",
      "de": "Für ein festes statisches Datum, das morgen gleich bleibt, drücke Strg + ;.",
      "fr": "Pour figer la date du jour de façon statique, utilisez le raccourci Ctrl + ;.",
      "ja": "明日になっても変わらない静的な本日日付を入力するには、ショートカット Ctrl + ; を使います。",
      "pt": "Se quiser congelar a data estática (que não mude amanhã), use o atalho Ctrl + ;."
    },
    "tags": [
      "today",
      "hoy",
      "fecha",
      "heute",
      "hoje",
      "dinamica"
    ]
  },
  {
    "id": "edate",
    "nameEn": "EDATE",
    "category": "date",
    "exampleFormula": "=EDATE(A2, 12)",
    "nameByLocale": {
      "es": "FECHA.MES",
      "en": "EDATE",
      "de": "EDATUM",
      "fr": "MOIS.DECALER",
      "ja": "EDATE",
      "pt": "DATAM"
    },
    "descriptionByLocale": {
      "es": "Devuelve la fecha que cae exactamente un número indicado de meses antes o después de la fecha inicial.",
      "en": "Returns the serial number of the date that is the indicated number of months before or after.",
      "de": "Gibt das Datum zurück, das eine bestimmte Anzahl an Monaten vor oder nach dem Startdatum liegt.",
      "fr": "Renvoie la date située un nombre déterminé de mois avant ou après.",
      "ja": "開始日から起算して指定された月数だけ前または後の日付を返します。",
      "pt": "Retorna a data que está o número indicado de meses antes ou depois da data inicial."
    },
    "syntaxByLocale": {
      "es": "=FECHA.MES(fecha_inicial, meses)",
      "en": "=EDATE(start_date, months)",
      "de": "=EDATUM(Ausgangsdatum; Monate)",
      "fr": "=MOIS.DECALER(date_départ; mois)",
      "ja": "=EDATE(開始日, 月)",
      "pt": "=DATAM(data_inicial; meses)"
    },
    "exampleContextByLocale": {
      "es": "Calcula el vencimiento anual exacto de una póliza contratada en A2.",
      "en": "Computes exact 1-year expiration date for a policy started in A2.",
      "de": "Berechnet Ablaufdatum nach genau 12 Monaten.",
      "fr": "Calcule l'échéance annuelle exacte d'un contrat.",
      "ja": "契約開始日(A2)からちょうど1年後(12ヶ月後)の満期日を算出。",
      "pt": "Calcula o vencimento anual exato de um contrato iniciado em A2."
    },
    "exampleResultByLocale": {
      "es": "03/11/2027",
      "en": "11/03/2027",
      "de": "03.11.2027",
      "fr": "03/11/2027",
      "ja": "2027/11/03",
      "pt": "03/11/2027"
    },
    "proTipByLocale": {
      "es": "Usa números negativos para retroceder en el tiempo: =FECHA.MES(HOY(), -3) da el día equivalente hace un trimestre.",
      "en": "Pass negative integers to go back in time: =EDATE(TODAY(), -3) gives the date 3 months ago.",
      "de": "Negative Zahlen gehen zurück: =EDATUM(HEUTE(); -3) ergibt das Datum vor 3 Monaten.",
      "fr": "Utilisez des valeurs négatives pour reculer : =MOIS.DECALER(AUJOURDHUI(); -3).",
      "ja": "負の数を指定すれば過去の日付を逆算できます: =EDATE(TODAY(), -3)。",
      "pt": "Use números negativos para voltar meses no tempo: =DATAM(HOJE(); -3)."
    },
    "tags": [
      "edate",
      "fecha.mes",
      "vencimientos",
      "meses",
      "datam"
    ]
  },
  {
    "id": "eomonth",
    "nameEn": "EOMONTH",
    "category": "date",
    "exampleFormula": "=EOMONTH(TODAY(), 0)",
    "nameByLocale": {
      "es": "FIN.MES",
      "en": "EOMONTH",
      "de": "MONATSENDE",
      "fr": "FIN.MOIS",
      "ja": "EOMONTH",
      "pt": "FIMMÊS"
    },
    "descriptionByLocale": {
      "es": "Devuelve el último día del mes, un número especificado de meses hacia adelante o atrás.",
      "en": "Returns the last day of the month before or after a specified number of months.",
      "de": "Gibt den letzten Tag des Monats vor oder nach einer bestimmten Monatsanzahl zurück.",
      "fr": "Renvoie le dernier jour du mois situé avant ou après un nombre de mois.",
      "ja": "開始日から起算して指定された月数だけ前または後の月の最終日(月末)を返します。",
      "pt": "Retorna o último dia do mês antes ou depois de um número especificado de meses."
    },
    "syntaxByLocale": {
      "es": "=FIN.MES(fecha_inicial, meses)",
      "en": "=EOMONTH(start_date, months)",
      "de": "=MONATSENDE(Ausgangsdatum; Monate)",
      "fr": "=FIN.MOIS(date_départ; mois)",
      "ja": "=EOMONTH(開始日, 月)",
      "pt": "=FIMMÊS(data_inicial; meses)"
    },
    "exampleContextByLocale": {
      "es": "Calcula la fecha de cierre contable del mes en curso.",
      "en": "Determines the accounting closing date for the current active month.",
      "de": "Ermittelt das Monatsende für den aktuellen Abrechnungsmonat.",
      "fr": "Détermine la date de clôture du mois en cours.",
      "ja": "当月末(今月末日)の日付を正確に取得します。",
      "pt": "Calcula a data do fechamento contábil do mês atual."
    },
    "exampleResultByLocale": {
      "es": "30/11/2026",
      "en": "11/30/2026",
      "de": "30.11.2026",
      "fr": "30/11/2026",
      "ja": "2026/11/30",
      "pt": "30/11/2026"
    },
    "proTipByLocale": {
      "es": "Para obtener el PRIMER DÍA del próximo mes: =FIN.MES(HOY(), 0) + 1.",
      "en": "To get the FIRST DAY of next month: =EOMONTH(TODAY(), 0) + 1.",
      "de": "Erster Tag des Folgemonats: =MONATSENDE(HEUTE(); 0) + 1.",
      "fr": "Pour obtenir le 1er jour du mois suivant : =FIN.MOIS(AUJOURDHUI(); 0) + 1.",
      "ja": "来月1日の日付を求める極意: =EOMONTH(TODAY(), 0) + 1。",
      "pt": "Para obter o PRIMEIRO DIA do próximo mês: =FIMMÊS(HOJE(); 0) + 1."
    },
    "tags": [
      "eomonth",
      "fin.mes",
      "cierre",
      "mes",
      "fimmes"
    ]
  },
  {
    "id": "workday",
    "nameEn": "WORKDAY",
    "category": "date",
    "exampleFormula": "=WORKDAY(TODAY(), 15, F1:F5)",
    "nameByLocale": {
      "es": "DIA.LAB",
      "en": "WORKDAY",
      "de": "ARBEITSTAG",
      "fr": "JOUR.OUVRE",
      "ja": "WORKDAY",
      "pt": "DIATRABALHO"
    },
    "descriptionByLocale": {
      "es": "Calcula la fecha final resultante de sumar un número de días hábiles a una fecha inicial, saltando fines de semana y festivos.",
      "en": "Returns a date that is a number of working days ahead or back, excluding weekends and holidays.",
      "de": "Gibt ein Datum zurück, das eine bestimmte Anzahl von Arbeitstagen vor oder nach einem Datum liegt.",
      "fr": "Renvoie la date résultant de l'addition de jours ouvrés en excluant week-ends et fériés.",
      "ja": "開始日から起算して、指定された稼働日数だけ前または後の営業日を返します。",
      "pt": "Calcula a data resultante de adicionar dias úteis a uma data inicial, pulando finais de semana e feriados."
    },
    "syntaxByLocale": {
      "es": "=DIA.LAB(fecha_inicial, días, [festivos])",
      "en": "=WORKDAY(start_date, days, [holidays])",
      "de": "=ARBEITSTAG(Ausgangsdatum; Tage; [Freie_Tage])",
      "fr": "=JOUR.OUVRE(date_départ; jours; [jours_fériés])",
      "ja": "=WORKDAY(開始日, 日数, [祭日])",
      "pt": "=DIATRABALHO(data_inicial; dias; [feriados])"
    },
    "exampleContextByLocale": {
      "es": "Calcula el día de entrega de un pedido con 15 días hábiles de plazo.",
      "en": "Computes promised delivery date for an order taking 15 business days.",
      "de": "Berechnet den Liefertermin bei 15 Werktagen Bearbeitungszeit.",
      "fr": "Calcule la date de livraison garantie avec 15 jours ouvrés.",
      "ja": "納期が15営業日の場合の正確な納品予定日を計算。",
      "pt": "Calcula a data de entrega de um pedido com prazo de 15 dias úteis."
    },
    "exampleResultByLocale": {
      "es": "24/11/2026",
      "en": "11/24/2026",
      "de": "24.11.2026",
      "fr": "24/11/2026",
      "ja": "2026/11/24",
      "pt": "24/11/2026"
    },
    "proTipByLocale": {
      "es": "Imprescindible para cronogramas de proyectos (Gantt) y acuerdos de nivel de servicio (SLA).",
      "en": "Essential for project roadmaps (Gantt charts) and realistic customer SLAs.",
      "de": "Unverzichtbar für Projektzeitpläne (Gantt) und Service-Level-Agreements (SLA).",
      "fr": "Indispensable pour les diagrammes de Gantt et le respect des SLA clients.",
      "ja": "プロジェクト進行管理(ガントチャート)や納期SLA管理に欠かせない関数です。",
      "pt": "Essencial para cronogramas de projetos (Gantt) e prazos de SLA."
    },
    "tags": [
      "workday",
      "dia.lab",
      "plazos",
      "sla",
      "gantt",
      "habiles"
    ]
  },
  {
    "id": "pmt",
    "nameEn": "PMT",
    "category": "financial",
    "exampleFormula": "=PMT(0.08/12, 360, -250000)",
    "nameByLocale": {
      "es": "PAGO",
      "en": "PMT",
      "de": "RMZ",
      "fr": "VPM",
      "ja": "PMT",
      "pt": "PGTO"
    },
    "descriptionByLocale": {
      "es": "Calcula la cuota periódica constante a pagar por un préstamo a tasa de interés fija.",
      "en": "Calculates the periodic payment for a loan based on constant payments and a constant interest rate.",
      "de": "Berechnet die regelmäßige Rückzahlungsrate für ein Darlehen.",
      "fr": "Calcule le montant du remboursement périodique d'un emprunt à taux fixe.",
      "ja": "一定の利率と支払い回数に基づいて、ローンの定期返済額を計算します。",
      "pt": "Calcula o valor do pagamento periódico de um empréstimo com juros constantes."
    },
    "syntaxByLocale": {
      "es": "=PAGO(tasa, nper, va, [vf], [tipo])",
      "en": "=PMT(rate, nper, pv, [fv], [type])",
      "de": "=RMZ(Zins; Zzr; Bw; [Zw]; [F])",
      "fr": "=VPM(taux; npm; va; [vc]; [type])",
      "ja": "=PMT(利率, 期間, 現在価値, [将来価値], [支払期日])",
      "pt": "=PGTO(taxa; nper; vp; [vf]; [tipo])"
    },
    "exampleContextByLocale": {
      "es": "Calcula la cuota mensual para una hipoteca de $250,000 a 30 años (360 meses) con tasa anual del 8%.",
      "en": "Calculates monthly payment for a $250,000 mortgage at 8% annual rate over 30 years.",
      "de": "Berechnet die Monatsrate für ein 250.000 € Darlehen bei 8% Zins über 30 Jahre.",
      "fr": "Calcule la mensualité d'un prêt de 250 000 € à 8% sur 30 ans.",
      "ja": "借入額250,000ドル、年利8%、30年(360回)返済の月々のローン返済額を試算。",
      "pt": "Calcula a parcela mensal para financiamento de R$ 250.000 a 8% ao ano em 30 anos."
    },
    "exampleResultByLocale": {
      "es": "$1,834.41 / mes",
      "en": "$1,834.41 / mo",
      "de": "1.834,41 € / Monat",
      "fr": "1 834,41 € / mois",
      "ja": "¥183,441 / 月",
      "pt": "R$ 1.834,41 / mês"
    },
    "proTipByLocale": {
      "es": "¡Divide la tasa entre 12 si las cuotas son mensuales! Y coloca el monto del préstamo en negativo para que la cuota sea positiva.",
      "en": "Divide annual rate by 12 for monthly payments! Put loan amount as negative to get a positive payment.",
      "de": "Jahreszins durch 12 teilen für monatliche Raten! Darlehen negativ eintragen.",
      "fr": "Divisez le taux annuel par 12 pour des mensualités ! Mettez le prêt en négatif.",
      "ja": "月払いなら年利を12で割るのがポイント！借入額にマイナスをつければ返済額がプラスで出ます。",
      "pt": "Divida a taxa por 12 se as parcelas forem mensais! E ponha o valor em negativo."
    },
    "tags": [
      "pmt",
      "pago",
      "prestamo",
      "hipoteca",
      "cuota",
      "intereses"
    ]
  },
  {
    "id": "npv",
    "nameEn": "NPV",
    "category": "financial",
    "exampleFormula": "=NPV(0.10, C2:C6) + C1",
    "nameByLocale": {
      "es": "VNA",
      "en": "NPV",
      "de": "NBW",
      "fr": "VAN",
      "ja": "NPV",
      "pt": "VPL"
    },
    "descriptionByLocale": {
      "es": "Calcula el Valor Neto Actual de una inversión a partir de una tasa de descuento y flujos de caja futuros periódicos.",
      "en": "Calculates the net present value of an investment by using a discount rate and future payments.",
      "de": "Berechnet den Nettobarwert einer Investition anhand von Zinssatz und periodischen Zahlungen.",
      "fr": "Calcule la valeur actuelle nette d'un investissement selon un taux d'actualisation.",
      "ja": "割引率と将来のキャッシュフローに基づいて、投資の正味現在価値(NPV)を計算します。",
      "pt": "Calcula o Valor Presente Líquido de um investimento usando uma taxa de desconto e fluxos futuros."
    },
    "syntaxByLocale": {
      "es": "=VNA(tasa, valor1, [valor2], ...)",
      "en": "=NPV(rate, value1, [value2], ...)",
      "de": "=NBW(Zins; Wert1; [Wert2]; ...)",
      "fr": "=VAN(taux; valeur1; [valeur2]; ...)",
      "ja": "=NPV(割引率, 値1, [値2], ...)",
      "pt": "=VPL(taxa; valor1; [valor2]; ...)"
    },
    "exampleContextByLocale": {
      "es": "C1 es la inversión inicial en negativo, y C2:C6 son los ingresos proyectados a 10% de tasa.",
      "en": "C1 is negative initial outlay, and C2:C6 are projected annual cash flows at 10% discount.",
      "de": "C1 ist die negative Anfangsinvestition, C2:C6 sind prognostizierte Cashflows bei 10%.",
      "fr": "C1 est l'investissement initial négatif, C2:C6 les cash flows à 10%.",
      "ja": "C1に初期投資額(負の値)、C2:C6に将来キャッシュフロー(割引率10%)。",
      "pt": "C1 é o investimento inicial em negativo e C2:C6 são os fluxos a 10% de desconto."
    },
    "exampleResultByLocale": {
      "es": "$32,450.00",
      "en": "$32,450.00",
      "de": "32.450,00 €",
      "fr": "32 450,00 €",
      "ja": "¥3,245,000",
      "pt": "R$ 32.450,00"
    },
    "proTipByLocale": {
      "es": "¡ERROR COMÚN! La inversión inicial del año 0 NO se incluye dentro de VNA; se suma afuera (+ C1).",
      "en": "TRAP ALERT! Year 0 initial cash outlay must NOT be inside NPV; add it outside (+ C1).",
      "de": "HÄUFIGER FEHLER! Die Anfangsinvestition im Jahr 0 gehört NICHT in NBW, sondern wird außen addiert.",
      "fr": "ATTENTION ! L'investissement initial en année 0 ne doit PAS être dans la formule VAN mais ajouté en dehors.",
      "ja": "要注意！第0期の初期投資額はNPVの引数に含めず、関数の外で足し合わせます(+ C1)。",
      "pt": "CUIDADO! O investimento inicial do ano 0 NÃO deve entrar dentro do VPL; some por fora (+ C1)."
    },
    "tags": [
      "npv",
      "vna",
      "finanzas",
      "van",
      "evaluacion",
      "inversion"
    ]
  },
  {
    "id": "irr",
    "nameEn": "IRR",
    "category": "financial",
    "exampleFormula": "=IRR(B1:B6)",
    "nameByLocale": {
      "es": "TIR",
      "en": "IRR",
      "de": "IKV",
      "fr": "TRI",
      "ja": "IRR",
      "pt": "TIR"
    },
    "descriptionByLocale": {
      "es": "Calcula la Tasa Interna de Retorno de una serie de flujos de efectivo. La métrica reina para evaluar proyectos de negocio.",
      "en": "Returns the internal rate of return for a series of cash flows.",
      "de": "Berechnet den internen Zinsfuß für eine Reihe periodischer Zahlungen.",
      "fr": "Renvoie le taux de rentabilité interne pour une série de flux financiers.",
      "ja": "一連の定期的なキャッシュフローに対する内部収益率(IRR)を算出します。",
      "pt": "Calcula a Taxa Interna de Retorno para uma série periódica de fluxos de caixa."
    },
    "syntaxByLocale": {
      "es": "=TIR(valores, [estimar])",
      "en": "=IRR(values, [guess])",
      "de": "=IKV(Werte; [Schätzwert])",
      "fr": "=TRI(valeurs; [estimation])",
      "ja": "=IRR(範囲, [推定値])",
      "pt": "=TIR(valores; [estimativa])"
    },
    "exampleContextByLocale": {
      "es": "B1 contiene la inversión inicial (-100,000) y B2:B6 los cobros netos anuales.",
      "en": "B1 contains initial outlay (-100,000) and B2:B6 annual net returns.",
      "de": "B1 enthält Investition (-100.000) und B2:B6 die jährlichen Rückflüsse.",
      "fr": "B1 contient le décaissement initial (-100 000) et B2:B6 les gains annuels.",
      "ja": "B1に初期投資額(-100,000)、B2:B6に毎年のリターン。",
      "pt": "B1 contém o investimento inicial (-100.000) e B2:B6 os retornos anuais."
    },
    "exampleResultByLocale": {
      "es": "18.4%",
      "en": "18.4%",
      "de": "18,4%",
      "fr": "18,4%",
      "ja": "18.4%",
      "pt": "18,4%"
    },
    "proTipByLocale": {
      "es": "El rango debe incluir al menos un número negativo (inversión inicial) y un número positivo (retorno).",
      "en": "The range must include at least one negative value (outflow) and one positive value (inflow).",
      "de": "Der Bereich muss mindestens eine negative Zahl (Aufwand) und eine positive enthalten.",
      "fr": "La plage doit contenir au moins un montant négatif et un montant positif.",
      "ja": "範囲内には最低1つの負の値(初期支出)と、最低1つの正の値(回収)が含まれている必要があります。",
      "pt": "O intervalo deve conter pelo menos um valor negativo (desembolso) e um positivo."
    },
    "tags": [
      "irr",
      "tir",
      "rentabilidad",
      "retorno",
      "inversion",
      "finanzas"
    ]
  },
  {
    "id": "take",
    "nameEn": "TAKE",
    "category": "lookup",
    "exampleFormula": "=TAKE(SORT(A2:B50, 2, -1), 5)",
    "nameByLocale": {
      "es": "TOMAR",
      "en": "TAKE",
      "de": "ÜBERNEHMEN",
      "fr": "PRENDRE",
      "ja": "TAKE",
      "pt": "TOMAR"
    },
    "descriptionByLocale": {
      "es": "Extrae un número específico de filas o columnas contiguas desde el inicio o el final de una matriz.",
      "en": "Returns a specified number of contiguous rows or columns from the start or end of an array.",
      "de": "Gibt eine angegebene Anzahl zusammenhängender Zeilen oder Spalten aus einer Matrix zurück.",
      "fr": "Renvoie un nombre spécifié de lignes ou colonnes contiguës depuis le début ou la fin.",
      "ja": "配列の先頭または末尾から、指定した行数または列数を取り出します。",
      "pt": "Retorna um número especificado de linhas ou colunas contíguas do início ou final de uma matriz."
    },
    "syntaxByLocale": {
      "es": "=TOMAR(matriz, filas, [columnas])",
      "en": "=TAKE(array, rows, [columns])",
      "de": "=ÜBERNEHMEN(Matrix; Zeilen; [Spalten])",
      "fr": "=PRENDRE(tableau; lignes; [colonnes])",
      "ja": "=TAKE(配列, 行数, [列数])",
      "pt": "=TOMAR(matriz; linhas; [colunas])"
    },
    "exampleContextByLocale": {
      "es": "Ordena ventas y toma únicamente los 5 mejores registros para un Top 5 dinámico.",
      "en": "Sorts sales and takes only the top 5 records for an automatic Top 5 table.",
      "de": "Sortiert Verkäufe und übernimmt die 5 besten Datensätze.",
      "fr": "Trie les ventes et extrait les 5 meilleures lignes.",
      "ja": "売上順に並べ替えた後、上位5行だけを抽出してTop5表を作成。",
      "pt": "Classifica vendas e extrai apenas os 5 melhores registros."
    },
    "exampleResultByLocale": {
      "es": "Top 5 filas",
      "en": "Top 5 rows",
      "de": "Top 5 Zeilen",
      "fr": "Top 5 lignes",
      "ja": "上位5行",
      "pt": "Top 5 linhas"
    },
    "proTipByLocale": {
      "es": "Si usas un número negativo como -3 en filas, tomará las últimas 3 filas del final.",
      "en": "Pass negative integers like -3 for rows to grab the bottom 3 rows.",
      "de": "Negative Zahlen wie -3 nehmen die letzten 3 Zeilen vom Ende.",
      "fr": "Un nombre négatif comme -3 extrait les 3 dernières lignes.",
      "ja": "行数に「-3」と負の数を指定すると、末尾から3行を取得できます。",
      "pt": "Se usar números negativos como -3 nas linhas, pegará as últimas 3 linhas do fim."
    },
    "tags": [
      "take",
      "tomar",
      "top",
      "primeras",
      "filas",
      "recortar"
    ]
  },
  {
    "id": "drop",
    "nameEn": "DROP",
    "category": "lookup",
    "exampleFormula": "=DROP(A1:D20, 1)",
    "nameByLocale": {
      "es": "EXCLUIR",
      "en": "DROP",
      "de": "WEGLASSEN",
      "fr": "EXCLURE",
      "ja": "DROP",
      "pt": "EXCLUIR"
    },
    "descriptionByLocale": {
      "es": "Excluye un número determinado de filas o columnas del principio o fin de una matriz.",
      "en": "Excludes a specified number of rows or columns from the start or end of an array.",
      "de": "Schließt eine bestimmte Anzahl von Zeilen oder Spalten am Anfang oder Ende aus.",
      "fr": "Exclut un nombre spécifié de lignes ou colonnes du début ou de la fin.",
      "ja": "配列の先頭または末尾から、指定した行数または列数を除外します。",
      "pt": "Exclui um número especificado de linhas ou colunas do início ou fim de uma matriz."
    },
    "syntaxByLocale": {
      "es": "=EXCLUIR(matriz, filas, [columnas])",
      "en": "=DROP(array, rows, [columns])",
      "de": "=WEGLASSEN(Matrix; Zeilen; [Spalten])",
      "fr": "=EXCLURE(tableau; lignes; [colonnes])",
      "ja": "=DROP(配列, 行数, [列数])",
      "pt": "=EXCLUIR(matriz; linhas; [colunas])"
    },
    "exampleContextByLocale": {
      "es": "Elimina la fila 1 de encabezados y se queda solo con el cuerpo de datos.",
      "en": "Drops row 1 header and returns only pure data rows.",
      "de": "Entfernt Kopfzeile 1 und behält reine Datenzeilen.",
      "fr": "Supprime l'en-tête en ligne 1 pour ne garder que les données.",
      "ja": "1行目の見出し行を取り除き、純粋なデータ行だけを抽出します。",
      "pt": "Descarta a linha de cabeçalho 1 e retorna apenas os dados."
    },
    "exampleResultByLocale": {
      "es": "Datos sin cabecera",
      "en": "Data without headers",
      "de": "Daten ohne Kopf",
      "fr": "Données sans en-tête",
      "ja": "見出し抜きのデータ",
      "pt": "Dados sem cabeçalho"
    },
    "proTipByLocale": {
      "es": "La compañera perfecta de TAKE. Con DROP(matriz, 1) limpias encabezados en matrices dinámicas.",
      "en": "The perfect twin to TAKE. Use DROP(array, 1) to strip table headers on the fly.",
      "de": "Perfekte Ergänzung zu ÜBERNEHMEN, um Tabellenköpfe schnell zu entfernen.",
      "fr": "Le parfait complément de PRENDRE pour nettoyer les en-têtes.",
      "ja": "TAKE関数の相棒。動的配列の見出し除去に絶大な効果を発揮します。",
      "pt": "A companheira perfeita do TOMAR para remover cabeçalhos rapidamente."
    },
    "tags": [
      "drop",
      "excluir",
      "quitar",
      "filas",
      "encabezados"
    ]
  },
  {
    "id": "tocol",
    "nameEn": "TOCOL",
    "category": "lookup",
    "exampleFormula": "=TOCOL(A1:C10, 1)",
    "nameByLocale": {
      "es": "ENCOL",
      "en": "TOCOL",
      "de": "ZUZEILE",
      "fr": "ENCOLONNE",
      "ja": "TOCOL",
      "pt": "PARACOL"
    },
    "descriptionByLocale": {
      "es": "Transforma una matriz o rango de múltiples columnas y filas en una sola columna vertical.",
      "en": "Transforms a 2D array or range into a single vertical column.",
      "de": "Wandelt eine 2D-Matrix in eine einzelne vertikale Spalte um.",
      "fr": "Transforme un tableau 2D en une seule colonne verticale.",
      "ja": "複数行・複数列の2次元配列を1つの縦一列の配列に変換します。",
      "pt": "Transforma uma matriz 2D em uma única coluna vertical."
    },
    "syntaxByLocale": {
      "es": "=ENCOL(matriz, [ignorar], [escanear_por_columna])",
      "en": "=TOCOL(array, [ignore], [scan_by_column])",
      "de": "=ZUSPALTE(Matrix; [ignorieren]; [nach_Spalte])",
      "fr": "=ENCOLONNE(tableau; [ignorer]; [par_colonne])",
      "ja": "=TOCOL(配列, [無視], [列スキャン])",
      "pt": "=PARACOL(matriz; [ignorar]; [escanear_por_coluna])"
    },
    "exampleContextByLocale": {
      "es": "Aplana una cuadrícula de 3 columnas en una sola lista vertical ignorando celdas vacías (1).",
      "en": "Flattens a 3-column grid into a single column list ignoring empty blanks (1).",
      "de": "Wandelt 3 Spalten in eine einzige Spalte um und ignoriert leere Zellen (1).",
      "fr": "Aplatit une grille de 3 colonnes en une seule en ignorant les vides (1).",
      "ja": "3列の表を1列に平坦化し、空欄を自動スキップ(1)します。",
      "pt": "Achata uma grade de 3 colunas em uma única lista ignorando vazias (1)."
    },
    "exampleResultByLocale": {
      "es": "Columna unificada",
      "en": "Single unified column",
      "de": "Vereinte Spalte",
      "fr": "Colonne unifiée",
      "ja": "一本化された列",
      "pt": "Coluna unificada"
    },
    "proTipByLocale": {
      "es": "Configura ignorar en 3 para omitir tanto celdas vacías como errores a la vez.",
      "en": "Set ignore to 3 to simultaneously discard both blanks and formula errors.",
      "de": "Setze ignorieren auf 3, um sowohl Leerzellen als auch Fehler zu überspringen.",
      "fr": "Réglez ignorer sur 3 pour écarter à la fois les vides et les erreurs.",
      "ja": "「無視」引数を3に設定すると、空白とエラーの両方を同時に除外できます。",
      "pt": "Configure ignorar como 3 para omitir vazios e erros de uma vez."
    },
    "tags": [
      "tocol",
      "encol",
      "aplanar",
      "columna",
      "matriz"
    ]
  },
  {
    "id": "abs",
    "nameEn": "ABS",
    "category": "basics",
    "exampleFormula": "=ABS(Real - Presupuesto)",
    "nameByLocale": {
      "es": "ABS",
      "en": "ABS",
      "de": "ABS",
      "fr": "ABS",
      "ja": "ABS",
      "pt": "ABS"
    },
    "descriptionByLocale": {
      "es": "Devuelve el valor absoluto de un número (su valor sin signo positivo ni negativo).",
      "en": "Returns the absolute value of a number (without its sign).",
      "de": "Gibt den absoluten Betrag einer Zahl zurück (ohne Vorzeichen).",
      "fr": "Renvoie la valeur absolue d'un nombre (sans son signe).",
      "ja": "数値の絶対値(符号を除いた大きさ)を返します。",
      "pt": "Retorna o valor absoluto de um número (sem o sinal positivo ou negativo)."
    },
    "syntaxByLocale": {
      "es": "=ABS(número)",
      "en": "=ABS(number)",
      "de": "=ABS(Zahl)",
      "fr": "=ABS(nombre)",
      "ja": "=ABS(数値)",
      "pt": "=ABS(número)"
    },
    "exampleContextByLocale": {
      "es": "Mide la desviación o varianza total entre dos valores sin importar si fue a favor o en contra.",
      "en": "Measures total variance gap between actual and budget regardless of direction.",
      "de": "Misst die absolute Abweichung zwischen Ist- und Budgetwerten.",
      "fr": "Mesure l'écart absolu entre réel et budget.",
      "ja": "実績と予算の乖離幅(プラスマイナスを問わない差分)を測定。",
      "pt": "Mede a variação absoluta entre o realizado e o orçamento."
    },
    "exampleResultByLocale": {
      "es": "150.00",
      "en": "150.00",
      "de": "150,00",
      "fr": "150,00",
      "ja": "150.00",
      "pt": "150,00"
    },
    "proTipByLocale": {
      "es": "Crucial para conciliaciones contables y cálculos de tolerancia donde los signos opuestos no deben cancelarse.",
      "en": "Essential for balance reconciliations where opposite signs must not cancel each other out.",
      "de": "Unverzichtbar bei Kontenabstimmungen, damit sich gegenläufige Beträge nicht aufheben.",
      "fr": "Indispensable pour les rapprochements bancaires.",
      "ja": "正負の相殺を防ぎたい経理の残高照合や許容誤差の計算で大活躍します。",
      "pt": "Essencial em conciliações contábeis para evitar que sinais opostos se anulem."
    },
    "tags": [
      "abs",
      "absoluto",
      "desviacion",
      "distancia",
      "signo"
    ]
  },
  {
    "id": "randbetween",
    "nameEn": "RANDBETWEEN",
    "category": "basics",
    "exampleFormula": "=RANDBETWEEN(100, 999)",
    "nameByLocale": {
      "es": "ALEATORIO.ENTRE",
      "en": "RANDBETWEEN",
      "de": "ZUFALLSBEREICH",
      "fr": "ALEA.ENTRE.BORNES",
      "ja": "RANDBETWEEN",
      "pt": "ALEATÓRIOENTRE"
    },
    "descriptionByLocale": {
      "es": "Devuelve un número entero aleatorio entre los números inferior y superior que especifiques.",
      "en": "Returns a random integer between the numbers you specify.",
      "de": "Gibt eine ganzzahlige Zufallszahl zwischen zwei Grenzen zurück.",
      "fr": "Renvoie un nombre entier aléatoire entre les bornes spécifiées.",
      "ja": "指定した最小値と最大値の間にある整数の乱数を返します。",
      "pt": "Retorna um número inteiro aleatório entre os limites especificados."
    },
    "syntaxByLocale": {
      "es": "=ALEATORIO.ENTRE(inferior, superior)",
      "en": "=RANDBETWEEN(bottom, top)",
      "de": "=ZUFALLSBEREICH(Unten; Oben)",
      "fr": "=ALEA.ENTRE.BORNES(min; max)",
      "ja": "=RANDBETWEEN(最小値, 最大値)",
      "pt": "=ALEATÓRIOENTRE(inferior; superior)"
    },
    "exampleContextByLocale": {
      "es": "Genera códigos PIN o datos ficticios de 3 dígitos para pruebas de software o maquetas.",
      "en": "Generates 3-digit mock test numbers for demos and simulations.",
      "de": "Erzeugt 3-stellige Testdaten für Prototypen und Simulationen.",
      "fr": "Génère des codes PIN ou données de test à 3 chiffres.",
      "ja": "デモや検証用モックデータとして3桁のランダムな数値を生成。",
      "pt": "Gera números fictícios de 3 dígitos para testes ou simulações."
    },
    "exampleResultByLocale": {
      "es": "742",
      "en": "742",
      "de": "742",
      "fr": "742",
      "ja": "742",
      "pt": "742"
    },
    "proTipByLocale": {
      "es": "Al ser volátil cambia con cada recálculo. Para fijar los números generados, copia y pega como valores.",
      "en": "Being volatile, it rerolls on every edit. Copy and paste as values to lock them in place.",
      "de": "Ändert sich bei jeder Eingabe. Kopiere und füge als Werte ein, um Zahlen einzufrieren.",
      "fr": "Fonction volatile qui change à chaque saisie. Figez les valeurs par copier-coller valeurs.",
      "ja": "再計算のたびに値が変わるため、確定させたい時は「値として貼り付け」で固定します。",
      "pt": "Sendo volátil muda a cada alteração. Copie e cole como valores para fixar."
    },
    "tags": [
      "randbetween",
      "aleatorio.entre",
      "azar",
      "simulacion",
      "mock"
    ]
  },
  {
    "id": "and",
    "nameEn": "AND",
    "category": "logic",
    "exampleFormula": "=IF(AND(A2>=18, B2=\"Licencia\"), \"Aprobado\", \"No Apto\")",
    "nameByLocale": {
      "es": "Y",
      "en": "AND",
      "de": "UND",
      "fr": "ET",
      "ja": "AND",
      "pt": "E"
    },
    "descriptionByLocale": {
      "es": "Comprueba si todos los argumentos son VERDADEROS; devuelve VERDADERO solo si todos se cumplen.",
      "en": "Checks if all arguments are TRUE; returns TRUE only if all conditions are met.",
      "de": "Prüft, ob alle Argumente WAHR sind.",
      "fr": "Vérifie si tous les arguments sont VRAIS.",
      "ja": "すべての引数がTRUE(真)であるかどうかを判定します。",
      "pt": "Verifica se todos os argumentos são VERDADEIROS."
    },
    "syntaxByLocale": {
      "es": "=Y(valor_lógico1, [valor_lógico2], ...)",
      "en": "=AND(logical1, [logical2], ...)",
      "de": "=UND(Wahrheitswert1; [Wahrheitswert2]; ...)",
      "fr": "=ET(valeur_logique1; [valeur_logique2]; ...)",
      "ja": "=AND(論理式1, [論理式2], ...)",
      "pt": "=E(lógico1; [lógico2]; ...)"
    },
    "exampleContextByLocale": {
      "es": "Requiere que tenga al menos 18 años Y posea Licencia vigente.",
      "en": "Requires age >= 18 AND active driver license.",
      "de": "Erfordert Alter >= 18 UND gültigen Führerschein.",
      "fr": "Exige un âge >= 18 ET un permis valide.",
      "ja": "年齢18歳以上 かつ 有効な免許を所持していることを判定。",
      "pt": "Exige ter pelo menos 18 anos E possuir habilitação."
    },
    "exampleResultByLocale": {
      "es": "Aprobado",
      "en": "Approved",
      "de": "Genehmigt",
      "fr": "Approuvé",
      "ja": "合格",
      "pt": "Aprovado"
    },
    "proTipByLocale": {
      "es": "Puedes poner hasta 255 condiciones lógicas dentro de un solo Y.",
      "en": "You can include up to 255 logical conditions within a single AND call.",
      "de": "Du kannst bis zu 255 Bedingungen in einem einzigen UND bündeln.",
      "fr": "Vous pouvez tester jusqu'à 255 conditions dans un seul ET.",
      "ja": "1つのAND関数内に最大255個までの論理条件を指定できます。",
      "pt": "Você pode colocar até 255 condições lógicas em um único E."
    },
    "tags": [
      "and",
      "y",
      "conjuncion",
      "logica",
      "si"
    ]
  },
  {
    "id": "or",
    "nameEn": "OR",
    "category": "logic",
    "exampleFormula": "=IF(OR(A2=\"VIP\", B2>5000), \"Descuento\", \"Normal\")",
    "nameByLocale": {
      "es": "O",
      "en": "OR",
      "de": "ODER",
      "fr": "OU",
      "ja": "OR",
      "pt": "OU"
    },
    "descriptionByLocale": {
      "es": "Comprueba si alguno de los argumentos es VERDADERO; devuelve VERDADERO si al menos uno se cumple.",
      "en": "Checks if any arguments are TRUE; returns TRUE if at least one condition is met.",
      "de": "Prüft, ob mindestens ein Argument WAHR ist.",
      "fr": "Vérifie si au moins un des arguments est VRAI.",
      "ja": "いずれかの引数がTRUE(真)であるかどうかを判定します。",
      "pt": "Verifica se algum dos argumentos é VERDADEIRO."
    },
    "syntaxByLocale": {
      "es": "=O(valor_lógico1, [valor_lógico2], ...)",
      "en": "=OR(logical1, [logical2], ...)",
      "de": "=ODER(Wahrheitswert1; [Wahrheitswert2]; ...)",
      "fr": "=OU(valeur_logique1; [valeur_logique2]; ...)",
      "ja": "=OR(論理式1, [論理式2], ...)",
      "pt": "=OU(lógico1; [lógico2]; ...)"
    },
    "exampleContextByLocale": {
      "es": "Otorga descuento si el cliente es VIP O si la compra supera $5,000.",
      "en": "Grants discount if customer is VIP OR order exceeds $5,000.",
      "de": "Gewährt Rabatt, wenn Kunde VIP ODER Einkauf > 5.000 € ist.",
      "fr": "Accorde une remise si client VIP OU commande > 5 000 €.",
      "ja": "顧客ランクがVIP または 購入額が5,000ドル超なら特別割引。",
      "pt": "Concede desconto se for cliente VIP OU compra acima de R$ 5.000."
    },
    "exampleResultByLocale": {
      "es": "Descuento",
      "en": "Discount",
      "de": "Rabatt",
      "fr": "Remise",
      "ja": "割引適用",
      "pt": "Desconto"
    },
    "proTipByLocale": {
      "es": "Para que devuelva FALSO, absolutamente todas las condiciones deben ser falsas.",
      "en": "To return FALSE, every single condition must evaluate to false.",
      "de": "Gibt nur dann FALSCH zurück, wenn ausnahmslos alle Bedingungen falsch sind.",
      "fr": "Ne renvoie FAUX que si toutes les conditions sans exception sont fausses.",
      "ja": "すべての条件がFALSEの場合にのみFALSEを返します。",
      "pt": "Para retornar FALSO, rigorosamente todas as condições devem ser falsas."
    },
    "tags": [
      "or",
      "o",
      "disyuncion",
      "condicion",
      "flexibilidad"
    ]
  },
  {
    "id": "concat",
    "nameEn": "CONCAT",
    "category": "text",
    "exampleFormula": "=CONCAT(A2, \" - \", B2)",
    "nameByLocale": {
      "es": "CONCAT",
      "en": "CONCAT",
      "de": "TEXTKETTE",
      "fr": "CONCAT",
      "ja": "CONCAT",
      "pt": "CONCAT"
    },
    "descriptionByLocale": {
      "es": "Combina el texto de múltiples rangos o cadenas en una sola celda continua.",
      "en": "Combines the text from multiple ranges and strings into a single cell.",
      "de": "Verbindet Text aus mehreren Bereichen und Zeichenfolgen.",
      "fr": "Combine le texte de plusieurs plages en une seule cellule.",
      "ja": "複数のセル範囲や文字列を1つに連結します。",
      "pt": "Combina o texto de vários intervalos e cadeias em uma única célula."
    },
    "syntaxByLocale": {
      "es": "=CONCAT(texto1, [texto2], ...)",
      "en": "=CONCAT(text1, [text2], ...)",
      "de": "=TEXTKETTE(Text1; [Text2]; ...)",
      "fr": "=CONCAT(texte1; [texte2]; ...)",
      "ja": "=CONCAT(テキスト1, [テキスト2], ...)",
      "pt": "=CONCAT(texto1; [texto2]; ...)"
    },
    "exampleContextByLocale": {
      "es": "Une Código de producto y Nombre de producto con un guión.",
      "en": "Joins product code and product name with a dash.",
      "de": "Verbindet Produktcode und Artikelname mit Bindestrich.",
      "fr": "Associe code produit et libellé avec un tiret.",
      "ja": "商品コードと商品名をハイフンで繋いで結合。",
      "pt": "Une código de produto e nome com um traço."
    },
    "exampleResultByLocale": {
      "es": "\"PRD-01 - Teclado\"",
      "en": "\"PRD-01 - Keyboard\"",
      "de": "\"PRD-01 - Tastatur\"",
      "fr": "\"PRD-01 - Clavier\"",
      "ja": "\"PRD-01 - キーボード\"",
      "pt": "\"PRD-01 - Teclado\""
    },
    "proTipByLocale": {
      "es": "Acepta rangos completos como =CONCAT(A1:A5), a diferencia de la vieja CONCATENAR.",
      "en": "Accepts full ranges like =CONCAT(A1:A5), unlike the obsolete CONCATENATE function.",
      "de": "Akzeptiert ganze Bereiche wie =TEXTKETTE(A1:A5).",
      "fr": "Prend en charge des plages entières comme =CONCAT(A1:A5).",
      "ja": "旧CONCATENATEと異なり、=CONCAT(A1:A5)のようにセル範囲を直接指定できます。",
      "pt": "Aceita intervalos completos como =CONCAT(A1:A5), diferente do antigo CONCATENAR."
    },
    "tags": [
      "concat",
      "unir",
      "texto",
      "cadenas"
    ]
  },
  {
    "id": "left_right",
    "nameEn": "LEFT / RIGHT",
    "category": "text",
    "exampleFormula": "=LEFT(\"PROD-8820\", 4)",
    "nameByLocale": {
      "es": "IZQUIERDA / DERECHA",
      "en": "LEFT / RIGHT",
      "de": "LINKS / RECHTS",
      "fr": "GAUCHE / DROITE",
      "ja": "LEFT / RIGHT",
      "pt": "ESQUERDA / DIREITA"
    },
    "descriptionByLocale": {
      "es": "IZQUIERDA devuelve caracteres del principio; DERECHA devuelve caracteres del final de una celda.",
      "en": "LEFT returns first characters; RIGHT returns ending characters of a cell.",
      "de": "LINKS gibt Zeichen vom Anfang zurück; RECHTS gibt Zeichen vom Ende zurück.",
      "fr": "GAUCHE renvoie les premiers caractères; DROITE renvoie les derniers.",
      "ja": "LEFTは先頭(左側)から、RIGHTは末尾(右側)から指定した文字数を返します。",
      "pt": "ESQUERDA retorna os primeiros caracteres; DIREITA retorna os últimos caracteres de um texto."
    },
    "syntaxByLocale": {
      "es": "=IZQUIERDA(texto, [num]) | =DERECHA(texto, [num])",
      "en": "=LEFT(text, [num_chars]) | =RIGHT(text, [num_chars])",
      "de": "=LINKS(Text; [Anzahl]) | =RECHTS(Text; [Anzahl])",
      "fr": "=GAUCHE(texte; [nb]) | =DROITE(texte; [nb])",
      "ja": "=LEFT(文字列, [文字数]) | =RIGHT(文字列, [文字数])",
      "pt": "=ESQUERDA(texto; [núm_caract]) | =DIREITA(texto; [núm_caract])"
    },
    "exampleContextByLocale": {
      "es": "Obtiene las 4 letras del prefijo del producto.",
      "en": "Extracts the 4-letter product prefix.",
      "de": "Liest das 4-stellige Produktpräfix aus.",
      "fr": "Récupère les 4 lettres du préfixe produit.",
      "ja": "商品コードのプレフィックス4文字を抽出。",
      "pt": "Obtém as 4 letras do prefixo do produto."
    },
    "exampleResultByLocale": {
      "es": "\"PROD\"",
      "en": "\"PROD\"",
      "de": "\"PROD\"",
      "fr": "\"PROD\"",
      "ja": "\"PROD\"",
      "pt": "\"PROD\""
    },
    "proTipByLocale": {
      "es": "Si omites el segundo argumento, ambas devuelven exactamente 1 caracter.",
      "en": "If you omit the second argument, both default to returning exactly 1 character.",
      "de": "Lässt man das 2. Argument weg, wird genau 1 Zeichen zurückgegeben.",
      "fr": "Si le second argument est omis, elles renvoient exactement 1 caractère.",
      "ja": "第2引数を省略した場合は、どちらも1文字だけを返します。",
      "pt": "Se omitir o segundo argumento, ambas retornam exatamente 1 caractere."
    },
    "tags": [
      "left",
      "right",
      "izquierda",
      "derecha",
      "texto"
    ]
  },
  {
    "id": "len",
    "nameEn": "LEN",
    "category": "text",
    "exampleFormula": "=LEN(A2)",
    "nameByLocale": {
      "es": "LARGO",
      "en": "LEN",
      "de": "LÄNGE",
      "fr": "NBCAR",
      "ja": "LEN",
      "pt": "NÚM.CARACT"
    },
    "descriptionByLocale": {
      "es": "Devuelve el número total de caracteres de una cadena de texto, incluyendo espacios y signos.",
      "en": "Returns the number of characters in a text string.",
      "de": "Gibt die Anzahl der Zeichen in einer Zeichenfolge zurück.",
      "fr": "Renvoie le nombre de caractères d'une chaîne de texte.",
      "ja": "文字列の文字数(スペースや記号も含む)をカウントして返します。",
      "pt": "Retorna o número de caracteres em uma cadeia de texto, incluindo espaços."
    },
    "syntaxByLocale": {
      "es": "=LARGO(texto)",
      "en": "=LEN(text)",
      "de": "=LÄNGE(Text)",
      "fr": "=NBCAR(texte)",
      "ja": "=LEN(文字列)",
      "pt": "=NÚM.CARACT(texto)"
    },
    "exampleContextByLocale": {
      "es": "Valida que el número de identificación fiscal o teléfono tenga exactamente los dígitos obligatorios.",
      "en": "Validates that a tax ID or phone number matches required digit length.",
      "de": "Prüft, ob eine Steuernummer die erforderliche Stellenanzahl besitzt.",
      "fr": "Valide qu'un numéro fiscal ou IBAN possède la longueur requise.",
      "ja": "マイナンバーや郵便番号の桁数が正しいかをバリデーション検証。",
      "pt": "Valida se um CPF, CNPJ ou telefone tem a quantidade exata de dígitos."
    },
    "exampleResultByLocale": {
      "es": "11",
      "en": "11",
      "de": "11",
      "fr": "11",
      "ja": "11",
      "pt": "11"
    },
    "proTipByLocale": {
      "es": "Para contar cuántas palabras hay en una celda: =LARGO(ESPACIOS(A1)) - LARGO(SUSTITUIR(A1, \" \", \"\")) + 1.",
      "en": "Pro formula to count words in a cell: =LEN(TRIM(A1)) - LEN(SUBSTITUTE(A1, \" \", \"\")) + 1.",
      "de": "Wörter in Zelle zählen: =LÄNGE(GLÄTTEN(A1)) - LÄNGE(WECHSELN(A1; \" \"; \"\")) + 1.",
      "fr": "Compter les mots dans une cellule : =NBCAR(SUPPRESPACE(A1)) - NBCAR(SUBSTITUE(A1; \" \"; \"\")) + 1.",
      "ja": "セル内の単語数を数える至高の技: =LEN(TRIM(A1)) - LEN(SUBSTITUTE(A1, \" \", \"\")) + 1。",
      "pt": "Fórmula ninja para contar palavras: =NÚM.CARACT(ARRUMAR(A1)) - NÚM.CARACT(SUBSTITUIR(A1; \" \"; \"\")) + 1."
    },
    "tags": [
      "len",
      "largo",
      "longitud",
      "caracteres",
      "contar"
    ]
  },
  {
    "id": "now",
    "nameEn": "NOW",
    "category": "date",
    "exampleFormula": "=NOW()",
    "nameByLocale": {
      "es": "AHORA",
      "en": "NOW",
      "de": "JETZT",
      "fr": "MAINTENANT",
      "ja": "NOW",
      "pt": "AGORA"
    },
    "descriptionByLocale": {
      "es": "Devuelve la fecha y hora actuales exactas del sistema operativo.",
      "en": "Returns the current date and time formatted as date and time.",
      "de": "Gibt das aktuelle Datum und die genaue Uhrzeit zurück.",
      "fr": "Renvoie la date et l'heure actuelles du système.",
      "ja": "現在の日付と時刻をシリアル値で返します。",
      "pt": "Retorna a data e hora atuais exatas do sistema."
    },
    "syntaxByLocale": {
      "es": "=AHORA()",
      "en": "=NOW()",
      "de": "=JETZT()",
      "fr": "=MAINTENANT()",
      "ja": "=NOW()",
      "pt": "=AGORA()"
    },
    "exampleContextByLocale": {
      "es": "Calcula horas exactas transcurridas de un ticket de soporte: =(AHORA() - A2) * 24.",
      "en": "Computes exact elapsed hours for a support ticket: =(NOW() - A2) * 24.",
      "de": "Ermittelt vergangene Bearbeitungsstunden eines Tickets: =(JETZT() - A2) * 24.",
      "fr": "Calcule les heures écoulées sur un ticket : =(MAINTENANT() - A2) * 24.",
      "ja": "問い合わせ対応チケットの経過時間数を算出: =(NOW() - A2) * 24。",
      "pt": "Calcula horas exatas decorridas de um chamado: =(AGORA() - A2) * 24."
    },
    "exampleResultByLocale": {
      "es": "03/11/2026 18:15",
      "en": "11/03/2026 6:15 PM",
      "de": "03.11.2026 18:15",
      "fr": "03/11/2026 18:15",
      "ja": "2026/11/03 18:15",
      "pt": "03/11/2026 18:15"
    },
    "proTipByLocale": {
      "es": "En Excel el número 1 representa 1 día entero; por tanto 1 hora equivale a 1/24 y 1 minuto a 1/1440.",
      "en": "Excel treats 1 as 1 full day; thus 1 hour is 1/24 and 1 minute is 1/1440.",
      "de": "In Excel entspricht die Zahl 1 einem Tag, 1 Stunde ist 1/24.",
      "fr": "Pour Excel, 1 équivaut à 24 heures (un jour entier).",
      "ja": "Excelでは「1 = 24時間(1日)」なので、1時間は1/24、1分は1/1440として計算します。",
      "pt": "No Excel o número 1 é 1 dia inteiro; 1 hora é 1/24 e 1 minuto é 1/1440."
    },
    "tags": [
      "now",
      "ahora",
      "hora",
      "minutos",
      "timestamp",
      "dinamica"
    ]
  },
  {
    "id": "networkdays",
    "nameEn": "NETWORKDAYS",
    "category": "date",
    "exampleFormula": "=NETWORKDAYS(A2, B2, F1:F10)",
    "nameByLocale": {
      "es": "DIAS.LAB",
      "en": "NETWORKDAYS",
      "de": "NETTOARBEITSTAGE",
      "fr": "NB.JOURS.OUVRES",
      "ja": "NETWORKDAYS",
      "pt": "DIATRABALHOTOTAL"
    },
    "descriptionByLocale": {
      "es": "Devuelve el número de días laborables netos entre dos fechas, excluyendo fines de semana y festivos.",
      "en": "Returns the number of whole working days between two dates, omitting weekends and holidays.",
      "de": "Berechnet die Nettoarbeitstage zwischen zwei Daten ohne Wochenenden und Feiertage.",
      "fr": "Renvoie le nombre de jours ouvrés entre deux dates (hors week-ends et jours fériés).",
      "ja": "土日や指定した祝日を除外して、2つの日付の間にある実質稼働日数を計算します。",
      "pt": "Retorna o número de dias úteis entre duas datas, excluindo fins de semana e feriados."
    },
    "syntaxByLocale": {
      "es": "=DIAS.LAB(fecha_inicial, fecha_final, [festivos])",
      "en": "=NETWORKDAYS(start_date, end_date, [holidays])",
      "de": "=NETTOARBEITSTAGE(Ausgangsdatum; Enddatum; [Freie_Tage])",
      "fr": "=NB.JOURS.OUVRES(date_début; date_fin; [jours_fériés])",
      "ja": "=NETWORKDAYS(開始日, 終了日, [祭日])",
      "pt": "=DIATRABALHOTOTAL(data_inicial; data_final; [feriados])"
    },
    "exampleContextByLocale": {
      "es": "A2 es inicio de proyecto, B2 entrega, y F1:F10 lista de días feriados.",
      "en": "A2 is start date, B2 is deadline, F1:F10 lists company holidays.",
      "de": "A2 ist Startdatum, B2 Abgabe und F1:F10 enthält Feiertage.",
      "fr": "A2 est le début, B2 l'échéance et F1:F10 la liste des jours fériés.",
      "ja": "A2が着工日、B2が納期、F1:F10が会社所定の休業祝日リスト。",
      "pt": "A2 é o início, B2 o prazo final e F1:F10 a lista de feriados."
    },
    "exampleResultByLocale": {
      "es": "22 días hábiles",
      "en": "22 working days",
      "de": "22 Arbeitstage",
      "fr": "22 jours ouvrés",
      "ja": "22 営業日",
      "pt": "22 dias úteis"
    },
    "proTipByLocale": {
      "es": "Si tu empresa trabaja con descansos no estándar (ej: solo descansan domingos), usa DIAS.LAB.INTL.",
      "en": "If you have non-standard weekend days (e.g. only Sunday off), use NETWORKDAYS.INTL instead.",
      "de": "Bei abweichenden Wochenenden nutze NETTOARBEITSTAGE.INTL.",
      "fr": "Pour des week-ends personnalisés, utilisez NB.JOURS.OUVRES.INTL.",
      "ja": "土日以外の曜日が休日の場合は NETWORKDAYS.INTL 関数を使用します。",
      "pt": "Para fins de semana não convencionais, use DIATRABALHOTOTAL.INTL."
    },
    "tags": [
      "networkdays",
      "dias.lab",
      "laborables",
      "habiles",
      "fechas"
    ]
  },
  {
    "id": "fv",
    "nameEn": "FV",
    "category": "financial",
    "exampleFormula": "=FV(0.07/12, 120, -300)",
    "nameByLocale": {
      "es": "VF",
      "en": "FV",
      "de": "ZW",
      "fr": "VC",
      "ja": "FV",
      "pt": "VF"
    },
    "descriptionByLocale": {
      "es": "Calcula el valor futuro de una inversión basado en pagos periódicos constantes y una tasa de interés fija.",
      "en": "Returns the future value of an investment based on periodic constant payments and rate.",
      "de": "Berechnet den zukünftigen Wert einer Investition.",
      "fr": "Calcule la valeur capitalisée d'un investissement.",
      "ja": "積立預金や投資の将来価値(満期時の受取総額)を計算します。",
      "pt": "Calcula o valor futuro de um investimento com base em depósitos periódicos e taxa constante."
    },
    "syntaxByLocale": {
      "es": "=VF(tasa, nper, pago, [va], [tipo])",
      "en": "=FV(rate, nper, pmt, [pv], [type])",
      "de": "=ZW(Zins; Zzr; Rmz; [Bw]; [F])",
      "fr": "=VC(taux; npm; vpm; [va]; [type])",
      "ja": "=FV(利率, 期間, 定期支払額, [現在価値], [支払期日])",
      "pt": "=VF(taxa; nper; pgto; [vp]; [tipo])"
    },
    "exampleContextByLocale": {
      "es": "Ahorrando $300 al mes durante 10 años (120 meses) con rendimiento anual del 7%.",
      "en": "Investing $300 monthly for 10 years (120 months) at 7% annual interest compound.",
      "de": "Monatlich 300 € sparen über 10 Jahre bei 7% Jahresrendite.",
      "fr": "Épargner 300 € par mois pendant 10 ans à 7% annuel.",
      "ja": "毎月300ドルを10年間(120ヶ月)、年利7%で積み立てた場合の将来資産額。",
      "pt": "Poupando R$ 300 por mês durante 10 anos a 7% ao ano."
    },
    "exampleResultByLocale": {
      "es": "$52,228.32",
      "en": "$52,228.32",
      "de": "52.228,32 €",
      "fr": "52 228,32 €",
      "ja": "¥5,222,832",
      "pt": "R$ 52.228,32"
    },
    "proTipByLocale": {
      "es": "¡El poder del interés compuesto en una sola fórmula! Pon el depósito mensual en negativo (-300).",
      "en": "The magic of compound interest! Enter monthly deposit as negative (-300) to get positive FV.",
      "de": "Die Magie des Zinseszinses in einer Formel! Monatsrate negativ eingeben.",
      "fr": "La magie des intérêts composés ! Saisissez le versement en négatif (-300).",
      "ja": "複利の力を実感できる黄金関数！毎月の積立額にマイナスをつけて入力します。",
      "pt": "A mágica dos juros compostos em uma fórmula! Coloque o aporte mensal em negativo."
    },
    "tags": [
      "fv",
      "vf",
      "ahorro",
      "interes_compuesto",
      "futuro",
      "finanzas"
    ]
  },
  {
    "id": "sortby",
    "nameEn": "SORTBY",
    "category": "lookup",
    "exampleFormula": "=SORTBY(A2:B20, B2:B20, -1)",
    "nameByLocale": {
      "es": "ORDENARPOR",
      "en": "SORTBY",
      "de": "SORTIERENNACH",
      "fr": "TRIERPAR",
      "ja": "SORTBY",
      "pt": "ORDENARPOR"
    },
    "descriptionByLocale": {
      "es": "Ordena el contenido de un rango o matriz basándose en los valores de otro rango o columna correspondiente.",
      "en": "Sorts the contents of a range or array based on the values in a corresponding range or column.",
      "de": "Sortiert den Inhalt eines Bereichs oder Arrays basierend auf den Werten in einem entsprechenden Bereich.",
      "fr": "Trie le contenu d'une plage ou matrice en fonction des valeurs d'une autre plage ou colonne.",
      "ja": "対応する範囲または列の値に基づいて、範囲または配列の内容を並べ替えます。",
      "pt": "Ordena o conteúdo de um intervalo ou matriz com base nos valores de outro intervalo correspondente."
    },
    "syntaxByLocale": {
      "es": "=ORDENARPOR(matriz, por_matriz1, [orden1], ...)",
      "en": "=SORTBY(array, by_array1, [sort_order1], ...)",
      "de": "=SORTIERENNACH(Matrix; Nach_Matrix1; [Reihenfolge1]; ...)",
      "fr": "=TRIERPAR(tableau; par_tableau1; [ordre1]; ...)",
      "ja": "=SORTBY(配列, 基準配列1, [順序1], ...)",
      "pt": "=ORDENARPOR(matriz; por_matriz1; [ordem1]; ...)"
    },
    "exampleContextByLocale": {
      "es": "Ordena la lista de empleados (A2:B20) de mayor a menor según sus ventas en B2:B20.",
      "en": "Sorts employee list (A2:B20) from highest to lowest based on sales in B2:B20.",
      "de": "Sortiert Mitarbeiterliste (A2:B20) absteigend nach Umsätzen in B2:B20.",
      "fr": "Trie la liste des employés (A2:B20) du plus élevé au plus bas selon les ventes en B2:B20.",
      "ja": "B2:B20の売上に基づいて、従業員リスト(A2:B20)を降順で並べ替えます。",
      "pt": "Ordena a lista de funcionários (A2:B20) do maior para o menor com base nas vendas em B2:B20."
    },
    "exampleResultByLocale": {
      "es": "Tabla ordenada desc.",
      "en": "Desc. sorted table",
      "de": "Absteigend sortierte Tabelle",
      "fr": "Tableau trié décroissant",
      "ja": "降順ソート結果",
      "pt": "Tabela ordenada desc."
    },
    "proTipByLocale": {
      "es": "A diferencia de ORDENAR, no necesitas que la columna de ordenación esté dentro de la matriz devuelta.",
      "en": "Unlike SORT, the sorting column does not have to be inside the returned range.",
      "de": "Im Gegensatz zu SORTIEREN muss die Sortierspalte nicht im Rückgabebereich liegen.",
      "fr": "Contrairement à TRIER, la colonne de tri n'a pas besoin d'être dans la plage renvoyée.",
      "ja": "SORTと違い、並べ替え基準の列が返される配列内に含まれている必要はありません。",
      "pt": "Ao contrário de ORDENAR, a coluna de ordenação não precisa estar dentro do intervalo retornado."
    },
    "tags": [
      "sortby",
      "ordenarpor",
      "dinamico",
      "array",
      "ranking"
    ]
  },
  {
    "id": "choosecols",
    "nameEn": "CHOOSECOLS",
    "category": "lookup",
    "exampleFormula": "=CHOOSECOLS(A2:Z100, 1, 3, 5)",
    "nameByLocale": {
      "es": "ELEGIRCOLUMNAS",
      "en": "CHOOSECOLS",
      "de": "SPALTENWAEHLEN",
      "fr": "CHOISIRCOLS",
      "ja": "CHOOSECOLS",
      "pt": "ESCOLHERCOLS"
    },
    "descriptionByLocale": {
      "es": "Extrae y reorganiza columnas específicas de una matriz o tabla según sus números de posición.",
      "en": "Extracts and rearranges specific columns from an array or table using their positional indices.",
      "de": "Extrahiert und ordnet bestimmte Spalten aus einer Matrix anhand ihrer Positionsnummern neu an.",
      "fr": "Extrait et réorganise des colonnes spécifiques d'une matrice selon leurs numéros de position.",
      "ja": "位置インデックスを指定して、配列またはテーブルから特定の列を抽出・再配置します。",
      "pt": "Extrai e reorganiza colunas específicas de uma matriz ou tabela usando seus números de posição."
    },
    "syntaxByLocale": {
      "es": "=ELEGIRCOLUMNAS(matriz, num_col1, [num_col2], ...)",
      "en": "=CHOOSECOLS(array, col_num1, [col_num2], ...)",
      "de": "=SPALTENWAEHLEN(Matrix; Spaltenindex1; [Spaltenindex2]; ...)",
      "fr": "=CHOISIRCOLS(tableau; no_col1; [no_col2]; ...)",
      "ja": "=CHOOSECOLS(配列, 列番号1, [列番号2], ...)",
      "pt": "=ESCOLHERCOLS(matriz; núm_col1; [núm_col2]; ...)"
    },
    "exampleContextByLocale": {
      "es": "De una base de datos de 26 columnas (A:Z), extrae únicamente las columnas 1 (ID), 3 (Nombre) y 5 (Total).",
      "en": "From a 26-column database (A:Z), extracts only columns 1 (ID), 3 (Name), and 5 (Total).",
      "de": "Aus einer 26-Spalten-Tabelle (A:Z) nur Spalte 1 (ID), 3 (Name) und 5 (Gesamt) extrahieren.",
      "fr": "D'une base de 26 colonnes (A:Z), extrait uniquement les colonnes 1 (ID), 3 (Nom) et 5 (Total).",
      "ja": "26列あるデータベース(A:Z)から、列1(ID)、列3(氏名)、列5(合計)だけを抽出します。",
      "pt": "De uma tabela de 26 colunas (A:Z), extrai apenas as colunas 1 (ID), 3 (Nome) e 5 (Total)."
    },
    "exampleResultByLocale": {
      "es": "Tabla 3 columnas",
      "en": "3-column table",
      "de": "3-Spalten-Tabelle",
      "fr": "Tableau 3 colonnes",
      "ja": "3列のテーブル",
      "pt": "Tabela 3 colunas"
    },
    "proTipByLocale": {
      "es": "¡Puedes usar números negativos! -1 devuelve la última columna, -2 la penúltima.",
      "en": "You can use negative indices! -1 returns the last column, -2 the second to last.",
      "de": "Du kannst negative Zahlen verwenden! -1 liefert die letzte Spalte, -2 die vorletzte.",
      "fr": "Vous pouvez utiliser des indices négatifs ! -1 renvoie la dernière colonne, -2 l'avant-dernière.",
      "ja": "負のインデックスも使用可能！-1で末尾の列、-2で最後から2番目の列を取得できます。",
      "pt": "Você pode usar números negativos! -1 retorna a última coluna, -2 a penúltima."
    },
    "tags": [
      "choosecols",
      "elegircolumnas",
      "extraer",
      "columnas",
      "moderno"
    ]
  },
  {
    "id": "chooserows",
    "nameEn": "CHOOSEROWS",
    "category": "lookup",
    "exampleFormula": "=CHOOSEROWS(A2:D50, 1, 5, 10)",
    "nameByLocale": {
      "es": "ELEGIRFILAS",
      "en": "CHOOSEROWS",
      "de": "ZEILENWAEHLEN",
      "fr": "CHOISIRLIGNES",
      "ja": "CHOOSEROWS",
      "pt": "ESCOLHERLINHAS"
    },
    "descriptionByLocale": {
      "es": "Devuelve las filas especificadas de una matriz según sus números de fila.",
      "en": "Returns specified rows from an array based on their row index numbers.",
      "de": "Gibt die angegebenen Zeilen aus einer Matrix anhand ihrer Zeilenindizes zurück.",
      "fr": "Renvoie les lignes spécifiées d'une matrice selon leurs numéros de ligne.",
      "ja": "指定した行番号に基づいて、配列から特定の行を返します。",
      "pt": "Retorna as linhas especificadas de uma matriz com base em seus números de linha."
    },
    "syntaxByLocale": {
      "es": "=ELEGIRFILAS(matriz, num_fila1, [num_fila2], ...)",
      "en": "=CHOOSEROWS(array, row_num1, [row_num2], ...)",
      "de": "=ZEILENWAEHLEN(Matrix; Zeilenindex1; [Zeilenindex2]; ...)",
      "fr": "=CHOISIRLIGNES(tableau; no_ligne1; [no_ligne2]; ...)",
      "ja": "=CHOOSEROWS(配列, 行番号1, [行番号2], ...)",
      "pt": "=ESCOLHERLINHAS(matriz; núm_linha1; [núm_linha2]; ...)"
    },
    "exampleContextByLocale": {
      "es": "Extrae las filas 1, 5 y 10 de la tabla de datos.",
      "en": "Extracts rows 1, 5, and 10 from the data table.",
      "de": "Extrahiert die Zeilen 1, 5 und 10 aus der Datentabelle.",
      "fr": "Extrait les lignes 1, 5 et 10 du tableau de données.",
      "ja": "データテーブルから1行目、5行目、10行目を抽出します。",
      "pt": "Extrai as linhas 1, 5 e 10 da tabela de dados."
    },
    "exampleResultByLocale": {
      "es": "3 filas filtradas",
      "en": "3 filtered rows",
      "de": "3 Zeilen gefiltert",
      "fr": "3 lignes filtrées",
      "ja": "抽出された3行",
      "pt": "3 linhas filtradas"
    },
    "proTipByLocale": {
      "es": "Combínalo con ORDENAR o FILTRAR para extraer los Top 3 o Bottom 3 registros instantáneamente.",
      "en": "Combine with SORT or FILTER to extract Top 3 or Bottom 3 rows instantly.",
      "de": "Kombiniere es mit SORTIEREN, um sofort die Top 3 oder Bottom 3 Zeilen zu extrahieren.",
      "fr": "Combinez avec TRIER pour extraire instantanément le Top 3 ou Bottom 3.",
      "ja": "SORTやFILTERと組み合わせることで、上位3件や下位3件の行を瞬時に抽出できます。",
      "pt": "Combine com ORDENAR para extrair o Top 3 ou Bottom 3 instantaneamente."
    },
    "tags": [
      "chooserows",
      "elegirfilas",
      "filas",
      "extraer",
      "matriz"
    ]
  },
  {
    "id": "row",
    "nameEn": "ROW",
    "category": "lookup",
    "exampleFormula": "=ROW(C5)",
    "nameByLocale": {
      "es": "FILA",
      "en": "ROW",
      "de": "ZEILE",
      "fr": "LIGNE",
      "ja": "ROW",
      "pt": "LINHA"
    },
    "descriptionByLocale": {
      "es": "Devuelve el número de fila de una referencia de celda dada. Si se omite, devuelve la fila de la celda actual.",
      "en": "Returns the row number of a given cell reference. If omitted, returns the current cell row.",
      "de": "Gibt die Zeilennummer eines angegebenen Zellbezugs zurück. Ohne Argument: aktuelle Zeile.",
      "fr": "Renvoie le numéro de ligne d'une référence de cellule. Si omis, renvoie la ligne actuelle.",
      "ja": "指定したセル参照の行番号を返します。省略した場合は現在のセルの行番号を返します。",
      "pt": "Retorna o número da linha de uma referência de célula. Se omitido, retorna a linha atual."
    },
    "syntaxByLocale": {
      "es": "=FILA([referencia])",
      "en": "=ROW([reference])",
      "de": "=ZEILE([Bezug])",
      "fr": "=LIGNE([référence])",
      "ja": "=ROW([参照])",
      "pt": "=LINHA([referência])"
    },
    "exampleContextByLocale": {
      "es": "Consulta el número de fila física de la celda C5.",
      "en": "Checks the physical row number of cell C5.",
      "de": "Ermittelt die Zeilennummer der Zelle C5.",
      "fr": "Vérifie le numéro de ligne de la cellule C5.",
      "ja": "セルC5の行番号を取得します。",
      "pt": "Verifica o número da linha da célula C5."
    },
    "exampleResultByLocale": {
      "es": "5",
      "en": "5",
      "de": "5",
      "fr": "5",
      "ja": "5",
      "pt": "5"
    },
    "proTipByLocale": {
      "es": "=FILA()-FILA($A$2)+1 se usa comúnmente para generar numeración automática secuencial (1, 2, 3...) inmune a borrados.",
      "en": "=ROW()-ROW($A$2)+1 is widely used to create robust sequential numbering (1, 2, 3...).",
      "de": "=ZEILE()-ZEILE($A$2)+1 wird oft für robuste automatische Nummerierung verwendet.",
      "fr": "=LIGNE()-LIGNE($A$2)+1 sert à créer une numérotation séquentielle automatique robuste.",
      "ja": "=ROW()-ROW($A$2)+1を使うと、行削除に影響されない連番を作成できます。",
      "pt": "=LINHA()-LINHA($A$2)+1 é ideal para criar numeração sequencial automática (1, 2, 3...)."
    },
    "tags": [
      "row",
      "fila",
      "indice",
      "posicion",
      "secuencia"
    ]
  },
  {
    "id": "column",
    "nameEn": "COLUMN",
    "category": "lookup",
    "exampleFormula": "=COLUMN(D1)",
    "nameByLocale": {
      "es": "COLUMNA",
      "en": "COLUMN",
      "de": "SPALTE",
      "fr": "COLONNE",
      "ja": "COLUMN",
      "pt": "COLUNA"
    },
    "descriptionByLocale": {
      "es": "Devuelve el número de columna de una referencia de celda dada (A=1, B=2, C=3, etc.).",
      "en": "Returns the column number of a given cell reference (A=1, B=2, C=3, etc.).",
      "de": "Gibt die Spaltennummer eines Zellbezugs zurück (A=1, B=2, C=3 usw.).",
      "fr": "Renvoie le numéro de colonne d'une référence de cellule (A=1, B=2, C=3, etc.).",
      "ja": "指定したセル参照の列番号を返します (A=1, B=2, C=3など)。",
      "pt": "Retorna o número da coluna de uma referência de célula (A=1, B=2, C=3, etc.)."
    },
    "syntaxByLocale": {
      "es": "=COLUMNA([referencia])",
      "en": "=COLUMN([reference])",
      "de": "=SPALTE([Bezug])",
      "fr": "=COLONNE([référence])",
      "ja": "=COLUMN([参照])",
      "pt": "=COLUNA([referência])"
    },
    "exampleContextByLocale": {
      "es": "Determina la posición numérica de la columna D.",
      "en": "Determines the numerical index of column D.",
      "de": "Ermittelt die Spaltennummer der Spalte D.",
      "fr": "Détermine l'index numérique de la colonne D.",
      "ja": "D列の列番号を取得します。",
      "pt": "Determina a posição numérica da coluna D."
    },
    "exampleResultByLocale": {
      "es": "4",
      "en": "4",
      "de": "4",
      "fr": "4",
      "ja": "4",
      "pt": "4"
    },
    "proTipByLocale": {
      "es": "Ideal dentro de BUSCARV para evitar escribir índices de columna manuales que se rompen al arrastrar a la derecha.",
      "en": "Useful inside VLOOKUP to dynamically compute column indices when dragging across columns.",
      "de": "Ideal in SVERWEIS, um Spaltenindizes beim Nach-rechts-Kopieren dynamisch zu berechnen.",
      "fr": "Idéal dans RECHERCHEV pour calculer dynamiquement le numéro de colonne en étirant vers la droite.",
      "ja": "VLOOKUP内で右方向にコピーする際、列番号を自動連番にするのに役立ちます。",
      "pt": "Excelente no PROCV para calcular o índice de colunas dinamicamente ao arrastar para o lado."
    },
    "tags": [
      "column",
      "columna",
      "letra",
      "indice",
      "posicion"
    ]
  },
  {
    "id": "torow",
    "nameEn": "TOROW",
    "category": "lookup",
    "exampleFormula": "=TOROW(A1:C3, 1)",
    "nameByLocale": {
      "es": "ENFILA",
      "en": "TOROW",
      "de": "INZEILE",
      "fr": "ENLIGNE",
      "ja": "TOROW",
      "pt": "PARALINHA"
    },
    "descriptionByLocale": {
      "es": "Transforma una matriz o cuadrícula bidimensional en una sola fila horizontal plana.",
      "en": "Transforms a two-dimensional grid or array into a single horizontal row.",
      "de": "Wandelt eine zweidimensionale Tabelle oder Matrix in eine einzelne horizontale Zeile um.",
      "fr": "Transforme une grille bidimensionnelle en une seule ligne horizontale.",
      "ja": "2次元の表や配列を、単一の水平な1行にフラット化します。",
      "pt": "Transforma uma matriz ou grade bidimensional em uma única linha horizontal."
    },
    "syntaxByLocale": {
      "es": "=ENFILA(matriz, [ignorar], [escanear_por_columna])",
      "en": "=TOROW(array, [ignore], [scan_by_column])",
      "de": "=INZEILE(Matrix; [Ignorieren]; [Nach_Spalte_scannen])",
      "fr": "=ENLIGNE(tableau; [ignorer]; [analyser_par_colonne])",
      "ja": "=TOROW(配列, [無視], [列スキャン])",
      "pt": "=PARALINHA(matriz; [ignorar]; [digitalizar_por_coluna])"
    },
    "exampleContextByLocale": {
      "es": "Aplana la cuadrícula 3x3 de A1:C3 ignorando celdas vacías (opción 1).",
      "en": "Flattens the 3x3 grid in A1:C3 while ignoring blank cells (option 1).",
      "de": "Wandelt 3x3-Matrix A1:C3 in eine Zeile um und ignoriert Leerzellen (Option 1).",
      "fr": "Aplatit la grille 3x3 en A1:C3 en ignorant les cellules vides (option 1).",
      "ja": "A1:C3の3x3グリッドを空白を無視して(オプション1)1行に変換します。",
      "pt": "Achata a grade 3x3 em A1:C3 ignorando células vazias (opção 1)."
    },
    "exampleResultByLocale": {
      "es": "Fila continua",
      "en": "Continuous row",
      "de": "Horizontale Zeile",
      "fr": "Ligne continue",
      "ja": "1行の連続データ",
      "pt": "Linha contínua"
    },
    "proTipByLocale": {
      "es": "El segundo parámetro permite ignorar celdas vacías (1), errores (2) o ambos (3).",
      "en": "The second argument allows ignoring blanks (1), errors (2), or both (3).",
      "de": "Das 2. Argument ignoriert Leerzellen (1), Fehler (2) oder beides (3).",
      "fr": "Le 2e argument permet d'ignorer les vides (1), les erreurs (2) ou les deux (3).",
      "ja": "第2引数で空白(1)、エラー(2)、または両方(3)をスキップできます。",
      "pt": "O 2º argumento permite ignorar células vazias (1), erros (2) ou ambos (3)."
    },
    "tags": [
      "torow",
      "enfila",
      "aplanar",
      "matriz",
      "horizontal"
    ]
  },
  {
    "id": "wraprows",
    "nameEn": "WRAPROWS",
    "category": "lookup",
    "exampleFormula": "=WRAPROWS(A1:A12, 3, \"-\")",
    "nameByLocale": {
      "es": "AJUSTARFILAS",
      "en": "WRAPROWS",
      "de": "ZEILENUMBRUCH",
      "fr": "LIGNES.GROUPER",
      "ja": "WRAPROWS",
      "pt": "QUEBRARLINHAS"
    },
    "descriptionByLocale": {
      "es": "Envuelve una lista vertical o fila en una matriz 2D con un número fijo de valores por fila.",
      "en": "Wraps a 1D vector of values into a 2D grid with a fixed count of items per row.",
      "de": "Bricht einen 1D-Vektor in eine zweidimensionale Matrix mit festgelegter Anzahl pro Zeile um.",
      "fr": "Enveloppe un vecteur 1D en une grille 2D avec un nombre fixe d'éléments par ligne.",
      "ja": "1次元のリストを指定した列数ごとに折り返して2次元の表に変換します。",
      "pt": "Converte uma lista 1D em uma grade 2D com um número fixo de itens por linha."
    },
    "syntaxByLocale": {
      "es": "=AJUSTARFILAS(vector, cuenta_ajuste, [con_relleno])",
      "en": "=WRAPROWS(vector, wrap_count, [pad_with])",
      "de": "=ZEILENUMBRUCH(Vektor; Umbruch_Anzahl; [Auffüllwert])",
      "fr": "=LIGNES.GROUPER(vecteur; nombre_colonnes; [valeur_remplacement])",
      "ja": "=WRAPROWS(ベクトル, 折り返し数, [パディング])",
      "pt": "=QUEBRARLINHAS(vetor; contagem_quebra; [preencher_com])"
    },
    "exampleContextByLocale": {
      "es": "Convierte 12 elementos en una cuadrícula de 4 filas x 3 columnas.",
      "en": "Converts 12 elements into a 4-row x 3-column grid.",
      "de": "Wandelt 12 Elemente in eine Matrix aus 4 Zeilen und 3 Spalten um.",
      "fr": "Convertit 12 éléments en une grille de 4 lignes x 3 colonnes.",
      "ja": "12個のデータを1行あたり3列の4行3列表に再構成します。",
      "pt": "Converte 12 elementos em uma grade de 4 linhas x 3 colunas."
    },
    "exampleResultByLocale": {
      "es": "Matriz 4x3",
      "en": "4x3 Matrix",
      "de": "4x3 Matrix",
      "fr": "Matrice 4x3",
      "ja": "4x3の表",
      "pt": "Matriz 4x3"
    },
    "proTipByLocale": {
      "es": "El tercer parámetro define con qué rellenar si los datos no completan el último renglón exactamente.",
      "en": "The third argument specifies what to fill in if values do not evenly fill the final row.",
      "de": "Das 3. Argument füllt unvollständige letzte Zeilen mit einem Standardwert auf.",
      "fr": "Le 3e argument définit la valeur de remplissage si la dernière ligne est incomplète.",
      "ja": "第3引数で、データ数が不足して最後の行が埋まらない時の代替値を指定できます。",
      "pt": "O 3º argumento define o preenchimento caso os itens não completem a última linha."
    },
    "tags": [
      "wraprows",
      "ajustarfilas",
      "grid",
      "cuadricula",
      "formato"
    ]
  },
  {
    "id": "expand",
    "nameEn": "EXPAND",
    "category": "lookup",
    "exampleFormula": "=EXPAND(A1:B3, 5, 4, 0)",
    "nameByLocale": {
      "es": "EXPANDIR",
      "en": "EXPAND",
      "de": "ERWEITERN",
      "fr": "ETENDRE",
      "ja": "EXPAND",
      "pt": "EXPANDIR"
    },
    "descriptionByLocale": {
      "es": "Expande o rellena una matriz hasta las dimensiones de filas y columnas especificadas.",
      "en": "Expands or pads an array to specified row and column dimensions with custom padding values.",
      "de": "Erweitert eine Matrix auf die angegebenen Zeilen- und Spaltendimensionen mit Füllwert.",
      "fr": "Étend une matrice aux dimensions de lignes et colonnes indiquées avec valeur de remplissage.",
      "ja": "指定された行数と列数のサイズになるまで、配列を拡張・パディングします。",
      "pt": "Expande uma matriz para as dimensões de linhas e colunas especificadas."
    },
    "syntaxByLocale": {
      "es": "=EXPANDIR(matriz, filas, [columnas], [con_relleno])",
      "en": "=EXPAND(array, rows, [columns], [pad_with])",
      "de": "=ERWEITERN(Matrix; Zeilen; [Spalten]; [Auffüllwert])",
      "fr": "=ETENDRE(tableau; lignes; [colonnes]; [valeur_remplissage])",
      "ja": "=EXPAND(配列, 行数, [列数], [パディング])",
      "pt": "=EXPANDIR(matriz; linhas; [colunas]; [preencher_com])"
    },
    "exampleContextByLocale": {
      "es": "Agranda una tabla de 3x2 para que mida 5 filas y 4 columnas, rellenando con ceros.",
      "en": "Enlarges a 3x2 table to 5 rows and 4 columns, filling missing cells with zero.",
      "de": "Erweitert eine 3x2 Tabelle auf 5 Zeilen und 4 Spalten mit Nullen.",
      "fr": "Agrandit un tableau 3x2 à 5 lignes et 4 colonnes, rempli de zéros.",
      "ja": "3x2の表を5行4列に拡張し、追加された空きセルを0で埋めます。",
      "pt": "Amplia uma tabela de 3x2 para 5 linhas e 4 colunas, preenchendo com zeros."
    },
    "exampleResultByLocale": {
      "es": "Matriz 5x4",
      "en": "5x4 Matrix",
      "de": "5x4 Matrix",
      "fr": "Matrice 5x4",
      "ja": "5x4の表",
      "pt": "Matriz 5x4"
    },
    "proTipByLocale": {
      "es": "Vital al apilar tablas con VSTACK cuando tienen diferentes números de columnas.",
      "en": "Essential before stacking tables with VSTACK when they have mismatched column counts.",
      "de": "Unverzichtbar vor VSTAPELN, wenn Quelltabellen unterschiedliche Spaltenbreiten haben.",
      "fr": "Essentiel avant d'empiler avec VSTACK quand les tableaux ont des largeurs inégales.",
      "ja": "列数が異なる複数の表をVSTACKで縦に連結する際の下準備として非常に有効です。",
      "pt": "Indispensável ao empilhar tabelas com VSTACK com números de colunas desiguais."
    },
    "tags": [
      "expand",
      "expandir",
      "dimension",
      "pad",
      "matriz"
    ]
  },
  {
    "id": "int",
    "nameEn": "INT",
    "category": "basics",
    "exampleFormula": "=INT(45.85)",
    "nameByLocale": {
      "es": "ENTERO",
      "en": "INT",
      "de": "GANZZAHL",
      "fr": "ENT",
      "ja": "INT",
      "pt": "INT"
    },
    "descriptionByLocale": {
      "es": "Redondea un número hacia abajo hasta el número entero más próximo.",
      "en": "Rounds a number down to the nearest integer.",
      "de": "Rundet eine Zahl auf die nächste Ganzzahl ab.",
      "fr": "Arrondit un nombre vers le bas au nombre entier le plus proche.",
      "ja": "指定した数値を最も近い整数に切り捨てます。",
      "pt": "Arredonda um número para baixo até o número inteiro mais próximo."
    },
    "syntaxByLocale": {
      "es": "=ENTERO(número)",
      "en": "=INT(number)",
      "de": "=GANZZAHL(Zahl)",
      "fr": "=ENT(nombre)",
      "ja": "=INT(数値)",
      "pt": "=INT(número)"
    },
    "exampleContextByLocale": {
      "es": "Quita los decimales a 45.85 para quedarse solo con la parte entera.",
      "en": "Strips decimals from 45.85 leaving only the integer portion.",
      "de": "Entfernt Dezimalstellen von 45,85.",
      "fr": "Retire les décimales de 45,85 pour ne garder que l'entier.",
      "ja": "45.85の小数点以下を切り捨てて整数値を取得します。",
      "pt": "Remove os decimais de 45,85 mantendo apenas a parte inteira."
    },
    "exampleResultByLocale": {
      "es": "45",
      "en": "45",
      "de": "45",
      "fr": "45",
      "ja": "45",
      "pt": "45"
    },
    "proTipByLocale": {
      "es": "Con números negativos, =ENTERO(-4.2) da -5 porque siempre va hacia abajo. Para truncar usa TRUNCAR.",
      "en": "With negative numbers, =INT(-4.2) gives -5 because it rounds down. To chop off decimals use TRUNC.",
      "de": "Bei negativen Zahlen ergibt =GANZZAHL(-4,2) -5. Um Nachkommastellen abzuschneiden, nimm KÜRZEN.",
      "fr": "Avec les négatifs, =ENT(-4,2) donne -5. Pour tronquer simplement, utilisez TRONQUE.",
      "ja": "負の数では =INT(-4.2) は -5 になります。単に切り捨てるにはTRUNC関数を使います。",
      "pt": "Com números negativos, =INT(-4,2) retorna -5. Para apenas cortar decimais, use TRUNCAR."
    },
    "tags": [
      "int",
      "entero",
      "redondeo",
      "truncar",
      "matematica"
    ]
  },
  {
    "id": "power",
    "nameEn": "POWER",
    "category": "basics",
    "exampleFormula": "=POWER(5, 3)",
    "nameByLocale": {
      "es": "POTENCIA",
      "en": "POWER",
      "de": "POTENZ",
      "fr": "PUISSANCE",
      "ja": "POWER",
      "pt": "POTÊNCIA"
    },
    "descriptionByLocale": {
      "es": "Calcula el resultado de elevar un número a una potencia especificada.",
      "en": "Calculates the result of a number raised to a given power.",
      "de": "Gibt das Ergebnis einer Zahl hoch einer Potenz zurück.",
      "fr": "Calcule le résultat d'un nombre élevé à une puissance donnée.",
      "ja": "数値を指定されたべき乗した結果を計算します。",
      "pt": "Calcula o resultado de um número elevado a uma potência especificada."
    },
    "syntaxByLocale": {
      "es": "=POTENCIA(número, potencia)",
      "en": "=POWER(number, power)",
      "de": "=POTENZ(Zahl; Potenz)",
      "fr": "=PUISSANCE(nombre; puissance)",
      "ja": "=POWER(数値, 指数)",
      "pt": "=POTÊNCIA(número; potência)"
    },
    "exampleContextByLocale": {
      "es": "Calcula 5 elevado al cubo (5 x 5 x 5).",
      "en": "Calculates 5 to the 3rd power (5 x 5 x 5).",
      "de": "Berechnet 5 hoch 3 (5 x 5 x 5).",
      "fr": "Calcule 5 au cube (5 x 5 x 5).",
      "ja": "5の3乗 (5 x 5 x 5) を計算します。",
      "pt": "Calcula 5 elevado ao cubo (5 x 5 x 5)."
    },
    "exampleResultByLocale": {
      "es": "125",
      "en": "125",
      "de": "125",
      "fr": "125",
      "ja": "125",
      "pt": "125"
    },
    "proTipByLocale": {
      "es": "Es idéntico a usar el operador circunflejo (^): =5^3. Para raíces cuadradas puedes elevar a 1/2.",
      "en": "Identical to the caret operator (^): =5^3. You can calculate square root with =POWER(x, 1/2).",
      "de": "Identisch zum Dach-Operator (^): =5^3. Wurzeln lassen sich mit =POTENZ(x; 1/2) ziehen.",
      "fr": "Identique à l'opérateur chapeau (^): =5^3. Pour les racines, élevez à (1/n).",
      "ja": "キャレット記号(^)を使った =5^3 と同じです。1/2乗すれば平方根も求められます。",
      "pt": "Idêntico ao operador circunflexo (^): =5^3. Para raízes use expoente fracionário como 1/2."
    },
    "tags": [
      "power",
      "potencia",
      "exponente",
      "cubo",
      "matematica"
    ]
  },
  {
    "id": "sqrt",
    "nameEn": "SQRT",
    "category": "basics",
    "exampleFormula": "=SQRT(144)",
    "nameByLocale": {
      "es": "RAIZ",
      "en": "SQRT",
      "de": "WURZEL",
      "fr": "RACINE",
      "ja": "SQRT",
      "pt": "RAIZ"
    },
    "descriptionByLocale": {
      "es": "Devuelve la raíz cuadrada positiva de un número.",
      "en": "Returns the positive square root of a given number.",
      "de": "Gibt die positive Quadratwurzel einer Zahl zurück.",
      "fr": "Renvoie la racine carrée positive d'un nombre.",
      "ja": "指定した数値の正の平方根を返します。",
      "pt": "Retorna a raiz quadrada positiva de um número."
    },
    "syntaxByLocale": {
      "es": "=RAIZ(número)",
      "en": "=SQRT(number)",
      "de": "=WURZEL(Zahl)",
      "fr": "=RACINE(nombre)",
      "ja": "=SQRT(数値)",
      "pt": "=RAIZ(número)"
    },
    "exampleContextByLocale": {
      "es": "Calcula la raíz cuadrada de 144.",
      "en": "Calculates the square root of 144.",
      "de": "Berechnet die Quadratwurzel von 144.",
      "fr": "Calcule la racine carrée de 144.",
      "ja": "144の平方根を計算します。",
      "pt": "Calcula a raiz quadrada de 144."
    },
    "exampleResultByLocale": {
      "es": "12",
      "en": "12",
      "de": "12",
      "fr": "12",
      "ja": "12",
      "pt": "12"
    },
    "proTipByLocale": {
      "es": "Si el número es negativo dará error #¡NUM!. Envuelve el número con ABS: =RAIZ(ABS(A1)).",
      "en": "Negative numbers return #NUM! error. Wrap with ABS if needed: =SQRT(ABS(A1)).",
      "de": "Bei negativen Zahlen erscheint #ZAHL!. Bei Bedarf mit ABS absichern: =WURZEL(ABS(A1)).",
      "fr": "Les nombres négatifs donnent #NOMBRE!. Utilisez ABS si besoin: =RACINE(ABS(A1)).",
      "ja": "負の数を渡すと #NUM! エラーになります。必要に応じてABS関数で保護してください。",
      "pt": "Números negativos causam o erro #NÚM!. Se necessário envolva com ABS: =RAIZ(ABS(A1))."
    },
    "tags": [
      "sqrt",
      "raiz",
      "cuadrada",
      "matematica",
      "calculo"
    ]
  },
  {
    "id": "ceiling",
    "nameEn": "CEILING.MATH",
    "category": "basics",
    "exampleFormula": "=CEILING.MATH(24.2, 5)",
    "nameByLocale": {
      "es": "MULTIPLO.SUPERIOR.MAT",
      "en": "CEILING.MATH",
      "de": "OBERGRENZE.MATHEMATIK",
      "fr": "PLAFOND.MATH",
      "ja": "CEILING.MATH",
      "pt": "TETO.MAT"
    },
    "descriptionByLocale": {
      "es": "Redondea un número hacia arriba al entero o múltiplo significativo más cercano.",
      "en": "Rounds a number up to the nearest integer or multiple of significance.",
      "de": "Rundet eine Zahl auf die nächste Ganzzahl oder das Vielfache auf.",
      "fr": "Arrondit un nombre vers le haut au multiple supérieur le plus proche.",
      "ja": "数値を最も近い基準値の倍数に切り上げます。",
      "pt": "Arredonda um número para cima até o inteiro ou múltiplo significativo mais próximo."
    },
    "syntaxByLocale": {
      "es": "=MULTIPLO.SUPERIOR.MAT(número, [cifra_significativa], [modo])",
      "en": "=CEILING.MATH(number, [significance], [mode])",
      "de": "=OBERGRENZE.MATHEMATIK(Zahl; [Schritt]; [Modus])",
      "fr": "=PLAFOND.MATH(nombre; [précision]; [mode])",
      "ja": "=CEILING.MATH(数値, [基準値], [モード])",
      "pt": "=TETO.MAT(número; [significância]; [modo])"
    },
    "exampleContextByLocale": {
      "es": "Calcula lotes de producción: 24.2 piezas empaquetadas en múltiplos de 5.",
      "en": "Production packaging: 24.2 units rounded up to batches of 5.",
      "de": "Verpackungseinheiten: 24,2 Teile aufgerundet auf 5er-Schritte.",
      "fr": "Calcul de lots: 24,2 unités arrondies au multiple supérieur de 5.",
      "ja": "生産バッチ計算: 24.2個を5個単位の箱に切り上げ梱包します。",
      "pt": "Lotes de embalagem: 24,2 unidades arredondadas para múltiplos de 5."
    },
    "exampleResultByLocale": {
      "es": "25",
      "en": "25",
      "de": "25",
      "fr": "25",
      "ja": "25",
      "pt": "25"
    },
    "proTipByLocale": {
      "es": "Perfecto para precios psicológicos acabados en 0.50 o múltiplos exactos de empaque comercial.",
      "en": "Ideal for rounding prices to nearest quarters/nickels or packaging box constraints.",
      "de": "Ideal zur Kalkulation von Mindestverpackungsmengen und Staffelpreisen.",
      "fr": "Indispensable pour le conditionnement et les seuils de tarification commerciale.",
      "ja": "ケース単位の発注数計算や、5円・50円単位の価格切り上げに最適です。",
      "pt": "Excelente para calcular embalagens fechadas e arredondamentos comerciais."
    },
    "tags": [
      "ceiling",
      "multiplo",
      "superior",
      "redondeo",
      "empaque"
    ]
  },
  {
    "id": "floor",
    "nameEn": "FLOOR.MATH",
    "category": "basics",
    "exampleFormula": "=FLOOR.MATH(28.7, 5)",
    "nameByLocale": {
      "es": "MULTIPLO.INFERIOR.MAT",
      "en": "FLOOR.MATH",
      "de": "UNTERGRENZE.MATHEMATIK",
      "fr": "PLANCHER.MATH",
      "ja": "FLOOR.MATH",
      "pt": "CHAO.MAT"
    },
    "descriptionByLocale": {
      "es": "Redondea un número hacia abajo al múltiplo significativo o entero más cercano.",
      "en": "Rounds a number down to the nearest multiple of significance or integer.",
      "de": "Rundet eine Zahl auf das nächste Vielfache nach unten ab.",
      "fr": "Arrondit un nombre vers le bas au multiple inférieur le plus proche.",
      "ja": "数値を最も近い基準値の倍数に切り捨てます。",
      "pt": "Arredonda um número para baixo até o múltiplo significativo mais próximo."
    },
    "syntaxByLocale": {
      "es": "=MULTIPLO.INFERIOR.MAT(número, [cifra_significativa], [modo])",
      "en": "=FLOOR.MATH(number, [significance], [mode])",
      "de": "=UNTERGRENZE.MATHEMATIK(Zahl; [Schritt]; [Modus])",
      "fr": "=PLANCHER.MATH(nombre; [précision]; [mode])",
      "ja": "=FLOOR.MATH(数値, [基準値], [モード])",
      "pt": "=CHAO.MAT(número; [significância]; [modo])"
    },
    "exampleContextByLocale": {
      "es": "28.7 horas liquidadas en bloques cerrados de 5 horas.",
      "en": "28.7 billable hours rounded down into closed 5-hour blocks.",
      "de": "28,7 abrechenbare Stunden abgerundet auf volle 5-Stunden-Blöcke.",
      "fr": "28,7 heures facturées arrondies par tranche complète de 5 heures.",
      "ja": "28.7時間を5時間ごとの区切りに切り捨てます。",
      "pt": "28,7 horas faturáveis em blocos fechados de 5 horas."
    },
    "exampleResultByLocale": {
      "es": "25",
      "en": "25",
      "de": "25",
      "fr": "25",
      "ja": "25",
      "pt": "25"
    },
    "proTipByLocale": {
      "es": "Permite redondear a múltiplos decimales, como múltiplos de 0.25 para cuotas de tiempo.",
      "en": "Can round down to fractional increments like 0.25 for 15-minute billing intervals.",
      "de": "Funktioniert auch mit Dezimalwerten wie 0,25 für 15-Minuten-Takte.",
      "fr": "Fonctionne avec des fractions comme 0,25 pour facturer par quarts d'heure.",
      "ja": "0.25を指定すれば15分単位の工数切り捨て計算などに活用できます。",
      "pt": "Pode arredondar para decimais como 0,25 para intervalos de 15 minutos."
    },
    "tags": [
      "floor",
      "multiplo",
      "inferior",
      "chao",
      "matematica"
    ]
  },
  {
    "id": "aggregate",
    "nameEn": "AGGREGATE",
    "category": "basics",
    "exampleFormula": "=AGGREGATE(9, 6, B2:B50)",
    "nameByLocale": {
      "es": "AGREGAR",
      "en": "AGGREGATE",
      "de": "AGGREGAT",
      "fr": "AGREGAT",
      "ja": "AGGREGATE",
      "pt": "AGREGAR"
    },
    "descriptionByLocale": {
      "es": "Calcula agregaciones (suma, promedio, máx) con superpoderes: ignora errores #N/A, filas ocultas y subtotales anidados.",
      "en": "Calculates aggregate stats (sum, average, max) with options to ignore errors, hidden rows, and nested totals.",
      "de": "Berechnet Aggregationen mit Optionen, Fehlerwerte, ausgeblendete Zeilen und Subtotale zu ignorieren.",
      "fr": "Calcule des agrégations en ignorant au choix les erreurs, lignes masquées ou sous-totaux imbriqués.",
      "ja": "エラー値、非表示行、入れ子の集計行を無視できる万能集計関数です。",
      "pt": "Calcula agregações (soma, média, máx) ignorando erros, linhas ocultas e subtotais aninhados."
    },
    "syntaxByLocale": {
      "es": "=AGREGAR(num_función, opciones, ref1, [ref2], ...)",
      "en": "=AGGREGATE(function_num, options, ref1, [ref2], ...)",
      "de": "=AGGREGAT(Funktion; Optionen; Ref1; [Ref2]; ...)",
      "fr": "=AGREGAT(no_fonction; options; réf1; [réf2]; ...)",
      "ja": "=AGGREGATE(集計方法, オプション, 参照1, [参照2], ...)",
      "pt": "=AGREGAR(núm_função; opções; ref1; [ref2]; ...)"
    },
    "exampleContextByLocale": {
      "es": "Suma (función 9) la columna B2:B50 ignorando cualquier valor de error presente (opción 6).",
      "en": "Sums (func 9) column B2:B50 while completely ignoring any error values (option 6).",
      "de": "Summiert (Funktion 9) Spalte B2:B50 und ignoriert vorhandene Fehlerwerte (Option 6).",
      "fr": "Fait la somme (fonction 9) de B2:B50 en ignorant complètement toutes les erreurs (option 6).",
      "ja": "B2:B50内のエラー値を完全に無視して(オプション6)合計(関数9)を算出します。",
      "pt": "Soma (função 9) a coluna B2:B50 ignorando completamente valores de erro (opção 6)."
    },
    "exampleResultByLocale": {
      "es": "$18,450.00",
      "en": "$18,450.00",
      "de": "18.450,00 €",
      "fr": "18 450,00 €",
      "ja": "¥184,500",
      "pt": "R$ 18.450,00"
    },
    "proTipByLocale": {
      "es": "¡La cura definitiva para fórmulas de suma que se rompen cuando una sola celda del rango tiene #¡VALOR! o #N/A!",
      "en": "The ultimate solution for sum formulas that break whenever a single cell has #VALUE! or #N/A!",
      "de": "Die Rettung für Summen, die abbrechen, wenn eine Zelle #WERT! oder #NV enthält!",
      "fr": "L'arme absolue contre les sommes bloquées par un seul code d'erreur dans la plage !",
      "ja": "範囲内に1つでもエラーがあると計算できなくなるSUM関数の欠点を完璧に解消します。",
      "pt": "A solução definitiva para somas que falham quando há uma célula com erro no intervalo!"
    },
    "tags": [
      "aggregate",
      "agregar",
      "errores",
      "ignorar",
      "suma"
    ]
  },
  {
    "id": "product",
    "nameEn": "PRODUCT",
    "category": "basics",
    "exampleFormula": "=PRODUCT(A2:C2)",
    "nameByLocale": {
      "es": "PRODUCTO",
      "en": "PRODUCT",
      "de": "PRODUKT",
      "fr": "PRODUIT",
      "ja": "PRODUCT",
      "pt": "MULT"
    },
    "descriptionByLocale": {
      "es": "Multiplica todos los números proporcionados como argumentos y devuelve el producto.",
      "en": "Multiplies all numbers given as arguments and returns the product.",
      "de": "Multipliziert alle als Argumente angegebenen Zahlen.",
      "fr": "Multiplie tous les nombres passés en arguments et renvoie le produit.",
      "ja": "引数として指定されたすべての数値を掛け合わせ、積を返します。",
      "pt": "Multiplica todos os números fornecidos como argumentos e retorna o produto."
    },
    "syntaxByLocale": {
      "es": "=PRODUCTO(número1, [número2], ...)",
      "en": "=PRODUCT(number1, [number2], ...)",
      "de": "=PRODUKT(Zahl1; [Zahl2]; ...)",
      "fr": "=PRODUIT(nombre1; [nombre2]; ...)",
      "ja": "=PRODUCT(数値1, [数値2], ...)",
      "pt": "=MULT(número1; [número2]; ...)"
    },
    "exampleContextByLocale": {
      "es": "Multiplica largo (A2=10), ancho (B2=4) y alto (C2=2) para obtener el volumen.",
      "en": "Multiplies length (A2=10), width (B2=4), and height (C2=2) to get volume.",
      "de": "Multipliziert Länge (10), Breite (4) und Höhe (2) für das Volumen.",
      "fr": "Multiplie longueur (10), largeur (4) et hauteur (2) pour trouver le volume.",
      "ja": "長さ(10)、幅(4)、高さ(2)を掛けて体積を求めます。",
      "pt": "Multiplica comprimento (10), largura (4) e altura (2) para calcular volume."
    },
    "exampleResultByLocale": {
      "es": "80",
      "en": "80",
      "de": "80",
      "fr": "80",
      "ja": "80",
      "pt": "80"
    },
    "proTipByLocale": {
      "es": "Mucho más limpio que escribir =A2*B2*C2*D2*E2 cuando multiplicas muchas celdas consecutivas.",
      "en": "Much cleaner than writing =A2*B2*C2*D2*E2 when multiplying wide continuous ranges.",
      "de": "Wesentlich übersichtlicher als endlose Ketten mit Sternchen (*).",
      "fr": "Bien plus propre que =A2*B2*C2*D2 pour multiplier plusieurs cellules contiguës.",
      "ja": "=A2*B2*C2*D2のようにアスタリスクを並べるより遥かに簡潔に書けます。",
      "pt": "Muito mais limpo do que escrever =A2*B2*C2*D2 ao multiplicar vários valores seguidos."
    },
    "tags": [
      "product",
      "producto",
      "multiplicar",
      "mult",
      "calculo"
    ]
  },
  {
    "id": "not",
    "nameEn": "NOT",
    "category": "logic",
    "exampleFormula": "=NOT(B2=\"Cancelado\")",
    "nameByLocale": {
      "es": "NO",
      "en": "NOT",
      "de": "NICHT",
      "fr": "NON",
      "ja": "NOT",
      "pt": "NÃO"
    },
    "descriptionByLocale": {
      "es": "Invierte el valor lógico de su argumento: cambia VERDADERO a FALSO y viceversa.",
      "en": "Reverses the logic of its argument: changes TRUE to FALSE and vice versa.",
      "de": "Kehrt den Wahrheitswert um: macht aus WAHR FALSCH und umgekehrt.",
      "fr": "Inverse la valeur logique de son argument: transforme VRAI en FAUX et inversement.",
      "ja": "引数の論理値を反転します (TRUEならFALSE、FALSEならTRUE)。",
      "pt": "Inverte o valor lógico do argumento: altera VERDADEIRO para FALSO e vice-versa."
    },
    "syntaxByLocale": {
      "es": "=NO(valor_lógico)",
      "en": "=NOT(logical)",
      "de": "=NICHT(Wahrheitswert)",
      "fr": "=NON(valeur_logique)",
      "ja": "=NOT(論理式)",
      "pt": "=NÃO(lógico)"
    },
    "exampleContextByLocale": {
      "es": "Comprueba si el estado del pedido en B2 NO es \"Cancelado\".",
      "en": "Checks if the order status in B2 is NOT \"Cancelled\".",
      "de": "Prüft, ob der Bestellstatus in B2 NICHT \"Storniert\" ist.",
      "fr": "Vérifie si le statut de commande en B2 N'EST PAS \"Annulé\".",
      "ja": "B2の注文ステータスが「キャンセル」ではないことを判定します。",
      "pt": "Verifica se o status do pedido em B2 NÃO é \"Cancelado\"."
    },
    "exampleResultByLocale": {
      "es": "VERDADERO",
      "en": "TRUE",
      "de": "WAHR",
      "fr": "VRAI",
      "ja": "TRUE",
      "pt": "VERDADEIRO"
    },
    "proTipByLocale": {
      "es": "Combínalo con FILTRAR para excluir registros fácilmente: =FILTRAR(A2:B20, NO(ESBLANCO(B2:B20))).",
      "en": "Combine with FILTER to easily exclude rows: =FILTER(A2:B20, NOT(ISBLANK(B2:B20))).",
      "de": "Perfekt mit FILTER zum Ausschließen: =FILTER(A2:B20; NICHT(ISTLEER(B2:B20))).",
      "fr": "Superbe avec FILTRE pour exclure: =FILTRE(A2:B20; NON(ESTVIDE(B2:B20))).",
      "ja": "FILTER関数と組み合わせて空白を除外する際などに活躍します。",
      "pt": "Excelente com FILTRAR para exclusão: =FILTRAR(A2:B20; NÃO(É.VAZIO(B2:B20))). "
    },
    "tags": [
      "not",
      "no",
      "negacion",
      "logica",
      "inverso"
    ]
  },
  {
    "id": "xor",
    "nameEn": "XOR",
    "category": "logic",
    "exampleFormula": "=XOR(A2>50, B2>50)",
    "nameByLocale": {
      "es": "XO",
      "en": "XOR",
      "de": "XODER",
      "fr": "OU.EXCLUSIF",
      "ja": "XOR",
      "pt": "XOU"
    },
    "descriptionByLocale": {
      "es": "Devuelve una O exclusiva lógica: VERDADERO si un número impar de condiciones es verdadero.",
      "en": "Returns a logical exclusive OR: TRUE if an odd number of conditions are true.",
      "de": "Gibt ein exklusives ODER zurück: WAHR, wenn eine ungerade Anzahl Bedingungen zutrifft.",
      "fr": "Renvoie un OU exclusif logique: VRAI si un nombre impair d'arguments est vrai.",
      "ja": "排他的論理和を返します (奇数個の条件がTRUEの場合にTRUE)。",
      "pt": "Retorna um OU exclusivo lógico: VERDADEIRO se um número ímpar de condições for verdadeiro."
    },
    "syntaxByLocale": {
      "es": "=XO(lógico1, [lógico2], ...)",
      "en": "=XOR(logical1, [logical2], ...)",
      "de": "=XODER(Wahrheitswert1; [Wahrheitswert2]; ...)",
      "fr": "=OU.EXCLUSIF(valeur_logique1; [valeur_logique2]; ...)",
      "ja": "=XOR(論理式1, [論理式2], ...)",
      "pt": "=XOU(lógico1; [lógico2]; ...)"
    },
    "exampleContextByLocale": {
      "es": "Aplica descuento si el cliente cumple A o B, pero NO ambos.",
      "en": "Applies discount if customer meets condition A or B, but NOT both.",
      "de": "Gewährt Rabatt, wenn Bedingung A oder B erfüllt ist, aber NICHT beide.",
      "fr": "Applique une remise si le client remplit la condition A ou B, mais PAS les deux.",
      "ja": "条件AまたはBのどちらか一方のみを満たす場合（両方は不可）を判定します。",
      "pt": "Aplica desconto se o cliente cumprir a condição A ou B, mas NÃO ambas."
    },
    "exampleResultByLocale": {
      "es": "VERDADERO",
      "en": "TRUE",
      "de": "WAHR",
      "fr": "VRAI",
      "ja": "TRUE",
      "pt": "VERDADEIRO"
    },
    "proTipByLocale": {
      "es": "Con 2 argumentos, es la clásica prueba de exclusividad estricta (uno u otro, nunca ambos ni ninguno).",
      "en": "With 2 arguments, it enforces strict mutual exclusivity (either one or the other).",
      "de": "Bei 2 Argumenten garantiert es strikte gegenseitige Ausschließlichkeit.",
      "fr": "Avec 2 arguments, garantit l'exclusion mutuelle stricte (l'un ou l'autre).",
      "ja": "引数が2つの場合、二者択一の厳密な排他条件判定として機能します。",
      "pt": "Com 2 argumentos, garante exclusividade mútua estrita (um ou outro)."
    },
    "tags": [
      "xor",
      "xo",
      "exclusivo",
      "logica",
      "booleano"
    ]
  },
  {
    "id": "ifna",
    "nameEn": "IFNA",
    "category": "logic",
    "exampleFormula": "=IFNA(VLOOKUP(A2, D:E, 2, FALSE), \"No Encontrado\")",
    "nameByLocale": {
      "es": "SI.ND",
      "en": "IFNA",
      "de": "WENNNV",
      "fr": "SI.NON.DISP",
      "ja": "IFNA",
      "pt": "SE.NÃO.DISP"
    },
    "descriptionByLocale": {
      "es": "Captura únicamente el error #N/A (no disponible) devolviendo un valor personalizado, sin enmascarar otros errores.",
      "en": "Catches specifically the #N/A error returning a custom value, without hiding genuine formula bugs.",
      "de": "Fängt gezielt den Fehler #NV ab, lässt andere Formelfehler aber sichtbar.",
      "fr": "Intercepte uniquement l'erreur #N/A sans masquer d'autres erreurs de calcul.",
      "ja": "#N/Aエラーのみを捕捉して代替値を返し、他の構文エラーは隠しません。",
      "pt": "Captura exclusivamente o erro #N/D retornando um valor customizado sem mascarar outros erros."
    },
    "syntaxByLocale": {
      "es": "=SI.ND(valor, valor_si_nd)",
      "en": "=IFNA(value, value_if_na)",
      "de": "=WENNNV(Wert; Wert_wenn_nv)",
      "fr": "=SI.NON.DISP(valeur; valeur_si_non_disp)",
      "ja": "=IFNA(値, エラー値)",
      "pt": "=SE.NÃO.DISP(valor; valor_se_não_disp)"
    },
    "exampleContextByLocale": {
      "es": "Si BUSCARV no encuentra el código del cliente, muestra \"No Encontrado\" en vez de #N/A.",
      "en": "If VLOOKUP cannot find the customer code, displays \"Not Found\" instead of #N/A.",
      "de": "Zeigt \"Nicht gefunden\" statt #NV, wenn SVERWEIS den Datensatz nicht findet.",
      "fr": "Affiche \"Non Trouvé\" au lieu de #N/A si RECHERCHEV ne trouve pas le code.",
      "ja": "VLOOKUPで見つからない場合に #N/A の代わりに「未登録」を表示します。",
      "pt": "Se o PROCV não encontrar o código, exibe \"Não Encontrado\" em vez de #N/D."
    },
    "exampleResultByLocale": {
      "es": "No Encontrado",
      "en": "Not Found",
      "de": "Nicht gefunden",
      "fr": "Non Trouvé",
      "ja": "未登録",
      "pt": "Não Encontrado"
    },
    "proTipByLocale": {
      "es": "¡Mejor práctica que SI.ERROR! SI.ERROR oculta errores graves como #¡REF! o #¡DIV/0!; SI.ND solo atiende búsquedas no halladas.",
      "en": "Best practice over IFERROR! IFERROR masks real typos and #REF! bugs; IFNA only handles missing lookups.",
      "de": "Besser als WENNFEHLER! Letzteres verschleiert gefährliche Fehler wie #BEZUG! oder #DIV/0!.",
      "fr": "Préférable à SIERREUR car il ne masque pas les vraies erreurs comme #REF! ou #DIV/0!.",
      "ja": "IFERRORよりも推奨されます。計算ミスや#REF!を隠さず、検索不一致のみを安全に対処できます。",
      "pt": "Melhor que SEERRO! SEERRO oculta erros graves como #REF!; SE.NÃO.DISP só trata buscas ausentes."
    },
    "tags": [
      "ifna",
      "si.nd",
      "na",
      "buscarv",
      "error"
    ]
  },
  {
    "id": "isblank",
    "nameEn": "ISBLANK",
    "category": "logic",
    "exampleFormula": "=ISBLANK(C2)",
    "nameByLocale": {
      "es": "ESBLANCO",
      "en": "ISBLANK",
      "de": "ISTLEER",
      "fr": "ESTVIDE",
      "ja": "ISBLANK",
      "pt": "É.VAZIO"
    },
    "descriptionByLocale": {
      "es": "Comprueba si una celda está completamente vacía y devuelve VERDADERO o FALSO.",
      "en": "Checks whether a cell is completely empty and returns TRUE or FALSE.",
      "de": "Prüft, ob eine Zelle komplett leer ist, und gibt WAHR oder FALSCH zurück.",
      "fr": "Vérifie si une cellule est totalement vide et renvoie VRAI ou FAUX.",
      "ja": "セルが完全に空白かどうかを判定し、TRUEまたはFALSEを返します。",
      "pt": "Verifica se uma célula está completamente vazia e retorna VERDADEIRO ou FALSO."
    },
    "syntaxByLocale": {
      "es": "=ESBLANCO(valor)",
      "en": "=ISBLANK(value)",
      "de": "=ISTLEER(Wert)",
      "fr": "=ESTVIDE(valeur)",
      "ja": "=ISBLANK(テストの対象)",
      "pt": "=É.VAZIO(valor)"
    },
    "exampleContextByLocale": {
      "es": "Verifica si el campo de comentarios en C2 no ha sido rellenado.",
      "en": "Checks if the comments field in C2 has been left blank.",
      "de": "Prüft, ob das Bemerkungsfeld in C2 leer geblieben ist.",
      "fr": "Vérifie si le champ commentaire en C2 est resté vide.",
      "ja": "C2セルの備考欄が未記入であるかを確認します。",
      "pt": "Verifica se o campo de observações em C2 está em branco."
    },
    "exampleResultByLocale": {
      "es": "FALSO",
      "en": "FALSE",
      "de": "FALSCH",
      "fr": "FAUX",
      "ja": "FALSE",
      "pt": "FALSO"
    },
    "proTipByLocale": {
      "es": "Una celda con una fórmula que devuelve texto vacío \"\" NO se considera en blanco por ESBLANCO. En su lugar usa C2=\"\".",
      "en": "A cell with a formula returning empty string \"\" is NOT considered blank by ISBLANK. Use C2=\"\" instead.",
      "de": "Eine Zelle mit einer Leertext-Formel \"\" gilt für ISTLEER nicht als leer. Nutze dafür C2=\"\".",
      "fr": "Une cellule avec une formule renvoyant \"\" n'est pas considérée vide par ESTVIDE. Préférez C2=\"\".",
      "ja": "数式で空文字 \"\" を返しているセルはISBLANKでは空白と判定されません。C2=\"\" を使いましょう。",
      "pt": "Uma célula com fórmula que retorna texto vazio \"\" NÃO é vazia para É.VAZIO. Use C2=\"\"."
    },
    "tags": [
      "isblank",
      "esblanco",
      "vacio",
      "comprobar",
      "celda"
    ]
  },
  {
    "id": "isnumber",
    "nameEn": "ISNUMBER",
    "category": "logic",
    "exampleFormula": "=ISNUMBER(B2)",
    "nameByLocale": {
      "es": "ESNUMERO",
      "en": "ISNUMBER",
      "de": "ISTZAHL",
      "fr": "ESTNUM",
      "ja": "ISNUMBER",
      "pt": "É.NÚM"
    },
    "descriptionByLocale": {
      "es": "Comprueba si un valor es numérico y devuelve VERDADERO o FALSO.",
      "en": "Checks whether a value is numeric and returns TRUE or FALSE.",
      "de": "Prüft, ob ein Wert eine Zahl ist, und gibt WAHR oder FALSCH zurück.",
      "fr": "Vérifie si une valeur est numérique et renvoie VRAI ou FAUX.",
      "ja": "値が数値であるかどうかを判定し、TRUEまたはFALSEを返します。",
      "pt": "Verifica se um valor é numérico e retorna VERDADEIRO ou FALSO."
    },
    "syntaxByLocale": {
      "es": "=ESNUMERO(valor)",
      "en": "=ISNUMBER(value)",
      "de": "=ISTZAHL(Wert)",
      "fr": "=ESTNUM(valeur)",
      "ja": "=ISNUMBER(テストの対象)",
      "pt": "=É.NÚM(valor)"
    },
    "exampleContextByLocale": {
      "es": "Valida si el código postal ingresado en B2 es un número real o fue guardado como texto.",
      "en": "Validates if the postal code in B2 is an actual number or stored as text.",
      "de": "Prüft, ob die Postleitzahl in B2 eine echte Zahl ist oder als Text formatiert wurde.",
      "fr": "Vérifie si le code postal en B2 est un nombre ou stocké sous forme de texte.",
      "ja": "B2の郵便番号が数値として入力されているかテキストかを判定します。",
      "pt": "Valida se o CEP em B2 é um número real ou foi digitado como texto."
    },
    "exampleResultByLocale": {
      "es": "VERDADERO",
      "en": "TRUE",
      "de": "WAHR",
      "fr": "VRAI",
      "ja": "TRUE",
      "pt": "VERDADEIRO"
    },
    "proTipByLocale": {
      "es": "¡El truco maestro de búsqueda parcial!: =ESNUMERO(HALLAR(\"Madrid\", A2)) devuelve VERDADERO si la palabra existe.",
      "en": "Classic formula trick: =ISNUMBER(SEARCH(\"Madrid\", A2)) returns TRUE if the substring exists!",
      "de": "Der Profi-Trick: =ISTZAHL(SUCHEN(\"Berlin\"; A2)) liefert WAHR, wenn der Text vorkommt!",
      "fr": "Astuce classique: =ESTNUM(CHERCHE(\"Paris\"; A2)) renvoie VRAI si le mot est présent !",
      "ja": "=ISNUMBER(SEARCH(\"東京\", A2))と組み合わせると「含む」判定を簡単に作れます。",
      "pt": "O truque clássico: =É.NÚM(PESQUISAR(\"São Paulo\"; A2)) indica se o texto contém a palavra."
    },
    "tags": [
      "isnumber",
      "esnumero",
      "tipo",
      "validar",
      "numero"
    ]
  },
  {
    "id": "istext",
    "nameEn": "ISTEXT",
    "category": "logic",
    "exampleFormula": "=ISTEXT(A2)",
    "nameByLocale": {
      "es": "ESTEXTO",
      "en": "ISTEXT",
      "de": "ISTTEXT",
      "fr": "ESTTEXTE",
      "ja": "ISTEXT",
      "pt": "É.TEXTO"
    },
    "descriptionByLocale": {
      "es": "Comprueba si un valor es de tipo texto y devuelve VERDADERO o FALSO.",
      "en": "Checks whether a value is text and returns TRUE or FALSE.",
      "de": "Prüft, ob ein Wert Text ist, und gibt WAHR oder FALSCH zurück.",
      "fr": "Vérifie si une valeur est du texte et renvoie VRAI ou FAUX.",
      "ja": "値がテキスト（文字列）であるかを判定し、TRUEまたはFALSEを返します。",
      "pt": "Verifica se um valor é do tipo texto e retorna VERDADEIRO ou FALSO."
    },
    "syntaxByLocale": {
      "es": "=ESTEXTO(valor)",
      "en": "=ISTEXT(value)",
      "de": "=ISTTEXT(Wert)",
      "fr": "=ESTTEXTE(valeur)",
      "ja": "=ISTEXT(テストの対象)",
      "pt": "=É.TEXTO(valor)"
    },
    "exampleContextByLocale": {
      "es": "Comprueba si el valor de la celda A2 contiene una cadena de texto.",
      "en": "Checks if cell A2 contains a string of text.",
      "de": "Prüft, ob der Wert in A2 ein Text ist.",
      "fr": "Vérifie si la cellule A2 contient une chaîne de texte.",
      "ja": "A2セルのデータが文字列であるかを確認します。",
      "pt": "Verifica se a célula A2 contém uma sequência de texto."
    },
    "exampleResultByLocale": {
      "es": "VERDADERO",
      "en": "TRUE",
      "de": "WAHR",
      "fr": "VRAI",
      "ja": "TRUE",
      "pt": "VERDADEIRO"
    },
    "proTipByLocale": {
      "es": "Útil en validación de datos para auditar bases importadas donde números vinieron contaminados como texto.",
      "en": "Great for data hygiene auditing to detect numbers accidentally formatted as text.",
      "de": "Ideal zur Datenbereinigung, um fälschlich als Text importierte Zahlen aufzudecken.",
      "fr": "Idéal pour auditer des bases où des nombres ont été importés comme du texte.",
      "ja": "インポートデータで数値が文字列化して計算されないトラブルの検出に役立ちます。",
      "pt": "Ótimo para auditoria e detectar números salvos indevidamente como texto."
    },
    "tags": [
      "istext",
      "estexto",
      "cadena",
      "validar",
      "tipo"
    ]
  },
  {
    "id": "iserror",
    "nameEn": "ISERROR",
    "category": "logic",
    "exampleFormula": "=ISERROR(A2/B2)",
    "nameByLocale": {
      "es": "ESERROR",
      "en": "ISERROR",
      "de": "ISTFEHLER",
      "fr": "ESTERREUR",
      "ja": "ISERROR",
      "pt": "É.ERRO"
    },
    "descriptionByLocale": {
      "es": "Comprueba si un cálculo genera cualquier tipo de error (#N/A, #¡VALOR!, #¡REF!, #¡DIV/0!, etc.).",
      "en": "Checks whether a formula produces any error value (#N/A, #VALUE!, #REF!, #DIV/0!, etc.).",
      "de": "Prüft, ob eine Berechnung irgendeinen Fehlerwert erzeugt (#NV, #WERT!, #BEZUG!, #DIV/0! usw.).",
      "fr": "Vérifie si un calcul produit n'importe quelle valeur d'erreur (#N/A, #VALEUR!, #DIV/0!, etc.).",
      "ja": "式が任意のエラー値 (#N/A, #VALUE!, #REF!, #DIV/0!など) になるかを判定します。",
      "pt": "Verifica se um cálculo gera qualquer tipo de erro (#N/D, #VALOR!, #REF!, #DIV/0!, etc.)."
    },
    "syntaxByLocale": {
      "es": "=ESERROR(valor)",
      "en": "=ISERROR(value)",
      "de": "=ISTFEHLER(Wert)",
      "fr": "=ESTERREUR(valeur)",
      "ja": "=ISERROR(テストの対象)",
      "pt": "=É.ERRO(valor)"
    },
    "exampleContextByLocale": {
      "es": "Prueba si la división A2/B2 falla debido a división por cero o tipos incompatibles.",
      "en": "Tests if dividing A2/B2 fails due to division by zero or incompatible data.",
      "de": "Prüft, ob A2/B2 wegen Division durch Null oder fehlerhafter Datentypen fehlschlägt.",
      "fr": "Teste si la division A2/B2 échoue à cause d'une division par zéro.",
      "ja": "A2/B2の除算が0除算や不適合な値でエラーになるかを事前に検証します。",
      "pt": "Testa se a divisão A2/B2 falha por divisão por zero ou dados incompatíveis."
    },
    "exampleResultByLocale": {
      "es": "FALSO",
      "en": "FALSE",
      "de": "FALSCH",
      "fr": "FAUX",
      "ja": "FALSE",
      "pt": "FALSO"
    },
    "proTipByLocale": {
      "es": "ESERR (con dos R) es idéntica excepto que ignora #N/A; ESERROR captura absolutamente todos los errores.",
      "en": "ISERR is identical except it excludes #N/A; ISERROR catches all errors without exception.",
      "de": "ISTFEHL fängt alles außer #NV ab; ISTFEHLER erfasst restlos alle Fehler.",
      "fr": "ESTERREUR capture tout; ESTERR capture toutes les erreurs sauf #N/A.",
      "ja": "ISERR関数は#N/Aを除外しますが、ISERROR関数はすべてのエラーを漏れなく捉えます。",
      "pt": "É.ERROS ignora #N/D; É.ERRO captura todos os erros sem exceção."
    },
    "tags": [
      "iserror",
      "eserror",
      "fallo",
      "control",
      "validacion"
    ]
  },
  {
    "id": "mid",
    "nameEn": "MID",
    "category": "text",
    "exampleFormula": "=MID(A2, 4, 3)",
    "nameByLocale": {
      "es": "EXTRAE",
      "en": "MID",
      "de": "TEIL",
      "fr": "STXT",
      "ja": "MID",
      "pt": "EXT.TEXTO"
    },
    "descriptionByLocale": {
      "es": "Devuelve un número específico de caracteres de una cadena de texto, empezando en la posición que indiques.",
      "en": "Returns a specific number of characters from a text string, starting at the position you specify.",
      "de": "Gibt ab einer bestimmten Position eine vorgegebene Anzahl von Zeichen eines Textes zurück.",
      "fr": "Renvoie un nombre déterminé de caractères d'une chaîne à partir d'une position donnée.",
      "ja": "文字列の指定した開始位置から、指定した文字数の文字列を取り出します。",
      "pt": "Retorna um número específico de caracteres de um texto, iniciando na posição informada."
    },
    "syntaxByLocale": {
      "es": "=EXTRAE(texto, posición_inicial, núm_caracteres)",
      "en": "=MID(text, start_num, num_chars)",
      "de": "=TEIL(Text; Erstes_Zeichen; Anzahl_Zeichen)",
      "fr": "=STXT(texte; no_départ; nb_caractères)",
      "ja": "=MID(文字列, 開始位置, 文字数)",
      "pt": "=EXT.TEXTO(texto; número_inicial; núm_caract)"
    },
    "exampleContextByLocale": {
      "es": "De un código como \"ES-450-BCN\", extrae los 3 dígitos centrales comenzando en la posición 4.",
      "en": "From a code like \"ES-450-BCN\", extracts the 3 middle digits starting at position 4.",
      "de": "Aus einem Code \"ES-450-BCN\" die 3 mittleren Ziffern ab Position 4 extrahieren.",
      "fr": "Extrait les 3 chiffres du milieu d'un code \"ES-450-BCN\" en partant de la position 4.",
      "ja": "コード「ES-450-BCN」の4文字目から3文字を取り出します。",
      "pt": "De um código como \"ES-450-BCN\", extrai os 3 dígitos do meio iniciando na posição 4."
    },
    "exampleResultByLocale": {
      "es": "450",
      "en": "450",
      "de": "450",
      "fr": "450",
      "ja": "450",
      "pt": "450"
    },
    "proTipByLocale": {
      "es": "El resultado siempre es texto. Para convertirlo a número matemático, antepón dos signos menos: =--EXTRAE(A2, 4, 3).",
      "en": "MID returns text. To turn it into a real math number, prepend double unary: =--MID(A2, 4, 3).",
      "de": "Das Ergebnis ist Text. Für echte Zahlen setze ein doppeltes Minus voran: =--TEIL(A2; 4; 3).",
      "fr": "Le résultat est du texte. Pour le rendre numérique, utilisez le double unaire: =--STXT(A2; 4; 3).",
      "ja": "返り値は文字列です。計算用の数値に変換するには =--MID(A2, 4, 3) とマイナスを2つ付けます。",
      "pt": "O retorno é texto. Para convertê-lo em número, use o duplo unário: =--EXT.TEXTO(A2; 4; 3)."
    },
    "tags": [
      "mid",
      "extrae",
      "subcadena",
      "recortar",
      "texto"
    ]
  },
  {
    "id": "upper",
    "nameEn": "UPPER",
    "category": "text",
    "exampleFormula": "=UPPER(A2)",
    "nameByLocale": {
      "es": "MAYUSC",
      "en": "UPPER",
      "de": "GROSS",
      "fr": "MAJUSCULE",
      "ja": "UPPER",
      "pt": "MAIÚSCULA"
    },
    "descriptionByLocale": {
      "es": "Convierte todo el texto de una celda a letras mayúsculas.",
      "en": "Converts all letters in a text string to uppercase.",
      "de": "Wandelt alle Buchstaben eines Textes in Großbuchstaben um.",
      "fr": "Convertit tout le texte en lettres majuscules.",
      "ja": "文字列に含まれるすべての英文字を大文字に変換します。",
      "pt": "Converte todas as letras de um texto em maiúsculas."
    },
    "syntaxByLocale": {
      "es": "=MAYUSC(texto)",
      "en": "=UPPER(text)",
      "de": "=GROSS(Text)",
      "fr": "=MAJUSCULE(texte)",
      "ja": "=UPPER(文字列)",
      "pt": "=MAIÚSCULA(texto)"
    },
    "exampleContextByLocale": {
      "es": "Estandariza \"juan pérez\" a mayúsculas uniformes.",
      "en": "Standardizes \"john doe\" to uppercase.",
      "de": "Wandelt \"max mustermann\" in Großbuchstaben um.",
      "fr": "Harmonise \"jean dupont\" en majuscules.",
      "ja": "小文字で入力された名前を大文字に揃えます。",
      "pt": "Padroniza \"joão silva\" em letras maiúsculas."
    },
    "exampleResultByLocale": {
      "es": "JUAN PÉREZ",
      "en": "JOHN DOE",
      "de": "MAX MUSTERMANN",
      "fr": "JEAN DUPONT",
      "ja": "JOHN DOE",
      "pt": "JOÃO SILVA"
    },
    "proTipByLocale": {
      "es": "Especialmente útil antes de comparar textos o generar códigos identificadores estándar.",
      "en": "Great before comparing strings or generating standard serial/SKU codes.",
      "de": "Sehr nützlich für die Erstellung einheitlicher Artikelnummern oder Match-Schlüssel.",
      "fr": "Très pratique pour uniformiser les clés de rapprochement et codes SKU.",
      "ja": "大文字小文字の揺れを統一して比較処理やコード生成をする際に必須です。",
      "pt": "Muito útil para padronizar cadastros e códigos SKU antes de comparações."
    },
    "tags": [
      "upper",
      "mayusc",
      "mayusculas",
      "formato",
      "limpieza"
    ]
  },
  {
    "id": "lower",
    "nameEn": "LOWER",
    "category": "text",
    "exampleFormula": "=LOWER(B2)",
    "nameByLocale": {
      "es": "MINUSC",
      "en": "LOWER",
      "de": "KLEIN",
      "fr": "MINUSCULE",
      "ja": "LOWER",
      "pt": "MINÚSCULA"
    },
    "descriptionByLocale": {
      "es": "Convierte todas las letras de una cadena de texto a minúsculas.",
      "en": "Converts all letters in a text string to lowercase.",
      "de": "Wandelt alle Buchstaben eines Textes in Kleinbuchstaben um.",
      "fr": "Convertit tout le texte en lettres minuscules.",
      "ja": "文字列に含まれるすべての英文字を小文字に変換します。",
      "pt": "Converte todas as letras de uma cadeia de texto em minúsculas."
    },
    "syntaxByLocale": {
      "es": "=MINUSC(texto)",
      "en": "=LOWER(text)",
      "de": "=KLEIN(Text)",
      "fr": "=MINUSCULE(texte)",
      "ja": "=LOWER(文字列)",
      "pt": "=MINÚSCULA(texto)"
    },
    "exampleContextByLocale": {
      "es": "Normaliza direcciones de correo electrónico ingresadas con mayúsculas mezcladas.",
      "en": "Normalizes email addresses typed with mixed casing.",
      "de": "Normalisiert gemischt eingegebene E-Mail-Adressen in reine Kleinbuchstaben.",
      "fr": "Normalise les adresses courriel saisies avec des casses mélangées.",
      "ja": "大文字が混ざったメールアドレスをすべて小文字に統一します。",
      "pt": "Normaliza endereços de e-mail digitados com letras maiúsculas misturadas."
    },
    "exampleResultByLocale": {
      "es": "contacto@empresa.com",
      "en": "contact@company.com",
      "de": "kontakt@firma.de",
      "fr": "contact@entreprise.fr",
      "ja": "contact@company.com",
      "pt": "contato@empresa.com.br"
    },
    "proTipByLocale": {
      "es": "Esencial para limpiar correos y URLs antes de cargarlos a CRM o sistemas de mailing.",
      "en": "Crucial for cleaning email lists and web URLs before exporting to CRMs.",
      "de": "Unerlässlich für E-Mail-Listen und URLs vor dem CRM-Import.",
      "fr": "Indispensable pour nettoyer les courriels et URL avant import CRM.",
      "ja": "CRMやメーリングリストにインポートする前のメールアドレス整形に最適です。",
      "pt": "Essencial para higienizar listas de e-mails e URLs antes de importar no CRM."
    },
    "tags": [
      "lower",
      "minusc",
      "minusculas",
      "email",
      "limpieza"
    ]
  },
  {
    "id": "text",
    "nameEn": "TEXT",
    "category": "text",
    "exampleFormula": "=TEXT(A2, \"dd/mm/yyyy\")",
    "nameByLocale": {
      "es": "TEXTO",
      "en": "TEXT",
      "de": "TEXT",
      "fr": "TEXTE",
      "ja": "TEXT",
      "pt": "TEXTO"
    },
    "descriptionByLocale": {
      "es": "Convierte un valor numérico o fecha en texto con un formato personalizado específico.",
      "en": "Converts a number or date to formatted text using custom format codes.",
      "de": "Wandelt eine Zahl oder ein Datum mit einem benutzerdefinierten Format in Text um.",
      "fr": "Convertit un nombre ou une date en texte selon un format personnalisé.",
      "ja": "数値や日付を指定した表示形式の文字列に変換します。",
      "pt": "Converte um número ou data em texto com uma formatação personalizada."
    },
    "syntaxByLocale": {
      "es": "=TEXTO(valor, formato)",
      "en": "=TEXT(value, format_text)",
      "de": "=TEXT(Wert; Textformat)",
      "fr": "=TEXTE(valeur; format_texte)",
      "ja": "=TEXT(値, 表示形式)",
      "pt": "=TEXTO(valor; formato_texto)"
    },
    "exampleContextByLocale": {
      "es": "Formatea la fecha de A2 para que aparezca legible dentro de una frase concatenada.",
      "en": "Formats the date in A2 to read cleanly inside a concatenated sentence.",
      "de": "Formatiert ein Datum sauber für die Einbettung in einen Textbaustein.",
      "fr": "Formate la date de A2 pour l'insérer proprement dans une phrase.",
      "ja": "A2の日付を文章内で正しく読めるように年月日形式に整えます。",
      "pt": "Formata a data de A2 para ser exibida corretamente dentro de uma frase concatenada."
    },
    "exampleResultByLocale": {
      "es": "04/11/2026",
      "en": "11/04/2026",
      "de": "04.11.2026",
      "fr": "04/11/2026",
      "ja": "2026/11/04",
      "pt": "04/11/2026"
    },
    "proTipByLocale": {
      "es": "Sin TEXTO, al concatenar una fecha u hora Excel muestra un número serie feo como 45293. TEXTO conserva el formato visual.",
      "en": "Without TEXT, concatenating a date shows raw serial integers like 45293. TEXT preserves visual formatting.",
      "de": "Ohne TEXT zeigt Excel beim Verketten rohe Seriennummern wie 45293 statt formatierter Daten.",
      "fr": "Sans TEXTE, concaténer une date affiche le numéro de série brut 45293.",
      "ja": "& で日付をつなげると 45293 のようなシリアル値になってしまう現象を解決します。",
      "pt": "Sem TEXTO, ao concatenar datas o Excel exibe números seriais como 45293."
    },
    "tags": [
      "text",
      "texto",
      "formato",
      "fecha",
      "mascara"
    ]
  },
  {
    "id": "textbefore",
    "nameEn": "TEXTBEFORE",
    "category": "text",
    "exampleFormula": "=TEXTBEFORE(A2, \"@\")",
    "nameByLocale": {
      "es": "TEXTOANTESDE",
      "en": "TEXTBEFORE",
      "de": "TEXTVOR",
      "fr": "TEXTE.AVANT",
      "ja": "TEXTBEFORE",
      "pt": "TEXTOANTES"
    },
    "descriptionByLocale": {
      "es": "Extrae todo el texto que se encuentra antes de un delimitador específico.",
      "en": "Extracts all text that occurs before a specified delimiter.",
      "de": "Extrahiert den Text vor einem angegebenen Trennzeichen.",
      "fr": "Extrait tout le texte situé avant un délimiteur spécifié.",
      "ja": "指定した区切り記号の前に現れるすべての文字列を抽出します。",
      "pt": "Extrai todo o texto que ocorre antes de um delimitador específico."
    },
    "syntaxByLocale": {
      "es": "=TEXTOANTESDE(texto, delimitador, [número_instancia], ...)",
      "en": "=TEXTBEFORE(text, delimiter, [instance_num], ...)",
      "de": "=TEXTVOR(Text; Trennzeichen; [Instanz]; ...)",
      "fr": "=TEXTE.AVANT(texte; délimiteur; [no_occurrence]; ...)",
      "ja": "=TEXTBEFORE(テキスト, 区切り記号, [インスタンス番号], ...)",
      "pt": "=TEXTOANTES(texto; delimitador; [núm_instância]; ...)"
    },
    "exampleContextByLocale": {
      "es": "De un correo \"juan.perez@empresa.com\", extrae el nombre de usuario antes del arroba.",
      "en": "From an email \"john.doe@company.com\", extracts the username before the @ symbol.",
      "de": "Aus \"max.mustermann@firma.de\" den Benutzernamen vor dem @ extrahieren.",
      "fr": "Extrait l'identifiant d'un courriel avant le caractère @.",
      "ja": "メールアドレスから「@」記号より前にあるユーザー名を抽出します。",
      "pt": "De um e-mail \"joao.silva@empresa.com\", extrai o nome de usuário antes do @."
    },
    "exampleResultByLocale": {
      "es": "juan.perez",
      "en": "john.doe",
      "de": "max.mustermann",
      "fr": "jean.dupont",
      "ja": "john.doe",
      "pt": "joao.silva"
    },
    "proTipByLocale": {
      "es": "Reemplaza de un solo golpe las viejas fórmulas complejas con IZQUIERDA + HALLAR. ¡Una revolución moderna!",
      "en": "Completely replaces messy legacy combinations of LEFT and SEARCH. Pure magic!",
      "de": "Ersetzt komplizierte alte Formeln aus LINKS und SUCHEN auf einen Schlag.",
      "fr": "Remplace d'un coup les formules complexes associant GAUCHE et CHERCHE.",
      "ja": "従来の LEFT + SEARCH の複雑な組み合わせをたった1つの関数で代替できます。",
      "pt": "Substitui de uma vez combinações complicadas de ESQUERDA + LOCALIZAR."
    },
    "tags": [
      "textbefore",
      "textoantesde",
      "delimitador",
      "extraer",
      "moderno"
    ]
  },
  {
    "id": "textafter",
    "nameEn": "TEXTAFTER",
    "category": "text",
    "exampleFormula": "=TEXTAFTER(A2, \"@\")",
    "nameByLocale": {
      "es": "TEXTODESPUESDE",
      "en": "TEXTAFTER",
      "de": "TEXTNACH",
      "fr": "TEXTE.APRES",
      "ja": "TEXTAFTER",
      "pt": "TEXTODEPOIS"
    },
    "descriptionByLocale": {
      "es": "Devuelve todo el texto que ocurre después de un carácter o delimitador especificado.",
      "en": "Returns all text that occurs after a specified delimiter character.",
      "de": "Gibt den Text nach einem bestimmten Trennzeichen zurück.",
      "fr": "Renvoie tout le texte qui apparaît après un caractère délimiteur.",
      "ja": "指定した区切り記号の後に現れるすべての文字列を返します。",
      "pt": "Retorna todo o texto que ocorre após um delimitador especificado."
    },
    "syntaxByLocale": {
      "es": "=TEXTODESPUESDE(texto, delimitador, [número_instancia], ...)",
      "en": "=TEXTAFTER(text, delimiter, [instance_num], ...)",
      "de": "=TEXTNACH(Text; Trennzeichen; [Instanz]; ...)",
      "fr": "=TEXTE.APRES(texte; délimiteur; [no_occurrence]; ...)",
      "ja": "=TEXTAFTER(テキスト, 区切り記号, [インスタンス番号], ...)",
      "pt": "=TEXTODEPOIS(texto; delimitador; [núm_instância]; ...)"
    },
    "exampleContextByLocale": {
      "es": "Extrae el dominio de la empresa de una dirección de correo (después del \"@\").",
      "en": "Extracts company domain from an email address (after the \"@\").",
      "de": "Extrahiert die Domain aus einer E-Mail-Adresse nach dem @.",
      "fr": "Extrait le nom de domaine d'une adresse courriel après le @.",
      "ja": "メールアドレスから「@」以降のドメイン部分を抽出します。",
      "pt": "Extrai o domínio corporativo de um e-mail (após o \"@\")."
    },
    "exampleResultByLocale": {
      "es": "empresa.com",
      "en": "company.com",
      "de": "firma.de",
      "fr": "entreprise.fr",
      "ja": "company.com",
      "pt": "empresa.com"
    },
    "proTipByLocale": {
      "es": "Si pones -1 como número de instancia, busca a partir de la ÚLTIMA aparición del delimitador (ideal para extensiones de archivos).",
      "en": "Set instance_num to -1 to grab text after the LAST occurrence (perfect for file extensions!).",
      "de": "Instanz auf -1 setzen, um den Text nach dem LETZTEN Vorkommen zu holen (ideal für Dateiendungen!).",
      "fr": "Réglez l'occurrence sur -1 pour cibler la DERNIÈRE apparition (idéal pour les extensions de fichiers).",
      "ja": "インスタンスに -1 を指定すると最後の区切り記号以降（拡張子の抽出など）を取得できます。",
      "pt": "Use -1 na instância para pegar o texto após a ÚLTIMA ocorrência (ideal para extensões de arquivo)."
    },
    "tags": [
      "textafter",
      "textodespuesde",
      "delimitador",
      "dominio",
      "extraer"
    ]
  },
  {
    "id": "find",
    "nameEn": "FIND",
    "category": "text",
    "exampleFormula": "=FIND(\"-\", A2)",
    "nameByLocale": {
      "es": "ENCONTRAR",
      "en": "FIND",
      "de": "FINDEN",
      "fr": "TROUVE",
      "ja": "FIND",
      "pt": "LOCALIZAR"
    },
    "descriptionByLocale": {
      "es": "Busca una cadena de texto dentro de otra y devuelve su posición numérica (distingue mayúsculas y minúsculas).",
      "en": "Finds a text string within another and returns its character position (case-sensitive).",
      "de": "Sucht eine Zeichenfolge in einem Text unter Beachtung von Groß-/Kleinschreibung.",
      "fr": "Trouve une chaîne dans une autre et renvoie sa position (sensible à la casse).",
      "ja": "文字列を他の文字列の中で検索し、その開始位置を返します（大文字・小文字を区別）。",
      "pt": "Procura um texto dentro de outro e retorna sua posição (diferencia maiúsculas e minúsculas)."
    },
    "syntaxByLocale": {
      "es": "=ENCONTRAR(texto_buscado, dentro_del_texto, [núm_inicial])",
      "en": "=FIND(find_text, within_text, [start_num])",
      "de": "=FINDEN(Suchtext; Text; [Erstes_Zeichen])",
      "fr": "=TROUVE(texte_cherché; texte; [no_départ])",
      "ja": "=FIND(検索文字列, 対象, [開始位置])",
      "pt": "=LOCALIZAR(texto_procurado; no_texto; [núm_inicial])"
    },
    "exampleContextByLocale": {
      "es": "Localiza en qué número de carácter se encuentra el primer guion en \"PROD-2026\".",
      "en": "Finds the exact character position of the first hyphen in \"PROD-2026\".",
      "de": "Ermittelt die Position des ersten Bindestrichs in \"PROD-2026\".",
      "fr": "Trouve la position exacte du premier tiret dans \"PROD-2026\".",
      "ja": "「PROD-2026」の中で最初のハイフンがある位置を調べます。",
      "pt": "Localiza em qual caractere está o primeiro hífen em \"PROD-2026\"."
    },
    "exampleResultByLocale": {
      "es": "5",
      "en": "5",
      "de": "5",
      "fr": "5",
      "ja": "5",
      "pt": "5"
    },
    "proTipByLocale": {
      "es": "Si necesitas una búsqueda que NO distinga mayúsculas ni minúsculas o admita comodines (?, *), usa HALLAR en su lugar.",
      "en": "If you need case-insensitive matching or wildcards (?, *), use SEARCH instead.",
      "de": "Wenn Groß-/Kleinschreibung egal ist oder Platzhalter benötigt werden, nimm SUCHEN.",
      "fr": "Si vous préférez ignorer la casse ou utiliser des jokers, utilisez CHERCHE.",
      "ja": "大文字・小文字を区別せず、ワイルドカードを使いたい場合はSEARCH関数を使用します。",
      "pt": "Se precisar ignorar maiúsculas/minúsculas e aceitar curingas, use PESQUISAR."
    },
    "tags": [
      "find",
      "encontrar",
      "posicion",
      "caracter",
      "buscar"
    ]
  },
  {
    "id": "search",
    "nameEn": "SEARCH",
    "category": "text",
    "exampleFormula": "=SEARCH(\"total\", A2)",
    "nameByLocale": {
      "es": "HALLAR",
      "en": "SEARCH",
      "de": "SUCHEN",
      "fr": "CHERCHE",
      "ja": "SEARCH",
      "pt": "PESQUISAR"
    },
    "descriptionByLocale": {
      "es": "Devuelve la posición de una cadena dentro de otra; no distingue mayúsculas y admite comodines (* y ?).",
      "en": "Returns position of a substring within text; case-insensitive and supports wildcards (* and ?).",
      "de": "Liefert die Position eines Textes in einem anderen ohne Beachtung der Groß-/Kleinschreibung.",
      "fr": "Renvoie la position d'une sous-chaîne sans tenir compte de la casse, avec jokers (* et ?).",
      "ja": "大文字と小文字を区別せず、ワイルドカード(*, ?)を使用して文字列の開始位置を返します。",
      "pt": "Retorna a posição de um texto dentro de outro; não diferencia maiúsculas e aceita curingas."
    },
    "syntaxByLocale": {
      "es": "=HALLAR(texto_buscado, dentro_del_texto, [núm_inicial])",
      "en": "=SEARCH(find_text, within_text, [start_num])",
      "de": "=SUCHEN(Suchtext; Text; [Erstes_Zeichen])",
      "fr": "=CHERCHE(texte_cherché; texte; [no_départ])",
      "ja": "=SEARCH(検索文字列, 対象, [開始位置])",
      "pt": "=PESQUISAR(texto_procurado; no_texto; [núm_inicial])"
    },
    "exampleContextByLocale": {
      "es": "Encuentra en qué posición comienza la palabra \"total\" en \"Gran Total Ventas\".",
      "en": "Finds where \"total\" begins inside \"Grand Total Sales\".",
      "de": "Ermittelt, wo \"total\" im Text \"Grand Total Sales\" beginnt.",
      "fr": "Localise le mot \"total\" dans \"Grand Total Ventes\".",
      "ja": "「Grand Total Sales」の中で「total」が始まる位置を取得します。",
      "pt": "Encontra em qual caractere começa a palavra \"total\" em \"Gran Total Vendas\"."
    },
    "exampleResultByLocale": {
      "es": "6",
      "en": "7",
      "de": "7",
      "fr": "7",
      "ja": "7",
      "pt": "6"
    },
    "proTipByLocale": {
      "es": "Admite comodines: =HALLAR(\"c?sa\", A2) encuentra \"casa\" y \"cosa\"; =HALLAR(\"vent*\", A2) encuentra \"ventas\".",
      "en": "Supports wildcards: =SEARCH(\"c?t\", A2) matches cat and cot; =SEARCH(\"sal*\", A2) finds sales.",
      "de": "Unterstützt Platzhalter wie ? für Einzelzeichen und * für beliebige Zeichenfolgen.",
      "fr": "Gère les jokers: ? pour un caractère et * pour n'importe quelle suite de caractères.",
      "ja": "ワイルドカードに対応しており「?」で1文字、「*」で任意の文字列に一致させられます。",
      "pt": "Aceita caracteres curinga: ? para um único caractere e * para qualquer sequência."
    },
    "tags": [
      "search",
      "hallar",
      "comodines",
      "posicion",
      "buscar"
    ]
  },
  {
    "id": "replace",
    "nameEn": "REPLACE",
    "category": "text",
    "exampleFormula": "=REPLACE(A2, 1, 4, \"2027\")",
    "nameByLocale": {
      "es": "REEMPLAZAR",
      "en": "REPLACE",
      "de": "ERSETZEN",
      "fr": "REMPLACER",
      "ja": "REPLACE",
      "pt": "MUDAR"
    },
    "descriptionByLocale": {
      "es": "Reemplaza parte de una cadena de texto por otra diferente, basándose en la posición y número de caracteres.",
      "en": "Replaces part of a text string with another based on starting character position and length.",
      "de": "Ersetzt einen Teil eines Textes durch einen anderen anhand von Startposition und Zeichenanzahl.",
      "fr": "Remplace une partie d'un texte par un autre selon une position et un nombre de caractères.",
      "ja": "指定した位置から指定した文字数の文字列を、新しい文字列に置き換えます。",
      "pt": "Substitui parte de um texto por outro com base na posição inicial e número de caracteres."
    },
    "syntaxByLocale": {
      "es": "=REEMPLAZAR(texto_original, núm_inicial, núm_caracteres, texto_nuevo)",
      "en": "=REPLACE(old_text, start_num, num_chars, new_text)",
      "de": "=ERSETZEN(Alter_Text; Erstes_Zeichen; Anzahl_Zeichen; Neuer_Text)",
      "fr": "=REMPLACER(ancien_texte; no_départ; nb_caractères; nouveau_texte)",
      "ja": "=REPLACE(古い文字列, 開始位置, 文字数, 新しい文字列)",
      "pt": "=MUDAR(texto_antigo; núm_inicial; núm_caract; novo_texto)"
    },
    "exampleContextByLocale": {
      "es": "Actualiza el año al inicio del código \"2024-ABC\" cambiándolo por \"2027\".",
      "en": "Updates year prefix in code \"2024-ABC\" replacing the first 4 chars with \"2027\".",
      "de": "Ersetzt die ersten 4 Ziffern der Kennung \"2024-ABC\" durch \"2027\".",
      "fr": "Modifie l'année en début de code \"2024-ABC\" par \"2027\".",
      "ja": "コード「2024-ABC」の先頭4文字を「2027」に更新します。",
      "pt": "Atualiza o ano no início do código \"2024-ABC\" trocando os 4 primeiros caracteres por \"2027\"."
    },
    "exampleResultByLocale": {
      "es": "2027-ABC",
      "en": "2027-ABC",
      "de": "2027-ABC",
      "fr": "2027-ABC",
      "ja": "2027-ABC",
      "pt": "2027-ABC"
    },
    "proTipByLocale": {
      "es": "Diferencia clave con SUSTITUIR: REEMPLAZAR trabaja por posición numérica fija; SUSTITUIR busca palabras o letras específicas.",
      "en": "Key difference vs SUBSTITUTE: REPLACE targets fixed positions; SUBSTITUTE matches specific words.",
      "de": "Unterschied zu WECHSELN: ERSETZEN arbeitet mit Positionen, WECHSELN sucht gezielte Begriffe.",
      "fr": "Différence avec SUBSTITUE: REMPLACER agit par position; SUBSTITUE recherche un mot précis.",
      "ja": "SUBSTITUTEは特定の文字列を探して置換しますが、REPLACEは文字位置を指定して置換します。",
      "pt": "Diferença de SUBSTITUIR: MUDAR age por posição numérica fixa; SUBSTITUIR busca termos específicos."
    },
    "tags": [
      "replace",
      "reemplazar",
      "sustituir",
      "posicion",
      "modificar"
    ]
  },
  {
    "id": "exact",
    "nameEn": "EXACT",
    "category": "text",
    "exampleFormula": "=EXACT(A2, B2)",
    "nameByLocale": {
      "es": "IGUAL",
      "en": "EXACT",
      "de": "IDENTISCH",
      "fr": "EXACT",
      "ja": "EXACT",
      "pt": "EXATO"
    },
    "descriptionByLocale": {
      "es": "Compara dos cadenas de texto y devuelve VERDADERO solo si son exactamente idénticas, distinguiendo mayúsculas.",
      "en": "Compares two text strings and returns TRUE only if they are exactly identical (case-sensitive).",
      "de": "Vergleicht zwei Texte und gibt nur bei exakter Übereinstimmung (Groß-/Kleinschreibung) WAHR zurück.",
      "fr": "Compare deux chaînes et renvoie VRAI uniquement si elles sont rigoureusement identiques.",
      "ja": "2つの文字列を比較し、大文字・小文字も含めて完全に一致する場合のみTRUEを返します。",
      "pt": "Compara dois textos e retorna VERDADEIRO apenas se forem rigorosamente idênticos."
    },
    "syntaxByLocale": {
      "es": "=IGUAL(texto1, texto2)",
      "en": "=EXACT(text1, text2)",
      "de": "=IDENTISCH(Text1; Text2)",
      "fr": "=EXACT(texte1; texte2)",
      "ja": "=EXACT(文字列1, 文字列2)",
      "pt": "=EXATO(texto1; texto2)"
    },
    "exampleContextByLocale": {
      "es": "Compara contraseñas o tokens sensibles en A2 y B2: \"Admin\" vs \"admin\".",
      "en": "Compares case-sensitive passwords in A2 and B2: \"Admin\" vs \"admin\".",
      "de": "Prüft sicherheitsrelevante Passwörter in A2 und B2: \"Admin\" vs \"admin\".",
      "fr": "Compare des mots de passe sensibles dans A2 et B2: \"Admin\" vs \"admin\".",
      "ja": "A2とB2のパスワード（「Admin」と「admin」）を厳密に比較します。",
      "pt": "Compara senhas ou tokens com sensibilidade a maiúsculas: \"Admin\" vs \"admin\"."
    },
    "exampleResultByLocale": {
      "es": "FALSO",
      "en": "FALSE",
      "de": "FALSCH",
      "fr": "FAUX",
      "ja": "FALSE",
      "pt": "FALSO"
    },
    "proTipByLocale": {
      "es": "El operador habitual =A2=B2 ignora diferencias entre mayúsculas y minúsculas. IGUAL es el único que las distingue.",
      "en": "Standard =A2=B2 ignores casing differences. EXACT is the only native way to enforce exact match.",
      "de": "Der normale Vergleich =A2=B2 ignoriert Großbuchstaben. Nur IDENTISCH unterscheidet strikt.",
      "fr": "Le test standard =A2=B2 ignore la casse. Seul EXACT applique une comparaison stricte.",
      "ja": "通常の一致判定 =A2=B2 は大文字小文字を区別しません。厳密な判定にはEXACTが必須です。",
      "pt": "O comparador padrão =A2=B2 ignora maiúsculas. EXATO é o único que faz verificação estrita."
    },
    "tags": [
      "exact",
      "igual",
      "comparar",
      "mayusculas",
      "seguridad"
    ]
  },
  {
    "id": "count",
    "nameEn": "COUNT",
    "category": "stats",
    "exampleFormula": "=COUNT(B2:B50)",
    "nameByLocale": {
      "es": "CONTAR",
      "en": "COUNT",
      "de": "ANZAHL",
      "fr": "NB",
      "ja": "COUNT",
      "pt": "CONT.NÚM"
    },
    "descriptionByLocale": {
      "es": "Cuenta cuántas celdas en un rango contienen números (ignora texto, celdas vacías y errores).",
      "en": "Counts how many cells in a range contain numbers (ignores text, blanks, and errors).",
      "de": "Zählt, wie viele Zellen in einem Bereich Zahlen enthalten (ignoriert Text und Leerstellen).",
      "fr": "Compte le nombre de cellules contenant des nombres dans une plage (ignore le texte et le vide).",
      "ja": "指定された範囲内で数値が含まれているセルの個数を数えます（文字列や空白は無視）。",
      "pt": "Conta quantas células em um intervalo contêm números (ignora textos, vazios e erros)."
    },
    "syntaxByLocale": {
      "es": "=CONTAR(valor1, [valor2], ...)",
      "en": "=COUNT(value1, [value2], ...)",
      "de": "=ANZAHL(Wert1; [Wert2]; ...)",
      "fr": "=NB(valeur1; [valeur2]; ...)",
      "ja": "=COUNT(値1, [値2], ...)",
      "pt": "=CONT.NÚM(valor1; [valor2]; ...)"
    },
    "exampleContextByLocale": {
      "es": "Cuenta cuántos alumnos tienen una calificación numérica asentada en la columna B.",
      "en": "Counts how many students have a graded numeric score recorded in column B.",
      "de": "Zählt, wie viele Schüler eine numerische Note in Spalte B eingetragen haben.",
      "fr": "Compte le nombre d'élèves ayant une note chiffrée renseignée en colonne B.",
      "ja": "B列に数値のテスト点数が記入されている生徒の人数をカウントします。",
      "pt": "Conta quantos alunos têm nota numérica registrada na coluna B."
    },
    "exampleResultByLocale": {
      "es": "42",
      "en": "42",
      "de": "42",
      "fr": "42",
      "ja": "42",
      "pt": "42"
    },
    "proTipByLocale": {
      "es": "Las fechas en Excel son números de serie internos, por lo que CONTAR también cuenta celdas con fechas válidas.",
      "en": "Dates are stored as numbers in Excel, so COUNT correctly tallies valid date cells too.",
      "de": "Da Daten in Excel als fortlaufende Zahlen gespeichert sind, zählt ANZAHL auch Datumsangaben mit.",
      "fr": "Les dates étant des numéros de série, NB compte également les dates valides.",
      "ja": "Excelの日付は内部的にシリアル値（数値）なので、COUNT関数で日付セルもカウントされます。",
      "pt": "Como datas são números seriais no Excel, CONT.NÚM também contabiliza datas válidas."
    },
    "tags": [
      "count",
      "contar",
      "numeros",
      "conteo",
      "estadistica"
    ]
  },
  {
    "id": "counta",
    "nameEn": "COUNTA",
    "category": "stats",
    "exampleFormula": "=COUNTA(A2:A50)",
    "nameByLocale": {
      "es": "CONTARA",
      "en": "COUNTA",
      "de": "ANZAHL2",
      "fr": "NBVAL",
      "ja": "COUNTA",
      "pt": "CONT.VALORES"
    },
    "descriptionByLocale": {
      "es": "Cuenta cuántas celdas en un rango NO están vacías (contabiliza texto, números, fechas y errores).",
      "en": "Counts how many cells in a range are NOT empty (tallies text, numbers, dates, and errors).",
      "de": "Zählt alle nicht leeren Zellen in einem Bereich (inklusive Text, Zahlen und Fehlern).",
      "fr": "Compte toutes les cellules non vides d'une plage (textes, nombres, dates, erreurs).",
      "ja": "指定した範囲内の空白ではない（何らかのデータが入っている）セルの個数を数えます。",
      "pt": "Conta quantas células em um intervalo NÃO estão vazias (contando textos, números e erros)."
    },
    "syntaxByLocale": {
      "es": "=CONTARA(valor1, [valor2], ...)",
      "en": "=COUNTA(value1, [value2], ...)",
      "de": "=ANZAHL2(Wert1; [Wert2]; ...)",
      "fr": "=NBVAL(valeur1; [valeur2]; ...)",
      "ja": "=COUNTA(値1, [値2], ...)",
      "pt": "=CONT.VALORES(valor1; [valor2]; ...)"
    },
    "exampleContextByLocale": {
      "es": "Determina el total de asistentes registrados (nombres en texto) en la columna A.",
      "en": "Determines total registered attendees (text names) in column A.",
      "de": "Ermittelt die Gesamtzahl der angemeldeten Teilnehmer (Namen) in Spalte A.",
      "fr": "Détermine le total des participants inscrits (noms) en colonne A.",
      "ja": "A列に名前が登録されている参加者の総数を数えます。",
      "pt": "Determina o total de participantes cadastrados (nomes em texto) na coluna A."
    },
    "exampleResultByLocale": {
      "es": "48",
      "en": "48",
      "de": "48",
      "fr": "48",
      "ja": "48",
      "pt": "48"
    },
    "proTipByLocale": {
      "es": "¡Cuidado! Si una celda tiene una fórmula que devuelve \"\" o un espacio invisible, CONTARA la contará como no vacía.",
      "en": "Watch out! Cells containing empty strings \"\" or invisible spaces are counted by COUNTA.",
      "de": "Achtung: Zellen mit Leertext \"\" oder Leerzeichen werden von ANZAHL2 als nicht-leer gewertet.",
      "fr": "Attention: les cellules avec une formule renvoyant \"\" sont comptées par NBVAL.",
      "ja": "注意: 数式で空文字 \"\" を返しているセルや見えない空白もカウント対象になります。",
      "pt": "Atenção: células com fórmulas retornando \"\" ou espaços são consideradas preenchidas."
    },
    "tags": [
      "counta",
      "contara",
      "novacio",
      "registros",
      "conteo"
    ]
  },
  {
    "id": "max",
    "nameEn": "MAX",
    "category": "stats",
    "exampleFormula": "=MAX(B2:B100)",
    "nameByLocale": {
      "es": "MAX",
      "en": "MAX",
      "de": "MAX",
      "fr": "MAX",
      "ja": "MAX",
      "pt": "MÁXIMO"
    },
    "descriptionByLocale": {
      "es": "Devuelve el valor numérico más grande de un conjunto de datos o rango de celdas.",
      "en": "Returns the largest numeric value in a dataset or range of cells.",
      "de": "Gibt den größten Zahlenwert in einer Menge oder einem Zellbereich zurück.",
      "fr": "Renvoie la valeur numérique la plus élevée d'un ensemble de données.",
      "ja": "対象のデータ範囲の中で最も大きい数値（最大値）を返します。",
      "pt": "Retorna o maior valor numérico de um conjunto de dados ou intervalo de células."
    },
    "syntaxByLocale": {
      "es": "=MAX(número1, [número2], ...)",
      "en": "=MAX(number1, [number2], ...)",
      "de": "=MAX(Zahl1; [Zahl2]; ...)",
      "fr": "=MAX(nombre1; [nombre2]; ...)",
      "ja": "=MAX(数値1, [数値2], ...)",
      "pt": "=MÁXIMO(número1; [número2]; ...)"
    },
    "exampleContextByLocale": {
      "es": "Encuentra la venta récord individual registrada durante el mes en la columna B.",
      "en": "Finds peak individual sales record during the month in column B.",
      "de": "Ermittelt den höchsten Einzelumsatz des Monats in Spalte B.",
      "fr": "Trouve la vente individuelle record du mois en colonne B.",
      "ja": "B列の月間売上記録の中から最高額を抽出します。",
      "pt": "Encontra o maior valor individual de vendas registrado no mês na coluna B."
    },
    "exampleResultByLocale": {
      "es": "$9,850.00",
      "en": "$9,850.00",
      "de": "9.850,00 €",
      "fr": "9 850,00 €",
      "ja": "¥98,500",
      "pt": "R$ 9.850,00"
    },
    "proTipByLocale": {
      "es": "Para encontrar el récord pero condicionado a un criterio (ej. solo de la sucursal Norte), usa MAX.SI.CONJUNTO.",
      "en": "To find maximum value conditionally (e.g. only for North branch), use MAXIFS.",
      "de": "Um den Höchstwert mit Kriterien zu ermitteln (z.B. nur Region Nord), nimm MAXWENNS.",
      "fr": "Pour trouver le record soumis à condition (ex: région Nord), utilisez MAX.SI.ENS.",
      "ja": "条件付き（例: 北部支社のみ）で最大値を求めるにはMAXIFS関数を使います。",
      "pt": "Para encontrar o recorde baseado em critérios (ex.: filial Norte), use MÁXIMOSES."
    },
    "tags": [
      "max",
      "maximo",
      "record",
      "pico",
      "estadistica"
    ]
  },
  {
    "id": "min",
    "nameEn": "MIN",
    "category": "stats",
    "exampleFormula": "=MIN(B2:B100)",
    "nameByLocale": {
      "es": "MIN",
      "en": "MIN",
      "de": "MIN",
      "fr": "MIN",
      "ja": "MIN",
      "pt": "MÍNIMO"
    },
    "descriptionByLocale": {
      "es": "Devuelve el valor numérico más bajo o menor de una serie de números o rango.",
      "en": "Returns the smallest numeric value in a series of numbers or range.",
      "de": "Gibt den kleinsten Zahlenwert in einem Bereich zurück.",
      "fr": "Renvoie la valeur numérique la plus basse d'une série.",
      "ja": "対象のデータ範囲の中で最も小さい数値（最小値）を返します。",
      "pt": "Retorna o menor valor numérico de uma série de dados ou intervalo."
    },
    "syntaxByLocale": {
      "es": "=MIN(número1, [número2], ...)",
      "en": "=MIN(number1, [number2], ...)",
      "de": "=MIN(Zahl1; [Zahl2]; ...)",
      "fr": "=MIN(nombre1; [nombre2]; ...)",
      "ja": "=MIN(数値1, [数値2], ...)",
      "pt": "=MÍNIMO(número1; [número2]; ...)"
    },
    "exampleContextByLocale": {
      "es": "Identifica el costo más bajo de compra cotizado por proveedores en la columna B.",
      "en": "Identifies lowest purchase cost quoted by suppliers in column B.",
      "de": "Ermittelt den günstigsten Lieferantenpreis in Spalte B.",
      "fr": "Identifie le coût d'achat le plus bas parmi les devis en colonne B.",
      "ja": "B列の見積もりの中から仕入れ最安値を特定します。",
      "pt": "Identifica o menor custo de aquisição cotado por fornecedores na coluna B."
    },
    "exampleResultByLocale": {
      "es": "$125.00",
      "en": "$125.00",
      "de": "125,00 €",
      "fr": "125,00 €",
      "ja": "¥12,500",
      "pt": "R$ 125,00"
    },
    "proTipByLocale": {
      "es": "Ignora celdas con texto o vacías automáticamente. Para ignorar ceros usa MIN.SI.CONJUNTO(B2:B100, B2:B100, \">0\").",
      "en": "Ignores text and blanks automatically. To exclude zeros, use MINIFS(B2:B100, B2:B100, \">0\").",
      "de": "Ignoriert Text und Leerzellen. Um Nullen auszuschließen, nimm MINWENNS(B2:B100; B2:B100; \">0\").",
      "fr": "Ignore textes et vides. Pour exclure les zéros: MIN.SI.ENS(B2:B100; B2:B100; \">0\").",
      "ja": "0を除外して最小値を求めたい場合は MINIFS(B2:B100, B2:B100, \">0\") を使います。",
      "pt": "Para ignorar o número zero ao buscar a menor cotação, use MÍNIMOSES(B2:B100; B2:B100; \">0\")."
    },
    "tags": [
      "min",
      "minimo",
      "menor",
      "costo",
      "estadistica"
    ]
  },
  {
    "id": "maxifs",
    "nameEn": "MAXIFS",
    "category": "stats",
    "exampleFormula": "=MAXIFS(C2:C50, A2:A50, \"Electrónica\", B2:B50, \">100\")",
    "nameByLocale": {
      "es": "MAX.SI.CONJUNTO",
      "en": "MAXIFS",
      "de": "MAXWENNS",
      "fr": "MAX.SI.ENS",
      "ja": "MAXIFS",
      "pt": "MÁXIMOSES"
    },
    "descriptionByLocale": {
      "es": "Devuelve el valor máximo de un rango que cumple con múltiples condiciones o criterios simultáneos.",
      "en": "Returns the maximum value among cells specified by a given set of conditions or criteria.",
      "de": "Gibt das Maximum aus einem Bereich zurück, das mehrere Kriterien gleichzeitig erfüllt.",
      "fr": "Renvoie la valeur maximale d'une plage respectant plusieurs critères simultanés.",
      "ja": "複数の条件に一致するセルの中から最大値を返します。",
      "pt": "Retorna o valor máximo em um intervalo que satisfaz múltiplos critérios simultâneos."
    },
    "syntaxByLocale": {
      "es": "=MAX.SI.CONJUNTO(rango_máximo, rango_criterio1, criterio1, ...)",
      "en": "=MAXIFS(max_range, criteria_range1, criteria1, ...)",
      "de": "=MAXWENNS(Max_Bereich; Kriterienbereich1; Kriterium1; ...)",
      "fr": "=MAX.SI.ENS(plage_max; plage_critères1; critère1; ...)",
      "ja": "=MAXIFS(最大範囲, 条件範囲1, 条件1, ...)",
      "pt": "=MÁXIMOSES(intervalo_máximo; intervalo_critérios1; critérios1; ...)"
    },
    "exampleContextByLocale": {
      "es": "Calcula la venta máxima de la categoría \"Electrónica\" con volumen superior a 100 unidades.",
      "en": "Finds top sale in \"Electronics\" category with volume above 100 units.",
      "de": "Ermittelt den Spitzenumsatz in \"Elektronik\" bei Stückzahlen über 100.",
      "fr": "Trouve la vente maximale en \"Électronique\" avec un volume supérieur à 100 unités.",
      "ja": "カテゴリ「家電」かつ販売数量100個超の最大売上額を取得します。",
      "pt": "Calcula a maior venda na categoria \"Eletrônicos\" com volume acima de 100 unidades."
    },
    "exampleResultByLocale": {
      "es": "$4,500.00",
      "en": "$4,500.00",
      "de": "4.500,00 €",
      "fr": "4 500,00 €",
      "ja": "¥45,000",
      "pt": "R$ 4.500,00"
    },
    "proTipByLocale": {
      "es": "El rango del que se extraerá el número máximo va SIEMPRE en el primer argumento.",
      "en": "Notice the range to evaluate for the maximum value is ALWAYS the very first parameter.",
      "de": "Der Wertebereich für das Maximum steht immer ganz am Anfang an erster Stelle.",
      "fr": "La plage contenant les valeurs maximales se place TOUJOURS en tout premier argument.",
      "ja": "最大値を抽出する対象の数値範囲は「必ず第1引数」に指定します。",
      "pt": "O intervalo do qual será extraído o valor máximo fica SEMPRE no primeiro argumento."
    },
    "tags": [
      "maxifs",
      "max.si.conjunto",
      "criterios",
      "condicional",
      "maximo"
    ]
  },
  {
    "id": "minifs",
    "nameEn": "MINIFS",
    "category": "stats",
    "exampleFormula": "=MINIFS(C2:C50, A2:A50, \"Norte\", C2:C50, \">0\")",
    "nameByLocale": {
      "es": "MIN.SI.CONJUNTO",
      "en": "MINIFS",
      "de": "MINWENNS",
      "fr": "MIN.SI.ENS",
      "ja": "MINIFS",
      "pt": "MÍNIMOSES"
    },
    "descriptionByLocale": {
      "es": "Devuelve el valor mínimo entre celdas que cumplen con una o más condiciones especificadas.",
      "en": "Returns the minimum value among cells specified by one or more criteria.",
      "de": "Gibt das Minimum der Zellen zurück, die mehrere angegebene Bedingungen erfüllen.",
      "fr": "Renvoie la valeur minimale respectant un ou plusieurs critères définis.",
      "ja": "指定された1つまたは複数の条件を満たすセルの中から最小値を返します。",
      "pt": "Retorna o menor valor entre as células que atendem a um ou mais critérios."
    },
    "syntaxByLocale": {
      "es": "=MIN.SI.CONJUNTO(rango_mínimo, rango_criterio1, criterio1, ...)",
      "en": "=MINIFS(min_range, criteria_range1, criteria1, ...)",
      "de": "=MINWENNS(Min_Bereich; Kriterienbereich1; Kriterium1; ...)",
      "fr": "=MIN.SI.ENS(plage_min; plage_critères1; critère1; ...)",
      "ja": "=MINIFS(最小範囲, 条件範囲1, 条件1, ...)",
      "pt": "=MÍNIMOSES(intervalo_mínimo; intervalo_critérios1; critérios1; ...)"
    },
    "exampleContextByLocale": {
      "es": "Determina el costo mínimo en la región \"Norte\" ignorando los ceros.",
      "en": "Finds minimum cost in \"North\" region while ignoring zero values.",
      "de": "Findet Mindestkosten in Region \"Nord\" ohne Nullwerte zu berücksichtigen.",
      "fr": "Trouve le coût minimum en région \"Nord\" en ignorant les zéros.",
      "ja": "「北」地域のデータで、0を除外した最小コストを算出します。",
      "pt": "Determina o menor custo na região \"Norte\" desconsiderando valores zerados."
    },
    "exampleResultByLocale": {
      "es": "$85.00",
      "en": "$85.00",
      "de": "85,00 €",
      "fr": "85,00 €",
      "ja": "¥8,500",
      "pt": "R$ 85,00"
    },
    "proTipByLocale": {
      "es": "Si ninguna celda cumple los criterios, devuelve 0 por defecto.",
      "en": "If no cells meet the specified criteria, it defaults to returning 0.",
      "de": "Wenn kein Datensatz den Kriterien entspricht, gibt MINWENNS standardmäßig 0 zurück.",
      "fr": "Si aucune cellule ne correspond aux critères, renvoie 0 par défaut.",
      "ja": "条件に一致するセルが1つもない場合、デフォルトで 0 が返されます。",
      "pt": "Se nenhuma linha atender aos critérios informados, o resultado será 0."
    },
    "tags": [
      "minifs",
      "min.si.conjunto",
      "criterios",
      "filtro",
      "minimo"
    ]
  },
  {
    "id": "median",
    "nameEn": "MEDIAN",
    "category": "stats",
    "exampleFormula": "=MEDIAN(B2:B100)",
    "nameByLocale": {
      "es": "MEDIANA",
      "en": "MEDIAN",
      "de": "MEDIAN",
      "fr": "MEDIANE",
      "ja": "MEDIAN",
      "pt": "MED"
    },
    "descriptionByLocale": {
      "es": "Devuelve la mediana o valor central de un conjunto de números (el punto donde el 50% queda arriba y el 50% abajo).",
      "en": "Returns the median or middle number in a set of numbers (50% above, 50% below).",
      "de": "Gibt den Median (Zentralwert) einer Zahlenreihe zurück.",
      "fr": "Renvoie la médiane d'un ensemble de nombres (la valeur du milieu).",
      "ja": "指定された数値群の中央値（メディアン: ちょうど真ん中の値）を返します。",
      "pt": "Retorna a mediana ou número central em um conjunto de dados."
    },
    "syntaxByLocale": {
      "es": "=MEDIANA(número1, [número2], ...)",
      "en": "=MEDIAN(number1, [number2], ...)",
      "de": "=MEDIAN(Zahl1; [Zahl2]; ...)",
      "fr": "=MEDIANE(nombre1; [nombre2]; ...)",
      "ja": "=MEDIAN(数値1, [数値2], ...)",
      "pt": "=MED(número1; [número2]; ...)"
    },
    "exampleContextByLocale": {
      "es": "Calcula el salario típico de la empresa sin que los sueldos millonarios de los directores distorsionen el promedio.",
      "en": "Finds typical company salary without executive multimillion salaries skewing the average.",
      "de": "Ermittelt das typische Gehalt, ohne durch Spitzengehälter verzerrt zu werden.",
      "fr": "Calcule le salaire médian sans distorsion due aux salaires des dirigeants.",
      "ja": "一部の高額役員報酬による歪みを排除して、真の中央値給与を算出します。",
      "pt": "Calcula o salário típico da equipe sem distorções causadas por salários de diretoria."
    },
    "exampleResultByLocale": {
      "es": "$2,800.00",
      "en": "$2,800.00",
      "de": "2.800,00 €",
      "fr": "2 800,00 €",
      "ja": "¥280,000",
      "pt": "R$ 2.800,00"
    },
    "proTipByLocale": {
      "es": "Mucho más confiable que el PROMEDIO cuando hay valores atípicos (outliers) extremos en los datos.",
      "en": "Far more reliable than AVERAGE when your dataset contains extreme outliers.",
      "de": "Deutlich aussagekräftiger als MITTELWERT bei extremen Ausreißern.",
      "fr": "Bien plus représentatif que la MOYENNE en présence de valeurs aberrantes extrêmes.",
      "ja": "極端な外れ値が含まれるデータでは、平均値(AVERAGE)よりも中央値が圧倒的に信頼できます。",
      "pt": "Muito mais confiável que a MÉDIA quando existem valores discrepantes extremos (outliers)."
    },
    "tags": [
      "median",
      "mediana",
      "central",
      "outliers",
      "estadistica"
    ]
  },
  {
    "id": "rank",
    "nameEn": "RANK.EQ",
    "category": "stats",
    "exampleFormula": "=RANK.EQ(B2, $B$2:$B$50, 0)",
    "nameByLocale": {
      "es": "JERARQUIA.EQV",
      "en": "RANK.EQ",
      "de": "RANG.GLEICH",
      "fr": "RANG.EQ",
      "ja": "RANK.EQ",
      "pt": "ORDEM.EQ"
    },
    "descriptionByLocale": {
      "es": "Devuelve la posición o ranking jerárquico de un número dentro de una lista de valores.",
      "en": "Returns the statistical ranking of a number within a list of values.",
      "de": "Gibt den Rang einer Zahl in einer Liste von Zahlen zurück.",
      "fr": "Renvoie le rang d'un nombre dans une liste de valeurs.",
      "ja": "数値のリスト内での指定した値の順位（ランキング）を返します。",
      "pt": "Retorna a posição estatística ou ranking de um número dentro de uma lista."
    },
    "syntaxByLocale": {
      "es": "=JERARQUIA.EQV(número, referencia, [orden])",
      "en": "=RANK.EQ(number, ref, [order])",
      "de": "=RANG.GLEICH(Zahl; Bezug; [Reihenfolge])",
      "fr": "=RANG.EQ(nombre; référence; [ordre])",
      "ja": "=RANK.EQ(数値, 参照, [順序])",
      "pt": "=ORDEM.EQ(número; ref; [ordem])"
    },
    "exampleContextByLocale": {
      "es": "Calcula el puesto de ventas del empleado (1º, 2º, 3º...) comparando su venta en B2 contra todo el equipo.",
      "en": "Calculates sales leaderboard position (1st, 2nd, 3rd...) of employee in B2 against team.",
      "de": "Ermittelt den Ranglistenplatz (1., 2., 3...) des Verkäufers in B2 im Team.",
      "fr": "Détermine le classement commercial (1er, 2e, 3e...) de l'employé en B2 par rapport à l'équipe.",
      "ja": "B2の営業マンの売上がチーム全体で何位（1位、2位、3位…）かを計算します。",
      "pt": "Calcula o ranking de vendas do vendedor (1º, 2º, 3º...) em B2 frente à equipe."
    },
    "exampleResultByLocale": {
      "es": "3",
      "en": "3",
      "de": "3",
      "fr": "3",
      "ja": "3",
      "pt": "3"
    },
    "proTipByLocale": {
      "es": "¡Fija siempre la referencia con signos de dólar ($B$2:$B$50) para que el rango de comparación no se mueva al arrastrar!",
      "en": "Always lock the reference range with dollar signs ($B$2:$B$50) when copying down!",
      "de": "Fixiere den Bereich immer mit Dollarzeichen ($B$2:$B$50) beim Runterkopieren!",
      "fr": "Verrouillez toujours la plage avec des dollars ($B$2:$B$50) avant d'étirer !",
      "ja": "下方向に数式をコピーする際は必ず $B$2:$B$50 のように絶対参照で固定しましょう！",
      "pt": "Sempre trave o intervalo de referência com cifrões ($B$2:$B$50) ao arrastar a fórmula!"
    },
    "tags": [
      "rank",
      "jerarquia",
      "posicion",
      "clasificacion",
      "lideres"
    ]
  },
  {
    "id": "date",
    "nameEn": "DATE",
    "category": "date",
    "exampleFormula": "=DATE(2026, 12, 31)",
    "nameByLocale": {
      "es": "FECHA",
      "en": "DATE",
      "de": "DATUM",
      "fr": "DATE",
      "ja": "DATE",
      "pt": "DATA"
    },
    "descriptionByLocale": {
      "es": "Construye un número de serie de fecha válido a partir de valores separados de año, mes y día.",
      "en": "Constructs a valid serial date number from separate year, month, and day components.",
      "de": "Erstellt ein gültiges Excel-Datum aus getrennten Werten für Jahr, Monat und Tag.",
      "fr": "Crée une date valide à partir de composants année, mois et jour distincts.",
      "ja": "年、月、日の数値を組み合わせて、有効なExcel日付シリアル値を生成します。",
      "pt": "Gera um número de série de data válido a partir de valores separados de ano, mês e dia."
    },
    "syntaxByLocale": {
      "es": "=FECHA(año, mes, día)",
      "en": "=DATE(year, month, day)",
      "de": "=DATUM(Jahr; Monat; Tag)",
      "fr": "=DATE(année; mois; jour)",
      "ja": "=DATE(年, 月, 日)",
      "pt": "=DATA(ano; mês; dia)"
    },
    "exampleContextByLocale": {
      "es": "Genera la fecha formal de fin de año 2026 uniendo 2026, 12 y 31.",
      "en": "Generates formal year-end 2026 date joining 2026, 12, and 31.",
      "de": "Erstellt das Jahresabschlussdatum 2026 aus 2026, 12 und 31.",
      "fr": "Génère la date de fin d'année en combinant 2026, 12 et 31.",
      "ja": "2026年、12月、31日の3つの数値を結合して正式な日付を作成します。",
      "pt": "Gera a data formal de encerramento unindo ano 2026, mês 12 e dia 31."
    },
    "exampleResultByLocale": {
      "es": "31/12/2026",
      "en": "12/31/2026",
      "de": "31.12.2026",
      "fr": "31/12/2026",
      "ja": "2026/12/31",
      "pt": "31/12/2026"
    },
    "proTipByLocale": {
      "es": "Evita inconsistencias regionales donde \"05/06/2026\" se confunde entre mayo 6 o junio 5. FECHA nunca falla.",
      "en": "Prevents regional ambiguity where \"05/06\" gets flipped between May 6 and June 5. DATE is 100% reliable.",
      "de": "Verhindert regionale Verwechslungen zwischen Tag und Monat. DATUM ist absolut feuersicher.",
      "fr": "Évite les confusions régionales entre jour et mois. DATE est 100% fiable.",
      "ja": "国ごとの月日表記順の違いによる誤認識を完全に防げるため、日付生成で最も安全です。",
      "pt": "Evita conflitos de formato regional (dia/mês vs mês/dia). DATA é 100% segura."
    },
    "tags": [
      "date",
      "fecha",
      "dia",
      "mes",
      "ano"
    ]
  },
  {
    "id": "year",
    "nameEn": "YEAR",
    "category": "date",
    "exampleFormula": "=YEAR(A2)",
    "nameByLocale": {
      "es": "AÑO",
      "en": "YEAR",
      "de": "JAHR",
      "fr": "ANNEE",
      "ja": "YEAR",
      "pt": "ANO"
    },
    "descriptionByLocale": {
      "es": "Extrae el año (número entero de 4 dígitos entre 1900 y 9999) correspondiente a una fecha.",
      "en": "Extracts the year (a 4-digit integer from 1900 to 9999) corresponding to a given date.",
      "de": "Gibt das vierstellige Jahr eines Datums zurück (1900 bis 9999).",
      "fr": "Renvoie l'année (entier à 4 chiffres) correspondant à une date donnée.",
      "ja": "指定した日付に対応する4桁の年（西暦）を取り出します。",
      "pt": "Retorna o ano (número de 4 dígitos entre 1900 e 9999) correspondente a uma data."
    },
    "syntaxByLocale": {
      "es": "=AÑO(núm_de_serie)",
      "en": "=YEAR(serial_number)",
      "de": "=JAHR(Zahl)",
      "fr": "=ANNEE(numéro_de_série)",
      "ja": "=YEAR(シリアル値)",
      "pt": "=ANO(núm_série)"
    },
    "exampleContextByLocale": {
      "es": "Obtiene el año de contratación a partir de la fecha de alta en A2 (ej. 15/03/2021).",
      "en": "Extracts hire year from employee start date in A2 (e.g. 03/15/2021).",
      "de": "Ermittelt das Einstellungsjahr aus dem Eintrittsdatum in A2.",
      "fr": "Extrait l'année d'embauche à partir de la date d'entrée en A2.",
      "ja": "A2セルの入社年月日(例: 2021/03/15)から入社年を抽出します。",
      "pt": "Extrai o ano de contratação a partir da data de admissão em A2."
    },
    "exampleResultByLocale": {
      "es": "2021",
      "en": "2021",
      "de": "2021",
      "fr": "2021",
      "ja": "2021",
      "pt": "2021"
    },
    "proTipByLocale": {
      "es": "Combínalo con HOY para calcular antigüedad dinámica: =AÑO(HOY())-AÑO(A2).",
      "en": "Combine with TODAY to calculate dynamic tenure in years: =YEAR(TODAY())-YEAR(A2).",
      "de": "Kombiniere es mit HEUTE für die Betriebszugehörigkeit: =JAHR(HEUTE())-JAHR(A2).",
      "fr": "Combinez avec AUJOURDHUI pour calculer l'ancienneté: =ANNEE(AUJOURDHUI())-ANNEE(A2).",
      "ja": "=YEAR(TODAY())-YEAR(A2) で勤続年数を自動計算できます。",
      "pt": "Combine com HOJE() para calcular anos de casa automaticamente: =ANO(HOJE())-ANO(A2)."
    },
    "tags": [
      "year",
      "ano",
      "fecha",
      "antiguedad",
      "periodo"
    ]
  },
  {
    "id": "month",
    "nameEn": "MONTH",
    "category": "date",
    "exampleFormula": "=MONTH(A2)",
    "nameByLocale": {
      "es": "MES",
      "en": "MONTH",
      "de": "MONAT",
      "fr": "MOIS",
      "ja": "MONTH",
      "pt": "MÊS"
    },
    "descriptionByLocale": {
      "es": "Devuelve el mes de una fecha, expresado como un número entero del 1 (enero) al 12 (diciembre).",
      "en": "Returns the month of a date as an integer ranging from 1 (January) to 12 (December).",
      "de": "Gibt den Monat eines Datums als Zahl von 1 (Januar) bis 12 (Dezember) zurück.",
      "fr": "Renvoie le mois d'une date sous forme d'entier de 1 (janvier) à 12 (décembre).",
      "ja": "日付の月を 1（1月）から 12（12月）の整数として取得します。",
      "pt": "Retorna o mês de uma data, representado por um número inteiro de 1 (janeiro) a 12 (dezembro)."
    },
    "syntaxByLocale": {
      "es": "=MES(núm_de_serie)",
      "en": "=MONTH(serial_number)",
      "de": "=MONAT(Zahl)",
      "fr": "=MOIS(numéro_de_série)",
      "ja": "=MONTH(シリアル値)",
      "pt": "=MÊS(núm_série)"
    },
    "exampleContextByLocale": {
      "es": "Agrupa transacciones por número de mes a partir de su marca de tiempo en A2.",
      "en": "Groups invoice transactions by month number based on timestamp in A2.",
      "de": "Gruppiert Rechnungsbuchungen nach Monat anhand des Datums in A2.",
      "fr": "Regroupe les factures par numéro de mois à partir de la date en A2.",
      "ja": "A2の日付から請求書の対象月（1〜12）を抽出して集計します。",
      "pt": "Agrupa transações pelo número do mês a partir da data informada em A2."
    },
    "exampleResultByLocale": {
      "es": "11",
      "en": "11",
      "de": "11",
      "fr": "11",
      "ja": "11",
      "pt": "11"
    },
    "proTipByLocale": {
      "es": "Si deseas el nombre del mes en texto (ej. \"noviembre\"), usa =TEXTO(A2, \"mmmm\") en lugar de MES.",
      "en": "If you need the spelled-out month name (e.g. \"November\"), use =TEXT(A2, \"mmmm\") instead.",
      "de": "Für den Monatsnamen als Text (\"November\") nimm =TEXT(A2; \"MMMM\").",
      "fr": "Pour obtenir le nom du mois (\"novembre\"), préférez =TEXTE(A2; \"mmmm\").",
      "ja": "「11月」や「November」と文字列で欲しい場合は =TEXT(A2, \"mmmm\") を使います。",
      "pt": "Para exibir o nome por extenso (ex: \"novembro\"), use =TEXTO(A2; \"mmmm\")."
    },
    "tags": [
      "month",
      "mes",
      "fecha",
      "calendario",
      "periodo"
    ]
  },
  {
    "id": "day",
    "nameEn": "DAY",
    "category": "date",
    "exampleFormula": "=DAY(A2)",
    "nameByLocale": {
      "es": "DIA",
      "en": "DAY",
      "de": "TAG",
      "fr": "JOUR",
      "ja": "DAY",
      "pt": "DIA"
    },
    "descriptionByLocale": {
      "es": "Devuelve el día del mes correspondiente a una fecha dada (número del 1 al 31).",
      "en": "Returns the day of the month for a given date (integer from 1 to 31).",
      "de": "Gibt den Tag des Monats für ein Datum zurück (Zahl von 1 bis 31).",
      "fr": "Renvoie le jour du mois pour une date donnée (nombre de 1 à 31).",
      "ja": "日付に対応する月の日（1〜31の整数）を返します。",
      "pt": "Retorna o dia do mês para uma determinada data (número de 1 a 31)."
    },
    "syntaxByLocale": {
      "es": "=DIA(núm_de_serie)",
      "en": "=DAY(serial_number)",
      "de": "=TAG(Zahl)",
      "fr": "=JOUR(numéro_de_série)",
      "ja": "=DAY(シリアル値)",
      "pt": "=DIA(núm_série)"
    },
    "exampleContextByLocale": {
      "es": "Determina qué día del mes se emitió la factura en A2.",
      "en": "Determines what calendar day of the month an invoice was issued in A2.",
      "de": "Ermittelt den Kalendertag des Rechnungsdatums in A2.",
      "fr": "Détermine le jour d'émission d'une facture en A2.",
      "ja": "A2の請求書発行日から何日（日付け）かを割り出します。",
      "pt": "Determina qual dia do mês a fatura foi emitida em A2."
    },
    "exampleResultByLocale": {
      "es": "15",
      "en": "15",
      "de": "15",
      "fr": "15",
      "ja": "15",
      "pt": "15"
    },
    "proTipByLocale": {
      "es": "Para obtener el día de la semana (si es lunes o sábado), usa DIASEM en su lugar.",
      "en": "To know what weekday it falls on (e.g. Monday vs Saturday), use WEEKDAY instead.",
      "de": "Für den Wochentag (Montag, Samstag etc.) nutze die Funktion WOCHENTAG.",
      "fr": "Pour connaître le jour de la semaine (lundi, samedi), utilisez JOURSEM.",
      "ja": "曜日（月曜日、土曜日など）を調べたい場合はWEEKDAY関数を使用します。",
      "pt": "Para saber o dia da semana (segunda, sábado, etc.), use DIA.DA.SEMANA."
    },
    "tags": [
      "day",
      "dia",
      "calendario",
      "fecha",
      "numero"
    ]
  },
  {
    "id": "datedif",
    "nameEn": "DATEDIF",
    "category": "date",
    "exampleFormula": "=DATEDIF(A2, TODAY(), \"Y\")",
    "nameByLocale": {
      "es": "SIFECHA",
      "en": "DATEDIF",
      "de": "DATEDIF",
      "fr": "DATEDIF",
      "ja": "DATEDIF",
      "pt": "DATADIF"
    },
    "descriptionByLocale": {
      "es": "Calcula la diferencia exacta entre dos fechas en años (\"Y\"), meses (\"M\") o días (\"D\").",
      "en": "Calculates exact difference between two dates in years (\"Y\"), months (\"M\"), or days (\"D\").",
      "de": "Berechnet die genaue Differenz zwischen zwei Daten in Jahren (\"Y\"), Monaten (\"M\") oder Tagen (\"D\").",
      "fr": "Calcule la différence exacte entre deux dates en années (\"Y\"), mois (\"M\") ou jours (\"D\").",
      "ja": "2つの日付の間の正確な差を年数(\"Y\")、月数(\"M\")、日数(\"D\")で計算します。",
      "pt": "Calcula a diferença exata entre duas datas em anos (\"Y\"), meses (\"M\") ou dias (\"D\")."
    },
    "syntaxByLocale": {
      "es": "=SIFECHA(fecha_inicial, fecha_final, unidad)",
      "en": "=DATEDIF(start_date, end_date, unit)",
      "de": "=DATEDIF(Ausgangsdatum; Enddatum; Einheit)",
      "fr": "=DATEDIF(date_début; date_fin; unité)",
      "ja": "=DATEDIF(開始日, 終了日, 単位)",
      "pt": "=DATADIF(data_inicial; data_final; unidade)"
    },
    "exampleContextByLocale": {
      "es": "Calcula los años cumplidos de edad a partir de la fecha de nacimiento en A2.",
      "en": "Calculates completed full years of age based on birthdate in A2.",
      "de": "Berechnet das vollendete Lebensalter anhand des Geburtsdatums in A2.",
      "fr": "Calcule l'âge révolu en années à partir de la date de naissance en A2.",
      "ja": "A2の生年月日から現在までの満年齢（満何歳か）を計算します。",
      "pt": "Calcula a idade exata em anos completos a partir da data de nascimento em A2."
    },
    "exampleResultByLocale": {
      "es": "28",
      "en": "28",
      "de": "28",
      "fr": "28",
      "ja": "28",
      "pt": "28"
    },
    "proTipByLocale": {
      "es": "¡La fórmula secreta de Excel! No aparece en el menú desplegable de autocompletado pero funciona al 100% en todas las versiones.",
      "en": "Excel's hidden gem! Doesn't show in autocomplete tooltips but works 100% across all Excel editions.",
      "de": "Excels Geheimtipp! Erscheint nicht im Autocomplete, funktioniert aber überall perfekt.",
      "fr": "La fonction secrète d'Excel ! Non suggérée dans l'autocomplétion mais active partout.",
      "ja": "関数の入力候補には表示されませんが、すべてのExcelで動作する有名な隠し関数です。",
      "pt": "A função secreta do Excel! Não aparece no autocompletar, mas funciona perfeitamente."
    },
    "tags": [
      "datedif",
      "sifecha",
      "edad",
      "antiguedad",
      "diferencia"
    ]
  },
  {
    "id": "weekday",
    "nameEn": "WEEKDAY",
    "category": "date",
    "exampleFormula": "=WEEKDAY(A2, 2)",
    "nameByLocale": {
      "es": "DIASEM",
      "en": "WEEKDAY",
      "de": "WOCHENTAG",
      "fr": "JOURSEM",
      "ja": "WEEKDAY",
      "pt": "DIA.DA.SEMANA"
    },
    "descriptionByLocale": {
      "es": "Devuelve un número del 1 al 7 que representa el día de la semana de una fecha.",
      "en": "Returns a number from 1 to 7 identifying the day of the week for a date.",
      "de": "Gibt eine Zahl von 1 bis 7 zurück, die den Wochentag eines Datums angibt.",
      "fr": "Renvoie un nombre de 1 à 7 identifiant le jour de la semaine.",
      "ja": "日付に対応する曜日を 1〜7 の数値として返します。",
      "pt": "Retorna um número de 1 a 7 que indica o dia da semana de uma data."
    },
    "syntaxByLocale": {
      "es": "=DIASEM(núm_de_serie, [tipo])",
      "en": "=WEEKDAY(serial_number, [return_type])",
      "de": "=WOCHENTAG(Zahl; [Typ])",
      "fr": "=JOURSEM(numéro_de_série; [type_retour])",
      "ja": "=WEEKDAY(シリアル値, [種類])",
      "pt": "=DIA.DA.SEMANA(núm_série; [retornar_tipo])"
    },
    "exampleContextByLocale": {
      "es": "Identifica el día de la semana con tipo 2 (donde 1=Lunes y 7=Domingo).",
      "en": "Identifies day of the week using return type 2 (where 1=Monday and 7=Sunday).",
      "de": "Bestimmt den Wochentag mit Typ 2 (1=Montag bis 7=Sonntag).",
      "fr": "Identifie le jour de la semaine avec le type 2 (1=lundi à 7=dimanche).",
      "ja": "種類に「2」を指定して、月曜=1 〜 日曜=7 で曜日番号を判定します。",
      "pt": "Identifica o dia da semana com o tipo 2 (onde 1=Segunda e 7=Domingo)."
    },
    "exampleResultByLocale": {
      "es": "3",
      "en": "3",
      "de": "3",
      "fr": "3",
      "ja": "3",
      "pt": "3"
    },
    "proTipByLocale": {
      "es": "Usa tipo 2: si el resultado es >5 significa que cayó en fin de semana (sábado o domingo). ¡Ideal para filtros y alertas!",
      "en": "With return_type 2, if the result is > 5 it falls on a weekend! Great for validation rules.",
      "de": "Bei Typ 2 bedeutet ein Wert > 5 Wochenende (Samstag oder Sonntag). Perfekt für Wecker und Filter!",
      "fr": "Avec le type 2, une valeur > 5 indique un week-end ! Idéal pour les alertes de plannings.",
      "ja": "種類を 2 に設定すれば、結果が >5 の場合に「週末（土日）」と簡単に判別できます。",
      "pt": "Com o tipo 2, valores > 5 indicam finais de semana (sábado/domingo). Ideal para validações."
    },
    "tags": [
      "weekday",
      "diasem",
      "semana",
      "lunes",
      "findesemana"
    ]
  },
  {
    "id": "pv",
    "nameEn": "PV",
    "category": "financial",
    "exampleFormula": "=PV(6%/12, 360, -1200)",
    "nameByLocale": {
      "es": "VA",
      "en": "PV",
      "de": "BW",
      "fr": "VA",
      "ja": "PV",
      "pt": "VP"
    },
    "descriptionByLocale": {
      "es": "Calcula el Valor Actual (capital presente) de un préstamo o inversión basándose en pagos periódicos constantes.",
      "en": "Calculates the Present Value (lump sum worth) of a series of future constant payments.",
      "de": "Berechnet den Barwert (Gegenwartswert) einer Reihe zukünftiger Zahlungen.",
      "fr": "Calcule la Valeur Actuelle d'un emprunt ou investissement sur la base de versements constants.",
      "ja": "一連の将来の支払いが現時点でいくらの価値があるか（現在価値: PV）を算出します。",
      "pt": "Calcula o Valor Presente (capital atual) de uma série de pagamentos futuros constantes."
    },
    "syntaxByLocale": {
      "es": "=VA(tasa, nper, pago, [vf], [tipo])",
      "en": "=PV(rate, nper, pmt, [fv], [type])",
      "de": "=BW(Zins; Zzr; Rmz; [Zw]; [F])",
      "fr": "=VA(taux; npm; vpm; [vc]; [type])",
      "ja": "=PV(利率, 期間, 定期支払額, [将来価値], [支払期日])",
      "pt": "=VP(taxa; nper; pgto; [vf]; [tipo])"
    },
    "exampleContextByLocale": {
      "es": "Calcula cuánto capital te presta el banco para una hipoteca a 30 años (360 meses) si puedes pagar $1,200/mes al 6% anual.",
      "en": "Calculates total mortgage loan you qualify for with $1,200/mo payment at 6% annual over 30 years.",
      "de": "Berechnet Darlehenssumme für eine Baufinanzierung bei 1.200 € monatlicher Rate zu 6% über 30 Jahre.",
      "fr": "Calcule le montant du prêt immobilier pour des mensualités de 1 200 € à 6% sur 30 ans.",
      "ja": "年利6%・30年返済（360回）で毎月1,200ドル返済できる場合の借入可能額を計算します。",
      "pt": "Calcula o valor do financiamento aprovado para parcelas de R$ 1.200/mês a 6% ao ano em 30 anos."
    },
    "exampleResultByLocale": {
      "es": "$200,151.04",
      "en": "$200,151.04",
      "de": "200.151,04 €",
      "fr": "200 151,04 €",
      "ja": "¥20,015,104",
      "pt": "R$ 200.151,04"
    },
    "proTipByLocale": {
      "es": "Recuerda la regla de oro financiera: las salidas de dinero (pagos) deben ingresarse con signo negativo (-1200).",
      "en": "Financial sign convention: cash outflows (payments made) must be entered as negative (-1200).",
      "de": "Finanzmathematische Vorzeichenregel: Auszahlungen (Raten) immer mit Minuszeichen eingeben (-1200).",
      "fr": "Règle financière: les décaissements (paiements) doivent impérativement être négatifs (-1200).",
      "ja": "財務関数の原則: 手元から出ていく支払いキャッシュフローはマイナス(-1200)で指定します。",
      "pt": "Regra contábil do Excel: saídas de caixa (pagamentos) devem ser negativas (-1200)."
    },
    "tags": [
      "pv",
      "va",
      "prestamo",
      "hipoteca",
      "finanzas"
    ]
  },
  {
    "id": "rate",
    "nameEn": "RATE",
    "category": "financial",
    "exampleFormula": "=RATE(48, -350, 14000)*12",
    "nameByLocale": {
      "es": "TASA",
      "en": "RATE",
      "de": "ZINS",
      "fr": "TAUX",
      "ja": "RATE",
      "pt": "TAXA"
    },
    "descriptionByLocale": {
      "es": "Devuelve la tasa de interés por período de un préstamo o anualidad.",
      "en": "Returns the interest rate per period of a loan or annuity.",
      "de": "Gibt die periodische Zinssatzhöhe eines Kredits oder einer Annuität zurück.",
      "fr": "Renvoie le taux d'intérêt par période d'un emprunt ou d'une rente.",
      "ja": "借入金または年金の1期間あたりの実質利率を算出します。",
      "pt": "Retorna a taxa de juros por período de um empréstimo ou anuidade."
    },
    "syntaxByLocale": {
      "es": "=TASA(nper, pago, va, [vf], [tipo], [estimar])",
      "en": "=RATE(nper, pmt, pv, [fv], [type], [guess])",
      "de": "=ZINS(Zzr; Rmz; Bw; [Zw]; [F]; [Schätzwert])",
      "fr": "=TAUX(npm; vpm; va; [vc]; [type]; [estimation])",
      "ja": "=RATE(期間, 定期支払額, 現在価値, [将来価値], [支払期日], [推定値])",
      "pt": "=TAXA(nper; pgto; vp; [vf]; [tipo]; [estimativa])"
    },
    "exampleContextByLocale": {
      "es": "Descubre la tasa anual real de un crédito de auto de $14,000 pagando $350/mes durante 48 meses.",
      "en": "Discovers effective annual interest rate of a $14,000 car loan paying $350/mo for 48 months.",
      "de": "Ermittelt den effektiven Jahreszins eines 14.000 € Autokredits bei 48 Monatsraten zu 350 €.",
      "fr": "Découvre le taux annuel réel d'un crédit auto de 14 000 € remboursé en 48 mensualités de 350 €.",
      "ja": "14,000ドルの自動車ローンを月350ドル×48回で返済する場合の実質年利を逆算します。",
      "pt": "Descobre a taxa de juros anual de um empréstimo de R$ 14.000 pago em 48 parcelas de R$ 350."
    },
    "exampleResultByLocale": {
      "es": "9.24%",
      "en": "9.24%",
      "de": "9,24%",
      "fr": "9,24%",
      "ja": "9.24%",
      "pt": "9,24%"
    },
    "proTipByLocale": {
      "es": "TASA devuelve la tasa periódica (mensual). Multiplícala por 12 al final para obtener la Tasa Anual Equivalente (TAE).",
      "en": "RATE returns the monthly rate. Multiply by 12 at the end to get the Annual Percentage Rate (APR).",
      "de": "ZINS liefert den Monatszins. Für den Jahreszins am Ende einfach mit 12 multiplizieren.",
      "fr": "TAUX renvoie un taux mensuel. Multipliez par 12 pour obtenir le taux annuel global (TAEG).",
      "ja": "月次計算の場合の返り値は月利です。年利（APR）を求めるには末尾で *12 します。",
      "pt": "TAXA retorna a taxa mensal. Multiplique por 12 no final para obter a taxa anual (CET)."
    },
    "tags": [
      "rate",
      "tasa",
      "interes",
      "tae",
      "credito"
    ]
  },
  {
    "id": "nper",
    "nameEn": "NPER",
    "category": "financial",
    "exampleFormula": "=NPER(6%/12, -250, 10000)",
    "nameByLocale": {
      "es": "NPER",
      "en": "NPER",
      "de": "ZZR",
      "fr": "NPM",
      "ja": "NPER",
      "pt": "NPER"
    },
    "descriptionByLocale": {
      "es": "Calcula el número de períodos (meses o cuotas) necesarios para liquidar una deuda o alcanzar una meta de ahorro.",
      "en": "Calculates the number of periods (months/payments) needed to pay off a loan or reach a savings target.",
      "de": "Berechnet die Anzahl der Zahlungsperioden zur Tilgung eines Kredits oder Erreichung eines Sparziels.",
      "fr": "Calcule le nombre de périodes (mois/remboursements) nécessaires pour solder un prêt.",
      "ja": "借入金の完済または目標貯蓄額の達成に必要な支払期間数（月数や回数）を求めます。",
      "pt": "Calcula o número de períodos (meses/parcelas) necessários para liquidar uma dívida."
    },
    "syntaxByLocale": {
      "es": "=NPER(tasa, pago, va, [vf], [tipo])",
      "en": "=NPER(rate, pmt, pv, [fv], [type])",
      "de": "=ZZR(Zins; Rmz; Bw; [Zw]; [F])",
      "fr": "=NPM(taux; vpm; va; [vc]; [type])",
      "ja": "=NPER(利率, 定期支払額, 現在価値, [将来価値], [支払期日])",
      "pt": "=NPER(taxa; pgto; vp; [vf]; [tipo])"
    },
    "exampleContextByLocale": {
      "es": "Calcula cuántos meses tardarás en pagar una deuda de $10,000 si abonas $250 cada mes al 6% de interés.",
      "en": "Calculates months needed to pay off $10,000 debt by paying $250/mo at 6% interest.",
      "de": "Ermittelt, wie viele Monate man zur Tilgung von 10.000 € bei 250 € Rate und 6% Zins benötigt.",
      "fr": "Calcule le nombre de mois pour rembourser 10 000 € en payant 250 € par mois à 6%.",
      "ja": "残高10,000ドルの借金を年利6%・月250ドル返済で完済するまでの月数を計算します。",
      "pt": "Calcula quantos meses levará para quitar uma dívida de R$ 10.000 pagando R$ 250/mês a 6% ao ano."
    },
    "exampleResultByLocale": {
      "es": "44.8 meses",
      "en": "44.8 months",
      "de": "44,8 Monate",
      "fr": "44,8 mois",
      "ja": "44.8ヶ月",
      "pt": "44,8 meses"
    },
    "proTipByLocale": {
      "es": "Si el pago mensual no cubre ni los intereses devengados, la fórmula devolverá error #¡NUM! indicando deuda impagable.",
      "en": "If your payment doesn't even cover the interest accrued, NPER returns #NUM! indicating infinite debt.",
      "de": "Deckt die Rate nicht einmal die Zinsen, erscheint #ZAHL! als Zeichen ewiger Verschuldung.",
      "fr": "Si la mensualité ne couvre pas les intérêts, NPM renvoie #NOMBRE! (dette perpétuelle).",
      "ja": "返済額が利息分を下回っている場合、完済できないため #NUM! エラーになります。",
      "pt": "Se o valor da parcela não cobrir nem os juros gerados, a fórmula dará erro #NÚM!."
    },
    "tags": [
      "nper",
      "periodos",
      "meses",
      "cuotas",
      "amortizacion"
    ]
  }
];

export const EXCEL_SHORTCUTS_DATA: ExcelShortcutDoc[] = [
  {
    "id": "toggle_absolute",
    "keysWindows": [
      "F4"
    ],
    "keysMac": [
      "Cmd",
      "T"
    ],
    "actionByLocale": {
      "es": "Fijar referencia absoluta ($A$1)",
      "en": "Toggle absolute cell reference ($A$1)",
      "de": "Absolute Zellbezüge fixieren ($A$1)",
      "fr": "Basculer en référence absolue ($A$1)",
      "ja": "絶対参照を切り替える ($A$1)",
      "pt": "Alternar referência absoluta ($A$1)"
    },
    "categoryByLocale": {
      "es": "Fórmulas",
      "en": "Formulas",
      "de": "Formeln",
      "fr": "Formules",
      "ja": "数式",
      "pt": "Fórmulas"
    },
    "tipByLocale": {
      "es": "Alterna cíclicamente: A1 → $A$1 → A$1 → $A1 → A1. ¡Vital para fijar rangos!",
      "en": "Cycles through: A1 → $A$1 → A$1 → $A1 → A1. Essential when dragging formulas!",
      "de": "Wechselt durch: A1 → $A$1 → A$1 → $A1 → A1. Unverzichtbar beim Ziehen von Formeln!",
      "fr": "Bascule cycliquement : A1 → $A$1 → A$1 → $A1 → A1. Vital pour figer les plages !",
      "ja": "押すたびに循環: A1 → $A$1 → A$1 → $A1 → A1。数式コピーの必須技です！",
      "pt": "Alterna em ciclo: A1 → $A$1 → A$1 → $A1 → A1. Vital para travar intervalos!"
    }
  },
  {
    "id": "autosum",
    "keysWindows": [
      "Alt",
      "="
    ],
    "keysMac": [
      "Cmd",
      "Shift",
      "T"
    ],
    "actionByLocale": {
      "es": "Autosuma instantánea",
      "en": "Instant AutoSum",
      "de": "Automatische Summe einfügen",
      "fr": "Somme automatique instantanée",
      "ja": "オートSUMの即時挿入",
      "pt": "Autosoma instantânea"
    },
    "categoryByLocale": {
      "es": "Fórmulas",
      "en": "Formulas",
      "de": "Formeln",
      "fr": "Formules",
      "ja": "数式",
      "pt": "Fórmulas"
    },
    "tipByLocale": {
      "es": "Detecta automáticamente el bloque numérico contiguo y escribe la fórmula SUMA completa.",
      "en": "Automatically detects the contiguous numeric block and writes the full SUM formula.",
      "de": "Erkennt angrenzende Zahlen automatisch und schreibt die komplette SUMME-Formel.",
      "fr": "Détecte automatiquement les nombres adjacents et écrit la formule SOMME complète.",
      "ja": "隣接する数値セルを自動認識し、完全なSUM関数を一発で入力します。",
      "pt": "Detecta automaticamente os números adjacentes e digita a fórmula SOMA completa."
    }
  },
  {
    "id": "toggle_filters",
    "keysWindows": [
      "Ctrl",
      "Shift",
      "L"
    ],
    "keysMac": [
      "Cmd",
      "Shift",
      "F"
    ],
    "actionByLocale": {
      "es": "Activar / Desactivar Filtros",
      "en": "Toggle AutoFilters on/off",
      "de": "Filter ein- / ausschalten",
      "fr": "Activer / Désactiver les filtres",
      "ja": "オートフィルターのオン/オフ切替",
      "pt": "Ativar / Desativar Filtros"
    },
    "categoryByLocale": {
      "es": "Navegación",
      "en": "Navigation",
      "de": "Navigation",
      "fr": "Navigation",
      "ja": "ナビゲーション",
      "pt": "Navegação"
    },
    "tipByLocale": {
      "es": "Coloca las flechitas desplegables en los encabezados sin tocar el ratón.",
      "en": "Adds or removes the dropdown filter arrows in the headers without touching the mouse.",
      "de": "Aktiviert oder entfernt Filterpfeile in den Kopfzeilen ohne Maus.",
      "fr": "Ajoute ou retire les flèches de filtrage des en-têtes sans toucher à la souris.",
      "ja": "マウスに触れることなく、見出し行にフィルターのプルダウン矢印を設置/解除できます。",
      "pt": "Coloca as setas de filtro nos cabeçalhos sem precisar tocar no mouse."
    }
  },
  {
    "id": "create_table",
    "keysWindows": [
      "Ctrl",
      "T"
    ],
    "keysMac": [
      "Cmd",
      "T"
    ],
    "actionByLocale": {
      "es": "Crear Tabla oficial de Excel",
      "en": "Create official Excel Table",
      "de": "Offizielle Excel-Tabelle erstellen",
      "fr": "Créer un tableau Excel officiel",
      "ja": "Excelテーブルを作成",
      "pt": "Criar Tabela oficial do Excel"
    },
    "categoryByLocale": {
      "es": "Edición",
      "en": "Editing",
      "de": "Bearbeitung",
      "fr": "Édition",
      "ja": "編集",
      "pt": "Edição"
    },
    "tipByLocale": {
      "es": "Convierte un rango plano en tabla inteligente con estilos, filtros y fórmulas autoexpandibles.",
      "en": "Converts plain data into a smart table with striped rows, filters, and auto-expanding formulas.",
      "de": "Verwandelt Daten in eine intelligente Tabelle mit Stilen und Auto-Formeln.",
      "fr": "Transforme les données en tableau dynamique avec styles et formules automatiques.",
      "ja": "通常のセル範囲を、縞模様デザイン・自動拡張数式付きの公式テーブルへ変換します。",
      "pt": "Converte dados comuns em uma tabela inteligente com estilos e fórmulas automáticas."
    }
  },
  {
    "id": "select_column",
    "keysWindows": [
      "Ctrl",
      "Space"
    ],
    "keysMac": [
      "Ctrl",
      "Space"
    ],
    "actionByLocale": {
      "es": "Seleccionar toda la columna actual",
      "en": "Select entire current column",
      "de": "Gesamte Spalte markieren",
      "fr": "Sélectionner la colonne entière",
      "ja": "現在の列全体を選択",
      "pt": "Selecionar toda a coluna atual"
    },
    "categoryByLocale": {
      "es": "Navegación",
      "en": "Navigation",
      "de": "Navigation",
      "fr": "Navigation",
      "ja": "ナビゲーション",
      "pt": "Navegação"
    },
    "tipByLocale": {
      "es": "Para seleccionar la fila completa usa Shift + Espacio.",
      "en": "To select the entire row instead, press Shift + Space.",
      "de": "Um stattdessen die gesamte Zeile zu markieren: Umschalt + Leertaste.",
      "fr": "Pour sélectionner la ligne entière, utilisez Maj + Espace.",
      "ja": "行全体を選択したい場合は Shift + Space を押します。",
      "pt": "Para selecionar a linha inteira, use Shift + Espaço."
    }
  },
  {
    "id": "select_row",
    "keysWindows": [
      "Shift",
      "Space"
    ],
    "keysMac": [
      "Shift",
      "Space"
    ],
    "actionByLocale": {
      "es": "Seleccionar toda la fila actual",
      "en": "Select entire current row",
      "de": "Gesamte Zeile markieren",
      "fr": "Sélectionner la ligne entière",
      "ja": "現在の行全体を選択",
      "pt": "Selecionar toda a linha atual"
    },
    "categoryByLocale": {
      "es": "Navegación",
      "en": "Navigation",
      "de": "Navigation",
      "fr": "Navigation",
      "ja": "ナビゲーション",
      "pt": "Navegação"
    },
    "tipByLocale": {
      "es": "Selecciona la fila activa completa de izquierda a derecha.",
      "en": "Highlights the entire active row from left to right across the sheet.",
      "de": "Markiert die aktive Zeile komplett.",
      "fr": "Sélectionne la ligne active d'un bout à l'autre.",
      "ja": "シートの端から端までアクティブ行全体を瞬時に選択します。",
      "pt": "Seleciona a linha inteira de ponta a ponta na planilha."
    }
  },
  {
    "id": "format_cells",
    "keysWindows": [
      "Ctrl",
      "1"
    ],
    "keysMac": [
      "Cmd",
      "1"
    ],
    "actionByLocale": {
      "es": "Ventana de Formato de Celdas",
      "en": "Open Format Cells dialog",
      "de": "Zellen formatieren Dialog",
      "fr": "Boîte de dialogue Format de cellule",
      "ja": "セルの書式設定ダイアログ",
      "pt": "Janela de Formatar Células"
    },
    "categoryByLocale": {
      "es": "Edición",
      "en": "Editing",
      "de": "Bearbeitung",
      "fr": "Édition",
      "ja": "編集",
      "pt": "Edição"
    },
    "tipByLocale": {
      "es": "El panel más completo: números, fechas, bordes, rellenos y alineación en una sola tecla.",
      "en": "The ultimate styling hub: numbers, dates, custom masks, borders, and fills.",
      "de": "Das Schweizer Taschenmesser für Zahlen, Rahmen, Füllungen und Ausrichtung.",
      "fr": "Le menu complet : devises, dates, bordures, motifs et alignements.",
      "ja": "数値、日付、罫線、塗りつぶし、配置などすべての書式を設定できる最重要ショートカット。",
      "pt": "O painel mais completo: números, datas, bordas, preenchimentos e alinhamento."
    }
  },
  {
    "id": "fill_down",
    "keysWindows": [
      "Ctrl",
      "D"
    ],
    "keysMac": [
      "Cmd",
      "D"
    ],
    "actionByLocale": {
      "es": "Rellenar hacia abajo (Fill Down)",
      "en": "Fill Down from cell above",
      "de": "Nach unten ausfüllen",
      "fr": "Recopier vers le bas",
      "ja": "上のセルの内容を下にコピー",
      "pt": "Preencher para baixo"
    },
    "categoryByLocale": {
      "es": "Edición",
      "en": "Editing",
      "de": "Bearbeitung",
      "fr": "Édition",
      "ja": "編集",
      "pt": "Edição"
    },
    "tipByLocale": {
      "es": "Copia la fórmula o valor de la celda superior en todas las celdas seleccionadas.",
      "en": "Copies the formula or value from the cell directly above into selected cells.",
      "de": "Kopiert Formel oder Wert der oberen Zelle in alle markierten Zellen.",
      "fr": "Recopie la formule ou valeur de la cellule du dessus sur toute la sélection.",
      "ja": "真上のセルの数式や値を、選択範囲内の全セルに一瞬で複製します。",
      "pt": "Copia a fórmula ou valor da célula acima em todas as células selecionadas."
    }
  },
  {
    "id": "fill_right",
    "keysWindows": [
      "Ctrl",
      "R"
    ],
    "keysMac": [
      "Cmd",
      "R"
    ],
    "actionByLocale": {
      "es": "Rellenar hacia la derecha (Fill Right)",
      "en": "Fill Right from cell to left",
      "de": "Nach rechts ausfüllen",
      "fr": "Recopier vers la droite",
      "ja": "左のセルの内容を右にコピー",
      "pt": "Preencher para a direita"
    },
    "categoryByLocale": {
      "es": "Edición",
      "en": "Editing",
      "de": "Bearbeitung",
      "fr": "Édition",
      "ja": "編集",
      "pt": "Edição"
    },
    "tipByLocale": {
      "es": "Copia la celda de la izquierda en las columnas contiguas marcadas.",
      "en": "Copies the formula or content of the leftmost cell into adjacent selected cells.",
      "de": "Kopiert den Inhalt der linken Zelle nach rechts in alle markierten Zellen.",
      "fr": "Recopie la cellule de gauche vers la droite sur la sélection.",
      "ja": "左端のセルの数式や値を右方向の選択セルへ一気に複製します。",
      "pt": "Copia a célula da esquerda para as colunas adjacentes selecionadas."
    }
  },
  {
    "id": "fill_multiple",
    "keysWindows": [
      "Ctrl",
      "Enter"
    ],
    "keysMac": [
      "Cmd",
      "Enter"
    ],
    "actionByLocale": {
      "es": "Rellenar selección con el mismo dato",
      "en": "Fill selection with same data",
      "de": "Auswahl mit gleichem Wert füllen",
      "fr": "Remplir la sélection avec la même valeur",
      "ja": "選択範囲全体に同じ値を一括入力",
      "pt": "Preencher seleção com o mesmo dado"
    },
    "categoryByLocale": {
      "es": "Edición",
      "en": "Editing",
      "de": "Bearbeitung",
      "fr": "Édition",
      "ja": "編集",
      "pt": "Edição"
    },
    "tipByLocale": {
      "es": "Escribe un valor o fórmula y pulsa Ctrl+Enter para volcarlo en todas las celdas marcadas.",
      "en": "Type a value or formula and press Ctrl+Enter to apply it to all selected cells at once.",
      "de": "Eingabe tätigen und mit Strg+Enter gleichzeitig in alle markierten Zellen eintragen.",
      "fr": "Tapez une formule et validez par Ctrl+Entrée pour l'appliquer à toutes les cellules.",
      "ja": "複数のセルを選択した状態で入力し、Ctrl+Enterを押すと全セルに一括反映されます。",
      "pt": "Digite uma fórmula e aperte Ctrl+Enter para inseri-la em todas as células selecionadas."
    }
  },
  {
    "id": "edit_cell",
    "keysWindows": [
      "F2"
    ],
    "keysMac": [
      "Ctrl",
      "U"
    ],
    "actionByLocale": {
      "es": "Editar la celda activa",
      "en": "Edit active cell",
      "de": "Aktive Zelle bearbeiten",
      "fr": "Modifier la cellule active",
      "ja": "アクティブセルの直接編集",
      "pt": "Editar a célula ativa"
    },
    "categoryByLocale": {
      "es": "Navegación",
      "en": "Navigation",
      "de": "Navigation",
      "fr": "Navigation",
      "ja": "ナビゲーション",
      "pt": "Navegação"
    },
    "tipByLocale": {
      "es": "Entra en modo de edición al final del texto sin borrar el contenido accidentalmente.",
      "en": "Enters edit mode at the end of cell contents without accidentally overwriting them.",
      "de": "Öffnet den Bearbeitungsmodus am Ende des Textes, ohne Inhalt zu überschreiben.",
      "fr": "Passe en mode édition à la fin du texte sans effacer le contenu existant.",
      "ja": "セルを上書き消去してしまうことなく、末尾にカーソルを入れて編集を開始します。",
      "pt": "Entra no modo de edição no final do texto sem sobrescrever o conteúdo."
    }
  },
  {
    "id": "insert_row_col",
    "keysWindows": [
      "Ctrl",
      "+"
    ],
    "keysMac": [
      "Cmd",
      "Shift",
      "+"
    ],
    "actionByLocale": {
      "es": "Insertar filas o columnas",
      "en": "Insert rows or columns",
      "de": "Zeilen oder Spalten einfügen",
      "fr": "Insérer des lignes ou colonnes",
      "ja": "行または列の挿入",
      "pt": "Inserir linhas ou colunas"
    },
    "categoryByLocale": {
      "es": "Edición",
      "en": "Editing",
      "de": "Bearbeitung",
      "fr": "Édition",
      "ja": "編集",
      "pt": "Edição"
    },
    "tipByLocale": {
      "es": "Si seleccionas una fila o columna antes, inserta una nueva instantáneamente sin preguntar.",
      "en": "If an entire row or column is selected, it immediately inserts a new one without prompts.",
      "de": "Ist eine ganze Zeile/Spalte markiert, wird sofort eine neue eingefügt.",
      "fr": "Si une ligne ou colonne entière est sélectionnée, l'insertion est immédiate.",
      "ja": "先に行全体または列全体を選択しておくと、確認画面なしで瞬時に新規挿入されます。",
      "pt": "Se selecionar uma linha ou coluna antes, insere uma nova na hora sem confirmação."
    }
  },
  {
    "id": "delete_row_col",
    "keysWindows": [
      "Ctrl",
      "-"
    ],
    "keysMac": [
      "Cmd",
      "-"
    ],
    "actionByLocale": {
      "es": "Eliminar filas o columnas",
      "en": "Delete rows or columns",
      "de": "Zeilen oder Spalten löschen",
      "fr": "Supprimer des lignes ou colonnes",
      "ja": "行または列の削除",
      "pt": "Excluir linhas ou colunas"
    },
    "categoryByLocale": {
      "es": "Edición",
      "en": "Editing",
      "de": "Bearbeitung",
      "fr": "Édition",
      "ja": "編集",
      "pt": "Edição"
    },
    "tipByLocale": {
      "es": "Elimina de inmediato las celdas, filas o columnas seleccionadas.",
      "en": "Immediately deletes the selected cells, rows, or columns.",
      "de": "Löscht markierte Zellen, Zeilen oder Spalten sofort.",
      "fr": "Supprime immédiatement les lignes ou colonnes sélectionnées.",
      "ja": "選択されている行、列、またはセルを即座に削除します。",
      "pt": "Exclui de imediato as células, linhas ou colunas selecionadas."
    }
  },
  {
    "id": "hide_column",
    "keysWindows": [
      "Ctrl",
      "0"
    ],
    "keysMac": [
      "Cmd",
      "0"
    ],
    "actionByLocale": {
      "es": "Ocultar columnas seleccionadas",
      "en": "Hide selected columns",
      "de": "Ausgewählte Spalten ausblenden",
      "fr": "Masquer les colonnes sélectionnées",
      "ja": "選択した列を非表示",
      "pt": "Ocultar colunas selecionadas"
    },
    "categoryByLocale": {
      "es": "Navegación",
      "en": "Navigation",
      "de": "Navigation",
      "fr": "Navigation",
      "ja": "ナビゲーション",
      "pt": "Navegação"
    },
    "tipByLocale": {
      "es": "Oculta temporalmente las columnas sin eliminarlas ni dañar fórmulas.",
      "en": "Temporarily hides columns without altering data or breaking formulas.",
      "de": "Blendet Spalten aus, ohne Formeln oder Daten zu beschädigen.",
      "fr": "Masque temporairement les colonnes sans impacter les formules.",
      "ja": "数式を壊すことなく、選択した列を一時的に非表示にします。",
      "pt": "Oculta temporariamente as colunas sem afetar fórmulas."
    }
  },
  {
    "id": "hide_row",
    "keysWindows": [
      "Ctrl",
      "9"
    ],
    "keysMac": [
      "Cmd",
      "9"
    ],
    "actionByLocale": {
      "es": "Ocultar filas seleccionadas",
      "en": "Hide selected rows",
      "de": "Ausgewählte Zeilen ausblenden",
      "fr": "Masquer les lignes sélectionnées",
      "ja": "選択した行を非表示",
      "pt": "Ocultar linhas selecionadas"
    },
    "categoryByLocale": {
      "es": "Navegación",
      "en": "Navigation",
      "de": "Navigation",
      "fr": "Navigation",
      "ja": "ナビゲーション",
      "pt": "Navegação"
    },
    "tipByLocale": {
      "es": "Para desocultar filas pulsa Ctrl + Shift + 9.",
      "en": "To unhide hidden rows press Ctrl + Shift + 9.",
      "de": "Um Zeilen wieder einzublenden: Strg + Umschalt + 9.",
      "fr": "Pour réafficher les lignes masquées : Ctrl + Maj + 9.",
      "ja": "非表示行を再表示するには Ctrl + Shift + 9 を押します。",
      "pt": "Para reexibir linhas ocultas pressione Ctrl + Shift + 9."
    }
  },
  {
    "id": "insert_today_date",
    "keysWindows": [
      "Ctrl",
      ";"
    ],
    "keysMac": [
      "Cmd",
      ";"
    ],
    "actionByLocale": {
      "es": "Insertar fecha estática de hoy",
      "en": "Insert today's static date",
      "de": "Heutiges Datum statisch einfügen",
      "fr": "Insérer la date du jour statique",
      "ja": "今日の日付を静的に入力",
      "pt": "Inserir data de hoje estática"
    },
    "categoryByLocale": {
      "es": "Fecha / Hora",
      "en": "Date / Time",
      "de": "Datum / Zeit",
      "fr": "Date / Heure",
      "ja": "日付 / 時刻",
      "pt": "Data / Hora"
    },
    "tipByLocale": {
      "es": "Escribe la fecha actual fija que nunca cambiará mañana. Para la hora actual usa Ctrl + Shift + :.",
      "en": "Enters a permanent date that will never change. For static current time use Ctrl + Shift + :.",
      "de": "Schreibt das feste Datum. Für die feste aktuelle Uhrzeit drücke Strg + Umschalt + :.",
      "fr": "Insère une date figée. Pour l'heure actuelle, faites Ctrl + Maj + :.",
      "ja": "再計算されても変わらない確定日付を入力します。現在時刻の入力は Ctrl + Shift + :。",
      "pt": "Insere a data atual fixa. Para a hora atual use Ctrl + Shift + :."
    }
  },
  {
    "id": "insert_current_time",
    "keysWindows": [
      "Ctrl",
      "Shift",
      ":"
    ],
    "keysMac": [
      "Cmd",
      "Shift",
      ":"
    ],
    "actionByLocale": {
      "es": "Insertar hora estática actual",
      "en": "Insert current static time",
      "de": "Aktuelle Uhrzeit statisch einfügen",
      "fr": "Insérer l'heure actuelle statique",
      "ja": "現在の時刻を静的に入力",
      "pt": "Inserir hora estática atual"
    },
    "categoryByLocale": {
      "es": "Fecha / Hora",
      "en": "Date / Time",
      "de": "Datum / Zeit",
      "fr": "Date / Heure",
      "ja": "日付 / 時刻",
      "pt": "Data / Hora"
    },
    "tipByLocale": {
      "es": "Registra una marca de tiempo inmutable con hora y minuto.",
      "en": "Creates a permanent timestamp marking hour and minute.",
      "de": "Fügt einen unveränderlichen Zeitstempel mit Stunde und Minute ein.",
      "fr": "Crée un horodatage immuable avec heure et minute.",
      "ja": "時間と分が刻まれた変更されないタイムスタンプを入力します。",
      "pt": "Cria um registro imutável da hora e minuto atuais."
    }
  },
  {
    "id": "jump_edge",
    "keysWindows": [
      "Ctrl",
      "Flechas"
    ],
    "keysMac": [
      "Cmd",
      "Flechas"
    ],
    "actionByLocale": {
      "es": "Saltar al extremo de los datos",
      "en": "Jump to edge of data region",
      "de": "Zum Rand des Datenbereichs springen",
      "fr": "Sauter au bord de la plage de données",
      "ja": "データ領域の端までジャンプ",
      "pt": "Pular para o limite dos dados"
    },
    "categoryByLocale": {
      "es": "Navegación",
      "en": "Navigation",
      "de": "Navigation",
      "fr": "Navigation",
      "ja": "ナビゲーション",
      "pt": "Navegação"
    },
    "tipByLocale": {
      "es": "Salta volando miles de filas o columnas hasta la última celda con datos en esa dirección.",
      "en": "Flies through thousands of rows or columns to the last populated cell in that direction.",
      "de": "Springt blitzschnell über tausende Zeilen zur letzten Zelle mit Daten.",
      "fr": "Parcourt des milliers de lignes jusqu'à la dernière cellule non vide.",
      "ja": "その方向でデータが連続している最後のセルまで一瞬で移動します。",
      "pt": "Salta milhares de linhas ou colunas até a última célula com dados nessa direção."
    }
  },
  {
    "id": "select_to_edge",
    "keysWindows": [
      "Ctrl",
      "Shift",
      "Flechas"
    ],
    "keysMac": [
      "Cmd",
      "Shift",
      "Flechas"
    ],
    "actionByLocale": {
      "es": "Seleccionar hasta el fin de los datos",
      "en": "Select to boundary of data region",
      "de": "Bis zum Rand der Daten markieren",
      "fr": "Sélectionner jusqu'au bord des données",
      "ja": "データの端まで一括選択",
      "pt": "Selecionar até o final dos dados"
    },
    "categoryByLocale": {
      "es": "Navegación",
      "en": "Navigation",
      "de": "Navigation",
      "fr": "Navigation",
      "ja": "ナビゲーション",
      "pt": "Navegação"
    },
    "tipByLocale": {
      "es": "La combinación maestra para seleccionar columnas completas de 50,000 filas en medio segundo.",
      "en": "The pro secret for selecting whole data columns with 50,000 rows in half a second.",
      "de": "Der Meister-Trick, um Spalten mit 50.000 Zeilen im Bruchteil einer Sekunde zu markieren.",
      "fr": "Le raccourci roi pour sélectionner des dizaines de milliers de lignes en une fraction de seconde.",
      "ja": "数万行のデータ列でも一瞬ですべてハイライト選択できる最頻出ショートカット。",
      "pt": "O combo perfeito para selecionar colunas com milhares de linhas em fração de segundo."
    }
  },
  {
    "id": "show_formulas",
    "keysWindows": [
      "Ctrl",
      "`"
    ],
    "keysMac": [
      "Ctrl",
      "`"
    ],
    "actionByLocale": {
      "es": "Mostrar / Ocultar todas las fórmulas",
      "en": "Show / Hide all formulas",
      "de": "Alle Formeln anzeigen / ausblenden",
      "fr": "Afficher / Masquer toutes les formules",
      "ja": "数式と計算結果の表示切替",
      "pt": "Mostrar / Ocultar todas as fórmulas"
    },
    "categoryByLocale": {
      "es": "Fórmulas",
      "en": "Formulas",
      "de": "Formeln",
      "fr": "Formules",
      "ja": "数式",
      "pt": "Fórmulas"
    },
    "tipByLocale": {
      "es": "Revela las fórmulas en todas las celdas en lugar de los resultados numéricos para auditar errores.",
      "en": "Reveals formulas across the entire sheet instead of numeric results for fast auditing.",
      "de": "Zeigt alle Formeln im Blatt anstelle der Ergebnisse zur schnellen Fehlerprüfung.",
      "fr": "Affiche les formules brutes dans chaque cellule pour auditer les erreurs.",
      "ja": "計算結果ではなくセルに入力されている数式そのものを全セルに表示し監査できます。",
      "pt": "Exibe as fórmulas em todas as células no lugar dos resultados para auditoria."
    }
  },
  {
    "id": "flash_fill",
    "keysWindows": [
      "Ctrl",
      "E"
    ],
    "keysMac": [
      "Cmd",
      "E"
    ],
    "actionByLocale": {
      "es": "Relleno Rápido (Flash Fill)",
      "en": "Flash Fill (Magic pattern fill)",
      "de": "Blitzvorschau (Flash Fill)",
      "fr": "Remplissage instantané",
      "ja": "フラッシュフィル(自動パターン認識入力)",
      "pt": "Preenchimento Relâmpago"
    },
    "categoryByLocale": {
      "es": "Edición",
      "en": "Editing",
      "de": "Bearbeitung",
      "fr": "Édition",
      "ja": "編集",
      "pt": "Edição"
    },
    "tipByLocale": {
      "es": "Escribe un ejemplo a mano y Excel aprenderá el patrón separando o combinando datos mágicamente.",
      "en": "Type one manual example and Excel will detect the pattern to auto-extract or combine data.",
      "de": "Tippe ein Beispiel ein und Excel erkennt das Muster zum automatischen Extrahieren.",
      "fr": "Saisissez un exemple et Excel reproduit automatiquement le modèle sur toute la colonne.",
      "ja": "1つ例を手入力してこのキーを押すだけで、AIのように法則を検知して全行を自動生成します。",
      "pt": "Digite um exemplo e o Excel detectará o padrão para preencher a coluna inteira como mágica."
    }
  },
  {
    "id": "paste_special",
    "keysWindows": [
      "Ctrl",
      "Alt",
      "V"
    ],
    "keysMac": [
      "Cmd",
      "Ctrl",
      "V"
    ],
    "actionByLocale": {
      "es": "Pegado Especial",
      "en": "Paste Special dialog",
      "de": "Inhalte einfügen Dialog",
      "fr": "Collage spécial",
      "ja": "形式を選択して貼り付け",
      "pt": "Colar Especial"
    },
    "categoryByLocale": {
      "es": "Edición",
      "en": "Editing",
      "de": "Bearbeitung",
      "fr": "Édition",
      "ja": "編集",
      "pt": "Edição"
    },
    "tipByLocale": {
      "es": "Pega solo valores, fórmulas, formatos o anchos de columna sin alterar el resto de la celda.",
      "en": "Pastes only values, formulas, formatting, or column widths without disturbing other traits.",
      "de": "Fügt nur Werte, Formeln, Formate oder Spaltenbreiten gezielt ein.",
      "fr": "Colle uniquement les valeurs, formules ou largeurs de colonnes.",
      "ja": "数式を消して「値のみ貼り付け」したり、列幅や書式だけをコピーする最頻出機能。",
      "pt": "Cola apenas valores, fórmulas, formatos ou larguras de coluna."
    }
  },
  {
    "id": "switch_sheet",
    "keysWindows": [
      "Ctrl",
      "AvPág / RePág"
    ],
    "keysMac": [
      "Option",
      "Flechas Der / Izq"
    ],
    "actionByLocale": {
      "es": "Cambiar entre pestañas de hojas",
      "en": "Switch between worksheet tabs",
      "de": "Zwischen Tabellenblättern wechseln",
      "fr": "Naviguer entre les feuilles",
      "ja": "ワークシートのタブを切り替え",
      "pt": "Alternar entre abas de planilhas"
    },
    "categoryByLocale": {
      "es": "Navegación",
      "en": "Navigation",
      "de": "Navigation",
      "fr": "Navigation",
      "ja": "ナビゲーション",
      "pt": "Navegação"
    },
    "tipByLocale": {
      "es": "Navega a la hoja siguiente o anterior al instante sin tocar el ratón.",
      "en": "Flips to the next or previous sheet tab instantly without moving hands to the mouse.",
      "de": "Wechselt sofort zum nächsten oder vorherigen Tabellenblatt.",
      "fr": "Passe immédiatement à la feuille suivante ou précédente.",
      "ja": "マウス操作不要で隣接するシートタブ間をすばやく往復移動できます。",
      "pt": "Alterna para a planilha seguinte ou anterior sem tocar no mouse."
    }
  },
  {
    "id": "line_break_cell",
    "keysWindows": [
      "Alt",
      "Enter"
    ],
    "keysMac": [
      "Option",
      "Return"
    ],
    "actionByLocale": {
      "es": "Salto de línea dentro de la misma celda",
      "en": "Line break inside active cell",
      "de": "Zeilenumbruch in derselben Zelle",
      "fr": "Saut de ligne dans la même cellule",
      "ja": "セル内での改行",
      "pt": "Quebra de linha dentro da mesma célula"
    },
    "categoryByLocale": {
      "es": "Edición",
      "en": "Editing",
      "de": "Bearbeitung",
      "fr": "Édition",
      "ja": "編集",
      "pt": "Edição"
    },
    "tipByLocale": {
      "es": "Crea un renglón nuevo sin salirte de la celda ni pasar a la fila de abajo.",
      "en": "Inserts a new text line without exiting the cell or moving down.",
      "de": "Erzeugt eine neue Textzeile, ohne die Zelle zu verlassen.",
      "fr": "Insère un retour à la ligne sans changer de cellule.",
      "ja": "下のセルに移動することなく、セル内のテキストで改行を行います。",
      "pt": "Cria um novo parágrafo sem sair da célula nem ir para a linha de baixo."
    }
  },
  {
    "id": "format_currency",
    "keysWindows": [
      "Ctrl",
      "Shift",
      "$"
    ],
    "keysMac": [
      "Control",
      "Shift",
      "$"
    ],
    "actionByLocale": {
      "es": "Formato Moneda instantáneo ($#,##0.00)",
      "en": "Apply Currency format ($#,##0.00)",
      "de": "Währungsformat anwenden",
      "fr": "Appliquer le format Monétaire",
      "ja": "通貨表示形式を適用",
      "pt": "Aplicar formato de Moeda"
    },
    "categoryByLocale": {
      "es": "Edición",
      "en": "Editing",
      "de": "Bearbeitung",
      "fr": "Édition",
      "ja": "編集",
      "pt": "Edição"
    },
    "tipByLocale": {
      "es": "Aplica formato monetario con separador de miles y dos decimales en un milisegundo.",
      "en": "Instantly styles selected numbers as currency with two decimal places and separators.",
      "de": "Wendet Währungsformat mit Tausendertrennzeichen und 2 Dezimalstellen an.",
      "fr": "Formate les nombres en devise avec séparateur de milliers et 2 décimales.",
      "ja": "桁区切りカンマと通貨記号付きの書式を一瞬で適用します。",
      "pt": "Aplica formato de moeda com separador de milhar e 2 casas decimais."
    }
  },
  {
    "id": "format_percent",
    "keysWindows": [
      "Ctrl",
      "Shift",
      "%"
    ],
    "keysMac": [
      "Control",
      "Shift",
      "%"
    ],
    "actionByLocale": {
      "es": "Formato Porcentaje instantáneo (0%)",
      "en": "Apply Percentage format (0%)",
      "de": "Prozentformat anwenden",
      "fr": "Appliquer le format Pourcentage",
      "ja": "パーセンテージ表示形式を適用",
      "pt": "Aplicar formato de Porcentagem"
    },
    "categoryByLocale": {
      "es": "Edición",
      "en": "Editing",
      "de": "Bearbeitung",
      "fr": "Édition",
      "ja": "編集",
      "pt": "Edição"
    },
    "tipByLocale": {
      "es": "Multiplica visualmente por 100 y coloca el símbolo % sin alterar el valor decimal base.",
      "en": "Multiplies visually by 100 and attaches % symbol without altering raw decimal accuracy.",
      "de": "Zeigt Zahlen als Prozentwert mit %-Zeichen an.",
      "fr": "Affiche les nombres sous forme de pourcentage.",
      "ja": "小数をそのままパーセント(%)表記へすばやく切り替えます。",
      "pt": "Multiplica visualmente por 100 e coloca o símbolo % sem alterar o decimal."
    }
  },
  {
    "id": "undo_redo",
    "keysWindows": [
      "Ctrl",
      "Z",
      "/",
      "Y"
    ],
    "keysMac": [
      "Cmd",
      "Z",
      "/",
      "Shift",
      "Z"
    ],
    "actionByLocale": {
      "es": "Deshacer / Rehacer acción",
      "en": "Undo / Redo action",
      "de": "Rückgängig / Wiederholen",
      "fr": "Annuler / Rétablir action",
      "ja": "元に戻す / やり直し",
      "pt": "Desfazer / Refazer ação"
    },
    "categoryByLocale": {
      "es": "Esenciales",
      "en": "Essential",
      "de": "Basis",
      "fr": "Essentiels",
      "ja": "基本操作",
      "pt": "Essenciais"
    },
    "tipByLocale": {
      "es": "El salvavidas universal ante cualquier error.",
      "en": "The universal lifesaver for any mistake.",
      "de": "Der universelle Lebensretter bei Fehlern.",
      "fr": "Le filet de sécurité universel contre les erreurs.",
      "ja": "操作を間違えたときの万国共通の命綱です。",
      "pt": "O salva-vidas universal para qualquer engano."
    }
  },
  {
    "id": "find_replace",
    "keysWindows": [
      "Ctrl",
      "B",
      "/",
      "L"
    ],
    "keysMac": [
      "Cmd",
      "F",
      "/",
      "H"
    ],
    "actionByLocale": {
      "es": "Buscar / Reemplazar texto",
      "en": "Find / Replace text",
      "de": "Suchen / Ersetzen",
      "fr": "Rechercher / Remplacer",
      "ja": "検索 / 置換",
      "pt": "Localizar / Substituir"
    },
    "categoryByLocale": {
      "es": "Edición",
      "en": "Editing",
      "de": "Bearbeitung",
      "fr": "Édition",
      "ja": "編集",
      "pt": "Edição"
    },
    "tipByLocale": {
      "es": "Encuentra cualquier dato o reemplaza valores masivamente en segundos.",
      "en": "Locate data points or batch-replace values in seconds across sheets.",
      "de": "Findet Daten oder ersetzt Werte blitzschnell im ganzen Blatt.",
      "fr": "Trouve des données ou remplace des valeurs en masse en quelques secondes.",
      "ja": "シート全体から目的のデータを検索したり、一括置換します。",
      "pt": "Localiza dados ou substitui valores em massa em segundos."
    }
  },
  {
    "id": "recalculate_f9",
    "keysWindows": [
      "F9"
    ],
    "keysMac": [
      "Fn",
      "F9"
    ],
    "actionByLocale": {
      "es": "Recalcular todas las fórmulas",
      "en": "Recalculate all formulas",
      "de": "Alle Formeln neu berechnen",
      "fr": "Recalculer toutes les formules",
      "ja": "すべての数式を再計算",
      "pt": "Recalcular todas as fórmulas"
    },
    "categoryByLocale": {
      "es": "Fórmulas",
      "en": "Formulas",
      "de": "Formeln",
      "fr": "Formules",
      "ja": "数式",
      "pt": "Fórmulas"
    },
    "tipByLocale": {
      "es": "Fuerza la actualización inmediata de libros pesados en modo de cálculo manual.",
      "en": "Forces immediate full calculation of heavy workbooks in manual calc mode.",
      "de": "Erzwingt Neuberechnung bei manueller Berechnungsoption.",
      "fr": "Force le calcul complet des classeurs lourds en mode manuel.",
      "ja": "手動計算モードにしている重いブックの計算を一斉更新します。",
      "pt": "Força a atualização imediata em planilhas pesadas no modo manual."
    }
  },
  {
    "id": "select_visible",
    "keysWindows": [
      "Alt",
      ";"
    ],
    "keysMac": [
      "Cmd",
      "Shift",
      "Z"
    ],
    "actionByLocale": {
      "es": "Seleccionar solo celdas visibles",
      "en": "Select only visible cells",
      "de": "Nur sichtbare Zellen markieren",
      "fr": "Sélectionner cellules visibles",
      "ja": "可視セルのみを選択",
      "pt": "Selecionar apenas células visíveis"
    },
    "categoryByLocale": {
      "es": "Navegación",
      "en": "Navigation",
      "de": "Navigation",
      "fr": "Navigation",
      "ja": "ナビゲーション",
      "pt": "Navegação"
    },
    "tipByLocale": {
      "es": "¡Truco de maestro! Evita copiar celdas que están ocultas por filtros o agrupaciones.",
      "en": "Ninja trick! Prevents accidentally copying hidden filtered rows when copy-pasting.",
      "de": "Verhindert das versehentliche Kopieren ausgeblendeter Filterzeilen.",
      "fr": "Évite de copier les lignes masquées lors d'un filtre.",
      "ja": "フィルターで非表示になっている行を除外してコピーできる超実戦的プロ技！",
      "pt": "Evita copiar células ocultas por filtros ao dar Ctrl+C."
    }
  },
  {
    "id": "bold_italic",
    "keysWindows": [
      "Ctrl",
      "N",
      "/",
      "K"
    ],
    "keysMac": [
      "Cmd",
      "B",
      "/",
      "I"
    ],
    "actionByLocale": {
      "es": "Negrita / Cursiva rápida",
      "en": "Toggle Bold / Italic",
      "de": "Fett / Kursiv umschalten",
      "fr": "Gras / Italique rapide",
      "ja": "太字 / 斜体の切替",
      "pt": "Negrito / Itálico rápido"
    },
    "categoryByLocale": {
      "es": "Edición",
      "en": "Editing",
      "de": "Bearbeitung",
      "fr": "Édition",
      "ja": "編集",
      "pt": "Edição"
    },
    "tipByLocale": {
      "es": "Destaca totales, encabezados y métricas clave al instante.",
      "en": "Quickly emphasizes totals, headers, and KPI metrics.",
      "de": "Hebt Summenzeilen und Überschriften sofort hervor.",
      "fr": "Met en valeur totaux et en-têtes immédiatement.",
      "ja": "合計行やヘッダーを一瞬で強調表示します。",
      "pt": "Destaca totais e cabeçalhos instantaneamente."
    }
  },
  {
    "id": "jump_home_end",
    "keysWindows": [
      "Ctrl",
      "Inicio / Fin"
    ],
    "keysMac": [
      "Cmd",
      "Fn",
      "Izquierda / Derecha"
    ],
    "actionByLocale": {
      "es": "Ir a la primera / última celda",
      "en": "Jump to first (A1) / last used cell",
      "de": "Zur ersten (A1) / letzten Zelle springen",
      "fr": "Aller à A1 / dernière cellule",
      "ja": "先頭セル(A1) / 最終使用セルへ移動",
      "pt": "Ir para a primeira (A1) / última célula"
    },
    "categoryByLocale": {
      "es": "Navegación",
      "en": "Navigation",
      "de": "Navigation",
      "fr": "Navigation",
      "ja": "ナビゲーション",
      "pt": "Navegação"
    },
    "tipByLocale": {
      "es": "Ctrl+Inicio siempre te devuelve a A1; Ctrl+Fin va al último rincón usado de la hoja.",
      "en": "Ctrl+Home instantly takes you back to A1; Ctrl+End jumps to bottom-right corner.",
      "de": "Strg+Pos1 bringt dich immer zu A1 zurück, Strg+Ende zum letzten benutzten Bereich.",
      "fr": "Ctrl+Début vous ramène toujours en A1; Ctrl+Fin à l'extrémité basse.",
      "ja": "Ctrl+HomeはいつでもA1へ帰還、Ctrl+Endは使用中エリアの最右下隅へ飛びます。",
      "pt": "Ctrl+Home leva sempre para A1; Ctrl+End vai para o último canto usado."
    }
  }
];

export const FORMULA_SCENARIOS: Record<string, SheetScenarioDoc> = {
  "VLOOKUP": {
    "columns": [
      "A",
      "B"
    ],
    "rows": [
      [
        "101",
        "$1,800"
      ],
      [
        "102",
        "$2,450"
      ],
      [
        "103",
        "$3,100"
      ],
      [
        "",
        ""
      ]
    ],
    "targetCell": "B4",
    "formulaEs": "=BUSCARV(102, A1:B3, 2, 0)",
    "formulaEn": "=VLOOKUP(102, A1:B3, 2, 0)",
    "sourceCells": [
      "A2",
      "B2"
    ],
    "resultValue": "$2,450",
    "targetLabelByLocale": {
      "es": "Sueldo ID 102",
      "en": "Salary for ID 102",
      "de": "Gehalt für ID 102",
      "fr": "Salaire ID 102",
      "ja": "ID 102 の給与",
      "pt": "Salário ID 102"
    }
  },
  "XLOOKUP": {
    "columns": [
      "A",
      "B"
    ],
    "rows": [
      [
        "Laura G.",
        "102"
      ],
      [
        "Carlos P.",
        "103"
      ],
      [
        "",
        ""
      ]
    ],
    "targetCell": "A3",
    "formulaEs": "=BUSCARX(102, B1:B2, A1:A2)",
    "formulaEn": "=XLOOKUP(102, B1:B2, A1:A2)",
    "sourceCells": [
      "B1",
      "A1"
    ],
    "resultValue": "Laura G.",
    "targetLabelByLocale": {
      "es": "⬅ Busca a la izquierda",
      "en": "⬅ Looks to the left",
      "de": "⬅ Sucht nach links",
      "fr": "⬅ Cherche à gauche",
      "ja": "⬅ 左側を逆引き検索",
      "pt": "⬅ Procura para a esquerda"
    }
  },
  "INDEX": {
    "columns": [
      "A",
      "B"
    ],
    "rows": [
      [
        "100",
        "250"
      ],
      [
        "320",
        "450"
      ],
      [
        "",
        ""
      ]
    ],
    "targetCell": "B3",
    "formulaEs": "=INDICE(A1:B2, 2, 2)",
    "formulaEn": "=INDEX(A1:B2, 2, 2)",
    "sourceCells": [
      "B2"
    ],
    "resultValue": "450",
    "targetLabelByLocale": {
      "es": "Fila 2 × Col 2",
      "en": "Row 2 × Col 2",
      "de": "Zeile 2 × Spalte 2",
      "fr": "Ligne 2 × Col 2",
      "ja": "行 2 × 列 2",
      "pt": "Linha 2 × Col 2"
    }
  },
  "MATCH": {
    "columns": [
      "A",
      "B"
    ],
    "rows": [
      [
        "Ana",
        "Pos #"
      ],
      [
        "Luis",
        ""
      ],
      [
        "Celdi",
        ""
      ]
    ],
    "targetCell": "B3",
    "formulaEs": "=COINCIDIR(\"Celdi\", A1:A3, 0)",
    "formulaEn": "=MATCH(\"Celdi\", A1:A3, 0)",
    "sourceCells": [
      "A1",
      "A2",
      "A3"
    ],
    "resultValue": "3",
    "targetLabelByLocale": {
      "es": "Posición exacta",
      "en": "Exact position",
      "de": "Exakte Position",
      "fr": "Position exacte",
      "ja": "完全一致の位置",
      "pt": "Posição exata"
    }
  },
  "IF": {
    "columns": [
      "A",
      "B"
    ],
    "rows": [
      [
        "Nota",
        "Estado"
      ],
      [
        "85",
        ""
      ],
      [
        "60",
        "Reprobado"
      ]
    ],
    "targetCell": "B2",
    "formulaEs": "=SI(A2>=70, \"Aprobado\", \"Reprobado\")",
    "formulaEn": "=IF(A2>=70, \"Passed\", \"Failed\")",
    "sourceCells": [
      "A2"
    ],
    "resultValue": "\"Aprobado\"",
    "targetLabelByLocale": {
      "es": "Evalúa 85 >= 70 (Verdadero)",
      "en": "Evaluates 85 >= 70 (True)",
      "de": "Prüft 85 >= 70 (Wahr)",
      "fr": "Évalue 85 >= 70 (Vrai)",
      "ja": "85 >= 70 を判定 (True)",
      "pt": "Avalia 85 >= 70 (Verdadeiro)"
    }
  },
  "IFS": {
    "columns": [
      "A",
      "B"
    ],
    "rows": [
      [
        "Ventas",
        "Nivel"
      ],
      [
        "1500",
        ""
      ]
    ],
    "targetCell": "B2",
    "formulaEs": "=SI.CONJUNTO(A2>1000, \"Oro\", A2>500, \"Plata\")",
    "formulaEn": "=IFS(A2>1000, \"Gold\", A2>500, \"Silver\")",
    "sourceCells": [
      "A2"
    ],
    "resultValue": "\"Oro\"",
    "targetLabelByLocale": {
      "es": "Condición múltiple cumplida",
      "en": "Multiple condition met",
      "de": "Mehrfachbedingung erfüllt",
      "fr": "Condition multiple remplie",
      "ja": "複数条件に合致",
      "pt": "Condição múltipla atendida"
    }
  },
  "IFERROR": {
    "columns": [
      "A",
      "B"
    ],
    "rows": [
      [
        "#DIV/0!",
        ""
      ]
    ],
    "targetCell": "B1",
    "formulaEs": "=SI.ERROR(A1, 0)",
    "formulaEn": "=IFERROR(A1, 0)",
    "sourceCells": [
      "A1"
    ],
    "resultValue": "0",
    "targetLabelByLocale": {
      "es": "Atrapa error y rescata",
      "en": "Catches error cleanly",
      "de": "Fängt Fehler sauber ab",
      "fr": "Capture l'erreur proprement",
      "ja": "エラーを検知して置換",
      "pt": "Captura erro com segurança"
    }
  },
  "SUM": {
    "columns": [
      "A",
      "B"
    ],
    "rows": [
      [
        "Q1",
        "500"
      ],
      [
        "Q2",
        "350"
      ],
      [
        "Q3",
        "650"
      ],
      [
        "Total",
        ""
      ]
    ],
    "targetCell": "B4",
    "formulaEs": "=SUMA(B1:B3)",
    "formulaEn": "=SUM(B1:B3)",
    "sourceCells": [
      "B1",
      "B2",
      "B3"
    ],
    "resultValue": "1,500",
    "targetLabelByLocale": {
      "es": "Suma acumulada total",
      "en": "Total accumulated sum",
      "de": "Gesamte Summe",
      "fr": "Somme cumulée totale",
      "ja": "合計値の算出",
      "pt": "Soma acumulada total"
    }
  },
  "SUMIF": {
    "columns": [
      "A",
      "B"
    ],
    "rows": [
      [
        "Manzana",
        "10"
      ],
      [
        "Pera",
        "20"
      ],
      [
        "Manzana",
        "15"
      ],
      [
        "Total M.",
        ""
      ]
    ],
    "targetCell": "B4",
    "formulaEs": "=SUMAR.SI(A1:A3, \"Manzana\", B1:B3)",
    "formulaEn": "=SUMIF(A1:A3, \"Apple\", B1:B3)",
    "sourceCells": [
      "A1",
      "A3",
      "B1",
      "B3"
    ],
    "resultValue": "25",
    "targetLabelByLocale": {
      "es": "Suma condicional con criterio",
      "en": "Conditional sum with criterion",
      "de": "Bedingte Summe mit Kriterium",
      "fr": "Somme conditionnelle avec critère",
      "ja": "条件付き合計の算出",
      "pt": "Soma condicional com critério"
    }
  },
  "SUMIFS": {
    "columns": [
      "A",
      "B",
      "C"
    ],
    "rows": [
      [
        "Norte",
        "Manzana",
        "40"
      ],
      [
        "Sur",
        "Manzana",
        "25"
      ],
      [
        "Norte",
        "Pera",
        "50"
      ],
      [
        "Norte M.",
        "",
        ""
      ]
    ],
    "targetCell": "C4",
    "formulaEs": "=SUMAR.SI.CONJUNTO(C1:C3, A1:A3, \"Norte\", B1:B3, \"Manzana\")",
    "formulaEn": "=SUMIFS(C1:C3, A1:A3, \"North\", B1:B3, \"Apple\")",
    "sourceCells": [
      "C1"
    ],
    "resultValue": "40",
    "targetLabelByLocale": {
      "es": "Criterios Norte + Manzana",
      "en": "Criteria North + Apple",
      "de": "Kriterien Nord + Apfel",
      "fr": "Critères Nord + Pomme",
      "ja": "複数条件(北＋リンゴ)の合計",
      "pt": "Critérios Norte + Maçã"
    }
  },
  "AVERAGE": {
    "columns": [
      "A",
      "B"
    ],
    "rows": [
      [
        "Sem 1",
        "80"
      ],
      [
        "Sem 2",
        "90"
      ],
      [
        "Sem 3",
        "100"
      ],
      [
        "Media",
        ""
      ]
    ],
    "targetCell": "B4",
    "formulaEs": "=PROMEDIO(B1:B3)",
    "formulaEn": "=AVERAGE(B1:B3)",
    "sourceCells": [
      "B1",
      "B2",
      "B3"
    ],
    "resultValue": "90",
    "targetLabelByLocale": {
      "es": "Media aritmética",
      "en": "Arithmetic mean",
      "de": "Arithmetisches Mittel",
      "fr": "Moyenne arithmétique",
      "ja": "算術平均の計算",
      "pt": "Média aritmética"
    }
  },
  "COUNTIF": {
    "columns": [
      "A",
      "B"
    ],
    "rows": [
      [
        "Aprobado",
        ""
      ],
      [
        "Reprobado",
        ""
      ],
      [
        "Aprobado",
        ""
      ],
      [
        "Total Apr.",
        ""
      ]
    ],
    "targetCell": "B4",
    "formulaEs": "=CONTAR.SI(A1:A3, \"Aprobado\")",
    "formulaEn": "=COUNTIF(A1:A3, \"Passed\")",
    "sourceCells": [
      "A1",
      "A3"
    ],
    "resultValue": "2",
    "targetLabelByLocale": {
      "es": "Conteo condicional",
      "en": "Conditional count",
      "de": "Bedingtes Zählen",
      "fr": "Nombre sous condition",
      "ja": "条件に一致するセル数",
      "pt": "Contagem condicional"
    }
  },
  "COUNTA": {
    "columns": [
      "A",
      "B"
    ],
    "rows": [
      [
        "Dato A",
        ""
      ],
      [
        "",
        ""
      ],
      [
        "Dato B",
        ""
      ],
      [
        "Llenas",
        ""
      ]
    ],
    "targetCell": "B4",
    "formulaEs": "=CONTARA(A1:A3)",
    "formulaEn": "=COUNTA(A1:A3)",
    "sourceCells": [
      "A1",
      "A3"
    ],
    "resultValue": "2",
    "targetLabelByLocale": {
      "es": "Celdas no vacías",
      "en": "Non-empty cells",
      "de": "Nicht-leere Zellen",
      "fr": "Cellules non vides",
      "ja": "空白でないセル数",
      "pt": "Células não vazias"
    }
  },
  "UNIQUE": {
    "columns": [
      "A",
      "B"
    ],
    "rows": [
      [
        "Lima",
        ""
      ],
      [
        "Madrid",
        ""
      ],
      [
        "Lima",
        ""
      ]
    ],
    "targetCell": "B1",
    "formulaEs": "=UNICOS(A1:A3)",
    "formulaEn": "=UNIQUE(A1:A3)",
    "sourceCells": [
      "A1",
      "A2"
    ],
    "resultValue": "Lima; Madrid",
    "targetLabelByLocale": {
      "es": "Extrae valores sin repetir",
      "en": "Extracts distinct values",
      "de": "Eindeutige Werte extrahieren",
      "fr": "Extrait les valeurs uniques",
      "ja": "重複を排除した一意の値",
      "pt": "Extrai valores sem repetição"
    }
  },
  "FILTER": {
    "columns": [
      "A",
      "B"
    ],
    "rows": [
      [
        "Juan",
        "Activo"
      ],
      [
        "Rosa",
        "Inactivo"
      ],
      [
        "Carlos",
        "Activo"
      ]
    ],
    "targetCell": "A4",
    "formulaEs": "=FILTRAR(A1:B3, B1:B3=\"Activo\")",
    "formulaEn": "=FILTER(A1:B3, B1:B3=\"Active\")",
    "sourceCells": [
      "A1",
      "B1",
      "A3",
      "B3"
    ],
    "resultValue": "Juan, Carlos",
    "targetLabelByLocale": {
      "es": "Filtro dinámico en vivo",
      "en": "Live dynamic array filter",
      "de": "Dynamischer Live-Filter",
      "fr": "Filtre dynamique interactif",
      "ja": "動的配列によるフィルタリング",
      "pt": "Filtro dinâmico ao vivo"
    }
  },
  "TEXTJOIN": {
    "columns": [
      "A",
      "B",
      "C"
    ],
    "rows": [
      [
        "Hola",
        "Mundo",
        ""
      ]
    ],
    "targetCell": "C1",
    "formulaEs": "=UNIRCADENAS(\" \", VERDADERO, A1:B1)",
    "formulaEn": "=TEXTJOIN(\" \", TRUE, A1:B1)",
    "sourceCells": [
      "A1",
      "B1"
    ],
    "resultValue": "\"Hola Mundo\"",
    "targetLabelByLocale": {
      "es": "Une texto con delimitador",
      "en": "Joins text with delimiter",
      "de": "Verbindet Text mit Trennzeichen",
      "fr": "Joint du texte avec séparateur",
      "ja": "区切り文字でテキストを結合",
      "pt": "Une texto com delimitador"
    }
  },
  "CONCAT": {
    "columns": [
      "A",
      "B",
      "C"
    ],
    "rows": [
      [
        "Ana",
        "Pérez",
        ""
      ]
    ],
    "targetCell": "C1",
    "formulaEs": "=CONCAT(A1, \" \", B1)",
    "formulaEn": "=CONCAT(A1, \" \", B1)",
    "sourceCells": [
      "A1",
      "B1"
    ],
    "resultValue": "\"Ana Pérez\"",
    "targetLabelByLocale": {
      "es": "Concatena cadenas",
      "en": "Concatenates strings",
      "de": "Verkettet Zeichenketten",
      "fr": "Concatène les chaînes",
      "ja": "文字列を連結",
      "pt": "Concatena cadeias de texto"
    }
  },
  "TRIM": {
    "columns": [
      "A",
      "B"
    ],
    "rows": [
      [
        "  Excel  ",
        ""
      ]
    ],
    "targetCell": "B1",
    "formulaEs": "=ESPACIOS(A1)",
    "formulaEn": "=TRIM(A1)",
    "sourceCells": [
      "A1"
    ],
    "resultValue": "\"Excel\"",
    "targetLabelByLocale": {
      "es": "Elimina espacios sobrantes",
      "en": "Removes extra spaces",
      "de": "Entfernt überflüssige Leerzeichen",
      "fr": "Supprime les espaces superflus",
      "ja": "余分な空白を削除",
      "pt": "Remove espaços em excesso"
    }
  },
  "TEXT": {
    "columns": [
      "A",
      "B"
    ],
    "rows": [
      [
        "01/01/2026",
        ""
      ]
    ],
    "targetCell": "B1",
    "formulaEs": "=TEXTO(A1, \"dddd\")",
    "formulaEn": "=TEXT(A1, \"dddd\")",
    "sourceCells": [
      "A1"
    ],
    "resultValue": "\"jueves\"",
    "targetLabelByLocale": {
      "es": "Aplica máscara de formato",
      "en": "Applies custom format mask",
      "de": "Wendet benutzerdefiniertes Format an",
      "fr": "Applique un masque de format",
      "ja": "表示形式を指定したテキスト変換",
      "pt": "Aplica máscara de formatação"
    }
  },
  "LEFT": {
    "columns": [
      "A",
      "B"
    ],
    "rows": [
      [
        "EXCEL-2026",
        ""
      ]
    ],
    "targetCell": "B1",
    "formulaEs": "=IZQUIERDA(A1, 5)",
    "formulaEn": "=LEFT(A1, 5)",
    "sourceCells": [
      "A1"
    ],
    "resultValue": "\"EXCEL\"",
    "targetLabelByLocale": {
      "es": "Primeros 5 caracteres a la izquierda",
      "en": "First 5 characters from left",
      "de": "Erste 5 Zeichen von links",
      "fr": "5 premiers caractères à gauche",
      "ja": "左端から5文字を抽出",
      "pt": "Primeiros 5 caracteres à esquerda"
    }
  },
  "MID": {
    "columns": [
      "A",
      "B"
    ],
    "rows": [
      [
        "FACT-2026",
        ""
      ]
    ],
    "targetCell": "B1",
    "formulaEs": "=EXTRAE(A1, 6, 4)",
    "formulaEn": "=MID(A1, 6, 4)",
    "sourceCells": [
      "A1"
    ],
    "resultValue": "\"2026\"",
    "targetLabelByLocale": {
      "es": "Recorta caracteres intermedios",
      "en": "Extracts substring in middle",
      "de": "Extrahiert Teilzeichenkette",
      "fr": "Extrait une sous-chaîne au milieu",
      "ja": "指定位置から文字列を抽出",
      "pt": "Recorta caracteres intermediários"
    }
  },
  "TODAY": {
    "columns": [
      "A",
      "B"
    ],
    "rows": [
      [
        "Hoy",
        ""
      ]
    ],
    "targetCell": "B1",
    "formulaEs": "=HOY()",
    "formulaEn": "=TODAY()",
    "sourceCells": [
      "A1"
    ],
    "resultValue": "2026-11-03",
    "targetLabelByLocale": {
      "es": "Fecha actual dinámica",
      "en": "Dynamic current date",
      "de": "Dynamisches aktuelles Datum",
      "fr": "Date actuelle dynamique",
      "ja": "動的に現在日付を取得",
      "pt": "Data atual dinâmica"
    }
  },
  "DATE": {
    "columns": [
      "A",
      "B",
      "C",
      "D"
    ],
    "rows": [
      [
        "2026",
        "12",
        "25",
        ""
      ]
    ],
    "targetCell": "D1",
    "formulaEs": "=FECHA(A1, B1, C1)",
    "formulaEn": "=DATE(A1, B1, C1)",
    "sourceCells": [
      "A1",
      "B1",
      "C1"
    ],
    "resultValue": "25/12/2026",
    "targetLabelByLocale": {
      "es": "Construye fecha válida",
      "en": "Constructs valid date",
      "de": "Erstellt gültiges Datum",
      "fr": "Construit une date valide",
      "ja": "年月日を結合して日付を作成",
      "pt": "Constrói data válida"
    }
  }
};

export function getScenarioForFormula(formula: FormulaDoc, preferEnglish: boolean, langCode: string): SheetScenarioDoc {
  const existing = FORMULA_SCENARIOS[formula.nameEn];
  if (existing) return existing;
  const localName = preferEnglish ? formula.nameEn : (formula.nameByLocale[langCode] || formula.nameByLocale.es || formula.nameEn);
  const resVal = formula.exampleResultByLocale[langCode] || formula.exampleResultByLocale.es || "OK";
  return {
    columns: ["A", "B"],
    rows: [
      ["Dato", "Resultado"],
      ["Valor", ""],
    ],
    targetCell: "B2",
    formulaEs: `=${formula.nameByLocale.es || formula.nameEn}(A2)`,
    formulaEn: `=${formula.nameEn}(A2)`,
    sourceCells: ["A2"],
    resultValue: resVal,
    targetLabelByLocale: {
      es: `Resultado de =${localName}`,
      en: `Result of =${formula.nameEn}`,
    },
  };
}
