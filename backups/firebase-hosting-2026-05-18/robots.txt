<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, viewport-fit=cover" />
    <title>TRUE CONCEPT Learning Portal</title>

    <!-- PWA -->
    <link rel="manifest" href="/manifest.json" />
    <meta name="theme-color" content="#da6b45" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="TrueConcept" />

    <!-- Icons -->
    <link rel="icon" type="image/svg+xml" href="/icons/icon.svg" />
    <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192.png" />
    <link rel="apple-touch-icon" href="/icons/icon-192.png" />
    <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152.png" />

    <!-- SEO / OG -->
    <meta name="description" content="NCERT Class IX & X Learning Portal — Notes, MCQs, Q&A and Virtual Lab" />
    <meta name="application-name" content="TRUE CONCEPT" />

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+Bengali:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <script>
      // Pre-paint theme application — prevents light-mode flash on dark theme load.
      (function () {
        try {
          var stored = localStorage.getItem('trueconcept_theme');
          var theme = stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
          var resolved = theme === 'system'
            ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
            : theme;
          if (resolved === 'dark') {
            document.documentElement.classList.add('dark');
            document.documentElement.style.colorScheme = 'dark';
          } else {
            document.documentElement.style.colorScheme = 'light';
          }
        } catch (e) {}
      })();
    </script>
    <script type="module" crossorigin src="/assets/index-CkhNTvuD.js"></script>
    <link rel="stylesheet" crossorigin href="/assets/index-BOk7OgtI.css">
  <link rel="manifest" href="/manifest.webmanifest"></head>
  <body>
    <div id="root"></div>
  </body>
</html>
