import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the SimpliCulinary brand', () => {
  render(<App />);
  expect(screen.getAllByText(/Culinary/i).length).toBeGreaterThan(0);
});
