import { FC, useState } from "react";
import type { LucideIcon } from 'lucide-react';

export interface TabItem {
    name: string,
    key: string,
    icon: LucideIcon,
    component: React.ReactNode;
}

interface TabsProps {
    tabs: TabItem[];
}


export const Tabs : FC<TabsProps> = ({tabs}) => {
  const [activeTab, setActiveTab] = useState<TabItem>(tabs[0]);

  return (
    <div>
      <div className="border-b border-gray-200">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500">
          {tabs.map((tab:any) => {
            const isActive = activeTab.key === tab.key;

            return (
              <li key={tab.key} className="me-2">
                <button
                  disabled={tab.disabled}
                  onClick={() => !tab.disabled && setActiveTab(tab)}
                  className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group
                    ${isActive ? "text-secondary-600 border-secondary-600" : "border-transparent hover:text-gray-600 hover:border-gray-300"}
                    ${tab.disabled ? "text-gray-400 cursor-not-allowed" : ""}
                  `}
                >
                  <tab.icon
                    className={`w-4 h-4 me-2 ${
                      isActive ? "text-secondary-600" : "text-gray-400 group-hover:text-gray-500"
                    }`}
                  />
                  {tab.name}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="p-4">
        {activeTab.component}
      </div>
    </div>
  );
}
