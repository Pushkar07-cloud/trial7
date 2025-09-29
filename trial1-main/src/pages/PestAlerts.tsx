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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  AlertTriangle, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  Filter,
  Search
} from 'lucide-react';

const pestAlertSchema = z.object({
  alert_type: z.string().min(1, 'Alert type is required'),
  field: z.string().min(1, 'Field is required'),
  severity: z.enum(['low', 'medium', 'high'], {
    required_error: 'Please select severity level'
  }),
  description: z.string().optional(),
  reported_by: z.string().optional()
});

type PestAlertForm = z.infer<typeof pestAlertSchema>;

interface PestAlert {
  id: string;
  alert_type: string;
  field: string;
  severity: 'low' | 'medium' | 'high';
  description: string | null;
  status: 'active' | 'resolved' | 'investigating';
  reported_by: string | null;
  created_at: string;
  updated_at: string;
}

const PestAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<PestAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved' | 'investigating'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<PestAlertForm>({
    resolver: zodResolver(pestAlertSchema),
    defaultValues: {
      alert_type: '',
      field: '',
      severity: 'low',
      description: '',
      reported_by: ''
    }
  });

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pest_alerts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAlerts(data || []);
    } catch (err) {
      console.error('Error fetching pest alerts:', err);
      toast({
        title: "Error",
        description: "Failed to load pest alerts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: PestAlertForm) => {
    try {
      setSubmitting(true);
      
      if (editingId) {
        // Update existing alert
        const { error } = await supabase
          .from('pest_alerts')
          .update(data)
          .eq('id', editingId);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Pest alert updated successfully"
        });
        
        setEditingId(null);
      } else {
        // Create new alert
        const { error } = await supabase
          .from('pest_alerts')
          .insert([{
            ...data,
            status: 'active'
          }]);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Pest alert created successfully"
        });
      }
      
      reset();
      fetchAlerts();
    } catch (err) {
      console.error('Error saving pest alert:', err);
      toast({
        title: "Error",
        description: "Failed to save pest alert",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (alert: PestAlert) => {
    setEditingId(alert.id);
    setValue('alert_type', alert.alert_type);
    setValue('field', alert.field);
    setValue('severity', alert.severity);
    setValue('description', alert.description || '');
    setValue('reported_by', alert.reported_by || '');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    reset();
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('pest_alerts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Pest alert deleted successfully"
      });
      
      fetchAlerts();
    } catch (err) {
      console.error('Error deleting pest alert:', err);
      toast({
        title: "Error",
        description: "Failed to delete pest alert",
        variant: "destructive"
      });
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'active' | 'resolved' | 'investigating') => {
    try {
      const { error } = await supabase
        .from('pest_alerts')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Alert status updated to ${newStatus}`
      });
      
      fetchAlerts();
    } catch (err) {
      console.error('Error updating alert status:', err);
      toast({
        title: "Error",
        description: "Failed to update alert status",
        variant: "destructive"
      });
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-100 text-red-800 border-red-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'investigating': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesFilter = filter === 'all' || alert.status === filter;
    const matchesSearch = searchTerm === '' || 
      alert.alert_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.field.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (alert.description && alert.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

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
            🚨 Krishi Mitra - Pest Alerts Management
          </h1>
          <p className="text-gray-600">Monitor and manage pest alerts across your fields</p>
        </div>

        {/* Add/Edit Form */}
        <Card className="shadow-lg border-green-200">
          <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-6 w-6" />
              {editingId ? 'Edit Pest Alert' : 'Add New Pest Alert'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Alert Type */}
                <div className="space-y-2">
                  <Label htmlFor="alert_type" className="text-sm font-medium text-gray-700">
                    Alert Type *
                  </Label>
                  <Input
                    id="alert_type"
                    {...register('alert_type')}
                    className="h-10"
                    placeholder="e.g., Aphids, Fungal Infection"
                  />
                  {errors.alert_type && (
                    <p className="text-sm text-red-500">{errors.alert_type.message}</p>
                  )}
                </div>

                {/* Field */}
                <div className="space-y-2">
                  <Label htmlFor="field" className="text-sm font-medium text-gray-700">
                    Field *
                  </Label>
                  <Input
                    id="field"
                    {...register('field')}
                    className="h-10"
                    placeholder="e.g., Field A, North Section"
                  />
                  {errors.field && (
                    <p className="text-sm text-red-500">{errors.field.message}</p>
                  )}
                </div>

                {/* Severity */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Severity Level *
                  </Label>
                  <Select onValueChange={(value) => setValue('severity', value as any)}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">🟢 Low</SelectItem>
                      <SelectItem value="medium">🟡 Medium</SelectItem>
                      <SelectItem value="high">🔴 High</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.severity && (
                    <p className="text-sm text-red-500">{errors.severity.message}</p>
                  )}
                </div>

                {/* Reported By */}
                <div className="space-y-2">
                  <Label htmlFor="reported_by" className="text-sm font-medium text-gray-700">
                    Reported By
                  </Label>
                  <Input
                    id="reported_by"
                    {...register('reported_by')}
                    className="h-10"
                    placeholder="e.g., John Smith"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Description
                </Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  className="min-h-[100px]"
                  placeholder="Detailed description of the pest alert..."
                />
              </div>

              {/* Form Actions */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Saving...
                    </>
                  ) : editingId ? (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Update Alert
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Alert
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

        {/* Filters and Search */}
        <Card className="shadow-lg border-green-200">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search alerts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Alerts</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="investigating">Investigating</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alerts List */}
        <Card className="shadow-lg border-green-200">
          <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-6 w-6" />
              Pest Alerts ({filteredAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6 space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-20" />
                ))}
              </div>
            ) : filteredAlerts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No pest alerts found</p>
                <p className="text-sm">Add your first pest alert above</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredAlerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {alert.alert_type}
                          </h3>
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                          <Badge className={getStatusColor(alert.status)}>
                            {alert.status}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-2">
                          <strong>Field:</strong> {alert.field}
                        </p>
                        {alert.description && (
                          <p className="text-gray-700 mb-2">{alert.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>
                            <strong>Reported:</strong> {formatDate(alert.created_at)}
                          </span>
                          {alert.reported_by && (
                            <span>
                              <strong>By:</strong> {alert.reported_by}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(alert)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(alert.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Status Actions */}
                    <div className="mt-4 flex gap-2">
                      {alert.status !== 'resolved' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(alert.id, 'resolved')}
                          className="text-green-600 border-green-300 hover:bg-green-50"
                        >
                          Mark Resolved
                        </Button>
                      )}
                      {alert.status !== 'investigating' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(alert.id, 'investigating')}
                          className="text-blue-600 border-blue-300 hover:bg-blue-50"
                        >
                          Mark Investigating
                        </Button>
                      )}
                      {alert.status !== 'active' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(alert.id, 'active')}
                          className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                          Mark Active
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PestAlerts;
