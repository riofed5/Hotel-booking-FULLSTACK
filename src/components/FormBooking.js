import React from 'react';

const formBooking = props => (
  <div className="modal">
    <header className="modal-header">
      <h4>{props.title}</h4>
    </header>
    <section className="modal-content">{props.children}</section>
    <section className="modal-actions">
      {props.canConfirm && (
        <button className="btn-confirm" onClick={props.onConfirm}>
          {props.confirmText}
        </button>
      )}
      {props.canCancel && (
        <button className="btn-cancel" onClick={props.onCancel}>
          Cancel
        </button>
      )}
    </section>
  </div>
);

export default formBooking;