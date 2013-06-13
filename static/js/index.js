var _ = require('ep_etherpad-lite/static/js/underscore');

var timer = 0;

exports.postAceInit = function(hook_name, context){
  showAuthor.enable(context);
}

var showAuthor = {
  enable: function(context){
    context.ace.callWithAce(function(ace){
      var doc = ace.ace_getDocument();
      $(doc).find('#innerdocbody').mousemove(_(exports.showAuthor.hover).bind(ace));
    }, 'showAuthor', true);
  },
  disable: function(context){
   context.ace.callWithAce(function(ace){
      var doc = ace.ace_getDocument();
      $(doc).find('#innerdocbody').mousemove(_().bind(ace));
    }, 'showAuthor', true);
  },
  hover: function(span){

    if(timer) { // wait a second before showing!
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(function(){
      showAuthor.show(span);
    }, 1000);

  },
  show: function(span){
    var authorId = showAuthor.authorIdFromClass(span.target.className); // Get the authorId
    if(!authorId){ return; } // Default text isn't shown
    showAuthor.destroy(); // Destroy existing
    var authorNameAndColor = showAuthor.authorNameAndColorFromAuthorId(authorId); // Get the authorName And Color
    showAuthor.draw(span, authorNameAndColor.name, authorNameAndColor.color);
  },
  authorIdFromClass: function(className){
    if (className.substring(0, 7) == "author-") {
      className = className.substring(0,49);
      return className.substring(7).replace(/[a-y0-9]+|-|z.+?z/g, function(cc) {
        if (cc == '-') { return '.'; }
        else if (cc.charAt(0) == 'z') {
          return String.fromCharCode(Number(cc.slice(1, -1)));
        }
        else {
          return cc;
        }
      });
    }
  },
  authorNameAndColorFromAuthorId: function(authorId){
    // It could always be me..
    var myAuthorId = pad.myUserInfo.userId;
    if(myAuthorId == authorId){
      return {
        name: "Me",
        color: "#fff"
      }
    }

    // Not me, let's look up in the DOM
    var authorObj = {};
    $('#otheruserstable > tbody > tr').each(function(){
      if (authorId == $(this).data("authorid")){
        $(this).find('.usertdname').each( function() {
          authorObj.name = $(this).text();
          if(authorObj.name == "") authorObj.name = "Unknown Author";
        });
        $(this).find('.usertdswatch > div').each( function() {
          authorObj.color = $(this).css("background-color");
        });
        return authorObj;
      }
    });

    // Else go historical
    if(!authorObj || !authorObj.name){
      var authorObj = clientVars.collab_client_vars.historicalAuthorData[authorId]; // Try to use historical data
    }

    return authorObj || {name: "Unknown Author", color: "#fff"};
  },
  draw: function(target, authorName, authorColor){
    var span = target.target;
    var fontSize = $(span).parent().css('font-size');
    var top = $(span).context.offsetTop -14;
    if(top < 0) top = $(span).height() +14;
    var left = target.clientX +15;
    $(span).removeAttr("title");

    // TODO use qtip, it will handle edge cases better
    var outBody = $('iframe[name="ace_outer"]').contents().find("body");
    var $indicator = $("<div class='authortooltip' style='opacity:.8;font-size:14px;padding:5px 5px 0px 5px;position:absolute;left:"+left+"px;top:"+top +"px;background-color:"+authorColor+"' title="+authorName+">"+authorName+"</div>");
    $(outBody).append($indicator);
  
    // After a while, fade out
    setTimeout(function(){
      $indicator.fadeOut(500, function(){
        $indicator.remove();
      });
    }, 500);
  },
  destroy: function(){
    $('iframe[name="ace_outer"]').contents().find(".authortooltip").remove();
  }
}

exports.showAuthor = showAuthor;
