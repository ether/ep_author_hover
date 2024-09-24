'use strict';

const padcookie = require('ep_etherpad-lite/static/js/pad_cookie').padcookie;
import html10n from 'ep_etherpad-lite/static/js/vendors/html10n'

let timer = 0;

const showAuthor = {
  enable: () => {
    $('iframe[name="ace_outer"]').contents().find('iframe')
      .contents().find('#innerdocbody').on('mousemove',exports.showAuthor.hover);
  },
  disable: (context) => {
    context.ace.callWithAce((ace) => {
      const doc = ace.ace_getDocument();
      $(doc).find('#innerdocbody').on('mousemove',null.bind(ace));
    }, 'showAuthor', true);
  },
  hover: (span) => {
    if (timer) { // wait a second before showing!
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      showAuthor.show(span);
    }, 1000);
  },
  show: (span) => {
    if (clientVars.plugins.plugins.ep_author_hover.enabled) {
      const authorTarget = $(span.target).closest('span')[0];
      if (!authorTarget) { return; } // We might not be over a valid target
      const authorId = showAuthor.authorIdFromClass(authorTarget.className); // Get the authorId
      if (!authorId) { return; } // Default text isn't shown
      showAuthor.destroy(); // Destroy existing
      const authorNameAndColor =
        showAuthor.authorNameAndColorFromAuthorId(authorId); // Get the authorName And Color
      showAuthor.draw(span, authorNameAndColor.name, authorNameAndColor.color);
    }
  },
  authorIdFromClass: (className) => {
    if (className.substring(0, 7) === 'author-') {
      return className.substring(7).replace(/[a-y0-9]+|-|z.+?z/g, (cc) => {
        if (cc === '-') { return '.'; } else if (cc.charAt(0) === 'z') {
          return String.fromCharCode(Number(cc.slice(1, -1)));
        } else {
          return cc;
        }
      });
    }
  },
  authorNameAndColorFromAuthorId: (authorId) => {
    const fullAuthorId = authorId; // historical data uses full author id without substing
    // todo figure out why we need a substring to fix this
    authorId = authorId.substring(0, 14); // don't ask....  something appears to be fucked in regex
    // It could always be me..
    const myAuthorId = pad.myUserInfo.userId.substring(0, 14);
    if (myAuthorId === authorId) {
      return {
        name: html10n.get('ep_author_hover.me'),
        color: '#fff',
      };
    }

    // Not me, let's look up in the DOM
    let authorObj = {};
    $('#otheruserstable > tbody > tr').each(function () {
      if (authorId === $(this).data('authorid').substring(0, 14)) {
        $(this).find('.usertdname').each(function () {
          authorObj.name = $(this).text();
          if (authorObj.name === '') authorObj.name = html10n.get('ep_author_hover.unknow_author');
        });
        $(this).find('.usertdswatch > div').each(function () {
          authorObj.color = $(this).css('background-color');
        });
        return authorObj;
      }
    });

    // Else go historical
    if (!authorObj || !authorObj.name) {
      // Try to use historical data
      authorObj = clientVars.collab_client_vars.historicalAuthorData[fullAuthorId];
    }

    return authorObj || {name: html10n.get('ep_author_hover.unknow_author'), color: '#fff'};
  },
  draw: (target, authorName, authorColor) => {
    if (!authorName) {
      const warning =
        'No authorName, I have no idea why!  Help me debug this by providing steps to replicate!';
      console.warn(warning);
      return;
    }
    const span = target.target;
    let top = span.offsetTop - 14;
    if (top < 0) top = $(span).height() + 14;
    let left = target.clientX + 15;
    $(span).removeAttr('title');

    // TODO use qtip, it will handle edge cases better
    const outBody = $('iframe[name="ace_outer"]').contents().find('body');
    const inFrame = $(outBody).find('iframe[name="ace_inner"]');
    const inFramePos = inFrame.position();
    left += inFramePos.left;
    top += inFramePos.top;

    const $indicator = $('<div>').attr({
      class: 'authortooltip',
      title: authorName,
    }).css({
      'opacity': '.8',
      'font-size': '14px',
      'padding': '5px 5px 0px 5px',
      'position': 'absolute',
      'left': `${left}px`,
      'top': `${top}px`,
      'background-color': authorColor,
    }).text(authorName);

    $(outBody).append($indicator);

    // After a while, fade out
    setTimeout(() => {
      $indicator.fadeOut(500, () => {
        $indicator.remove();
      });
    }, 700);
  },
  destroy: () => {
    $('iframe[name="ace_outer"]').contents().find('.authortooltip').remove();
  },
};

exports.postAceInit = (hookName, context) => {
  showAuthor.enable(context);
  clientVars.plugins.plugins.ep_author_hover = {};
  /* init */
  if (padcookie.getPref('author-hover') === false) {
    $('#options-author-hover').val();
    $('#options-author-hover').attr('checked', 'unchecked');
    $('#options-author-hover').attr('checked', false);
  } else {
    $('#options-author-hover').attr('checked', 'checked');
  }

  clientVars.plugins.plugins.ep_author_hover.enabled = !!$('#options-author-hover').is(':checked');

  /* on click */
  $('#options-author-hover').on('click', () => {
    if ($('#options-author-hover').is(':checked')) {
      clientVars.plugins.plugins.ep_author_hover.enabled = true;
      padcookie.setPref('author-hover', true);
    } else {
      padcookie.setPref('author-hover', false);
      clientVars.plugins.plugins.ep_author_hover.enabled = false;
    }
  });
};

exports.showAuthor = showAuthor;
