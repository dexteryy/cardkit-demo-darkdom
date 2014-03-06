/**
 * vim: et:ts=2:sw=2:sts=2
 */
require(function(require){

var darkdom = require('darkdom');
var Handlebars = require('handlebars');

// DarkComponent

var card_component = darkdom({
  render: function(model){
    return card_render(model);
  }
}).response('state:isEnabled', function(changes){
  if (changes.newValue) {
    changes.root.addClass('enabled');
  } else {
    setTimeout(function(){
      changes.root.removeClass('enabled');
    }, 400);
  }
  return false;
});

var deck_component = darkdom({
  render: function(model){
    return deck_render(model);
  }
}).contain({
  card: card_component
}).forward({
  'click .demo-card': 'switch'
}).response('state:index', function(changes){
  changes.root.attr('index', changes.newValue);
});

// DarkRender

var deck_render = Handlebars.compile(
'<div class="demo-deck" index="{{state.index}}"\
    total="{{state.total}}">\
  <div class="demo-deck-title">Demo</div>\
  <div class="demo-deck-inner">\
    {{#each component.card}}\
      <div class="demo-deck-item"\
        data-order="{{@index}}">{{{this}}}</div>\
    {{/each}}\
  </div>\
</div>');

var card_render = Handlebars.compile(
'<div class="demo-card {{state.transType}}\
      {{#if state.isEnabled}} enabled {{/if}}"\
    style="background-color:{{state.bgcolor}};">\
  {{{content}}}\
</div>');

// DarkGuard

var deck_guard = deck_component.createGuard();
deck_guard.watch('x-deck').state({
  index: function(deck_node){
    var cards = deck_node.find('x-card');
    for (var i = 0, l = cards.length; i < l; i++) {
      if (typeof cards.eq(i).attr('selected') === 'string') {
        return i.toString();
      }
    }
    return '0';
  },
  total: function(deck_node){
    return deck_node.find('x-card').length;
  }
}).component('card', function(card_guard){
  card_guard.watch('x-card').state({
    bgcolor: 'bgcolor',
    transType: "transition-type",
    isEnabled: function(card_node){
      var v = card_node.attr('selected');
      return typeof v === 'string';
    }
  });
}).forward('switch', function(e, deck_node){
  var cards = deck_node.find('x-card');
  var index = deck_node.getDarkState('index');
  var total = deck_node.getDarkState('total');
  cards.eq(index).removeAttr('selected');
  if (++index >= total) {
    index = 0;
  }
  cards.eq(index).attr('selected', true);
  deck_node.updateDarkDOM();
}).mount();

});
