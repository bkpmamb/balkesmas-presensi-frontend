// components/settings/SettingsGuide.tsx

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";
import { guideSections, warningMessage } from "@/config/settings.config";

export function SettingsGuide() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <SettingsIcon className="h-5 w-5" />
          <span>Panduan Pengaturan</span>
        </CardTitle>
        <CardDescription>Petunjuk penggunaan fitur pengaturan</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {guideSections.map((section) => (
          <div key={section.title}>
            <h4 className="font-semibold mb-2">
              {section.icon} {section.title}
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              {section.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        ))}

        <WarningBox
          title={warningMessage.title}
          description={warningMessage.description}
        />
      </CardContent>
    </Card>
  );
}

interface WarningBoxProps {
  title: string;
  description: string;
}

function WarningBox({ title, description }: WarningBoxProps) {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <p className="text-sm font-medium text-yellow-900 mb-1">{title}</p>
      <p className="text-sm text-yellow-700">{description}</p>
    </div>
  );
}
