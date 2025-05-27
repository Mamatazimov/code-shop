function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal" onClick={onClose} style={{ display: "flex", position: "fixed", top: 0, left: 0, width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.3)" }}>
        <div className="modal-content" onClick={(e)=>{e.stopPropagation()}} style={{ border:"3px solid black",boxShadow:"0 0 1rem rgba(0,0,0,0.5)",backgroundColor:"rgba(0,0,0,0.3)", padding: "2rem", borderRadius: "1rem"}}>
            <button className="closeBtn" onClick={onClose} style={{position:"relative",top:"0",right:"0",width:"100%",marginBottom:"1rem"}}>
            &times;
            </button>
            {children}
        </div>
    </div>
  );
}
export default Modal;