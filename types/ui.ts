/** Single breadcrumb item (label and optional href). */
export interface Crumb {
  label: string;
  href?: string;
}

/** Table column definition: header, accessor key, optional render. */
export interface Column<T> {
  header: string;
  accessor: keyof T;
  render?: (row: T) => React.ReactNode;
}

/** Option for select/dropdown (value + label). */
export interface SelectOption {
  value: string;
  label: string;
}
