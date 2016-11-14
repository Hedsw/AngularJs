myApp.controller('d3Ctrl2',
  function($scope) {
var bardata = [];
for(var i=0; i < 100; i++) {
  bardata.push(Math.random()*33)
}

var height = 400,
    width = 600
var tempColor;

var colors = d3.scale.linear()
      .domain([0, bardata.length])
      .range(['#eac693','#8fa4e8']) //f4b535~ #f4e135의 색깔을 보여주는 것임!
//이것은 Scale
var yScale = d3.scale.linear()
        .domain([0, d3.max(bardata)]) // 그러니까.. 이것은 domain 0~ d3.max(bardata)라고 되어있는 것까지가 최대 길이이고,
        .range([0, height])     // 그 범위를 height에 비례해서 맞추겠다 이런 뜻임 그러니까 데이터 중에 가장 큰 녀석이.. 그래프 범위중 꼭대기까지 올라가게 만드는것

var xScale = d3.scale.ordinal()
        .domain(d3.range(0,bardata.length))
        .rangeBands([0, width]) // 이거 해주는 이유는.. data값이 많아 지면 알아서 그 값을 svg에 맞춰서 해주기 위해서 쓴다 .

var tooltip = d3.select('body').append('div')
      .style('position','absolute')
      .style('padding', '0 10px')
      .style('background', 'white')
      .style('opacity', 0 )

var myChart = d3.select('#graph')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('background', '#C9D7D6')
    .append('g')
    .attr('width', width)
    .attr('height', height)
    .selectAll('rect').data(bardata)
    .enter().append('rect') //이게 실질적인 바 그래프들임!
      .style('fill', function(d,i) {
          return colors(i);
      })
      .attr('width', xScale.rangeBand()) // rangeBand()를 쓰는것은, xScale 에서 rangeBands를 썼기 때문에 그것에 맞춰서 하기 위해서
                                        // rangeBand를 쓴다
      .attr('x', function(d,i) {  //여기서 나오는 d는 bardata에 나오는 저 array들의 값(20,30,45,15...)이고, i 는 인덱스 값이다(0,1,2,3,4.)
        return xScale(i);
      })
      .attr('height', 0)  //그것들을 아래로 끌어 내려서 진짜 그래프처럼 보이게 하는 것이.. 아래에 나온 x, y 부분이다
      .attr('y', height)
      //////////////////////////////////////////////////////////////////////////
      //여기부터는 이제 만들어진 Data에 클릭하고 뭐 그런 반응 넣는 것
      // EVENT PART
      .on('mouseover', function(d) {

          tooltip.transition()
            .style('opacity', .9)

          tooltip.html(d)
            .style('left', (d3.event.pageX)-35 + 'px')
            .style('top',  (d3.event.pageY)-20 + 'px')


          tempColor = this.style.fill;  //여기서 tempColor에다가 원래 칼라를 저장해놓는 것은..밑에 mouseout event에서
            d3.select(this)             // 마우스를 뺏을때, 다시 색깔을 원상태로 돌리기 위해서 이것을 쓴다.
              .style('opacity', 0.5)  //이거는 마우스가 올라갔을때 살짝 투명하게 만들어주는거
              .style('fill', 'yellow')
      })
      .on('mouseout', function(d) {
        tooltip.transition()
          .style('opacity', .0)
          .delay(100)
            d3.select(this)
              .style('opacity', 1)  //이거는 마우스가 내려갔을때 원상태로 돌리기
              .style('fill', tempColor) //마우스가 내려가면 원상태로 색깔을 돌리는 것
      })

      myChart.transition()
        .attr('height', function(d) {
          return yScale(d);  //여기에 있는 값이 들어가면.. 밑에 것들을 지우고 만들어 보면 가장 위쪽에 모여서 만들어 지게 되는데,
        })  //그것들을 아래로 끌어 내려서 진짜 그래프처럼 보이게 하는 것이.. 아래에 나온 x, y 부분이다
        .attr('y', function(d) {  //이것을 하면, 값이 아래로 내려가게 됨!
          return height - yScale(d);//height = 400 이고 yScale은 domain과 range에 의해서..첫번째 것의 경우 400/65*20이 되서..123이 됨.. 그게 위로 올라가게 되는거
        })
        .delay(function(d, i) { //delay를 여기다가 넣으면, myChart는 객체인데, 위에서 data를 이미 받아 온 객체이다
          return i * 10;//그 객체에다가 transition().delay로 만든건데, i는 인덱스니까.. 각각 인덱스들을 시간에 맞게 올라오도록 만든 것
        })
        .ease('elastic')
        .duration(1000);




        // X축 Y축 만드는거 추가 하기


    var hAxis = d3.svg.axis()
        .scale(xScale) //xScale은 위에서 우리가 얼마나 줄껀지 결정 해놨음..
        .orient('bottom')// 축 위치
        .tickValues(xScale.domain().filter(function(d, i) { //filter는 전부를 받는게 아닐 몇몇만 받도록 만든것..?
            return !(i % (bardata.length/5));
        }))

    var hGuide = d3.select('svg').append('g')
        hAxis(hGuide)

        hGuide.attr('transform', 'translate(20 ,' + (height-20) + ')')
        hGuide.selectAll('path')
          .style({ fill : 'none', stroke: "#000"})
        hGuide.selectAll('line')
          .style({ fill : 'none', stroke: "#000"})


        //y 축

        // y 축
        var vGuideScale = d3.scale.linear()
          .domain([0, d3.max(bardata)])
          .range([height, 0])  //X Axis만들려고 준비 하는것

      var vAxis = d3.svg.axis()
        .scale(vGuideScale) //이거 해주는 이유는.. yScale이 거꾸로 되어 있으니까
        .orient('left')//이것은 축이 어디에 위치 시킬것인지..
        .ticks(10) //이거 그.. y축에 몇개로 나눌껀지 만드는거!! 10개면 10개의 단위로 나뉘어짐

      var vGuide = d3.select('svg').append('g') //여기다가 append('g')말고 다른건 안되는 이유갸
          vAxis(vGuide)                   //svg 태그안에다가 특정값을 넣을때 쓰는 것이 g이다.. 그니까 특별한 것이라서 그런것! 다른테그 이름은 안됨!

          vGuide.attr('transform', 'translate(30, 5)')
          vGuide.selectAll('path')
            .style({ fill : 'none', stroke: "#000"})
          vGuide.selectAll('line')
            .style({ fill : 'none', stroke: "#000"})
});
