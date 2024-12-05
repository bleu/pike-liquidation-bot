import { JSONSchema } from 'json-schema-to-ts';

export const AddressSchema = {
  type: 'string',
  pattern: '^0x[a-fA-F0-9]{40}$',
  title: 'Address',
  description: 'Ethereum address',
} as const satisfies JSONSchema;

export const PriceSchema = {
  type: 'string',
  title: 'Price',
  description: 'Price value in wei',
  examples: ['1000000000000000000'],
} as const satisfies JSONSchema;
