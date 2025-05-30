"use client";

import React, { useState, ChangeEvent, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit2, Trash2 } from "lucide-react";

type Employee = {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  code?: string;
  status?: string;
  managerName?: string;
};

const initialEmployeeState: Employee = {
  firstName: "",
  lastName: "",
  email: "",
  department: "",
  code: "",
  status: "initial",
  managerName: "",
};

export default function EmployeesPage() {
  // Main data
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // File upload
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add dialog
  const [addOpen, setAddOpen] = useState(false);
  const [newEmp, setNewEmp] = useState<Employee>(initialEmployeeState);

  // Edit dialog
  const [editOpen, setEditOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editEmp, setEditEmp] = useState<Employee>(initialEmployeeState);

  // Delete confirmation
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  // Handle file upload CSV → employees
  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const [headerLine, ...lines] = text.trim().split("\n");
    const headers = headerLine.split(",").map((h) => h.trim());
    const data = lines.map((line) => {
      const cols = line.split(",").map((c) => c.trim());
      return headers.reduce((acc, key, i) => {
        (acc as any)[key] = cols[i] ?? "";
        return acc;
      }, {} as any) as Employee;
    });
    setEmployees(data);
  };

  // Download CSV template
  const downloadTemplate = () => {
    const template = [
      ["firstName", "lastName", "email", "department", "managerName", "code", "status"],
      ["John", "Doe", "john.doe@example.com", "Sales", "Jane Smith", "jd123", "initial"],
    ]
      .map((r) => r.join(","))
      .join("\n");
    const blob = new Blob([template], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "employee_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Add new employee
  const handleAdd = () => {
    setEmployees((prev) => [...prev, newEmp]);
    setAddOpen(false);
    setNewEmp(initialEmployeeState);
  };

  // Open edit slide-over
  const onEditClick = (index: number) => {
    setEditIndex(index);
    setEditEmp(employees[index]);
    setEditOpen(true);
  };

  // Save edited employee
  const handleEditSave = () => {
    if (editIndex === null) return;
    setEmployees((prev) =>
      prev.map((emp, i) => (i === editIndex ? editEmp : emp))
    );
    setEditOpen(false);
    setEditIndex(null);
    setEditEmp(initialEmployeeState);
  };

  // Open delete confirmation
  const onDeleteClick = (index: number) => {
    setDeleteIndex(index);
    setDeleteOpen(true);
  };

  // Confirm deletion
  const handleDeleteConfirm = () => {
    if (deleteIndex === null) return;
    setEmployees((prev) => prev.filter((_, i) => i !== deleteIndex));
    setDeleteOpen(false);
    setDeleteIndex(null);
  };

  // Filtered list
  const filtered = employees.filter((emp) =>
    statusFilter === "all" ? true : emp.status === statusFilter
  );

  return (
    <Card>
      <CardHeader className="inline-flex items-center justify-between">
        <CardTitle>Employee List</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="initial">Initial Upload</SelectItem>
                <SelectItem value="selected">Selected Peers</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-500">
              Showing {filtered.length} / {employees.length}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="secondary" onClick={downloadTemplate}>
                    Download Template
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" align="center" className="bg-black/90">
                  Download CSV template, fill it, then upload.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Upload Employees
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleUpload}
            />

            {/* Add Employee */}
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Add Employee
                </Button>
              </DialogTrigger>
              <DialogContent className="fixed right-0 top-0 h-full w-full max-w-md p-6 bg-white shadow-lg overflow-auto animate-in duration-300 slide-in-from-right-1/2">
                <DialogHeader>
                  <DialogTitle>Add New Employee</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  {[
                    { label: "First Name", key: "firstName" },
                    { label: "Last Name", key: "lastName" },
                    { label: "Email", key: "email" },
                    { label: "Department", key: "department" },
                    { label: "Code", key: "code" },
                    { label: "Manager Name", key: "managerName" },
                  ].map(({ label, key }) => (
                    <div key={key} className="space-y-1">
                      <Label htmlFor={key}>{label}</Label>
                      <Input
                        id={key}
                        value={(newEmp as any)[key] || ""}
                        type="email"
                        onChange={(e) =>
                          setNewEmp((s) => ({ ...s, [key]: e.target.value }))
                        }
                      />
                    </div>
                  ))}
                  <div className="space-y-1">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={newEmp.status}
                      onValueChange={(val) =>
                        setNewEmp((s) => ({ ...s, status: val }))
                      }
                    >
                      <SelectTrigger id="status" className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="initial">Initial Upload</SelectItem>
                        <SelectItem value="selected">Selected Peers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter className="mt-6 flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setAddOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAdd}>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Table */}
        <div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="sticky top-0 bg-gray-50 z-10">
              <tr>
                {[
                  "Name",
                  "Email",
                  "Department",
                  "Code",
                  "Peer Selection",
                  "Review",
                  "Status",
                  "Manager",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y text-sm divide-gray-200">
              {filtered.map((emp, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {emp.firstName} {emp.lastName}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{emp.email}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{emp.department}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{emp.code || "-"}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {emp.code ? (
                      <a
                        href={`/selection/${emp.code}`}
                        target="_blank"
                        className="text-blue-600 hover:underline"
                      >
                        Selection Link
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {emp.code ? (
                      <a
                        href={`/review/${emp.code}`}
                        target="_blank"
                        className="text-blue-600 hover:underline"
                      >
                        Review Link
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap capitalize">
                    {emp.status || "-"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {emp.managerName || "-"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap flex space-x-2">
                    <button onClick={() => onEditClick(idx)}>
                      <Edit2 className="h-5 w-5 text-blue-500 hover:text-blue-700" />
                    </button>
                    <button onClick={() => onDeleteClick(idx)}>
                      <Trash2 className="h-5 w-5 text-red-500 hover:text-red-700" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 pt-10 py-2 text-center text-sm text-gray-500"
                  >
                    No employees to display.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Edit Employee Slide-over */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogTrigger asChild>
            <div hidden />
          </DialogTrigger>
          <DialogContent className="fixed right-0 top-0 h-full w-full max-w-md p-6 bg-white shadow-lg overflow-auto animate-in duration-300 slide-in-from-right-1/2">
            <DialogHeader>
              <DialogTitle>Edit Employee</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {[
                { label: "First Name", key: "firstName" },
                { label: "Last Name", key: "lastName" },
                { label: "Email", key: "email" },
                { label: "Department", key: "department" },
                { label: "Code", key: "code" },
                { label: "Manager Name", key: "managerName" },
              ].map(({ label, key }) => (
                <div key={key} className="space-y-1">
                  <Label htmlFor={`edit-${key}`}>{label}</Label>
                  <Input
                    id={`edit-${key}`}
                    value={(editEmp as any)[key] || ""}
                    onChange={(e) =>
                      setEditEmp((s) => ({ ...s, [key]: e.target.value }))
                    }
                  />
                </div>
              ))}
              <div className="space-y-1">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={editEmp.status}
                  onValueChange={(val) =>
                    setEditEmp((s) => ({ ...s, status: val }))
                  }
                >
                  <SelectTrigger id="edit-status" className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="initial">Initial Upload</SelectItem>
                    <SelectItem value="selected">Selected Peers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="mt-6 flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditSave}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>


        {/* Delete Confirmation Modal */}
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogTrigger asChild>
            <div hidden />
          </DialogTrigger>
          <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 max-w-sm mx-auto">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <p className="mt-4">
              Are you sure you want to delete{" "}
              <strong>
                {deleteIndex !== null
                  ? `${employees[deleteIndex].firstName} ${employees[deleteIndex].lastName}`
                  : ""}
              </strong>
              ?
            </p>
            <DialogFooter className="mt-6 flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700"
                onClick={handleDeleteConfirm}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </CardContent>
    </Card>
  );
}
