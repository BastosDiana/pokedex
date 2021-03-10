import React, { useState, useEffect, useCallback } from 'react';
import Loading from '../loading';
import { lookup } from '../../utils/pokeapi';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import LazyImg from '../lazy-img';
import classnames from 'classnames';
import styles from'./Pokedex.module.css';

// Couldn't find a way to traverse the list to find last id,
// apparently there are pokemons beyond 898 but couldn't find a way to
// find last id in the API, using this constant
const LAST_POKEMON_ID = 898;

// Due to latest update in React, I'm getting an error
// "findDOMNode was passed an instance of Transition which is inside StrictMode"
// This is a problem with ReactTransitionGroup, and should be fixed soon
// https://github.com/reactjs/react-transition-group/pull/468

const Pokedex = () => {
    const [status, setStatus] = useState('initial'); // enum: initial, loading, error, success
    const [inputValue, setInputValue] = useState('');
    const [pokemonDetails, setPokemonDetails] = useState();

    useEffect(() => {
        if (status === 'loading') { // reset data from previous pokemon
            setPokemonDetails(null);
        }
    }, [status]);

    const handleOnSubmit = useCallback((e) => {
        e.preventDefault();

        // if already loading, ignore this request
        if (status === 'loading') {
            return;
        }

        // if user searched for same pokemon, skip search
        if (inputValue === pokemonDetails?.name) {
            return;
        }

        lookupPokemon(inputValue);
    }, [status, inputValue, pokemonDetails]);
    
    const lookupPokemon = async (idOrName) => {
        const query = typeof idOrName === 'string' ? idOrName.toLowerCase() : idOrName;

        setStatus('loading');

        try {
            const pokemon = await lookup(query);

            setPokemonDetails({
                id: pokemon.id,
                name: pokemon.name,
                sprites: pokemon.sprites
            });
    
            setStatus('success');
        } catch (error) {
            // clear last fetched pokemon
            setPokemonDetails();
            setStatus('error');
        }
    };

    const handleNavClick = (id) => {
        // if already loading, ignore this request
        if (status === 'loading') {
            return;
        }

        lookupPokemon(id);
        setInputValue('');
    };

    return (
        <div className={ styles.container }>
            <h1>Pokedex</h1>
            <div className={ styles.content }>
                <SwitchTransition mode='out-in'>
                    <CSSTransition
                        key={status === 'success' ? `success-${ pokemonDetails.id }` : status }
                        timeout={ 250 }
                        classNames={ 
                            {
                                enter: styles['content-fade-enter'],
                                enterActive: styles['content-fade-enter-active'],
                                exit: styles['content-fade-exit'],
                                exitActive: styles['content-fade-exit-active'],
                               }
                            }>
                        <>
                            { status === 'initial' && <h3 className={ styles.subtitle }>What Pokémon are you looking for?</h3> }
                            { status === 'loading' && <Loading /> }
                            { status === 'error' && <p className={ styles.subtitle }>Could not found that Pokémon :(</p> }
                            { status === 'success' && 
                                <div className={ styles.success }>
                                    <div className={ styles['success-content'] }>
                                        <button 
                                            aria-label='navigation-left'
                                            disabled={ pokemonDetails.id === 1 }
                                            className={ styles['button-navigation'] }
                                            onClick={ () => handleNavClick(pokemonDetails.id - 1) }>
                                            <p className={ styles['button-navigation-left'] }><i className={ classnames(styles['arrow-navigation'], styles['arrow-left']) }></i></p>
                                        </button>
                                        <div className={styles.sprite}>
                                            <LazyImg
                                                src={ pokemonDetails.sprites.front_default }
                                                alt={ pokemonDetails.name + ' front' } />
                                        </div>
                                        <button 
                                            aria-label='navigation-right'
                                            disabled={ pokemonDetails.id === LAST_POKEMON_ID }
                                            className={ styles['button-navigation'] }
                                            onClick={ () => handleNavClick(pokemonDetails.id + 1) }>
                                            <p className={ styles['button-navigation-right'] }><i className={ classnames(styles['arrow-navigation'], styles['arrow-right']) }></i></p>
                                        </button>
                                    </div>
                                    <div className={ styles.details }>
                                        <p data-testid='pokemon-id' className={ styles['details-id'] }>#{ pokemonDetails.id }</p>
                                        <p data-testid='pokemon-name' className={ styles['details-name'] }>{ (pokemonDetails.name) }</p>
                                    </div>
                                </div> }
                        </>
                    </CSSTransition>
                </SwitchTransition>
            </div>

            <form onSubmit={ handleOnSubmit }>
                <input 
                    aria-label='input-search'
                    placeholder='Enter the Pokémon name'
                    value={ inputValue }
                    onChange={ (e) => setInputValue(e.target.value) }
                    disabled={ status === 'loading' }
                    className={ classnames(styles['form-container'], styles['form-input']) }
                />
                <button 
                    aria-label='button-search'
                    disabled={ inputValue === '' || status === 'loading' } 
                    type='submit' 
                    className={ classnames(styles['form-container'], styles['form-submit']) }>Search
                </button>
            </form>
        </div>
    )
}

export default Pokedex;