"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { UserData } from "@/types/utils/user-types"
import { AlertTriangle, Trash2 } from "lucide-react"
import { useState } from "react"
import { router } from "@inertiajs/react"
import { toast } from "sonner"

interface DeleteUserModalProps {
  user: UserData | null
  isOpen: boolean
  onClose: () => void
  onConfirm: (userId: number) => void
}

export function DeleteUserModal({ user, isOpen, onClose, onConfirm }: DeleteUserModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirm = () => {
    setIsDeleting(true)
    if (user) {
      router.delete(route('admin.deleteUser', user.id), {
        onSuccess: () => {
          onConfirm(user.id)
          console.log(user.id)
          toast.info("User is deleted from the system")
        },
        onError: (errors) => {
          console.log('Error deleting user', errors)
          toast.error("Error occured. Try again.")
        }
      })
 
      setIsDeleting(false)
      onClose()
    
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">Delete User</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-1">
                This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-sm text-red-800 dark:text-red-200">
              Are you sure you want to delete <strong>{user?.name}</strong>? This will permanently remove their account
              and all associated data.
            </p>
            <div className="mt-3 text-xs text-red-600 dark:text-red-400">
              <p>• Account ID: {user?.account_id}</p>
              <p>• Email: {user?.email}</p>
              <p>• Role: {user?.role}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Deleting...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Delete User
              </div>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
