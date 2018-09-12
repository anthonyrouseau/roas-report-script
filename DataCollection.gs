function updateStore(campaign, store) {
  var name = campaign[0];
  var brand = campaign[BRAND_INDEX];
  var platform = campaign[PLATFORM_INDEX];
  var owner = campaign[OWNER_INDEX];
  var spend = campaign[SPEND_INDEX];
  var revenue = campaign[REVENUE_INDEX];
  var roas = campaign[ROAS_INDEX];
  var period = campaign[PERIOD_INDEX];
  if(store[owner] && store[owner][platform] && store[owner][platform][name] && store[owner][platform][name][period]){
    //should not happen
    Logger.log('campaign data occurs twice');
    Logger.log(name);
  }
  if(store[platform] && store[platform][brand] && store[platform][brand][period]){
    store[platform][brand][period]["spend"] += spend;
    store[platform][brand][period]["revenue"] += revenue;
  }
  if(store[brand] && store[brand][period]){
    store[brand][period]["spend"] += spend;
    store[brand][period]["revenue"] += revenue;
  }
  if(store[owner] && store[owner][platform] && store[owner][platform][name] && !store[owner][platform][name][period]){
    store[owner][platform][name][period] = {};
    store[owner][platform][name][period]["spend"] = spend;
    store[owner][platform][name][period]["revenue"] = revenue;
  }
  if(store[platform] && store[platform][brand] && !store[platform][brand][period]){
    store[platform][brand][period] = {};
    store[platform][brand][period]["spend"] = spend;
    store[platform][brand][period]["revenue"] = revenue;
  }
  if(store[brand] && !store[brand][period]){
    store[brand][period] = {};
    store[brand][period]["spend"] = spend;
    store[brand][period]["revenue"] = revenue;
  }
  if(store[owner] && store[owner][platform] && !store[owner][platform][name]){
    store[owner][platform][name] = {};
    store[owner][platform][name][period] = {};
    store[owner][platform][name][period]["spend"] = spend;
    store[owner][platform][name][period]["revenue"] = revenue;
  }
  if(store[owner] && !store[owner][platform]){
    store[owner][platform] = {};
    store[owner][platform][name] = {};
    store[owner][platform][name][period] = {};
    store[owner][platform][name][period]["spend"] = spend;
    store[owner][platform][name][period]["revenue"] = revenue;
  }
  if(store[platform] && !store[platform][brand]){
    store[platform][brand] = {};
    store[platform][brand][period] = {};
    store[platform][brand][period]["spend"] = spend;
    store[platform][brand][period]["revenue"] = revenue;
  }
  if(!store[brand]){
    store[brand] = {};
    store[brand][period] = {};
    store[brand][period]["spend"] = spend;
    store[brand][period]["revenue"] = revenue;
  }
  if(!store[platform]){
    store[platform] = {};
    store[platform][brand] = {};
    store[platform][brand][period] = {};
    store[platform][brand][period]["spend"] = spend;
    store[platform][brand][period]["revenue"] = revenue;
  }
  if(!store[owner]){
    store[owner] = {};
    store[owner][platform] = {};
    store[owner][platform][name] = {};
    store[owner][platform][name][period] = {};
    store[owner][platform][name][period]["spend"] = spend;
    store[owner][platform][name][period]["revenue"] = revenue;
  }

}
