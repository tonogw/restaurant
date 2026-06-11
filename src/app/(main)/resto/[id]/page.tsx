export default function RestoDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="p-8 font-nunito">
      <h1>Detail Restoran: {params.id}</h1>
      <p>Preparing the restaurant detail page</p>
    </div>
  );
}
