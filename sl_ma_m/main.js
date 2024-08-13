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
    picture: '2',
    name: 'Noah',
    edu: 'University',
    lang: 'English, Dutch, French',
    quote: 'Growing up is like soup and I\'m a fork.',
    interests: [
      'Camping',
      'Dog lover',
      'Football',
      'Cinema goer'
    ],
    traits: [
      'Independent',
      'Extraverted',
      'Intuitive',
      'Calm'
    ],
    personal: 'I love the outdoors, sunrise coffee and campfires 🏕️. I also have a dog (labrador!) named Boris 🐶. Have played football since I was 12, but now in a team of friends where the 3rd half is just that little bit more important ;).'
  },
  {
    picture: '20',
    name: 'Lucas',
    edu: 'University',
    lang: 'English, Dutch',
    quote: '',
    interests: [
      'Tennis',
      'Traveling',
      'Politics',
      'Theater'
    ],
    traits: [
      'Optimistic',
      'Trustworthy',
      'Spiritual'
    ],
    personal: 'Current relationship status: Cooked for two, ate everything by myself 😜. About me: social guy who is always in for a drink! A road trip across Scandinavia is on my bucket list, can talk about politics for hours and I am a fanatic tennis player 🎾.'
  },
  {
    picture: '25',
    name: 'Sem',
    edu: 'HBO',
    lang: 'English, Dutch',
    quote: '',
    interests: [
      'Cooking',
      'Gaming',
      'Photography',
      'Film',
      'Cat lover'
    ],
    traits: [
      'Patient',
      'Dedicated',
      'Introverted',
      'Creative'
    ],
    personal: 'Married, kids, and looking for something exciting next door. Just kidding. Single. 3 house plants. 1 cat. Bit more introversive myself, but when I am close to someone I can easily bend someone’s ear about my passion for movies… If I would believe my mother, I am a real star in the kitchen :) Favorite dish: paella.'
  },
  {
    picture: '29',
    name: 'Daan',
    edu: 'HBO',
    lang: 'English, Dutch, German',
    quote: 'Looking for someone who can help me find my other sock.',
    interests: [
      'Fitness',
      'Traveling',
      'Festivals',
      'Music',
      'Playing guitar'
    ],
    traits: [
      'Extraverted',
      'Flexible',
      'Ambitious'
    ],
    personal: "Are you my new travel buddy? Have been to Thailand, Australia and Peru thus far! You can find me in the gym four times a week, the other days I am busy working or busy with finding my friends at festivals 🎪."
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
      $('#no_matches').hide();

      $('#match_img').attr('src', '/img/' + prefix + '/' + people[selected].picture + '.jpg');

      $('#matches_container').append(
        $(`   <div class="match_row">
                <div class="match_pic">
                  <img src="/img/` + prefix + `/` + people[selected].picture + `.jpg" />
                </div>
                <div class="match_name">
                  ` + people[selected].name + `
                </div>
              </div>
        `));

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
        exp_condition: '4', // Slow, match
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
            exp_condition: '4',
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
