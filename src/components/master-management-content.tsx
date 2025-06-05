"use client"

import { useState } from "react"
import {
  Search,
  Plus,
  Download,
  Upload,
  History,
  Edit,
  Trash2,
  Filter,
  CheckSquare,
  MoreHorizontal,
  FileText,
  AlertTriangle,
  Check,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// 勘定科目マスタのサンプルデータ
const accountItems = [
  { id: "A001", name: "人件費", category: "販管費", active: true },
  { id: "A002", name: "広告宣伝費", category: "販管費", active: true },
  { id: "A003", name: "旅費交通費", category: "販管費", active: true },
  { id: "A004", name: "通信費", category: "販管費", active: true },
  { id: "A005", name: "消耗品費", category: "販管費", active: true },
  { id: "A006", name: "賃借料", category: "販管費", active: true },
  { id: "A007", name: "水道光熱費", category: "販管費", active: true },
  { id: "A008", name: "保険料", category: "販管費", active: true },
  { id: "A009", name: "租税公課", category: "販管費", active: true },
  { id: "A010", name: "支払手数料", category: "販管費", active: true },
  { id: "A011", name: "減価償却費", category: "販管費", active: true },
  { id: "A012", name: "その他販管費", category: "販管費", active: true },
  { id: "A013", name: "材料費", category: "売上原価", active: true },
  { id: "A014", name: "外注費", category: "売上原価", active: true },
  { id: "A015", name: "労務費", category: "売上原価", active: true },
  { id: "A016", name: "製造経費", category: "売上原価", active: true },
  { id: "A017", name: "減価償却費", category: "売上原価", active: true },
  { id: "A018", name: "その他原価", category: "売上原価", active: true },
  { id: "A019", name: "旧勘定科目", category: "販管費", active: false },
]

// 取引先マスタのサンプルデータ
const supplierItems = [
  { id: "S001", name: "株式会社A", freeeSubject: "株式会社A", synced: true, lastSynced: "2024-10-15 10:30" },
  { id: "S002", name: "株式会社B", freeeSubject: "株式会社B", synced: true, lastSynced: "2024-10-15 10:30" },
  { id: "S003", name: "株式会社C", freeeSubject: "株式会社C", synced: true, lastSynced: "2024-10-15 10:30" },
  { id: "S004", name: "株式会社D", freeeSubject: "株式会社D", synced: true, lastSynced: "2024-10-15 10:30" },
  { id: "S005", name: "株式会社E", freeeSubject: "株式会社E", synced: false, lastSynced: "-" },
  { id: "S006", name: "個人F", freeeSubject: "個人F", synced: true, lastSynced: "2024-10-15 10:30" },
  { id: "S007", name: "個人G", freeeSubject: "個人G", synced: true, lastSynced: "2024-10-15 10:30" },
  { id: "S008", name: "株式会社H", freeeSubject: "株式会社H", synced: false, lastSynced: "-" },
  { id: "S009", name: "株式会社I", freeeSubject: "株式会社I", synced: true, lastSynced: "2024-10-15 10:30" },
  { id: "S010", name: "株式会社J", freeeSubject: "株式会社J", synced: true, lastSynced: "2024-10-15 10:30" },
]

// 変動要因マスタのサンプルデータ
const factorItems = [
  { id: "F001", name: "社員数", unit: "人", description: "月末時点の正社員数" },
  { id: "F002", name: "売上高", unit: "万円", description: "月次売上高" },
  { id: "F003", name: "稼働日数", unit: "日", description: "営業日数" },
  { id: "F004", name: "顧客数", unit: "社", description: "取引先企業数" },
]

// ユーザーマスタのサンプルデータ
const userItems = [
  { id: "U001", name: "田中 太郎", role: "管理者", lastLogin: "2024-10-15 09:15" },
  { id: "U002", name: "鈴木 花子", role: "一般ユーザー", lastLogin: "2024-10-14 17:30" },
  { id: "U003", name: "佐藤 次郎", role: "閲覧者", lastLogin: "2024-10-13 11:45" },
  { id: "U004", name: "山田 三郎", role: "一般ユーザー", lastLogin: "2024-10-15 08:20" },
  { id: "U005", name: "伊藤 四郎", role: "一般ユーザー", lastLogin: "2024-10-12 16:10" },
]

// 変更履歴のサンプルデータ
const historyItems = [
  { id: "H001", date: "2024-10-15 14:30", user: "田中 太郎", action: "勘定科目「その他販管費」を追加" },
  { id: "H002", date: "2024-10-15 11:20", user: "鈴木 花子", action: "取引先「株式会社E」を追加" },
  { id: "H003", date: "2024-10-14 16:45", user: "田中 太郎", action: "勘定科目「旧勘定科目」を無効化" },
  { id: "H004", date: "2024-10-14 10:30", user: "佐藤 次郎", action: "変動要因「顧客数」を追加" },
  { id: "H005", date: "2024-10-13 09:15", user: "田中 太郎", action: "ユーザー「伊藤 四郎」を追加" },
]

export function MasterManagementContent() {
  const [activeTab, setActiveTab] = useState("account")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showHistoryDialog, setShowHistoryDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [editItem, setEditItem] = useState<any>(null)

  // 検索フィルター
  const filteredAccountItems = accountItems.filter(
    (item) =>
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredSupplierItems = supplierItems.filter(
    (item) =>
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.freeeSubject.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredFactorItems = factorItems.filter(
    (item) =>
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredUserItems = userItems.filter(
    (item) =>
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // ページネーション
  const getPageItems = (items: any[]) => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return items.slice(startIndex, startIndex + itemsPerPage)
  }

  const pageAccountItems = getPageItems(filteredAccountItems)
  const pageSupplierItems = getPageItems(filteredSupplierItems)
  const pageFactorItems = getPageItems(filteredFactorItems)
  const pageUserItems = getPageItems(filteredUserItems)

  const totalPages = (items: any[]) => Math.ceil(items.length / itemsPerPage)

  // 選択アイテムの切り替え
  const toggleSelectItem = (id: string) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  // 全選択/解除
  const toggleSelectAll = (items: any[]) => {
    if (selectedItems.length === items.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(items.map((item) => item.id))
    }
  }

  // 編集ダイアログを開く
  const openEditDialog = (item: any) => {
    setEditItem(item)
    setShowEditDialog(true)
  }

  // 新規追加ダイアログを開く
  const openNewDialog = () => {
    setEditItem(null)
    setShowEditDialog(true)
  }

  // 一括削除
  const handleBulkDelete = () => {
    console.log("一括削除:", selectedItems)
    setShowDeleteDialog(false)
    setSelectedItems([])
  }

  // データインポート
  const handleImport = () => {
    console.log("データインポート")
  }

  // データエクスポート
  const handleExport = () => {
    console.log("データエクスポート")
  }

  // freee連携
  const handleFreeeSync = () => {
    console.log("freee連携")
  }

  return (
    <div className="flex flex-col space-y-6">
      {/* ページヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">マスタ管理</h2>
          <p className="text-sm text-gray-500">各種マスタデータの管理を行います</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowHistoryDialog(true)}>
            <History className="h-4 w-4 mr-2" />
            変更履歴
          </Button>
        </div>
      </div>

      {/* マスタ選択タブ */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="account">勘定科目マスタ</TabsTrigger>
          <TabsTrigger value="supplier">取引先マスタ</TabsTrigger>
          <TabsTrigger value="factor">変動要因マスタ</TabsTrigger>
          <TabsTrigger value="user">ユーザーマスタ</TabsTrigger>
        </TabsList>

        {/* 勘定科目マスタ */}
        <TabsContent value="account">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>勘定科目マスタ</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleExport}>
                    <Download className="h-4 w-4 mr-2" />
                    エクスポート
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleImport}>
                    <Upload className="h-4 w-4 mr-2" />
                    インポート
                  </Button>
                  <Button size="sm" onClick={openNewDialog}>
                    <Plus className="h-4 w-4 mr-2" />
                    新規追加
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* 検索・フィルター */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="検索..."
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        フィルター
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>区分</DropdownMenuLabel>
                      <DropdownMenuItem>全て</DropdownMenuItem>
                      <DropdownMenuItem>販管費</DropdownMenuItem>
                      <DropdownMenuItem>売上原価</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>状態</DropdownMenuLabel>
                      <DropdownMenuItem>全て</DropdownMenuItem>
                      <DropdownMenuItem>有効</DropdownMenuItem>
                      <DropdownMenuItem>無効</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* 一括操作 */}
                {selectedItems.length > 0 && (
                  <div className="flex items-center justify-between bg-blue-50 p-2 rounded-md">
                    <span className="text-sm text-blue-700">{selectedItems.length}件選択中</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-blue-700 border-blue-200 hover:bg-blue-100"
                      >
                        <CheckSquare className="h-3.5 w-3.5 mr-1" />
                        一括無効化
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-red-700 border-red-200 hover:bg-red-100"
                        onClick={() => setShowDeleteDialog(true)}
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        一括削除
                      </Button>
                    </div>
                  </div>
                )}

                {/* テーブル */}
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox
                            checked={selectedItems.length > 0 && selectedItems.length === filteredAccountItems.length}
                            onCheckedChange={() => toggleSelectAll(filteredAccountItems)}
                          />
                        </TableHead>
                        <TableHead>科目コード</TableHead>
                        <TableHead>科目名</TableHead>
                        <TableHead>区分</TableHead>
                        <TableHead>状態</TableHead>
                        <TableHead className="w-24 text-right">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pageAccountItems.length > 0 ? (
                        pageAccountItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <Checkbox
                                checked={selectedItems.includes(item.id)}
                                onCheckedChange={() => toggleSelectItem(item.id)}
                              />
                            </TableCell>
                            <TableCell>{item.id}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.category}</TableCell>
                            <TableCell>
                              {item.active ? (
                                <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                                  有効
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-gray-100 text-gray-500 hover:bg-gray-100">
                                  無効
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => openEditDialog(item)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    編集
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    削除
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  {item.active ? (
                                    <DropdownMenuItem>
                                      <X className="h-4 w-4 mr-2" />
                                      無効化
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem>
                                      <Check className="h-4 w-4 mr-2" />
                                      有効化
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                            データがありません
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* ページネーション */}
                {filteredAccountItems.length > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      全{filteredAccountItems.length}件中 {(currentPage - 1) * itemsPerPage + 1}-
                      {Math.min(currentPage * itemsPerPage, filteredAccountItems.length)}件表示
                    </div>
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              if (currentPage > 1) setCurrentPage(currentPage - 1)
                            }}
                          />
                        </PaginationItem>
                        {Array.from({ length: totalPages(filteredAccountItems) }).map((_, i) => (
                          <PaginationItem key={i}>
                            <PaginationLink
                              href="#"
                              isActive={currentPage === i + 1}
                              onClick={(e) => {
                                e.preventDefault()
                                setCurrentPage(i + 1)
                              }}
                            >
                              {i + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              if (currentPage < totalPages(filteredAccountItems)) setCurrentPage(currentPage + 1)
                            }}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 取引先マスタ */}
        <TabsContent value="supplier">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>取引先マスタ</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleFreeeSync}>
                    <Download className="h-4 w-4 mr-2" />
                    freee連携
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleExport}>
                    <Download className="h-4 w-4 mr-2" />
                    エクスポート
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleImport}>
                    <Upload className="h-4 w-4 mr-2" />
                    インポート
                  </Button>
                  <Button size="sm" onClick={openNewDialog}>
                    <Plus className="h-4 w-4 mr-2" />
                    新規追加
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* 検索・フィルター */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="検索..."
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        フィルター
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>連携状況</DropdownMenuLabel>
                      <DropdownMenuItem>全て</DropdownMenuItem>
                      <DropdownMenuItem>連携済み</DropdownMenuItem>
                      <DropdownMenuItem>未連携</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* 一括操作 */}
                {selectedItems.length > 0 && (
                  <div className="flex items-center justify-between bg-blue-50 p-2 rounded-md">
                    <span className="text-sm text-blue-700">{selectedItems.length}件選択中</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-blue-700 border-blue-200 hover:bg-blue-100"
                      >
                        <Download className="h-3.5 w-3.5 mr-1" />
                        一括連携
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-red-700 border-red-200 hover:bg-red-100"
                        onClick={() => setShowDeleteDialog(true)}
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        一括削除
                      </Button>
                    </div>
                  </div>
                )}

                {/* テーブル */}
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox
                            checked={selectedItems.length > 0 && selectedItems.length === filteredSupplierItems.length}
                            onCheckedChange={() => toggleSelectAll(filteredSupplierItems)}
                          />
                        </TableHead>
                        <TableHead>取引先コード</TableHead>
                        <TableHead>取引先名</TableHead>
                        <TableHead>freee補助科目名</TableHead>
                        <TableHead>連携状況</TableHead>
                        <TableHead>最終連携日時</TableHead>
                        <TableHead className="w-24 text-right">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pageSupplierItems.length > 0 ? (
                        pageSupplierItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <Checkbox
                                checked={selectedItems.includes(item.id)}
                                onCheckedChange={() => toggleSelectItem(item.id)}
                              />
                            </TableCell>
                            <TableCell>{item.id}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.freeeSubject}</TableCell>
                            <TableCell>
                              {item.synced ? (
                                <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                                  連携済み
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50">
                                  未連携
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>{item.lastSynced}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => openEditDialog(item)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    編集
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    削除
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  {!item.synced && (
                                    <DropdownMenuItem>
                                      <Download className="h-4 w-4 mr-2" />
                                      freeeと連携
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                            データがありません
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* ページネーション */}
                {filteredSupplierItems.length > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      全{filteredSupplierItems.length}件中 {(currentPage - 1) * itemsPerPage + 1}-
                      {Math.min(currentPage * itemsPerPage, filteredSupplierItems.length)}件表示
                    </div>
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              if (currentPage > 1) setCurrentPage(currentPage - 1)
                            }}
                          />
                        </PaginationItem>
                        {Array.from({ length: totalPages(filteredSupplierItems) }).map((_, i) => (
                          <PaginationItem key={i}>
                            <PaginationLink
                              href="#"
                              isActive={currentPage === i + 1}
                              onClick={(e) => {
                                e.preventDefault()
                                setCurrentPage(i + 1)
                              }}
                            >
                              {i + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              if (currentPage < totalPages(filteredSupplierItems)) setCurrentPage(currentPage + 1)
                            }}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 変動要因マスタ */}
        <TabsContent value="factor">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>変動要因マスタ</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleExport}>
                    <Download className="h-4 w-4 mr-2" />
                    エクスポート
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleImport}>
                    <Upload className="h-4 w-4 mr-2" />
                    インポート
                  </Button>
                  <Button size="sm" onClick={openNewDialog}>
                    <Plus className="h-4 w-4 mr-2" />
                    新規追加
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* 検索・フィルター */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="検索..."
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {/* 一括操作 */}
                {selectedItems.length > 0 && (
                  <div className="flex items-center justify-between bg-blue-50 p-2 rounded-md">
                    <span className="text-sm text-blue-700">{selectedItems.length}件選択中</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-red-700 border-red-200 hover:bg-red-100"
                        onClick={() => setShowDeleteDialog(true)}
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        一括削除
                      </Button>
                    </div>
                  </div>
                )}

                {/* テーブル */}
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox
                            checked={selectedItems.length > 0 && selectedItems.length === filteredFactorItems.length}
                            onCheckedChange={() => toggleSelectAll(filteredFactorItems)}
                          />
                        </TableHead>
                        <TableHead>要因ID</TableHead>
                        <TableHead>要因名</TableHead>
                        <TableHead>単位</TableHead>
                        <TableHead>説明</TableHead>
                        <TableHead className="w-24 text-right">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pageFactorItems.length > 0 ? (
                        pageFactorItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <Checkbox
                                checked={selectedItems.includes(item.id)}
                                onCheckedChange={() => toggleSelectItem(item.id)}
                              />
                            </TableCell>
                            <TableCell>{item.id}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.unit}</TableCell>
                            <TableCell>{item.description}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => openEditDialog(item)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    編集
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    削除
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>
                                    <FileText className="h-4 w-4 mr-2" />
                                    月別予測値設定
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                            データがありません
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* ページネーション */}
                {filteredFactorItems.length > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      全{filteredFactorItems.length}件中 {(currentPage - 1) * itemsPerPage + 1}-
                      {Math.min(currentPage * itemsPerPage, filteredFactorItems.length)}件表示
                    </div>
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              if (currentPage > 1) setCurrentPage(currentPage - 1)
                            }}
                          />
                        </PaginationItem>
                        {Array.from({ length: totalPages(filteredFactorItems) }).map((_, i) => (
                          <PaginationItem key={i}>
                            <PaginationLink
                              href="#"
                              isActive={currentPage === i + 1}
                              onClick={(e) => {
                                e.preventDefault()
                                setCurrentPage(i + 1)
                              }}
                            >
                              {i + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              if (currentPage < totalPages(filteredFactorItems)) setCurrentPage(currentPage + 1)
                            }}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ユーザーマスタ */}
        <TabsContent value="user">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>ユーザーマスタ</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleExport}>
                    <Download className="h-4 w-4 mr-2" />
                    エクスポート
                  </Button>
                  <Button size="sm" onClick={openNewDialog}>
                    <Plus className="h-4 w-4 mr-2" />
                    新規追加
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* 検索・フィルター */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="検索..."
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        フィルター
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>役割</DropdownMenuLabel>
                      <DropdownMenuItem>全て</DropdownMenuItem>
                      <DropdownMenuItem>管理者</DropdownMenuItem>
                      <DropdownMenuItem>一般ユーザー</DropdownMenuItem>
                      <DropdownMenuItem>閲覧者</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* 一括操作 */}
                {selectedItems.length > 0 && (
                  <div className="flex items-center justify-between bg-blue-50 p-2 rounded-md">
                    <span className="text-sm text-blue-700">{selectedItems.length}件選択中</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-red-700 border-red-200 hover:bg-red-100"
                        onClick={() => setShowDeleteDialog(true)}
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        一括削除
                      </Button>
                    </div>
                  </div>
                )}

                {/* テーブル */}
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox
                            checked={selectedItems.length > 0 && selectedItems.length === filteredUserItems.length}
                            onCheckedChange={() => toggleSelectAll(filteredUserItems)}
                          />
                        </TableHead>
                        <TableHead>ユーザーID</TableHead>
                        <TableHead>氏名</TableHead>
                        <TableHead>役割</TableHead>
                        <TableHead>最終ログイン</TableHead>
                        <TableHead className="w-24 text-right">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pageUserItems.length > 0 ? (
                        pageUserItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <Checkbox
                                checked={selectedItems.includes(item.id)}
                                onCheckedChange={() => toggleSelectItem(item.id)}
                              />
                            </TableCell>
                            <TableCell>{item.id}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  item.role === "管理者"
                                    ? "bg-purple-50 text-purple-700 hover:bg-purple-50"
                                    : item.role === "一般ユーザー"
                                      ? "bg-blue-50 text-blue-700 hover:bg-blue-50"
                                      : "bg-gray-100 text-gray-700 hover:bg-gray-100"
                                }
                              >
                                {item.role}
                              </Badge>
                            </TableCell>
                            <TableCell>{item.lastLogin}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => openEditDialog(item)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    編集
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    削除
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>
                                    <FileText className="h-4 w-4 mr-2" />
                                    権限設定
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                            データがありません
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* ページネーション */}
                {filteredUserItems.length > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      全{filteredUserItems.length}件中 {(currentPage - 1) * itemsPerPage + 1}-
                      {Math.min(currentPage * itemsPerPage, filteredUserItems.length)}件表示
                    </div>
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              if (currentPage > 1) setCurrentPage(currentPage - 1)
                            }}
                          />
                        </PaginationItem>
                        {Array.from({ length: totalPages(filteredUserItems) }).map((_, i) => (
                          <PaginationItem key={i}>
                            <PaginationLink
                              href="#"
                              isActive={currentPage === i + 1}
                              onClick={(e) => {
                                e.preventDefault()
                                setCurrentPage(i + 1)
                              }}
                            >
                              {i + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              if (currentPage < totalPages(filteredUserItems)) setCurrentPage(currentPage + 1)
                            }}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 編集ダイアログ */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editItem ? "項目の編集" : "新規項目の追加"}</DialogTitle>
            <DialogDescription>
              {activeTab === "account"
                ? "勘定科目の情報を入力してください"
                : activeTab === "supplier"
                  ? "取引先の情報を入力してください"
                  : activeTab === "factor"
                    ? "変動要因の情報を入力してください"
                    : "ユーザーの情報を入力してください"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {activeTab === "account" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="account-code">科目コード</Label>
                  <Input id="account-code" defaultValue={editItem?.id || ""} placeholder="例: A001" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account-name">科目名</Label>
                  <Input id="account-name" defaultValue={editItem?.name || ""} placeholder="例: 人件費" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account-category">区分</Label>
                  <Select defaultValue={editItem?.category || "販管費"}>
                    <SelectTrigger id="account-category">
                      <SelectValue placeholder="区分を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="販管費">販管費</SelectItem>
                      <SelectItem value="売上原価">売上原価</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="account-active" defaultChecked={editItem?.active !== false} />
                  <Label htmlFor="account-active">有効</Label>
                </div>
              </>
            )}

            {activeTab === "supplier" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="supplier-code">取引先コード</Label>
                  <Input id="supplier-code" defaultValue={editItem?.id || ""} placeholder="例: S001" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplier-name">取引先名</Label>
                  <Input id="supplier-name" defaultValue={editItem?.name || ""} placeholder="例: 株式会社A" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplier-freee">freee補助科目名</Label>
                  <Input id="supplier-freee" defaultValue={editItem?.freeeSubject || ""} placeholder="例: 株式会社A" />
                </div>
              </>
            )}

            {activeTab === "factor" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="factor-id">要因ID</Label>
                  <Input id="factor-id" defaultValue={editItem?.id || ""} placeholder="例: F001" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="factor-name">要因名</Label>
                  <Input id="factor-name" defaultValue={editItem?.name || ""} placeholder="例: 社員数" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="factor-unit">単位</Label>
                  <Input id="factor-unit" defaultValue={editItem?.unit || ""} placeholder="例: 人" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="factor-description">説明</Label>
                  <Input
                    id="factor-description"
                    defaultValue={editItem?.description || ""}
                    placeholder="例: 月末時点の正社員数"
                  />
                </div>
              </>
            )}

            {activeTab === "user" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="user-id">ユーザーID</Label>
                  <Input id="user-id" defaultValue={editItem?.id || ""} placeholder="例: U001" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-name">氏名</Label>
                  <Input id="user-name" defaultValue={editItem?.name || ""} placeholder="例: 田中 太郎" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-role">役割</Label>
                  <Select defaultValue={editItem?.role || "一般ユーザー"}>
                    <SelectTrigger id="user-role">
                      <SelectValue placeholder="役割を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="管理者">管理者</SelectItem>
                      <SelectItem value="一般ユーザー">一般ユーザー</SelectItem>
                      <SelectItem value="閲覧者">閲覧者</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              キャンセル
            </Button>
            <Button onClick={() => setShowEditDialog(false)}>{editItem ? "更新" : "追加"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 削除確認ダイアログ */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              削除の確認
            </AlertDialogTitle>
            <AlertDialogDescription>
              選択した{selectedItems.length}件のデータを削除します。この操作は元に戻せません。
              <br />
              本当に削除しますか？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkDelete} className="bg-red-600 hover:bg-red-700">
              削除する
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 変更履歴ダイアログ */}
      <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>変更履歴</DialogTitle>
            <DialogDescription>マスタデータの変更履歴を表示します</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="max-h-[400px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>日時</TableHead>
                    <TableHead>ユーザー</TableHead>
                    <TableHead>操作内容</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historyItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="text-xs">{item.date}</TableCell>
                      <TableCell className="text-xs">{item.user}</TableCell>
                      <TableCell className="text-xs">{item.action}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowHistoryDialog(false)}>閉じる</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
