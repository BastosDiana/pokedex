import classnames from 'classnames';
import styles from './Loading.module.css';

const Loading = ({ className }) => {
    return (
        <div className={ classnames(styles.loading, className) }><div></div><div></div></div>
    );
};

export default Loading;