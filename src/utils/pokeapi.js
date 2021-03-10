const apiUrl = 'https://pokeapi.co/api/v2';

export const lookup = async (idOrName) => {
    const response = await fetch(`${apiUrl}/pokemon/${idOrName}`);

    return response.json();
};