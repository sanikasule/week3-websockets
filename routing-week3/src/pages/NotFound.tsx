import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div style={{ textAlign: 'center', paddingTop: '80px' }}>
            <h1 style={{ fontSize: '80px' }}>404</h1>
            <p>Page not found.</p>
            <Link to='/'>Go to Dashboard</Link>
        </div>
    );
}