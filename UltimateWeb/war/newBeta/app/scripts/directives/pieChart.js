/* global d3, _ */

'use strict';

angular.module('newBetaApp')
  .directive('pieChart', function ($parse) {
    return {
      template: '<svg></svg>',
      restrict: 'AE',
      scope: {
        dataset: '='
      },
      compile: function () {
        return {
            pre: function(scope, element, attrs){
              scope.svg = d3.select(element.children()[0]);
            },
            post: function(scope, element, attrs){
              var dataset;
              scope.$watch('dataset', function(newVal){
                if (newVal){
                  dataset = newVal;
                  change();
                }
              });

              var width = $parse(attrs.width)(scope),
                height = $parse(attrs.height)(scope),
                radius = Math.min(width, height) / 2;
              var enterClockwise = {
                startAngle: 0,
                endAngle: 0
              };

              var enterAntiClockwise = {
                startAngle: Math.PI * 2,
                endAngle: Math.PI * 2
              };

              var color = d3.scale.category20();

              var pie = d3.layout.pie()
                .sort(null);

              var arc = d3.svg.arc()
                .innerRadius(0)
                .outerRadius(radius - 20);

              scope.svg
                .attr('width', width)
                .attr('height', height)
                .append('g')
                .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

              // set the start and end angles to 0 so we can transition
              // clockwise to the actual values later
              var datum = dataset ? _(dataset).values() : [];
              var path = scope.svg.selectAll('path')
                .data(pie(datum))
                .enter().append('path')
                  .attr('fill', function(d, i) { return color(i); })
                  .attr('d', arc(enterClockwise))
                  .each(function(d) {
                    this._current = {
                      data: d.data,
                      value: d.value,
                      startAngle: enterClockwise.startAngle,
                      endAngle: enterClockwise.endAngle
                    };
                  }); // store the initial values

              path.transition()  // update
                  .duration(750)
                  .attrTween('d', arcTween);

              d3.selectAll('input').on('change', change);

              function change() {
                var datum = dataset ? _(dataset).values() : [];
                path = path.data(pie(datum)); // update the data
                // set the start and end angles to Math.PI * 2 so we can transition
                // anticlockwise to the actual values later
                path.enter().append('path')
                    .attr('fill', function (d, i) {
                      return color(i);
                    })
                    .attr('d', arc(enterAntiClockwise))
                    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
                    .each(function (d) {
                      this._current = {
                        data: d.data,
                        value: d.value,
                        startAngle: enterAntiClockwise.startAngle,
                        endAngle: enterAntiClockwise.endAngle
                      };
                    })

                path.exit()
                    .transition()
                    .duration(750)
                    .attrTween('d', arcTweenOut)
                    .remove(); // now remove the exiting arcs

                path.transition().duration(750).attrTween('d', arcTween); // redraw the arcs
              }

              // Store the displayed angles in _current.
              // Then, interpolate from _current to the new angles.
              // During the transition, _current is updated in-place by d3.interpolate.
              function arcTween(a) {
                var i = d3.interpolate(this._current, a);
                this._current = i(0);
                return function(t) {
                return arc(i(t));
                };
              }
              function arcTweenOut(a) {
                var i = d3.interpolate(this._current, {startAngle: Math.PI * 2, endAngle: Math.PI * 2, value: 0});
                this._current = i(0);
                return function (t) {
                  return arc(i(t));
                };
              }
            }
        };
      }
    };
  });
