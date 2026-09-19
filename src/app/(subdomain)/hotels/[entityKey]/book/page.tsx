import { redirect } from "next/navigation";

type Props = { params: Promise<{ entityKey: string }> };

export default async function Page({ params }: Props) {
  const { entityKey } = await params;
  redirect(`/hotels/${entityKey}/rooms`);
}
