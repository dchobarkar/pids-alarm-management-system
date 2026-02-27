export interface Crumb {
  label: string;
  href?: string;
}

export interface Column<T> {
  header: string;
  accessor: keyof T;
  render?: (row: T) => React.ReactNode;
}

export interface SelectOption {
  value: string;
  label: string;
}
