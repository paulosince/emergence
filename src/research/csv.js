// RFC 4180-compatible field escaping for reproducible research tables.
export function toCsv(rows, columns) {
  if (!Array.isArray(rows) || !Array.isArray(columns) || columns.length === 0) {
    throw new TypeError('Provide rows and a non-empty list of columns');
  }
  if (columns.some(col => typeof col !== 'string' || !col)) {
    throw new TypeError('Column names must be non-empty strings');
  }
  const field = value => {
    const s = value == null ? '' : String(value);
    return /[",\r\n]/.test(s) ? '"' + s.replaceAll('"', '""') + '"' : s;
  };
  const line = values => values.map(field).join(',');
  return [line(columns), ...rows.map(row => line(columns.map(col => row[col])))].join('\r\n') + '\r\n';
}
