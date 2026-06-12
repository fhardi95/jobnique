export async function GET() {
  return new Response(
    `google.com, pub-8837638493815012, DIRECT, f08c47fec0942fa0`,
    {
      headers: {
        "Content-Type": "text/plain",
      },
    }
  );
}
