window.HELP_IMPROVE_VIDEOJS = false;

// ── Mobile Banner Dismiss ──────────────────────────────────────────────
(function() {
  var btn = document.querySelector('.mobile-banner-close');
  if (btn) {
    btn.addEventListener('click', function() {
      btn.parentElement.style.display = 'none';
    });
  }
})();

// ── Touch Device Detection ──────────────────────────────────────────────
(function() {
  var isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  if (isTouch) {
    document.documentElement.classList.add('is-touch-device');
  }
})();

// ── Dark Mode Toggle ────────────────────────────────────────────────────
(function() {
  var saved = localStorage.getItem('theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
  // Sync aria-pressed once the DOM is ready (button is parsed before this script runs)
  document.addEventListener('DOMContentLoaded', function() {
    var btn = document.querySelector('.dark-mode-toggle');
    if (btn) {
      btn.setAttribute('aria-pressed', document.documentElement.getAttribute('data-theme') === 'dark' ? 'true' : 'false');
    }
  });
})();

function toggleDarkMode() {
  var html = document.documentElement;
  var current = html.getAttribute('data-theme');
  var next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  var btn = document.querySelector('.dark-mode-toggle');
  if (btn) btn.setAttribute('aria-pressed', next === 'dark' ? 'true' : 'false');
}

// Magnifier Help Toggle
function toggleMagnifierHelp() {
  var popup = document.getElementById('magnifierHelpPopup');
  popup.classList.toggle('show');
}

(function() {
  document.addEventListener('DOMContentLoaded', function() {
    var btn = document.querySelector('.magnifier-help-btn');
    var popup = document.getElementById('magnifierHelpPopup');
    if (!btn || !popup) return;
    btn.addEventListener('mouseleave', function(e) {
      // Only close if not moving into the popup
      if (!popup.contains(e.relatedTarget)) popup.classList.remove('show');
    });
    popup.addEventListener('mouseleave', function(e) {
      if (!btn.contains(e.relatedTarget)) popup.classList.remove('show');
    });
  });
})();

// More Works Dropdown Functionality
function toggleMoreWorks() {
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');
    
    if (dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    } else {
        dropdown.classList.add('show');
        button.classList.add('active');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const container = document.querySelector('.more-works-container');
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');
    
    if (container && !container.contains(event.target)) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Close dropdown on escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const dropdown = document.getElementById('moreWorksDropdown');
        const button = document.querySelector('.more-works-btn');
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Copy BibTeX to clipboard
function copyBibTeX() {
    const bibtexElement = document.getElementById('bibtex-code');
    const button = document.querySelector('.copy-bibtex-btn');
    const copyText = button.querySelector('.copy-text');
    
    if (bibtexElement) {
        navigator.clipboard.writeText(bibtexElement.textContent).then(function() {
            // Success feedback
            button.classList.add('copied');
            copyText.textContent = 'Cop';
            
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        }).catch(function(err) {
            console.error('Failed to copy: ', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = bibtexElement.textContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            button.classList.add('copied');
            copyText.textContent = 'Cop';
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        });
    }
}

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/hide scroll to top button
window.addEventListener('scroll', function() {
    const scrollButton = document.querySelector('.scroll-to-top');
    if (window.pageYOffset > 300) {
        scrollButton.classList.add('visible');
    } else {
        scrollButton.classList.remove('visible');
    }
});

// Video carousel autoplay when in view
function setupVideoCarouselAutoplay() {
    const carouselVideos = document.querySelectorAll('.results-carousel video');
    
    if (carouselVideos.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                // Video is in view, play it
                video.play().catch(e => {
                    // Autoplay failed, probably due to browser policy
                    console.log('Autoplay prevented:', e);
                });
            } else {
                // Video is out of view, pause it
                video.pause();
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% of the video is visible
    });
    
    carouselVideos.forEach(video => {
        observer.observe(video);
    });
}

$(document).ready(function() {
    // Check for click events on the navbar burger icon

    var options = {
		slidesToScroll: 1,
		slidesToShow: 1,
		loop: true,
		infinite: true,
		autoplay: true,
		autoplaySpeed: 5000,
    }

	// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);
	
    bulmaSlider.attach();
    
    // Setup video autoplay for carousel
    setupVideoCarouselAutoplay();

})

// ── Image Comparison Sliders ──────────────────────────────────────────────

class ComparisonSlider {
  constructor(containerEl) {
    this.container = containerEl;
    this.imgLeft = containerEl.querySelector('.img-left');
    this.imgRight = containerEl.querySelector('.img-right');
    this.divider = containerEl.querySelector('.comparison-divider');
    this.handle = containerEl.querySelector('.comparison-handle');
    this.labelLeft = containerEl.querySelector('.comparison-label-left');
    this.labelRight = containerEl.querySelector('.comparison-label-right');
    this.isDragging = false;
    this.position = 50;

    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);
    this._onTouchStart = this._onTouchStart.bind(this);
    this._onTouchMove = this._onTouchMove.bind(this);

    containerEl.addEventListener('mousedown', this._onMouseDown);
    containerEl.addEventListener('touchstart', this._onTouchStart, { passive: true });
    this._setPosition(50);
  }

  _setPosition(pct) {
    pct = Math.max(2, Math.min(98, pct));
    this.position = pct;
    this.imgLeft.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
    this.divider.style.left = pct + '%';
    this.handle.style.left = pct + '%';
  }

  _getPercent(clientX) {
    var rect = this.container.getBoundingClientRect();
    return Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
  }

  _onMouseDown(e) {
    this.isDragging = true;
    document.addEventListener('mousemove', this._onMouseMove);
    document.addEventListener('mouseup', this._onMouseUp);
    e.preventDefault();
  }

  _onMouseMove(e) {
    if (!this.isDragging) return;
    this._setPosition(this._getPercent(e.clientX));
  }

  _onMouseUp() {
    this.isDragging = false;
    document.removeEventListener('mousemove', this._onMouseMove);
    document.removeEventListener('mouseup', this._onMouseUp);
  }

  _onTouchStart(e) {
    this.isDragging = true;
    this.container.addEventListener('touchmove', this._onTouchMove, { passive: true });
    this.container.addEventListener('touchend', function() { this.isDragging = false; }.bind(this), { once: true });
  }

  _onTouchMove(e) {
    if (!this.isDragging) return;
    this._setPosition(this._getPercent(e.touches[0].clientX));
  }

  toggle() {
    this._toggledRight = !this._toggledRight;
    var target = this._toggledRight ? 95 : 5;
    var self = this;
    var start = this.position;
    var duration = 300;
    var startTime = performance.now();
    function animate(now) {
      var t = Math.min((now - startTime) / duration, 1);
      t = t * (2 - t); // ease-out
      self._setPosition(start + (target - start) * t);
      if (t < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }

  updateImages(leftSrc, rightSrc, leftLabel, rightLabel) {
    this.imgLeft.src = leftSrc;
    this.imgRight.src = rightSrc;
    if (leftLabel !== undefined) this.labelLeft.textContent = leftLabel;
    if (rightLabel !== undefined) this.labelRight.textContent = rightLabel;
    var self = this;
    this.imgRight.onload = function() { self._setPosition(50); };
    this._setPosition(50);
  }
}

function makeButtonGroup(labels, onSelect) {
  var group = document.createElement('div');
  group.className = 'btn-group';
  labels.forEach(function(label, i) {
    var btn = document.createElement('button');
    btn.textContent = label;
    if (i === 0) btn.classList.add('active');
    btn.addEventListener('click', function() {
      group.querySelectorAll('button').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      onSelect(label, i);
    });
    group.appendChild(btn);
  });
  return group;
}

function initQualitativeSlider() {
  var widget = document.getElementById('qualitative-slider-widget');
  if (!widget) return;
  var sliderContainer = widget.querySelector('.comparison-slider-container');
  var slider = new ComparisonSlider(sliderContainer);

  var scenes = ['Bicycle', 'Garden'];
  var methods = ['PGSR', 'GGGS', 'MILo'];

  var currentScene = 'Bicycle';
  var currentMethod = 'PGSR';

  var imageMap = {
    'Bicycle': {
      'PGSR': ['static/images/mipnerf360/bicycle_pgsr.jpeg', 'static/images/mipnerf360/bicycle_ours.jpeg'],
      'GGGS': ['static/images/mipnerf360/bicycle_gggs.jpeg', 'static/images/mipnerf360/bicycle_ours.jpeg'],
      'MILo': ['static/images/mipnerf360/bicycle_milo.jpeg', 'static/images/mipnerf360/bicycle_ours.jpeg']
    },
    'Garden': {
      'PGSR': ['static/images/mipnerf360/garden_pgsr.jpeg',  'static/images/mipnerf360/garden_ours.jpeg'],
      'GGGS': ['static/images/mipnerf360/garden_gggs.jpeg',  'static/images/mipnerf360/garden_ours.jpeg'],
      'MILo': ['static/images/mipnerf360/garden_milo.jpeg',  'static/images/mipnerf360/garden_ours.jpeg']
    }
  };

  var gtFullMap = {
    'Bicycle': 'static/images/mipnerf360/bicycle_GT.jpg',
    'Garden':  'static/images/mipnerf360/garden_GT.jpg'
  };

  var gtCloseupMap = {
    'Bicycle': 'static/images/mipnerf360/bicycle_closeup.jpg',
    'Garden':  'static/images/mipnerf360/garden_gt_closeup.jpg'
  };

  var gtFullImg    = document.getElementById('gt-full-img');
  var gtRefImg     = document.getElementById('gt-reference-img');

  function updateGTReference() {
    if (gtFullImg) gtFullImg.src = gtFullMap[currentScene];
    if (gtRefImg)  gtRefImg.src  = gtCloseupMap[currentScene];
  }

  function update() {
    var pair = imageMap[currentScene][currentMethod];
    slider.updateImages(pair[0], pair[1], currentMethod, 'Ours');
    updateGTReference();
  }

  var controls = widget.querySelector('.comparison-controls');

  var sceneGroup = document.createElement('div');
  sceneGroup.className = 'control-group';
  var sceneLabel = document.createElement('span');
  sceneLabel.className = 'control-label';
  sceneLabel.textContent = 'Scene:';
  var sceneBtns = makeButtonGroup(scenes, function(label) { currentScene = label; update(); });
  sceneGroup.appendChild(sceneLabel);
  sceneGroup.appendChild(sceneBtns);

  var methodGroup = document.createElement('div');
  methodGroup.className = 'control-group';
  var methodLabel = document.createElement('span');
  methodLabel.className = 'control-label';
  methodLabel.textContent = 'Compare vs:';
  var methodBtns = makeButtonGroup(methods, function(label) { currentMethod = label; update(); });
  methodGroup.appendChild(methodLabel);
  methodGroup.appendChild(methodBtns);

  controls.appendChild(sceneGroup);
  controls.appendChild(methodGroup);

  update();

  new MagnifierLens(sliderContainer, {
    isComparison: true,
    onToggle: function() { slider.toggle(); },
    getPosition: function() { return slider.position; },
    getSources: function() {
      return { left: slider.imgLeft.src, right: slider.imgRight.src };
    }
  });
}

function initNormalFieldSlider() {
  var widget = document.getElementById('normalfield-slider-widget');
  if (!widget) return;
  var sliderContainer = widget.querySelector('.comparison-slider-container');
  var slider = new ComparisonSlider(sliderContainer);

  var scenes = ['Kitchen', 'Room', 'Ignatius', 'Courthouse'];
  var leftOptions = ['Ground Truth', 'Rendered Normals'];

  var currentScene = 'Kitchen';
  var currentLeft = 'Ground Truth';

  var sceneKeyMap = {
    'Kitchen': 'kitchen',
    'Room': 'room',
    'Ignatius': 'Ignatius',
    'Courthouse': 'Courthouse'
  };

  var leftKeyMap = {
    'Ground Truth': 'ground_truth',
    'Rendered Normals': 'rendered_normals'
  };

  function update() {
    var sceneKey = sceneKeyMap[currentScene];
    var leftKey = leftKeyMap[currentLeft];
    var leftSrc = 'static/images/vector_field/' + sceneKey + '_' + leftKey + '.jpg';
    var rightSrc = 'static/images/vector_field/' + sceneKey + '_vector_field.jpg';
    slider.updateImages(leftSrc, rightSrc, currentLeft, 'Normal Field \u{1D4A9}');
  }

  var controls = widget.querySelector('.comparison-controls');

  var sceneGroup = document.createElement('div');
  sceneGroup.className = 'control-group';
  var sceneLabel = document.createElement('span');
  sceneLabel.className = 'control-label';
  sceneLabel.textContent = 'Scene:';
  var sceneBtns = makeButtonGroup(scenes, function(label) { currentScene = label; update(); });
  sceneGroup.appendChild(sceneLabel);
  sceneGroup.appendChild(sceneBtns);

  var leftGroup = document.createElement('div');
  leftGroup.className = 'control-group';
  var leftLabel = document.createElement('span');
  leftLabel.className = 'control-label';
  leftLabel.textContent = 'Left side:';
  var leftBtns = makeButtonGroup(leftOptions, function(label) { currentLeft = label; update(); });
  leftGroup.appendChild(leftLabel);
  leftGroup.appendChild(leftBtns);

  controls.appendChild(sceneGroup);
  controls.appendChild(leftGroup);

  update();

  new MagnifierLens(sliderContainer, {
    isComparison: true,
    onToggle: function() { slider.toggle(); },
    getPosition: function() { return slider.position; },
    getSources: function() {
      return { left: slider.imgLeft.src, right: slider.imgRight.src };
    }
  });
}

function initPAMSlider() {
  var widget = document.getElementById('pam-slider-widget');
  if (!widget) return;
  var sliderContainer = widget.querySelector('.comparison-slider-container');
  var slider = new ComparisonSlider(sliderContainer);

  var scenes = ['Bonsai', 'Bicycle'];
  var views = ['Normal', 'Wireframe'];

  var currentScene = 'Bonsai';
  var currentView = 'Normal';

  var viewKeyMap = {
    'Normal': 'close',
    'Wireframe': 'wireframe'
  };

  function update() {
    var sceneKey = currentScene.toLowerCase();
    var viewKey = viewKeyMap[currentView];
    var leftSrc = 'static/images/pam_comparison/' + sceneKey + '_mtet_' + viewKey + '.jpeg';
    var rightSrc = 'static/images/pam_comparison/' + sceneKey + '_pam_' + viewKey + '.jpeg';
    slider.updateImages(leftSrc, rightSrc, 'MTet', 'PAM (Ours)');
  }

  var controls = widget.querySelector('.comparison-controls');

  var sceneGroup = document.createElement('div');
  sceneGroup.className = 'control-group';
  var sceneLabel = document.createElement('span');
  sceneLabel.className = 'control-label';
  sceneLabel.textContent = 'Scene:';
  var sceneBtns = makeButtonGroup(scenes, function(label) { currentScene = label; update(); });
  sceneGroup.appendChild(sceneLabel);
  sceneGroup.appendChild(sceneBtns);

  var viewGroup = document.createElement('div');
  viewGroup.className = 'control-group';
  var viewLabel = document.createElement('span');
  viewLabel.className = 'control-label';
  viewLabel.textContent = 'View:';
  var viewBtns = makeButtonGroup(views, function(label) { currentView = label; update(); });
  viewGroup.appendChild(viewLabel);
  viewGroup.appendChild(viewBtns);

  controls.appendChild(sceneGroup);
  controls.appendChild(viewGroup);

  update();

  new MagnifierLens(sliderContainer, {
    isComparison: true,
    onToggle: function() { slider.toggle(); },
    getPosition: function() { return slider.position; },
    getSources: function() {
      return { left: slider.imgLeft.src, right: slider.imgRight.src };
    }
  });
}

// ── Video Comparison Slider ─────────────────────────────────────────────

function initVideoComparisonSlider() {
  var widget = document.getElementById('video-comparison-widget');
  if (!widget) return;

  var container = widget.querySelector('.video-comparison-container');
  var videoLeft = container.querySelector('.video-comparison-left');
  var videoRight = container.querySelector('.video-comparison-right');
  var divider = container.querySelector('.comparison-divider');
  var labelLeft = container.querySelector('.comparison-label-left');
  var labelRight = container.querySelector('.comparison-label-right');
  var overlay = container.querySelector('.video-play-pause-overlay');
  var overlayIcon = overlay.querySelector('i');

  var timeline = widget.querySelector('.video-timeline');
  var timelineFilled = timeline.querySelector('.video-timeline-filled');
  var timelineHandle = timeline.querySelector('.video-timeline-handle');

  var scenes = [
    { name: 'Bicycle', left: 'static/videos/renders/bicycle_milo',  right: 'static/videos/renders/bicycle_Ours',  method: 'MILo' },
    { name: 'Garden',  left: 'static/videos/renders/garden_milo',   right: 'static/videos/renders/garden_Ours',   method: 'MILo' },
    { name: 'Truck',   left: 'static/videos/renders/Truck_PGSR',    right: 'static/videos/renders/Truck_Ours',    method: 'PGSR' },
    { name: 'Barn',    left: 'static/videos/renders/Barn_GGGS',     right: 'static/videos/renders/Barn_Ours',    method: 'GGGS' }
  ];

  var currentScene = scenes[0];
  var position = 50;
  var isDragging = false;
  var userPaused = false;
  var rafId = null;

  // ── Vertical comparison slider ────────────────────────────────────────

  function setPosition(pct) {
    pct = Math.max(2, Math.min(98, pct));
    position = pct;
    videoLeft.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
    divider.style.left = pct + '%';
    container.setAttribute('aria-valuenow', Math.round(pct));
  }

  container.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') { setPosition(position - 5); e.preventDefault(); }
    else if (e.key === 'ArrowRight') { setPosition(position + 5); e.preventDefault(); }
  });

  function getPercent(clientX) {
    var rect = container.getBoundingClientRect();
    return Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
  }

  // Track mousedown origin for click vs drag disambiguation
  var mouseDownX = 0;
  var mouseDownY = 0;
  var sliderDragMoved = false;

  function onSliderMouseMove(e) {
    var dx = e.clientX - mouseDownX;
    var dy = e.clientY - mouseDownY;
    if (dx * dx + dy * dy > 25) sliderDragMoved = true;
    setPosition(getPercent(e.clientX));
  }

  function onSliderMouseUp(e) {
    isDragging = false;
    document.removeEventListener('mousemove', onSliderMouseMove);
    document.removeEventListener('mouseup', onSliderMouseUp);
    if (!sliderDragMoved) togglePlayPause();
  }

  container.addEventListener('mousedown', function(e) {
    isDragging = true;
    sliderDragMoved = false;
    mouseDownX = e.clientX;
    mouseDownY = e.clientY;
    setPosition(getPercent(e.clientX));
    document.addEventListener('mousemove', onSliderMouseMove);
    document.addEventListener('mouseup', onSliderMouseUp);
    e.preventDefault();
  });

  var touchStartX = 0;
  var touchStartY = 0;
  var touchDragMoved = false;

  container.addEventListener('touchstart', function(e) {
    isDragging = true;
    touchDragMoved = false;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    setPosition(getPercent(e.touches[0].clientX));
  }, { passive: true });

  container.addEventListener('touchmove', function(e) {
    if (!isDragging) return;
    var dx = e.touches[0].clientX - touchStartX;
    var dy = e.touches[0].clientY - touchStartY;
    if (dx * dx + dy * dy > 25) touchDragMoved = true;
    e.preventDefault();
    setPosition(getPercent(e.touches[0].clientX));
  }, { passive: false });

  container.addEventListener('touchend', function() {
    isDragging = false;
    if (!touchDragMoved) togglePlayPause();
  });

  // ── Play / Pause ─────────────────────────────────────────────────────

  function togglePlayPause() {
    if (videoLeft.paused) {
      playBoth();
      userPaused = false;
    } else {
      pauseBoth();
      userPaused = true;
    }
    flashOverlay(videoLeft.paused);
  }

  function playBoth() {
    videoRight.currentTime = videoLeft.currentTime;
    videoLeft.play().catch(function() {});
    videoRight.play().catch(function() {});
    container.classList.remove('is-paused');
    startTimelineLoop();
  }

  function pauseBoth() {
    videoLeft.pause();
    videoRight.pause();
    container.classList.add('is-paused');
    stopTimelineLoop();
  }

  var overlayTimeout = null;

  function flashOverlay(isPaused) {
    if (overlayTimeout) clearTimeout(overlayTimeout);
    overlayIcon.className = isPaused ? 'fas fa-pause' : 'fas fa-play';
    overlay.classList.remove('fade-out');
    overlay.classList.add('flash');
    overlayTimeout = setTimeout(function() {
      overlay.classList.add('fade-out');
      overlayTimeout = setTimeout(function() {
        overlay.classList.remove('flash', 'fade-out');
      }, 400);
    }, 300);
  }

  // ── Timeline scrubber ─────────────────────────────────────────────────

  function setTimelinePosition(pct) {
    pct = Math.max(0, Math.min(100, pct));
    timelineFilled.style.width = pct + '%';
    timelineHandle.style.left = pct + '%';
  }

  function startTimelineLoop() {
    stopTimelineLoop();
    function tick() {
      if (!videoLeft.paused && videoLeft.duration) {
        setTimelinePosition((videoLeft.currentTime / videoLeft.duration) * 100);
      }
      rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);
  }

  function stopTimelineLoop() {
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
  }

  function getTimelinePercent(clientX) {
    var rect = timeline.getBoundingClientRect();
    return Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
  }

  function seekToPercent(pct) {
    if (!videoLeft.duration) return;
    var t = (pct / 100) * videoLeft.duration;
    videoLeft.currentTime = t;
    videoRight.currentTime = t;
    setTimelinePosition(pct);
  }

  var timelineDragging = false;

  function onTimelineMouseMove(e) {
    if (!timelineDragging) return;
    seekToPercent(getTimelinePercent(e.clientX));
  }

  function onTimelineMouseUp() {
    timelineDragging = false;
    document.removeEventListener('mousemove', onTimelineMouseMove);
    document.removeEventListener('mouseup', onTimelineMouseUp);
  }

  timeline.addEventListener('mousedown', function(e) {
    timelineDragging = true;
    var wasPaused = videoLeft.paused;
    if (!wasPaused) pauseBoth();
    userPaused = true;
    seekToPercent(getTimelinePercent(e.clientX));
    document.addEventListener('mousemove', onTimelineMouseMove);
    document.addEventListener('mouseup', onTimelineMouseUp);
    e.preventDefault();
  });

  timeline.addEventListener('touchstart', function(e) {
    timelineDragging = true;
    if (!videoLeft.paused) pauseBoth();
    userPaused = true;
    seekToPercent(getTimelinePercent(e.touches[0].clientX));
  }, { passive: true });

  timeline.addEventListener('touchmove', function(e) {
    if (!timelineDragging) return;
    e.preventDefault();
    seekToPercent(getTimelinePercent(e.touches[0].clientX));
  }, { passive: false });

  timeline.addEventListener('touchend', function() {
    timelineDragging = false;
  });

  // ── Scene switching ───────────────────────────────────────────────────

  var loadToken = 0;

  function loadScene(scene) {
    currentScene = scene;
    videoLeft.pause();
    videoRight.pause();
    stopTimelineLoop();

    var token = ++loadToken;

    function setSources(video, basePath) {
      video.removeAttribute('src');
      while (video.firstChild) video.removeChild(video.firstChild);
      var webm = document.createElement('source');
      webm.src = basePath + '.webm';
      webm.type = 'video/webm';
      var mp4 = document.createElement('source');
      mp4.src = basePath + '.mp4';
      mp4.type = 'video/mp4';
      video.appendChild(webm);
      video.appendChild(mp4);
    }
    setSources(videoLeft, scene.left);
    setSources(videoRight, scene.right);
    labelLeft.textContent = scene.method;
    labelRight.textContent = 'Ours';
    setPosition(50);
    setTimelinePosition(0);
    userPaused = false;
    container.classList.remove('is-paused');

    var readyCount = 0;
    function onReady() {
      if (token !== loadToken) return;
      readyCount++;
      if (readyCount >= 2) {
        videoLeft.currentTime = 0;
        videoRight.currentTime = 0;
        videoLeft.play().catch(function() {});
        videoRight.play().catch(function() {});
        startTimelineLoop();
      }
    }
    videoLeft.onloadeddata = onReady;
    videoRight.onloadeddata = onReady;
    videoLeft.load();
    videoRight.load();
  }

  // Periodic sync
  setInterval(function() {
    if (videoLeft.readyState < 2 || videoRight.readyState < 2) return;
    if (videoLeft.paused || videoRight.paused) return;
    if (Math.abs(videoLeft.currentTime - videoRight.currentTime) > 0.1) {
      videoRight.currentTime = videoLeft.currentTime;
    }
  }, 500);

  // IntersectionObserver: respect userPaused so scrolling back in doesn't
  // override an intentional pause.
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        if (!userPaused) {
          if (videoLeft.readyState >= 2) videoLeft.play().catch(function() {});
          if (videoRight.readyState >= 2) videoRight.play().catch(function() {});
          startTimelineLoop();
        }
      } else {
        videoLeft.pause();
        videoRight.pause();
        stopTimelineLoop();
      }
    });
  }, { threshold: 0.3 });
  observer.observe(container);

  // Build scene tab buttons
  var controls = widget.querySelector('.comparison-controls');
  var sceneGroup = document.createElement('div');
  sceneGroup.className = 'control-group';
  var sceneLabel = document.createElement('span');
  sceneLabel.className = 'control-label';
  sceneLabel.textContent = 'Scene:';
  var sceneBtns = makeButtonGroup(scenes.map(function(s) { return s.name; }), function(label, i) {
    loadScene(scenes[i]);
  });
  sceneGroup.appendChild(sceneLabel);
  sceneGroup.appendChild(sceneBtns);
  controls.appendChild(sceneGroup);

  loadScene(scenes[0]);

  new MagnifierLens(container, {
    isComparison: true,
    isVideo: true,
    onToggle: function() {
      var target = position > 50 ? 5 : 95;
      var start = position;
      var duration = 300;
      var startTime = performance.now();
      function animate(now) {
        var t = Math.min((now - startTime) / duration, 1);
        t = t * (2 - t);
        setPosition(start + (target - start) * t);
        if (t < 1) requestAnimationFrame(animate);
      }
      requestAnimationFrame(animate);
    },
    getPosition: function() { return position; },
    getVideoElements: function() { return { left: videoLeft, right: videoRight }; }
  });
}

// ── Mesh Viewer Pastel Tinting ──────────────────────────────────────────
function tintModelViewer(viewer, color) {
  viewer.addEventListener('load', function() {
    var model = viewer.model;
    if (!model) return;
    for (var i = 0; i < model.materials.length; i++) {
      var mat = model.materials[i];
      mat.pbrMetallicRoughness.setBaseColorFactor(color);
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  // Apply pastel tints to mesh viewers: red, green, blue
  var viewers = document.querySelectorAll('.mesh-viewer-table model-viewer');
  var pastelColors = [
    [0.80, 0.65, 0.85, 1.0],  // pastel violet
    [0.65, 0.85, 0.65, 1.0],  // pastel green
    [0.65, 0.65, 0.85, 1.0]   // pastel blue
  ];
  viewers.forEach(function(viewer, i) {
    if (i < pastelColors.length) {
      tintModelViewer(viewer, pastelColors[i]);
    }
  });

  initQualitativeSlider();
  initNormalFieldSlider();
  initPAMSlider();
  initVideoComparisonSlider();

  // Attach magnifiers to static zoomable images
  document.querySelectorAll('.zoomable-image').forEach(function(img) {
    var wrapper = document.createElement('div');
    wrapper.className = 'zoomable-image-wrapper';
    img.parentNode.insertBefore(wrapper, img);
    wrapper.appendChild(img);
    new MagnifierLens(wrapper, {
      getSources: function() { return { left: img.src }; },
      getPosition: function() { return 100; }
    });
  });
});
