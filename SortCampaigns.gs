/* This sort function is used to make the sorting between
  google sheets and this script consistent */

function campaignSort(a,b) {
  //ignores case
  var aName = a[0].toLowerCase();
  var bName = b[0].toLowerCase();
  var shorter = null;
  var sameLength = false;
  if(aName.length > bName.length){
    shorter = bName;
  }else if(aName.length < bName.length){
    shorter = aName;
  }else{
    //same
    shorter = aName;
    sameLength = true;
  }
  var index = 0;
  while(index<shorter.length){
    var aChar = aName[index];
    var bChar = bName[index];
    if(aChar !== bChar){
      if(aChar == " " || bChar == " "){
        if(aChar == " "){
          return -1
        }else{
          return 1
        }
      }
      if(aChar == "-" || bChar == "-"){
        if(aChar == "-"){
          return -1
        }else{
          return 1
        }
      }
      if(aChar == "|" || bChar == "|"){
        if(aChar == "|"){
          return -1
        }else{
          return 1
        }
      }
      else{
        if(aChar < bChar){
          return -1
        }else{
          return 1
        }
      }
    }
    index++;
  }
  if(!sameLength){
    if(aName.length < bName.length){
      return -1
    }else{
      return 1
    }
  }else{
    var platform = null;
    var aPlatform = a[PLATFORM_INDEX].toLowerCase();
    var bPlatform = b[PLATFORM_INDEX].toLowerCase();
    if(aPlatform.length < bPlatform.length){
      platform = aPlatform;
    }else{
      platform = bPlatform;
    }
    var index = 0;
    while(index<platform.length){
      var aChar = aPlatform[index];
      var bChar = bPlatform[index];
      if(aChar !== bChar){
        if(aChar < bChar){
          return -1
        }else{
          return 1
        }
      }
      index++;
    }
  }
  return 0
}
