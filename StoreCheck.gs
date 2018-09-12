function checkStore(store) {
  var platforms = ['platfrom1', 'platform2', 'platform3'];
  var people = ['person1', 'person2', 'person3'];
  var errors = [];
  platforms.forEach(function(platform){
    var platformData = store[platform];
    var brands = Object.keys(platformData);
    brands.forEach(function(brand){
      var periods = Object.keys(platformData[brand]);
      if(periods.length < 4){
        //throw new Error(platform + ":" + brand + " missing time period");
      }
    });
  });
  people.forEach(function(person){
    var personData = store[person];
    var platforms = Object.keys(personData);
    platforms.forEach(function(platform){
      var campaigns = Object.keys(personData[platform]);
      campaigns.forEach(function(campaign){
        var periods = Object.keys(personData[platform][campaign]);
        if(periods.length < 4){
          //throw new Error(person + ":" + platform + ":" + campaign + " missing time period");
          errors.push(campaign);
        }
      });
    });
  });
  if(errors.length > 0){
    Logger.log(errors);
    throw new Error("time periods missing. check logs");
  }
}

function fillStore(store){
  var platforms = ['platfrom1', 'platform2', 'platform3'];
  var people = ['person1', 'person2', 'person3'];
  platforms.forEach(function(platform){
    Logger.log(platform);
    var platformData = store[platform];
    var brands = Object.keys(platformData);
    brands.forEach(function(brand){
      var periods = Object.keys(platformData[brand]);
      if(periods.length < 4){
        //throw new Error(platform + ":" + brand + " missing time period");
        var allPeriods = ["period1", "period2", "period3", "period4"];
        allPeriods.forEach(function(period){
          if(periods.indexOf(period) == -1){
            platformData[brand][period] = {};
            platformData[brand][period]["spend"] = 0;
            platformData[brand][period]["revenue"] = 0;
            Logger.log("store filled for: " + platform + ":" + brand + ":" + period);
            Logger.log(platformData[brand]);
          }
        })
      }
    });
  });
  people.forEach(function(person){
    var personData = store[person];
    if(personData){
      var platforms = Object.keys(personData);
      platforms.forEach(function(platform){
        var campaigns = Object.keys(personData[platform]);
        campaigns.forEach(function(campaign){
          var periods = Object.keys(personData[platform][campaign]);
          if(periods.length < 4){
            // find which periods missing
            var allPeriods = ["period1", "period2", "period3", "period4"];
            allPeriods.forEach(function(period){
              if(periods.indexOf(period) == -1){
                personData[platform][campaign][period] = {};
                personData[platform][campaign][period]["spend"] = 0;
                personData[platform][campaign][period]["revenue"] = 0;
                Logger.log("store filled for: " + campaign + ":" + period);
                Logger.log(personData[platform][campaign]);
              }
            })

          }
        });
      });
    }
  });
}
