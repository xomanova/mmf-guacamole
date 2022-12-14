// Generated by CoffeeScript 1.12.7
(function() {
  var clock, count_codebreakers_left, data, get_team_players, huddle, is_red_team, key_value, multiplayer_vote, netgames, pass, render_board, render_header, terminal, wait_all;

  netgames = window.netgames;

  data = netgames.data;

  key_value = netgames.key_value;

  huddle = netgames.lib.huddle({
    min_players: data.two_teams_min_players
  });

  terminal = netgames.lib.terminal();

  pass = netgames.lib.pass();

  multiplayer_vote = netgames.lib.multiplayer_vote({
    vote_property: 'volunteer'
  });

  wait_all = netgames.lib.wait_all();

  clock = function(additional) {
    return netgames.lib.clock({
      clock_selector: '#dashboard .clock'
    }, additional);
  };

  count_codebreakers_left = function(state, current_colour) {
    var colour, index;
    return _.sum((function() {
      var i, len, ref, results;
      ref = state.colours;
      results = [];
      for (index = i = 0, len = ref.length; i < len; index = ++i) {
        colour = ref[index];
        results.push(!state.flipped[index] && colour === current_colour);
      }
      return results;
    })());
  };

  get_team_players = function(state, players, team) {
    return players.filter(function(player) {
      return state.team[player.id] === team;
    });
  };

  netgames.add_phases({
    huddle: huddle.method,
    setup: netgames.lib.choose_word_packs(),
    teams: netgames.lib.two_teams({
      min_team_size: 2
    }),
    intro: function(state, players, $section) {
      var blue_team, red_team, render_team;
      multiplayer_vote.render(state, players, $section);
      render_team = function(team_players, $players) {
        return netgames.render_players(state, team_players, $players, {
          volunteer: function(state, players, player) {
            return state.volunteer[player.id] === true;
          },
          abstain: function(state, players, player) {
            return state.volunteer[player.id] === false;
          }
        });
      };
      red_team = get_team_players(state, players, 'red');
      blue_team = get_team_players(state, players, 'blue');
      render_team(red_team, $section.find('.players .red'));
      render_team(blue_team, $section.find('.players .blue'));
      $section.find('.vs .red.num').text(red_team.length);
      return $section.find('.vs .blue.num').text(blue_team.length);
    },
    arrange: function(state, players, $section) {
      return wait_all.method(state, players, $section);
    },
    codemaster: clock({
      render: function(state, players, $section) {
        var $btn, $clue_input, $numbers, btn, i, len, selected;
        $numbers = $section.find('.numbers a');
        for (i = 0, len = $numbers.length; i < len; i++) {
          btn = $numbers[i];
          $btn = $(btn);
          selected = $btn.text() === '???' ? state.guess_num === null : state.guess_num === +$btn.text();
          $btn.toggleClass('btn-default', !selected);
          $btn.toggleClass('btn-primary', selected);
        }
        $clue_input = $section.find('#clue-input, .clue-input input');
        if (!$clue_input.is(':focus')) {
          $clue_input.val(state.clue);
        }
        return $section.find('.ok').toggleClass('disabled', state.guess_num === void 0 || !state.clue);
      }
    }),
    codebreakers: clock({
      render: function(state, players, $section) {
        var codebreakers_left, ref;
        pass.method(state, players, $section);
        $section.find('.clue').text(state.clue);
        $section.find('.guess-num').text((ref = state.guess_num) != null ? ref : '???');
        $section.find('.guesses-left').text(state.max_flipped != null ? state.max_flipped - _.sum(state.flipped) : '???');
        return codebreakers_left = count_codebreakers_left(state, state.red_turn ? 'red' : 'blue');
      }
    }),
    corrupted: function(state, players, $section) {
      var red_win;
      red_win = !state.red_turn;
      $section.find('.only-red-win').toggle(red_win);
      return $section.find('.only-blue-win').toggle(!red_win);
    }
  });

  is_red_team = function(state, player) {
    var ref;
    if (((ref = state.team) != null ? ref[player.id] : void 0) != null) {
      return state.team[player.id] === 'red';
    } else {
      return null;
    }
  };

  netgames.add_utility_menu_player_class_predicates({
    'red-team': function(state, players, player) {
      return is_red_team(state, player) === true;
    },
    'blue-team': function(state, players, player) {
      return is_red_team(state, player) === false;
    },
    codemaster: function(state, players, player) {
      var ref;
      return ((ref = state.is_codemaster) != null ? ref[player.id] : void 0) === true;
    }
  });

  netgames.prerender = function(state, players, $section) {
    var $content, codemaster, red_team, ref, ref1, ref2, show_board;
    $content = $('#content');
    codemaster = ((ref = state.is_codemaster) != null ? ref[netgames.player.id] : void 0) === true;
    red_team = is_red_team(state, netgames.player);
    terminal = (ref1 = state.phase) === 'red_victory' || ref1 === 'blue_victory' || ref1 === 'corrupted';
    $content.toggleClass('codemaster', codemaster);
    $content.toggleClass('red-team', red_team === true);
    $content.toggleClass('blue-team', red_team === false);
    $content.toggleClass('current-turn', red_team === state.red_turn);
    $content.toggleClass('red-turn', state.red_turn);
    $content.toggleClass('blue-turn', !state.red_turn);
    $content.toggleClass('codemaster-turn', state.phase === 'codemaster');
    $content.toggleClass('codebreakers-turn', state.phase === 'codebreakers');
    $content.toggleClass('terminal', terminal);
    show_board = (ref2 = state.phase) === 'codemaster' || ref2 === 'codebreakers' || ref2 === 'red_victory' || ref2 === 'blue_victory' || ref2 === 'corrupted';
    $('#board').toggle(show_board);
    $('header').toggle(show_board);
    if (show_board) {
      render_board(state, codemaster, terminal);
      return render_header(state);
    }
  };

  render_board = function(state, codemaster, terminal) {
    var $cards, $li, i, index, len, li, results;
    if (state.cards == null) {
      return;
    }
    $('#board').toggleClass('enabled', state.phase === 'codebreakers');
    $cards = $('#board li');
    results = [];
    for (index = i = 0, len = $cards.length; i < len; index = ++i) {
      li = $cards[index];
      $li = $(li);
      $li.find('span').text(state.cards[index]);
      $li.data('index', index);
      $li.removeClass('red blue corrupted civilian');
      if (state.flipped[index] || codemaster || terminal) {
        $li.addClass(state.colours[index]);
      }
      $li.toggleClass('flipped', state.flipped[index]);
      results.push($li.toggleClass('selected', state.to_flip === index));
    }
    return results;
  };

  render_header = function(state) {
    var $dashboard;
    $dashboard = $('#dashboard');
    $dashboard.find('.red .found').text(state.red_num - count_codebreakers_left(state, 'red'));
    $dashboard.find('.red .total').text('/' + state.red_num);
    $dashboard.find('.blue .found').text(state.blue_num - count_codebreakers_left(state, 'blue'));
    return $dashboard.find('.blue .total').text('/' + state.blue_num);
  };

  $(function() {
    huddle.attach($('#huddle'));
    multiplayer_vote.attach($('#intro'));
    wait_all.attach($('#arrange'));
    terminal.attach($('#red_victory'));
    terminal.attach($('#blue_victory'));
    terminal.attach($('#corrupted'));
    pass.attach($("#codebreakers"));
    $('#codemaster .clue-input input, #clue-input').on('change blur', function(event) {
      return netgames.change({
        clue: $(this).val()
      });
    });
    $('#codemaster .numbers .btn').click(function(event) {
      var num;
      num = $(this).text() === '???' ? null : +$(this).text();
      return netgames.change({
        guess_num: num
      });
    });
    $('#codemaster .ok').click(function(event) {
      return netgames.change({
        ready: true
      });
    });
    $(document).on('click', '#content.codebreakers-turn.current-turn:not(.codemaster)', function(event) {
      event.stopPropagation();
      return netgames.change({
        to_flip: null,
        ready: null
      });
    });
    $(document).on('click', '#content.codebreakers-turn.current-turn:not(.codemaster) #board.enabled li:not(.flipped):not(.selected)', function(event) {
      event.stopPropagation();
      return netgames.change({
        to_flip: +$(this).data('index'),
        ready: null
      });
    });
    return $(document).on('click', '#content.codebreakers-turn.current-turn:not(.codemaster) #board.enabled li.selected:not(.flipped)', function(event) {
      event.stopPropagation();
      return netgames.change({
        ready: +$(this).data('index')
      });
    });
  });

}).call(this);

//# sourceMappingURL=room.js.map
