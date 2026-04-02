import Image from "next/image"

interface StepCardProps {
    step: string
    title: string
    description: string
    image: string

}

const StepCard: React.FC<StepCardProps> = ({ step, title, description, image }) => {
    return (
        <div className="bg-white rounded-[20px] shadow-sm border border-[#E5E7EB] p-5  flex flex-col transition hover:shadow-md">
            {/* Image */}
            <div className="mb-8">
                <Image src={image} alt={title} width={160} height={160} className="mx-auto" />
            </div>

            {/* Step */}
            <div className="mb-6 py-[6px]  self-start border border-[#FFDAA8] bg-orange-50 text-orange-500 rounded-lg px-3  text-sm font-medium">
                <span className="bg-orange-50 text-orange-500  text-lg font-semibold px-3 py-1 rounded-lg">
                    {step}
                </span>
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold text-gray-900 mb-2 text-left">{title}</h3>

            {/* Description */}
            <p className="text-lg font-normal text-[#374151] ">{description}</p>
        </div>
    )
}

export default StepCard
