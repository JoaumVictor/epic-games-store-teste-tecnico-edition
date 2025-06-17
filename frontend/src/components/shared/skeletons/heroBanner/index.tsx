import React from "react";
import Container from "@/components/ui/container";

export default function HeroBannerSkeleton() {
  return (
    <Container>
      <div className="flex items-center justify-start gap-5 my-5">
        <div className="p-2 flex bg-[#2d2d2d] rounded-[14px] items-center justify-center gap-2 text-[14px]">
          <div className="w-4 h-4 ml-1 bg-gray-500 rounded-full animate-pulse"></div>
          <div className="w-32 h-6 bg-gray-500 rounded-md animate-pulse"></div>
        </div>
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="w-20 h-6 bg-gray-500 rounded-md animate-pulse"
          ></div>
        ))}
      </div>
      <div className="flex items-center justify-between w-full gap-3">
        <div className="w-4/5 overflow-hidden">
          <div className="min-h-[750px] rounded-[14px] flex items-start justify-end gap-4 flex-col p-10 shadow-inner bg-[#2d2d2d] text-white transition-all heroBanner">
            <div className="w-[280px] h-20 bg-gray-700 rounded-md animate-pulse z-10"></div>
            <div className="max-w-[350px] w-64 h-6 bg-gray-700 rounded-md animate-pulse z-10"></div>
            <div className="max-w-[350px] w-80 h-8 bg-gray-700 rounded-md animate-pulse z-10"></div>
            <div className="z-10 w-40 h-6 bg-gray-700 rounded-md animate-pulse"></div>
            <div className="z-10 w-48 h-12 bg-gray-700 rounded-md animate-pulse"></div>
          </div>
        </div>
        <div className="w-1/5 flex items-center justify-between flex-col min-h-[750px] gap-3">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="w-full px-8 py-4 rounded-[8px] min-h-[100px] flex items-center justify-between flex-row gap-2 bg-[#2d2d2d]"
            >
              <div className="w-1/4 h-16 bg-gray-700 rounded-md animate-pulse"></div>
              <div className="w-2/3 h-6 bg-gray-700 rounded-md animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
