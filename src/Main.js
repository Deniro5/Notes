import React, { Component } from 'react';
import './App.css';
import Note from "./Note"
import Modal from '@material-ui/core/Modal';

class Main extends Component {
  state = {
    items: [],
    display: [],
    open:false,
    newOpen: false,
    curr: 0,
    resultsShown: 10,
  }

  componentDidMount = () => {
    let items = [];
    if (localStorage.getItem("Notes") === null || localStorage.getItem("Notes") === [] || localStorage.getItem("Notes") === "") {
      localStorage.setItem("Notes", [])
    }
    else {
      console.log(localStorage.getItem("Notes"))
      items = JSON.parse(localStorage.getItem("Notes")); 
    }
    this.setState({
      display:items,
      items:items
    })
  }

  handleOpen = (index) => {
    this.setState({ 
      open: true, 
      curr: index 
    });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleNewOpen = () => {
    this.setState({ newOpen: true});
  };

  handleNewClose = () => {
    //save the changes here
    var date = new Date();
    var timestamp = date.getTime()
    var newnote = {"title": this.refs.newnotetitle.value , "desc": this.refs.newnotedesc.value.substring(0,this.refs.newnotedesc.value.length) , "timestamp": timestamp}
    let newItems = this.state.items;
    newItems.push(newnote)
    localStorage.setItem("Notes", JSON.stringify(newItems));
    this.refs.searchinput.value = ""
    this.setState({ newOpen: false, display : newItems, items: newItems });
  };

  handleExpandedClose = (timestamp, e) => {
    //save the changes here
    var index = this.state.items.map(function(e) { return e.timestamp; }).indexOf(timestamp);
    let newItems = this.state.items;
    newItems[index].title = this.refs.expandednotetitle.value;
    newItems[index].desc = this.refs.expandednotedesc.value;
    localStorage.setItem("Notes", JSON.stringify(newItems));
    this.refs.searchinput.value = ""
    this.setState({ open: false, display : newItems , items: newItems });
  };

  update = () => {
    if (this.refs.searchinput.value === "") {
      this.setState({
        display: this.state.items,
        curr:0,
      })
    }
    else {
      var count = 0;
      var newdisplay = [];
      var inputlength = this.refs.searchinput.value.length
      var input = this.refs.searchinput.value.toLowerCase()
      while (count < this.state.items.length) {
        var curritem = this.state.items[count]
        var start = 0;
        var end = inputlength;
        while (end < curritem.desc.length+1) {
          if (curritem.desc.substring(start,end).toLowerCase()  === input) {
            newdisplay.push(curritem);
            break;
          }
          else {
            start++;
            end++;
          }
        }
        count++;
      }
      this.setState({
        display: newdisplay,
        resultsShown: 10,
        curr:0,
      })
    }
  }

  remove = (timestamp , e) => {
    e.stopPropagation()
    var index = this.state.items.map(function(e) { return e.timestamp; }).indexOf(timestamp);
    let newItems = this.state.items
    newItems.splice(index,1)
    localStorage.setItem("Notes", JSON.stringify(newItems));
    this.setState({
      items: newItems
    }, () => {this.update()} )

  }

  loadMore = () => {
    this.setState({
      resultsShown: this.state.resultsShown + 10
    })
  }
  
  render() {

    var notes;
    var expandedNote;
    if (this.state.display.length === 0) {
      notes = (<p style = {{ fontSize :"28px" , color : "white" , marginTop : "40px" }}> No notes to show </p>)
      expandedNote = (<div> </div>);
    }
    else {
      expandedNote = (
        <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={this.state.open}
        onClose={this.handleExpandedClose.bind(this, this.state.display[this.state.curr].timestamp)}
      >
      <div className = "expandedNote"> 
        <input className = "expandedNoteTitle" ref = "expandednotetitle" defaultValue = {this.state.display[this.state.curr].title} /> 
        <div style = {{height: "1px" , width: "90%" , background:"black", margin: "auto", marginTop: "15px"}}/>
        <textarea className = "expandedNoteDescContainer" ref = "expandednotedesc"  defaultValue = {this.state.display[this.state.curr].desc} /> 
        <img alt = "close" className = "NoteClose" src = "imgs/cancel.png" onClick = {this.handleExpandedClose.bind(this,this.state.display[this.state.curr].timestamp)}/>
    </div>
    </Modal>)

      var count = 0;
      notes = []
      while (count < this.state.resultsShown && count < this.state.display.length) {
        var item = this.state.display[count]
        notes.push(<Note title = {item.title} desc = {item.desc.substring(0,250)} remove = {this.remove.bind(this,item.timestamp)} open = {this.handleOpen.bind(this,count)}/>)
        count++;
      }
    }
    return (
      <div className="Search">
        <input ref = "searchinput" type="text" className = "SearchBar" onChange = {this.update} placeholder="Search..."/>
        <button className = "addBtn" onClick = {this.handleNewOpen}>Add New</button>
        <div className = "noteContainer">
          {notes}
        </div>
        {expandedNote}
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.newOpen}
          onClose={this.handleNewClose}
        >
          <div className = "newNote">
            <input ref = "newnotetitle" className = "newNoteTitle" placeholder = "Title"/ >
              <div style = {{height: "1px" , width: "90%" , background:"black", margin: "auto", marginTop: "10px"}}/>
            <textarea ref = "newnotedesc" className = "newNoteDesc" placeholder = "Start writing here..."/ >
            <img alt = "close" className = "NoteClose" src = "/imgs/cancel.png" onClick = {this.handleNewClose}/>
          </div>
        </Modal>
        {this.state.resultsShown < this.state.display.length && <button className = "loadBtn"  onClick = {this.loadMore} > Load More </button>}
      </div>
    );
  }
}

export default Main;
