function expectSortedByField(
  items: any[],
  field: string,
  sortDirection: 'asc' | 'desc'
) {
  for (let i = 0; i < items.length - 1; i++) {
    const a = items[i][field];
    const b = items[i + 1][field];

    if (typeof a === 'string' && typeof b === 'string') {
      // Если поле строка, сравниваем через localeCompare
      const comparison = a.localeCompare(b);
      if (sortDirection === 'asc') {
        expect(comparison).toBeLessThanOrEqual(0);
      } else {
        expect(comparison).toBeGreaterThanOrEqual(0);
      }
    } else {
      // Для чисел и дат приводим к числовому значению
      const valA = a instanceof Date ? a.getTime() : Number(a);
      const valB = b instanceof Date ? b.getTime() : Number(b);

      if (sortDirection === 'asc') {
        expect(valA).toBeLessThanOrEqual(valB);
      } else {
        expect(valA).toBeGreaterThanOrEqual(valB);
      }
    }
  }
}

