import Icon3D from "./Icon3D.jsx";
export default function Toast({ text }) {
  if (!text) return null;
  return <div className="toast show"><Icon3D name="check" size={36} /> <span>{text}</span></div>;
}
