"use client";

import React, { useState, useEffect, ChangeEvent, useRef, } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, } from "@/components/ui/select";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent, } from "@/components/ui/tooltip";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit2, MailPlus, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

//
// We define a TypeScript type that matches the shape returned by GET /company/get-all-employee.
// We only pick the fields we need (name, email, department, and nested manager.email).
//
type FetchedEmployee = {
  employee_id: number;
  name: string;
  email: string;
  department: string;
  status: string;
  // other fields exist, but we only care about manager.email for now:
  manager_email: string | null;
};

//
// We keep our existing “local” Employee type for CSV parsing and POST payload.
// This is separate from FetchedEmployee.
//
type Employee = {
  name: string;
  email: string;
  department: string;
  status?: string;
  manager_email?: string;
};

const initialEmployeeState: Employee = {
  name: "",
  email: "",
  department: "",
  status: "",
  manager_email: "",
};

export default function EmployeesPage() {
  // Instead of Employee[], we now store FetchedEmployee[] in state.
  const [employees, setEmployees] = useState<FetchedEmployee[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // File upload ref
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

  const [isInviteAllLoading, setIsInviteAllLoading] = useState(false);

  const reviewCycleId = Number(useParams().reviewCycleId);

  //
  // 1) Fetch all employees from the server and populate state.
  //    Called on component mount, and also after a successful upload.
  //
  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("elevu_auth");
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/company/get-all-employee`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          review_cycle_id: reviewCycleId,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(
          `GET /company/get-all-employee responded with ${response.status}: ${text}`
        );
      }

      const json = await response.json();
      // json.data is the array of FetchedEmployee
      console.log("Fetched employees:", json.data);
      setEmployees(json.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      // Optionally show a toast/alert here
    }
  };

  // Fetch once on mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  //
  // 2) When the user selects a CSV file, parse it, POST to /company/upload-employees,
  //    then re-fetch the full list of employees for display.
  //
  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 2.1 Read CSV as text
    const text = await file.text();

    // 2.2 Parse CSV → array of Employee objects (camelCase keys)
    const [headerLine, ...lines] = text.trim().split("\n");
    const parsedData: Employee[] = lines.map((line) => {
      const [name, email, department, manager_email] = line
        .split(",")
        .map((c) => c.trim());
      return { name, email, department, manager_email };
    });;

    console.log("Parsed CSV data:", parsedData);

    // 2.3 Build the payload with snake_case for the POST body
    const payload = parsedData.map((emp) => ({
      name: emp.name,
      email: emp.email,
      department: emp.department,
      manager_email: emp.manager_email, // <-- snake_case for your API
    }));

    try {
      const token = localStorage.getItem("elevu_auth");

      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/company/upload-employees`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          employees: payload,
          review_cycle_id: reviewCycleId
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `POST /company/upload-employees responded with ${response.status}: ${errorText}`
        );
      }

      // If the upload succeeded, re-fetch the table data
      await fetchEmployees();
    } catch (error: any) {
      console.error("Error uploading employees:", error);
      alert(
        "There was a problem uploading employees to the server:\n" +
        error.message
      );
    }
  };

  //
  // 3) Download CSV template (unchanged)
  //
  const downloadTemplate = () => {
    const template = [
      ["name", "email", "department", "manager_email", "status"],
      [
        "John Doe",
        "john.doe@example.com",
        "Sales",
        "janesmith@example.com",
        "Initial Upload",
      ],
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

  //
  // 4) Add Employee → POST to /company/single-add-employee, then re-fetch
  //
  const handleAdd = async () => {
    try {
      const token = localStorage.getItem("elevu_auth");
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/company/single-add-employee`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          review_cycle_id: reviewCycleId,
          name: newEmp.name,
          email: newEmp.email,
          department: newEmp.department,
          manager_email: newEmp.manager_email, // snake_case per your API
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(
          `POST /company/single-add-employee responded with ${response.status}: ${text}`
        );
      }

      // After a successful add, re-fetch the full employee list
      await fetchEmployees();

      // Close dialog & reset form
      setAddOpen(false);
      setNewEmp(initialEmployeeState);
    } catch (error: any) {
      console.error("Error adding employee:", error);
      alert(
        "Could not add employee:\n" + (error.message || "Unknown server error")
      );
    }
  };

  //
  // 5) Edit Employee → PUT to /company/update-employee, then re-fetch
  //
  const onEditClick = (index: number) => {
    setEditIndex(index);
    // Map the FetchedEmployee at index into our small Employee form
    const emp = employees[index];
    setEditEmp({
      name: emp.name,
      email: emp.email,
      department: emp.department,
      manager_email: emp.manager_email || "",
      status: emp.hasOwnProperty("status") ? (emp as any).status : undefined,
    });
    setEditOpen(true);
  };

  const handleEditSave = async () => {
    if (editIndex === null) return;

    try {
      const token = localStorage.getItem("elevu_auth");
      const targetEmp = employees[editIndex];

      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/company/update-employee`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          employee_id: targetEmp.employee_id,
          review_cycle_id: reviewCycleId,
          name: editEmp.name,
          department: editEmp.department,
          status: editEmp.status,
          manager_email: editEmp.manager_email ? editEmp.manager_email : null,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(
          `PUT /company/update-employee responded with ${response.status}: ${text}`
        );
      }

      // After a successful update, re-fetch the full employee list
      await fetchEmployees();

      // Close dialog & reset edit state
      setEditOpen(false);
      setEditIndex(null);
      setEditEmp(initialEmployeeState);
    } catch (error: any) {
      console.error("Error updating employee:", error);
      alert(
        "Could not update employee:\n" + (error.message || "Unknown server error")
      );
    }
  };

  //
  // 6) Delete Employee → DELETE to /company/delete-employee, then re-fetch
  //
  const onDeleteClick = (index: number) => {
    setDeleteIndex(index);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteIndex === null) return;

    try {
      const token = localStorage.getItem("elevu_auth");
      const targetEmp = employees[deleteIndex];

      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/company/delete-employee`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          employee_id: targetEmp.employee_id,
          review_cycle_id: reviewCycleId,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(
          `DELETE /company/delete-employee responded with ${response.status}: ${text}`
        );
      }

      // After a successful delete, re-fetch the full employee list
      await fetchEmployees();

      // Close dialog & reset delete state
      setDeleteOpen(false);
      setDeleteIndex(null);
    } catch (error: any) {
      console.error("Error deleting employee:", error);
      alert(
        "Could not delete employee:\n" + (error.message || "Unknown server error")
      );
    }
  };

  //
  // 7) Invite a single employee → POST to /company/invite-employee, no re-fetch needed
  //
  const handleInvite = async (employeeId: number) => {
    try {
      const token = localStorage.getItem("elevu_auth");
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/company/invite-employee`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          employee_id: employeeId,
          review_cycle_id: reviewCycleId
        }),
      });
      const json = await response.json();

      if(!json.success) {
        throw new Error(json.message || "Failed to invite employee");
      }
      toast.success("Invitation sent to employee successfully.");

      // * UPDATE STATUS LOCALLY
      setEmployees((prev) => {
        return prev.map((emp) => {
          if (emp.employee_id === employeeId && emp.status === 'Initial Upload') {
            return { ...emp, status: "Invited" }; 
          }
          return emp;
        });
      })
    } catch (error: any) {
      console.error("Error inviting employee:", error);
      toast.error(error.message || "Unknown server error");
    }
  };

  //
  // 8) Invite all employees → POST to /company/invite-all-employee, no re-fetch needed
  //
  const handleInviteAll = async () => {
    setIsInviteAllLoading(true);
    try {
      const token = localStorage.getItem("elevu_auth");
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/company/invite-all-employee`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ review_cycle_id: reviewCycleId }),
      });
      const json = await response.json();

      if(!json.success) {
        throw new Error(json.message || "Failed to invite employees");
      }
      toast.success("Invitations sent to all employees successfully.");

      // * UPDATE STATUS LOCALLY
      setEmployees((prev) => {
        return prev.map((emp) => {
          if(emp.status === 'Initial Upload') {
            return { ...emp, status: "Invited" }; // Set all to "Invited"
          }
          return emp;
        });
      });
    } catch (error: any) {
      console.error("Error inviting all employees:", error);
      toast.error(error.message || "Unknown server error");
    } finally {
          setIsInviteAllLoading(false);
    }
  };

  //
  // 9) Filtering logic (for now, since backend doesn’t supply `status`, this will show all
  //    when “All Status” is selected; any other status choice yields an empty list until your
  //    backend populates employee.status.)
  //
  const filtered = employees.filter((emp) =>
    statusFilter === "all" ? true : (emp as any).status === statusFilter
  );

  return (
    <Card>
      <CardHeader className="inline-flex items-center justify-between">
        <CardTitle>Employee List</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Controls */}
        <div className="flex flex-col xl:flex-row justify-between xl:items-center mb-6 gap-5 xl:gap-0">
          <div className="flex items-center space-x-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Initial Upload">Initial Upload</SelectItem>
                <SelectItem value="Invited">Invited</SelectItem>
                <SelectItem value="Peer Selected">Peer Selected</SelectItem>
                <SelectItem value="Review Given">Review Given</SelectItem>
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
                <TooltipContent
                  side="top"
                  align="center"
                  className="bg-black/90"
                >
                  Download CSV template, fill it, then upload.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button disabled={employees.length === 0 || isInviteAllLoading} onClick={handleInviteAll} className="bg-blue-600 hover:bg-blue-700">
              Invite All Employees
            </Button>

            <Button onClick={() => fileInputRef.current?.click()} className="bg-blue-600 hover:bg-blue-700">
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
                    { label: "Name", key: "name" },
                    { label: "Email", key: "email" },
                    { label: "Department", key: "department" },
                    { label: "Manager Email", key: "manager_email" },
                  ].map(({ label, key }) => (
                    <div key={key} className="space-y-1">
                      <Label htmlFor={key}>{label}</Label>
                      <Input
                        id={key}
                        value={(newEmp as any)[key] || ""}
                        onChange={(e) =>
                          setNewEmp((s) => ({ ...s, [key]: e.target.value }))
                        }
                      />
                    </div>
                  ))}
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
        <div className="overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="sticky top-0 bg-gray-50 z-10">
              <tr>
                {[
                  "Name",
                  "Email",
                  "Department",
                  // "Peer Selection",
                  // "Review",
                  "Status",
                  "Manager Email",
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
                  <td className="px-4 py-3 whitespace-nowrap">{emp.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{emp.email}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {emp.department}
                  </td>
                  {/* <td className="px-4 py-3 whitespace-nowrap">
                    <a
                      href={`/employee/dashboard/peer-selection`}
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      Selection Link
                    </a>
                  </td> */}
                  {/* <td className="px-4 py-3 whitespace-nowrap">
                    <a
                      href={`/employee/dashboard/review-form`}
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      Review Link
                    </a>
                  </td> */}
                  <td className="px-4 py-3 whitespace-nowrap capitalize">
                    {emp.status || "-"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {emp?.manager_email || "-"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap flex space-x-2">
                    <button onClick={() => onEditClick(idx)}>
                      <Edit2 className="h-5 w-5 text-blue-500 hover:text-blue-700" />
                    </button>
                    <button onClick={() => handleInvite(emp.employee_id)}>
                      <MailPlus className="h-5 w-5 text-blue-500 hover:text-blue-700" />
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
                    colSpan={8}
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
                { label: "Name", key: "name" },
                { label: "Department", key: "department" },
                { label: "Manager Email", key: "manager_email" },
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
                    <SelectItem value="Initial Upload">Initial Upload </SelectItem>
                    <SelectItem value="Invited">Invited </SelectItem>
                    <SelectItem value="Peer Selected">Peer Selected</SelectItem>
                    <SelectItem value="Review Given">Review Given</SelectItem>
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
          <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 max-w-sm min-w-fit mx-auto">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <p className="mt-4 whitespace-nowrap">
              Are you sure you want to delete{" "}
              <strong>
                {deleteIndex !== null ? employees[deleteIndex].name : ""}
              </strong>{" "}
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
