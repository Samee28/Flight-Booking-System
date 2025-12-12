export const metadata = { title: "Flight Booking" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui', margin: 0 }}>
        <header style={{ padding: 12, borderBottom: '1px solid #eee' }}>
          <h1 style={{ margin: 0 }}>Flight Booking</h1>
        </header>
        <main style={{ padding: 16 }}>{children}</main>
      </body>
    </html>
  );
}
