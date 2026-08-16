export default function ModalShell({ title, children }) {
  return (
    <div className="modal-overlay active">
      <div className="modal">
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
}
