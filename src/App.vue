<template>
  <!-- Nav -->
  <nav id="nav">
    <a href="#" class="icon solid fa-hand-spock"><span>Me</span></a>
    <a href="#education" class="icon solid fa-graduation-cap"><span>Edu</span></a>
    <a href="#publications" class="icon solid fa-book"><span>Pub</span></a>
    <a href="#curriculum-vitae" class="icon solid fa-id-badge"><span>CV</span></a>
  </nav>

  <!-- Main -->
  <main id="main">
    <button @click="this.count++">Count up =)</button>
  </main>

  <!-- Footer -->
  <div id="footer">
    <ul class="copyright">
      <li>&copy;2022 Selina Abel</li>
      <li>Design:&nbsp;&nbsp;<a href="http://html5up.net" target="_blank">HTML5 UP</a></li>
      <li>Social:&nbsp;&nbsp;<a href="https://twitter.com/SelinaAbel" target="_blank"
                                class="icon brands fa-twitter"></a></li>
    </ul>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      // noop
    };
  },
};
</script>
