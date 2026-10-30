/**
 * APAAR CONNECT AI - CSV Engine
 * Robust CSV parser & exporter with column mapping & error detection
 */

export interface ParsedCsvRow {
  student_name?: string;
  apaar_id?: string;
  student_id?: string;
  institution?: string;
  programme?: string;
  academic_year?: string;
  admission_category?: string;
  admission_date?: string;
  dob?: string;
  gender?: string;
  [key: string]: string | undefined;
}

export interface ParseResult {
  headers: string[];
  rows: Record<string, string>[];
  totalRows: number;
  errors: string[];
}

export function parseCsvString(csvText: string): ParseResult {
  const lines = csvText
    .split(/\r\n|\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    return { headers: [], rows: [], totalRows: 0, errors: ['CSV file is empty.'] };
  }

  // Parse header
  const headers = parseCsvLine(lines[0]);
  const rows: Record<string, string>[] = [];
  const errors: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const rawTokens = parseCsvLine(lines[i]);
    if (rawTokens.length === 0) continue;

    const rowObj: Record<string, string> = {};
    headers.forEach((header, index) => {
      rowObj[header.trim()] = rawTokens[index]?.trim() || '';
    });
    rows.push(rowObj);
  }

  return {
    headers,
    rows,
    totalRows: rows.length,
    errors,
  };
}

function parseCsvLine(line: string): string[] {
  const tokens: string[] = [];
  let currentToken = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"' || char === "'") {
      insideQuotes = !insideQuotes;
    } else if (char === ',' && !insideQuotes) {
      tokens.push(currentToken.trim());
      currentToken = '';
    } else {
      currentToken += char;
    }
  }
  tokens.push(currentToken.trim());
  return tokens;
}

/**
 * Downloads data as a CSV file in the browser
 */
export function exportToCsv(filename: string, rows: Record<string, any>[]): void {
  if (!rows || rows.length === 0) return;

  const headers = Object.keys(rows[0]);
  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      headers
        .map((h) => {
          const val = row[h] === undefined || row[h] === null ? '' : String(row[h]);
          return `"${val.replace(/"/g, '""')}"`;
        })
        .join(',')
    ),
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
