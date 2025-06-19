import React from "react";
import { ChartBar, MousePointerClick, Sliders, Zap } from "lucide-react"; 

const features = [
  {
    title: "Ultra Dynamic",
    description:
      "ACP is designed to redefine the way that you chart and analyze the financial markets, with more technical tools and capabilities than ever before.",
    icon: <ChartBar className="w-10 h-10 text-blue-500" />,
  },
  {
    title: "Highly Interactive",
    description:
      "Engage with the markets and your portfolio in entirely new ways with a highly-interactive charting experience that knows no bounds.",
    icon: <MousePointerClick className="w-10 h-10 text-blue-500" />,
  },
  {
    title: "Insanely Flexible",
    description:
      "Every investor has different needs and ACP is designed to support them all, with a wide array of technical indicators and overlays, customizable multi-chart.",
    icon: <Sliders className="w-10 h-10 text-blue-500" />,
  },
  {
    title: "Remarkably Powerful",
    description:
      "ACP brings you the web's most advanced technical charting platform, seamlessly integrated with the rest of the StockCharts feature.",
    icon: <Zap className="w-10 h-10 text-blue-500" />,
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white py-8 px-4 md:px-12">
      <h2 className="text-3xl md:text-4lg text-center text-gray-900 mb-16">
        How It Works
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-center">
        {features.map((feature, index) => (
          <div key={index} className="space-y-4 px-4 border-r last:border-none border-gray-200">
            <div className="flex justify-center">{feature.icon}</div>
            <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
            <p className="text-sm text-gray-500">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
