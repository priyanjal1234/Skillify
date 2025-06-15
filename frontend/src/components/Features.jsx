import React, { useContext, useState } from "react";
import { landingPageFeature } from "../utils/features";
import { ThemeDataContext } from "../context/ThemeContext";

const Features = () => {
  const { darkMode } = useContext(ThemeDataContext);
  const [features] = useState(landingPageFeature);

  return (
    <section
      className={`py-16 ${darkMode ? "bg-gray-800/50" : "bg-gray-50"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`p-6 rounded-xl shadow-sm transition-colors duration-200 flex flex-col items-start ${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}
          >
            {React.cloneElement(feature.icon, {
              className: `h-8 w-8 mb-4 ${
                darkMode ? "text-indigo-400" : "text-indigo-600"
              }`,
            })}
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;