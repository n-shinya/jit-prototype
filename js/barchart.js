var labelType, useGradients, nativeTextSupport, animate;

(function() {
  var ua = navigator.userAgent,
      iStuff = ua.match(/iPhone/i) || ua.match(/iPad/i),
      typeOfCanvas = typeof HTMLCanvasElement,
      nativeCanvasSupport = (typeOfCanvas == 'object' || typeOfCanvas == 'function'),
      textSupport = nativeCanvasSupport 
        && (typeof document.createElement('canvas').getContext('2d').fillText == 'function');
  //I'm setting this based on the fact that ExCanvas provides text support for IE
  //and that as of today iPhone/iPad current text support is lame
  labelType = (!nativeCanvasSupport || (textSupport && !iStuff))? 'Native' : 'HTML';
  nativeTextSupport = labelType == 'Native';
  useGradients = nativeCanvasSupport;
  animate = !(iStuff || !nativeCanvasSupport);
})();

function init(){
  var dataset = {
    groupA: {
      label: 'groupA',
      values: [20, 34, 48.5, 62.5, 25, 60, 35]
    },
    groupB: {
      label: 'groupB',
      values: [50, 40, 88, 82, 18.5, 160, 80]
    },
    groupC: {
      label: 'groupC',
      values: [20.5, 40, 86, 42, 18, 50, 100]
    },
    groupD: {
      label: 'groupD',
      values: [85, 80, 10, 40, 55, 10, 78]
    },
    groupE: {
      label: 'groupE',
      values: [15.5, 20, 33, 72, 24.5, 25, 30.25]
    }
  }
  var json = {
      'label': [],
      'values': [
      {
        'label': 'companyA',
        'values': []
      }, 
      {
        'label': 'companyB',
        'values': []
      }, 
      {
        'label': 'companyC',
        'values': []
      }, 
      {
        'label': 'companyD',
        'values': []
      }, 
      {
        'label': 'companyE',
        'values': []
      }, 
      {
        'label': 'companyF',
        'values': []
      }, 
      {
        'label': 'companyG',
        'values': []
      }]
      
  };

  //init BarChart
  var barChart = new $jit.BarChart({
    //id of the visualization container
    injectInto: 'infovis',
    //whether to add animations
    animate: true,
    //horizontal or vertical barcharts
    orientation: 'vertical',
    //bars separation
    barsOffset: 10,
    //visualization offset
    Margin: {
      top: 8,
      left: 8,
      right: 8,
      bottom: 8
    },
    //labels offset position
    labelOffset:8,
    //bars style
    type:'stacked',
    //whether to show the aggregation of the values
    showAggregates:true,
    //whether to show the labels for the bars
    showLabels:true,
    //label styles
    Label: {
      type: labelType, //Native or HTML
      size: 14,
      family: 'Arial',
      color: 'white'
    },
    //tooltip options
    Tips: {
      enable: true,
      onShow: function(tip, elem) {
        tip.innerHTML = "<b>" + elem.name + "/" + elem.label + "</b>: " + elem.value + "hour";
      }
    },
    
    Events: {
      enable: true,
      onClick: function(node, eventInfo, e) {
        alert('Go the detail page!');
      }
    }
  });
  
  $.each(dataset, function(prop){
    $('#group-list').append('<a href="#"><li>' + prop + '</li></a>');
  });

  $('#group-list li').each(function() {
      $(this).bind('click', function() {
        $(this).toggleClass('active');
        var $groups = $(this).parent().siblings();
        $groups.push($(this).parent());
        var groupnames = [];
        for(var i = 0; i < json.values.length; i++) {
          json.values[i].values = [];
        }
        json.label = [];
        $groups.each(function() {
          var $li = $(this).children();
          if($li.hasClass('active')){
            groupnames.push($li.text());
            var data = dataset[$li.text()].values;
            var label = dataset[$li.text()].label;
            json.label.push(label);
            for(var i = 0; i < data.length; i++) {
              json.values[i].values.push(data[i]);
            }
          }
        });
        if(groupnames.length > 0) {
          barChart.loadJSON(json);
          var legend = barChart.getLegend(), listItems = [];
          for(var name in legend) {
            listItems.push('<div class=\'query-color\' style=\'background-color:'
              + legend[name] +'\'>&nbsp;</div>' + name);
          }
          var list = $jit.id('id-list');
          list.innerHTML = '<li>' + listItems.join('</li><li>') + '</li>';
        }
    });
  });
}
