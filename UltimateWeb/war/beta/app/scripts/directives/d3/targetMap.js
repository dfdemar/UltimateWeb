'use strict';

angular.module('iUtltimateApp')
  .directive('targetMap', function (d3) {
    return {
      restrict: 'E',
      scope: {
        bubbles: '=',
        players: '=',
        height: '='
      },
      link: function postLink(scope, element, attrs) {
        scope.$watch('bubbles', function(){
          if (scope.bubbles){
            d3.select(attrs.id).select('svg').remove();
            var diameter = element[0].parentElement.clientWidth - 30,
                format = d3.format(",d"),
                color = d3.scale.category20c();

            var tooltip = d3.select(attrs.id)
              .append("div")
              .attr("class", "target-mouseover-tooltip")
              .text("a simple tooltip");

            var bubble = d3.layout.pack()
                .sort(null)
                .size([diameter, scope.height + 100])
                .padding(1.5);

            var svg = d3.select(attrs.id).append("svg")
                .attr("width", diameter)
                .attr("height", scope.height + 100)
                .attr("class", "bubble");

            var node = svg.selectAll(".node")
                .data(bubble.nodes(scope.bubbles)
                .filter(function(d) { return !d.children; }))
              .enter().append("g")
                .attr("class", "target-node")
                .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
                .on("mouseover", function(d){return tooltip.style("visibility", "visible").text(getText(d));})
                .on("mousemove", function(){return tooltip.style("top",
                    (d3.event.y - 10)+"px").style("left",(d3.event.x + 10)+"px");})
                .on("mouseout", function(){return tooltip.style("visibility", "hidden");});


            node.append("circle")
                .attr("r", function(d) { return d.r; })
                .style("fill", function(d) { return getColor(d.actionType, isHandler(d.receiver)); });

            node.append("text")
                .attr("dy", ".5em")
                .style("text-anchor", "middle")
                .text(function(d) { return d.receiver.substring(0, d.r / 3); });

            d3.select(self.frameElement).style("height", diameter + "px");
          }
        });
        function isHandler(name){
          return _.reduce(scope.players, function(memo, player){
            if (player.name === name && player.position === 'Handler'){
              return true;
            } else {
              return memo;
            }
          }, false)
        }
        function getColor(action, isHandler){
          switch (action){
            case 'Drop':
              if (isHandler) return '#c75aba';
              return '#c5007c';
              break;
            case 'Catch':
              if (isHandler) return '#C3CE00';
              return '#949A27';
              break;
            case 'Throwaway':
              return '#ff9400';
              break;
            case 'Goal':
              if (isHandler) return '#0faa00';
              return '#298020';
              break;
            default:
              throw new Error();
              break;
          }
        }
        function getText(data){
          switch (data.actionType){
            case 'Throwaway':
              if (data.value - 1){
                return data.value + ' throwaways';
              } else {
                return data.value + ' throwaway';
              }
              break;
            case 'Catch':
              if (data.value - 1){
                return data.value + ' passes to ' + data.receiver;
              } else {
                return data.value + ' pass to ' + data.receiver;
              }
              break;
            case 'Goal':
              if (data.value - 1){
                return data.value + ' Goals to ' + data.receiver;
              } else {
                return data.value + ' Goal to ' + data.receiver;
              }
              break;
            case 'Drop':
              if (data.value - 1){
                return data.value + ' dropped passes to ' + data.receiver;
              } else {
                return data.value + ' dropped pass to ' + data.receiver;
              }
              break;
              return 'WTF?';
          }
        }
      }
    };
  });
