const slug = (r) => r.toLowerCase().replace(" ", "-");
const Links = ({ item }) => (
  <p className="links">
    {item.githubUrl && <a href={item.githubUrl} target="_blank" rel="noreferrer">GitHub</a>}
    {item.liveUrl && <a href={item.liveUrl} target="_blank" rel="noreferrer">Live demo</a>}
    {item.videoUrl && <a href={item.videoUrl} target="_blank" rel="noreferrer">Watch video</a>}
  </p>
);
const Who = ({ item }) => (
  <footer>
    {item.photoUrl && <img className="ph" src={item.photoUrl} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.display = "none"; }} />}
    <strong>{item.learnerName}</strong>
    <span>{item.course}{item.batch ? `, batch ${item.batch}` : ""}</span>
  </footer>
);

export function Card({ type, item }) {
  return (
    <article className="card" data-region={slug(item.region)}>
      <span className="tag">{item.region}</span>
      {type === "projects" && (<>
        <h3>{item.title}</h3>
        {item.problemStatement && <p><b>Problem:</b> {item.problemStatement}</p>}
        <p>{item.description}</p>
        {item.keyFeatures?.length > 0 && <ul>{item.keyFeatures.map((f) => <li key={f}>{f}</li>)}</ul>}
        <p className="stack">{item.technologies?.join(", ")}</p>
        <Links item={item} />
      </>)}
      {type === "testimonials" && (<>
        <blockquote>{item.quote}</blockquote>
        {item.mentorSupport && <p><b>Mentor support:</b> {item.mentorSupport}</p>}
        {item.feedback && <p>{item.feedback}</p>}
        {item.journey && <p>{item.journey}</p>}
        <Links item={item} />
      </>)}
      {type === "placements" && (<>
        <h3>{item.designation} at {item.company}</h3>
        {item.skills?.length > 0 && <p className="stack">{item.skills.join(", ")}</p>}
        {item.previousBackground && <p><b>Before:</b> {item.previousBackground}</p>}
        {item.journey && <p>{item.journey}</p>}
        <Links item={item} />
      </>)}
      {type === "achievements" && (<>
        <h3>{item.title}</h3>
        <p className="stack">{item.type}</p>
        <p>{item.description}</p>
      </>)}
      <Who item={item} />
    </article>
  );
}
