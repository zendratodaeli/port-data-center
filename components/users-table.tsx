"use client";

import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import * as XLSX from "xlsx";
import { User } from "@prisma/client";
import { UserProps, createBulkUsers } from "@/actions/users";

interface UsersTable {
  users: User[];
}

const UsersTable = ({ users }: UsersTable) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [jsonData, setJsonData] = useState("");

  

  async function saveData() {
    if (file) {
      setLoading(true);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = e.target?.result;
        if (data) {
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const workSheet = workbook.Sheets[sheetName];
          const json: UserProps[] = XLSX.utils.sheet_to_json(workSheet);

          // Save to Database
          try {
            await createBulkUsers(json);
          } catch (error) {
            console.error("Error creating bulk users:", error);
          } finally {
            setLoading(false);
          }
        }
      };
      reader.readAsBinaryString(file);
    }
  }

  return (
    <div className="flex items-center gap-8">
      <div>
        <label htmlFor="file_input">Upload File</label>
        <Input
          type="file"
          className="w-full"
          id="file_input"
          accept=".xls,.xlsx"
          onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
        />
        <Button onClick={saveData} className="bg-purple-400">
          Save Data
        </Button>
        <Button variant={"destructive"} onClick={() => setJsonData("")}>Clear Data</Button>
      </div>


      {loading ? (
        <p>Saving Data! Please wait...</p>
      ) : (
        <div>
          {users && users.length > 0 && (
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">Name</th>
                    <th scope="col" className="px-6 py-3">Age</th>
                    <th scope="col" className="px-6 py-3">City</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <td className="px-6 py-4">{user.name}</td>
                      <td className="px-6 py-4">{user.age}</td>
                      <td className="px-6 py-4">{user.city}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UsersTable;
