export type RoutingCodeType =
  | 'IFSC'
  | 'SWIFT'
  | 'BIC'
  | 'ROUTING_NUMBER'
  | 'ABA'
  | 'SORT_CODE'
  | 'BSB'
  | 'IBAN'
  | 'CLABE'
  | 'CNAPS'
  | 'TRANSIT'
  | 'MICR';

export interface RoutingCodeLabel {
  label: string;
  full_name: string;
  description: string;
  country?: string;
}

export interface PaymentNetworkResult {
  networks: string[];
  primary: string;
}
