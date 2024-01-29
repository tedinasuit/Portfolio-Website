document.addEventListener('DOMContentLoaded', function () {
  const open = document.querySelector('.container');
  const close = document.querySelector('.close');
  var tl = gsap.timeline({ defaults: { duration: 0.4, ease: 'expo.inOut' } });

  // Set initial state for nav
  gsap.set('nav', { right: '-100%', bottom: '-100%', height: '100vh' });

  open.addEventListener('click', () => {
    if (tl.reversed()) {
      tl.play();
    } else {
      const isPortrait = window.matchMedia('(orientation: portrait)').matches;

      tl.to('nav', {
        right: isPortrait ? 'auto' : 0,
        bottom: isPortrait ? 0 : 'auto',
      })
        .to('nav', { height: '100vh' }, '-=.1')
        .to('nav ul li a', { opacity: 1, pointerEvents: 'all', stagger: .1 }, '-=1')
        .to('.close', { opacity: 1, pointerEvents: 'all' }, "-=1")
        .to('nav h2', { opacity: 1 }, '-=1');
    }
  });

  close.addEventListener('click', () => {
    tl.reverse();
  });

  // Function to load pages
  function loadPage(page) {
    fetch(page)
      .then(response => response.text())
      .then(html => {
        // Fade out the current content
        gsap.to('#page-content', { opacity: 0, duration: 0.5, onComplete: function () {
          // Replace the content with the new page
          document.getElementById('page-content').innerHTML = html;
          
          // Fade in the new content
          gsap.to('#page-content', { opacity: 1, duration: 0.5 });

          // Close the navbar after loading a new page
          tl.reverse();
        } });
      })
      .catch(error => console.error('Error fetching page:', error));
  }

  // Load home.html when the website first loads
  loadPage('home.html');

  // Add event listeners for page links
  document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      const page = this.getAttribute('href');
      loadPage(page);
    });
  });
});
