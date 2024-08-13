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
var prefix = 'f';
var order = 0;
var id = '';
var selected = -2;

var profiles = [];

var colors = [
  'pink',
  'yellow',
  'red',
  'blue',
  'orange'
];

var people = [
  {
    picture: '10',
    name: 'Julia',
    edu: 'University',
    lang: 'English, Dutch, French',
    quote: '',
    interests: [
      'Dog lover',
      'Badminton',
      'Yoga',
      'Cinema goer'
    ],
    traits: [
      'Fusional',
      'Factual',
      'Extraverted'
    ],
    personal: 'Current relationship status: Cooked for two, ate everything by myself. Favorite movie: Inception. Besides watching movies, you can find me cuddling my dog, doing yoga on the beach or slamming feather shuttles. Looking for someone who wants to join me in my journey called life!'
  },
  {
    picture: '11',
    name: 'Mila',
    edu: 'University',
    lang: 'English, Dutch',
    quote: 'Unfortunately I only had a photo where you can\'t see that I\'m a supermodel and I was voted Miss Universe.',
    interests: [
      'Fitness',
      'Traveling',
      'Cat owner',
      'Plant lover'
    ],
    traits: [
      'Humor',
      'Openness to experience',
      'Conscientiousness'
    ],
    personal: 'Anyone looking for a gym buddy 🏋🏼‍♀️? A little bit more about me: Coffee and overnight oats are essential in my morning ritual ☕. I have 26 green buddies in my house, but half of them are overwatered :(. Also have one furry buddy in my house, named Cookie 🐈!'
  },
  {
    picture: '21',
    name: 'Emma',
    edu: 'HBO',
    lang: 'English, Dutch',
    quote: 'My preference? Someone who also likes romantic walks... to the fridge.',
    interests: [
      'Painting',
      'Dancing',
      'Theater'
    ],
    traits: [
      'Easy-going',
      'Honesty',
      'Communication skills',
      'Creative'
    ],
    personal: 'Hi there! My name is Emma and I am a spontaneous, social person. I would call myself creative as I love to paint/draw/knit etc. You can also find me in the dance studio where I am dancing (hiphop!) two times a week 💃.'
  },
  {
    picture: '27',
    name: 'Nora',
    edu: 'HBO',
    lang: 'English, Dutch, German',
    quote: '',
    interests: [
      'Cooking',
      'Piano',
      'Music lover',
      'Hobby gardener'
    ],
    traits: [
      'Introverted',
      'Honesty',
      'Dependability'
    ],
    personal: "Sometimes I feel like growing up is like soup and I'm a fork 😜. Love going for a walk at the coast 🌊(looking for someone to do this with!), going to concerts, playing that instrument with 88 keys 🎹 and baking cakes 🍰. When the weather is good, you will find me in my tiny little garden caring for my flowers 🌸 :)."
  }
];

shuffleArray(people);

console.log(people);

var continue_screen = function() {
  $('#match').animate({left: '-100%'}, function() {
    $('#matches').animate({left: '0px'});
  });
}

var select_match = function() {
  console.log(this);
  $('.choose_block img').removeClass('selected');
  $('#choose_none').removeClass('selected');

  var id = $(this).attr('id');

  if (id != 'choose_none') {
    selected = id.substr(id.length-1);
    $(this).find('img').addClass('selected');
  }
  else {
    selected = -1;
    $(this).addClass('selected');
  }

}

var choose_match = function() {
  if (selected !== -2) {
    for (var i = 0; i < people.length; i++) {
      var liked = 0;
      if (selected == i) {
        liked = 1;
      }

      $.post("/api/create_action.php",
        {
          random_id: id,
          picture_id: people[i].picture,
          name: people[i].name,
          order_id: i,
          is_liked: liked
        })
        .done(function(msg){
          //console.log(msg);
        })
        .fail(function(xhr, status, error) {
          //console.log(xhr.responseText);
        });
    }

    if (selected == -1) {
      $('#choose').animate({left: '-100%'}, function() {
        $('#matches').animate({left: '0px'});
      });
    }

    else {
      $('#match_img').attr('src', '/img/' + prefix + '/' + people[selected].picture + '.jpg');

      $('#choose').animate({left: '-100%'}, function() {
        $('#match').show();
      });
    }
  }
}

var next = function() {
  if (order == profiles.length-1) {
    profiles[order].animate({left: '-100%'}, function() {
      $('#choose').animate({left: '0px'});
    });

  }

  else {
    profiles[order].animate({left: '-100%'}, function() {
      profiles[order].hide();

      order += 1;

      $('html, body').scrollTop(0);
      profiles[order].show();
      profiles[order].animate({left: '0px'});
    });
  }
}

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
        exp_condition: '3', // Slow, no match
        gender_profiles: '2' // Female
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
        $(profiles[order].css('left', '0px'));
        $('#start_screen').hide();
    }, 500);
}

var check_order = function() {
  if (order == 30) {
    $('#matches').animate({left: '0px'});
  }
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

  cards[29-order].animate({left: '500px', top: '-500px', opacity: '0'}, function() { $(this).remove(); } );
  order += 1;
  check_order();
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

    if (inbound != '' && inbound != 'fullscreen_off' && inbound != 'fullscreen_on' && id == '') {
        console.log(inbound);
        $.post("/api/create_part.php",
          {
            qualtrics_id: inbound,
            exp_condition: '3',
            gender_profiles: '2'
          })
          .done(function(msg){
            id = msg.id;
          })
          .fail(function(xhr, status, error) {
            //console.log(xhr.responseText);
          });
    }
  });

  for (var i = 0; i < people.length; i++) {
    $('#choose_img_' + i).attr('src', '/img/' + prefix + '/' + people[i].picture + '.jpg');
    $('#choose_name_' + i).text(people[i].name);

    var profile = $(`  <div class="profile_page">
        <div class="header">
          <div class="logo"><img src="/img/logo.png" /></div>
          <div class="title">Discover</div>
        </div>
        <div class="main">
          <div class="card">
                <div class="profile_wrapper">
                  <img class="profile" src="/img/` + prefix + `/` + people[i].picture + `.jpg" />
                  <div class="name">` + people[i].name + `</div>
                </div>
          </div>
          <div class="quote">
            "` + people[i].quote + `"
          </div>
          <div class="about">
            <div class="text_title">About</div>
            <img src="/img/study.svg" /> ` + people[i].edu + `<br />
            <img src="/img/lang.svg" /> ` + people[i].lang + `
          </div>
          <div class="interests">
            <div class="text_title">Interests</div>
            <div class="interest_container">

            </div>
          </div>
          <div class="character_traits">
            <div class="text_title">Character traits</div>
            <div class="trait_container">

            </div>
          </div>
          <div class="personal">
            <div class="text_title">Personal</div>
            ` + people[i].personal + `
          </div>

          <div class="next">
            <div class="button_green">Next</div>
          </div>
        </div>
      </div>`);

    if (people[i].quote == '') {
      profile.find('.quote').hide();
    }

    for (var j = 0; j < people[i].interests.length; j++) {
      profile.find('.interest_container').append($('<div class="rounded ' + colors[j % colors.length] + '">' + people[i].interests[j] + '</div>'));
    }

    for (var j = 0; j < people[i].traits.length; j++) {
      profile.find('.trait_container').append($('<div class="rounded">' + people[i].traits[j] + '</div>'));
    }

    profiles.push(profile);
    $('body').append(profile);

  }

  setTimeout(function() {
    profiles[0].show();
    profiles[0].animate({left: '0px'});
    //$('.card').css('display', 'flex');
  }, 1500);

  // Create cards
  /*for (var i = 29; i >= 0; i--) {
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
  }, 500);*/


  $('#button_end').on('click', end_interaction);
  $('#button_start').on('click', start_interaction);
  $('.next').on('click', next);
  $('#button_choose').on('click', choose_match);
  $('.choose_block').on('click', select_match);
  $('#choose_none').on('click', select_match);
  $('#button_continue').on('click', continue_screen);

});
