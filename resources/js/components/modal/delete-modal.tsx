"use client"

import { toast } from "sonner"
import { Trash2, AlertTriangle, Unlink } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog"
import { router } from "@inertiajs/react"

type ActionType = "delete" | "remove"

interface ActionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  id: number
  title: string
  routeLink: string
  description: string
  toastMessage: string
  buttonTitle: string
  type: ActionType
  additionalInfo?: string[]
}

export default function DeleteModal({
  open,
  onOpenChange,
  id,
  title,
  routeLink,
  description,
  toastMessage,
  buttonTitle,
  type,
  additionalInfo = [],
}: ActionModalProps) {
  const handleAction = () => {
    console.log(`${type === 'delete' ? 'Deleting' : 'Removing'}:`, id)

    router.delete(route(routeLink, id), {
      preserveScroll: true,
      onSuccess: () => {
        router.reload()
      },
    })

    toast.info(toastMessage)
    onOpenChange(false)
  }

  const styles = {
    delete: {
      icon: AlertTriangle,
      iconBg: "bg-red-100 dark:bg-red-900/20",
      iconColor: "text-red-600 dark:text-red-400",
      border: "border-red-200 dark:border-red-800/30",
      bg: "bg-red-50 dark:bg-red-900/10",
      text: "text-red-800 dark:text-red-200",
      textSecondary: "text-red-700 dark:text-red-300",
      button: "bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700",
      bullet: "bg-red-500",
    },
    remove: {
      icon: Unlink,
      iconBg: "bg-amber-100 dark:bg-amber-900/20",
      iconColor: "text-amber-600 dark:text-amber-400",
      border: "border-amber-200 dark:border-amber-800/30",
      bg: "bg-amber-50 dark:bg-amber-900/10",
      text: "text-amber-800 dark:text-amber-200",
      textSecondary: "text-amber-700 dark:text-amber-300",
      button: "bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-700",
      bullet: "bg-amber-500",
    },
  }

  const currentStyle = styles[type]
  const Icon = currentStyle.icon

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="space-y-4">
          <div className="flex items-start gap-4">
            <div className={`flex items-center justify-center w-12 h-12 ${currentStyle.iconBg} rounded-full flex-shrink-0`}>
              <Icon className={`w-6 h-6 ${currentStyle.iconColor}`} />
            </div>
            <div className="flex-1">
              <AlertDialogTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {title}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                {description}
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <div className="my-4">
          <div className={`rounded-lg border ${currentStyle.border} ${currentStyle.bg} p-4`}>
            <div className="space-y-3">
              {additionalInfo.map((info, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className={`w-2 h-2 ${currentStyle.bullet} rounded-full mt-2`}></div>
                  </div>
                  <p className={`text-sm ${index === 0 ? 'font-medium ' + currentStyle.text : currentStyle.textSecondary}`}>
                    {info}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <AlertDialogFooter className="gap-2 sm:gap-2">
          <AlertDialogCancel className="flex-1 sm:flex-none">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleAction}
            className={`flex-1 sm:flex-none ${currentStyle.button} text-white focus:ring-2 focus:ring-offset-2 gap-2 font-medium`}
          >
            {type === 'delete' ? (
              <Trash2 className="h-4 w-4" />
            ) : (
              <Unlink className="h-4 w-4" />
            )}
            {buttonTitle}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}