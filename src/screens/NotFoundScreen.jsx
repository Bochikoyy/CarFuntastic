import { Button } from '../components/Button.jsx';

export function NotFoundScreen({ onHome }) {
  return (
    <main className="screen screen--title">
      <div className="title-card">
        <h1>Off the Road!</h1>
        <p className="title-card__tagline">That screen or level could not be found.</p>
        <Button variant="primary" size="lg" onClick={onHome}>
          Back to Title
        </Button>
      </div>
    </main>
  );
}

