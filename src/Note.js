import React, { Component } from 'react';
import './App.css';

class Note extends Component {
  render() {
    return (
      <div className="Note" onClick = {this.props.open}>
        <img alt = "close" className = "NoteClose" src = "../imgs/cancel.png" onClick = {this.props.remove}/>
        <p className = "NoteTitle"> {this.props.title}</p>
        <p className = "NoteDescription"> {this.props.desc} </p>
      </div>
    );
  }
}

export default Note;
