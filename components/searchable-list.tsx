"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"

interface SearchableItem {
  id: string
  title: string
  subtitle?: string
  badge?: string
  amount?: number
}

interface SearchableListProps {
  items: SearchableItem[]
  selectedItems: string[]
  onItemSelect: (id: string, checked: boolean) => void
  placeholder: string
  formatAmount?: (amount: number) => string
}

export function SearchableList({ items, selectedItems, onItemSelect, placeholder, formatAmount }: SearchableListProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.badge && item.badge.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-10 text-right"
          dir="rtl"
        />
      </div>

      <div className="border rounded-lg p-4 max-h-80 overflow-y-auto">
        <div className="space-y-3">
          {filteredItems.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground text-sm">موردی یافت نشد</div>
          ) : (
            filteredItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id={`item-${item.id}`}
                  checked={selectedItems.includes(item.id)}
                  onCheckedChange={(checked) => onItemSelect(item.id, checked as boolean)}
                />
                <div className="flex-1">
                  <label htmlFor={`item-${item.id}`} className="text-sm font-medium cursor-pointer">
                    {item.title}
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    {item.subtitle && <span className="text-xs text-muted-foreground">{item.subtitle}</span>}
                    {item.amount && formatAmount && (
                      <span className="text-xs text-muted-foreground">{formatAmount(item.amount)}</span>
                    )}
                    {item.badge && (
                      <Badge variant="outline" className="text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
