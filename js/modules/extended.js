
  $.fn.extend({
    
    OnAudioPlayerClick: function ($audioButton) {
      var audio = this[0];
      if (audio.paused) {
        var playPromise = audio.play();
        
        // Evita el error silencioso que congela el hilo
        if (playPromise !== undefined) {
          playPromise.catch(function (err) {
            console.warn("Audio bloqueado por el navegador:", err);
            $audioButton.addClass("off");
          });
        }
        $audioButton.removeClass("off");
      } else {
        audio.pause();
        $audioButton.addClass("off");
      }
    },
  });


