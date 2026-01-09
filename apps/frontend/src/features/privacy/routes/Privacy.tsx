export default function Privacy() {
  return (
    <main className="p-8">
      <h1>Privacy Policy</h1>
      <ul>
        <li>This application is a school project and does not collect personal data for commercial purposes.</li>
        <li>
          This application collects Riot account identifiers (PUUID) solely to provide account linking and automation
          features.
        </li>
        <li>No passwords are collected.</li>
        <li>Data is not sold or shared.</li>
        <li>
          Users may request data deletion by contacting:{' '}
          <a href="mailto:gabriel.leveque@epitech.eu">gabriel.leveque@epitech.eu</a>
        </li>
      </ul>
    </main>
  );
}
