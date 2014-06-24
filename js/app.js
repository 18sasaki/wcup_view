
var allData

function getFromApi(callback) {
  wc_data = new Array();
  $.ajax({
    url:'http://linkdata.org/api/1/rdf1s1518i/worldcup_rdf.json',
    dataType: 'jsonp',
    type: "GET",
    success: function(res) {
      console.log(res);
      _(res).each(
        function(val, key){
          var country_data = {};
          _(val).each(
            function(valval, keykey){
              var column_name = decodeURI(keykey.split('#')[1]);
              country_data[column_name] = valval[0].value;
            }
          );
          wc_data.push(country_data);
        }
      );
      console.log(wc_data);
      allData = JSON.stringify(wc_data);
      if (callback != null) {
        callback(wc_data);
      }
    },
    error: {}
  });
}

function getAllData() {
  getFromApi(null);
  var div = document.createElement("div");
  div.id = 'data_view'
  div.textContent = '値を取得しました！';

  var old_view = document.getElementById('data_view');
  if(old_view) {
    document.body.removeChild(old_view);
  }
  document.body.appendChild(div);
}

function showByCountry() {
  getFromApi(appendByCountry);
}

function appendByCountry(wc_data) {
  var table = document.createElement("table");
  table.id = 'data_view'

  var tr    = document.createElement("tr");
  _(wc_data[0]).each(
    function(val,key){
      if (key != 'label') {
        var td = document.createElement("td");
        td.textContent = key;
        td.align = 'center';
        tr.appendChild(td);
      }
    }
  )
  table.appendChild(tr);

  _(wc_data).each(
    function(ele){
      var tr = document.createElement("tr");
      _(ele).each(
        function(val,key){
        if (key != 'label') {
            var td = document.createElement("td");
            td.textContent = val;
            td.align = 'right';
            tr.appendChild(td);
          }
        }
      )
      table.appendChild(tr);
    }
  )

  var old_view = document.getElementById('data_view');
  if(old_view) {
    document.body.removeChild(old_view);
  }
  document.body.appendChild(table);
}

function showByContinent() {
  getFromApi(appendByContinent);
}

function appendByContinent(wc_data) {
  grouped_data = _.groupBy(wc_data, function(data){ return data['大陸']; })
  continent_data = []
  console.log(grouped_data);

  _(grouped_data).each(
    function(val,continent_name){
      var continent_count = val.length;
      sum_data       = {}
      _(val).each(
        function(country_data){
          _(country_data).each(
            function(valval,keykey){
              var val_to_i = Number(valval)
              if (!isNaN(val_to_i) && keykey != 'label') {
                if (sum_data[keykey]) {
                  sum_data[keykey] += val_to_i
                } else {
                  sum_data[keykey] = val_to_i
                }
              }
            }
          )
        }
      )
      var average_data = {}
      average_data['大陸'] = continent_name
      _(sum_data).each(
        function(sum,key){
          average_data[key] = (sum / continent_count).toFixed(2)
        }
      )
      continent_data.push(average_data)
    }
  )

  var table = document.createElement("table");
  table.id = 'data_view'

  var tr    = document.createElement("tr");
  _(continent_data[0]).each(
    function(val,key){
      var td = document.createElement("td");
      td.textContent = key;
      td.align = 'center';
      tr.appendChild(td);
    }
  )
  table.appendChild(tr);

  _(continent_data).each(
    function(ele){
      var tr = document.createElement("tr");
      _(ele).each(
        function(val,key){
          var td = document.createElement("td");
          td.textContent = val;
          td.align = 'right';
          tr.appendChild(td);
        }
      )
      table.appendChild(tr);
    }
  )

  var old_view = document.getElementById('data_view');
  if(old_view) {
    document.body.removeChild(old_view);
  }
  document.body.appendChild(table);
}



