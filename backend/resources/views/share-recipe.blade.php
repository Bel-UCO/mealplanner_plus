<!doctype html>
<html>
<body>
  <p>Opening app...</p>

  <a id="openBtn" href="{{ $deepLink }}" style="display:none;">Open in App</a>

  <script>
    const deepLink = "{{ $deepLink }}";
    window.location.href = deepLink;

    setTimeout(() => {
      document.getElementById("openBtn").style.display = "block";
    }, 1200);
  </script>
</body>
</html>
