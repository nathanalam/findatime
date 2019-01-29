var dates = [];

// check if a given date String 'input' is valid
function isValidDate(input) {
  var arr = input.split('-');
  for(var i = 0; i < 3; i++) {
    if(isNaN(arr[i])) {
      return false;
    }
  }

  return true;
}

// convert a String date into a comma separated string Day, Month Date
function dateToString(date) {
    var days = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday'
    ];
    var d = new Date(date);
    var dayName = days[d.getDay()];
    var items = date.split('-');
    console.log(items);
    var months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];
    var month = months[items[1] - 1];
    var num = items[2];

    return <div className="dateHead">
            <h3>{dayName}</h3>
            <h4>{month + " " + num}</h4>
           </div>

}
// a single time div, which updates the dates array when clicked on to
// indicate someone wants to meet at a certain time.
class Time extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: this.props.count, toggle: false, class: "time off"}
  }
  render() {
    return <div onClick={() => this.toggle()} className={this.state.class}>
      <p>
      {this.props.string + " - " + this.state.count}</p>
    </div>
  }
  toggle() {
    var newCount = this.state.count;
    console.log(this.props.index + " getting toggled");
    // search through dates to find the corresponding object
    for(var i = 0; i < dates.length; i++) {
      var str = this.props.date;
      if(str === dates[i].date) {
        console.log(this.state.toggle)
        if(!this.state.toggle) {
          dates[i].times[this.props.index].count += 1;
          console.log("incremented");
        } else {
          dates[i].times[this.props.index].count -= 1;
          console.log("decremented");
        }
        newCount = dates[i].times[this.props.index].count;
        break;
      }
    }
    console.log(dates);
    if(this.state.toggle) {
      this.setState({count: newCount, toggle: !this.state.toggle, class: "time off"});
    } else {
      this.setState({count: newCount, toggle: !this.state.toggle, class: "time on"});
    }
  }
}

// requires a day, a date, and a function to call to kill
// the kill function should take the index of the Day, which
// is a combination of its day and date
class Day extends React.Component {
  constructor(props) {
    super(props);
    this.state = {times: this.getTimeArray()}
  }
  render() {
    return <div className="dateContainer">
      {dateToString(this.props.date)}
      <button onClick={() => this.props.removeFunct(this.props.index)}>
      Remove</button>
      <div className="list-group list-group-flush">
        {this.state.times}
      </div>
    </div>;
  }
  getTimeArray() {
    var timeArray = [];
    var hour = 0;
    var minute = 0;
    var count = 0;

    for(var i = 0; i < this.props.times.length; i++) {
      let index = i;
      hour = Math.floor(this.props.times[i].time);
      minute = Math.floor((this.props.times[i].time - hour) * 60);
      if(minute < 10) {
        minute = "0" + minute;
      }
      count = this.props.times[i].count;

      timeArray.push(
        <Time key = {this.props.times[i].time.toString()}
              string = {hour + ":" + minute}
              count = {count}
              index = {index}
              date = {this.props.date}
        ></Time>
      );
    }

    return timeArray;
  }
}

class Week extends React.Component {
  constructor(props) {
    super(props);

    this.state = {value: []};
  }
  render() {
    return <div id="schedule">
      <div id="interactions">
        <div className="mainInteractions">
          <div className="prepend">
            <button onClick={this.addDay}>Add date</button>
          </div>
          <input type="date" id="date"></input>  
          <div className="append">
            <button>Submit</button>
            <button onClick={() => {
              if(this.state.moreOptions) {
                this.setState({value: this.state.value, moreOptions: false});
                document.getElementById('more-options').className = "hidden";
                return;
              }
              this.setState({value: this.state.value, moreOptions: true});
              document.getElementById('more-options').className = "";
              return;
            }}>More options</button>
          </div>
          
        </div>
        <div className="hidden" id="more-options">
            Begin at:
            <input type="number" id="min"></input>
            End at:
            <input type="number" id="max"></input>
            Interval (hours):
            <input type="number" id="interval"></input>
          </div>
        
      </div>
      <div id="week">
        {this.state.value}
      </div>
    </div>
  }
  addDay = () => {
    var innerObject = [];
    var input = document.getElementById('date').value;
    var granularity = 1;
    var minRange = 0;
    var maxRange = 24;

    if(!isValidDate(input)) {
      return;
    }

    if(this.state.moreOptions) {
      var gran = parseFloat(document.getElementById('interval').value);
      var min = parseFloat(document.getElementById('min').value);
      var max = parseFloat(document.getElementById('max').value);
      if(gran > 0 && gran < 24) {
        granularity = gran;
        console.log(granularity);
      }
      if(min >= 0 && min < 24) {
        minRange = min;
      }
      if(max > 0 && max <= 24) {
        maxRange = max;
      }
    }

    for(var dayNum = 0; dayNum < dates.length; dayNum++) {
      var str = dates[dayNum].date.toString();
      if(str === input) {
        return;
      }
    }

    for(var i = 0.0; i < 24; i += granularity) {
      innerObject.push({time: i, count: 0});
    }
    dates.push({
      "date" : input,
      "times" : innerObject,
      "min" : minRange,
      "max" : maxRange
    });

    dates.sort(function(a, b) {
      var str1 = a.date;
      var str2 = b.date;

      if(str1 < str2) {
        return -1;
      } else if(str1 > str2) {
        return 1;
      }
      return 0;
    });

    this.setState({value: dates.map((e) => this.generateDay(e)),
    moreOptions: this.state.moreOptions});

    console.log(dates);
  }
  removeDay = (key) => {
    var timeArray = [];
    for(var dayNum = 0; dayNum < dates.length; dayNum++) {
      var str = dates[dayNum].date.toString();
      if(str === key) {
        dates.splice(dayNum, 1);
        this.setState({value: dates.map((e) => this.generateDay(e)),
        moreOptions: this.state.moreOptions});
        console.log(dates);
        return;
      }
    }
    console.log("ERROR: date not found");
    return;
  }
  generateDay = (e) => {
    var timeArray = [];
    for(var obj = 0; obj < e.times.length; obj++) {
      var timeObject = e.times[obj];
      if(timeObject.time >= e.min && timeObject.time <= e.max) {
        timeArray.push({time: timeObject.time, count: timeObject.count});
      }
    }
    return <Day date={e.date}
    removeFunct={this.removeDay}
    key={e.date.toString()}
    index={e.date.toString()}
    times={timeArray}></Day>
  }
}

const theWeek = <Week></Week>

ReactDOM.render(theWeek, document.getElementById('root'));
console.log("done rendering");
