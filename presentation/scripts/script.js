(function () {
  var url = window.location,
    body = document.body,
    slides = document.querySelectorAll('div.slide'),
    progress = document.querySelector('div.progress div'),
    slideList = [],
    l = slides.length, i;
  if (typeof keysalive === 'undefined') {
    keysalive = true;
  }

  for (i = 0; i < l; i++) {
    var cb = document.createElement('button');
    cb.className = 'cb';
    cb.innerHTML = 'x';
    slides[i].appendChild(cb);
    slideList.push({
      id: slides[i].id,
      hasInnerNavigation: null !== slides[i].querySelector('.inner')
    });
  }

  /* Encode code blocks */
  function encode() {
    var codes = document.querySelectorAll('code');
    var all = codes.length;
    while(all--) {
      var tc = codes[all].innerHTML;
      if (tc.indexOf('<')!== -1){
      tc = tc.replace(/</g,'&lt');
      tc = tc.replace(/>/g,'&gt');
      codes[all].innerHTML = tc;
      }
    }
  }
  encode();
  
  var demos = document.querySelectorAll('[contenteditable]'),
      alldemos = demos.length;

  function dokeys(ev) {
    keysalive = true;
  }
  function stopkeys(ev) {
    keysalive = false;
  }
  while (alldemos--) {
    demos[alldemos].addEventListener('focus', stopkeys, false);
    demos[alldemos].addEventListener('blur', dokeys, false);
  }
  function getTransform() {
    var denominator = Math.max(
      body.clientWidth / window.innerWidth,
      body.clientHeight / window.innerHeight
    );

    return 'scale(' + (1 / denominator) + ')';
  }

  function applyTransform(transform) {
    body.style.WebkitTransform = transform;
    body.style.MozTransform = transform;
    body.style.msTransform = transform;
    body.style.OTransform = transform;
    body.style.transform = transform;
  }

  function enterSlideMode() {
    body.className = 'full';
    applyTransform(getTransform());
  }

  function enterListMode() {
    body.className = 'list';
    applyTransform('none');
  }

  function getCurrentSlideNumber() {
    var i, l = slideList.length,
      currentSlideId = url.hash.substr(1);

    for (i = 0; i < l; ++i) {
      if (currentSlideId === slideList[i].id) {
        return i;
      }
    }

    return -1;
  }

  function scrollToSlide(slideNumber) {
    if (-1 === slideNumber ) { return; }
    var currentSlide = document.getElementById(slideList[slideNumber].id);
    if (null !== currentSlide) {
      window.scrollTo(0, currentSlide.offsetTop);
    }
  }

  function isListMode() {
    return 'full' !== url.search.substr(1);
  }

  function normalizeSlideNumber(slideNumber) {
    if (0 > slideNumber) {
      return slideList.length - 1;
    } else if (slideList.length <= slideNumber) {
      return 0;
    } else {
      return slideNumber;
    }
  }

  function updateProgress(slideNumber) {
    if (null === progress) { return; }
    progress.style.width = (100 / (slideList.length - 1) * normalizeSlideNumber(slideNumber)).toFixed(2) + '%';
  }

  function getSlideHash(slideNumber) {
    return '#' + slideList[normalizeSlideNumber(slideNumber)].id;
  }

  function goToSlide(slideNumber) {
    var currentSlide = document.getElementById(slideList[slideNumber].id);
    if (currentSlide.classList.contains('inactive')) {
      goToSlide(slides[slideNumber + 1] ? slideNumber + 1 : 0);
    } else {
      url.hash = getSlideHash(slideNumber);
      lognotes(slideNumber);
      if (!isListMode()) {
        updateProgress(slideNumber);
        GIFrefresh(slideNumber);
        playVideoIfAutoplay(slideNumber);
      }
    }
  }

  function GIFrefresh(slideNumber) {
    if (slides[slideNumber]) {
      var img = slides[slideNumber].querySelector('img');
      if (img && img.src.indexOf('gif') !== -1) {
        img.src = img.src;
      }
    }
  }
  function playVideoIfAutoplay(slideNumber) {
    if (slides[slideNumber] &&
        slides[slideNumber].className.indexOf('autoplay')!== -1) {
      var video = slides[slideNumber].querySelector('video');
      if (video) {
        video.play();
      }
    }
  }

  function getContainingSlideId(el) {
    var node = el;
    while ('BODY' !== node.nodeName && 'HTML' !== node.nodeName) {
      if (node.classList.contains('slide')) {
        return node.id;
      } else {
        node = node.parentNode;
      }
    }

    return '';
  }

  function dispatchSingleSlideMode(e) {
    var slideId = getContainingSlideId(e.target);

    if ('' !== slideId && isListMode()) {
      e.preventDefault();

      if(e.target.tagName === 'BUTTON' && e.target.className === 'cb') {
        toggleSlide(e.target.parentNode);
      } else {
        // NOTE: we should update hash to get things work properly
        url.hash = '#' + slideId;
        history.replaceState(null, null, url.pathname + '?full#' + slideId);
        enterSlideMode();

        updateProgress(getCurrentSlideNumber());
      }
    }
  }

  function toggleSlide(elm) {
    if (elm.classList.contains('inactive')) {
      elm.classList.remove('inactive');
    } else {
      elm.classList.add('inactive');
    }
  }

  // Increases inner navigation by adding 'active' class to next inactive inner navigation item
  function increaseInnerNavigation(slideNumber) {
    // Shortcut for slides without inner navigation
    if (true !== slideList[slideNumber].hasInnerNavigation) { return -1; }

    var activeNodes = document.querySelectorAll(getSlideHash(slideNumber) + ' .active'),
      // NOTE: we assume there is no other elements in inner navigation
      node = activeNodes[activeNodes.length - 1].nextElementSibling;

    if (null !== node) {
      node.classList.add('active');
      return activeNodes.length + 1;
    } else {
      return -1;
    }
  }

  function lognotes(slideNumber) {
    if (window.console && slideList[slideNumber]) {
      var notes = document.querySelector('#' +slideList[slideNumber].id + ' .notes');
      if (notes) {
        console.info(notes.innerHTML.replace(/\n\s+/g,'\n'));
      }
      if (slideList[slideNumber+1]) {
        var next = document.querySelector('#' +slideList[slideNumber + 1].id + ' header');
        if (next) {
          next = next.innerHTML.replace(/^\s+|<[^>]+>/g,'');
          console.info('NEXT: ' + next);
        }
      }
    }
  }


  // Event handlers

  window.addEventListener('DOMContentLoaded', function () {
    if (!isListMode()) {
      // "?full" is present without slide hash, so we should display first slide
      if (-1 === getCurrentSlideNumber()) {
        history.replaceState(null, null, url.pathname + '?full' + getSlideHash(0));
      }
      enterSlideMode();
      updateProgress(getCurrentSlideNumber());
    }
  }, false);

  window.addEventListener('popstate', function (e) {
    if (isListMode()) {
      enterListMode();
      scrollToSlide(getCurrentSlideNumber());
    } else {
      enterSlideMode();
    }
  }, false);

  window.addEventListener('resize', function (e) {
    if (!isListMode()) {
      applyTransform(getTransform());
    }
  }, false);

  document.addEventListener('keydown', function (e) {
    if (!keysalive) { return; }
    // Shortcut for alt, shift and meta keys
    if (e.altKey || e.ctrlKey || e.metaKey) { return; }

    var currentSlideNumber = getCurrentSlideNumber();
    switch (e.which) {
      case 116: // F5
      case 13: // Enter
        if (isListMode() && -1 !== currentSlideNumber) {
          e.preventDefault();

          history.pushState(null, null, url.pathname + '?full' + getSlideHash(currentSlideNumber));
          enterSlideMode();

          updateProgress(currentSlideNumber);
        }
      break;

      case 27: // Esc
        if (!isListMode()) {
          e.preventDefault();

          history.pushState(null, null, url.pathname + getSlideHash(currentSlideNumber));
          enterListMode();
          scrollToSlide(currentSlideNumber);
        }
      break;

      case 33: // PgUp
      case 38: // Up
      case 37: // Left
      case 72: // h
      case 75: // k
        e.preventDefault();

        currentSlideNumber--;
        goToSlide(currentSlideNumber);
      break;

      case 34: // PgDown
      case 40: // Down
      case 39: // Right
      case 76: // l
      case 74: // j
        e.preventDefault();

        // Only go to next slide if current slide have no inner
        // navigation or inner navigation is fully shown
        // NOTE: But first of all check if there is no current slide
        if (
          -1 === currentSlideNumber ||
          !slideList[currentSlideNumber].hasInnerNavigation ||
          -1 === increaseInnerNavigation(currentSlideNumber)
        ) {
          currentSlideNumber++;
          goToSlide(currentSlideNumber);
        }
      break;

      case 36: // Home
        e.preventDefault();

        currentSlideNumber = 0;
        goToSlide(currentSlideNumber);
      break;

      case 35: // End
        e.preventDefault();

        currentSlideNumber = slideList.length - 1;
        goToSlide(currentSlideNumber);
      break;

      case 9: // Tab = +1; Shift + Tab = -1
      case 32: // Space = +1; Shift + Space = -1
        e.preventDefault();

        currentSlideNumber += e.shiftKey ? -1 : 1;
        goToSlide(currentSlideNumber);
      break;
      case 78:
        slides[currentSlideNumber].classList.toggle('peek');
      break;
      default:
        // Behave as usual
    }
  }, false);

  document.addEventListener('click', dispatchSingleSlideMode, false);
  document.addEventListener('touchend', dispatchSingleSlideMode, false);

  document.addEventListener('touchstart', function (e) {
    if (!isListMode()) {
      var currentSlideNumber = getCurrentSlideNumber(),
        x = e.touches[0].pageX;
      if (x > window.innerWidth / 2) {
        currentSlideNumber++;
      } else {
        currentSlideNumber--;
      }

      goToSlide(currentSlideNumber);
    }
  }, false);

  document.addEventListener('touchmove', function (e) {
    if (!isListMode()) {
      e.preventDefault();
    }
  }, false);

}());

function goFullScreen() {
  document.fullscreenEnabled = document.fullscreenEnabled ||
  document.mozFullScreenEnabled ||
  document.documentElement.webkitRequestFullScreen;
  function requestFullscreen( element ) {
    if ( element.requestFullscreen ) {
      element.requestFullscreen();
    } else if ( element.mozRequestFullScreen ) {
      element.mozRequestFullScreen();
    } else if ( element.webkitRequestFullScreen ) {
      element.webkitRequestFullScreen( Element.ALLOW_KEYBOARD_INPUT );
    }
  }
  if ( document.fullscreenEnabled ) {
    requestFullscreen( document.documentElement );
  }
}