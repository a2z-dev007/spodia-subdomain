import React from 'react';
import Link from 'next/link';
import { SOCIAL_LINKS } from '@/utils/helper';

interface SocialMediaSectionProps {
    className?: string;
    cardClassName?: string;
    showDescription?: boolean;
}

const SocialMediaSection: React.FC<SocialMediaSectionProps> = ({
    className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6",
    cardClassName = "rounded-2xl p-6 transition-all duration-300 group text-center",
    showDescription = true
}) => {
    return (
        <div className={className}>
            {SOCIAL_LINKS.map((social, index) => {
                const Icon = social.icon;
                return (
                    <Link
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${social.className} ${cardClassName}`}
                    >
                        <Icon className={`w-8 h-8 ${social.iconClassName} mb-3 group-hover:scale-110 transition-transform mx-auto`} />
                        <div className="font-semibold text-white">{social.label}</div>
                        {showDescription && (
                            <div className="text-sm text-gray-400">{social.description}</div>
                        )}
                    </Link>
                );
            })}
        </div>
    );
};

export default SocialMediaSection;
