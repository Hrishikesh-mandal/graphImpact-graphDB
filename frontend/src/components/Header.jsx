function Header() {
    return (
        <header className="header">
            <div>
                <h1>GraphImpact</h1>

                <p>
                    Explore service dependencies,
                    impact, and relationships using
                    graph traversal.
                </p>
            </div>

            <div className="status">
                <span className="status-dot"></span>
                GraphDB Connected
            </div>
        </header>
    );
}

export default Header;