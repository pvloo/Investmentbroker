document.addEventListener("DOMContentLoaded", function () {
  const video = document.getElementById("heroVideo");

  // Try to autoplay; if blocked, unmute & play manually
  video.play().then(() => {
    video.style.opacity = 1;
  }).catch(() => {
    // Fallback for browsers that block autoplay
    video.muted = true;
    video.play().then(() => {
      video.style.opacity = 1;
    });
  });
});
