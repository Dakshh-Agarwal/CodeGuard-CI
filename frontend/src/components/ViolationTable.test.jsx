import { render, screen } from '@testing-library/react';
import { createElement } from 'react';
import ViolationTable from './ViolationTable';

describe('ViolationTable', () => {
  it('shows empty state when there are no violations', () => {
    render(createElement(ViolationTable, { violations: [] }));

    expect(screen.getByText(/No violations found/i)).toBeInTheDocument();
  });

  it('renders violation rows when violations are present', () => {
    render(
      createElement(ViolationTable, {
        violations: [
          {
            id: 'v1',
            severity: 'WARNING',
            tool: 'PMD',
            lineNumber: 12,
            rule: 'UnusedLocalVariable',
            message: 'Avoid unused local variables.',
          },
        ],
      })
    );

    expect(screen.getByText('PMD')).toBeInTheDocument();
    expect(screen.getByText('UnusedLocalVariable')).toBeInTheDocument();
    expect(screen.getByText('Warning')).toBeInTheDocument();
  });
});
