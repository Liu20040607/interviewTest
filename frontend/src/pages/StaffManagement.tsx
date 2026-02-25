import { useState } from "react";
import { SquarePen, Trash, Check, X } from "lucide-react";

const positionOptions = ["工程師", "經理", "技術員"];

type FieldSchema =
  | { name: string; label: string; placeholder: string; type: "input" }
  | {
      name: string;
      label: string;
      placeholder: string;
      type: "select";
      options: string[];
    };

const fieldSchema: FieldSchema[] = [
  {
    name: "employeeId",
    label: "員工編號",
    placeholder: "請輸入員工編號",
    type: "input",
  },
  { name: "name", label: "姓名", placeholder: "請輸入姓名", type: "input" },
  {
    name: "email",
    label: "電子郵件",
    placeholder: "請輸入電子郵件",
    type: "input",
  },
  { name: "phone", label: "電話", placeholder: "請輸入電話", type: "input" },
  {
    name: "lineId",
    label: "LINE ID",
    placeholder: "請輸入 LINE ID",
    type: "input",
  },
  {
    name: "position",
    label: "職位",
    placeholder: "",
    type: "select",
    options: positionOptions,
  },
];

type Staff = {
  id: number;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  lineId: string;
  position: string;
};

const initialStaff: Staff[] = [
  {
    id: 1,
    employeeId: "0001",
    name: "王大明",
    email: "wang@gmail.com",
    phone: "0900001001",
    lineId: "wang_dm",
    position: "工程師",
  },
  {
    id: 2,
    employeeId: "0002",
    name: "林小芳",
    email: "lin@gmail.com",
    phone: "0900002002",
    lineId: "lin_xf",
    position: "經理",
  },
  {
    id: 3,
    employeeId: "0003",
    name: "陳建志",
    email: "chen@gmail.com",
    phone: "0900003003",
    lineId: "chen_jz",
    position: "技術員",
  },
  {
    id: 4,
    employeeId: "0004",
    name: "張美玲",
    email: "zhang@gmail.com",
    phone: "0900004004",
    lineId: "zhang_ml",
    position: "工程師",
  },
  {
    id: 5,
    employeeId: "0005",
    name: "李志偉",
    email: "li@gmail.com",
    phone: "0900005005",
    lineId: "li_zw",
    position: "經理",
  },
  {
    id: 6,
    employeeId: "0006",
    name: "黃淑惠",
    email: "huang@gmail.com",
    phone: "0900006006",
    lineId: "huang_sh",
    position: "技術員",
  },
  {
    id: 7,
    employeeId: "0007",
    name: "吳俊賢",
    email: "wu@gmail.com",
    phone: "0900007007",
    lineId: "wu_jx",
    position: "工程師",
  },
  {
    id: 8,
    employeeId: "0008",
    name: "劉雅婷",
    email: "liu@gmail.com",
    phone: "0900008008",
    lineId: "liu_yt",
    position: "技術員",
  },
  {
    id: 9,
    employeeId: "0009",
    name: "蔡宗翰",
    email: "tsai@gmail.com",
    phone: "0900009009",
    lineId: "tsai_zh",
    position: "工程師",
  },
  {
    id: 10,
    employeeId: "0010",
    name: "楊佳穎",
    email: "yang@gmail.com",
    phone: "0900010010",
    lineId: "yang_jy",
    position: "經理",
  },
  {
    id: 11,
    employeeId: "0011",
    name: "許文豪",
    email: "hsu@gmail.com",
    phone: "0900011011",
    lineId: "hsu_wh",
    position: "技術員",
  },
  {
    id: 12,
    employeeId: "0012",
    name: "鄭雨柔",
    email: "zheng@gmail.com",
    phone: "0900012012",
    lineId: "zheng_yr",
    position: "工程師",
  },
  {
    id: 13,
    employeeId: "0013",
    name: "謝博凱",
    email: "hsieh@gmail.com",
    phone: "0900013013",
    lineId: "hsieh_bk",
    position: "技術員",
  },
  {
    id: 14,
    employeeId: "0014",
    name: "周靜怡",
    email: "zhou@gmail.com",
    phone: "0900014014",
    lineId: "zhou_jy",
    position: "經理",
  },
  {
    id: 15,
    employeeId: "0015",
    name: "洪冠宇",
    email: "hong@gmail.com",
    phone: "0900015015",
    lineId: "hong_gy",
    position: "工程師",
  },
  {
    id: 16,
    employeeId: "0016",
    name: "簡雅文",
    email: "jian@gmail.com",
    phone: "0900016016",
    lineId: "jian_yw",
    position: "技術員",
  },
  {
    id: 17,
    employeeId: "0017",
    name: "彭志豪",
    email: "peng@gmail.com",
    phone: "0900017017",
    lineId: "peng_zh",
    position: "工程師",
  },
  {
    id: 18,
    employeeId: "0018",
    name: "曾淑娟",
    email: "zeng@gmail.com",
    phone: "0900018018",
    lineId: "zeng_sj",
    position: "經理",
  },
  {
    id: 19,
    employeeId: "0019",
    name: "賴建宏",
    email: "lai@gmail.com",
    phone: "0900019019",
    lineId: "lai_jh",
    position: "技術員",
  },
  {
    id: 20,
    employeeId: "0020",
    name: "方宜庭",
    email: "fang@gmail.com",
    phone: "0900020020",
    lineId: "fang_yt",
    position: "工程師",
  },
];

const PAGE_SIZE = 10;

function StaffManagement() {
  const [form, setForm] = useState({
    employeeId: "",
    name: "",
    email: "",
    phone: "",
    lineId: "",
    position: "",
  });
  const [staffList, setStaffList] = useState<Staff[]>(initialStaff);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Staff | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredList = staffList.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.employeeId.includes(searchQuery),
  );
  const totalPages = Math.ceil(filteredList.length / PAGE_SIZE);
  const pagedData = filteredList.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const newStaff: Staff = {
      id: Date.now(),
      ...form,
    };
    setStaffList([...staffList, newStaff]);
    setForm({
      employeeId: "",
      name: "",
      email: "",
      phone: "",
      lineId: "",
      position: "",
    });
    setCurrentPage(Math.ceil((staffList.length + 1) / PAGE_SIZE));
  };

  const handleDelete = (id: number) => {
    setStaffList(staffList.filter((s) => s.id !== id));
  };

  const handleEdit = (staff: Staff) => {
    setEditingId(staff.id);
    setEditForm({ ...staff });
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    if (!editForm) return;
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = () => {
    if (!editForm) return;
    setStaffList(staffList.map((s) => (s.id === editingId ? editForm : s)));
    setEditingId(null);
    setEditForm(null);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditForm(null);
  };

  return (
    <div className="p-8 flex flex-col gap-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold mb-4">新增人員</h2>

        <div className="grid grid-cols-3 gap-4">
          {fieldSchema.map((field) => (
            <div key={field.name} className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">{field.label}</label>
              {field.type === "select" ? (
                <select
                  name={field.name}
                  value={form[field.name as keyof typeof form]}
                  onChange={handleChange}
                  className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  <option value="">請選擇{field.label}</option>
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  name={field.name}
                  value={form[field.name as keyof typeof form]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-center">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
          >
            新增
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">人員列表</h2>
        </div>

        <div className="mt-4 flex justify-end items-center gap-2">
          <input
            type="text"
            placeholder="搜尋名字或編號"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm border rounded disabled:opacity-40 hover:bg-gray-100"
          >
            上一頁
          </button>
          <span className="text-sm text-gray-500">
            第 {currentPage} / {totalPages} 頁
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm border rounded disabled:opacity-40 hover:bg-gray-100"
          >
            下一頁
          </button>
        </div>

        <div className="overflow-y-auto max-h-80">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 text-left divide-x divide-gray-200">
                <th className="py-2 px-3">#</th>
                {fieldSchema.map((col) => (
                  <th key={col.name} className="py-2 px-3">
                    {col.label}
                  </th>
                ))}
                <th className="py-2 px-3">操作</th>
              </tr>
            </thead>
            <tbody>
              {pagedData.map((staff, index) => {
                const isEditing = editingId === staff.id;
                const inputCls =
                  "border border-gray-300 rounded px-2 py-1 text-sm w-full focus:outline-none focus:ring-1 focus:ring-green-400";
                return (
                  <tr
                    key={staff.id}
                    className="border-b border-gray-100 hover:bg-gray-50 divide-x divide-gray-200"
                  >
                    <td className="py-2 px-3 text-gray-400">
                      {(currentPage - 1) * PAGE_SIZE + index + 1}
                    </td>
                    {fieldSchema.map((col) => (
                      <td key={col.name} className="py-2 px-3">
                        {isEditing ? (
                          col.type === "select" ? (
                            <select
                              name={col.name}
                              value={
                                editForm![col.name as keyof Staff] as string
                              }
                              onChange={handleEditChange}
                              className={inputCls}
                            >
                              {col.options.map((p) => (
                                <option key={p} value={p}>
                                  {p}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              name={col.name}
                              value={
                                editForm![col.name as keyof Staff] as string
                              }
                              onChange={handleEditChange}
                              className={inputCls}
                            />
                          )
                        ) : (
                          staff[col.name as keyof Staff]
                        )}
                      </td>
                    ))}
                    <td className="py-2 px-3 flex gap-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={handleEditSave}
                            className="text-green-600 hover:text-green-800"
                          >
                            <Check size={15} />
                          </button>
                          <button
                            onClick={handleEditCancel}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X size={15} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleEdit(staff)}>
                            <SquarePen size={15} />
                          </button>
                          <button onClick={() => handleDelete(staff.id)}>
                            <Trash size={15} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default StaffManagement;
