'use strict';

$(document).ready(function () {
  var converter = new showdown.Converter();

  var switches = {
    title: false,
    text: false,
    url: false,
    icon: false,
    img2: false,
    useVars: false
  };

  var fields = 0;

  var source = '';

  var embed = {
    title: '',
    text: '',
    author: {
      name: '',
      url: '',
      icon: ''
    },
    description: '',
    url: '',
    thumb_url: '',
    image_url: '',
    color: '',
    fields: [{}],
    footer2: '',
    footer: {
      text: '',
      icon: ''
    }
  };

  function resetEmbed() {
    $('.embed-inner').html('');
    $('.embed-footer').remove();
    $('.embed-thumb').remove();
    $('.embed-image').remove();
    $('.embed-fields').remove();
  }

  function updateEmbed(embed) {
    resetEmbed();

    // add basic embed generation to source
    source = '{';
    
    if (embed.text) {
      // update source
      if (switches.useVars) {
        source += 'title=' + embed.title;
      } else {
        source += '\n  "text": "' + embed.text + '"';
      }
    }
    if (embed.url) {
      $('.embed-inner').append('<div class="embed-title"><a href="' + embed.url + '">' + embed.title + '</a></div>');

      // update source
      if (switches.useVars) {
        source += 'title=' + embed.title + ', url=' + embed.url;
      } else {
        source += '\n  "title": "' + embed.title + '", url="' + embed.url + '"';
      }
    } else if (embed.title.length === 0) {
      source += "";
    } else {
      $('.embed-inner').append('<div class="embed-title">' + embed.title + '</div>');
      let e = embed
      if (e.text.length > 0 || embed.url.length > 0) {
        source += ','
      }

      // update source
      if (switches.useVars) {
        source += 'title=' + embed.title;
      } else {
        source += '\n  "title": "' + embed.title + '"';
      }

    }

    if (embed.description) {
      $('.embed-inner').append('<div class="embed-description">' + converter.makeHtml(embed.description) + '</div>');
      let e = embed
      if (e.title.length > 0 || e.text.length > 0) {
        source += ','
      }

      // update source
      if (switches.useVars) {
        source += 'description=' + embed.description;
      } else {
        source += '\n  "description": "' + embed.description + '"';
      }
    }

    if (embed.color) {
      $('.side-colored').css('background-color', embed.color);
      let e = embed
      if (e.title.length > 0 || e.text.length > 0 || e.description.length > 0 ) {
        source += ','
      }

      // update source
      source += '\n  "color": "0x' + embed.color.substr(1) + '"';
    }

    // finished the basic setup
    
    if (embed.thumb_url) {
      // add thumbnail
      let e = embed; 
      if ( e.title.length > 0 || e.description.length > 0 || e.color.length > 0 || e.text.length > 0 ) {
        source += ','
      }

      source += '\n  "thumbnail": {';

      $('.card.embed .card-block').append('<img class="embed-thumb" src="' + embed.thumb_url + '" />');
      $('.embed-thumb').height($('.embed-thumb')[0].naturalHeight);

      // update source
      if (switches.useVars) {
        source += 'url=' + embed.thumb_url;
      } else {
        source += '\n    "url": "' + embed.thumb_url + '"';
      }

      // finish thumbnail
      source += '\n  }';
    }
    
    if (embed.image_url) {
      // add thumbnail
      let e = embed; 
      if ( e.title.length > 0 || e.description.length > 0 || e.color.length > 0 || e.thumb_url.length > 0 || e.text.length > 0) {
        source += ','
      }

      source += '\n  "image": {';

      $('.card.embed ').append('<img class="embed-image" src="' + embed.image_url + '" />');
      $('.embed-image').height($('.embed-image')[0].naturalHeight);

      // update source
      if (switches.useVars) {
        source += 'url=' + embed.image_url;
      } else {
        source += '\n    "url": "' + embed.image_url + '"';
      }

      // finish thumbnail
      source += '\n  }';
    }


    if (embed.author.name) {
      // add author to source
      let e = embed; 
      if ( embed.title.length > 0 || embed.description.length > 0 || e.color.length > 0 || embed.thumb_url.length > 0 || embed.image_url.length > 0 || e.text.length > 0 ) {
        source += ','
      }

      source += '\n  "author": {';

      const titleExists = document.getElementsByClassName('embed-title').length > 0;
      const authorNameHTML = '<div class="embed-author"><a class="embed-author-name" href="' + embed.author.url + '">' + embed.author.name + '</a></div>';
      if(titleExists) $('.embed-title').before(authorNameHTML);
      else $('.embed-inner').append(authorNameHTML);

      // update source
      if (switches.useVars) {
        source += 'name=' + embed.author.name;
      } else {
        source += '\n    "name": "' + embed.author.name + '"';
      }

      if(embed.author.url) {
        source += ', ';

        if (switches.useVars) {
          source += 'url=' + embed.author.url;
        } else {
          source += '\n    "url": "' + embed.author.url + '"';
        }
      }
      
      if (embed.author.icon) {
        $('.embed-author-name').before('<img class="embed-author-icon" src="' + embed.author.icon + '" />');

        source += ', ';

        // update source
        if (switches.useVars) {
          source += 'icon_url=' + embed.author.icon;
        } else {
          source += '\n    "icon_url": "' + embed.author.icon + '"';
        }
      }
      source += '\n  }';
      // finish author
    }

    if (embed.footer) {
      $('.card.embed').append('<div class="embed-footer"><span>' + embed.footer.text + '</span></div>');

    }
    
    if (embed.footer.text) {
      // add author to source
      let e = embed; 
      if ( embed.title.length > 0 || embed.description.length > 0 || e.color.length > 0 || embed.thumb_url.length > 0 || embed.image_url.length > 0 || e.text.length > 0 || e.author.length > 0) {
        source += ','
      }

      source += '\n  "footer": {';

      // update source
      if (switches.useVars) {
        source += 'name=' + embed.author.name;
      } else {
        source += '\n    "text": "' + embed.footer.text + '"';
      }

      if (embed.footer.icon) {
        $('.embed-footer-text').before('<img class="embed-footer-icon" src="' + embed.footer.icon + '" />');

        source += ', ';

        // update source
        if (switches.useVars) {
          source += 'icon_url=' + embed.author.icon;
        } else {
          source += '\n    "icon_url": "' + embed.footer.icon + '"';
        }
      }
      source += '\n  }';
      // finish author
    }
    // add send function
    source += '\n}\n';

    // code
    $('.source').text(source);
    hljs.highlightBlock($('.source')[0]);
  }

  // run once on startup
  updateEmbed(embed);

  function generateInputFields(fields) {
    // generate inputs for fields
    $('.input-fields').html('');

    var _loop = function _loop(i) {
      $('.input-fields').append('<div class="form-group row">\n        <div class="col-sm-4">\n          <input class="form-control" id="field-' + i + '-name" type="text" placeholder="name" value="' + (embed.fields[i].name !== undefined ? embed.fields[i].name : '') + '" />\n        </div>\n        <div class="col-sm-4">\n          <input class="form-control" id="field-' + i + '-value" type="text" placeholder="value" value="' + (embed.fields[i].value !== undefined ? embed.fields[i].value : '') + '" />\n        </div>\n        <div class="col-sm-2">\n          <div class="form-check">\n            <label class="form-check-label">\n              <input class="form-check-input" id="field-' + i + '-inline" type="checkbox" ' + (embed.fields[i].inline !== undefined ? 'checked="checked"' : '') + '> Inline\n            </label>\n          </div>\n        </div>\n        <div class="col-sm-2">\n          <button id="field-' + i + '-delete" class="btn btn-danger">Delete</button>\n        </div>\n      </div>');
      $('#field-' + i + '-name').keyup(function () {
        updateFieldName(i, $('#field-' + i + '-name').val());
      });

      $('#field-' + i + '-value').keyup(function () {
        updateFieldValue(i, $('#field-' + i + '-value').val());
      });

      $('#field-' + i + '-inline').click(function () {
        updateFieldInline(i, $('#field-' + i + '-inline').is(':checked'));
      });

      $('#field-' + i + '-delete').click(function (e) {
        e.preventDefault();
        deleteField(i);
      });
    };

    for (var i = 0; i < fields; i++) {
      _loop(i);
    }
    $('.input-fields').append('<button id="add-field" class="btn btn-success">Add field</button>');
    $('#add-field').click(function (e) {
      e.preventDefault();
      addField();
    });
  }

  generateInputFields(fields);

  function updateFieldName(index, value) {
    embed.fields[index].name = value;
    updateEmbed(embed);
  }

  function updateFieldValue(index, value) {
    embed.fields[index].value = value;
    updateEmbed(embed);
  }

  function updateFieldInline(index, value) {
    embed.fields[index].inline = value;
    updateEmbed(embed);
  }

  function deleteField(index) {
    embed.fields.splice(index, 1);
    updateEmbed(embed);
    fields -= 1;
    generateInputFields(fields);
  }

  function addField() {
    embed.fields.push({ inline: true });
    fields += 1;
    generateInputFields(fields);
  }

  function updateTitle(value) {
    embed.title = value || '';
    updateEmbed(embed);
  }

  function updateText(value) {
    embed.text = value || '';
    updateEmbed(embed);
  }

  function updateUrl(value) {
    embed.url = value || '';
    updateEmbed(embed);
  }

  function updateThumb(value) {
    embed.thumb_url = value || false;
    updateEmbed(embed);
  }

  function updateImage(value) {
    embed.image_url = value || false;
    updateEmbed(embed);
  }

  function updateDescription(value) {
    embed.description = value || '';
    updateEmbed(embed);
  }

  function updateColor(value) {
    embed.color = value || false;
    updateEmbed(embed);
  }

  function updateAuthorName(value) {
    embed.author.name = value || '';
    updateEmbed(embed);
  }

  function updateAuthorUrl(value) {
    embed.author.url = value || '';
    updateEmbed(embed);
  }

  function updateAuthorIcon(value) {
    embed.author.icon = value || '';
    updateEmbed(embed);
  }
  
  function updateFooterText(value) {
    embed.footer.text = value || '';
    updateEmbed(embed);
  }

  function updateFooterIcon(value) {
    embed.footer.icon = value || '';
    updateEmbed(embed);
  }

  function updateFooter(value) {
    embed.footer = value || '';
    updateEmbed(embed);
  }

  $('#form').submit(function (e) {
    e.preventDefault();
  });

  // checking helpers
  function addWarning(item, type, message) {
    item.addClass('form-control-warning');
    item.removeClass('form-control-success');
    item.parent().addClass('has-warning');
    item.parent().removeClass('has-success');
    if ($('#' + type + '-feedback').length === 0) {
      item.after('<div class="form-control-feedback" id="' + type + '-feedback">' + message + '</div>');
    }
  }

  function addSuccess(item, type) {
    item.removeClass('form-control-warning');
    item.addClass('form-control-success');
    item.parent().addClass('has-success');
    item.parent().removeClass('has-warning');
    $('#' + type + '-feedback').remove();
  }
  
  $('#text').keyup(function () {
    var item = $('#text');
    var text = item.val();

    // update
    updateText(text);
  });

  $('#title').keyup(function () {
    var item = $('#title');
    var title = item.val();

    // update
    updateTitle(title);
  });

  $('#url').keyup(function () {
    var item = $('#url');
    var url = item.val();

    if (url.substr(0, 4) !== 'http' && url.length !== 0 && !switches.useVars) {
      addWarning(item, 'url', 'not a valid url');
    } else {
      addSuccess(item, 'url');
      // update
      updateUrl(url);
    }
  });

  $('#icon').keyup(function () {
    var item = $('#icon');
    var icon = item.val();

    if (icon.substr(0, 4) !== 'http' && icon.length !== 0 && !switches.useVars) {
      addWarning(item, 'icon', 'not a valid url');
    } else {
      addSuccess(item, 'icon');
      // update
      updateThumb(icon);
    }
  });

  $('#img2').keyup(function () {
    var item = $('#img2');
    var img2 = item.val();

    if (img2.substr(0, 4) !== 'http' && img2.length !== 0 && !switches.useVars) {
      addWarning(item, 'img2', 'not a valid url');
    } else {
      addSuccess(item, 'img2');
      // update
      updateImage(img2);
    }
  });

  $('#description').keyup(function () {
    var item = $('#description');
    var description = item.val();
    addSuccess(item, 'description');
    // update
    updateDescription(description);
  });

  $('#color').change(function () {
    updateColor($('#color').val());
  });

  $('#author_name').keyup(function () {
    var item = $('#author_name');
    var author_name = item.val();

    addSuccess(item, 'author_name');
    // update
    updateAuthorName(author_name);
  });

  $('#author_url').keyup(function () {
    var item = $('#author_url');
    var author_url = item.val();

    if (author_url.substr(0, 4) !== 'http' && author_url.length !== 0 && !switches.useVars) {
      addWarning(item, 'author_url', 'not a valid url');
    } else {
      addSuccess(item, 'author_url');
      // update
      updateAuthorUrl(author_url);
    }
  });

  $('#author_icon').keyup(function () {
    var item = $('#author_icon');
    var author_icon = item.val();

    if (author_icon.substr(0, 4) !== 'http' && author_icon.length !== 0 && !switches.useVars) {
      addWarning(item, 'author_icon', 'not a valid url');
    } else {
      addSuccess(item, 'author_icon');
      // update
      updateAuthorIcon(author_icon);
    }
  });
  
  $('#footer_text').keyup(function () {
    var item = $('#footer_text');
    var footer_text = item.val();

    addSuccess(item, 'footer_text');
    // update
    updateFooterText(footer_text);
  });

  $('#footer_icon').keyup(function () {
    var item = $('#footer_icon');
    var footer_icon = item.val();

    if (footer_icon.substr(0, 4) !== 'http' && footer_icon.length !== 0 && !switches.useVars) {
      addWarning(item, 'footer_icon', 'not a valid url');
    } else {
      addSuccess(item, 'footer_icon');
      // update
      updateFooterIcon(footer_icon);
    }
  });

  $('#footer').keyup(function () {
    var item = $('#footer');
    var footer = item.val();

    addSuccess(item, 'footer');
    // update
    updateFooter(footer);
  });

  $('#useVars').click(function () {
    switches.useVars = !switches.useVars;
    updateEmbed(embed);
  });
});
