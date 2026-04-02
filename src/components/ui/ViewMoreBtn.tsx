import React from "react";
import { Button } from "./button";
import { ArrowBigRight, ArrowRight, Forward } from "lucide-react";

const ViewMoreBtn = ({
  onClick,
  text,
  className = "",
}: {
  onClick: () => void;
  text: string;
  className?: string;
}) => {
  return (
    <div className={className}>
      <Button
        onClick={onClick}
        className="gradient-btn text-white border-none shadow-lg hover:shadow-xl rounded-full px-8 py-2.5 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 font-bold"
      >
        {text} <ArrowRight className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default ViewMoreBtn;
