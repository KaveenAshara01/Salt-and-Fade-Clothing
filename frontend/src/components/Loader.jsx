import { Sun } from 'lucide-react';
const Loader = ({ fullScreen = false, size, className = '' }) => <div role="status" aria-label="Loading" className={`loader-container ${fullScreen ? 'full-screen' : ''} ${className}`}><div className="sun-loading"><Sun size={size || (fullScreen ? 56 : 24)} />{fullScreen && <span>A LITTLE SUNSHINE IS ON THE WAY</span>}</div></div>;
export default Loader;
