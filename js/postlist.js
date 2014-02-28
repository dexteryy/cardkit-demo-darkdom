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

var title_component = darkdom({
  unique: true,
  render: title_render
});

var tag_component = darkdom({
  render: tag_render
});

var item_component = darkdom({
  enableSource: true,
  render: item_render
}).contain({
  title: title_component,
  tag: tag_component
}).contain('folder', folder_component, {
  content: true
}).forward({
  'click .opt .edit': 'showEdit',
  'click .opt .close': 'closeEdit',
  'change input.title': 'titleChange',
  'change input.tags': 'tagsChange',
});

var hd_component = darkdom({
  unique: true,
  render: hd_render
});

var ft_component = darkdom({
  unique: true,
  render: ft_render
});

var list_component = darkdom({
  enableSource: true,
  render: list_render
});
list_component.contain({
  hd: hd_component,
  ft: ft_component,
  item: item_component
});

/** DarkRender */

function list_render(model){
  return '<div class="demo-postlist">'
      + (model.component.hd || '')
      + '<ul>'
        + model.component.item.join('')
      + '</ul>'
        + (model.component.ft || '')
    + '</div>';
}

function item_render(model){
  model.custom = {};
  if (model.state.isEditMode === 'true') {
    model.custom.className = 'editmode';
    model.custom.tags = model.componentData.tag
      .map(function(tag_model){
        return tag_model.content;
      }).join(',');
  }
  return require('mo/template')
    .convertTpl('item_tpl', model);
}

function hd_render(model){
  return '<header><h3>' 
    + model.content 
    + '</h3></header>';
}

function ft_render(model){
  return '<footer>'
    + model.content
    + '</footer>';
}

function title_render(model){
  if (model.context.state.isEditMode === 'true') {
    return '<input type="text" class="title" value="{v}">'
      .replace(/\{v\}/, model.content);
  } else {
    return '<h6>' + model.content + '</h6>';
  }
}

function tag_render(model){
  return '<li>' + model.content + '</li>';
}

function folder_render(model){
  var mode = model.state.isFolded ? 'fold' : '';
  return '<span class="demo-folder ' + mode + '">'
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

function list_spec(list_guard){
  list_guard.watch($('x-postlist'));
  list_guard.component({
    hd: hd_spec,
    ft: ft_spec,
    item: item_spec
  });
  list_guard.source().component({
    item: source_item_spec
  });
}

function hd_spec(hd_guard){
  hd_guard.watch('x-hd');
}

var ft_spec = 'x-ft';

function item_spec(item_guard){
  item_guard.watch('x-item');
  item_guard.state({
    isEditMode: 'edit-mode'
  });
  item_guard.component({
    title: title_spec,
    tag: tag_spec,
    folder: folder_spec
  });
  item_guard.forward(item_events);
  item_guard.source().state({
    isEditMode: 'edit-mode'
  }).component({
    title: source_title_spec
  });
}

var item_events = {
  showEdit: function(e, node){
    node.attr('edit-mode', true);
    $('x-postlist').updateDarkDOM();
  },
  closeEdit: function(e, node){
    node.attr('edit-mode', false);
    $('x-postlist').updateDarkDOM();
    if (node[0].nodeName !== 'X-ITEM') {
      alert('It is easy to update content from '
        + 'Source Root but not implemented here.');
    }
  },
  titleChange: function(e, node){
    if (node[0].nodeName !== 'X-ITEM') {
      return;
    }
    var title = node.find('x-title');
    if (title[0]) {
      title.html(e.target.value);
    } else {
      node.append('<x-title>' 
        + e.target.value + '</x-title>');
    }
  },
  tagsChange: function(e, node){
    if (node[0].nodeName !== 'X-ITEM') {
      return;
    }
    var values = e.target.value.split(/\s*,\s*/);
    values = values.map(function(v){
      return '<x-tag>' + v + '</x-tag>';
    }).join('');
    var tags = node.find('x-tag');
    if (tags[0]) {
      tags.eq(0).before(values);
    } else {
      node.append(values);
    }
    tags.remove();
  },
};

function source_item_spec(source_item_guard){
  source_item_guard.watch('.src-item');
  source_item_guard.state({
    isEditMode: 'edit-mode'
  }).component({
    title: source_title_spec
  }).forward(item_events);
}

var title_spec = 'x-title';
var source_title_spec = '.src-title';

var tag_spec = 'x-tag';

function folder_spec(folder_guard){
  folder_guard.watch('x-folder');
  folder_guard.state('isFolded', function(node){
    return node.attr('mode') === 'fold';
  }).component({
    caption: caption_spec
  }).forward(folder_events);
}

var folder_events = {
  toggle: function(e, node){
    var inverse = {
      'fold': 'unfold',
      'unfold': 'fold'
    };
    var mode = inverse[node.attr('mode')];
    node.attr('mode', mode).updateDarkDOM();
  }
};

var caption_spec = 'x-caption';

// init
var list_guard = list_component.createGuard();
list_spec(list_guard);
list_guard.mount();

//$('x-postlist').feedDarkDOM(function(source_model){
  //source_model.componentData.item.push({
    //componentData: {
      //title: {
        //contentData: {
          //text: 'Post D'
        //}
      //}
    //},
    //contentData: {
      //text: 'Paragraph E'
    //}
  //});
  //return source_model;
//}).updateDarkDOM();

});

