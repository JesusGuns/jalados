//@ts-check
//@ts-ignore
define(["jquery", "fireworks", "confetti"], function ($, Fireworks) {
  $.fn.extend({
    // Start fireworks on containar
    onFireworksStart: function () {
      //const container = document.querySelector(".fireworks-container");
      const fireworks = new Fireworks.default(this[0], {
        hue: {
          min: 240,
          max: 360,
        },
        rocketsPoint: {
          min: 20,
          max: 80,
        },
        lineWidth: {
          explosion: {
            min: 1,
            max: 3,
          },
          trace: {
            min: 1,
            max: 1,
          },
        },
        intensity: 10, //speed
        explosion: 3, //explosion size
        traceLength: 1, // trace line from origin
      });
      fireworks.start();
    },
    OnAudioPlayerClick: function ($audioButton) {
      var audio = this[0];
      if (audio.paused) {
        audio.play();
        $audioButton.removeClass("off");
      } else {
        audio.pause();
        $audioButton.addClass("off");
      }
    },
  });

  $.fn.OnConfettiStart = function () {
    //@ts-ignore
    confetti({
      particleCount: 300,
      startVelocity: 30,
      spread: 360,
    });
  };
});
