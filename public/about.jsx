// replace the below with a server call later
var extantLinks = ["abcd", "efgh", "ijkl", "mnop", "mypo", "mywd", "myth"];

// replace with a database call later
var userLinks = ["mypo", "mywd", "myth"];

// returns true if link exists within extantLinks, false otherwise
function linkExists(link) {
  for(var i = 0; i < extantLinks.length; i++) {
    if(link === extantLinks[i]) {
      return true;
    }
  }
  return false;
}

// generates a random string of characters of length numChars
function makeid(numChars) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < numChars; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

// a ScheduleItem is a simple list item that presents in text 'scheduleID', and contains a 
// button to trigger a callback function 'callback'
class ScheduleItem extends React.Component {
  render() {
    return <li className="ScheduleItem">
    <a>{this.props.scheduleID}</a>
    <span onClick={this.props.callback}>X</span>
    </li>
  }
}

// a ScheduleList is a list of schedules that a user has
class ScheduleList extends React.Component {
    constructor(props) {
      super(props);

      // the ScheduleList maintains an internal array of link arrays
      this.state = {links: this.getLinkArray()};
    }

    render() {
      return <div className="ScheduleList">
        <h2>
        Your Schedules:
        </h2>
        <ul>
          {this.state.links}
        </ul>
        <button id="addSchedule" onClick={() => this.addSchedule()}>Create New Schedule</button>
      </div>
    }

    // add a schedule to the array of schedules
    addSchedule() {
      console.log("Yeet");
      var scheduleString = makeid(4);

      while(linkExists(scheduleString)) {
        scheduleString = makeid(4);
      }

      // update entire server database
      extantLinks.push(scheduleString);

      // update personal user database
      userLinks.push(scheduleString);

      console.log("user:" + userLinks);
      console.log("extant: " + extantLinks);

      this.setState({links: this.getLinkArray()});
    }

    // remove a schedule from the array of schedules
    removeSchedule(scheduleString) {
      console.log("Looking for " + scheduleString);

      // remove from user's set of links
      for(var i = 0; i < userLinks.length; i++) {
        if(userLinks[i] === scheduleString) {
          userLinks.splice(i, 1);
        }
      }

      // remove from the entire link array (server call in future)
      for(var i = 0; i < extantLinks.length; i++) {
        if(extantLinks[i] === scheduleString) {
          extantLinks.splice(i, 1);
        }
      }

      console.log("user:" + userLinks);
      console.log("extant: " + extantLinks);

      this.setState({links: this.getLinkArray()});

    }
    // convert the information in the linkArray to representable HTML elements
    getLinkArray() {
      var linkArray = [];

      for(var i = 0; i < userLinks.length; i++) {
        let scheduleString = userLinks[i];
        linkArray.push(
          <ScheduleItem 
            key={scheduleString} 
            scheduleID={scheduleString} 
            callback={() => this.removeSchedule(scheduleString)}>
          </ScheduleItem>
        );
      }

      return linkArray;
    }
}

const list = <ScheduleList></ScheduleList>

ReactDOM.render(list, document.getElementById('root'));
