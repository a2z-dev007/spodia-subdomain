type Props = {
    params: Promise<{ slug: string }>
}

export default async function HotelPage({ params }: Props) {
    const { slug } = await params

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold">Hotel Page</h1>
            <p>Subdomain/Slug: {slug}</p>
            <p>This will render the specific Hotel Website.</p>
        </div>
    )
}
