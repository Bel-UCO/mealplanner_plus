<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Opening…</title>
</head>
<body>
  <p>Opening Expo Go…</p>
  <p>If nothing happens, <a href="{{ $deepLink }}">tap here</a>.</p>

  <script>
    const deepLink = @json($deepLink);
    window.location.href = deepLink;
  </script>
</body>
</html>
