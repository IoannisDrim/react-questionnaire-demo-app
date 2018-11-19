import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';

class MsgModal extends Component {
  /*This is a general purpose  dynamic content modal for displaing messages and data*/
  render() {
    return (
      <Modal
        show={this.props.show}
        size={this.props.size}
        aria-labelledby='contained-modal-title-vcenter'
        centered
      >
        <Modal.Header>
          <Modal.Title id='contained-modal-title-vcenter'>
            {this.props.header}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.props.bodyTemplate}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default MsgModal;