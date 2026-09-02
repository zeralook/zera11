export default function PageHead({ title, crumb }) {
  return (
    <div className="page-head">
      <div className="container">
        <h1>{title}</h1>
        <div className="crumb">{crumb}</div>
      </div>
    </div>
  );
}
