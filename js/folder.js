/**
 * vim: et:ts=2:sw=2:sts=2
 */
require(function(require){

var $ = require('dollar');
var darkdom = require('darkdom');

/** DarkComponent */

var caption_component = darkdom({
  unique: true,
  render: caption_render
});
    
var folder_component = darkdom({
  render: folder_render
}).contain({
  caption: caption_component
}).forward('click .sum .icon', 'toggle');

/** DarkRender */

function folder_render(model){
  return '<span class="demo-folder ' 
      + model.state.foldMode 
    + '">'
      + (model.component.caption || '')
      + '<span class="detail">'
        + model.content
      + '</span>'
    + '</span>';
}

function caption_render(model){
  return '<span class="sum">'
      + model.content 
      + '<span class="icon show">[Show]</span>' 
      + '<span class="icon hide">[Hide]</span>'
    + '</span>';
}

/** DarkGuard */

function folder_spec(folder_guard){
  folder_guard.watch('x-folder');
  folder_guard.state({
      foldMode: 'mode'
  }).component({
      caption: caption_spec
  }).forward(folder_events);
}

var folder_events = {
  toggle: function(e, dark_root){
    var inverse = {
      'fold': 'unfold',
      'unfold': 'fold'
    };
    var mode = inverse[dark_root.attr('mode')];
    dark_root.attr('mode', mode).updateDarkDOM();
  }
};

var caption_spec = 'x-caption';

// init

var folder_guard = folder_component.createGuard();
folder_spec(folder_guard);
folder_guard.mount();

});
