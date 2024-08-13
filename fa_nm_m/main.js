/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

// prepare the profiles
var prefix = 'm';
var order = 0;
var id = '';

var pics = [];
var cards = [];

for (var i = 1; i <= 30; i++) {
  pics.push(i);
}

var names = [
  'Noah',
  'Lucas',
  'Sem',
  'Daan',
  'Levi',
  'Liam',
  'James',
  'Finn',
  'Luca',
  'Milan',
  'Mees',
  'Luuk',
  'Adam',
  'Mason',
  'Sam',
  'Noud',
  'Bram',
  'Benjamin',
  'Jesse',
  'Max',
  'Thomas',
  'Tim',
  'Lars',
  'Thijs',
  'Jesse',
  'Ruben',
  'Stijn',
  'Max',
  'Tom',
  'Nick'
];

shuffleArray(pics);
shuffleArray(names);

var end_interaction = function() {
    parent.postMessage('fullscreen_off', '*');
    $('#matches').hide();
    $('#instructions').css('display', 'flex');
}

var start_interaction = function() {
    // Check if we have created a participant. If not, do so!
    if (id == '') {
      $.post("/api/create_part.php",
      {
        qualtrics_id: '',
        exp_condition: '1', // Fast, no match
        gender_profiles: '1' // Male
      })
      .done(function(msg){
        id = msg.id;
      })
      .fail(function(xhr, status, error) {
        //console.log(xhr.responseText);
      });
    }  

    parent.postMessage('fullscreen_on', '*');

    setTimeout(function() {
        $('#start_screen').hide();
    }, 500);
}

var check_order = function() {
  if (order == 30) {
    $('#matches').animate({left: '0px'});
  }
}

var continue_swiping = function() {
  $('#match').hide();
}

var profile_liked = function() {
  $.post("/api/create_action.php",
    {
      random_id: id,
      picture_id: pics[order],
      name: names[order],
      order_id: order,
      is_liked: 1
    })
    .done(function(msg){
      //console.log(msg);
    })
    .fail(function(xhr, status, error) {
      //console.log(xhr.responseText);
    });

    cards[29-order].animate({left: '500px', top: '-500px', opacity: '0'}, function() {
      $(this).remove();
      $('#match_img').attr('src', '/img/' + prefix + '/' + pics[order] + '.jpg');
      $('#match').show();

      order += 1;
      check_order();

    });
}

var profile_notliked = function() {
  $.post("/api/create_action.php",
    {
      random_id: id,
      picture_id: pics[order],
      name: names[order],
      order_id: order,
      is_liked: 0
    })
    .done(function(msg){
      //console.log(msg);
    })
    .fail(function(xhr, status, error) {
      //console.log(xhr.responseText);
    });

  cards[29-order].animate({left: '-500px', top: '-500px', opacity: '0'}, function() { $(this).remove(); } );
  order += 1;
  check_order();
}


$(document).ready(function() {
  $(window).on('message', function(event) {
    inbound = event.originalEvent.data;

    // Store Qualtrics ID if passed
    if (inbound != '' && inbound != 'fullscreen_off' && inbound != 'fullscreen_on' && id == '') {
      console.log(inbound);
        $.post("/api/create_part.php",
          {
            qualtrics_id: inbound,
            exp_condition: '1',
            gender_profiles: '1'
          })
          .done(function(msg){
            id = msg.id;
          })
          .fail(function(xhr, status, error) {
            //console.log(xhr.responseText);
          });
    }
  });

  // Create cards
  for (var i = 29; i >= 0; i--) {
    var card = $(`<div class="card">
          <div class="profile_wrapper">
            <img class="profile" src="/img/` + prefix + `/` + pics[i] + `.jpg" />
            <div class="name">` + names[i] + `</div>
          </div>
        </div>`);

    cards.push(card);
    card.appendTo($('#main'));
  }

  setTimeout(function() {
    $('.card').css('display', 'flex');
  }, 500);


  $('#like_button').on('click', profile_liked);
  $('#dislike_button').on('click', profile_notliked);
  $('#button_end').on('click', end_interaction);
  $('#button_start').on('click', start_interaction);
  $('#button_continue').on('click', continue_swiping);

  $('.card').draggable({
    scroll: false,
    revert: function() {
      if ($(this).position().left > -(0.25 * $(window).width()) && $(this).position().left < (0.25 * $(window).width())) {
        return true;
      }

      return false;
    },
    stop: function() {
      if ($(this).position().left < -(0.25 * $(window).width())) {
        profile_notliked();
      }
      else if ($(this).position().left > (0.25 * $(window).width())) {
        profile_liked();
      }
    }
  });
});
