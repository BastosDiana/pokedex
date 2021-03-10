import Pokedex from '..';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import mockDataPikachu from './mock-data/pikachu';

let mockFetch;

beforeEach(() => {
    mockFetch = jest.spyOn(global, 'fetch').mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockDataPikachu)
    });
});
  
afterEach(() => {
    jest.restoreAllMocks();
});

describe('Pokedex component', () => {
    it('matches the snapshot', () => {
        const { asFragment } = render(<Pokedex />);
        expect(asFragment).toMatchSnapshot();
    });

    it('should display the right pokemon when I search for it', async () => {
        render(<Pokedex />);
        const input = screen.getByLabelText('input-search');

        act(() => {
            fireEvent.change(input, { target: { value: mockDataPikachu.name } })
        });

        act(() => {
            userEvent.click(screen.getByText('Search'))
        });

        await waitFor(() => screen.getByText(mockDataPikachu.name));

        expect(mockFetch).toBeCalled();

        expect(screen.getByTestId('pokemon-name')).toHaveTextContent(mockDataPikachu.name);

        expect(screen.getByTestId('pokemon-id')).toHaveTextContent(mockDataPikachu.id);

        const img = document.querySelector('img');

        expect(img.src).toContain(mockDataPikachu.sprites.front_default);
    });
});
   