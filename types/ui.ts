/** Single breadcrumb item (label and optional href). */
export interface Crumb {
  label: string;
  href?: string;
}

/** Table column definition: header, accessor key, optional render. Use key when accessor would duplicate (e.g. multiple action columns). */
export interface Column<T> {
  header: string;
  accessor: keyof T;
  /** Optional React list key; defaults to accessor. Use for unique keys when multiple columns share an accessor. */
  key?: string;
  render?: (row: T) => React.ReactNode;
}

/** Option for select/dropdown (value + label). */
export interface SelectOption {
  value: string;
  label: string;
}
