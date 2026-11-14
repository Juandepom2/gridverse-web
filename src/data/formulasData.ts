import { SupportedLocale } from '../types';

export interface FormulaDoc {
  id: string;
  nameEn: string;
  category: 'lookup' | 'math' | 'logical' | 'text' | 'date';
  exampleFormula: string;
  nameByLocale: Record<SupportedLocale, string>;
  descriptionByLocale: Record<SupportedLocale, string>;
  syntaxByLocale: Record<SupportedLocale, string>;
  exampleContextByLocale: Record<SupportedLocale, string>;
  exampleResultByLocale: Record<SupportedLocale, string>;
  proTipByLocale: Record<SupportedLocale, string>;
  tags: string[];
}

export const FORMULAS_DATA: FormulaDoc[] = [
  {
    id: 'xlookup',
    nameEn: 'XLOOKUP',
    category: 'lookup',
    exampleFormula: '=XLOOKUP("EMP-102", B2:B50, A2:A50, "No existe")',
    nameByLocale: {
      es: 'BUSCARX',
      en: 'XLOOKUP',
      de: 'XVERWEIS',
      fr: 'RECHERCHEX',
      ja: 'XLOOKUP',
      pt: 'PROCX'
    },
    descriptionByLocale: {
      es: 'La sucesora moderna y más potente de BUSCARV. Busca en cualquier dirección (izquierda o derecha) sin romperse.',
      en: 'The modern successor to VLOOKUP. Searches in any direction (left or right) and does not break with column changes.',
      de: 'Der moderne Nachfolger von SVERWEIS. Sucht in jede Richtung (auch nach links) ohne Probleme.',
      fr: 'Le successeur moderne de RECHERCHEV. Cherche dans toutes les directions (gauche ou droite).',
      ja: 'VLOOKUPの後継となる強力な関数。左方向への検索も可能で列の挿入にも強いです。',
      pt: 'O sucessor moderno do PROCV. Procura em qualquer direção (esquerda ou direita) com total segurança.'
    },
    syntaxByLocale: {
      es: '=BUSCARX(valor_buscado; matriz_buscada; matriz_devuelta; [si_no_se_encuentra])',
      en: '=XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found])',
      de: '=XVERWEIS(Suchkriterium; Suchmatrix; Rückgabematrix; [wenn_nicht_gefunden])',
      fr: '=RECHERCHEX(valeur_cherchée; tableau_recherche; tableau_renvoyé; [si_non_trouvé])',
      ja: '=XLOOKUP(検索値, 検索範囲, 戻り範囲, [見つからない場合])',
      pt: '=PROCX(valor_pesquisa; matriz_pesquisa; matriz_retorno; [se_não_encontrada])'
    },
    exampleContextByLocale: {
      es: 'Busca el ID en col B y devuelve el Nombre que está a su izquierda en col A.',
      en: 'Looks up the ID in col B and returns the Name to its left in col A.',
      de: 'Sucht ID in Spalte B und gibt Namen links davon in Spalte A zurück.',
      fr: "Cherche l'ID en col B et renvoie le Nom situé à sa gauche en col A.",
      ja: '列BでIDを検索し、その左側にある列Aの氏名を返します。',
      pt: 'Procura o ID na col B e devolve o Nome que está à sua esquerda na col A.'
    },
    exampleResultByLocale: {
      es: 'Laura Gómez',
      en: 'Laura Gomez',
      de: 'Laura Gomez',
      fr: 'Laura Gomez',
      ja: 'ローラ・ゴメス',
      pt: 'Laura Gomes'
    },
    proTipByLocale: {
      es: 'Por defecto hace búsqueda exacta sin necesidad de poner FALSO, e incluye manejo de errores nativo.',
      en: 'Defaults to exact match without needing FALSE, plus has built-in error handling in arg 4.',
      de: 'Standardmäßig exakte Übereinstimmung, inklusive nativer Fehlerbehandlung im 4. Parameter.',
      fr: 'Par défaut en correspondance exacte sans devoir préciser FAUX, avec gestion d\'erreurs intégrée.',
      ja: '標準で完全一致検索となり、第4引数でエラー時の代替値を設定できます。',
      pt: 'Por padrão já faz busca exata sem precisar de FALSO e possui tratamento nativo de erro no 4º argumento.'
    },
    tags: ['xlookup', 'buscarx', 'lookup', 'procx', 'moderno']
  },
  {
    id: 'vlookup',
    nameEn: 'VLOOKUP',
    category: 'lookup',
    exampleFormula: '=VLOOKUP("EMP-102", A2:D50, 3, FALSE)',
    nameByLocale: {
      es: 'BUSCARV',
      en: 'VLOOKUP',
      de: 'SVERWEIS',
      fr: 'RECHERCHEV',
      ja: 'VLOOKUP',
      pt: 'PROCV'
    },
    descriptionByLocale: {
      es: 'Busca un valor en la primera columna izquierda de una tabla y devuelve el valor de otra columna en la misma fila.',
      en: 'Searches for a value in the first column of a table and returns a value in the same row from another column.',
      de: 'Sucht nach einem Wert in der ersten Spalte einer Tabelle und gibt den Wert aus derselben Zeile zurück.',
      fr: 'Cherche une valeur dans la première colonne d\'un tableau et renvoie une valeur dans la même ligne.',
      ja: '表の左端の列で特定の値を検索し、同じ行の指定した列の値を返します。',
      pt: 'Procura um valor na primeira coluna à esquerda de uma tabela e retorna o valor na mesma linha de outra coluna.'
    },
    syntaxByLocale: {
      es: '=BUSCARV(valor_buscado; tabla; indicador_columnas; [ordenado])',
      en: '=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])',
      de: '=SVERWEIS(Suchkriterium; Matrix; Spaltenindex; [Bereich_Verweis])',
      fr: '=RECHERCHEV(valeur_cherchée; table_matrice; no_index_col; [valeur_proche])',
      ja: '=VLOOKUP(検索値, 範囲, 列番号, [検索方法])',
      pt: '=PROCV(valor_procurado; matriz_tabela; núm_índice_coluna; [procurar_intervalo])'
    },
    exampleContextByLocale: {
      es: 'A2:A50 contiene IDs de empleados, y columna 3 contiene el Salario.',
      en: 'A2:A50 contains employee IDs, column 3 holds the Salary.',
      de: 'A2:A50 enthält Mitarbeiter-IDs, Spalte 3 enthält das Gehalt.',
      fr: 'A2:A50 contient les identifiants d\'employés, la colonne 3 contient le salaire.',
      ja: 'A2:A50に従業員IDがあり、列3に給与が入っています。',
      pt: 'A2:A50 contém IDs de funcionários e a coluna 3 contém o salário.'
    },
    exampleResultByLocale: {
      es: '$2,450.00',
      en: '$2,450.00',
      de: '2.450,00 €',
      fr: '2 450,00 €',
      ja: '¥245,000',
      pt: 'R$ 2.450,00'
    },
    proTipByLocale: {
      es: 'Usa siempre FALSO (o 0) al final para búsqueda exacta. ¡BUSCARV nunca puede mirar hacia su izquierda!',
      en: 'Always use FALSE (or 0) for exact match. Remember VLOOKUP cannot look to its left!',
      de: 'Verwende am Ende immer FALSCH (oder 0) für exakte Suche. SVERWEIS kann nicht nach links schauen!',
      fr: 'Utilisez toujours FAUX (ou 0) pour une correspondance exacte. RECHERCHEV ne regarde jamais à gauche !',
      ja: '完全一致には必ず末尾にFALSE (0) を指定します。VLOOKUPは左側を参照できません！',
      pt: 'Use sempre FALSO (ou 0) para busca exata. Lembre-se que o PROCV nunca olha para a esquerda!'
    },
    tags: ['buscarv', 'vlookup', 'procv', 'sverweis']
  },
  {
    id: 'iferror',
    nameEn: 'IFERROR',
    category: 'logical',
    exampleFormula: '=IFERROR(VLOOKUP(A2, D:E, 2, FALSE), "No Encontrado")',
    nameByLocale: {
      es: 'SI.ERROR',
      en: 'IFERROR',
      de: 'WENNFEHLER',
      fr: 'SIERREUR',
      ja: 'IFERROR',
      pt: 'SEERRO'
    },
    descriptionByLocale: {
      es: 'Atrapa cualquier error (#N/A, #REF!, #DIV/0!) y devuelve un valor alternativo limpio en su lugar.',
      en: 'Catches any error (#N/A, #REF!, #DIV/0!) and returns a clean custom fallback value.',
      de: 'Fängt jeden Fehler (#NV, #BEZUG!, #DIV/0!) ab und gibt einen sauberen Ersatzwert zurück.',
      fr: 'Intercepte toute erreur (#N/A, #REF!, #DIV/0!) et renvoie une valeur de remplacement propre.',
      ja: 'エラー（#N/A, #REF!, #DIV/0!など）をトラップし、指定した代替値を返します。',
      pt: 'Captura qualquer erro (#N/D, #REF!, #DIV/0!) e retorna um valor personalizado limpo.'
    },
    syntaxByLocale: {
      es: '=SI.ERROR(valor; valor_si_error)',
      en: '=IFERROR(value, value_if_error)',
      de: '=WENNFEHLER(Wert; Wert_wenn_Fehler)',
      fr: '=SIERREUR(valeur; valeur_si_erreur)',
      ja: '=IFERROR(値, エラーの場合の値)',
      pt: '=SEERRO(valor; valor_se_erro)'
    },
    exampleContextByLocale: {
      es: 'Si el producto no se encuentra en el inventario, muestra "No Encontrado" en lugar de un feo #N/A.',
      en: 'If item is missing, shows "Not Found" instead of an ugly #N/A error.',
      de: 'Wenn das Element fehlt, wird "Nicht gefunden" statt #NV angezeigt.',
      fr: 'Si l\'article est absent, affiche "Non trouvé" au lieu d\'un #N/A.',
      ja: '商品が見つからない場合、#N/Aではなく「見つかりません」と表示します。',
      pt: 'Se o item não existir, exibe "Não Encontrado" no lugar de um feio #N/D.'
    },
    exampleResultByLocale: {
      es: 'No Encontrado',
      en: 'Not Found',
      de: 'Nicht gefunden',
      fr: 'Non trouvé',
      ja: '見つかりません',
      pt: 'Não Encontrado'
    },
    proTipByLocale: {
      es: 'Esencial para presentar reportes ejecutivos limpios sin celdas rotas con advertencias rojas.',
      en: 'Essential for clean executive dashboards without broken error flags.',
      de: 'Unerlässlich für saubere Dashboards ohne hässliche Fehlerwerte.',
      fr: 'Indispensable pour des rapports professionnels impeccables.',
      ja: '役員向けレポートやダッシュボードの体裁を整える必須関数です。',
      pt: 'Essencial para relatórios executivos limpos e sem células quebradas.'
    },
    tags: ['sierror', 'iferror', 'errores', 'ref', 'na']
  },
  {
    id: 'sumifs',
    nameEn: 'SUMIFS',
    category: 'math',
    exampleFormula: '=SUMIFS(D2:D100, B2:B100, "México", C2:C100, ">1000")',
    nameByLocale: {
      es: 'SUMAR.SI.CONJUNTO',
      en: 'SUMIFS',
      de: 'SUMMEWENNS',
      fr: 'SOMME.SI.ENS',
      ja: 'SUMIFS',
      pt: 'SOMASES'
    },
    descriptionByLocale: {
      es: 'Suma las celdas de un rango que cumplen múltiples criterios y condiciones simultáneas.',
      en: 'Adds the cells in a range that meet multiple criteria across different columns.',
      de: 'Summiert die Zellen in einem Bereich, die mehrere Bedingungen erfüllen.',
      fr: 'Additionne les cellules d\'une plage répondant à plusieurs critères simultanés.',
      ja: '複数の条件すべてに一致するセルの数値を合計します。',
      pt: 'Soma as células em um intervalo que atendem a múltiplos critérios simultaneamente.'
    },
    syntaxByLocale: {
      es: '=SUMAR.SI.CONJUNTO(rango_suma; rango_criterios1; criterio1; [rango_criterios2; criterio2])',
      en: '=SUMIFS(sum_range, criteria_range1, criteria1, [criteria_range2, criteria2])',
      de: '=SUMMEWENNS(Summe_Bereich; Kriterien_Bereich1; Kriterium1; [Kriterien_Bereich2; Kriterium2])',
      fr: '=SOMME.SI.ENS(plage_somme; plage_critères1; critère1; [plage_critères2; critère2])',
      ja: '=SUMIFS(合計対象範囲, 条件範囲1, 条件1, [条件範囲2, 条件2])',
      pt: '=SOMASES(intervalo_soma; intervalo_critérios1; critérios1; [intervalo_critérios2; critérios2])'
    },
    exampleContextByLocale: {
      es: 'Suma ventas (col D) donde el País sea "México" y el Monto sea mayor a 1000.',
      en: 'Sums revenue (col D) where Country is "Mexico" and Amount > 1000.',
      de: 'Summiert Umsatz (Spalte D), wenn Land "Mexiko" und Betrag > 1000 ist.',
      fr: 'Additionne le CA (col D) où le pays est "Mexique" et le montant > 1000.',
      ja: '国が「メキシコ」かつ金額が1000超の売上を合計します。',
      pt: 'Soma as vendas (col D) onde o País é "México" e o valor > 1000.'
    },
    exampleResultByLocale: {
      es: '$48,200.00',
      en: '$48,200.00',
      de: '48.200,00 €',
      fr: '48 200,00 €',
      ja: '¥4,820,000',
      pt: 'R$ 48.200,00'
    },
    proTipByLocale: {
      es: 'A diferencia de SUMAR.SI, en SUMAR.SI.CONJUNTO el rango que se suma va PRIMERO en los argumentos.',
      en: 'Unlike SUMIF, in SUMIFS the sum_range comes FIRST in the argument list.',
      de: 'Im Gegensatz zu SUMMEWENN steht bei SUMMEWENNS der Summenbereich an ERSTER Stelle.',
      fr: 'Contrairement à SOMME.SI, la plage à additionner est le PREMIER argument.',
      ja: 'SUMIFとは異なり、合計対象範囲が「最初」の引数になる点に注意してください。',
      pt: 'Ao contrário do SOMASE, no SOMASES o intervalo_soma vem em PRIMEIRO lugar.'
    },
    tags: ['sumar.si.conjunto', 'sumifs', 'somases', 'summewenns', 'filtros']
  }
];
