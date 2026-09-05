export default function PageHead({ title, crumb, children }) {
  return (
    <>
      <div className="page-head">
        <div className="container">
          <h1>{title}</h1>
          <div className="crumb">{crumb}</div>
        </div>
      </div>
      {children}
    </>
  );
}
