import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Droplets, 
  Thermometer, 
  Leaf, 
  Plus, 
  Trash2, 
  Edit,
  Save,
  X
} from 'lucide-react';

const soilDataSchema = z.object({
  moisture: z.number().min(0).max(100, 'Moisture must be between 0-100%'),
  ph: z.number().min(0).max(14, 'pH must be between 0-14'),
  nitrogen: z.number().min(0, 'Nitrogen must be a positive number'),
  notes: z.string().optional()
});

type SoilDataForm = z.infer<typeof soilDataSchema>;

interface SoilDataRecord {
  id: string;
  moisture: number;
  ph: number;
  nitrogen: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

const SoilHealth: React.FC = () => {
  const [records, setRecords] = useState<SoilDataRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<SoilDataForm>({
    resolver: zodResolver(soilDataSchema),
    defaultValues: {
      moisture: 0,
      ph: 7,
      nitrogen: 0,
      notes: ''
    }
  });

  useEffect(() => {
    fetchSoilData();
  }, []);

  const fetchSoilData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('soil_data')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (err) {
      console.error('Error fetching soil data:', err);
      toast({
        title: "Error",
        description: "Failed to load soil data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: SoilDataForm) => {
    try {
      setSubmitting(true);
      
      if (editingId) {
        // Update existing record
        const { error } = await supabase
          .from('soil_data')
          .update(data)
          .eq('id', editingId);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Soil data updated successfully"
        });
        
        setEditingId(null);
      } else {
        // Create new record
        const { error } = await supabase
          .from('soil_data')
          .insert([data]);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Soil data added successfully"
        });
      }
      
      reset();
      fetchSoilData();
    } catch (err) {
      console.error('Error saving soil data:', err);
      toast({
        title: "Error",
        description: "Failed to save soil data",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (record: SoilDataRecord) => {
    setEditingId(record.id);
    setValue('moisture', record.moisture);
    setValue('ph', record.ph);
    setValue('nitrogen', record.nitrogen);
    setValue('notes', record.notes || '');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    reset();
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('soil_data')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Soil data deleted successfully"
      });
      
      fetchSoilData();
    } catch (err) {
      console.error('Error deleting soil data:', err);
      toast({
        title: "Error",
        description: "Failed to delete soil data",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-green-800 mb-2">
            🌱 Krishi Mitra - Soil Health Management
          </h1>
          <p className="text-gray-600">Monitor and manage your soil conditions</p>
        </div>

        {/* Add/Edit Form */}
        <Card className="shadow-lg border-green-200">
          <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-6 w-6" />
              {editingId ? 'Edit Soil Data' : 'Add New Soil Data'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Soil Moisture */}
                <div className="space-y-2">
                  <Label htmlFor="moisture" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-blue-500" />
                    Soil Moisture (%)
                  </Label>
                  <Input
                    id="moisture"
                    type="number"
                    step="0.1"
                    {...register('moisture', { valueAsNumber: true })}
                    className="h-10"
                    placeholder="0-100"
                  />
                  {errors.moisture && (
                    <p className="text-sm text-red-500">{errors.moisture.message}</p>
                  )}
                </div>

                {/* Soil pH */}
                <div className="space-y-2">
                  <Label htmlFor="ph" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-red-500" />
                    Soil pH
                  </Label>
                  <Input
                    id="ph"
                    type="number"
                    step="0.1"
                    {...register('ph', { valueAsNumber: true })}
                    className="h-10"
                    placeholder="0-14"
                  />
                  {errors.ph && (
                    <p className="text-sm text-red-500">{errors.ph.message}</p>
                  )}
                </div>

                {/* Nitrogen Level */}
                <div className="space-y-2">
                  <Label htmlFor="nitrogen" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-green-500" />
                    Nitrogen (ppm)
                  </Label>
                  <Input
                    id="nitrogen"
                    type="number"
                    step="0.1"
                    {...register('nitrogen', { valueAsNumber: true })}
                    className="h-10"
                    placeholder="0+"
                  />
                  {errors.nitrogen && (
                    <p className="text-sm text-red-500">{errors.nitrogen.message}</p>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
                  Notes (Optional)
                </Label>
                <Textarea
                  id="notes"
                  {...register('notes')}
                  className="min-h-[100px]"
                  placeholder="Additional observations or notes..."
                />
              </div>

              {/* Form Actions */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Saving...
                    </>
                  ) : editingId ? (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Update Data
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Data
                    </>
                  )}
                </Button>
                
                {editingId && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelEdit}
                    className="border-gray-300"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card className="shadow-lg border-green-200">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Thermometer className="h-6 w-6" />
              Soil Data History
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6 space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex space-x-4">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </div>
            ) : records.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <Thermometer className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No soil data recorded yet</p>
                <p className="text-sm">Add your first soil measurement above</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Moisture (%)</TableHead>
                      <TableHead>pH</TableHead>
                      <TableHead>Nitrogen (ppm)</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {records.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">
                          {formatDate(record.created_at)}
                        </TableCell>
                        <TableCell>
                          <span className="text-blue-600 font-semibold">
                            {record.moisture}%
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-red-600 font-semibold">
                            {record.ph}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-green-600 font-semibold">
                            {record.nitrogen}
                          </span>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {record.notes || '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(record)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(record.id)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SoilHealth;
