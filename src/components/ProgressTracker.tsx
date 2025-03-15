
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Save, LineChart, Camera } from 'lucide-react';
import { Client, ProgressRecord } from '@/types';
import { mockProgressRecords } from '@/data/mockData';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProgressTrackerProps {
  client: Client;
}

const ProgressTracker = ({ client }: ProgressTrackerProps) => {
  const clientRecords = mockProgressRecords.filter(record => record.clientId === client.id);
  const [isAddingRecord, setIsAddingRecord] = useState(false);
  
  const [newRecord, setNewRecord] = useState<Partial<ProgressRecord>>({
    clientId: client.id,
    date: new Date().toISOString().split('T')[0],
    weight: client.weight,
    measurements: {
      chest: 0,
      waist: 0,
      hips: 0,
      arms: 0,
      thighs: 0
    },
    notes: ''
  });

  const handleSaveRecord = () => {
    // In a real app, this would save to the database
    alert('Progress record saved successfully!');
    setIsAddingRecord(false);
    setNewRecord({
      clientId: client.id,
      date: new Date().toISOString().split('T')[0],
      weight: client.weight,
      measurements: {
        chest: 0,
        waist: 0,
        hips: 0,
        arms: 0,
        thighs: 0
      },
      notes: ''
    });
  };

  // Prepare data for charts
  const weightChartData = clientRecords.map(record => ({
    date: new Date(record.date).toLocaleDateString(),
    weight: record.weight
  }));

  const measurementsChartData = clientRecords.map(record => ({
    date: new Date(record.date).toLocaleDateString(),
    ...record.measurements
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Progress Tracking</h2>
        {!isAddingRecord && (
          <Button 
            className="flex items-center gap-2"
            onClick={() => setIsAddingRecord(true)}
          >
            <Plus className="h-4 w-4" />
            <span>Add New Record</span>
          </Button>
        )}
      </div>

      {isAddingRecord ? (
        <Card>
          <CardHeader>
            <CardTitle>Add Progress Record</CardTitle>
            <CardDescription>Record {client.name}'s current measurements and progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Input 
                  type="date"
                  value={newRecord.date}
                  onChange={(e) => setNewRecord({...newRecord, date: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Weight (kg)</label>
                <Input 
                  type="number"
                  value={newRecord.weight}
                  onChange={(e) => setNewRecord({...newRecord, weight: parseFloat(e.target.value) || 0})}
                />
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-3">Body Measurements (cm)</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium">Chest</label>
                  <Input 
                    type="number"
                    value={newRecord.measurements?.chest || ''}
                    onChange={(e) => setNewRecord({
                      ...newRecord, 
                      measurements: {
                        ...newRecord.measurements!,
                        chest: parseFloat(e.target.value) || 0
                      }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium">Waist</label>
                  <Input 
                    type="number"
                    value={newRecord.measurements?.waist || ''}
                    onChange={(e) => setNewRecord({
                      ...newRecord, 
                      measurements: {
                        ...newRecord.measurements!,
                        waist: parseFloat(e.target.value) || 0
                      }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium">Hips</label>
                  <Input 
                    type="number"
                    value={newRecord.measurements?.hips || ''}
                    onChange={(e) => setNewRecord({
                      ...newRecord, 
                      measurements: {
                        ...newRecord.measurements!,
                        hips: parseFloat(e.target.value) || 0
                      }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium">Arms</label>
                  <Input 
                    type="number"
                    value={newRecord.measurements?.arms || ''}
                    onChange={(e) => setNewRecord({
                      ...newRecord, 
                      measurements: {
                        ...newRecord.measurements!,
                        arms: parseFloat(e.target.value) || 0
                      }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium">Thighs</label>
                  <Input 
                    type="number"
                    value={newRecord.measurements?.thighs || ''}
                    onChange={(e) => setNewRecord({
                      ...newRecord, 
                      measurements: {
                        ...newRecord.measurements!,
                        thighs: parseFloat(e.target.value) || 0
                      }
                    })}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Notes</label>
              <Textarea 
                value={newRecord.notes}
                onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
                placeholder="Add any observations or comments about the client's progress"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Progress Photos</label>
              <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6">
                <div className="text-center">
                  <Camera className="h-8 w-8 mx-auto text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">Drag and drop photos, or click to upload</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Upload Photos
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsAddingRecord(false)}>Cancel</Button>
            <Button 
              onClick={handleSaveRecord}
              disabled={!newRecord.weight}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              <span>Save Record</span>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="space-y-6">
          {clientRecords.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Weight Progress</CardTitle>
                    <CardDescription>Tracking weight changes over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart data={weightChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                          <Tooltip />
                          <Line 
                            type="monotone" 
                            dataKey="weight" 
                            stroke="#3b82f6" 
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Body Measurements</CardTitle>
                    <CardDescription>Changes in key body measurements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart data={measurementsChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          {clientRecords[0]?.measurements?.chest && (
                            <Line type="monotone" dataKey="chest" stroke="#ef4444" name="Chest" />
                          )}
                          {clientRecords[0]?.measurements?.waist && (
                            <Line type="monotone" dataKey="waist" stroke="#3b82f6" name="Waist" />
                          )}
                          {clientRecords[0]?.measurements?.hips && (
                            <Line type="monotone" dataKey="hips" stroke="#10b981" name="Hips" />
                          )}
                          {clientRecords[0]?.measurements?.arms && (
                            <Line type="monotone" dataKey="arms" stroke="#f59e0b" name="Arms" />
                          )}
                          {clientRecords[0]?.measurements?.thighs && (
                            <Line type="monotone" dataKey="thighs" stroke="#8b5cf6" name="Thighs" />
                          )}
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Progress History</CardTitle>
                  <CardDescription>Detailed record of all measurements and notes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {clientRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(record => (
                      <div key={record.id} className="border-b pb-4 last:border-0">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{new Date(record.date).toLocaleDateString()}</h3>
                          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                            {record.weight} kg
                          </span>
                        </div>
                        
                        {record.measurements && Object.keys(record.measurements).length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-2">
                            {record.measurements.chest && (
                              <div className="text-sm">
                                <span className="text-gray-500">Chest:</span> {record.measurements.chest} cm
                              </div>
                            )}
                            {record.measurements.waist && (
                              <div className="text-sm">
                                <span className="text-gray-500">Waist:</span> {record.measurements.waist} cm
                              </div>
                            )}
                            {record.measurements.hips && (
                              <div className="text-sm">
                                <span className="text-gray-500">Hips:</span> {record.measurements.hips} cm
                              </div>
                            )}
                            {record.measurements.arms && (
                              <div className="text-sm">
                                <span className="text-gray-500">Arms:</span> {record.measurements.arms} cm
                              </div>
                            )}
                            {record.measurements.thighs && (
                              <div className="text-sm">
                                <span className="text-gray-500">Thighs:</span> {record.measurements.thighs} cm
                              </div>
                            )}
                          </div>
                        )}
                        
                        {record.notes && (
                          <p className="text-sm text-gray-600 mt-2">{record.notes}</p>
                        )}
                        
                        {record.photos && record.photos.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-500 mb-1">Progress Photos:</p>
                            <div className="flex gap-2">
                              {record.photos.map((photo, index) => (
                                <div key={index} className="h-16 w-16 rounded overflow-hidden">
                                  <img src={photo} alt="Progress" className="h-full w-full object-cover" />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="text-center p-12 border border-dashed rounded-md">
              <h3 className="text-lg font-medium mb-2">No Progress Records Yet</h3>
              <p className="text-gray-500 mb-4">Start tracking {client.name}'s fitness journey</p>
              <Button onClick={() => setIsAddingRecord(true)}>Add First Record</Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;
