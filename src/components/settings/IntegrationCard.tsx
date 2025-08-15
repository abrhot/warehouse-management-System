// src/components/settings/IntegrationCard.tsx
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import Image from 'next/image';

interface IntegrationCardProps {
  name: string;
  description: string;
  status: 'Connect >' | 'Connected' | 'Disconnect';
  icon: string;
}

export function IntegrationCard({ name, description, status, icon }: IntegrationCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200 flex flex-col justify-between h-full">
      <CardHeader className="pb-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Image src={icon} alt={name} width={32} height={32} />
            <CardTitle>{name}</CardTitle>
          </div>
          {status === 'Connected' && (
            <div className="flex items-center text-sm text-green-600 space-x-1">
              <CheckCircle className="h-4 w-4" />
              <span>Connected</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-2 flex-1">
        <CardDescription>{description}</CardDescription>
      </CardContent>
      <div className="p-4 pt-0">
        {status === 'Connect >' ? (
          <Button variant="outline" className="w-full justify-start text-blue-600">
            {status}
          </Button>
        ) : (
          <Button variant="destructive" className="w-full">
            {status}
          </Button>
        )}
      </div>
    </Card>
  );
}