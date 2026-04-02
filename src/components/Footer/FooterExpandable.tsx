"use client";
import {useState} from "react";
import Link from "next/link";

interface FooterItem {
    text: string;
    href?: string;
}

interface FooterSectionProps {
    data: string[] | FooterItem[];
    defaultVisible?: number;
    expanded?: boolean;           // controlled from parent (accordion mode)
    onToggle?: () => void;        // notify parent (accordion mode)
}

const FooterExpandable: React.FC<FooterSectionProps> = ({
                                                            data,
                                                            defaultVisible = 5,
                                                            expanded,
                                                            onToggle
                                                        }) => {
    const [localExpanded, setLocalExpanded] = useState(false);

    if (!data || data.length === 0) return null;

    const isExpanded = expanded !== undefined ? expanded : localExpanded;
    
    // Handle both string[] and FooterItem[] formats
    const title = typeof data[0] === 'string' ? data[0] : data[0].text;
    const items = data.slice(1);
    
    // Filter out empty items
    const validItems = items.filter(item => {
        const text = typeof item === 'string' ? item : item?.text;
        return text && text.trim() !== '';
    });
    
    // If no valid items after title, don't render the section
    if (validItems.length === 0) return null;
    
    const visibleItems = isExpanded ? validItems : validItems.slice(0, defaultVisible);

    const handleToggle = () => {
        if (onToggle) {
            onToggle(); // for accordion mode
        } else {
            setLocalExpanded(!localExpanded); // independent mode
        }
    };

    return (
        <div className="mb-3 sm:mb-4">
            <p className="text-[10px] sm:text-xs text-gray-600 leading-relaxed sm:leading-relaxed">
                <span className="font-bold text-gray-700 text-xs sm:text-sm">{title}</span>
                {visibleItems.map((item, idx) => {
                    const text = typeof item === 'string' ? item : item.text;
                    const href = typeof item === 'string' ? undefined : item.href;
                    
                    // Skip empty items
                    if (!text || text.trim() === '') return null;
                    
                    return (
                        <span key={idx} className="inline-block">
                            <span className="text-[#8E8E8E] mx-1"> | </span>
                            {href ? (
                                <Link 
                                    href={href} 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#8E8E8E] hover:text-[#FF9530] transition-colors break-words"
                                >
                                    {text}
                                </Link>
                            ) : (
                                <span className="text-[#8E8E8E] break-words">{text}</span>
                            )}
                        </span>
                    );
                })}
                {validItems.length > defaultVisible && (
                    <button
                        onClick={handleToggle}
                        className="ml-1 sm:ml-2 text-[#FF9530] text-[10px] sm:text-xs font-semibold hover:underline inline-block mt-1"
                    >
                        {isExpanded ? "Show less" : "Show more"}
                    </button>
                )}
            </p>
        </div>
    );
};

export default FooterExpandable;
