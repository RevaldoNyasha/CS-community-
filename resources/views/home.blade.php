<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>DEV-CRAFT — CS Community</title>
    <meta name="description" content="DEV-CRAFT is a platform for computer science students to share resources, collaborate on hackathons, showcase projects, and grow together as a community.">
    <link rel="icon" href="/newIcons/navbarIcon.png" type="image/png">
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700" rel="stylesheet" />
    <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; background: #0d1117; color: #e6edf3; min-height: 100vh; display: flex; flex-direction: column; }
        a { color: inherit; text-decoration: none; }
        header { padding: 1.25rem 2rem; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #21262d; }
        .logo { display: flex; align-items: center; gap: 0.625rem; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: #e6edf3; }
        .logo img { width: 2rem; height: 2rem; object-fit: contain; }
        .nav-links { display: flex; align-items: center; gap: 1.5rem; }
        .nav-links a { font-size: 0.875rem; color: #8b949e; transition: color 0.2s; }
        .nav-links a:hover { color: #e6edf3; }
        .btn { font-size: 0.875rem; font-weight: 600; padding: 0.5rem 1.25rem; border-radius: 0.5rem; background: #238636; color: #fff; transition: background 0.2s; }
        .btn:hover { background: #2ea043; }
        main { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 5rem 2rem; text-align: center; }
        h1 { font-size: clamp(2rem, 5vw, 3.75rem); font-weight: 700; line-height: 1.15; color: #e6edf3; margin-bottom: 1.5rem; }
        .subtitle { font-size: 1.125rem; color: #8b949e; max-width: 42rem; line-height: 1.75; margin-bottom: 2.5rem; }
        .purpose { font-size: 0.95rem; color: #8b949e; max-width: 38rem; line-height: 1.7; margin-bottom: 3rem; background: #161b22; border: 1px solid #21262d; border-radius: 0.75rem; padding: 1.5rem; }
        .purpose strong { color: #e6edf3; }
        .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; max-width: 700px; width: 100%; margin-bottom: 3rem; }
        .card { background: #161b22; border: 1px solid #21262d; border-radius: 0.75rem; padding: 1.25rem; text-align: left; }
        .card h3 { font-size: 0.9rem; font-weight: 600; color: #e6edf3; margin-bottom: 0.5rem; }
        .card p { font-size: 0.8rem; color: #8b949e; line-height: 1.6; }
        .cta { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; justify-content: center; }
        .cta-primary { font-size: 0.9rem; font-weight: 600; padding: 0.75rem 2rem; border-radius: 0.5rem; background: #238636; color: #fff; transition: background 0.2s; }
        .cta-primary:hover { background: #2ea043; }
        .cta-secondary { font-size: 0.9rem; color: #8b949e; transition: color 0.2s; }
        .cta-secondary:hover { color: #e6edf3; }
        footer { border-top: 1px solid #21262d; padding: 1.5rem 2rem; display: flex; align-items: center; justify-content: center; gap: 2rem; flex-wrap: wrap; }
        footer span, footer a { font-size: 0.8rem; color: #8b949e; }
        footer a:hover { color: #e6edf3; }
        .toast { position: fixed; bottom: 1.5rem; left: 1.5rem; background: #161b22; border: 1px solid #21262d; border-radius: 0.75rem; padding: 0.75rem 1rem; font-size: 0.75rem; color: #8b949e; display: flex; align-items: center; gap: 0.5rem; box-shadow: 0 8px 24px rgba(0,0,0,0.4); }
        .toast a { color: #58a6ff; font-weight: 600; }
        .toast a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <header>
        <a href="/" class="logo">
            <img src="/newIcons/navbarIcon.png" alt="DEV-CRAFT logo">
            DEV-CRAFT
        </a>
        <nav class="nav-links">
            <a href="/hackathons">Hackathons</a>
            <a href="/projects">Projects</a>
            <a href="/resources">Resources</a>
            <a href="/login" class="btn">Log in</a>
        </nav>
    </header>

    <main>
        <h1>Build. Share. Grow&nbsp;together.</h1>

        <p class="subtitle">
            DEV-CRAFT is a community platform built for computer science students to share knowledge, showcase projects, and collaborate on hackathons.
        </p>

        <div class="purpose">
            <strong>Why we request your Google account data:</strong> We use your name and email address only to create and identify your account on DEV-CRAFT. We do not share your data with third parties or use it for advertising.
        </div>

        <div class="cards">
            <div class="card">
                <h3>🏆 Hackathons</h3>
                <p>Discover and join upcoming hackathons in the CS community.</p>
            </div>
            <div class="card">
                <h3>📁 Projects</h3>
                <p>Browse community-built projects and showcase your own work.</p>
            </div>
            <div class="card">
                <h3>📚 Resources</h3>
                <p>Access study materials and guides shared by fellow students.</p>
            </div>
        </div>

        <div class="cta">
            <a href="/register" class="cta-primary">Get started for free</a>
            <a href="/login" class="cta-secondary">Already have an account? Log in →</a>
        </div>
    </main>

    <footer>
        <span>© {{ date('Y') }} DEV-CRAFT</span>
        <a href="/privacy">Privacy Policy</a>
        <a href="/terms">Terms of Service</a>
    </footer>

    <div class="toast">
        By using DEV-CRAFT you agree to our
        <a href="/terms">Terms</a> &amp; <a href="/privacy">Privacy Policy</a>
    </div>
</body>
</html>
