'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface NewCategoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  userRole?: string;
}

export function NewCategoryForm({ open, onOpenChange, onSuccess, userRole }: NewCategoryFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [submitType, setSubmitType] = useState<'approval' | 'direct'>('approval');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const submitData = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
      };

      // Choose endpoint based on submit type
      const endpoint = submitType === 'direct' ? '/api/categories' : '/api/pending-categories';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        const successMessage = submitType === 'direct' 
          ? 'Category created successfully!' 
          : 'Category submitted for approval successfully!';
        toast.success(successMessage);
        onOpenChange(false);
        resetForm();
        onSuccess?.();
        router.refresh();
      } else {
        const error = await response.json();
        const errorMessage = submitType === 'direct'
          ? 'Failed to create category'
          : 'Failed to submit category';
        toast.error(error.error || errorMessage);
      }
    } catch (error) {
      console.error('Error submitting category:', error);
      toast.error('Failed to submit category');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {submitType === 'direct' ? 'Create New Category' : 'Submit New Category for Approval'}
          </DialogTitle>
          <DialogDescription>
            {submitType === 'direct' 
              ? 'Create a new category that will be added to the system immediately.'
              : 'Create a new category that will be reviewed by an administrator before being added to the system.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {userRole === 'ADMIN' && (
            <div className="space-y-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Label className="text-sm font-medium text-blue-800">Submission Type</Label>
              <div className="flex gap-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="submitType"
                    value="direct"
                    checked={submitType === 'direct'}
                    onChange={(e) => setSubmitType(e.target.value as 'direct' | 'approval')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-blue-700">Create Directly</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="submitType"
                    value="approval"
                    checked={submitType === 'approval'}
                    onChange={(e) => setSubmitType(e.target.value as 'direct' | 'approval')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-blue-700">Submit for Approval</span>
                </label>
              </div>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="name">Category Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter category name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter category description (optional)"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {submitType === 'direct' ? 'Create Category' : 'Submit for Approval'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
