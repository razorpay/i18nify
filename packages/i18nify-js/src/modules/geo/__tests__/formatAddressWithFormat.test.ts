import formatAddressWithFormat from '../formatAddressWithFormat';

jest.mock('../getAddressInfo', () => ({
  getAddressInfo: jest.fn((code: string) => {
    const DATA: Record<string, { template: string }> = {
      // city, state, zip on one line — most common US pattern
      US: {
        template:
          '{name}\n{organization}\n{street_address}\n{city}, {state} {zip}',
      },
      // city and zip on same line, state on its own line
      IN: {
        template:
          '{name}\n{organization}\n{street_address}\n{city} {zip}\n{state}',
      },
      // no state field
      DE: {
        template: '{name}\n{organization}\n{street_address}\n{zip} {city}',
      },
      // district field
      BR: {
        template:
          '{organization}\n{name}\n{street_address}\n{district}\n{city}-{state}\n{zip}',
      },
      // sorting_code field
      BF: {
        template:
          '{name}\n{organization}\n{street_address}\n{city} {sorting_code}',
      },
      // reversed order (name last)
      JP: {
        template: '〒{zip}\n{state}\n{street_address}\n{organization}\n{name}',
      },
    };
    return DATA[code] ?? null;
  }),
}));

describe('formatAddressWithFormat', () => {
  describe('full substitution', () => {
    it('formats a US address with all fields', () => {
      const result = formatAddressWithFormat('US', {
        name: 'John Doe',
        organization: 'Acme Corp',
        street_address: '1600 Amphitheatre Pkwy',
        city: 'Mountain View',
        state: 'CA',
        zip: '94043',
      });
      expect(result).toBe(
        'John Doe\nAcme Corp\n1600 Amphitheatre Pkwy\nMountain View, CA 94043',
      );
    });

    it('formats an IN address with all fields', () => {
      const result = formatAddressWithFormat('IN', {
        name: 'Rahul Sharma',
        organization: 'Razorpay',
        street_address: 'SJR Cyber, 22, Laskar Hosur Rd',
        city: 'Bengaluru',
        zip: '560102',
        state: 'Karnataka',
      });
      expect(result).toBe(
        'Rahul Sharma\nRazorpay\nSJR Cyber, 22, Laskar Hosur Rd\nBengaluru 560102\nKarnataka',
      );
    });

    it('formats a DE address (no state field)', () => {
      const result = formatAddressWithFormat('DE', {
        name: 'Hans Müller',
        organization: 'Beispiel GmbH',
        street_address: 'Musterstraße 1',
        zip: '10115',
        city: 'Berlin',
      });
      expect(result).toBe(
        'Hans Müller\nBeispiel GmbH\nMusterstraße 1\n10115 Berlin',
      );
    });

    it('formats a JP address (reversed field order)', () => {
      const result = formatAddressWithFormat('JP', {
        zip: '100-0001',
        state: '東京都',
        street_address: '千代田1-1',
        organization: '株式会社テスト',
        name: '山田太郎',
      });
      expect(result).toBe(
        '〒100-0001\n東京都\n千代田1-1\n株式会社テスト\n山田太郎',
      );
    });

    it('formats a BR address with district field', () => {
      const result = formatAddressWithFormat('BR', {
        organization: 'Empresa Ltda',
        name: 'João Silva',
        street_address: 'Rua das Flores, 123',
        district: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        zip: '01310-100',
      });
      expect(result).toBe(
        'Empresa Ltda\nJoão Silva\nRua das Flores, 123\nCentro\nSão Paulo-SP\n01310-100',
      );
    });

    it('formats a BF address with sorting_code field', () => {
      const result = formatAddressWithFormat('BF', {
        name: 'Fatima Ouedraogo',
        organization: '',
        street_address: 'Avenue Kwame Nkrumah',
        city: 'Ouagadougou',
        sorting_code: '01 BP 10',
      });
      expect(result).toBe(
        'Fatima Ouedraogo\nAvenue Kwame Nkrumah\nOuagadougou 01 BP 10',
      );
    });
  });

  describe('blank line removal', () => {
    it('removes the organization line when organization is omitted', () => {
      const result = formatAddressWithFormat('US', {
        name: 'Jane Smith',
        street_address: '742 Evergreen Terrace',
        city: 'Springfield',
        state: 'IL',
        zip: '62704',
      });
      expect(result).toBe(
        'Jane Smith\n742 Evergreen Terrace\nSpringfield, IL 62704',
      );
    });

    it('removes the name line when name is omitted', () => {
      const result = formatAddressWithFormat('US', {
        organization: 'ACME',
        street_address: '1 Main St',
        city: 'Boston',
        state: 'MA',
        zip: '02101',
      });
      expect(result).toBe('ACME\n1 Main St\nBoston, MA 02101');
    });

    it('removes multiple blank optional lines at once', () => {
      // omit organization and state — US template has state inline with city/zip
      // so state being empty leaves "city,  zip" — not a blank line, still kept
      const result = formatAddressWithFormat('DE', {
        street_address: 'Unter den Linden 77',
        city: 'Berlin',
        zip: '10117',
      });
      expect(result).toBe('Unter den Linden 77\n10117 Berlin');
    });

    it('keeps a line that has non-empty tokens even if some tokens on that line are empty', () => {
      // US: "{city}, {state} {zip}" — omitting state leaves "Springfield,  62704"
      // after trim → "Springfield,  62704" which is non-empty (kept)
      const result = formatAddressWithFormat('US', {
        name: 'Bob',
        street_address: '1 Park Ave',
        city: 'Springfield',
        zip: '62701',
      });
      expect(result).toBe('Bob\n1 Park Ave\nSpringfield,  62701');
    });

    it('removes district line when district is omitted (BR)', () => {
      const result = formatAddressWithFormat('BR', {
        name: 'Carlos',
        street_address: 'Rua A, 10',
        city: 'Rio de Janeiro',
        state: 'RJ',
        zip: '20040-020',
      });
      expect(result).toBe('Carlos\nRua A, 10\nRio de Janeiro-RJ\n20040-020');
    });
  });

  describe('error handling', () => {
    it('throws when country code is not found', () => {
      expect(() =>
        formatAddressWithFormat('ZZ', {
          name: 'Test',
          street_address: '1 Main St',
        }),
      ).toThrow(
        'formatAddressWithFormat: address format for country code "ZZ" not found.',
      );
    });

    it('throws for empty string country code', () => {
      expect(() => formatAddressWithFormat('', {})).toThrow(
        'formatAddressWithFormat: address format for country code "" not found.',
      );
    });
  });

  describe('empty components', () => {
    it('returns only the non-blank lines when all optional fields are empty', () => {
      const result = formatAddressWithFormat('US', {
        street_address: '99 Test Blvd',
        city: 'Nowhere',
        state: 'NY',
        zip: '10001',
      });
      expect(result).toBe('99 Test Blvd\nNowhere, NY 10001');
    });

    it('keeps lines with literal separators even when all tokens are empty', () => {
      // US template line "{city}, {state} {zip}" has a literal "," — after substitution
      // it becomes ", " which trims to "," — non-blank, so it is kept.
      const result = formatAddressWithFormat('US', {});
      expect(result).toBe(',');
    });

    it('returns empty string when the template has only bare token lines', () => {
      // DE template: each token is on its own line with no literal separators
      const result = formatAddressWithFormat('DE', {});
      expect(result).toBe('');
    });
  });
});
