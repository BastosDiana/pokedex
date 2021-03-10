import { useState, useCallback } from 'react';
import classnames from 'classnames';
import styles from './LazyImg.module.css';

const LazyImg = (props) => {
    const [imgLoaded, setImgLoaded] = useState(false);

    const handleOnLoad = useCallback(() => {
        setImgLoaded(true);
    }, []);

    return (
        // eslint-disable-next-line jsx-a11y/alt-text
        <img
            {...props}
            className={ classnames(styles['lazy-img'], !imgLoaded && styles.loading) }
            onLoad={ handleOnLoad }
            />
    );
}

export default LazyImg;