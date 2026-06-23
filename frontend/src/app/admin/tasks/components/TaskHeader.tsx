'use client'
import { TaskAllocation } from '@/components/shared/task-allocation'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import React from 'react'

export default function TaskHeader() {
  return (
     <div className="bg-white/80 my-5 py-2 px-4 md:px-6 flex flex-col md:flex-row gap-4 justify-between items-center">
      <div className="flex items-center gap-3 py-3">
        <Check className="size-10 bg-primary rounded-full p-2 text-white" />
        <div>
          <h1 className="text-base md:text-lg xl:text-xl font-semibold">
            Tasks Overview
          </h1>
          <p className="text-muted-foreground text-xs md:text-sm xl:text-base">
            Manage and monitor your tasks effectively.
          </p>
        </div>
      </div>
      <div className="hidden md:block w-full md:w-auto">
        <TaskAllocation
          teams={[
            { id: "1", name: "Team Alpha" },
            { id: "2", name: "Team Beta" },
          ]}
          staffs={[
            { id: "1", name: "John Doe" },
            { id: "2", name: "Jane Smith" },
            { id: "3", name: "Bob Wilson" },
          ]}
          onSubmit={(data) => console.log("Task allocated:", data)}
        >
          <Button>Task Allocation</Button>
        </TaskAllocation>
      </div>
    </div>
  )
}
