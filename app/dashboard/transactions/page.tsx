"use client"

import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

const transactionsData = [
  {
    hash: "0x8a7d...3f9b",
    date: new Date("2023-06-01"),
    amount: 45000,
    contractId: "SC-001",
    status: "success",
  },
  {
    hash: "0x3b2c...7e1a",
    date: new Date("2023-06-03"),
    amount: 78000,
    contractId: "SC-002",
    status: "success",
  },
  {
    hash: "0x6f4d...2c8b",
    date: new Date("2023-06-05"),
    amount: 32000,
    contractId: "SC-003",
    status: "pending",
  },
  {
    hash: "0x1e9a...5d7c",
    date: new Date("2023-06-08"),
    amount: 56000,
    contractId: "SC-004",
    status: "success",
  },
  {
    hash: "0x7b3d...9f2e",
    date: new Date("2023-06-10"),
    amount: 92000,
    contractId: "SC-005",
    status: "success",
  },
  {
    hash: "0x4c8e...1a6b",
    date: new Date("2023-06-12"),
    amount: 65000,
    contractId: "SC-006",
    status: "failed",
  },
  {
    hash: "0x2d5f...8c3a",
    date: new Date("2023-06-15"),
    amount: 48000,
    contractId: "SC-007",
    status: "success",
  },
  {
    hash: "0x9e1b...4d7a",
    date: new Date("2023-06-18"),
    amount: 72000,
    contractId: "SC-008",
    status: "success",
  },
]

export default function TransactionsPage() {
  const [date, setDate] = useState<Date>()
  const [status, setStatus] = useState<string>("all")

  // Filter transactions based on selected filters
  const filteredTransactions = transactionsData.filter((transaction) => {
    // Filter by status
    if (status !== "all" && transaction.status !== status) {
      return false
    }

    // Filter by date
    if (date && format(transaction.date, "yyyy-MM-dd") !== format(date, "yyyy-MM-dd")) {
      return false
    }

    return true
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Transaction History</h2>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Transactions</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          {(date || status !== "all") && (
            <Button
              variant="ghost"
              onClick={() => {
                setDate(undefined)
                setStatus("all")
              }}
            >
              Reset
            </Button>
          )}
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction Hash</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount (₹)</TableHead>
              <TableHead>Contract ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* TODO: Connect to blockchain/interact.js to fetch transaction history */}
            {/* 1. Use MetaMask to connect to the blockchain */}
            {/* 2. Get transaction data from smart contracts */}
            {/* 3. Apply filters based on date and status */}
            {filteredTransactions.map((transaction) => (
              <TableRow key={transaction.hash}>
                <TableCell className="font-medium">{transaction.hash}</TableCell>
                <TableCell>{format(transaction.date, "PPP")}</TableCell>
                <TableCell>₹{transaction.amount.toLocaleString()}</TableCell>
                <TableCell>{transaction.contractId}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      transaction.status === "success"
                        ? "default"
                        : transaction.status === "pending"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

