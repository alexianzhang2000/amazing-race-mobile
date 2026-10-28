import observatoryHill from './assets/observatory-hill.jpg';

const QR_TEXT = {
  '/qr/1': 'What is the name of the store this cute dog escaped from?',
  '/qr/2': "Here's a throwback to my last photo of you at Observatory HIll. What famous landmark can you see at the top of this hill?",
};

export default function QRPage({ path }) {
  const text = QR_TEXT[path];

  return (
    <>
      <div className="bg" aria-hidden="true"><i /><i /><i /></div>
      <main className="qr-page">
        <section className="qr-card">
          <p>{text}</p>
          {path === '/qr/2' && (
            <img className="qr-image" src={observatoryHill} alt="A view from Observatory Hill" />
          )}
        </section>
      </main>
    </>
  );
}
