import formatAddress from '../formatAddress';

const US_TEMPLATE =
  '{name}\n{organization}\n{street_address}\n{city}, {state} {zip}';
const IN_TEMPLATE =
  '{name}\n{organization}\n{street_address}\n{city} {zip}\n{state}';
const DE_TEMPLATE = '{name}\n{organization}\n{street_address}\n{zip} {city}';
const JP_TEMPLATE =
  '〒{zip}\n{state}\n{street_address}\n{organization}\n{name}';
const BR_TEMPLATE =
  '{organization}\n{name}\n{street_address}\n{district}\n{city}-{state}\n{zip}';
const BF_TEMPLATE =
  '{name}\n{organization}\n{street_address}\n{city} {sorting_code}';

describe('formatAddress', () => {
  describe('full substitution', () => {
    it('formats a US address with all fields', () => {
      expect(
        formatAddress(US_TEMPLATE, {
          name: 'John Doe',
          organization: 'Acme Corp',
          street_address: '1600 Amphitheatre Pkwy',
          city: 'Mountain View',
          state: 'CA',
          zip: '94043',
        }),
      ).toBe(
        'John Doe\nAcme Corp\n1600 Amphitheatre Pkwy\nMountain View, CA 94043',
      );
    });

    it('formats an IN address with all fields', () => {
      expect(
        formatAddress(IN_TEMPLATE, {
          name: 'Rahul Sharma',
          organization: 'Razorpay',
          street_address: 'SJR Cyber, 22, Laskar Hosur Rd',
          city: 'Bengaluru',
          zip: '560102',
          state: 'Karnataka',
        }),
      ).toBe(
        'Rahul Sharma\nRazorpay\nSJR Cyber, 22, Laskar Hosur Rd\nBengaluru 560102\nKarnataka',
      );
    });

    it('formats a DE address (no state field)', () => {
      expect(
        formatAddress(DE_TEMPLATE, {
          name: 'Hans Müller',
          organization: 'Beispiel GmbH',
          street_address: 'Musterstraße 1',
          zip: '10115',
          city: 'Berlin',
        }),
      ).toBe('Hans Müller\nBeispiel GmbH\nMusterstraße 1\n10115 Berlin');
    });

    it('formats a JP address (reversed field order)', () => {
      expect(
        formatAddress(JP_TEMPLATE, {
          zip: '100-0001',
          state: '東京都',
          street_address: '千代田1-1',
          organization: '株式会社テスト',
          name: '山田太郎',
        }),
      ).toBe('〒100-0001\n東京都\n千代田1-1\n株式会社テスト\n山田太郎');
    });

    it('formats a BR address with district field', () => {
      expect(
        formatAddress(BR_TEMPLATE, {
          organization: 'Empresa Ltda',
          name: 'João Silva',
          street_address: 'Rua das Flores, 123',
          district: 'Centro',
          city: 'São Paulo',
          state: 'SP',
          zip: '01310-100',
        }),
      ).toBe(
        'Empresa Ltda\nJoão Silva\nRua das Flores, 123\nCentro\nSão Paulo-SP\n01310-100',
      );
    });

    it('formats a BF address with sorting_code field', () => {
      expect(
        formatAddress(BF_TEMPLATE, {
          name: 'Fatima Ouedraogo',
          street_address: 'Avenue Kwame Nkrumah',
          city: 'Ouagadougou',
          sorting_code: '01 BP 10',
        }),
      ).toBe('Fatima Ouedraogo\nAvenue Kwame Nkrumah\nOuagadougou 01 BP 10');
    });
  });

  describe('blank line removal', () => {
    it('removes the organization line when organization is omitted', () => {
      expect(
        formatAddress(US_TEMPLATE, {
          name: 'Jane Smith',
          street_address: '742 Evergreen Terrace',
          city: 'Springfield',
          state: 'IL',
          zip: '62704',
        }),
      ).toBe('Jane Smith\n742 Evergreen Terrace\nSpringfield, IL 62704');
    });

    it('removes name and organization lines when both are omitted', () => {
      expect(
        formatAddress(US_TEMPLATE, {
          street_address: '1 Main St',
          city: 'Boston',
          state: 'MA',
          zip: '02101',
        }),
      ).toBe('1 Main St\nBoston, MA 02101');
    });

    it('removes district line when district is omitted (BR)', () => {
      expect(
        formatAddress(BR_TEMPLATE, {
          name: 'Carlos',
          street_address: 'Rua A, 10',
          city: 'Rio de Janeiro',
          state: 'RJ',
          zip: '20040-020',
        }),
      ).toBe('Carlos\nRua A, 10\nRio de Janeiro-RJ\n20040-020');
    });

    it('keeps a line that has literal separators even if some tokens are empty', () => {
      // US: "{city}, {state} {zip}" with no state → "Springfield,  62704" — non-blank, kept
      expect(
        formatAddress(US_TEMPLATE, {
          name: 'Bob',
          street_address: '1 Park Ave',
          city: 'Springfield',
          zip: '62701',
        }),
      ).toBe('Bob\n1 Park Ave\nSpringfield,  62701');
    });

    it('returns empty string when all fields are omitted and template has no literals', () => {
      expect(formatAddress(DE_TEMPLATE, {})).toBe('');
    });

    it('keeps lines with literal separators even when all tokens are empty', () => {
      // US: "{city}, {state} {zip}" → ",  " → trims to "," — non-blank, kept
      expect(formatAddress(US_TEMPLATE, {})).toBe(',');
    });
  });

  describe('custom templates', () => {
    it('handles a single-line template', () => {
      expect(
        formatAddress('{name}, {city}', { name: 'Alice', city: 'Paris' }),
      ).toBe('Alice, Paris');
    });

    it('handles a template with only one supported field', () => {
      expect(formatAddress('{zip}', { zip: '10001' })).toBe('10001');
    });

    it('handles unknown placeholders unchanged', () => {
      expect(formatAddress('{name}\n{unknown_field}', { name: 'Alice' })).toBe(
        'Alice\n{unknown_field}',
      );
    });

    it('trims whitespace from each line', () => {
      expect(
        formatAddress('  {name}  \n  {city}  ', {
          name: 'Alice',
          city: 'Paris',
        }),
      ).toBe('Alice\nParis');
    });
  });

  describe('error cases', () => {
    it('throws for empty template string', () => {
      expect(() => formatAddress('', { name: 'Alice' })).toThrow();
    });

    it('throws for whitespace-only template', () => {
      expect(() => formatAddress('   ', { name: 'Alice' })).toThrow(
        'template must be a non-empty string.',
      );
    });

    it('throws for null template', () => {
      // @ts-expect-error testing invalid type
      expect(() => formatAddress(null, {})).toThrow();
    });

    it('returns empty string for empty components object', () => {
      expect(formatAddress(DE_TEMPLATE, {})).toBe('');
    });
  });
});
