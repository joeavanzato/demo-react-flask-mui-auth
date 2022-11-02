

const Navbar = () => {
    return (
        <nav className="navbar .navbar-expand navbar-expand-sm navbar-dark bg-dark">
            <a className="navbar-brand" href="/">DEMO APP</a>
            <ul className="navbar-nav">
                <li className="nav-item">
                    <a className="nav-link" href="/">Home</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/demo">Demos</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/logout">Logout</a>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar;